
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
      
      // جلب البيانات من قاعدة البيانات
      const data = await fetchDataByType(dataType);
      
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

      // حفظ طلب الرسم البياني في قاعدة البيانات
      await supabase.from('chart_requests').insert({
        request_text: userMessage,
        chart_type: chartType,
        chart_config: chartConfig
      });

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
const detectDataType = (message: string): 'campaigns' | 'sales' | 'combined' => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('حملة') || lowerMessage.includes('حملات')) {
    return 'campaigns';
  }
  if (lowerMessage.includes('مبيعات') || lowerMessage.includes('مبيع')) {
    return 'sales';
  }
  
  return 'combined';
};

// جلب البيانات من قاعدة البيانات
const fetchDataByType = async (dataType: string) => {
  try {
    switch (dataType) {
      case 'campaigns':
        const { data: campaigns } = await supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false });
        
        return campaigns?.map(campaign => ({
          name: campaign.name,
          value: campaign.budget || 0,
          status: campaign.status,
          platform: campaign.platform
        })) || [];

      case 'sales':
        const { data: sales } = await supabase
          .from('sales_data')
          .select(`
            *,
            campaigns (name)
          `)
          .order('sale_date', { ascending: true });
        
        return sales?.map(sale => ({
          name: sale.campaigns?.name || 'غير محدد',
          value: sale.amount,
          date: sale.sale_date,
          product: sale.product_name
        })) || [];

      case 'combined':
        const { data: combinedData } = await supabase
          .from('sales_data')
          .select(`
            amount,
            sale_date,
            campaigns (name, budget, platform)
          `)
          .order('sale_date', { ascending: true });
        
        return combinedData?.map(item => ({
          name: item.campaigns?.name || 'غير محدد',
          sales: item.amount,
          budget: item.campaigns?.budget || 0,
          date: item.sale_date
        })) || [];

      default:
        return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

// إنشاء عنوان للرسم البياني
const generateChartTitle = (message: string, dataType: string): string => {
  if (dataType === 'campaigns') {
    return 'تحليل الحملات التسويقية';
  }
  if (dataType === 'sales') {
    return 'أداء المبيعات';
  }
  return 'تحليل شامل للحملات والمبيعات';
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
