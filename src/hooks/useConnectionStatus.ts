
// Hook for monitoring Railway connection status
import { useState, useEffect, useCallback } from 'react';
import { checkRailwayHealth } from '../api/railway';

interface ConnectionStatus {
  status: 'checking' | 'online' | 'offline';
  lastChecked: Date | null;
  error: any;
  checkConnection: () => Promise<string>;
}

export const useConnectionStatus = (checkInterval = 60000): ConnectionStatus => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<any>(null);
  
  const checkConnection = useCallback(async () => {
    try {
      const result = await checkRailwayHealth();
      setStatus(result.status as 'online' | 'offline');
      setLastChecked(new Date());
      setError(null);
      return result.status;
    } catch (error) {
      setStatus('offline');
      setError(error);
      setLastChecked(new Date());
      return 'offline';
    }
  }, []);
  
  // Initial check on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);
  
  // Set up periodic checking
  useEffect(() => {
    const interval = setInterval(() => {
      checkConnection();
    }, checkInterval);
    
    return () => clearInterval(interval);
  }, [checkInterval, checkConnection]);
  
  return {
    status,
    lastChecked,
    error,
    checkConnection
  };
};
