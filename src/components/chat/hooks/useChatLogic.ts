
import { useState, useRef, useEffect } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';
import { ContextualResponse } from '../types';
import { useMCPContext } from '@/contexts/MCPContext';

export const useChatLogic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AIManager>('strategic');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { storeMemory, retrieveMemory, shareContext } = useMCPContext();

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateContextualResponse = (userMessage: string, agent: AIManager, memories: any[]): ContextualResponse => {
    if (userMessage.includes('/رسم') || userMessage.includes('أنشئ رسم') || userMessage.includes('اعرض')) {
      return generateChartResponse(userMessage, agent);
    }

    const responses: Record<AIManager, ContextualResponse> = {
      strategic: {
        text: `بناءً على تحليل الوضع الحالي وسياق المحادثات السابقة، أنصح بالتركيز على تطوير استراتيجية تسويقية متكاملة تأخذ في الاعتبار نقاط القوة والضعف الحالية. يمكنني مساعدتك في تحديد الأولويات وإنشاء خطة عمل محددة.`,
        actionButton: {
          label: 'إنشاء استراتيجية',
          action: () => console.log('Creating strategy...')
        },
        shareWithAgents: ['analyst', 'executor']
      },
      monitor: {
        text: `من خلال مراجعة البيانات المتاحة والسياق السابق، يبدو أن هناك نقاط تحتاج متابعة. سأقوم بإنشاء تقرير مفصل يتضمن المؤشرات الحالية والتوصيات للتحسين.`,
        actionButton: {
          label: 'عرض التقرير',
          action: () => console.log('Showing report...')
        }
      },
      executor: {
        text: `بناءً على الاستراتيجية المقترحة والتحليلات السابقة، يمكنني مساعدتك في تنفيذ حملة فعالة. سأحتاج لبعض التفاصيل الإضافية حول الجمهور المستهدف والميزانية المتاحة.`,
        actionButton: {
          label: 'بدء الحملة',
          action: () => console.log('Starting campaign...')
        }
      },
      creative: {
        text: `استناداً إلى الاتجاهات الحالية وسياق عملك، لدي عدة أفكار إبداعية مميزة. سأقوم بإنتاج محتوى يتماشى مع هوية علامتك التجارية ويجذب جمهورك المستهدف.`,
        actionButton: {
          label: 'إنتاج المحتوى',
          action: () => console.log('Creating content...')
        }
      },
      analyst: {
        text: `بعد تحليل البيانات المتاحة والسياق التاريخي، تظهر النتائج اتجاهات مثيرة للاهتمام. سأقوم بإنشاء تقرير تحليلي شامل مع توقعات مستقبلية ورؤى قابلة للتنفيذ.`,
        actionButton: {
          label: 'عرض التحليل',
          action: () => console.log('Showing analysis...')
        },
        shareWithAgents: ['strategic', 'monitor']
      }
    };

    return responses[agent] || responses.strategic;
  };

  const generateChartResponse = (userMessage: string, agent: AIManager): ContextualResponse => {
    return {
      text: `ممتاز! سأقوم بإنشاء الرسم البياني المطلوب بناءً على البيانات المتاحة. سيتضمن الرسم تحليلاً تفاعلياً يمكنك استخدامه لاتخاذ قرارات مدروسة.

📊 **نوع الرسم**: ${userMessage.includes('دائري') ? 'رسم دائري' : userMessage.includes('أعمدة') ? 'رسم أعمدة' : 'رسم بياني متقدم'}
🎯 **البيانات**: ستُحدث تلقائياً من مصادرك المتصلة
📈 **التحليل**: يشمل الاتجاهات والرؤى الذكية`,
      actionButton: {
        label: 'إنشاء الرسم البياني',
        action: () => console.log('Creating chart...')
      }
    };
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
    setMessage('');
    setIsTyping(true);

    await storeMemory(currentAgent, 'context', {
      type: 'user_message',
      message: message,
      timestamp: new Date().toISOString()
    });

    setTimeout(async () => {
      const memories = await retrieveMemory(currentAgent, 'context');
      const contextualResponse = generateContextualResponse(message, currentAgent, memories);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: contextualResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        manager: currentAgent,
        actionButton: contextualResponse.actionButton
      };

      setChatHistory(prev => [...prev, aiResponse]);
      setIsTyping(false);

      await storeMemory(currentAgent, 'insight', {
        type: 'ai_response',
        message: contextualResponse.text,
        user_question: message,
        timestamp: new Date().toISOString()
      });

      if (contextualResponse.shareWithAgents) {
        for (const agent of contextualResponse.shareWithAgents) {
          await shareContext(currentAgent, agent, {
            type: 'insight',
            data: contextualResponse.text,
            original_question: message
          });
        }
      }
    }, 1500);
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
    messagesEndRef,
    handleSendMessage
  };
};
