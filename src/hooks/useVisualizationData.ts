
import { useState, useEffect, useCallback } from 'react';
import { ChartTemplate, VisualizationPreference, DashboardLayout } from '@/types/visualization';
import { useChartTemplates } from './visualization/useChartTemplates';
import { useUserPreferences } from './visualization/useUserPreferences';
import { useDashboardLayouts } from './visualization/useDashboardLayouts';
import { useRealtimeSubscriptions } from './visualization/useRealtimeSubscriptions';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    chartTemplates,
    loadChartTemplates,
    getTemplatesByAgent
  } = useChartTemplates();

  const {
    userPreferences,
    loadUserPreferences,
    saveUserPreference,
    getUserPreference
  } = useUserPreferences();

  const {
    dashboardLayouts,
    loadDashboardLayouts,
    saveDashboardLayout
  } = useDashboardLayouts();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
        console.error('Error loading initial data:', error);
        setError(error?.message || 'خطأ في تحميل البيانات الأولية');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadChartTemplates, loadUserPreferences, loadDashboardLayouts]);

  // Set up real-time subscriptions
  useRealtimeSubscriptions({
    onTemplatesChange: loadChartTemplates,
    onPreferencesChange: loadUserPreferences,
    onLayoutsChange: loadDashboardLayouts
  });

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
