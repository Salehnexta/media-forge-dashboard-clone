
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChatWidgetProps } from './types';
import { useChatLogic } from './hooks/useChatLogic';
import { MinimizedView } from './components/MinimizedView';
import { ChatHeader } from './components/ChatHeader';
import { AgentSelector } from './components/AgentSelector';
import { WelcomeMessage } from './components/WelcomeMessage';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';

export const UniversalChatWidget = ({ className }: ChatWidgetProps) => {
  const {
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    message,
    setMessage,
    chatHistory,
    currentAgent,
    setCurrentAgent,
    isTyping,
    messagesEndRef,
    handleSendMessage
  } = useChatLogic();

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
  };

  // Don't render anything since chat services are delivered from the sidebar
  return null;
};
