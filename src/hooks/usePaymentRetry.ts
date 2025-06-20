
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
}

export const usePaymentRetry = (options: PaymentRetryOptions = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    exponentialBackoff = true
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const retryPayment = useCallback(async (orderId: string, sessionId?: string) => {
    if (retryCount >= maxRetries) {
      toast.error('Maximum retry attempts reached. Please contact support.');
      return null;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    try {
      // Wait before retry with exponential backoff
      const delay = exponentialBackoff 
        ? retryDelay * Math.pow(2, retryCount)
        : retryDelay;
      
      await new Promise(resolve => setTimeout(resolve, delay));

      // Call retry payment edge function
      const { data, error } = await supabase.functions.invoke('retry-payment', {
        body: {
          order_id: orderId,
          session_id: sessionId,
          retry_count: retryCount
        }
      });

      if (error) throw error;

      if (data?.success) {
        setRetryCount(0);
        toast.success('Payment retry successful!');
        return data;
      } else if (data?.retry_url) {
        // Redirect to new payment session
        window.location.href = data.retry_url;
        return data;
      } else {
        throw new Error(data?.error || 'Payment retry failed');
      }

    } catch (error: any) {
      console.error(`Payment retry attempt ${retryCount} failed:`, error);
      
      if (retryCount < maxRetries) {
        toast.error(`Payment failed. Retrying... (${retryCount}/${maxRetries})`);
        // Recursive retry
        return retryPayment(orderId, sessionId);
      } else {
        toast.error('Payment failed after all retry attempts. Please contact support.');
        return null;
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
