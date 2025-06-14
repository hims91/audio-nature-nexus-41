
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { mapDBToPortfolioItem, mapPortfolioItemToDB, type PortfolioItem, type PortfolioItemDB } from "@/types/portfolio";

type PortfolioItemInsert = Database['public']['Tables']['portfolio_items']['Insert'];
type PortfolioItemUpdate = Database['public']['Tables']['portfolio_items']['Update'];

export const usePortfolioData = () => {
  const queryClient = useQueryClient();

  const { data: portfolioItems = [], isLoading, error } = useQuery({
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
  });

  // Set up real-time subscription for portfolio updates - only once per hook instance
  useEffect(() => {
    console.log('🔄 Setting up real-time subscription for portfolio items...');
    
    const channel = supabase
      .channel(`portfolio-changes-${Date.now()}`) // Use unique channel name
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_items'
        },
        (payload) => {
          console.log('📡 Real-time update received:', payload);
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
          queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createPortfolioItem = useMutation({
    mutationFn: async (item: Partial<PortfolioItem>) => {
      console.log('📝 Creating new portfolio item:', item.title);
      
      // Ensure user_id is set if not provided
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
    },
    onError: (error) => {
      console.error('❌ Failed to create portfolio item:', error);
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
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
    },
    onError: (error) => {
      console.error('❌ Failed to update portfolio item:', error);
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
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
    },
    onError: (error) => {
      console.error('❌ Failed to delete portfolio item:', error);
    }
  });

  return {
    portfolioItems,
    featuredItems,
    isLoading,
    error,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  };
};
