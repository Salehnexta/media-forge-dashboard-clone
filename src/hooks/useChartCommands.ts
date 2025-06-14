
import { useCallback } from 'react';
import { useDynamicCharts } from './useDynamicCharts';

export const useChartCommands = () => {
  const { generateChart, activeCharts, removeChart, clearAllCharts } = useDynamicCharts();

  // تحليل الرسائل وتحديد ما إذا كانت تحتوي على طلب رسم بياني أو تحليل
  const detectChartRequest = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    const chartKeywords = [
      'رسم', 'شارت', 'chart', 'عرض', 'إظهار', 'أظهر',
      'بيانات', 'تحليل', 'مقارنة', 'اتجاه', 'أداء',
      'إحصائيات', 'تقرير', 'مؤشرات'
    ];

    const dataKeywords = [
      'حملة', 'حملات', 'مبيعات', 'مبيع', 'أرباح', 'عائد',
      'ميزانية', 'تكلفة', 'نتائج', 'عملاء', 'زوار',
      'تفاعل', 'مشاركة', 'نقرات', 'تحويلات'
    ];

    const hasChartKeyword = chartKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    const hasDataKeyword = dataKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    return hasChartKeyword && hasDataKeyword;
  }, []);

  // تنفيذ طلب الرسم البياني أو التحليل
  const executeChartCommand = useCallback(async (message: string) => {
    if (detectChartRequest(message)) {
      console.log('Chart/Analysis request detected:', message);
      const chart = await generateChart(message);
      
      if (chart) {
        return {
          success: true,
          message: `تم إنشاء ${chart.chart_config.title} بنجاح`,
          chart: chart
        };
      } else {
        return {
          success: false,
          message: 'عذراً، لم أتمكن من إنشاء التحليل المطلوب. يرجى المحاولة مرة أخرى.'
        };
      }
    }
    
    return null;
  }, [generateChart, detectChartRequest]);

  return {
    detectChartRequest,
    executeChartCommand,
    activeCharts,
    removeChart,
    clearAllCharts
  };
};
