import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types/ecommerce';
import { toast } from 'sonner';

// Hook for admin order queries with advanced filtering
export const useAdminOrders = (filters?: {
  status?: string;
  paymentStatus?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['admin-orders', filters],
    queryFn: async (): Promise<{ orders: Order[]; total: number }> => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `, { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.paymentStatus) {
        query = query.eq('payment_status', filters.paymentStatus);
      }

      if (filters?.search) {
        query = query.or(`order_number.ilike.%${filters.search}%,email.ilike.%${filters.search}%,shipping_first_name.ilike.%${filters.search}%,shipping_last_name.ilike.%${filters.search}%`);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) throw error;
      
      return { 
        orders: (data || []) as Order[], 
        total: count || 0 
      };
    },
  });
};

// Hook for single order with admin privileges
export const useAdminOrder = (id: string) => {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: async (): Promise<Order | null> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    },
    enabled: !!id,
  });
};

// Hook for order statistics
export const useOrderStats = () => {
  return useQuery({
    queryKey: ['order-stats'],
    queryFn: async () => {
      const [ordersResult, revenueResult, pendingResult] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase
          .from('orders')
          .select('total_cents')
          .eq('payment_status', 'paid'),
        supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + order.total_cents, 0) || 0;

      return {
        totalOrders: ordersResult.count || 0,
        totalRevenue,
        pendingOrders: pendingResult.count || 0,
      };
    },
  });
};

// Hook for recent orders
export const useRecentOrders = (limit: number = 5) => {
  return useQuery({
    queryKey: ['recent-orders', limit],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
  });
};

// Hook for order mutations
export const useOrderMutations = () => {
  const queryClient = useQueryClient();

  const updateOrder = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Order> }) => {
      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-orders'] });
      toast.success('Order updated successfully');
    },
    onError: (error) => {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: Partial<Order> = { status };
      
      // Auto-update timestamps based on status
      if (status === 'shipped') {
        updates.shipped_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    },
  });

  const bulkUpdateOrders = useMutation({
    mutationFn: async (updates: { ids: string[]; updates: Partial<Order> }) => {
      const { data, error } = await supabase
        .from('orders')
        .update(updates.updates)
        .in('id', updates.ids)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
      toast.success(`${data?.length || 0} orders updated successfully`);
    },
    onError: (error) => {
      console.error('Error bulk updating orders:', error);
      toast.error('Failed to update orders');
    },
  });

  return {
    updateOrder,
    updateOrderStatus,
    bulkUpdateOrders,
  };
};