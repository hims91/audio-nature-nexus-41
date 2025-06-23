
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePaymentRetry } from '@/hooks/usePaymentRetry';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

interface PaymentStatusProps {
  type: 'success' | 'failed' | 'pending';
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ type }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { retryPayment, isRetrying } = usePaymentRetry();

  useEffect(() => {
    if (sessionId && type === 'success') {
      verifyPayment();
    } else {
      setIsVerifying(false);
    }
  }, [sessionId, type]);

  const verifyPayment = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('stripe_session_id', sessionId)
        .single();

      if (error) {
        console.error('Error verifying payment:', error);
        toast.error('Unable to verify payment status');
      } else {
        setOrderDetails(data);
        if (data.payment_status !== 'paid') {
          toast.warning('Payment verification pending...');
        }
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast.error('Payment verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!orderId) {
      toast.error('No order ID found for retry');
      return;
    }

    const result = await retryPayment(orderId, sessionId || undefined);
    if (result?.retry_url) {
      // Redirect handled in hook
    }
  };

  const getStatusConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          title: 'Payment Successful!',
          description: 'Your order has been confirmed and is being processed.'
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          title: 'Payment Failed',
          description: 'There was an issue processing your payment. You can retry or contact support.'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          title: 'Payment Pending',
          description: 'Your payment is being processed. This may take a few moments.'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.bgColor} mx-auto mb-4`}>
            <StatusIcon className={`w-8 h-8 ${config.color}`} />
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {config.description}
          </p>
          
          {orderDetails && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-left">
              <h3 className="font-semibold mb-2">Order Details</h3>
              <p className="text-sm"><strong>Order #:</strong> {orderDetails.order_number}</p>
              <p className="text-sm"><strong>Email:</strong> {orderDetails.email}</p>
              <p className="text-sm"><strong>Total:</strong> ${(orderDetails.total_cents / 100).toFixed(2)}</p>
              <p className="text-sm"><strong>Status:</strong> 
                <span className={`ml-1 capitalize ${
                  orderDetails.payment_status === 'paid' ? 'text-green-600' : 
                  orderDetails.payment_status === 'failed' ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  {orderDetails.payment_status}
                </span>
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            {type === 'failed' && orderId && (
              <Button 
                onClick={handleRetryPayment}
                disabled={isRetrying}
                className="w-full"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Retrying Payment...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Payment
                  </>
                )}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/shop')}
              className="w-full"
            >
              Continue Shopping
            </Button>
            
            {type === 'success' && orderDetails && (
              <Button 
                variant="ghost" 
                onClick={() => navigate(`/dashboard/orders`)}
                className="w-full"
              >
                View Order History
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatus;
