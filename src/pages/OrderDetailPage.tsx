
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, ShoppingCart, Clock } from 'lucide-react';
import { useCustomerOrder } from '@/hooks/useCustomerOrders';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import FadeInView from '@/components/animations/FadeInView';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import SEOManager from '@/components/SEO/SEOManager';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: Package },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: Package },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: Package },
};

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useCustomerOrder(orderId!);
  const { addToCart } = useCart();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReorder = () => {
    if (!order?.items) return;
    
    order.items.forEach(item => {
      addToCart({
        productId: item.product_id,
        variantId: item.variant_id || undefined,
        quantity: item.quantity,
      });
    });
  };

  if (isLoading) {
    return (
      <>
        <UnifiedNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <UnifiedNavbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-red-600">Order not found or you don't have permission to view it.</p>
              <Button asChild className="mt-4">
                <Link to="/orders">Back to Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = statusInfo?.icon || Package;

  return (
    <>
      <SEOManager
        title={`Order #${order.order_number}`}
        description="View your order details and tracking information."
        url={`${window.location.origin}/orders/${order.id}`}
      />
      <UnifiedNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <FadeInView direction="up">
            <div className="mb-6">
              <Button variant="outline" asChild className="mb-4">
                <Link to="/orders">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Link>
              </Button>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
                    Order #{order.order_number}
                  </h1>
                  <p className="text-nature-bark dark:text-gray-300">
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={statusInfo?.color || 'bg-gray-100 text-gray-800'}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo?.label || order.status}
                  </Badge>
                  <Button onClick={handleReorder} variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Reorder
                  </Button>
                </div>
              </div>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <FadeInView direction="up" delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items?.map((item, index) => (
                        <div key={item.id}>
                          {index > 0 && <Separator />}
                          <div className="flex justify-between items-start py-4">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product_name}</h4>
                              {item.variant_name && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.variant_name}
                                </p>
                              )}
                              {item.sku && (
                                <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                              )}
                              <p className="text-sm font-medium mt-1">
                                Qty: {item.quantity} × {formatPrice(item.unit_price_cents)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatPrice(item.total_price_cents)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeInView>

              {/* Tracking Information */}
              {order.tracking_number && (
                <FadeInView direction="up" delay={0.2}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Truck className="h-5 w-5 mr-2" />
                        Tracking Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Tracking Number
                          </p>
                          <p className="text-lg font-mono">{order.tracking_number}</p>
                        </div>
                        {order.tracking_url && (
                          <Button asChild variant="outline" className="w-full">
                            <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">
                              <Truck className="h-4 w-4 mr-2" />
                              Track Package
                            </a>
                          </Button>
                        )}
                        {order.shipped_at && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Shipped At
                            </p>
                            <p>{formatDate(order.shipped_at)}</p>
                          </div>
                        )}
                        {order.delivered_at && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Delivered At
                            </p>
                            <p>{formatDate(order.delivered_at)}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </FadeInView>
              )}
            </div>

            {/* Order Summary & Details */}
            <div className="space-y-6">
              {/* Order Summary */}
              <FadeInView direction="up" delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal_cents)}</span>
                    </div>
                    {order.shipping_cents > 0 && (
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{formatPrice(order.shipping_cents)}</span>
                      </div>
                    )}
                    {order.tax_cents > 0 && (
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(order.tax_cents)}</span>
                      </div>
                    )}
                    {order.discount_cents > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(order.discount_cents)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(order.total_cents)}</span>
                    </div>
                  </CardContent>
                </Card>
              </FadeInView>

              {/* Shipping Address */}
              <FadeInView direction="up" delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {order.shipping_first_name} {order.shipping_last_name}
                      </p>
                      <p>{order.shipping_address_line1}</p>
                      {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                      <p>
                        {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                      </p>
                      <p>{order.shipping_country}</p>
                      {order.shipping_phone && <p>{order.shipping_phone}</p>}
                    </div>
                  </CardContent>
                </Card>
              </FadeInView>

              {/* Payment Information */}
              <FadeInView direction="up" delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Payment Status</span>
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                          {order.payment_status}
                        </Badge>
                      </div>
                      {order.payment_method && (
                        <div className="flex justify-between">
                          <span>Payment Method</span>
                          <span className="capitalize">{order.payment_method}</span>
                        </div>
                      )}
                      {order.discount_code && (
                        <div className="flex justify-between">
                          <span>Discount Code</span>
                          <span className="font-mono">{order.discount_code}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeInView>

              {/* Customer Notes */}
              {order.customer_notes && (
                <FadeInView direction="up" delay={0.4}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300">{order.customer_notes}</p>
                    </CardContent>
                  </Card>
                </FadeInView>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetailPage;
