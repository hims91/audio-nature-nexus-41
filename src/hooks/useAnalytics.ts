
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DiscountAnalytics {
  code: string;
  usage_count: number;
  total_discount_given: number;
  total_orders: number;
  revenue_generated: number;
  conversion_rate: number;
}

interface InventoryAlert {
  product_id: string;
  product_name: string;
  current_stock: number;
  reorder_point: number;
  variant_id?: string;
  variant_name?: string;
}

// Hook for discount code performance analytics
export const useDiscountAnalytics = (dateRange?: { from: string; to: string }) => {
  return useQuery({
    queryKey: ['discount-analytics', dateRange],
    queryFn: async (): Promise<DiscountAnalytics[]> => {
      let query = supabase
        .from('orders')
        .select(`
          discount_code,
          discount_cents,
          total_cents,
          discount_codes!inner(code, usage_count)
        `)
        .not('discount_code', 'is', null)
        .eq('payment_status', 'paid');

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Aggregate discount performance
      const discountMap = new Map<string, DiscountAnalytics>();
      
      data?.forEach((order) => {
        const code = order.discount_code!;
        const existing = discountMap.get(code) || {
          code,
          usage_count: 0,
          total_discount_given: 0,
          total_orders: 0,
          revenue_generated: 0,
          conversion_rate: 0,
        };

        existing.total_orders += 1;
        existing.total_discount_given += order.discount_cents || 0;
        existing.revenue_generated += order.total_cents || 0;
        
        discountMap.set(code, existing);
      });

      return Array.from(discountMap.values());
    },
  });
};

// Hook for low inventory alerts
export const useLowInventoryAlerts = (threshold: number = 10) => {
  return useQuery({
    queryKey: ['low-inventory-alerts', threshold],
    queryFn: async (): Promise<InventoryAlert[]> => {
      // Check products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, inventory_quantity, track_inventory')
        .eq('is_active', true)
        .eq('track_inventory', true)
        .lte('inventory_quantity', threshold);

      if (productsError) throw productsError;

      // Check variants
      const { data: variants, error: variantsError } = await supabase
        .from('product_variants')
        .select(`
          id, 
          name, 
          inventory_quantity,
          products!inner(id, name, track_inventory)
        `)
        .eq('is_active', true)
        .lte('inventory_quantity', threshold);

      if (variantsError) throw variantsError;

      const alerts: InventoryAlert[] = [];

      // Add product alerts
      products?.forEach((product) => {
        alerts.push({
          product_id: product.id,
          product_name: product.name,
          current_stock: product.inventory_quantity,
          reorder_point: threshold,
        });
      });

      // Add variant alerts
      variants?.forEach((variant) => {
        const product = Array.isArray(variant.products) 
          ? variant.products[0] 
          : variant.products;
        
        if (product?.track_inventory) {
          alerts.push({
            product_id: product.id,
            product_name: product.name,
            current_stock: variant.inventory_quantity,
            reorder_point: threshold,
            variant_id: variant.id,
            variant_name: variant.name,
          });
        }
      });

      return alerts.sort((a, b) => a.current_stock - b.current_stock);
    },
  });
};

// Hook for sales analytics
export const useSalesAnalytics = (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
  return useQuery({
    queryKey: ['sales-analytics', period],
    queryFn: async () => {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarterStart = Math.floor(now.getMonth() / 3) * 3;
          startDate = new Date(now.getFullYear(), quarterStart, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          total_cents,
          created_at,
          status,
          payment_status,
          items:order_items(quantity, total_price_cents)
        `)
        .gte('created_at', startDate.toISOString())
        .eq('payment_status', 'paid');

      if (error) throw error;

      const totalRevenue = data?.reduce((sum, order) => sum + order.total_cents, 0) || 0;
      const totalOrders = data?.length || 0;
      const totalItems = data?.reduce((sum, order) => 
        sum + (order.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0), 0
      ) || 0;

      return {
        totalRevenue,
        totalOrders,
        totalItems,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
      };
    },
  });
};
