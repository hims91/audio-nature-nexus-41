
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/utils/currency';

export const useOrderNotifications = () => {
  const sendOrderConfirmation = useCallback(async (orderId: string) => {
    try {
      // Get order details with items
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      if (!order) {
        throw new Error('Order not found');
      }

      // Prepare email data
      const emailData = {
        orderId: order.id,
        customerEmail: order.email,
        customerName: `${order.shipping_first_name || order.billing_first_name || 'Customer'} ${order.shipping_last_name || order.billing_last_name || ''}`.trim(),
        orderNumber: order.order_number,
        orderTotal: formatPrice(order.total_cents),
        orderItems: order.items?.map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: formatPrice(item.unit_price_cents)
        })) || []
      };

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('order-confirmation', {
        body: emailData
      });

      if (error) throw error;

      console.log('Order confirmation sent:', data);
      return data;

    } catch (error) {
      console.error('Error sending order confirmation:', error);
      throw error;
    }
  }, []);

  const sendOrderStatusUpdate = useCallback(async (orderId: string, newStatus: string) => {
    try {
      // Get order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      console.log(`Order status updated: ${order.order_number} -> ${newStatus}`);
      
      // Here you would call your email service to send status update
      // For now, we'll just log it
      
      return { success: true };
    } catch (error) {
      console.error('Error sending order status update:', error);
      throw error;
    }
  }, []);

  return {
    sendOrderConfirmation,
    sendOrderStatusUpdate,
  };
};
