
import { useState, useEffect, useCallback, useRef } from 'react';
import { AIManager } from '@/types/morvo';
import morvoAPI from '@/api/morvoClient';
import { useApiCache } from './useApiCache';
import { toast } from 'sonner';

interface MorvoIntegrationState {
  connected: boolean;
  loading: boolean;
  error: string | null;
  messages: Array<{
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    manager?: AIManager;
  }>;
  platforms: any[];
  websocket: WebSocket | null;
  dashboardData: Record<string, any>;
  connectionStatus: {
    api: boolean;
    websocket: boolean;
    overall: boolean;
  };
}

export const useMorvoIntegration = () => {
  const [state, setState] = useState<MorvoIntegrationState>({
    connected: false,
    loading: false,
    error: null,
    messages: [],
    platforms: [],
    websocket: null,
    dashboardData: {},
    connectionStatus: {
      api: false,
      websocket: false,
      overall: false
    }
  });

  const wsReconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Cache platforms data
  const { 
    data: platformsData, 
    loading: platformsLoading, 
    refetch: refetchPlatforms 
  } = useApiCache(
    'platforms',
    () => morvoAPI.getAvailablePlatforms(),
    { ttl: 600000 } // 10 minutes
  );

  // WebSocket connection with auto-reconnect
  const connectWebSocket = useCallback(() => {
    if (state.websocket?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      const ws = morvoAPI.connectWebSocket(
        (data) => {
          // Handle incoming messages
          switch(data.type) {
            case 'chat_response':
              setState(prev => ({
                ...prev,
                messages: [...prev.messages, {
                  type: 'ai',
                  content: data.content,
                  timestamp: new Date()
                }],
                loading: false
              }));
              break;
              
            case 'dashboard_update':
              setState(prev => ({
                ...prev,
                dashboardData: { ...prev.dashboardData, ...data.updates }
              }));
              break;
              
            case 'analysis_progress':
              // Handle progress updates
              break;
              
            case 'error':
              setState(prev => ({ ...prev, error: data.message }));
              toast.error(data.message);
              break;
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
          setState(prev => ({ 
            ...prev, 
            connected: false,
            connectionStatus: { ...prev.connectionStatus, websocket: false, overall: false }
          }));
        },
        () => {
          console.log('WebSocket closed');
          setState(prev => ({ 
            ...prev, 
            connected: false,
            connectionStatus: { ...prev.connectionStatus, websocket: false, overall: false }
          }));
          
          // Auto-reconnect logic
          if (wsReconnectAttempts.current < maxReconnectAttempts) {
            wsReconnectAttempts.current++;
            const delay = Math.min(1000 * Math.pow(2, wsReconnectAttempts.current), 30000);
            
            console.log(`Attempting to reconnect WebSocket in ${delay}ms (attempt ${wsReconnectAttempts.current})`);
            setTimeout(connectWebSocket, delay);
          }
        }
      );
      
      setState(prev => ({ 
        ...prev, 
        websocket: ws, 
        connected: true,
        connectionStatus: { ...prev.connectionStatus, websocket: true }
      }));
      
      wsReconnectAttempts.current = 0; // Reset on successful connection
      
    } catch (error: any) {
      console.error('Failed to connect WebSocket:', error);
      setState(prev => ({ ...prev, error: error.message }));
    }
  }, [state.websocket]);

  // Test full connectivity
  const testConnection = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const results = await morvoAPI.testConnection();
      
      setState(prev => ({
        ...prev,
        connectionStatus: results,
        connected: results.overall,
        loading: false,
        error: results.overall ? null : 'فشل في الاتصال ببعض الخدمات'
      }));
      
      if (results.overall) {
        toast.success('تم الاتصال بنجاح');
      } else {
        toast.warning('مشاكل في الاتصال');
      }
      
      return results;
      
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message,
        connected: false 
      }));
      toast.error('فشل في اختبار الاتصال');
      throw error;
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (message: string, manager?: AIManager) => {
    setState(prev => ({ 
      ...prev, 
      loading: true,
      messages: [...prev.messages, {
        type: 'user',
        content: message,
        timestamp: new Date(),
        manager
      }]
    }));

    try {
      // Send via WebSocket for immediate response
      if (state.websocket?.readyState === WebSocket.OPEN) {
        morvoAPI.sendWebSocketMessage(state.websocket, message);
      }

      // Send via API for full processing
      const response = await morvoAPI.sendMessage(message);
      
      // Response will come via WebSocket, but fallback to direct response
      if (!state.connected && response) {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, {
            type: 'ai',
            content: response.response || response.message || 'تم استلام الرسالة',
            timestamp: new Date()
          }],
          loading: false
        }));
      }

      return response;

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        error: error.message, 
        loading: false 
      }));
      toast.error('فشل في إرسال الرسالة');
      throw error;
    }
  }, [state.websocket, state.connected]);

  // Analyze website
  const analyzeWebsite = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await morvoAPI.analyzeWebsite(url);
      setState(prev => ({ ...prev, loading: false }));
      toast.success('تم بدء تحليل الموقع');
      return result;
      
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
      toast.error('فشل في تحليل الموقع');
      throw error;
    }
  }, []);

  // Connect platform
  const connectPlatform = useCallback(async (platform: string, credentials: any) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await morvoAPI.connectPlatform(platform, credentials);
      await refetchPlatforms(); // Refresh platforms list
      setState(prev => ({ ...prev, loading: false }));
      toast.success('تم ربط المنصة بنجاح');
      return result;
      
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, loading: false }));
      toast.error('فشل في ربط المنصة');
      throw error;
    }
  }, [refetchPlatforms]);

  // Update platforms from cache
  useEffect(() => {
    if (platformsData && Array.isArray(platformsData)) {
      setState(prev => ({ ...prev, platforms: platformsData }));
    }
  }, [platformsData]);

  // Initialize connection on mount
  useEffect(() => {
    testConnection();
    connectWebSocket();
    
    return () => {
      if (state.websocket) {
        state.websocket.close();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    platformsLoading,
    sendMessage,
    analyzeWebsite,
    connectPlatform,
    testConnection,
    reconnectWebSocket: connectWebSocket,
    refetchPlatforms
  };
};
