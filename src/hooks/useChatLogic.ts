import { useState, useRef, useEffect } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';
import { ContextualResponse } from '@/components/chat/types';
import { useMCPContext } from '@/contexts/MCPContext';
import { supabase } from '@/integrations/supabase/client';
import { analyzeQuestion } from '@/utils/chatLogic';
import { chatWebSocketService } from '@/services/ChatWebSocketService';

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
    // Monitor connection status
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
    // Store the callback for dashboard commands
    console.log('Dashboard command callback set');
  };

  const generateContextualResponse = async (userMessage: string, agent: AIManager, memories: any[]): Promise<ContextualResponse> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for company data questions first
    if (lowerMessage.includes('شركة') || lowerMessage.includes('اسم') || lowerMessage.includes('ملف') || lowerMessage.includes('بيانات') || lowerMessage.includes('معلومات')) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: company } = await supabase
            .from('companies')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (company) {
            return {
              text: `بناءً على بيانات ملفك الشخصي، اسم شركتك هو: **${company.name}**

🏢 **تفاصيل الشركة:**
- **الصناعة**: ${company.industry}
- **الموقع الإلكتروني**: ${company.website || 'غير محدد'}
- **الوصف**: ${company.description || 'غير محدد'}
- **السوق المستهدف**: ${company.primary_markets?.join(', ') || 'غير محدد'}
- **حجم الشركة**: ${company.size || 'غير محدد'}
- **سنة التأسيس**: ${company.founded || 'غير محدد'}

هل تريد تحديث أي من هذه المعلومات أو تحتاج تحليل استراتيجي للشركة؟`,
              actionButton: {
                label: 'تحديث بيانات الشركة',
                action: () => window.location.href = '/onboarding'
              }
            };
          } else {
            return {
              text: `لم أجد بيانات شركتك في النظام بعد. يمكنني مساعدتك في إعداد ملف شركتك الآن.

📝 **سأحتاج المعلومات التالية:**
- اسم الشركة
- نوع الصناعة
- الموقع الإلكتروني
- وصف مختصر عن الشركة
- السوق المستهدف
- حجم الشركة

هل تريد البدء في إعداد ملف شركتك؟`,
              actionButton: {
                label: 'إعداد ملف الشركة',
                action: () => window.location.href = '/onboarding'
              }
            };
          }
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
        return {
          text: `عذراً، حدث خطأ في استرجاع بيانات شركتك. يرجى المحاولة مرة أخرى أو التأكد من تسجيل الدخول بشكل صحيح.`
        };
      }
    }

    // Agent-specific responses for other questions
    const responses: Record<AIManager, ContextualResponse> = {
      strategic: {
        text: `مرحباً! أنا المدير الاستراتيجي في فريق Morvo. يمكنني مساعدتك في:

🎯 **التخطيط الاستراتيجي**: وضع الخطط طويلة المدى
📊 **تحليل السوق**: دراسة المنافسين والفرص
📈 **تحديد الأهداف**: وضع أهداف واضحة وقابلة للقياس
💡 **التطوير**: استراتيجيات النمو والتوسع

ما هو التحدي الرئيسي الذي تواجهه في شركتك حالياً؟`,
        actionButton: {
          label: 'تحليل استراتيجي شامل',
          action: () => window.location.href = '/ai-analysis'
        }
      },
      monitor: {
        text: `مرحباً! أنا مراقبة وسائل التواصل الاجتماعي. يمكنني مساعدتك في:

📱 **إدارة المنصات**: استراتيجيات للفيسبوك، انستغرام، تويتر، تيك توك
📊 **تحليل الأداء**: قياس التفاعل ومعدلات الوصول
🎯 **الاستهداف**: تحديد الجمهور المناسب لكل منصة
📝 **المحتوى**: أفكار منشورات تفاعلية وجذابة

أي منصة تركز عليها أكثر في التسويق؟`,
        actionButton: {
          label: 'تحليل وسائل التواصل',
          action: () => window.location.href = '/social-analytics'
        }
      },
      executor: {
        text: `أهلاً بك! أنا مدير الحملات الإعلانية. سأساعدك في:

🎯 **إعداد الحملات**: تخطيط وتنفيذ حملات فعالة
💰 **إدارة الميزانية**: تحسين العائد على الاستثمار
📊 **قياس الأداء**: تتبع المؤشرات المهمة
🔄 **التحسين المستمر**: تطوير الحملات بناءً على النتائج

ما نوع الحملة التي تخطط لتنفيذها؟`,
        actionButton: {
          label: 'إعداد حملة جديدة',
          action: () => window.location.href = '/campaigns'
        }
      },
      creative: {
        text: `مرحباً! أنا مبدعة المحتوى. سأساعدك في إنتاج محتوى مميز:

✨ **أفكار إبداعية**: مفاهيم جديدة ومبتكرة
🎨 **التصميم**: عناصر بصرية جذابة
📝 **الكتابة**: نصوص مؤثرة ومقنعة
🎬 **المحتوى المرئي**: فيديوهات وصور احترافية

ما نوع المحتوى الذي تحتاجه لعلامتك التجارية؟`,
        actionButton: {
          label: 'إنتاج محتوى إبداعي',
          action: () => window.location.href = '/content'
        }
      },
      analyst: {
        text: `مرحباً! أنا محلل البيانات. سأساعدك في فهم أرقامك بوضوح:

📊 **تحليل البيانات**: استخراج رؤى قيمة من أرقامك
📈 **التقارير**: إعداد تقارير مفصلة وواضحة
🎯 **مؤشرات الأداء**: تحديد KPIs المناسبة لعملك
🔮 **التوقعات**: نماذج تنبؤية للنمو

ما نوع البيانات التي تريد تحليلها؟`,
        actionButton: {
          label: 'تحليل البيانات',
          action: () => window.location.href = '/analytics'
        }
      }
    };

    return responses[agent] || responses.strategic;
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
