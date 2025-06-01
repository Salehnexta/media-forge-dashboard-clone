
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChartTemplate, VisualizationPreference, DashboardLayout } from '@/types/visualization';
import { toast } from 'sonner';

interface UseVisualizationDataReturn {
  chartTemplates: ChartTemplate[];
  userPreferences: VisualizationPreference[];
  dashboardLayouts: DashboardLayout[];
  isLoading: boolean;
  error: string | null;
  saveUserPreference: (chartType: string, preferences: Record<string, any>) => Promise<boolean>;
  saveDashboardLayout: (layoutName: string, layoutConfig: Record<string, any>, isDefault?: boolean) => Promise<boolean>;
  getTemplatesByAgent: (agentType: string) => ChartTemplate[];
  getUserPreference: (chartType: string) => VisualizationPreference | undefined;
  loadChartTemplates: () => Promise<void>;
  loadUserPreferences: () => Promise<void>;
  loadDashboardLayouts: () => Promise<void>;
  clearError: () => void;
}

export const useVisualizationData = (): UseVisualizationDataReturn => {
  const [chartTemplates, setChartTemplates] = useState<ChartTemplate[]>([]);
  const [userPreferences, setUserPreferences] = useState<VisualizationPreference[]>([]);
  const [dashboardLayouts, setDashboardLayouts] = useState<DashboardLayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Enhanced error handling helper
  const handleError = useCallback((error: any, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    const errorMessage = error?.message || `خطأ في ${operation}`;
    setError(errorMessage);
    toast.error(errorMessage);
  }, []);

  // Safe JSON parsing helper
  const safeParseJSON = useCallback((data: any, fallback: any = {}) => {
    try {
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      return data || fallback;
    } catch {
      return fallback;
    }
  }, []);

  // Load chart templates with enhanced validation
  const loadChartTemplates = useCallback(async () => {
    try {
      setError(null);
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
      handleError(error, 'تحميل قوالب الرسوم البيانية');
    }
  }, [handleError, safeParseJSON]);

  // Load user preferences with enhanced validation
  const loadUserPreferences = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('visualization_preferences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform and validate the data
      const transformedPreferences: VisualizationPreference[] = Array.isArray(data)
        ? data.filter(item => item && item.id && item.chart_type)
            .map(item => ({
              ...item,
              preferences: safeParseJSON(item.preferences, {})
            }))
        : [];
      
      setUserPreferences(transformedPreferences);
    } catch (error) {
      handleError(error, 'تحميل تفضيلات المستخدم');
    }
  }, [handleError, safeParseJSON]);

  // Load dashboard layouts with enhanced validation
  const loadDashboardLayouts = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('dashboard_layouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform and validate the data
      const transformedLayouts: DashboardLayout[] = Array.isArray(data)
        ? data.filter(item => item && item.id && item.layout_name)
            .map(item => ({
              ...item,
              layout_config: safeParseJSON(item.layout_config, {})
            }))
        : [];
      
      setDashboardLayouts(transformedLayouts);
    } catch (error) {
      handleError(error, 'تحميل تخطيطات لوحة التحكم');
    }
  }, [handleError, safeParseJSON]);

  // Save user preference with enhanced error handling
  const saveUserPreference = useCallback(async (
    chartType: string, 
    preferences: Record<string, any>
  ): Promise<boolean> => {
    try {
      if (!chartType || typeof preferences !== 'object') {
        throw new Error('بيانات غير صالحة للحفظ');
      }

      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('المستخدم غير مصرح له');
      }

      const { error } = await supabase
        .from('visualization_preferences')
        .upsert({
          user_id: user.id,
          chart_type: chartType,
          preferences: preferences as any
        }, {
          onConflict: 'user_id,chart_type'
        });

      if (error) throw error;
      
      await loadUserPreferences();
      toast.success('تم حفظ التفضيلات بنجاح');
      return true;
    } catch (error) {
      handleError(error, 'حفظ التفضيلات');
      return false;
    }
  }, [loadUserPreferences, handleError]);

  // Save dashboard layout with enhanced error handling
  const saveDashboardLayout = useCallback(async (
    layoutName: string, 
    layoutConfig: Record<string, any>, 
    isDefault = false
  ): Promise<boolean> => {
    try {
      if (!layoutName || typeof layoutConfig !== 'object') {
        throw new Error('بيانات غير صالحة للحفظ');
      }

      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('المستخدم غير مصرح له');
      }

      const { error } = await supabase
        .from('dashboard_layouts')
        .insert({
          user_id: user.id,
          layout_name: layoutName,
          layout_config: layoutConfig as any,
          is_default: isDefault
        });

      if (error) throw error;
      
      await loadDashboardLayouts();
      toast.success('تم حفظ تخطيط لوحة التحكم بنجاح');
      return true;
    } catch (error) {
      handleError(error, 'حفظ تخطيط لوحة التحكم');
      return false;
    }
  }, [loadDashboardLayouts, handleError]);

  // Get templates by agent type with validation
  const getTemplatesByAgent = useCallback((agentType: string) => {
    if (!agentType || typeof agentType !== 'string') {
      return [];
    }
    return chartTemplates.filter(template => 
      template && template.agent_type === agentType
    );
  }, [chartTemplates]);

  // Get user preference for chart type with validation
  const getUserPreference = useCallback((chartType: string) => {
    if (!chartType || typeof chartType !== 'string') {
      return undefined;
    }
    return userPreferences.find(pref => 
      pref && pref.chart_type === chartType
    );
  }, [userPreferences]);

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          loadChartTemplates(),
          loadUserPreferences(),
          loadDashboardLayouts()
        ]);
      } catch (error) {
        handleError(error, 'تحميل البيانات الأولية');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadChartTemplates, loadUserPreferences, loadDashboardLayouts, handleError]);

  // Set up real-time subscriptions with error handling
  useEffect(() => {
    const setupSubscriptions = () => {
      try {
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
      } catch (error) {
        handleError(error, 'إعداد المراقبة المباشرة');
        return () => {}; // Return empty cleanup function
      }
    };

    const cleanup = setupSubscriptions();
    return cleanup;
  }, [loadChartTemplates, loadUserPreferences, loadDashboardLayouts, handleError]);

  return {
    chartTemplates,
    userPreferences,
    dashboardLayouts,
    isLoading,
    error,
    saveUserPreference,
    saveDashboardLayout,
    getTemplatesByAgent,
    getUserPreference,
    loadChartTemplates,
    loadUserPreferences,
    loadDashboardLayouts,
    clearError
  };
};
