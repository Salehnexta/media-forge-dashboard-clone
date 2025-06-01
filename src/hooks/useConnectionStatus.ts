
import { useState, useEffect, useCallback } from 'react';
import { enhancedRailwayClient } from '@/api/railway/enhancedClient';
import { toast } from 'sonner';

export type ConnectionStatus = 'online' | 'offline' | 'checking' | 'unknown';

export const useConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>('unknown');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const checkConnection = useCallback(async () => {
    setStatus('checking');
    const startTime = Date.now();
    
    try {
      const response = await enhancedRailwayClient.get('/health');
      const endTime = Date.now();
      const responseLatency = endTime - startTime;
      
      if (response === 'OK' || response?.status === 'online') {
        setStatus('online');
        setLatency(responseLatency);
        setLastChecked(new Date());
      } else {
        setStatus('offline');
        setLatency(null);
      }
    } catch (error) {
      console.error('Railway connection check failed:', error);
      setStatus('offline');
      setLatency(null);
      setLastChecked(new Date());
    }
  }, []);

  // Check connection on mount and periodically
  useEffect(() => {
    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, [checkConnection]);

  return {
    status,
    lastChecked,
    latency,
    isOnline: status === 'online',
    checkConnection
  };
};
