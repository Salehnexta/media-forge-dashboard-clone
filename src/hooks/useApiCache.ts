
import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface ApiCacheOptions {
  ttl?: number; // Time to live in milliseconds
  key?: string; // Custom cache key
}

export const useApiCache = <T>(
  url: string, 
  options: ApiCacheOptions = {}
) => {
  const { ttl = 300000, key } = options; // Default 5 minutes TTL
  const cacheKey = key || `api_cache_${url}`;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getCachedData = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();
      
      if (now - entry.timestamp > entry.ttl) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return entry.data;
    } catch {
      localStorage.removeItem(cacheKey);
      return null;
    }
  }, [cacheKey]);

  const setCachedData = useCallback((newData: T) => {
    const entry: CacheEntry<T> = {
      data: newData,
      timestamp: Date.now(),
      ttl
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }, [cacheKey, ttl]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = getCachedData();
      if (cached) {
        setData(cached);
        setLoading(false);
        return cached;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
      setCachedData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  }, [url, getCachedData, setCachedData]);

  const invalidateCache = useCallback(() => {
    localStorage.removeItem(cacheKey);
    fetchData(true);
  }, [cacheKey, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    invalidateCache
  };
};
