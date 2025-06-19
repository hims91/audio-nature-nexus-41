
import React, { useEffect, useCallback } from 'react';

interface MemoryOptimizerProps {
  children: React.ReactNode;
}

const MemoryOptimizer: React.FC<MemoryOptimizerProps> = ({ children }) => {
  // Clean up memory leaks and optimize garbage collection
  const cleanupMemory = useCallback(() => {
    // Clear expired cache entries
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('cache_')) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '');
          if (item.expires && item.expires < now) {
            expiredKeys.push(key);
          }
        } catch (e) {
          // Remove corrupted cache entries
          expiredKeys.push(key);
        }
      }
    }
    
    expiredKeys.forEach(key => localStorage.removeItem(key));
    
    // Clear old performance metrics
    const metrics = JSON.parse(sessionStorage.getItem('performance-metrics') || '[]');
    const oneHourAgo = now - (60 * 60 * 1000);
    const recentMetrics = metrics.filter((m: any) => m.timestamp > oneHourAgo);
    sessionStorage.setItem('performance-metrics', JSON.stringify(recentMetrics));
    
    // Suggest garbage collection if available
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
  }, []);

  useEffect(() => {
    // Set up memory cleanup interval
    const cleanupInterval = setInterval(cleanupMemory, 5 * 60 * 1000); // Every 5 minutes
    
    // Clean up on page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        cleanupMemory();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial cleanup
    cleanupMemory();
    
    return () => {
      clearInterval(cleanupInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cleanupMemory]);

  return <>{children}</>;
};

export default MemoryOptimizer;
