
import { useState, useEffect, useCallback } from 'react';
import { AuthSession } from '@/hooks/useEnhancedAuth';

interface SessionCacheOptions {
  maxAge?: number; // Cache duration in milliseconds
  maxItems?: number; // Maximum number of cached items
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  key: string;
}

export const useSessionCache = <T = AuthSession[]>(
  key: string,
  fetcher: () => Promise<T>,
  options: SessionCacheOptions = {}
) => {
  const { maxAge = 5 * 60 * 1000, maxItems = 10 } = options; // Default 5 minutes
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get cache key with user context
  const getCacheKey = useCallback(() => `session_cache_${key}`, [key]);

  // Check if cache entry is valid
  const isCacheValid = useCallback((entry: CacheEntry<T>) => {
    return Date.now() - entry.timestamp < maxAge;
  }, [maxAge]);

  // Get data from cache
  const getFromCache = useCallback((): T | null => {
    try {
      const cacheKey = getCacheKey();
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      return isCacheValid(entry) ? entry.data : null;
    } catch (error) {
      console.warn('Failed to read from cache:', error);
      return null;
    }
  }, [getCacheKey, isCacheValid]);

  // Set data to cache
  const setToCache = useCallback((data: T) => {
    try {
      const cacheKey = getCacheKey();
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        key: cacheKey
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(entry));
      
      // Cleanup old cache entries
      const allKeys = Object.keys(localStorage);
      const cacheKeys = allKeys.filter(k => k.startsWith('session_cache_'));
      
      if (cacheKeys.length > maxItems) {
        const entriesToRemove = cacheKeys.slice(0, cacheKeys.length - maxItems);
        entriesToRemove.forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.warn('Failed to write to cache:', error);
    }
  }, [getCacheKey, maxItems]);

  // Fetch data with caching
  const fetchData = useCallback(async (force = false) => {
    // Check cache first unless forced refresh
    if (!force) {
      const cached = getFromCache();
      if (cached) {
        setData(cached);
        return cached;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setToCache(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch data');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetcher, getFromCache, setToCache]);

  // Invalidate cache
  const invalidateCache = useCallback(() => {
    const cacheKey = getCacheKey();
    localStorage.removeItem(cacheKey);
  }, [getCacheKey]);

  // Load initial data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    invalidate: invalidateCache
  };
};
