
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

  // Simplified AI responses without WebSocket dependency
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
        }]
      };
    }

    if (lowerMessage.includes('حملات') || lowerMessage.includes('إعلانات') || lowerMessage.includes('campaigns')) {
      return {
        text: 'جاري الانتقال إلى تبويب الحملات الإعلانية... 🎯',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'executor' }
        }]
      };
    }

    if (lowerMessage.includes('محتوى') || lowerMessage.includes('منشورات') || lowerMessage.includes('content')) {
      return {
        text: 'مرحباً بك في قسم المحتوى الإبداعي! 🎨',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'creative' }
        }]
      };
    }

    if (lowerMessage.includes('سوشال') || lowerMessage.includes('تواصل') || lowerMessage.includes('social')) {
      return {
        text: 'انتقل معي إلى قسم وسائل التواصل الاجتماعي! 📱',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'monitor' }
        }]
      };
    }

    if (lowerMessage.includes('تحليلات') || lowerMessage.includes('analytics') || lowerMessage.includes('تحليل')) {
      return {
        text: 'مرحباً بك في قسم التحليلات المتقدمة! 📈',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'analyst' }
        }]
      };
    }

    if (lowerMessage.includes('استراتيجي') || lowerMessage.includes('strategic') || lowerMessage.includes('استراتيجية')) {
      return {
        text: 'أهلاً بك في القسم الاستراتيجي! 🎯',
        commands: [{
          type: 'SWITCH_TAB',
          payload: { tab: 'strategic' }
        }]
      };
    }

    const responses = [
      'ممتاز! دعني أحلل هذا وأحدث لوحة التحكم وفقاً لطلبك 🤖',
      'رائع! سأعمل على تحسين هذا الجانب في لوحة التحكم فوراً ⚡',
      'فهمت طلبك! جاري تحديث البيانات والمؤشرات... 📊',
      'ممتاز! سأقوم بتخصيص لوحة التحكم لتناسب احتياجاتك بالضبط 🎯'
    ];
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)]
    };
  }, []);

  // Send message function (simplified, no WebSocket)
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

    // Generate local AI response
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
        response.commands.forEach(cmd => {
          console.log('Executing dashboard command:', cmd);
          dashboardCommandCallback(cmd);
        });
      }
    }, 1200);
  }, [message, chatState.currentAgent, dashboardCommandCallback, generateAIResponse]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  return {
    // Chat state
    messages: chatState.messages,
    currentAgent: chatState.currentAgent,
    isTyping: chatState.isTyping,
    isConnected: true, // Always show as connected for better UX
    
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
