
import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface UseApiCacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
  retry?: boolean;
  retryDelay?: number;
}

const cache = new Map<string, CacheEntry<any>>();

export const useApiCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseApiCacheOptions = {}
) => {
  const {
    ttl = 300000, // 5 minutes default
    staleWhileRevalidate = true,
    retry = true,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCachedData = useCallback(() => {
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    return null;
  }, [key]);

  const setCachedData = useCallback((newData: T) => {
    cache.set(key, {
      data: newData,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    });
  }, [key, ttl]);

  const fetchData = useCallback(async (useStale = false) => {
    try {
      if (!useStale) {
        setLoading(true);
        setError(null);
      }

      const result = await fetcher();
      setData(result);
      setCachedData(result);
      
      if (!useStale) {
        setLoading(false);
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'حدث خطأ في تحميل البيانات';
      setError(errorMessage);
      
      if (!useStale) {
        setLoading(false);
      }
      
      if (retry) {
        setTimeout(() => fetchData(useStale), retryDelay);
      }
      
      throw err;
    }
  }, [fetcher, setCachedData, retry, retryDelay]);

  const refetch = useCallback(() => {
    cache.delete(key); // Clear cache
    return fetchData();
  }, [key, fetchData]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
    setCachedData(newData);
  }, [setCachedData]);

  useEffect(() => {
    const cachedData = getCachedData();
    
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      
      // Revalidate in background if stale-while-revalidate is enabled
      if (staleWhileRevalidate) {
        fetchData(true).catch(() => {
          // Silent fail for background revalidation
        });
      }
    } else {
      fetchData();
    }
  }, [key, getCachedData, fetchData, staleWhileRevalidate]);

  return {
    data,
    loading,
    error,
    refetch,
    mutate
  };
};

// Cache management utilities
export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

export const getCacheSize = () => cache.size;

export const getCacheKeys = () => Array.from(cache.keys());
