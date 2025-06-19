
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminProductsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to product changes
    const productChannel = supabase
      .channel('admin-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Product change detected:', payload);
          
          // Invalidate and refetch admin products queries
          queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          queryClient.invalidateQueries({ queryKey: ['product-stats'] });
          
          // If it's a single product update, also invalidate that specific product
          if (payload.new?.id) {
            queryClient.invalidateQueries({ queryKey: ['admin-product', payload.new.id] });
          }
        }
      )
      .subscribe();

    // Subscribe to category changes
    const categoryChannel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_categories'
        },
        () => {
          console.log('Category change detected');
          queryClient.invalidateQueries({ queryKey: ['categories'] });
          queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          queryClient.invalidateQueries({ queryKey: ['product-stats'] });
        }
      )
      .subscribe();

    // Subscribe to inventory changes
    const inventoryChannel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_logs'
        },
        () => {
          console.log('Inventory change detected');
          queryClient.invalidateQueries({ queryKey: ['admin-products'] });
          queryClient.invalidateQueries({ queryKey: ['product-stats'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(productChannel);
      supabase.removeChannel(categoryChannel);
      supabase.removeChannel(inventoryChannel);
    };
  }, [queryClient]);
};
