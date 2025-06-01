
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TokenState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
}

export const useSecureRailwayToken = () => {
  const [tokenState, setTokenState] = useState<TokenState>({
    token: null,
    isLoading: true,
    error: null,
    lastRefresh: null
  });

  const refreshToken = async () => {
    try {
      setTokenState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('get-railway-token', {
        body: { refresh: true }
      });

      if (error) {
        throw new Error(error.message || 'Failed to refresh Railway token');
      }

      setTokenState({
        token: data.token,
        isLoading: false,
        error: null,
        lastRefresh: new Date()
      });

      return data.token;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return null;
    }
  };

  const getToken = async () => {
    try {
      setTokenState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('get-railway-token');

      if (error) {
        throw new Error(error.message || 'Failed to get Railway token');
      }

      setTokenState({
        token: data.token,
        isLoading: false,
        error: null,
        lastRefresh: new Date()
      });

      return data.token;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTokenState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return null;
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return {
    ...tokenState,
    refreshToken,
    getToken
  };
};
