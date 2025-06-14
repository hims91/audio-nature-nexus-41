
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitState {
  attempts: number[];
  blockedUntil?: number;
}

export const useRateLimiting = (config: RateLimitConfig) => {
  const { maxAttempts, windowMs, blockDurationMs = windowMs } = config;
  const { toast } = useToast();
  
  const stateRef = useRef<RateLimitState>({ attempts: [] });
  const [isBlocked, setIsBlocked] = useState(false);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const state = stateRef.current;

    // Check if currently blocked
    if (state.blockedUntil && now < state.blockedUntil) {
      setIsBlocked(true);
      return false;
    }

    // Clean old attempts outside the window
    state.attempts = state.attempts.filter(timestamp => now - timestamp < windowMs);

    // Check if rate limit exceeded
    if (state.attempts.length >= maxAttempts) {
      state.blockedUntil = now + blockDurationMs;
      setIsBlocked(true);
      
      toast({
        title: "Rate Limit Exceeded",
        description: `Too many attempts. Please wait ${Math.ceil(blockDurationMs / 1000)} seconds.`,
        variant: "destructive",
      });
      
      return false;
    }

    setIsBlocked(false);
    return true;
  }, [maxAttempts, windowMs, blockDurationMs, toast]);

  const recordAttempt = useCallback(() => {
    stateRef.current.attempts.push(Date.now());
  }, []);

  const attemptAction = useCallback(async <T>(action: () => Promise<T>): Promise<T | null> => {
    if (!checkRateLimit()) {
      return null;
    }

    recordAttempt();
    
    try {
      return await action();
    } catch (error) {
      // Don't count failed attempts toward rate limit for certain errors
      if (error instanceof Error && error.message.includes('Invalid credentials')) {
        // Remove the last attempt for invalid credentials to prevent lockout on typos
        stateRef.current.attempts.pop();
      }
      throw error;
    }
  }, [checkRateLimit, recordAttempt]);

  const getRemainingTime = useCallback(() => {
    const now = Date.now();
    const state = stateRef.current;
    
    if (state.blockedUntil && now < state.blockedUntil) {
      return Math.ceil((state.blockedUntil - now) / 1000);
    }
    
    return 0;
  }, []);

  return {
    isBlocked,
    attemptAction,
    getRemainingTime,
    checkRateLimit
  };
};
