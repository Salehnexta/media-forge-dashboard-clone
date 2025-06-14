
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, Agent, ConnectionStatus, ConversationStats } from '@/types/morvoChat';
import MorvoAIService from '@/services/MorvoAIService';
import { toast } from 'sonner';

export const useMorvoChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    lastChecked: new Date()
  });
  const [conversationId] = useState(() => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Load conversation history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`morvo_conversation_${conversationId}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      }
    }
  }, [conversationId]);

  // Save conversation to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`morvo_conversation_${conversationId}`, JSON.stringify(messages));
    }
  }, [messages, conversationId]);

  // Check connection status
  const checkConnection = useCallback(async () => {
    try {
      const isHealthy = await MorvoAIService.healthCheck();
      setConnectionStatus({
        isConnected: isHealthy,
        lastChecked: new Date(),
        error: isHealthy ? undefined : 'فشل في فحص الصحة'
      });
      return isHealthy;
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'فشل في الاتصال'
      });
      return false;
    }
  }, []);

  // Load agents
  const loadAgents = useCallback(async () => {
    try {
      const agentsList = await MorvoAIService.getAgents();
      setAgents(agentsList);
    } catch (error) {
      console.error('Failed to load agents:', error);
      toast.error('فشل في تحميل قائمة الوكلاء');
    }
  }, []);

  // Initialize
  useEffect(() => {
    checkConnection();
    loadAgents();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [checkConnection, loadAgents]);

  // Send message
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      conversationId
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const startTime = Date.now();
      const response = await MorvoAIService.sendMessage(text, conversationId, selectedAgent);
      const endTime = Date.now();

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
        agentsInvolved: response.agents_involved,
        processingTime: response.processing_time || (endTime - startTime) / 1000,
        costTracking: response.cost_tracking,
        conversationId
      };

      setMessages(prev => [...prev, aiMessage]);
      toast.success('تم إرسال الرسالة بنجاح');
      
    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        text: getErrorMessage(error),
        sender: 'ai',
        timestamp: new Date(),
        conversationId,
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
      toast.error('فشل في إرسال الرسالة');
      
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [conversationId, selectedAgent]);

  // Retry failed message
  const retryMessage = useCallback(async (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message || message.sender !== 'user') return;

    // Find the previous user message
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    // Remove error messages after this user message
    setMessages(prev => prev.slice(0, messageIndex + 1));
    
    // Retry sending
    await sendMessage(message.text);
  }, [messages, sendMessage]);

  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(`morvo_conversation_${conversationId}`);
    toast.success('تم مسح المحادثة');
  }, [conversationId]);

  // Calculate conversation stats
  const conversationStats: ConversationStats = {
    totalMessages: messages.length,
    totalCost: messages.reduce((sum, msg) => sum + (msg.costTracking?.total_cost || 0), 0),
    totalTokens: messages.reduce((sum, msg) => sum + (msg.costTracking?.tokens_used || 0), 0),
    averageProcessingTime: messages.filter(msg => msg.processingTime).reduce((sum, msg) => sum + (msg.processingTime || 0), 0) / messages.filter(msg => msg.processingTime).length || 0
  };

  return {
    messages,
    agents,
    selectedAgent,
    setSelectedAgent,
    isLoading,
    isTyping,
    connectionStatus,
    conversationStats,
    sendMessage,
    retryMessage,
    clearChat,
    checkConnection
  };
};

// Helper function to get user-friendly error messages in Arabic
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'غير قادر على الاتصال بـ Morvo AI. يرجى التحقق من اتصالك.';
    }
    if (error.message.includes('timeout') || error.name === 'AbortError') {
      return 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.';
    }
    if (error.message.includes('HTTP 500')) {
      return 'Morvo AI غير متاح مؤقتاً. يرجى المحاولة مرة أخرى.';
    }
    if (error.message.includes('HTTP 404')) {
      return 'الخدمة غير موجودة. يرجى التحقق من الإعدادات.';
    }
    return `خطأ: ${error.message}`;
  }
  return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
};
