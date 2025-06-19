
import React, { createContext, useContext, ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';

interface DatabaseOptimizerContextType {
  prefetchQuery: (key: string[], queryFn: () => Promise<any>) => void;
  invalidateQueries: (key: string[]) => void;
  getCachedData: (key: string[]) => any;
}

const DatabaseOptimizerContext = createContext<DatabaseOptimizerContextType | undefined>(undefined);

interface DatabaseOptimizerProviderProps {
  children: ReactNode;
  queryClient: QueryClient;
}

export const DatabaseOptimizerProvider: React.FC<DatabaseOptimizerProviderProps> = ({
  children,
  queryClient
}) => {
  const prefetchQuery = async (key: string[], queryFn: () => Promise<any>) => {
    // Only prefetch if not already cached
    const cachedData = queryClient.getQueryData(key);
    if (!cachedData) {
      await queryClient.prefetchQuery({
        queryKey: key,
        queryFn,
        staleTime: 1000 * 60 * 5, // 5 minutes
      });
    }
  };

  const invalidateQueries = (key: string[]) => {
    queryClient.invalidateQueries({ queryKey: key });
  };

  const getCachedData = (key: string[]) => {
    return queryClient.getQueryData(key);
  };

  const value = {
    prefetchQuery,
    invalidateQueries,
    getCachedData,
  };

  return (
    <DatabaseOptimizerContext.Provider value={value}>
      {children}
    </DatabaseOptimizerContext.Provider>
  );
};

export const useDatabaseOptimizer = () => {
  const context = useContext(DatabaseOptimizerContext);
  if (!context) {
    throw new Error('useDatabaseOptimizer must be used within a DatabaseOptimizerProvider');
  }
  return context;
};
