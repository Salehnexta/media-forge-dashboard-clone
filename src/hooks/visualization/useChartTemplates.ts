
import { useState, useCallback } from 'react';
import { ChartTemplate } from '@/types/visualization';
import { toast } from 'sonner';

// Mock chart templates since the database table doesn't exist
const mockChartTemplates: ChartTemplate[] = [
  {
    id: '1',
    template_name: 'SEO Performance',
    agent_type: 'seo_agent',
    chart_config: {
      type: 'line',
      title: 'SEO Performance',
      theme: 'light',
      rtl: true
    },
    is_system_template: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    template_name: 'Content Analytics',
    agent_type: 'content_management',
    chart_config: {
      type: 'column',
      title: 'Content Analytics',
      theme: 'light',
      rtl: true
    },
    is_system_template: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    template_name: 'Social Media Metrics',
    agent_type: 'social_media',
    chart_config: {
      type: 'donut',
      title: 'Social Media Metrics',
      theme: 'light',
      rtl: true
    },
    is_system_template: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useChartTemplates = () => {
  const [chartTemplates, setChartTemplates] = useState<ChartTemplate[]>(mockChartTemplates);

  const loadChartTemplates = useCallback(async () => {
    try {
      // Since the chart_templates table doesn't exist, we'll use mock data
      setChartTemplates(mockChartTemplates);
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
