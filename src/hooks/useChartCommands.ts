
import { useCallback } from 'react';
import { useDynamicCharts } from './useDynamicCharts';

export const useChartCommands = () => {
  const { generateChart, activeCharts, removeChart, clearAllCharts } = useDynamicCharts();

  // تحليل الرسائل وتحديد ما إذا كانت تحتوي على طلب رسم بياني أو تحليل
  const detectChartRequest = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    // كلمات مفتاحية للرسوم البيانية والتحليل
    const chartKeywords = [
      'رسم', 'شارت', 'chart', 'عرض', 'إظهار', 'أظهر', 'اظهر',
      'بيانات', 'تحليل', 'مقارنة', 'اتجاه', 'أداء', 'ارني', 'أرني',
      'إحصائيات', 'تقرير', 'مؤشرات', 'اعرض', 'أعرض'
    ];

    const dataKeywords = [
      'حملة', 'حملات', 'مبيعات', 'مبيع', 'أرباح', 'عائد',
      'ميزانية', 'تكلفة', 'نتائج', 'عملاء', 'زوار', 'اليوم',
      'تفاعل', 'مشاركة', 'نقرات', 'تحويلات', 'الأداء'
    ];

    // فحص وجود كلمة مفتاحية واحدة على الأقل من كل نوع
    const hasChartKeyword = chartKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    const hasDataKeyword = dataKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    // إذا وُجدت كلمة من النوعين أو كلمة واحدة قوية
    const strongKeywords = ['اعرض', 'أعرض', 'ارني', 'أرني', 'اظهر', 'أظهر'];
    const hasStrongKeyword = strongKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    console.log('Chart detection:', {
      message: lowerMessage,
      hasChartKeyword,
      hasDataKeyword,
      hasStrongKeyword,
      result: (hasChartKeyword && hasDataKeyword) || hasStrongKeyword
    });

    return (hasChartKeyword && hasDataKeyword) || hasStrongKeyword;
  }, []);

  // تنفيذ طلب الرسم البياني أو التحليل
  const executeChartCommand = useCallback(async (message: string) => {
    console.log('Executing chart command for message:', message);
    
    try {
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
    } catch (error) {
      console.error('Error in executeChartCommand:', error);
      return {
        success: false,
        message: 'حدث خطأ أثناء إنشاء التحليل. يرجى المحاولة مرة أخرى.'
      };
    }
  }, [generateChart]);

  return {
    detectChartRequest,
    executeChartCommand,
    activeCharts,
    removeChart,
    clearAllCharts
  };
};
