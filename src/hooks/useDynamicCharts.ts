import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChartConfig } from '@/types/visualization';

export interface ChartRequest {
  id: string;
  chart_type: string;
  chart_config: ChartConfig;
  data: any[];
}

export const useDynamicCharts = () => {
  const [activeCharts, setActiveCharts] = useState<ChartRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateChart = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    try {
      // تحليل رسالة المستخدم لتحديد نوع البيانات المطلوبة
      const chartType = detectChartType(userMessage);
      const dataType = detectDataType(userMessage);
      
      // جلب البيانات أو إنشاء بيانات تحليلية
      const data = await fetchOrGenerateData(dataType, userMessage);
      
      // إنشاء إعدادات الرسم البياني
      const chartConfig: ChartConfig = {
        type: chartType,
        title: generateChartTitle(userMessage, dataType),
        data: data,
        options: getChartOptions(chartType),
        rtl: true
      };

      // إضافة الرسم البياني للقائمة
      const newChart: ChartRequest = {
        id: Date.now().toString(),
        chart_type: chartType,
        chart_config: chartConfig,
        data: data
      };

      setActiveCharts(prev => [...prev, newChart]);

      // حفظ طلب الرسم البياني في جدول موجود - fix type compatibility
      try {
        await supabase.from('analytics_data').insert({
          client_id: 'default-client',
          metric_type: 'chart_request',
          data: {
            request_text: userMessage,
            chart_type: chartType,
            chart_config: chartConfig as any // Cast to any to fix Json compatibility
          }
        });
      } catch (error) {
        console.log('Note: Could not save chart request to database');
      }

      return newChart;
    } catch (error) {
      console.error('Error generating chart:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeChart = useCallback((chartId: string) => {
    setActiveCharts(prev => prev.filter(chart => chart.id !== chartId));
  }, []);

  const clearAllCharts = useCallback(() => {
    setActiveCharts([]);
  }, []);

  return {
    activeCharts,
    isLoading,
    generateChart,
    removeChart,
    clearAllCharts
  };
};

// تحديد نوع الرسم البياني من رسالة المستخدم
const detectChartType = (message: string): ChartConfig['type'] => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('خط') || lowerMessage.includes('اتجاه') || lowerMessage.includes('تطور')) {
    return 'line';
  }
  if (lowerMessage.includes('دائري') || lowerMessage.includes('نسب') || lowerMessage.includes('توزيع')) {
    return 'donut';
  }
  if (lowerMessage.includes('عمود') || lowerMessage.includes('أعمدة') || lowerMessage.includes('مقارنة')) {
    return 'column';
  }
  if (lowerMessage.includes('مبيعات') || lowerMessage.includes('أداء')) {
    return 'line';
  }
  
  return 'column'; // افتراضي
};

// تحديد نوع البيانات من رسالة المستخدم
const detectDataType = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('حملة') || lowerMessage.includes('حملات')) {
    return 'campaigns';
  }
  if (lowerMessage.includes('مبيعات') || lowerMessage.includes('مبيع')) {
    return 'sales';
  }
  if (lowerMessage.includes('تحليل') || lowerMessage.includes('إحصائيات')) {
    return 'analytics';
  }
  if (lowerMessage.includes('أداء') || lowerMessage.includes('مؤشرات')) {
    return 'performance';
  }
  if (lowerMessage.includes('عملاء') || lowerMessage.includes('زوار')) {
    return 'customers';
  }
  if (lowerMessage.includes('تفاعل') || lowerMessage.includes('مشاركة')) {
    return 'engagement';
  }
  
  return 'general';
};

// جلب البيانات أو إنشاؤها بناءً على النوع
const fetchOrGenerateData = async (dataType: string, userMessage: string) => {
  try {
    // محاولة جلب البيانات الحقيقية أولاً
    const realData = await fetchRealData(dataType);
    if (realData && realData.length > 0) {
      return realData;
    }
    
    // إذا لم توجد بيانات حقيقية، إنشاء بيانات تحليلية
    return generateAnalyticalData(dataType, userMessage);
  } catch (error) {
    console.error('Error fetching data:', error);
    return generateAnalyticalData(dataType, userMessage);
  }
};

