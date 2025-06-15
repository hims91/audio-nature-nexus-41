
import { usePortfolioItems, useFeaturedPortfolioItems, usePortfolioItemsByCategory } from "./usePortfolioQueries";
import { usePortfolioMutations } from "./usePortfolioMutations";
import { usePortfolioRealtime } from "./usePortfolioRealtime";

export const usePortfolioData = () => {
  const portfolioItemsQuery = usePortfolioItems();
  const featuredItemsQuery = useFeaturedPortfolioItems();
  const mutations = usePortfolioMutations();
  
  // Set up real-time subscription
  usePortfolioRealtime();

  return {
    portfolioItems: portfolioItemsQuery.data || [],
    featuredItems: featuredItemsQuery.data || [],
    isLoading: portfolioItemsQuery.isLoading || featuredItemsQuery.isLoading,
    error: portfolioItemsQuery.error || featuredItemsQuery.error,
    refetch: () => {
      portfolioItemsQuery.refetch();
      featuredItemsQuery.refetch();
    },
    usePortfolioItemsByCategory,
    ...mutations
  };
};
