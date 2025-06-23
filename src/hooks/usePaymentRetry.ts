
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
}

interface PaymentRetryResult {
  success: boolean;
  retry_url?: string;
  session_id?: string;
  error?: string;
}

export const usePaymentRetry = (options: PaymentRetryOptions = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    exponentialBackoff = true
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const retryPayment = useCallback(async (orderId: string, sessionId?: string): Promise<PaymentRetryResult | null> => {
    if (retryCount >= maxRetries) {
      toast.error('Maximum retry attempts reached. Please contact support.');
      return null;
    }

    setIsRetrying(true);
    const currentRetry = retryCount + 1;
    setRetryCount(currentRetry);

    try {
      // Wait before retry with exponential backoff
      const delay = exponentialBackoff 
        ? retryDelay * Math.pow(2, retryCount)
        : retryDelay;
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      console.log(`Attempting payment retry ${currentRetry}/${maxRetries} for order ${orderId}`);

      // Call retry payment edge function
      const { data, error } = await supabase.functions.invoke('retry-payment', {
        body: {
          order_id: orderId,
          session_id: sessionId,
          retry_count: currentRetry
        }
      });

      if (error) {
        console.error('Retry payment function error:', error);
        throw error;
      }

      if (data?.success) {
        setRetryCount(0);
        toast.success('Payment retry successful!');
        return data;
      } else if (data?.retry_url) {
        // Redirect to new payment session
        toast.success('Redirecting to new payment session...');
        setTimeout(() => {
          window.location.href = data.retry_url;
        }, 1000);
        return data;
      } else {
        throw new Error(data?.error || 'Payment retry failed');
      }

    } catch (error: any) {
      console.error(`Payment retry attempt ${currentRetry} failed:`, error);
      
      if (currentRetry < maxRetries) {
        toast.error(`Payment failed. Will retry automatically... (${currentRetry}/${maxRetries})`);
        // Recursive retry with delay
        setTimeout(() => {
          retryPayment(orderId, sessionId);
        }, 2000);
        return null;
      } else {
        toast.error('Payment failed after all retry attempts. Please contact support.');
        return { success: false, error: error.message };
      }
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, maxRetries, retryDelay, exponentialBackoff]);

  const resetRetryCount = useCallback(() => {
    setRetryCount(0);
  }, []);

  return {
    retryPayment,
    isRetrying,
    retryCount,
    resetRetryCount,
    canRetry: retryCount < maxRetries
  };
};
