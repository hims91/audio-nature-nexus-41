
import React, { useEffect, useRef } from 'react';

interface MemoryOptimizerProps {
  children: React.ReactNode;
}

const MemoryOptimizer: React.FC<MemoryOptimizerProps> = ({ children }) => {
  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    // Memory optimization strategies
    const cleanup = () => {
      // Clear any intervals, timeouts, or event listeners
      cleanupRef.current.forEach(fn => fn());
      cleanupRef.current = [];
    };

    // Monitor memory usage
    const memoryMonitor = setInterval(() => {
      if (performance.memory) {
        const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const memoryUsage = (usedJSHeapSize / jsHeapSizeLimit) * 100;
        
        // If memory usage is high, trigger garbage collection hints
        if (memoryUsage > 80) {
          console.warn('High memory usage detected:', memoryUsage.toFixed(2) + '%');
        }
      }
    }, 30000); // Check every 30 seconds

    cleanupRef.current.push(() => clearInterval(memoryMonitor));

    return cleanup;
  }, []);

  return <>{children}</>;
};

export default MemoryOptimizer;
