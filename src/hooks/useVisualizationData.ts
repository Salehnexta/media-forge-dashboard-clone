
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChartTemplate, VisualizationPreference, DashboardLayout } from '@/types/visualization';
import { toast } from 'sonner';

export const useVisualizationData = () => {
  const [chartTemplates, setChartTemplates] = useState<ChartTemplate[]>([]);
  const [userPreferences, setUserPreferences] = useState<VisualizationPreference[]>([]);
  const [dashboardLayouts, setDashboardLayouts] = useState<DashboardLayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load chart templates
  const loadChartTemplates = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chart_templates')
        .select('*')
        .order('template_name');

      if (error) throw error;
      setChartTemplates(data || []);
    } catch (error) {
      console.error('Error loading chart templates:', error);
      toast.error('خطأ في تحميل قوالب الرسوم البيانية');
    }
  }, []);

  // Load user preferences
  const loadUserPreferences = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('visualization_preferences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPreferences(data || []);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  }, []);

  // Load dashboard layouts
  const loadDashboardLayouts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_layouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDashboardLayouts(data || []);
    } catch (error) {
      console.error('Error loading dashboard layouts:', error);
    }
  }, []);

  // Save user preference
  const saveUserPreference = useCallback(async (chartType: string, preferences: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('visualization_preferences')
        .upsert({
          chart_type: chartType,
          preferences
        }, {
          onConflict: 'user_id,chart_type'
        });

      if (error) throw error;
      await loadUserPreferences();
      toast.success('تم حفظ التفضيلات بنجاح');
    } catch (error) {
      console.error('Error saving preference:', error);
      toast.error('خطأ في حفظ التفضيلات');
    }
  }, [loadUserPreferences]);

  // Save dashboard layout
  const saveDashboardLayout = useCallback(async (layoutName: string, layoutConfig: Record<string, any>, isDefault = false) => {
    try {
      const { error } = await supabase
        .from('dashboard_layouts')
        .insert({
          layout_name: layoutName,
          layout_config: layoutConfig,
          is_default: isDefault
        });

      if (error) throw error;
      await loadDashboardLayouts();
      toast.success('تم حفظ تخطيط لوحة التحكم بنجاح');
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
      toast.error('خطأ في حفظ تخطيط لوحة التحكم');
    }
  }, [loadDashboardLayouts]);

  // Get templates by agent type
  const getTemplatesByAgent = useCallback((agentType: string) => {
    return chartTemplates.filter(template => template.agent_type === agentType);
  }, [chartTemplates]);

  // Get user preference for chart type
  const getUserPreference = useCallback((chartType: string) => {
    return userPreferences.find(pref => pref.chart_type === chartType);
  }, [userPreferences]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        loadChartTemplates(),
        loadUserPreferences(),
        loadDashboardLayouts()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [loadChartTemplates, loadUserPreferences, loadDashboardLayouts]);

  // Set up real-time subscriptions
  useEffect(() => {
    const templatesChannel = supabase
      .channel('chart_templates_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chart_templates'
      }, () => {
        loadChartTemplates();
      })
      .subscribe();

    const preferencesChannel = supabase
      .channel('preferences_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'visualization_preferences'
      }, () => {
        loadUserPreferences();
      })
      .subscribe();

    const layoutsChannel = supabase
      .channel('layouts_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dashboard_layouts'
      }, () => {
        loadDashboardLayouts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(templatesChannel);
      supabase.removeChannel(preferencesChannel);
      supabase.removeChannel(layoutsChannel);
    };
  }, [loadChartTemplates, loadUserPreferences, loadDashboardLayouts]);

  return {
    chartTemplates,
    userPreferences,
    dashboardLayouts,
    isLoading,
    saveUserPreference,
    saveDashboardLayout,
    getTemplatesByAgent,
    getUserPreference,
    loadChartTemplates,
    loadUserPreferences,
    loadDashboardLayouts
  };
};
