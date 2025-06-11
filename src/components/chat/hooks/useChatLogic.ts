import { useState, useRef, useEffect } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';
import { ContextualResponse } from '../types';
import { useMCPContext } from '@/contexts/MCPContext';
import { supabase } from '@/integrations/supabase/client';
import { analyzeQuestion } from '@/utils/chatLogic';

export const useChatLogic = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AIManager>('strategic');
  const [isTyping, setIsTyping] = useState(false);
  const [campaignCreationStep, setCampaignCreationStep] = useState<number>(0);
  const [campaignData, setCampaignData] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { storeMemory, retrieveMemory, shareContext } = useMCPContext();

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const detectCampaignCreationIntent = (userMessage: string): boolean => {
    const campaignKeywords = [
      'أنشئ حملة',
      'إنشاء حملة', 
      'حملة تسويقية',
      'حملة إعلانية',
      'حملة جديدة',
      'أريد حملة',
      'أبدأ حملة'
    ];
    
    return campaignKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const generateCampaignCreationResponse = (step: number, userData?: any): ContextualResponse => {
    const steps = [
      {
        question: "ممتاز! دعني أساعدك في إنشاء حملة تسويقية فعالة. 🎯\n\nما هو الهدف الرئيسي من هذه الحملة؟",
        options: ['زيادة الوعي بالعلامة التجارية', 'زيادة المبيعات', 'جذب عملاء جدد', 'تفاعل أكثر على وسائل التواصل'],
        field: 'objective'
      },
      {
        question: "رائع! الآن، ما هي ميزانيتك المخصصة لهذه الحملة؟ 💰",
        options: ['أقل من 1000 ريال', '1000 - 5000 ريال', '5000 - 15000 ريال', 'أكثر من 15000 ريال'],
        field: 'budget'
      },
      {
        question: "ممتاز! أي منصات تريد التركيز عليها في هذه الحملة؟ 📱",
        options: ['فيسبوك وإنستغرام', 'جوجل وبحث', 'لينكد إن', 'تيك توك', 'جميع المنصات'],
        field: 'platforms'
      },
      {
        question: "مثالي! كم مدة الحملة التي تفضلها؟ ⏰",
        options: ['أسبوع واحد', 'أسبوعين', 'شهر كامل', '3 شهور'],
        field: 'duration'
      },
      {
        question: "ممتاز! من هو جمهورك المستهدف؟ 👥",
        options: ['الشباب (18-30)', 'البالغون (30-45)', 'كبار السن (45+)', 'جميع الأعمار'],
        field: 'audience'
      }
    ];

    if (step < steps.length) {
      const currentStep = steps[step];
      return {
        text: currentStep.question,
        actionButton: {
          label: 'اختر من الخيارات',
          action: () => console.log('Show options')
        },
        stepData: {
          step,
          field: currentStep.field,
          options: currentStep.options
        }
      };
    } else {
      // Generate final campaign preview
      return {
        text: `🎉 تم إنشاء حملتك التسويقية بنجاح!

📊 **ملخص الحملة:**
- **الهدف**: ${campaignData.objective || 'غير محدد'}
- **الميزانية**: ${campaignData.budget || 'غير محددة'}
- **المنصات**: ${campaignData.platforms || 'غير محددة'}
- **المدة**: ${campaignData.duration || 'غير محددة'}
- **الجمهور**: ${campaignData.audience || 'غير محدد'}

🚀 **التوقعات:**
- معدل وصول متوقع: 15,000 - 25,000 شخص
- تفاعل متوقع: 500 - 800 تفاعل
- عائد استثمار متوقع: 150% - 200%

هل تريد حفظ هذه الحملة وبدء تنفيذها؟`,
        actionButton: {
          label: 'حفظ وتنفيذ الحملة',
          action: () => saveCampaign()
        }
      };
    }
  };

  const saveCampaign = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('marketing_campaigns')
          .insert({
            name: `حملة ${campaignData.objective || 'تسويقية'} - ${new Date().toLocaleDateString('ar-SA')}`,
            description: `حملة ${campaignData.objective} للجمهور ${campaignData.audience} لمدة ${campaignData.duration}`,
            budget: parseBudget(campaignData.budget),
            target_market: campaignData.audience,
            status: 'draft',
            user_id: user.id,
            goals: { objective: campaignData.objective },
            performance_data: { platforms: campaignData.platforms, duration: campaignData.duration }
          });

        if (!error) {
          console.log('Campaign saved successfully');
          // Reset campaign creation state
          setCampaignCreationStep(0);
          setCampaignData({});
        }
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const parseBudget = (budgetText: string): number => {
    if (budgetText?.includes('1000')) return 500;
    if (budgetText?.includes('5000')) return 3000;
    if (budgetText?.includes('15000')) return 10000;
    if (budgetText?.includes('أكثر')) return 20000;
    return 1000;
  };

  const generateContextualResponse = async (userMessage: string, agent: AIManager, memories: any[]): Promise<ContextualResponse> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for campaign creation intent
    if (detectCampaignCreationIntent(userMessage)) {
      setCampaignCreationStep(1);
      return generateCampaignCreationResponse(0);
    }

    // Handle campaign creation steps
    if (campaignCreationStep > 0) {
      // Save user response to campaign data
      const steps = ['objective', 'budget', 'platforms', 'duration', 'audience'];
      const currentField = steps[campaignCreationStep - 1];
      setCampaignData(prev => ({ ...prev, [currentField]: userMessage }));
      
      const nextStep = campaignCreationStep + 1;
      setCampaignCreationStep(nextStep);
      
      if (nextStep <= 5) {
        return generateCampaignCreationResponse(nextStep - 1, { [currentField]: userMessage });
      } else {
        return generateCampaignCreationResponse(5);
      }
    }
    
    // Check for company data questions
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
- **الأسواق المستهدفة**: ${company.primary_markets?.join(', ') || 'غير محدد'}
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

💼 **إنشاء الحملات**: قل "أنشئ حملة تسويقية" وسأقوم بمساعدتك خطوة بخطوة

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
    handleSendMessage,
    campaignCreationStep,
    campaignData
  };
};
