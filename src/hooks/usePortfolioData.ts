
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'];
type PortfolioItemInsert = Database['public']['Tables']['portfolio_items']['Insert'];
type PortfolioItemUpdate = Database['public']['Tables']['portfolio_items']['Update'];

export const usePortfolioData = () => {
  const queryClient = useQueryClient();

  const { data: portfolioItems = [], isLoading, error } = useQuery({
    queryKey: ['portfolio-items'],
    queryFn: async () => {
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
      return data as PortfolioItem[];
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: featuredItems = [] } = useQuery({
    queryKey: ['featured-portfolio-items'],
    queryFn: async () => {
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
      return data as PortfolioItem[];
    },
    enabled: !isLoading,
    retry: 3,
  });

  const createPortfolioItem = useMutation({
    mutationFn: async (item: PortfolioItemInsert) => {
      console.log('📝 Creating new portfolio item:', item.title);
      
      // Ensure user_id is set if not provided
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const itemWithUserId = {
        ...item,
        user_id: item.user_id || user.id
      };
      
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert(itemWithUserId)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error creating portfolio item:', error);
        throw error;
      }
      
      console.log('✅ Portfolio item created successfully:', data.id);
      return data;
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
    mutationFn: async ({ id, updates }: { id: string; updates: PortfolioItemUpdate }) => {
      console.log('🔄 Updating portfolio item:', id);
      
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error updating portfolio item:', error);
        throw error;
      }
      
      console.log('✅ Portfolio item updated successfully:', id);
      return data;
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
