
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, MapPin, Clock, ExternalLink, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import FadeInView from '@/components/animations/FadeInView';

const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-tracking', id],
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
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Order Not Found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find an order with that ID.
                </p>
                <Button asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
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

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Package },
      { key: 'processing', label: 'Processing', icon: Clock },
      { key: 'shipped', label: 'Shipped', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: MapPin },
    ];

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const steps = getStatusSteps();

  return (
    <>
      <Helmet>
        <title>Track Order #{order.order_number} - Terra Echo Studios</title>
        <meta name="description" content={`Track your Terra Echo Studios order ${order.order_number}`} />
      </Helmet>

      <UnifiedNavbar />
      
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <FadeInView direction="up">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/orders">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      All Orders
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
                      Track Order #{order.order_number}
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

              {/* Progress Tracker */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Order Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.key} className="flex flex-col items-center flex-1">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center mb-2
                            ${step.completed 
                              ? 'bg-green-500 text-white' 
                              : step.current 
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-400'
                            }
                          `}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className={`text-sm font-medium ${
                            step.completed || step.current ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </span>
                          {index < steps.length - 1 && (
                            <div className={`
                              hidden sm:block absolute w-full h-0.5 top-6 left-1/2
                              ${step.completed ? 'bg-green-500' : 'bg-gray-200'}
                            `} style={{ zIndex: -1 }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Status-specific information */}
                  {order.status === 'shipped' && order.tracking_number && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Tracking Information</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Tracking Number:</strong> {order.tracking_number}
                      </p>
                      {order.tracking_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Track with Carrier
                          </a>
                        </Button>
                      )}
                    </div>
                  )}

                  {order.status === 'delivered' && order.delivered_at && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Delivered Successfully!</h4>
                      <p className="text-sm text-gray-600">
                        Delivered on {new Date(order.delivered_at).toLocaleDateString()} at {new Date(order.delivered_at).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            {item.variant_name && (
                              <p className="text-sm text-gray-600">{item.variant_name}</p>
                            )}
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">
                            {formatPrice(item.total_price_cents)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span>{formatPrice(order.total_cents)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">Delivery Address</h4>
                      <p className="text-sm text-gray-600">
                        {order.shipping_first_name} {order.shipping_last_name}<br />
                        {order.shipping_address_line1}<br />
                        {order.shipping_address_line2 && <>{order.shipping_address_line2}<br /></>}
                        {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                      </p>
                    </div>

                    {order.shipped_at && (
                      <div>
                        <h4 className="font-medium">Shipped Date</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(order.shipped_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium">Estimated Delivery</h4>
                      <p className="text-sm text-gray-600">
                        {order.status === 'delivered' 
                          ? 'Delivered' 
                          : '3-7 business days from ship date'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Support */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Questions about your order?
                </p>
                <Button variant="link" asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </FadeInView>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default OrderTrackingPage;
