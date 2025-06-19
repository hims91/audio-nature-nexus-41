
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface UseVirtualScrollingProps<T> {
  queryKey: string[];
  queryFn: (page: number, limit: number) => Promise<{ data: T[]; hasMore: boolean }>;
  pageSize?: number;
  enabled?: boolean;
}

export const useVirtualScrolling = <T>({
  queryKey,
  queryFn,
  pageSize = 20,
  enabled = true,
}: UseVirtualScrollingProps<T>) => {
  const [pages, setPages] = useState<T[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Query for current page
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [...queryKey, currentPage],
    queryFn: () => queryFn(currentPage, pageSize),
    enabled: enabled && hasNextPage,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle successful data fetch
  useEffect(() => {
    if (data) {
      setPages(prev => {
        const newPages = [...prev];
        newPages[currentPage] = data.data;
        return newPages;
      });
      setHasNextPage(data.hasMore);
    }
  }, [data, currentPage]);

  // Flatten all loaded items
  const items = useMemo(() => {
    return pages.flat();
  }, [pages]);

  // Load next page
  const loadNextPage = useCallback(async () => {
    if (!hasNextPage || isFetching) return;
    setCurrentPage(prev => prev + 1);
  }, [hasNextPage, isFetching]);

  // Reset pagination
  const reset = useCallback(() => {
    setPages([]);
    setCurrentPage(0);
    setHasNextPage(true);
  }, []);

  return {
    items,
    hasNextPage,
    isLoading: isLoading && currentPage === 0,
    isNextPageLoading: isFetching,
    loadNextPage,
    reset,
    error,
  };
};
