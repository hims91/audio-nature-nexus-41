
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface DiscountUsageStats {
  total_codes: number;
  active_codes: number;
  total_usage: number;
  total_discount_given: number;
  top_performing_codes: Array<{
    code: string;
    usage_count: number;
    total_discount: number;
  }>;
}

export const useDiscountAnalytics = () => {
  const [realTimeStats, setRealTimeStats] = useState<DiscountUsageStats | null>(null);

  const analyticsQuery = useQuery({
    queryKey: ['discount-analytics'],
    queryFn: async (): Promise<DiscountUsageStats> => {
      // Get basic stats
      const { data: codes, error: codesError } = await supabase
        .from('discount_codes')
        .select('*');

      if (codesError) throw codesError;

      // Get usage from orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('discount_code, discount_cents, discount_code_id')
        .not('discount_code', 'is', null)
        .eq('payment_status', 'paid');

      if (ordersError) throw ordersError;

      const totalCodes = codes?.length || 0;
      const activeCodes = codes?.filter(code => code.is_active).length || 0;
      const totalUsage = orders?.length || 0;
      const totalDiscountGiven = orders?.reduce((sum, order) => sum + (order.discount_cents || 0), 0) || 0;

      // Calculate top performing codes
      const codeStats = new Map<string, { usage: number; discount: number }>();
      orders?.forEach(order => {
        if (order.discount_code) {
          const existing = codeStats.get(order.discount_code) || { usage: 0, discount: 0 };
          existing.usage += 1;
          existing.discount += order.discount_cents || 0;
          codeStats.set(order.discount_code, existing);
        }
      });

      const topPerformingCodes = Array.from(codeStats.entries())
        .map(([code, stats]) => ({
          code,
          usage_count: stats.usage,
          total_discount: stats.discount,
        }))
        .sort((a, b) => b.usage_count - a.usage_count)
        .slice(0, 5);

      return {
        total_codes: totalCodes,
        active_codes: activeCodes,
        total_usage: totalUsage,
        total_discount_given: totalDiscountGiven,
        top_performing_codes: topPerformingCodes,
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Set up real-time subscription for discount code updates
  useEffect(() => {
    const channel = supabase
      .channel('discount-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'discount_codes',
        },
        () => {
          analyticsQuery.refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: 'discount_code=not.is.null',
        },
        () => {
          analyticsQuery.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [analyticsQuery]);

  return {
    stats: realTimeStats || analyticsQuery.data,
    isLoading: analyticsQuery.isLoading,
    error: analyticsQuery.error,
  };
};
