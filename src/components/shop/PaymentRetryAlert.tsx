
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePaymentRetry } from '@/hooks/usePaymentRetry';
import { AlertTriangle, CreditCard, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentRetryAlertProps {
  orderId: string;
  sessionId?: string;
  className?: string;
}

const PaymentRetryAlert: React.FC<PaymentRetryAlertProps> = ({ 
  orderId, 
  sessionId, 
  className 
}) => {
  const { retryPayment, isRetrying, canRetry } = usePaymentRetry();

  const handleRetry = async () => {
    try {
      const result = await retryPayment(orderId, sessionId);
      if (result?.retry_url) {
        window.location.href = result.retry_url;
      }
    } catch (error) {
      toast.error('Failed to retry payment. Please contact support.');
    }
  };

  if (!canRetry) {
    return null;
  }

  return (
    <Alert className={`border-orange-200 bg-orange-50 dark:bg-orange-900/20 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-orange-800 dark:text-orange-200">
          Your payment failed. You can retry the payment to complete your order.
        </span>
        <Button 
          onClick={handleRetry}
          disabled={isRetrying}
          size="sm"
          variant="outline"
          className="ml-4"
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
      </AlertDescription>
    </Alert>
  );
};

export default PaymentRetryAlert;
