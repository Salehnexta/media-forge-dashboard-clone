
import { useState, useRef, useEffect, useCallback } from 'react';
import { AIManager, ChatMessage } from '@/types/morvo';
import { useChartCommands } from './useChartCommands';

export const useChatLogic = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AIManager>('strategic');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected] = useState(true);
  const [message, setMessage] = useState('');
  const [dashboardCommandCallback, setDashboardCommandCallback] = useState<((command: any) => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { executeChartCommand } = useChartCommands();

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [messages]);

  // Add missing methods
  const getCommandSuggestions = useCallback(() => {
    return [
      'أريد عرض بيانات الحملات',
      'أظهر لي المبيعات',
      'عرض تحليل شامل',
      'أريد رسم بياني للأداء',
      'تحليل العملاء'
    ];
  }, []);

  const connectionState = {
    status: isConnected ? 'connected' : 'disconnected',
    lastCheck: new Date()
  };

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      manager: currentAgent
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = message;
    setMessage('');
    setIsTyping(true);

    try {
      // فحص ما إذا كانت الرسالة تحتوي على طلب رسم بياني أو تحليل
      const chartResult = await executeChartCommand(currentQuestion);
      
      let aiResponseText = '';
      let actionButton = undefined;

      if (chartResult) {
        if (chartResult.success) {
          aiResponseText = `✅ ${chartResult.message}\n\nيمكنك الآن رؤية التحليل في لوحة التحكم أدناه. هل تريد إضافة المزيد من التحليلات أو الرسوم البيانية؟`;
          
          // إشعار لوحة التحكم بوجود رسم بياني جديد
          if (dashboardCommandCallback) {
            dashboardCommandCallback({
              type: 'chart_created',
              chart: chartResult.chart
            });
          }
        } else {
          aiResponseText = `❌ ${chartResult.message}`;
        }
      } else {
        // رد عادي إذا لم يكن طلب رسم بياني
        aiResponseText = generateNormalResponse(currentQuestion, currentAgent);
      }

      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          sender: 'ai',
          timestamp: new Date(),
          manager: currentAgent,
          actionButton
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      console.error('Error handling message:', error);
      setIsTyping(false);
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
        sender: 'ai',
        timestamp: new Date(),
        manager: currentAgent
      };
      
      setMessages(prev => [...prev, errorResponse]);
    }
  }, [message, currentAgent, executeChartCommand, dashboardCommandCallback]);

  return {
    messages,
    currentAgent,
    isTyping,
    isConnected,
    message,
    setMessage,
    handleSendMessage,
    setCurrentAgent,
    setDashboardCommandCallback,
    messagesEndRef,
    getCommandSuggestions,
    connectionState
  };
};

// توليد رد عادي للرسائل التي لا تحتوي على طلبات رسوم بيانية
const generateNormalResponse = (userMessage: string, agent: AIManager): string => {
  const lowerMessage = userMessage.toLowerCase();

  // ردود متعلقة بالحملات والمبيعات
  if (lowerMessage.includes('حملة') || lowerMessage.includes('حملات')) {
    return 'يمكنني مساعدتك في تحليل الحملات التسويقية. قل "أريد عرض بيانات الحملات" لإنشاء رسم بياني تفاعلي.';
  }
  
  if (lowerMessage.includes('مبيعات') || lowerMessage.includes('مبيع')) {
    return 'يمكنني إنشاء تقارير مفصلة عن المبيعات. جرب أن تقول "أظهر لي أداء المبيعات" لعرض الإحصائيات.';
  }

  if (lowerMessage.includes('تحليل') || lowerMessage.includes('إحصائيات')) {
    return 'أستطيع إنشاء تحليلات مرئية لأي نوع من البيانات. اطلب مني "عرض تحليل شامل" أو حدد نوع البيانات التي تريد تحليلها.';
  }

  // ردود عامة حسب نوع المدير
  switch (agent) {
    case 'strategic':
      return 'أنا هنا لمساعدتك في التخطيط الاستراتيجي وتحليل البيانات. يمكنني إنشاء رؤى تساعد في اتخاذ القرارات الاستراتيجية.';
    
    case 'creative':
      return 'دعني أساعدك في الجانب الإبداعي! يمكنني تحليل أداء المحتوى وتقديم اقتراحات إبداعية مع الرسوم البيانية التوضيحية.';
    
    case 'analyst':
      return 'سأقوم بتحليل أي نوع من البيانات بعمق. أخبرني ما نوع التحليل الذي تحتاجه وسأنشئ لك التقارير والرسوم البيانية المناسبة.';
    
    default:
      return 'كيف يمكنني مساعدتك اليوم؟ يمكنني إنشاء رسوم بيانية وتحليلات لأي نوع من البيانات تحتاجه.';
  }
};
