
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Maximize2, Minimize2, Brain, ChevronDown } from 'lucide-react';
import { analyzeQuestion } from '@/utils/chatLogic';
import { generateDetailedResponse } from '@/utils/managerPersonalities';
import { AIManager, ChatMessage } from '@/types/morvo';
import { useMCPMemory } from '@/hooks/useMCPMemory';
import { useCrossAgentContext } from '@/hooks/useCrossAgentContext';
import { useRailwayIntegration } from '@/hooks/useRailwayIntegration';
import { toast } from 'sonner';

interface UniversalChatWidgetProps {
  className?: string;
  initialPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const UniversalChatWidget = ({ 
  className = '', 
  initialPosition = 'bottom-right' 
}: UniversalChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AIManager>('strategic');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { shareInsight } = useCrossAgentContext();
  const { memories } = useMCPMemory({ agentType: `M1_${currentAgent.toUpperCase()}` });
  const { executeAgent } = useRailwayIntegration();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    generateSuggestedQuestions();
  }, [currentAgent, memories]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateSuggestedQuestions = () => {
    const suggestions = {
      strategic: [
        'ما هي أفضل استراتيجية لشركتي؟',
        'كيف يمكنني تحليل المنافسين؟',
        'ما هي أهداف KPI المناسبة؟'
      ],
      monitor: [
        'كيف أداء وسائل التواصل الاجتماعي؟',
        'ما هو تحليل المشاعر الحالي؟',
        'كيف يمكنني تحسين التفاعل؟'
      ],
      executor: [
        'كيف يمكنني إنشاء حملة إعلانية؟',
        'ما هو أداء الحملات الحالية؟',
        'كيف أحسن معدل التحويل؟'
      ],
      creative: [
        'أريد أفكار محتوى جديدة',
        'كيف أنشئ استراتيجية محتوى؟',
        'ما هي أفضل أوقات النشر؟'
      ],
      analyst: [
        'أريد تقرير تحليلي شامل',
        'ما هي التوقعات المستقبلية؟',
        'كيف أقيس عائد الاستثمار؟'
      ]
    };
    setSuggestedQuestions(suggestions[currentAgent] || []);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Analyze question and route to appropriate agent
      const detectedAgent = analyzeQuestion(text);
      setCurrentAgent(detectedAgent);

      // Check for chart generation requests
      if (text.includes('رسم') || text.includes('مخطط') || text.includes('chart')) {
        await handleChartRequest(text, detectedAgent);
        return;
      }

      // Check for Railway agent execution requests
      if (text.includes('تحليل') || text.includes('تشغيل') || text.includes('وكيل')) {
        await handleRailwayExecution(text, detectedAgent);
        return;
      }

      // Generate contextual response using MCP memory
      const contextualResponse = await generateContextualResponse(text, detectedAgent);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: contextualResponse,
        sender: 'ai',
        timestamp: new Date(),
        manager: detectedAgent
      };

      setMessages(prev => [...prev, aiResponse]);

      // Share insight with other agents if valuable
      if (text.length > 50) {
        await shareInsight(detectedAgent, 'CROSS_AGENT', {
          question: text,
          response: contextualResponse,
          context: 'chat_interaction'
        });
      }

    } catch (error) {
      console.error('خطأ في المحادثة:', error);
      toast.error('حدث خطأ في معالجة الرسالة');
    } finally {
      setIsTyping(false);
    }
  };

  const generateContextualResponse = async (question: string, agent: AIManager) => {
    // Get relevant memories for context
    const relevantMemories = memories.slice(0, 3);
    const memoryContext = relevantMemories.map(m => m.content).join('\n');
    
    // Generate enhanced response with memory context
    const baseResponse = generateDetailedResponse(agent, question);
    
    if (memoryContext) {
      return `${baseResponse}\n\nبناءً على التحليلات السابقة:\n${memoryContext}`;
    }
    
    return baseResponse;
  };

  const handleChartRequest = async (request: string, agent: AIManager) => {
    setIsTyping(false);
    
    const response: ChatMessage = {
      id: Date.now().toString(),
      text: 'سأقوم بإنشاء الرسم البياني المطلوب...',
      sender: 'ai',
      timestamp: new Date(),
      manager: agent,
      actionButton: {
        label: 'عرض الرسم البياني',
        action: () => {
          // Navigate to charts section
          window.location.hash = '#charts';
          toast.success('تم الانتقال إلى قسم الرسوم البيانية');
        }
      }
    };
    
    setMessages(prev => [...prev, response]);
  };

  const handleRailwayExecution = async (request: string, agent: AIManager) => {
    try {
      const response: ChatMessage = {
        id: Date.now().toString(),
        text: 'سأقوم بتشغيل التحليل الذكي...',
        sender: 'ai',
        timestamp: new Date(),
        manager: agent,
        actionButton: {
          label: 'عرض النتائج',
          action: () => {
            window.location.hash = '#railway';
            toast.success('تم الانتقال إلى منصة Railway');
          }
        }
      };
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('خطأ في تشغيل Railway:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-4 left-4',
      'bottom-left': 'bottom-4 right-4',
      'top-right': 'top-4 left-4',
      'top-left': 'top-4 right-4'
    };
    return positions[initialPosition];
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed ${getPositionClasses()} z-50 rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 ${className}`}
        size="lg"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className={`fixed ${getPositionClasses()} z-50 shadow-2xl transition-all duration-300 ${
      isExpanded ? 'w-96 h-[32rem]' : 'w-80 h-96'
    } ${className}`}>
      <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <span className="font-medium">مساعد Morvo الذكي</span>
          <Badge variant="secondary" className="text-xs">
            {currentAgent}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-700 p-1"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-700 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-0 flex flex-col h-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 text-sm">مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border shadow-sm'
              }`}>
                <p className="text-sm">{message.text}</p>
                {message.actionButton && (
                  <Button
                    onClick={message.actionButton.action}
                    size="sm"
                    className="mt-2 w-full"
                    variant="outline"
                  >
                    {message.actionButton.label}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border shadow-sm p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 0 && suggestedQuestions.length > 0 && (
          <div className="p-3 border-t bg-white">
            <p className="text-xs text-gray-600 mb-2">أسئلة مقترحة:</p>
            <div className="space-y-1">
              {suggestedQuestions.slice(0, 2).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="w-full text-right text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب رسالتك..."
              className="flex-1 text-sm"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
