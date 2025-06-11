
import { useMCPContext } from '@/contexts/MCPContext';
import { analyzeQuestion } from '@/utils/chatLogic';
import { useChatState } from '@/hooks/chat/useChatState';
import { detectCampaignCreationIntent, generateCampaignCreationResponse } from '@/hooks/chat/campaignCreationService';
import { generateCompanyDataResponse } from '@/hooks/chat/companyDataService';
import { generateAgentResponses } from '@/hooks/chat/responseGenerationService';
import { ContextualResponse } from '../types';
import { AIManager, ChatMessage } from '@/types/morvo';

export const useChatLogic = () => {
  const chatState = useChatState();
  const { storeMemory, retrieveMemory, shareContext } = useMCPContext();

  const generateContextualResponse = async (userMessage: string, agent: AIManager, memories: any[]): Promise<ContextualResponse> => {
    // Check for campaign creation intent
    if (detectCampaignCreationIntent(userMessage)) {
      chatState.setCampaignCreationStep(1);
      return generateCampaignCreationResponse(0);
    }

    // Handle campaign creation steps
    if (chatState.campaignCreationStep > 0) {
      const steps = ['objective', 'budget', 'platforms', 'duration', 'audience'];
      const currentField = steps[chatState.campaignCreationStep - 1];
      chatState.setCampaignData(prev => ({ ...prev, [currentField]: userMessage }));
      
      const nextStep = chatState.campaignCreationStep + 1;
      chatState.setCampaignCreationStep(nextStep);
      
      if (nextStep <= 5) {
        return generateCampaignCreationResponse(nextStep - 1, { [currentField]: userMessage });
      } else {
        return generateCampaignCreationResponse(5);
      }
    }
    
    // Check for company data questions
    const companyResponse = await generateCompanyDataResponse(userMessage);
    if (companyResponse) {
      return companyResponse;
    }

    // Agent-specific responses for other questions
    return generateAgentResponses(agent);
  };

  const handleSendMessage = async () => {
    if (!chatState.message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatState.message,
      sender: 'user',
      timestamp: new Date(),
      manager: chatState.currentAgent
    };

    chatState.setChatHistory(prev => [...prev, userMessage]);
    const currentQuestion = chatState.message;
    chatState.setMessage('');
    chatState.setIsTyping(true);

    // Analyze question and determine appropriate agent
    const appropriateAgent = analyzeQuestion(currentQuestion);
    chatState.setCurrentAgent(appropriateAgent);

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

          chatState.setChatHistory(prev => [...prev, aiResponse]);
          chatState.setIsTyping(false);

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
          chatState.setIsTyping(false);
        }
      }, 1500);
    } catch (error) {
      console.error('Error storing memory:', error);
      chatState.setIsTyping(false);
    }
  };

  return {
    ...chatState,
    handleSendMessage
  };
};
