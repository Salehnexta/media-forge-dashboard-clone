
import { useState, useRef, useEffect } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';

export const useChatState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AIManager>('strategic');
  const [isTyping, setIsTyping] = useState(false);
  const [campaignCreationStep, setCampaignCreationStep] = useState<number>(0);
  const [campaignData, setCampaignData] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    message,
    setMessage,
    chatHistory,
    setChatHistory,
    currentAgent,
    setCurrentAgent,
    isTyping,
    setIsTyping,
    campaignCreationStep,
    setCampaignCreationStep,
    campaignData,
    setCampaignData,
    messagesEndRef
  };
};
