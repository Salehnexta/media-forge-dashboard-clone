import { useState, useRef, useEffect, useCallback } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';
import { supabase } from '@/integrations/supabase/client';
import { chatWebSocketService, WebSocketConfig } from '@/services/ChatWebSocketService';
import { chatCommandProcessor } from '@/services/ChatCommandProcessor';
import { DashboardCommand } from '@/types/dashboard';
import { toast } from 'sonner';

interface ChatState {
  messages: ChatMessage[];
  currentAgent: AIManager;
  isTyping: boolean;
  isConnected: boolean;
}

export const useChatLogic = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [{
      id: '1',
      text: 'مرحباً! أنا مورفو، مساعدك الذكي في التسويق. يمكنني الآن التحكم في لوحة التحكم بالكامل. جرب أن تقول "أظهر الإحصائيات" أو "انتقل للحملات".',
      sender: 'ai',
      timestamp: new Date(),
      manager: 'strategic'
    }],
    currentAgent: 'strategic',
    isTyping: false,
    isConnected: false
  });

  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [dashboardCommandCallback, setDashboardCommandCallback] = useState<((cmd: DashboardCommand) => void) | null>(null);
  const [userId, setUserId] = useState<string>('');

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const currentUserId = user?.id || 'anonymous_' + Date.now();
        setUserId(currentUserId);

        const wsConfig: WebSocketConfig = {
          onMessage: handleWebSocketMessage,
          onConnect: () => {
            setChatState(prev => ({ ...prev, isConnected: true }));
            console.log('✅ Chat WebSocket connected');
          },
          onDisconnect: () => {
            setChatState(prev => ({ ...prev, isConnected: false }));
            console.log('❌ Chat WebSocket disconnected');
          },
          onTypingStart: () => {
            setChatState(prev => ({ ...prev, isTyping: true }));
          },
          onTypingEnd: () => {
            setChatState(prev => ({ ...prev, isTyping: false }));
          },
          onError: (error) => {
            console.error('❌ Chat WebSocket error:', error);
            toast.error('خطأ في الاتصال بالخادم');
          }
        };

        const connected = await chatWebSocketService.connect(currentUserId, undefined, wsConfig);
        if (!connected) {
          console.warn('⚠️ Failed to connect to WebSocket, using fallback mode');
          setChatState(prev => ({ ...prev, isConnected: false }));
        }
      } catch (error) {
        console.error('❌ Error initializing chat connection:', error);
      }
    };

    initializeConnection();

    return () => {
      chatWebSocketService.disconnect();
    };
  }, []);

  const handleWebSocketMessage = useCallback((wsMessage: any) => {
    const newMessage: ChatMessage = {
      id: wsMessage.id || Date.now().toString(),
      text: wsMessage.text,
      sender: wsMessage.sender,
      timestamp: wsMessage.timestamp,
      manager: chatState.currentAgent
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isTyping: false
    }));
  }, [chatState.currentAgent]);

  const processCommand = useCallback((userMessage: string): boolean => {
    const command = chatCommandProcessor.detectCommand(userMessage);
    
    if (command && chatCommandProcessor.validateCommand(command)) {
      console.log('🎯 Detected command:', command);
      
      // Execute command via callback
      if (dashboardCommandCallback) {
        dashboardCommandCallback(command);
        
        // Add system message confirming command execution - properly typed
        const systemMessage: ChatMessage = {
          id: Date.now().toString(),
          text: `✅ تم تنفيذ الأمر بنجاح (الثقة: ${Math.round(command.confidence * 100)}%)`,
          sender: 'system',
          timestamp: new Date(),
          manager: chatState.currentAgent
        };
        
        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, systemMessage]
        }));
        
        return true;
      }
    }
    
    return false;
  }, [dashboardCommandCallback, chatState.currentAgent]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      manager: chatState.currentAgent
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    const currentMessage = message;
    setMessage('');

    // Check for commands first
    if (processCommand(currentMessage)) {
      return;
    }

    // Send to WebSocket if connected
    if (chatWebSocketService.isConnected()) {
      setChatState(prev => ({ ...prev, isTyping: true }));
      
      chatWebSocketService.sendMessage({
        type: 'user_message',
        content: currentMessage,
        agent: chatState.currentAgent,
        userId: userId,
        timestamp: new Date().toISOString()
      });
    } else {
      // Fallback to local response
      setChatState(prev => ({ ...prev, isTyping: true }));
      
      setTimeout(() => {
        const responses = [
          'أعتذر، أواجه مشكلة في الاتصال بالخادم. جاري المحاولة مرة أخرى...',
          'يبدو أن الاتصال غير متاح حالياً. يمكنك استخدام الأوامر المحلية مثل "انتقل للحملات".',
          'أحاول إعادة الاتصال... في غضون ذلك، يمكنك استخدام أوامر التنقل.'
        ];
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'ai',
          timestamp: new Date(),
          manager: chatState.currentAgent
        };

        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
          isTyping: false
        }));
      }, 1200);
    }
  }, [message, chatState.currentAgent, processCommand, userId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  return {
    // Chat state
    messages: chatState.messages,
    currentAgent: chatState.currentAgent,
    isTyping: chatState.isTyping,
    isConnected: chatState.isConnected,
    
    // Message input
    message,
    setMessage,
    
    // Actions
    handleSendMessage,
    setCurrentAgent: (agent: AIManager) => 
      setChatState(prev => ({ ...prev, currentAgent: agent })),
    
    // Dashboard integration
    setDashboardCommandCallback,
    
    // Refs
    messagesEndRef,
    
    // Additional utilities
    getCommandSuggestions: () => chatCommandProcessor.getCommandSuggestions(),
    connectionState: chatWebSocketService.getConnectionState()
  };
};
