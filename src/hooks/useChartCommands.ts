
import { useCallback } from 'react';
import { useDynamicCharts } from './useDynamicCharts';

export const useChartCommands = () => {
  const { generateChart, activeCharts, removeChart, clearAllCharts } = useDynamicCharts();

  // تحليل الرسائل وتحديد ما إذا كانت تحتوي على طلب رسم بياني
  const detectChartRequest = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    const chartKeywords = [
      'رسم', 'شارت', 'chart', 'عرض', 'إظهار', 'أظهر',
      'بيانات', 'تحليل', 'مقارنة', 'اتجاه', 'أداء'
    ];

    const dataKeywords = [
      'حملة', 'حملات', 'مبيعات', 'مبيع', 'أرباح', 'عائد',
      'ميزانية', 'تكلفة', 'نتائج', 'إحصائيات'
    ];

    const hasChartKeyword = chartKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    const hasDataKeyword = dataKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    return hasChartKeyword && hasDataKeyword;
  }, []);

  // تنفيذ طلب الرسم البياني
  const executeChartCommand = useCallback(async (message: string) => {
    if (detectChartRequest(message)) {
      console.log('Chart request detected:', message);
      const chart = await generateChart(message);
      
      if (chart) {
        return {
          success: true,
          message: `تم إنشاء الرسم البياني: ${chart.chart_config.title}`,
          chart: chart
        };
      } else {
        return {
          success: false,
          message: 'عذراً، لم أتمكن من إنشاء الرسم البياني. تأكد من وجود البيانات المطلوبة.'
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
