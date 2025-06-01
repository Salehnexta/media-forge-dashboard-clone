
import { useState, useRef, useEffect } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';
import { ContextualResponse } from '../types';
import { useMCPContext } from '@/contexts/MCPContext';
import { supabase } from '@/integrations/supabase/client';

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

  const analyzeQuestion = (question: string): AIManager => {
    const lowerQuestion = question.toLowerCase();
    
    // تحليل نوع السؤال وتوجيهه للوكيل المناسب
    if (lowerQuestion.includes('شركة') || lowerQuestion.includes('اسم') || lowerQuestion.includes('ملف') || lowerQuestion.includes('بيانات')) {
      return 'strategic';
    }
    if (lowerQuestion.includes('سوشال') || lowerQuestion.includes('تواصل') || lowerQuestion.includes('فيسبوك') || lowerQuestion.includes('انستغرام')) {
      return 'monitor';
    }
    if (lowerQuestion.includes('حملة') || lowerQuestion.includes('إعلان') || lowerQuestion.includes('ترويج')) {
      return 'executor';
    }
    if (lowerQuestion.includes('محتوى') || lowerQuestion.includes('كتابة') || lowerQuestion.includes('تصميم') || lowerQuestion.includes('فيديو')) {
      return 'creative';
    }
    if (lowerQuestion.includes('تحليل') || lowerQuestion.includes('بيانات') || lowerQuestion.includes('أرقام') || lowerQuestion.includes('تقرير')) {
      return 'analyst';
    }
    
    return currentAgent; // إذا لم يتم تحديد نوع واضح، استخدم الوكيل الحالي
  };

  const generateContextualResponse = async (userMessage: string, agent: AIManager, memories: any[]): Promise<ContextualResponse> => {
    // إجابات ذكية مخصصة حسب نوع السؤال
    const lowerMessage = userMessage.toLowerCase();
    
    // استرجاع بيانات الشركة إذا كان السؤال عنها
    if (lowerMessage.includes('شركة') || lowerMessage.includes('اسم') || lowerMessage.includes('ملف')) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: company } = await supabase
            .from('company_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (company) {
            return {
              text: `بناءً على بيانات ملفك الشخصي، اسم شركتك هو: **${company.company_name}**

🏢 **تفاصيل الشركة:**
- **الصناعة**: ${company.industry}
- **الموقع الإلكتروني**: ${company.website_url || 'غير محدد'}
- **الوصف**: ${company.company_description || 'غير محدد'}
- **السوق المستهدف**: ${company.target_markets?.join(', ') || 'غير محدد'}

هل تريد تحديث أي من هذه المعلومات أو تحتاج تحليل استراتيجي للشركة؟`,
              actionButton: {
                label: 'تحديث بيانات الشركة',
                action: () => console.log('Update company data')
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

هل تريد البدء في إعداد ملف شركتك؟`,
              actionButton: {
                label: 'إعداد ملف الشركة',
                action: () => console.log('Setup company profile')
              }
            };
          }
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    }

    // إجابات متخصصة حسب الوكيل
    const responses: Record<AIManager, ContextualResponse> = {
      strategic: {
        text: `كمستشار استراتيجي، أفهم احتياجك. دعني أساعدك بخبرتي في التخطيط الاستراتيجي:

🎯 **تحليل الوضع الحالي**: سأحتاج لفهم وضع شركتك والتحديات الحالية
📊 **تحديد الأهداف**: وضع أهداف واضحة وقابلة للقياس
📈 **الاستراتيجية**: تطوير خطة عمل شاملة ومرحلية
💡 **التنفيذ**: آليات التطبيق ومتابعة النتائج

ما هو التحدي الرئيسي الذي تواجهه في شركتك حالياً؟`,
        actionButton: {
          label: 'تحليل استراتيجي شامل',
          action: () => console.log('Strategic analysis')
        }
      },
      monitor: {
        text: `مرحباً! كخبيرة في وسائل التواصل الاجتماعي، يمكنني مساعدتك في:

📱 **إدارة المنصات**: استراتيجيات للفيسبوك، انستغرام، تويتر، تيك توك
📊 **تحليل الأداء**: قياس التفاعل ومعدلات الوصول
🎯 **الاستهداف**: تحديد الجمهور المناسب لكل منصة
📝 **المحتوى**: أفكار منشورات تفاعلية وجذابة

أي منصة تركز عليها أكثر في التسويق؟`,
        actionButton: {
          label: 'تحليل وسائل التواصل',
          action: () => console.log('Social media analysis')
        }
      },
      executor: {
        text: `أهلاً بك! كمدير حملات إعلانية، سأساعدك في تحقيق أفضل النتائج:

🎯 **إعداد الحملات**: تخطيط وتنفيذ حملات فعالة
💰 **إدارة الميزانية**: تحسين العائد على الاستثمار
📊 **قياس الأداء**: تتبع المؤشرات المهمة
🔄 **التحسين المستمر**: تطوير الحملات بناءً على النتائج

ما نوع الحملة التي تخطط لتنفيذها؟`,
        actionButton: {
          label: 'إعداد حملة جديدة',
          action: () => console.log('Create campaign')
        }
      },
      creative: {
        text: `مرحباً! كمبدعة محتوى، سأساعدك في إنتاج محتوى مميز:

✨ **أفكار إبداعية**: مفاهيم جديدة ومبتكرة
🎨 **التصميم**: عناصر بصرية جذابة
📝 **الكتابة**: نصوص مؤثرة ومقنعة
🎬 **المحتوى المرئي**: فيديوهات وصور احترافية

ما نوع المحتوى الذي تحتاجينه لعلامتك التجارية؟`,
        actionButton: {
          label: 'إنتاج محتوى إبداعي',
          action: () => console.log('Create content')
        }
      },
      analyst: {
        text: `مرحباً! كمحلل بيانات، سأساعدك في فهم أرقامك بوضوح:

📊 **تحليل البيانات**: استخراج رؤى قيمة من أرقامك
📈 **التقارير**: إعداد تقارير مفصلة وواضحة
🎯 **مؤشرات الأداء**: تحديد KPIs المناسبة لعملك
🔮 **التوقعات**: نماذج تنبؤية للنمو

ما نوع البيانات التي تريد تحليلها؟`,
        actionButton: {
          label: 'تحليل البيانات',
          action: () => console.log('Analyze data')
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

    // تحليل السؤال وتحديد الوكيل المناسب
    const appropriateAgent = analyzeQuestion(currentQuestion);
    setCurrentAgent(appropriateAgent);

    await storeMemory(appropriateAgent, 'context', {
      type: 'user_message',
      message: currentQuestion,
      timestamp: new Date().toISOString()
    });

    setTimeout(async () => {
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
