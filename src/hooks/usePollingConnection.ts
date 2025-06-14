
import { useState, useEffect, useRef, useCallback } from 'react';

interface PollingMessage {
  type: string;
  data: any;
  timestamp: Date;
}

interface PollingOptions {
  pollInterval?: number;
  maxRetryAttempts?: number;
  onMessage?: (message: PollingMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export const usePollingConnection = (url: string, options: PollingOptions = {}) => {
  const {
    pollInterval = 3000,
    maxRetryAttempts = 5,
    onMessage,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<PollingMessage | null>(null);
  
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(async () => {
    try {
      // Test connection
      const response = await fetch(`${url}/health`);
      
      if (response.ok) {
        console.log('HTTP polling connected to:', url);
        setIsConnected(true);
        setRetryCount(0);
        onConnect?.();
        
        // Start polling
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
        }
        
        // For now, just maintain connection check
        pollTimerRef.current = setInterval(async () => {
          try {
            const healthResponse = await fetch(`${url}/health`);
            if (!healthResponse.ok) {
              throw new Error('Health check failed');
            }
          } catch (error) {
            console.error('Polling health check failed:', error);
            setIsConnected(false);
            onDisconnect?.();
            
            if (retryCount < maxRetryAttempts) {
              setTimeout(() => {
                setRetryCount(prev => prev + 1);
                connect();
              }, pollInterval);
            }
          }
        }, pollInterval);
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      console.error('Failed to establish polling connection:', error);
      setIsConnected(false);
      onError?.(error as Error);
      
      if (retryCount < maxRetryAttempts) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          connect();
        }, pollInterval);
      }
    }
  }, [url, retryCount, maxRetryAttempts, pollInterval, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    
    setIsConnected(false);
    setRetryCount(0);
  }, []);

  const sendMessage = useCallback(async (message: any): Promise<boolean> => {
    if (!isConnected) {
      console.warn('Not connected. Cannot send message:', message);
      return false;
    }

    try {
      const response = await fetch(`${url}/v1/chat/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        const data = await response.json();
        const pollingMessage: PollingMessage = {
          type: 'response',
          data: data,
          timestamp: new Date()
        };
        setLastMessage(pollingMessage);
        onMessage?.(pollingMessage);
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      onError?.(error as Error);
      return false;
    }
  }, [url, isConnected, onMessage, onError]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    retryCount,
    sendMessage,
    connect,
    disconnect
  };
};
