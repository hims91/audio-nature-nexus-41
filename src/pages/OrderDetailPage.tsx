
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomerOrder } from '@/hooks/useCustomerOrders';
import { usePaymentRetry } from '@/hooks/usePaymentRetry';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Package, CreditCard, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
};

const paymentStatusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
};

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useCustomerOrder(orderId!);
  const { retryPayment, isRetrying, canRetry } = usePaymentRetry();

  const handlePaymentRetry = async () => {
    if (!order) return;
    
    try {
      const result = await retryPayment(order.id, order.stripe_session_id);
      if (result?.retry_url) {
        // Redirect to new payment session
        window.location.href = result.retry_url;
      }
    } catch (error) {
      toast.error('Failed to retry payment. Please contact support.');
    }
  };

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

  if (error || !order) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <Card className="text-center py-12">
              <CardContent>
                <h2 className="text-2xl font-semibold mb-4">Order not found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  The order you're looking for doesn't exist or you don't have permission to view it.
                </p>
                <Button asChild>
                  <Link to="/orders">Back to Orders</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
  const paymentInfo = paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig];

  return (
    <>
      <UnifiedNavbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link to="/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
                Order {order.order_number}
              </h1>
              <p className="text-nature-bark dark:text-gray-300">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Order Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Badge className={statusInfo?.color}>
                        {statusInfo?.label || order.status}
                      </Badge>
                      <Badge className={paymentInfo?.color}>
                        {paymentInfo?.label || order.payment_status}
                      </Badge>
                    </div>
                    {order.payment_status === 'failed' && canRetry && (
                      <Button 
                        onClick={handlePaymentRetry}
                        disabled={isRetrying}
                        size="sm"
                        variant="outline"
                      >
                        {isRetrying ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Retrying...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Retry Payment
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {order.tracking_number && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium mb-2">Tracking Information</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tracking Number: <span className="font-mono">{order.tracking_number}</span>
                      </p>
                      {order.tracking_url && (
                        <Button asChild size="sm" className="mt-2">
                          <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">
                            Track Package
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product_name}</h4>
                          {item.variant_name && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.variant_name}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.total_price_cents)}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatPrice(item.unit_price_cents)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              {(order.shipping_first_name || order.shipping_address_line1) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">
                        {order.shipping_first_name} {order.shipping_last_name}
                      </p>
                      <p>{order.shipping_address_line1}</p>
                      {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                      <p>
                        {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                      </p>
                      <p>{order.shipping_country}</p>
                      {order.shipping_phone && <p>Phone: {order.shipping_phone}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(order.subtotal_cents)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>{formatPrice(order.shipping_cents)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax:</span>
                      <span>{formatPrice(order.tax_cents)}</span>
                    </div>
                    {order.discount_cents > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount:</span>
                        <span>-{formatPrice(order.discount_cents)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>{formatPrice(order.total_cents)}</span>
                    </div>
                  </div>

                  {order.customer_notes && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-2">Order Notes</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.customer_notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetailPage;
