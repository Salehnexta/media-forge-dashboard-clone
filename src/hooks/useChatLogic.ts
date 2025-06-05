
import { useState, useRef, useEffect, useCallback } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';
import { supabase } from '@/integrations/supabase/client';
import { useWebSocketConnection } from './useWebSocketConnection';

interface ChatState {
  messages: ChatMessage[];
  currentAgent: AIManager;
  isTyping: boolean;
  isConnected: boolean;
}

interface DashboardCommand {
  type: 'UPDATE_STATS' | 'SHOW_CHART' | 'SWITCH_TAB' | 'ADD_NOTIFICATION' | 'CREATE_WIDGET' | 'REMOVE_WIDGET';
  payload: any;
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

  // Dashboard control callback
  const [dashboardCommandCallback, setDashboardCommandCallback] = useState<((cmd: DashboardCommand) => void) | null>(null);

  // WebSocket connection
  const { isConnected, sendMessage: sendWsMessage, lastMessage } = useWebSocketConnection(
    'ws://localhost:8090/ws/chat',
    {
      onMessage: (wsMessage) => {
        console.log('Received WebSocket message:', wsMessage);
        
        if (wsMessage.type === 'ai_response') {
          const aiMessage: ChatMessage = {
            id: Date.now().toString(),
            text: wsMessage.data.text,
            sender: 'ai',
            timestamp: new Date(),
            manager: wsMessage.data.agent || 'strategic'
          };

          setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, aiMessage],
            isTyping: false
          }));
        }

        if (wsMessage.type === 'dashboard_command' && dashboardCommandCallback) {
          dashboardCommandCallback(wsMessage.data.command);
        }
      },
      onConnect: () => {
        setChatState(prev => ({ ...prev, isConnected: true }));
      },
      onDisconnect: () => {
        setChatState(prev => ({ ...prev, isConnected: false }));
      }
    }
  );

  // AI responses with enhanced dashboard commands
  const generateAIResponse = useCallback((userMessage: string): { text: string; commands?: DashboardCommand[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced command recognition
    if (lowerMessage.includes('إحصائيات') || lowerMessage.includes('أرقام') || lowerMessage.includes('بيانات')) {
      return {
        text: 'تم تحديث الإحصائيات بنجاح! 📊 يمكنك رؤية آخر البيانات المحدثة في لوحة التحكم الآن.',
        commands: [{
          type: 'UPDATE_STATS',
          payload: {
            visitors: Math.floor(Math.random() * 1000) + 2500,
            sales: Math.floor(Math.random() * 15000) + 45000,
            conversions: (Math.random() * 3 + 3).toFixed(1),
            roi: Math.floor(Math.random() * 150) + 250
          }
        }, {
          type: 'ADD_NOTIFICATION',
          payload: {
            message: 'تم تحديث الإحصائيات بواسطة مورفو AI',
            type: 'success'
          }
        }]
      };
    }

    if (lowerMessage.includes('حملات') || lowerMessage.includes('إعلانات') || lowerMessage.includes('campaigns')) {
      return {
        text: 'جاري الانتقال إلى تبويب الحملات الإعلانية... 🎯 ستجد تحليلاً شاملاً لأداء جميع حملاتك هناك.',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'executor' }
        }, {
          type: 'SHOW_CHART',
          payload: { 
            id: 'campaigns-performance',
            type: 'line',
            title: 'أداء الحملات الإعلانية',
            data: Array.from({length: 7}, (_, i) => ({
              name: `اليوم ${i + 1}`,
              value: Math.floor(Math.random() * 1000) + 500
            }))
          }
        }]
      };
    }

    if (lowerMessage.includes('محتوى') || lowerMessage.includes('منشورات') || lowerMessage.includes('content')) {
      return {
        text: 'مرحباً بك في قسم المحتوى الإبداعي! 🎨 هنا يمكنك متابعة أداء منشوراتك وإنشاء محتوى جديد.',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'creative' }
        }]
      };
    }

    if (lowerMessage.includes('سوشال') || lowerMessage.includes('تواصل') || lowerMessage.includes('social')) {
      return {
        text: 'انتقل معي إلى قسم وسائل التواصل الاجتماعي! 📱 ستجد تحليلاً مفصلاً لجميع منصاتك.',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'monitor' }
        }]
      };
    }

    if (lowerMessage.includes('تحليلات') || lowerMessage.includes('analytics') || lowerMessage.includes('تحليل')) {
      return {
        text: 'مرحباً بك في قسم التحليلات المتقدمة! 📈 هنا ستجد رؤى عميقة حول أداء عملك.',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'analyst' }
        }]
      };
    }

    if (lowerMessage.includes('استراتيجي') || lowerMessage.includes('strategic') || lowerMessage.includes('استراتيجية')) {
      return {
        text: 'أهلاً بك في القسم الاستراتيجي! 🎯 هنا نخطط لمستقبل عملك ونضع الاستراتيجيات الذكية.',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'strategic' }
        }]
      };
    }

    // Smart widget creation
    if (lowerMessage.includes('ويدجت') || lowerMessage.includes('widget') || lowerMessage.includes('عنصر جديد')) {
      return {
        text: 'تم إنشاء ويدجت جديد بناءً على طلبك! ✨',
        commands: [{
          type: 'CREATE_WIDGET',
          payload: {
            id: `widget-${Date.now()}`,
            type: 'metric',
            title: 'مؤشر جديد',
            value: Math.floor(Math.random() * 1000),
            change: '+' + Math.floor(Math.random() * 20) + '%'
          }
        }]
      };
    }

    const responses = [
      'ممتاز! دعني أحلل هذا وأحدث لوحة التحكم وفقاً لطلبك 🤖',
      'رائع! سأعمل على تحسين هذا الجانب في لوحة التحكم فوراً ⚡',
      'فهمت طلبك! جاري تحديث البيانات والمؤشرات... 📊',
      'ممتاز! سأقوم بتخصيص لوحة التحكم لتناسب احتياجاتك بالضبط 🎯',
      'هذا سؤال ذكي! دعني أظهر لك التحليل المناسب في الداش بورد 📈'
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)]
    };
  }, []);

  // Send message function with WebSocket integration
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
    if (isConnected) {
      const sent = sendWsMessage({
        type: 'user_message',
        text: currentMessage,
        agent: chatState.currentAgent,
        timestamp: new Date().toISOString()
      });

      if (!sent) {
        // Fallback to local response if WebSocket fails
        handleLocalResponse(currentMessage);
      }
    } else {
      // Fallback to local AI response
      handleLocalResponse(currentMessage);
    }
  }, [message, chatState.currentAgent, isConnected, sendWsMessage]);

  const handleLocalResponse = useCallback((userMessage: string) => {
    setTimeout(() => {
      const response = generateAIResponse(userMessage);
      
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
        response.commands.forEach(cmd => {
          console.log('Executing dashboard command:', cmd);
          dashboardCommandCallback(cmd);
        });
      }
    }, 1200);
  }, [generateAIResponse, chatState.currentAgent, dashboardCommandCallback]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  return {
    // Chat state
    messages: chatState.messages,
    currentAgent: chatState.currentAgent,
    isTyping: chatState.isTyping,
    isConnected: chatState.isConnected || isConnected,
    
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
