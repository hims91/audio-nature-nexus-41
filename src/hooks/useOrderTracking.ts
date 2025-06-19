
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/ecommerce';

// Real-time order tracking hook
export const useOrderTracking = (orderId: string) => {
  const [realTimeOrder, setRealTimeOrder] = useState<Order | null>(null);

  const orderQuery = useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: async (): Promise<Order | null> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          discount_code_details:discount_codes(*)
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data as Order;
    },
    enabled: !!orderId,
  });

  // Set up real-time subscription for order updates
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel('order-tracking')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          console.log('Order updated:', payload);
          setRealTimeOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return {
    order: realTimeOrder || orderQuery.data,
    isLoading: orderQuery.isLoading,
    error: orderQuery.error,
  };
};

// Hook for tracking multiple orders (customer order history with real-time updates)
export const useCustomerOrdersTracking = () => {
  const [realTimeUpdates, setRealTimeUpdates] = useState<Record<string, Order>>({});

  const ordersQuery = useQuery({
    queryKey: ['customer-orders-tracking'],
    queryFn: async (): Promise<Order[]> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          discount_code_details:discount_codes(*)
        `)
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Order[];
    },
  });

  // Set up real-time subscription for all user orders
  useEffect(() => {
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const channel = supabase
        .channel('customer-orders-tracking')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Customer order updated:', payload);
            setRealTimeUpdates(prev => ({
              ...prev,
              [payload.new.id]: payload.new as Order
            }));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtime();
  }, []);

  // Merge real-time updates with original data
  const ordersWithRealTimeUpdates = ordersQuery.data?.map(order => 
    realTimeUpdates[order.id] || order
  ) || [];

  return {
    orders: ordersWithRealTimeUpdates,
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
  };
};
