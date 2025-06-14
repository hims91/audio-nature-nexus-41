
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'];
type PortfolioItemInsert = Database['public']['Tables']['portfolio_items']['Insert'];
type PortfolioItemUpdate = Database['public']['Tables']['portfolio_items']['Update'];

export const usePortfolioData = () => {
  const queryClient = useQueryClient();

  const { data: portfolioItems = [], isLoading } = useQuery({
    queryKey: ['portfolio-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PortfolioItem[];
    }
  });

  const { data: featuredItems = [] } = useQuery({
    queryKey: ['featured-portfolio-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as PortfolioItem[];
    }
  });

  const createPortfolioItem = useMutation({
    mutationFn: async (item: PortfolioItemInsert) => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
    }
  });

  const updatePortfolioItem = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PortfolioItemUpdate }) => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
    }
  });

  const deletePortfolioItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['featured-portfolio-items'] });
    }
  });

  return {
    portfolioItems,
    featuredItems,
    isLoading,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  };
};
