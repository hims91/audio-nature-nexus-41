
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface EnhancedDashboardStats {
  total_orders: number;
  total_spent_cents: number;
  pending_orders: number;
  recent_orders: number;
  last_order_date: string | null;
}

export const useEnhancedDashboardStats = () => {
  const [realTimeStats, setRealTimeStats] = useState<Partial<EnhancedDashboardStats>>({});

  const statsQuery = useQuery({
    queryKey: ['enhanced-dashboard-stats'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_user_order_summary', {
        p_user_id: user.user.id
      });

      if (error) throw error;
      return data as EnhancedDashboardStats;
    },
  });

  // Set up real-time subscription for order changes
  useEffect(() => {
    const channel = supabase
      .channel('user-orders-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Order change detected:', payload);
          // Refetch stats when orders change
          statsQuery.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statsQuery]);

  return {
    stats: { ...statsQuery.data, ...realTimeStats },
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
  };
};
