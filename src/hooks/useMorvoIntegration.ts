
import { useState, useEffect, useCallback, useRef } from 'react';
import morvoClient from '@/lib/morvoClient';
import { useComponentPerformance } from './useEnhancedPerformance';
import { toast } from 'sonner';

interface MorvoMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface MorvoIntegrationState {
  connected: boolean;
  loading: boolean;
  error: string | null;
  messages: MorvoMessage[];
  platforms: any[];
  connectionStatus: {
    api: boolean;
    websocket: boolean;
    overall: boolean;
  };
}

export const useMorvoIntegration = () => {
  useComponentPerformance('MorvoIntegration');
  
  const [state, setState] = useState<MorvoIntegrationState>({
    connected: false,
    loading: false,
    error: null,
    messages: [],
    platforms: [],
    connectionStatus: {
      api: false,
      websocket: false,
      overall: false
    }
  });

  const wsRef = useRef<WebSocket | null>(null);
  const messagesRef = useRef<MorvoMessage[]>([]);

  // WebSocket connection
  const connectWebSocket = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      const ws = await morvoClient.connectWebSocket({
        onConnect: () => {
          setState(prev => ({ 
            ...prev, 
            connected: true,
            connectionStatus: { ...prev.connectionStatus, websocket: true },
            loading: false,
            error: null
          }));
          toast.success('تم الاتصال بنجاح');
        },
        onDisconnect: () => {
          setState(prev => ({ 
            ...prev, 
            connected: false,
            connectionStatus: { ...prev.connectionStatus, websocket: false, overall: false }
          }));
        },
        onMessage: (data) => {
          switch(data.type) {
            case 'chat_response':
              const newMessage: MorvoMessage = {
                id: Date.now().toString(),
                type: 'ai',
                content: data.content || data.message,
                timestamp: new Date()
              };
              
              setState(prev => ({
                ...prev,
                messages: [...prev.messages, newMessage],
                loading: false
              }));
              break;
              
            case 'dashboard_update':
              // Handle dashboard updates
              break;
              
            case 'error':
              setState(prev => ({ 
                ...prev, 
                error: data.message,
                loading: false
              }));
              toast.error(data.message);
              break;
          }
        },
        onError: (error) => {
          setState(prev => ({ 
            ...prev, 
            error: 'خطأ في الاتصال',
            connected: false,
            loading: false
          }));
          console.error('WebSocket error:', error);
        }
      });

      wsRef.current = ws;

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        connected: false,
        loading: false
      }));
      toast.error('فشل في الاتصال');
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    const userMessage: MorvoMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      loading: true
    }));

    try {
      // Send via WebSocket if connected
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        morvoClient.sendWebSocketMessage({
          type: 'chat_message',
          message: content,
          user_id: 'user_123',
          timestamp: new Date().toISOString()
        });
      } else {
        // Fallback to HTTP API
        const response = await morvoClient.sendMessage(content);
        
        const aiMessage: MorvoMessage = {
          id: Date.now().toString(),
          type: 'ai',
          content: response.response || response.message || 'تم استلام الرسالة',
          timestamp: new Date()
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
          loading: false
        }));
      }

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message,
        loading: false
      }));
      toast.error('فشل في إرسال الرسالة');
    }
  }, []);

  // Test connection
  const testConnection = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const results = await morvoClient.testConnection();
      
      setState(prev => ({
        ...prev,
        connectionStatus: results,
        loading: false,
        error: results.overall ? null : 'فشل في الاتصال ببعض الخدمات'
      }));

      if (results.overall) {
        toast.success('جميع الخدمات متصلة');
      } else {
        toast.warning('مشاكل في الاتصال');
      }

      return results;

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message
      }));
      toast.error('فشل في اختبار الاتصال');
      throw error;
    }
  }, []);

  // Load platforms
  const loadPlatforms = useCallback(async () => {
    try {
      const platforms = await morvoClient.getAvailablePlatforms();
      setState(prev => ({ ...prev, platforms: platforms || [] }));
      return platforms;
    } catch (error: any) {
      console.error('Failed to load platforms:', error);
      return [];
    }
  }, []);

  // Analyze website
  const analyzeWebsite = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await morvoClient.analyzeWebsite(url);
      setState(prev => ({ ...prev, loading: false }));
      toast.success('تم بدء تحليل الموقع');
      return result;
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
      toast.error('فشل في تحليل الموقع');
      throw error;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    testConnection();
    connectWebSocket();
    loadPlatforms();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    sendMessage,
    testConnection,
    analyzeWebsite,
    loadPlatforms,
    reconnect: connectWebSocket
  };
};
