
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from '../useDebounce';
import { enhancedRailwayClient } from '@/api/railway/enhancedClient';

export interface RailwayExecutionState {
  isRunning: boolean;
  progress: number;
  status: 'idle' | 'running' | 'completed' | 'error';
  result: any;
  error: string | null;
  executionId: string | null;
  estimatedTime: number | null;
  railwayConnected: boolean;
}

export const useRailwayState = () => {
  const [state, setState] = useState<RailwayExecutionState>({
    isRunning: false,
    progress: 0,
    status: 'idle',
    result: null,
    error: null,
    executionId: null,
    estimatedTime: null,
    railwayConnected: false
  });

  // Debounced health check to avoid excessive requests
  const debouncedHealthCheck = useDebouncedCallback(async () => {
    try {
      const health = await enhancedRailwayClient.get('/health');
      setState(prev => ({
        ...prev,
        railwayConnected: health.status === 'online' || health === 'OK'
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        railwayConnected: false
      }));
    }
  }, 1000);

  // Check Railway connection on mount and periodically
  useEffect(() => {
    debouncedHealthCheck();
    const interval = setInterval(debouncedHealthCheck, 30000);
    return () => clearInterval(interval);
  }, [debouncedHealthCheck]);

  const resetState = () => {
    setState(prev => ({
      isRunning: false,
      progress: 0,
      status: 'idle',
      result: null,
      error: null,
      executionId: null,
      estimatedTime: null,
      railwayConnected: prev.railwayConnected
    }));
  };

  return {
    state,
    setState,
    resetState
  };
};
