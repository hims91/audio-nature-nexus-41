import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Download, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import FadeInView from '@/components/animations/FadeInView';
import { toast } from 'sonner';

interface OrderDetails {
  id: string;
  order_number: string;
  email: string;
  status: string;
  payment_status: string;
  total_cents: number;
  created_at: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  items?: Array<{
    product_name: string;
    variant_name?: string;
    quantity: number;
    unit_price_cents: number;
  }>;
}

const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [cartCleared, setCartCleared] = useState(false);

  const sessionId = searchParams.get('session_id');

  const clearCart = async () => {
    if (cartCleared) return;
    
    try {
      console.log('Clearing cart after successful order...');
      
      // Clear cart for both authenticated and guest users
      if (user) {
        const { error } = await supabase
          .from('shopping_cart')
          .delete()
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error clearing authenticated user cart:', error);
        } else {
          console.log('Authenticated user cart cleared successfully');
        }
      }
      
      // Also clear guest cart by session_id
      const guestSessionId = localStorage.getItem('cart_session_id');
      if (guestSessionId) {
        const { error } = await supabase
          .from('shopping_cart')
          .delete()
          .eq('session_id', guestSessionId);
        
        if (error) {
          console.error('Error clearing guest cart:', error);
        } else {
          console.log('Guest cart cleared successfully');
        }
      }

      // Clear the session ID from localStorage
      localStorage.removeItem('cart_session_id');
      
      setCartCleared(true);
      console.log('Cart clearing completed');
    } catch (err) {
      console.error('Error clearing cart:', err);
      // Don't throw here - order is still successful even if cart clearing fails
    }
  };

  const fetchOrderDetails = async (retryAttempt = 0) => {
    if (!sessionId) {
      setError('No session ID provided');
      setIsLoading(false);
      return;
    }

    try {
      console.log(`Fetching order details for session: ${sessionId} (attempt ${retryAttempt + 1})`);
      
      // Try to get order by session ID with retry logic
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('stripe_session_id', sessionId)
        .single();

      if (orderError && orderError.code !== 'PGRST116') {
        throw new Error(`Database error: ${orderError.message}`);
      }

      if (!orderData) {
        // If no order found and we haven't retried too many times, wait and retry
        if (retryAttempt < 8) {
          const waitTime = Math.min(2000 * Math.pow(1.5, retryAttempt), 10000); // Max 10 seconds
          console.log(`Order not found, retrying in ${waitTime}ms...`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            fetchOrderDetails(retryAttempt + 1);
          }, waitTime);
          return;
        } else {
          throw new Error('Order not found after multiple attempts. The payment may still be processing.');
        }
      }

      console.log('Order found:', { 
        id: orderData.id, 
        orderNumber: orderData.order_number, 
        status: orderData.status, 
        paymentStatus: orderData.payment_status 
      });
      
      setOrder(orderData);

      // Clear the cart after successful order retrieval
      await clearCart();

      // Show success message
      toast.success('Order placed successfully!', {
        description: `Your order ${orderData.order_number} has been confirmed.`
      });

    } catch (err: any) {
      console.error('Failed to fetch order details:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [sessionId]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRetryCount(0);
    fetchOrderDetails();
  };

  if (isLoading) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {retryCount > 0 ? `Loading order details... (attempt ${retryCount + 1})` : 'Loading order details...'}
            </p>
            {retryCount > 3 && (
              <p className="mt-2 text-sm text-gray-500">
                Your payment is being processed. This may take a few moments.
              </p>
            )}
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
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Order Processing</h2>
                <p className="text-gray-600 mb-6">
                  {error || 'We are still processing your order. Please wait a moment and try again.'}
                </p>
                <div className="space-y-3">
                  <Button onClick={handleRetry} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check Order Status
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                  {user && (
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/orders">View Order History</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmation - Terra Echo Studios</title>
        <meta name="description" content="Your order has been confirmed and is being processed." />
      </Helmet>

      <UnifiedNavbar />
      
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <FadeInView direction="up">
            <div className="max-w-2xl mx-auto">
              {/* Success Header */}
              <Card className="mb-8 bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-800 mb-2">
                      Order Confirmed!
                    </h1>
                    <p className="text-green-700 mb-4">
                      Thank you for your purchase. We've received your order and will start processing it shortly.
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-green-600">
                      <div className="flex items-center">
                        <span className="font-medium">Order #</span>
                        <Badge variant="outline" className="ml-2 border-green-300 text-green-700">
                          {order.order_number}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Status:</span>
                        <Badge 
                          variant={order.payment_status === 'paid' ? 'default' : 'secondary'}
                          className={`ml-2 ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : ''}`}
                        >
                          {order.payment_status === 'paid' ? 'Paid' : order.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Details */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Customer</h4>
                      <p className="text-gray-600">
                        {order.shipping_first_name} {order.shipping_last_name}
                      </p>
                      <p className="text-gray-600">{order.email}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Order Status</h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={order.payment_status === 'paid' ? 'default' : 'secondary'}
                          className={order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {order.payment_status === 'paid' ? 'Payment Confirmed' : order.payment_status}
                        </Badge>
                        <Badge variant="outline">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Items Ordered</h4>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            {item.variant_name && (
                              <p className="text-sm text-gray-600">{item.variant_name}</p>
                            )}
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">
                            {formatPrice(item.unit_price_cents * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-nature-forest">{formatPrice(order.total_cents)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    What's Next?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Order Processing</h4>
                        <p className="text-sm text-gray-600">
                          We'll prepare your items and get them ready for shipment.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Shipment Notification</h4>
                        <p className="text-sm text-gray-600">
                          You'll receive an email with tracking information once your order ships.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-medium text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Delivery</h4>
                        <p className="text-sm text-gray-600">
                          Your order will be delivered to your specified address within 5-7 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <Link to="/shop">
                    Continue Shopping
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                
                {user && (
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/orders">
                      View All Orders
                    </Link>
                  </Button>
                )}
                
                <Button variant="outline" asChild className="flex-1">
                  <Link to={`/orders/${order.id}`}>
                    Track This Order
                  </Link>
                </Button>
              </div>

              {/* Support */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Need help with your order?
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

export default OrderSuccessPage;
