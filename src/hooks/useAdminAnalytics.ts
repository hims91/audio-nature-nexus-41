import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, Product } from '@/types/ecommerce';

// Performance-optimized inventory tracking hook
export const useInventoryTracking = () => {
  return useQuery({
    queryKey: ['inventory-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_logs')
        .select(`
          *,
          product:products(name, sku)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};

// Real-time low stock alerts hook
export const useLowStockAlerts = () => {
  const { data: products = [] } = useQuery({
    queryKey: ['low-stock-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, sku, inventory_quantity, track_inventory,
          images:product_images!inner(image_url, is_primary)
        `)
        .eq('track_inventory', true)
        .lte('inventory_quantity', 5)
        .eq('is_active', true)
        .order('inventory_quantity', { ascending: true });

      if (error) throw error;
      return (data || []) as any[];
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const criticalStock = useMemo(() => 
    products.filter(p => p.inventory_quantity <= 0), 
    [products]
  );
  
  const lowStock = useMemo(() => 
    products.filter(p => p.inventory_quantity > 0 && p.inventory_quantity <= 5), 
    [products]
  );

  return { criticalStock, lowStock, totalAlertsCount: products.length };
};

// Sales performance analytics hook
export const useSalesAnalytics = (period: '7d' | '30d' | '90d' = '30d') => {
  return useQuery({
    queryKey: ['sales-analytics', period],
    queryFn: async () => {
      const daysAgo = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const [ordersResult, revenueResult, topProductsResult] = await Promise.all([
        supabase
          .from('orders')
          .select('created_at, total_cents, status')
          .gte('created_at', startDate.toISOString())
          .eq('payment_status', 'paid'),
        
        supabase
          .from('order_items')
          .select('product_id, quantity, total_price_cents, product_name')
          .gte('created_at', startDate.toISOString()),
        
        supabase
          .from('order_items')
          .select('product_id, product_name, quantity, total_price_cents')
          .gte('created_at', startDate.toISOString())
      ]);

      const orders = ordersResult.data || [];
      const orderItems = revenueResult.data || [];
      const topProducts = topProductsResult.data || [];

      // Calculate metrics
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_cents, 0);
      const totalOrders = orders.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Top selling products
      const productSales = topProducts.reduce((acc, item) => {
        const key = item.product_id;
        if (!acc[key]) {
          acc[key] = {
            product_id: key,
            product_name: item.product_name,
            quantity_sold: 0,
            revenue: 0
          };
        }
        acc[key].quantity_sold += item.quantity;
        acc[key].revenue += item.total_price_cents;
        return acc;
      }, {} as Record<string, any>);

      const topSellingProducts = Object.values(productSales)
        .sort((a: any, b: any) => b.quantity_sold - a.quantity_sold)
        .slice(0, 10);

      return {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        topSellingProducts,
        period
      };
    },
    staleTime: 300000, // 5 minutes
  });
};