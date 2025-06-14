
import { useState, useRef, useEffect, useCallback } from 'react';
import { externalAgentService, ChatRequest, ChatResponse } from '@/services/ExternalAgentService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agentId?: string;
  conversationId?: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
  suggestions?: string[];
}

export const useExternalAgentChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>();
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [dashboardCommandCallback, setDashboardCommandCallback] = useState<((command: any) => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Test connection to conversation agent on mount
  useEffect(() => {
    testAgentConnection();
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [messages]);

  const testAgentConnection = async () => {
    try {
      const conversationAgent = externalAgentService.getConversationAgent();
      if (!conversationAgent?.baseUrl) {
        setIsConnected(false);
        return;
      }

      // Test connection with a simple ping
      const response = await fetch(`${conversationAgent.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setIsConnected(response.ok);
    } catch (error) {
      console.error('Agent connection test failed:', error);
      setIsConnected(false);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      conversationId: currentConversationId
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = message;
    setMessage('');
    setIsTyping(true);

    try {
      const conversationAgent = externalAgentService.getConversationAgent();
      if (!conversationAgent) {
        throw new Error('Conversation agent not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const request: ChatRequest = {
        message: currentQuestion,
        userId: user.id,
        conversationId: currentConversationId,
        context: {
          timestamp: new Date().toISOString(),
          messageCount: messages.length
        }
      };

      const response: ChatResponse = await externalAgentService.sendMessage(
        conversationAgent.id,
        request
      );

      // Update conversation ID if this is a new conversation
      if (!currentConversationId) {
        setCurrentConversationId(response.conversationId);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
        agentId: response.agentId,
        conversationId: response.conversationId,
        suggestions: response.suggestions
      };

      // Handle actions from the agent
      if (response.actions && response.actions.length > 0) {
        const primaryAction = response.actions[0];
        aiMessage.actionButton = {
          label: primaryAction.label,
          action: () => handleAgentAction(primaryAction)
        };
      }

      setMessages(prev => [...prev, aiMessage]);

      // Store conversation in Supabase
      await storeConversationMessage(userMessage, aiMessage);

      // Notify dashboard if there are relevant commands
      if (dashboardCommandCallback && response.context?.dashboardUpdate) {
        dashboardCommandCallback(response.context.dashboardUpdate);
      }

    } catch (error) {
      console.error('Error sending message to agent:', error);
      toast.error('Failed to send message. Please check agent configuration.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error while processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        conversationId: currentConversationId
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [message, currentConversationId, messages.length, dashboardCommandCallback]);

  const handleAgentAction = (action: any) => {
    switch (action.type) {
      case 'dashboard_update':
        if (dashboardCommandCallback) {
          dashboardCommandCallback(action.payload);
        }
        break;
      case 'create_chart':
        if (dashboardCommandCallback) {
          dashboardCommandCallback({
            type: 'chart_created',
            chart: action.payload
          });
        }
        break;
      case 'redirect':
        window.location.href = action.payload.url;
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  };

  const storeConversationMessage = async (userMessage: ChatMessage, aiMessage: ChatMessage) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Store user message
      await supabase.from('conversation_messages').insert({
        conversation_id: currentConversationId,
        client_id: user.id,
        sender_id: user.id,
        sender_type: 'user',
        content: userMessage.text,
        metadata: {
          timestamp: userMessage.timestamp.toISOString()
        }
      });

      // Store AI message
      await supabase.from('conversation_messages').insert({
        conversation_id: currentConversationId,
        client_id: user.id,
        sender_id: aiMessage.agentId || 'conversation_agent',
        sender_type: 'agent',
        content: aiMessage.text,
        metadata: {
          timestamp: aiMessage.timestamp.toISOString(),
          suggestions: aiMessage.suggestions
        }
      });

    } catch (error) {
      console.error('Failed to store conversation:', error);
    }
  };

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(undefined);
  }, []);

  const getCommandSuggestions = useCallback(() => {
    return [
      'Show me campaign performance',
      'Create a new marketing strategy',
      'Analyze competitor data',
      'Generate content ideas',
      'Review social media metrics'
    ];
  }, []);

  return {
    messages,
    isTyping,
    isConnected,
    message,
    setMessage,
    handleSendMessage,
    setDashboardCommandCallback,
    messagesEndRef,
    getCommandSuggestions,
    clearChat,
    testAgentConnection,
    currentConversationId
  };
};
