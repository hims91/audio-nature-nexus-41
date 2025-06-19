
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/ecommerce';

// Hook for customer order history
export const useCustomerOrders = () => {
  return useQuery({
    queryKey: ['customer-orders'],
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
};

// Hook for single customer order
export const useCustomerOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['customer-order', orderId],
    queryFn: async (): Promise<Order | null> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*),
          discount_code_details:discount_codes(*)
        `)
        .eq('id', orderId)
        .eq('user_id', user.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data as Order;
    },
    enabled: !!orderId,
  });
};
