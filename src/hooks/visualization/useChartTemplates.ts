
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChartTemplate } from '@/types/visualization';
import { toast } from 'sonner';
import { safeParseJSON } from './visualizationUtils';

export const useChartTemplates = () => {
  const [chartTemplates, setChartTemplates] = useState<ChartTemplate[]>([]);

  const loadChartTemplates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chart_templates')
        .select('*')
        .order('template_name');

      if (error) throw error;
      
      // Transform and validate the data
      const transformedTemplates: ChartTemplate[] = Array.isArray(data) 
        ? data.filter(item => item && item.id && item.template_name)
            .map(item => ({
              ...item,
              chart_config: safeParseJSON(item.chart_config, {
                type: 'line',
                title: item.template_name || 'رسم بياني',
                theme: 'light',
                rtl: true
              })
            }))
        : [];
      
      setChartTemplates(transformedTemplates);
    } catch (error) {
      console.error('Error loading chart templates:', error);
      const errorMessage = error?.message || 'خطأ في تحميل قوالب الرسوم البيانية';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const getTemplatesByAgent = useCallback((agentType: string) => {
    if (!agentType || typeof agentType !== 'string') {
      return [];
    }
    return chartTemplates.filter(template => 
      template && template.agent_type === agentType
    );
  }, [chartTemplates]);

  return {
    chartTemplates,
    loadChartTemplates,
    getTemplatesByAgent
  };
};
