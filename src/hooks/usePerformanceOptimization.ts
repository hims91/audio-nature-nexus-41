
import { useCallback, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

export const usePerformanceOptimization = (componentName: string) => {
  const renderStartTime = useRef<number>(Date.now());
  
  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} rendered in ${renderTime}ms`);
    }
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && renderTime > 100) {
      // Only log slow renders
      const metrics: PerformanceMetrics = {
        renderTime,
        componentName,
        timestamp: Date.now()
      };
      
      // Store in session storage for later analysis
      const existingMetrics = JSON.parse(sessionStorage.getItem('performance-metrics') || '[]');
      existingMetrics.push(metrics);
      sessionStorage.setItem('performance-metrics', JSON.stringify(existingMetrics));
    }
  });

  // Debounce function for performance
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // Throttle function for performance
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  return {
    debounce,
    throttle,
  };
};
