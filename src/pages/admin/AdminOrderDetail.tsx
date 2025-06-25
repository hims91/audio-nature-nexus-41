
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, User, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import FadeInView from '@/components/animations/FadeInView';
import OrderShippingManager from '@/components/admin/OrderShippingManager';
import { Order } from '@/types/ecommerce';

const AdminOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Order;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <Button asChild>
          <Link to="/admin/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <FadeInView direction="up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
                Order #{order.order_number}
              </h1>
              <p className="text-nature-bark dark:text-gray-300 mt-2">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-white`}>
            {order.status.toUpperCase()}
          </Badge>
        </div>
      </FadeInView>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <FadeInView direction="up" delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.product_name}</h4>
                        {item.variant_name && (
                          <p className="text-sm text-gray-600">{item.variant_name}</p>
                        )}
                        {item.sku && (
                          <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {item.quantity} × {formatPrice(item.unit_price_cents)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: {formatPrice(item.total_price_cents)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeInView>

          {/* Shipping Manager */}
          <FadeInView direction="up" delay={0.2}>
            <OrderShippingManager order={order} onOrderUpdate={refetch} />
          </FadeInView>
        </div>

        {/* Order Summary & Customer Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <FadeInView direction="up" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{order.shipping_first_name} {order.shipping_last_name}</p>
                  <p className="text-sm text-gray-600">{order.email}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Shipping Address:</p>
                  <p className="text-sm text-gray-600">
                    {order.shipping_address_line1}<br />
                    {order.shipping_address_line2 && <>{order.shipping_address_line2}<br /></>}
                    {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeInView>

          {/* Payment Information */}
          <FadeInView direction="up" delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(order.subtotal_cents)}</span>
                </div>
                {order.shipping_cents && order.shipping_cents > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{formatPrice(order.shipping_cents)}</span>
                  </div>
                )}
                {order.tax_cents && order.tax_cents > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatPrice(order.tax_cents)}</span>
                  </div>
                )}
                {order.discount_cents && order.discount_cents > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatPrice(order.discount_cents)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatPrice(order.total_cents)}</span>
                </div>
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                  Payment {order.payment_status}
                </Badge>
              </CardContent>
            </Card>
          </FadeInView>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
