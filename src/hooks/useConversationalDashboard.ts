
import { useState, useCallback } from 'react';
import { DashboardConfig, ConversationMessage, DashboardComponent } from '@/types/conversational';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useConversationalDashboard = () => {
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<DashboardConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample data generators for demo purposes
  const generateSampleData = useCallback((chartType: string, context: string) => {
    switch (chartType) {
      case 'line_chart':
        return {
          data: [
            { name: 'يناير', value: 4000, previous: 3000 },
            { name: 'فبراير', value: 3000, previous: 2800 },
            { name: 'مارس', value: 5000, previous: 4200 },
            { name: 'أبريل', value: 4500, previous: 3800 },
            { name: 'مايو', value: 6000, previous: 5200 },
            { name: 'يونيو', value: 5500, previous: 4800 }
          ]
        };
      case 'pie_chart':
        return {
          data: [
            { name: 'فيسبوك', value: 35, color: '#3b82f6' },
            { name: 'انستغرام', value: 28, color: '#ef4444' },
            { name: 'تويتر', value: 20, color: '#10b981' },
            { name: 'لينكد إن', value: 17, color: '#f59e0b' }
          ]
        };
      case 'bar_chart':
        return {
          data: [
            { name: 'المنتج أ', sales: 4000, target: 3500 },
            { name: 'المنتج ب', sales: 3000, target: 3200 },
            { name: 'المنتج ج', sales: 5000, target: 4800 },
            { name: 'المنتج د', sales: 2800, target: 3000 }
          ]
        };
      case 'metrics_cards':
        return [
          { label: 'المبيعات الشهرية', value: '45,600 ريال', change: '+23%', trend: 'up' },
          { label: 'التحويلات', value: '340', change: '+15%', trend: 'up' },
          { label: 'زوار الموقع', value: '28,900', change: '+12%', trend: 'up' },
          { label: 'معدل النقر', value: '3.4%', change: '+0.8%', trend: 'up' }
        ];
      default:
        return {};
    }
  }, []);

  const analyzeDashboardIntent = useCallback((message: string): DashboardConfig | null => {
    const lowerMessage = message.toLowerCase();
    
    // Social Media Performance Intent
    if (lowerMessage.includes('سوشال') || lowerMessage.includes('انستغرام') || lowerMessage.includes('فيسبوك') || lowerMessage.includes('تواصل اجتماعي')) {
      return {
        id: `dashboard-${Date.now()}`,
        title: 'أداء وسائل التواصل الاجتماعي',
        layout: 'grid-2x2',
        components: [
          {
            id: 'social-metrics',
            type: 'metrics_cards',
            title: 'المؤشرات الرئيسية',
            data: generateSampleData('metrics_cards', 'social'),
            config: { rtl: true, animation: true },
            position: { row: 0, col: 0, span: 2 }
          },
          {
            id: 'engagement-trend',
            type: 'line_chart',
            title: 'اتجاه التفاعل اليومي',
            data: generateSampleData('line_chart', 'engagement'),
            config: { colors: ['#3b82f6', '#ef4444'], rtl: true, showGrid: true },
            position: { row: 1, col: 0, span: 1 }
          },
          {
            id: 'platform-distribution',
            type: 'pie_chart',
            title: 'توزيع المنصات',
            data: generateSampleData('pie_chart', 'platforms'),
            config: { showLegend: true, rtl: true },
            position: { row: 1, col: 1, span: 1 }
          }
        ],
        insights: [
          'محتوى الفيديو حقق أداءً أفضل بنسبة 40% من الصور',
          'أفضل وقت للنشر: 8-10 مساءً',
          'استراتيجية الهاشتاغ تظهر نتائج قوية'
        ],
        actions: [
          { label: 'عرض تفاصيل أكثر', command: 'show more social details', type: 'primary' },
          { label: 'مقارنة بالشهر الماضي', command: 'compare social media last month', type: 'secondary' }
        ],
        generatedAt: new Date()
      };
    }

    // Sales Performance Intent
    if (lowerMessage.includes('مبيعات') || lowerMessage.includes('إيرادات') || lowerMessage.includes('أرباح')) {
      return {
        id: `dashboard-${Date.now()}`,
        title: 'أداء المبيعات والإيرادات',
        layout: 'grid-2x3',
        components: [
          {
            id: 'sales-metrics',
            type: 'metrics_cards',
            title: 'مؤشرات المبيعات',
            data: [
              { label: 'الإيرادات الشهرية', value: '142,500 ريال', change: '+18%', trend: 'up' },
              { label: 'عدد الطلبات', value: '892', change: '+25%', trend: 'up' },
              { label: 'متوسط قيمة الطلب', value: '159 ريال', change: '+7%', trend: 'up' }
            ],
            config: { rtl: true, animation: true },
            position: { row: 0, col: 0, span: 3 }
          },
          {
            id: 'revenue-trend',
            type: 'area_chart',
            title: 'اتجاه الإيرادات',
            data: generateSampleData('line_chart', 'revenue'),
            config: { colors: ['#10b981'], rtl: true, showGrid: true },
            position: { row: 1, col: 0, span: 2 }
          },
          {
            id: 'top-products',
            type: 'bar_chart',
            title: 'أفضل المنتجات',
            data: generateSampleData('bar_chart', 'products'),
            config: { colors: ['#3b82f6', '#ef4444'], rtl: true },
            position: { row: 1, col: 2, span: 1 }
          }
        ],
        insights: [
          'نمو الإيرادات بنسبة 18% مقارنة بالشهر الماضي',
          'المنتج أ يحقق أعلى مبيعات بقيمة 5000 ريال',
          'زيادة ملحوظة في عدد الطلبات خلال عطلة نهاية الأسبوع'
        ],
        actions: [
          { label: 'تحليل تفصيلي للمنتجات', command: 'analyze product performance', type: 'primary' },
          { label: 'توقعات المبيعات', command: 'sales forecast', type: 'secondary' }
        ],
        generatedAt: new Date()
      };
    }

    // Business Overview Intent
    if (lowerMessage.includes('نظرة عامة') || lowerMessage.includes('التقرير الشامل') || lowerMessage.includes('كل شيء')) {
      return {
        id: `dashboard-${Date.now()}`,
        title: 'النظرة العامة للأعمال',
        layout: 'custom',
        components: [
          {
            id: 'overview-metrics',
            type: 'metrics_cards',
            title: 'المؤشرات الرئيسية',
            data: [
              { label: 'الإيرادات', value: '45,600 ريال', change: '+23%', trend: 'up' },
              { label: 'التحويلات', value: '340', change: '+15%', trend: 'up' },
              { label: 'زوار الموقع', value: '28,900', change: '+12%', trend: 'up' },
              { label: 'معدل التحويل', value: '3.4%', change: '+0.8%', trend: 'up' }
            ],
            config: { rtl: true, animation: true },
            position: { row: 0, col: 0, span: 4 }
          },
          {
            id: 'revenue-chart',
            type: 'line_chart',
            title: 'اتجاه الإيرادات',
            data: generateSampleData('line_chart', 'revenue'),
            config: { colors: ['#10b981', '#3b82f6'], rtl: true, showGrid: true },
            position: { row: 1, col: 0, span: 2 }
          },
          {
            id: 'traffic-sources',
            type: 'pie_chart',
            title: 'مصادر الزوار',
            data: [
              { name: 'البحث المجاني', value: 45, color: '#3b82f6' },
              { name: 'وسائل التواصل', value: 30, color: '#ef4444' },
              { name: 'الإعلانات المدفوعة', value: 15, color: '#10b981' },
              { name: 'مباشر', value: 10, color: '#f59e0b' }
            ],
            config: { showLegend: true, rtl: true },
            position: { row: 1, col: 2, span: 2 }
          }
        ],
        insights: [
          'نمو قوي في جميع المؤشرات الرئيسية',
          'البحث المجاني يمثل أكبر مصدر للزوار',
          'معدل التحويل في تحسن مستمر'
        ],
        actions: [
          { label: 'تحليل مفصل للتسويق', command: 'detailed marketing analysis', type: 'primary' },
          { label: 'تقرير الأداء الشهري', command: 'monthly performance report', type: 'secondary' }
        ],
        generatedAt: new Date()
      };
    }

    return null;
  }, [generateSampleData]);

  const generateDashboard = useCallback(async (userMessage: string) => {
    setIsGenerating(true);
    
    // Add user message to conversation
    const userMsg: ConversationMessage = {
      id: `msg-${Date.now()}`,
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMsg]);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Analyze intent and generate dashboard
      const dashboardConfig = analyzeDashboardIntent(userMessage);
      
      if (dashboardConfig) {
        // Create AI response with dashboard
        const aiMsg: ConversationMessage = {
          id: `msg-${Date.now() + 1}`,
          text: `تم إنشاء لوحة تحكم مخصصة لك! إليك تحليل شامل لـ ${dashboardConfig.title}`,
          sender: 'ai',
          timestamp: new Date(),
          dashboard: dashboardConfig
        };
        
        setConversation(prev => [...prev, aiMsg]);
        setCurrentDashboard(dashboardConfig);
        
        // Store conversation in database
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('morvo_conversations').insert({
              user_id: user.id,
              conversation_id: 'main-session',
              message_type: 'dashboard_generation',
              content: JSON.stringify({
                userMessage,
                dashboard: dashboardConfig
              })
            });
          }
        } catch (error) {
          console.error('Error storing conversation:', error);
        }
        
        toast.success('تم إنشاء لوحة التحكم بنجاح!');
      } else {
        // Default AI response for unrecognized intents
        const aiMsg: ConversationMessage = {
          id: `msg-${Date.now() + 1}`,
          text: `شكراً لسؤالك! يمكنني مساعدتك في إنشاء لوحات تحكم مخصصة. جرب أن تسأل عن:
          
📱 "كيف أداء وسائل التواصل الاجتماعي؟"
💰 "أظهر لي المبيعات والإيرادات"
📊 "أريد نظرة عامة على الأعمال"
          
ما الذي تريد أن تعرف عنه أكثر؟`,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setConversation(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error('Error generating dashboard:', error);
      toast.error('حدث خطأ في إنشاء لوحة التحكم');
    } finally {
      setIsGenerating(false);
    }
  }, [analyzeDashboardIntent]);

  const executeAction = useCallback(async (command: string) => {
    toast.info(`تنفيذ الأمر: ${command}`);
    // This would trigger additional dashboard generation or data fetching
    await generateDashboard(command);
  }, [generateDashboard]);

  const clearConversation = useCallback(() => {
    setConversation([]);
    setCurrentDashboard(null);
  }, []);

  return {
    conversation,
    currentDashboard,
    isGenerating,
    generateDashboard,
    executeAction,
    clearConversation
  };
};
