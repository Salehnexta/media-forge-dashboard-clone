
import { useState, useRef, useEffect, useCallback } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';
import { supabase } from '@/integrations/supabase/client';

interface ChatState {
  messages: ChatMessage[];
  currentAgent: AIManager;
  isTyping: boolean;
  isConnected: boolean;
}

interface DashboardCommand {
  type: 'UPDATE_STATS' | 'SHOW_CHART' | 'SWITCH_TAB' | 'ADD_NOTIFICATION';
  payload: any;
}

export const useChatLogic = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [{
      id: '1',
      text: 'مرحباً! أنا مورفو، مساعدك الذكي في التسويق. كيف يمكنني مساعدتك اليوم؟',
      sender: 'ai',
      timestamp: new Date(),
      manager: 'strategic'
    }],
    currentAgent: 'strategic',
    isTyping: false,
    isConnected: true
  });

  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Dashboard control callback
  const [dashboardCommandCallback, setDashboardCommandCallback] = useState<((cmd: DashboardCommand) => void) | null>(null);

  // WebSocket connection with reconnection logic
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      wsRef.current = new WebSocket('ws://localhost:8090/ws/chat');
      
      wsRef.current.onopen = () => {
        setChatState(prev => ({ ...prev, isConnected: true }));
        console.log('WebSocket connected');
      };

      wsRef.current.onclose = () => {
        setChatState(prev => ({ ...prev, isConnected: false }));
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'ai_response') {
          const aiMessage: ChatMessage = {
            id: Date.now().toString(),
            text: data.text,
            sender: 'ai',
            timestamp: new Date(),
            manager: data.agent || 'strategic'
          };

          setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, aiMessage],
            isTyping: false
          }));
        }

        if (data.type === 'dashboard_command' && dashboardCommandCallback) {
          dashboardCommandCallback(data.command);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      // Fallback to HTTP if WebSocket fails
    }
  }, [dashboardCommandCallback]);

  // AI responses with dashboard commands
  const generateAIResponse = useCallback((userMessage: string): { text: string; commands?: DashboardCommand[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('إحصائيات') || lowerMessage.includes('أرقام')) {
      return {
        text: 'تم تحديث الإحصائيات! يمكنك رؤية آخر البيانات في لوحة التحكم.',
        commands: [{
          type: 'UPDATE_STATS',
          payload: {
            visitors: Math.floor(Math.random() * 1000) + 2000,
            sales: Math.floor(Math.random() * 10000) + 40000,
            conversions: (Math.random() * 5 + 2).toFixed(1),
            roi: Math.floor(Math.random() * 100) + 200
          }
        }]
      };
    }

    if (lowerMessage.includes('حملات') || lowerMessage.includes('إعلانات')) {
      return {
        text: 'سأعرض لك أداء الحملات الإعلانية الآن.',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'executor' }
        }, {
          type: 'SHOW_CHART',
          payload: { chartType: 'campaigns' }
        }]
      };
    }

    if (lowerMessage.includes('محتوى') || lowerMessage.includes('منشورات')) {
      return {
        text: 'دعني أوضح لك أداء المحتوى وأفضل المنشورات.',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'creative' }
        }]
      };
    }

    const responses = [
      'رائع! دعني أحلل هذا لك بالتفصيل',
      'يمكنني مساعدتك في تحسين هذه الحملة',
      'الأرقام تبدو جيدة، هل تريد تقريراً مفصلاً؟',
      'دعني أنشئ لك محتوى جديد ومبتكر',
      'هذا اقتراح ممتاز، سأعمل عليه فوراً'
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)]
    };
  }, []);

  // Send message function
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
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));

    const currentMessage = message;
    setMessage('');

    // Send via WebSocket if connected
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'user_message',
        text: currentMessage,
        agent: chatState.currentAgent
      }));
    } else {
      // Fallback to local AI response
      setTimeout(() => {
        const response = generateAIResponse(currentMessage);
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'ai',
          timestamp: new Date(),
          manager: chatState.currentAgent
        };

        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
          isTyping: false
        }));

        // Execute dashboard commands
        if (response.commands && dashboardCommandCallback) {
          response.commands.forEach(cmd => dashboardCommandCallback(cmd));
        }
      }, 1500);
    }
  }, [message, chatState.currentAgent, generateAIResponse, dashboardCommandCallback]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  // Initialize WebSocket
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

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
    messagesEndRef
  };
};
