
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { mapDBToPortfolioItem, mapPortfolioItemToDB, type PortfolioItem, type PortfolioItemDB } from "@/types/portfolio";

type PortfolioItemInsert = Database['public']['Tables']['portfolio_items']['Insert'];
type PortfolioItemUpdate = Database['public']['Tables']['portfolio_items']['Update'];

export const usePortfolioData = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  const { data: portfolioItems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['portfolio-items'],
    queryFn: async (): Promise<PortfolioItem[]> => {
      console.log('🔍 Fetching portfolio items from Supabase...');
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching portfolio items:', error);
        throw error;
      }
      
      console.log(`✅ Successfully fetched ${data.length} portfolio items`);
      return data.map(mapDBToPortfolioItem);
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });

  const { data: featuredItems = [] } = useQuery({
    queryKey: ['featured-portfolio-items'],
    queryFn: async (): Promise<PortfolioItem[]> => {
      console.log('🔍 Fetching featured portfolio items...');
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) {
        console.error('❌ Error fetching featured items:', error);
        throw error;
      }
      
      console.log(`✅ Successfully fetched ${data.length} featured items`);
      return data.map(mapDBToPortfolioItem);
    },
    enabled: !isLoading,
    retry: 3,
    staleTime: 1000 * 60 * 3, // 3 minutes for featured items
    gcTime: 1000 * 60 * 8, // 8 minutes
  });

  // Enhanced real-time subscription with proper cleanup
  useEffect(() => {
    console.log('🔄 Setting up real-time subscription for portfolio items...');
    
    // Clean up any existing channel
    if (channelRef.current) {
      console.log('🧹 Cleaning up existing channel...');
      supabase.removeChannel(channelRef.current);
    }
    
    const channel = supabase
      .channel(`portfolio-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_items'
        },
        (payload) => {
          console.log('📡 Real-time update received:', payload.eventType, payload);
          
          // Optimistic updates for better UX
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) {
                const newItem = mapDBToPortfolioItem(payload.new as PortfolioItemDB);
                queryClient.setQueryData(['portfolio-items'], (old: PortfolioItem[] = []) => 
                  [newItem, ...old]
                );
                if (newItem.featured) {
                  queryClient.setQueryData(['featured-portfolio-items'], (old: PortfolioItem[] = []) => 
                    [newItem, ...old.slice(0, 5)]
                  );
                }
              }
              break;
            case 'UPDATE':
              if (payload.new) {
                const updatedItem = mapDBToPortfolioItem(payload.new as PortfolioItemDB);
                queryClient.setQueryData(['portfolio-items'], (old: PortfolioItem[] = []) => 
                  old.map(item => item.id === updatedItem.id ? updatedItem : item)
                );
                queryClient.setQueryData(['featured-portfolio-items'], (old: PortfolioItem[] = []) => 
                  old.map(item => item.id === updatedItem.id ? updatedItem : item)
                );
              }
              break;
            case 'DELETE':
              if (payload.old) {
                const deletedId = payload.old.id;
                queryClient.setQueryData(['portfolio-items'], (old: PortfolioItem[] = []) => 
                  old.filter(item => item.id !== deletedId)
                );
                queryClient.setQueryData(['featured-portfolio-items'], (old: PortfolioItem[] = []) => 
                  old.filter(item => item.id !== deletedId)
                );
              }
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      console.log('🔄 Cleaning up real-time subscription...');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);

  const createPortfolioItem = useMutation({
    mutationFn: async (item: Partial<PortfolioItem>) => {
      console.log('📝 Creating new portfolio item:', item.title);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const dbItem = mapPortfolioItemToDB({
        ...item,
        userId: item.userId || user.id
      });
      
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert(dbItem)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error creating portfolio item:', error);
        throw error;
      }
      
      console.log('✅ Portfolio item created successfully:', data.id);
      return mapDBToPortfolioItem(data);
    },
    onSuccess: (newItem) => {
      // Optimistic update is handled by real-time subscription
      console.log('✅ Portfolio item creation successful');
    },
    onError: (error) => {
      console.error('❌ Failed to create portfolio item:', error);
      // Invalidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
    }
  });

  const updatePortfolioItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PortfolioItem> }) => {
      console.log('🔄 Updating portfolio item:', id);
      
      const dbUpdates: PortfolioItemUpdate = {
        title: updates.title,
        client: updates.client,
        category: updates.category,
        description: updates.description,
        cover_image_url: updates.coverImageUrl,
        audio_url: updates.audioUrl,
        video_url: updates.videoUrl,
        external_links: (updates.externalLinks || []) as any,
        featured: updates.featured
      };
      
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error updating portfolio item:', error);
        throw error;
      }
      
      console.log('✅ Portfolio item updated successfully:', id);
      return mapDBToPortfolioItem(data);
    },
    onSuccess: () => {
      // Optimistic update is handled by real-time subscription
      console.log('✅ Portfolio item update successful');
    },
    onError: (error) => {
      console.error('❌ Failed to update portfolio item:', error);
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
    }
  });

  const deletePortfolioItem = useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting portfolio item:', id);
      
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Error deleting portfolio item:', error);
        throw error;
      }
      
      console.log('✅ Portfolio item deleted successfully:', id);
    },
    onSuccess: () => {
      // Optimistic update is handled by real-time subscription
      console.log('✅ Portfolio item deletion successful');
    },
    onError: (error) => {
      console.error('❌ Failed to delete portfolio item:', error);
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
    }
  });

  return {
    portfolioItems,
    featuredItems,
    isLoading,
    error,
    refetch,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  };
};
