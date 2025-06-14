
import { useState, useEffect, useCallback } from 'react';
import MorvoAIService from '@/services/MorvoAIService';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export const usePollingConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [lastPing, setLastPing] = useState<Date | null>(null);

  const checkConnection = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      const isHealthy = await MorvoAIService.healthCheck();
      setConnectionStatus(isHealthy ? 'connected' : 'error');
      setLastPing(new Date());
    } catch (error) {
      setConnectionStatus('error');
    }
  }, []);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkConnection]);

  return {
    connectionStatus,
    lastPing,
    reconnect: checkConnection,
  };
};
