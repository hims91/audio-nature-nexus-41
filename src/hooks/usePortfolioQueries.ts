
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDBToPortfolioItem, type PortfolioItem, type PortfolioItemDB } from "@/types/portfolio";

export const usePortfolioQueries = () => {
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

  return {
    portfolioItems,
    featuredItems,
    isLoading,
    error,
    refetch
  };
};
