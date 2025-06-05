
import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  retryAttempts?: number;
  retryDelay?: number;
}

interface CacheState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

export const useApiCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) => {
  const {
    ttl = 300000, // 5 minutes default
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<CacheState<T>>({
    data: null,
    loading: false,
    error: null,
    lastFetch: null
  });

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    if (!state.lastFetch) return false;
    return Date.now() - state.lastFetch < ttl;
  }, [state.lastFetch, ttl]);

  // Fetch data with retry logic
  const fetchData = useCallback(async (force: boolean = false) => {
    if (!force && isCacheValid() && state.data) {
      return state.data;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const data = await fetcher();
        setState({
          data,
          loading: false,
          error: null,
          lastFetch: Date.now()
        });
        return data;
      } catch (error: any) {
        if (attempt === retryAttempts) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error.message || 'Failed to fetch data'
          }));
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }, [fetcher, isCacheValid, retryAttempts, retryDelay, state.data]);

  // Refetch function
  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [key]); // Only re-run when key changes

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refetch,
    isCacheValid: isCacheValid()
  };
};
