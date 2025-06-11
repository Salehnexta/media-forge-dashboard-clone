
import { useState, useRef, useEffect } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';
import { useMCPContext } from '@/contexts/MCPContext';
import { analyzeQuestion } from '@/utils/chatLogic';
import { chatWebSocketService } from '@/services/ChatWebSocketService';
import { generateCompanyDataResponse } from './chat/companyDataService';
import { generateAgentResponses } from './chat/responseGenerationService';

export const useChatLogic = () => {
  const [message, setMessage] = useState('');
  const [messages, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AIManager>('strategic');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { storeMemory, retrieveMemory, shareContext } = useMCPContext();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const checkConnection = () => {
      const connected = chatWebSocketService.isConnected();
      const state = chatWebSocketService.getConnectionState();
      setIsConnected(connected);
      setConnectionState(state);
    };

    const interval = setInterval(checkConnection, 1000);
    checkConnection();

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCommandSuggestions = () => {
    return [
      '/انتقل-للحملات',
      '/أظهر-الإحصائيات', 
      '/تحليل-الأداء',
      '/إنشاء-رسم-بياني',
      '/عرض-البيانات'
    ];
  };

  const setDashboardCommandCallback = (callback: (command: any) => void) => {
    console.log('Dashboard command callback set');
  };

  const generateContextualResponse = async (userMessage: string, agent: AIManager, memories: any[]) => {
    // Check for company data questions first
    const companyResponse = await generateCompanyDataResponse(userMessage);
    if (companyResponse) {
      return companyResponse;
    }

    // Agent-specific responses for other questions
    return generateAgentResponses(agent);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      manager: currentAgent
    };

    setChatHistory(prev => [...prev, userMessage]);
    const currentQuestion = message;
    setMessage('');
    setIsTyping(true);

    // Analyze question and determine appropriate agent
    const appropriateAgent = analyzeQuestion(currentQuestion);
    setCurrentAgent(appropriateAgent);

    try {
      await storeMemory(appropriateAgent, 'context', {
        type: 'user_message',
        message: currentQuestion,
        timestamp: new Date().toISOString()
      });

      setTimeout(async () => {
        try {
          const memories = await retrieveMemory(appropriateAgent, 'context');
          const contextualResponse = await generateContextualResponse(currentQuestion, appropriateAgent, memories);
          
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: contextualResponse.text,
            sender: 'ai',
            timestamp: new Date(),
            manager: appropriateAgent,
            actionButton: contextualResponse.actionButton
          };

          setChatHistory(prev => [...prev, aiResponse]);
          setIsTyping(false);

          await storeMemory(appropriateAgent, 'insight', {
            type: 'ai_response',
            message: contextualResponse.text,
            user_question: currentQuestion,
            timestamp: new Date().toISOString()
          });

          if (contextualResponse.shareWithAgents) {
            for (const agent of contextualResponse.shareWithAgents) {
              await shareContext(appropriateAgent, agent, {
                type: 'insight',
                data: contextualResponse.text,
                original_question: currentQuestion
              });
            }
          }
        } catch (error) {
          console.error('Error generating response:', error);
          setIsTyping(false);
        }
      }, 1500);
    } catch (error) {
      console.error('Error storing memory:', error);
      setIsTyping(false);
    }
  };

  return {
    message,
    setMessage,
    messages,
    setChatHistory,
    currentAgent,
    setCurrentAgent,
    isTyping,
    setIsTyping,
    isConnected,
    connectionState,
    messagesEndRef,
    handleSendMessage,
    getCommandSuggestions,
    setDashboardCommandCallback
  };
};
