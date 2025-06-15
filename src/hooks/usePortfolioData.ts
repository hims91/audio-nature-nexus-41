
import { usePortfolioItems, useFeaturedPortfolioItems, usePortfolioItemsByCategory } from "./usePortfolioQueries";
import { usePortfolioMutations } from "./usePortfolioMutations";

export const usePortfolioData = () => {
  const portfolioItemsQuery = usePortfolioItems();
  const featuredItemsQuery = useFeaturedPortfolioItems();
  const mutations = usePortfolioMutations();
  
  // Real-time subscription is now handled within usePortfolioItems

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
