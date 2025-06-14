
import { useState, useRef, useEffect, useCallback } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';
import { useMorvoChat } from '@/hooks/useMorvoChat';

export const useChatLogic = () => {
  const {
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
  } = useMorvoChat();

  const [currentAgent, setCurrentAgent] = useState<AIManager>('strategic');
  const [message, setMessage] = useState('');
  const [dashboardCommandCallback, setDashboardCommandCallback] = useState<((command: any) => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [messages]);

  const getCommandSuggestions = useCallback(() => {
    return [
      'أريد عرض بيانات الحملات',
      'أظهر لي المبيعات',
      'عرض تحليل شامل',
      'أريد رسم بياني للأداء',
      'تحليل العملاء'
    ];
  }, []);

  const connectionState = {
    status: connectionStatus.isConnected ? 'connected' : 'disconnected',
    lastCheck: new Date()
  };

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }, [message, sendMessage]);

  return {
    messages,
    currentAgent,
    isTyping,
    isConnected: connectionStatus.isConnected,
    message,
    setMessage,
    handleSendMessage,
    setCurrentAgent,
    setDashboardCommandCallback,
    messagesEndRef,
    getCommandSuggestions,
    connectionState
  };
};
