
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapPortfolioItemToDB, mapDBToPortfolioItem, type PortfolioItem } from "@/types/portfolio";
import type { Database } from "@/integrations/supabase/types";

type PortfolioItemUpdate = Database['public']['Tables']['portfolio_items']['Update'];

export const usePortfolioMutations = () => {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      console.log('✅ Portfolio item creation successful');
    },
    onError: (error) => {
      console.error('❌ Failed to create portfolio item:', error);
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
      console.log('✅ Portfolio item deletion successful');
    },
    onError: (error) => {
      console.error('❌ Failed to delete portfolio item:', error);
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
    }
  });

  return {
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  };
};
