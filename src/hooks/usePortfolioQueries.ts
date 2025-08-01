
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDBToPortfolioItem, type PortfolioItem, type PortfolioItemDB } from "@/types/portfolio";

export const usePortfolioQueries = () => {
  const { data: portfolioItems = [], isLoading, error, refetch, isFetched } = useQuery({
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
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const { data: featuredItems = [], isLoading: isFeaturedLoading } = useQuery({
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
    enabled: !isLoading && isFetched, // Only fetch featured items after main items are fetched
    retry: 2,
    staleTime: 1000 * 60 * 3, // 3 minutes for featured items
    gcTime: 1000 * 60 * 8, // 8 minutes
  });

  const isInitialLoading = isLoading && !isFetched;
  const isAnyLoading = isLoading || isFeaturedLoading;

  return {
    portfolioItems,
    featuredItems,
    isLoading: isAnyLoading,
    isInitialLoading,
    error,
    refetch
  };
};
