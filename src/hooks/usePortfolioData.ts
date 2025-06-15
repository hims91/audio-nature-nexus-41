
import { usePortfolioQueries } from "./usePortfolioQueries";
import { usePortfolioMutations } from "./usePortfolioMutations";
import { usePortfolioRealtime } from "./usePortfolioRealtime";

export const usePortfolioData = () => {
  const queryResults = usePortfolioQueries();
  const mutations = usePortfolioMutations();
  
  // Set up real-time subscription
  usePortfolioRealtime();

  return {
    ...queryResults,
    ...mutations
  };
};