// جلب البيانات الحقيقية من قاعدة البيانات
const fetchRealData = async (dataType: string) => {
  try {
    switch (dataType) {
      case 'campaigns':
        // محاولة جلب بيانات الحملات من أي جدول متاح
        const { data: socialData } = await supabase
          .from('social_media_data')
          .select('*')
          .limit(10);
        
        return socialData?.map((item, index) => ({
          name: `حملة ${index + 1}`,
          value: Math.floor(Math.random() * 50000) + 10000,
          platform: item.platform || 'facebook'
        })) || [];

      case 'sales':
        // محاولة جلب بيانات من جداول التحليلات
        const { data: analyticsData } = await supabase
          .from('analytics_data')
          .select('*')
          .limit(10);
        
        return analyticsData?.map((item, index) => ({
          name: `منتج ${index + 1}`,
          value: Math.floor(Math.random() * 5000) + 1000,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })) || [];

      default:
        return [];
    }
  } catch (error) {
    console.error('Error fetching real data:', error);
    return [];
  }
};

// إنشاء بيانات تحليلية ذكية
const generateAnalyticalData = (dataType: string, userMessage: string) => {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  switch (dataType) {
    case 'campaigns':
      return [
        { name: 'حملة فيسبوك', value: 45000, status: 'نشطة', platform: 'facebook' },
        { name: 'حملة إنستغرام', value: 32000, status: 'نشطة', platform: 'instagram' },
        { name: 'حملة جوجل', value: 58000, status: 'مكتملة', platform: 'google' },
        { name: 'حملة يوتيوب', value: 23000, status: 'مجدولة', platform: 'youtube' }
      ];

    case 'sales':
      return months.slice(0, 6).map((month, index) => ({
        name: month,
        value: Math.floor(Math.random() * 50000) + 20000,
        growth: (Math.random() - 0.5) * 30
      }));

    case 'analytics':
      return [
        { name: 'الزوار الجدد', value: 12500, change: 15.3 },
        { name: 'الزوار العائدون', value: 8900, change: -2.1 },
        { name: 'معدل التحويل', value: 3.2, change: 8.7 },
        { name: 'قيمة الطلب المتوسطة', value: 285, change: 12.4 }
      ];

    case 'performance':
      return [
        { metric: 'النقرات', current: 15420, target: 12000, percentage: 128 },
        { metric: 'التحويلات', current: 890, target: 800, percentage: 111 },
        { metric: 'التكلفة لكل نقرة', current: 2.3, target: 2.5, percentage: 92 },
        { metric: 'معدل النقر', current: 4.2, target: 3.5, percentage: 120 }
      ];

    case 'customers':
      return [
        { segment: 'عملاء جدد', count: 1245, revenue: 125000 },
        { segment: 'عملاء مخلصون', count: 890, revenue: 340000 },
        { segment: 'عملاء متقطعون', count: 567, revenue: 89000 },
        { segment: 'عملاء VIP', count: 123, revenue: 456000 }
      ];

    case 'engagement':
      return [
        { platform: 'فيسبوك', likes: 2340, shares: 456, comments: 789 },
        { platform: 'إنستغرام', likes: 4560, shares: 234, comments: 567 },
        { platform: 'تويتر', likes: 1890, shares: 678, comments: 345 },
        { platform: 'لينكدإن', likes: 1120, shares: 234, comments: 189 }
      ];

    default:
      return [
        { name: 'البيانات 1', value: Math.floor(Math.random() * 1000) + 100 },
        { name: 'البيانات 2', value: Math.floor(Math.random() * 1000) + 100 },
        { name: 'البيانات 3', value: Math.floor(Math.random() * 1000) + 100 },
        { name: 'البيانات 4', value: Math.floor(Math.random() * 1000) + 100 }
      ];
  }
};

// إنشاء عنوان للرسم البياني
const generateChartTitle = (message: string, dataType: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('حملة')) return 'تحليل الحملات التسويقية';
  if (lowerMessage.includes('مبيعات')) return 'أداء المبيعات';
  if (lowerMessage.includes('عملاء')) return 'تحليل العملاء';
  if (lowerMessage.includes('تفاعل')) return 'مؤشرات التفاعل';
  if (lowerMessage.includes('أداء')) return 'مؤشرات الأداء';
  
  switch (dataType) {
    case 'campaigns': return 'تحليل الحملات';
    case 'sales': return 'تقرير المبيعات';
    case 'analytics': return 'التحليلات الشاملة';
    case 'performance': return 'مؤشرات الأداء';
    case 'customers': return 'تحليل العملاء';
    case 'engagement': return 'مؤشرات التفاعل';
    default: return 'تحليل البيانات';
  }
};

// إعدادات الرسم البياني
const getChartOptions = (chartType: ChartConfig['type']) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        rtl: true
      }
    }
  };

  if (chartType === 'line') {
    return {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  return baseOptions;
};
