import { useState, useEffect, useCallback } from 'react';
import { chatWebSocketService, ChatMessage, WebSocketConfig } from '@/services/ChatWebSocketService';
import { toast } from 'sonner';

interface UseChatWebSocketProps {
  userId?: string;
  token?: string;
  onMessage?: (message: ChatMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  autoConnect?: boolean;
}

export const useChatWebSocket = ({
  userId = '',
  token,
  onMessage,
  onConnect,
  onDisconnect,
  onTypingStart,
  onTypingEnd,
  autoConnect = true
}: UseChatWebSocketProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionState, setConnectionState] = useState(chatWebSocketService.getConnectionState());
  
  const connect = useCallback(async (id: string = userId, authToken: string = token) => {
    if (isConnecting) return false;
    
    setIsConnecting(true);
    
    const config: WebSocketConfig = {
      onMessage: (message) => {
        // Ensure message sender is one of the valid types
        if (message.sender !== 'user' && message.sender !== 'ai' && message.sender !== 'system') {
          message.sender = 'system'; // Default to system if invalid type
        }
        
        onMessage?.(message);
      },
      onConnect: () => {
        setIsConnected(true);
        setConnectionState('connected');
        onConnect?.();
      },
      onDisconnect: () => {
        setIsConnected(false);
        setConnectionState('disconnected');
        onDisconnect?.();
      },
      onTypingStart,
      onTypingEnd
    };
    
    try {
      const success = await chatWebSocketService.connect(id || 'guest', authToken, config);
      setIsConnecting(false);
      return success;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnecting(false);
      return false;
    }
  }, [userId, token, onMessage, onConnect, onDisconnect, onTypingStart, onTypingEnd, isConnecting]);
  
  const disconnect = useCallback(() => {
    chatWebSocketService.disconnect();
    setIsConnected(false);
    setConnectionState('disconnected');
  }, []);
  
  const sendMessage = useCallback((content: string, metadata: Record<string, any> = {}) => {
    const message = {
      type: 'chat_message',
      content,
      timestamp: new Date().toISOString(),
      ...metadata
    };
    
    const sent = chatWebSocketService.sendMessage(message);
    
    if (!sent) {
      // If message couldn't be sent, try reconnecting
      connect();
    }
    
    return sent;
  }, [connect]);
  
  const sendCommand = useCallback((command: string, params: Record<string, any> = {}) => {
    const message = {
      type: 'command',
      command,
      params,
      timestamp: new Date().toISOString()
    };
    
    return chatWebSocketService.sendMessage(message);
  }, []);
  
  const checkConnection = useCallback(async () => {
    const status = await chatWebSocketService.checkServerStatus();
    if (!status.isOnline) {
      toast.error(status.message);
      return false;
    }
    
    if (!isConnected) {
      return await connect();
    }
    
    return true;
  }, [connect, isConnected]);
  
  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && userId) {
      connect();
    }
    
    // Update connection state periodically
    const interval = setInterval(() => {
      setConnectionState(chatWebSocketService.getConnectionState());
      setIsConnected(chatWebSocketService.isConnected());
    }, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [autoConnect, userId, connect]);
  
  return {
    isConnected,
    isConnecting,
    connectionState,
    connect,
    disconnect,
    sendMessage,
    sendCommand,
    checkConnection
  };
};

export default useChatWebSocket;
