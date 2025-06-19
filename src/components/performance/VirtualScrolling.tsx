
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface VirtualScrollingProps<T> {
  items: T[];
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => Promise<void>;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  height?: number;
  className?: string;
}

function VirtualScrolling<T>({
  items,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  renderItem,
  itemHeight = 200,
  height = 600,
  className = ''
}: VirtualScrollingProps<T>) {
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total items including loading placeholders
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Check if item is loaded
  const isItemLoaded = useCallback((index: number) => {
    return index < items.length;
  }, [items.length]);

  // Load more items
  const loadMoreItems = useCallback(async () => {
    if (isLoading || !hasNextPage) return;
    
    setIsLoading(true);
    try {
      await loadNextPage();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, loadNextPage]);

  // Item renderer
  const ItemRenderer = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    
    if (!item) {
      // Loading placeholder
      return (
        <div style={style} className="p-2">
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div style={style} className="p-2">
        {renderItem(item, index)}
      </div>
    );
  }, [items, renderItem]);

  // Memoize the list component
  const VirtualList = useMemo(() => (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          ref={ref}
          height={height}
          itemCount={itemCount}
          itemSize={itemHeight}
          onItemsRendered={onItemsRendered}
          className={className}
        >
          {ItemRenderer}
        </List>
      )}
    </InfiniteLoader>
  ), [isItemLoaded, itemCount, loadMoreItems, height, itemHeight, className, ItemRenderer]);

  return VirtualList;
}

export default VirtualScrolling;
