
import { useState, useCallback } from 'react';
import { VisualizationPreference } from '@/types/visualization';
import { toast } from 'sonner';

// Mock user preferences since the visualization_preferences table doesn't exist
const mockUserPreferences: VisualizationPreference[] = [
  {
    id: '1',
    user_id: 'mock-user-1',
    chart_type: 'line',
    preferences: {
      theme: 'light',
      rtl: true,
      colors: ['#4F46E5', '#7C3AED']
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'mock-user-1',
    chart_type: 'donut',
    preferences: {
      theme: 'light',
      rtl: true,
      showLegend: true
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useUserPreferences = () => {
  const [userPreferences, setUserPreferences] = useState<VisualizationPreference[]>(mockUserPreferences);

  const loadUserPreferences = useCallback(async () => {
    try {
      // Since the visualization_preferences table doesn't exist, we'll use mock data
      setUserPreferences(mockUserPreferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
      const errorMessage = error?.message || 'خطأ في تحميل تفضيلات المستخدم';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const saveUserPreference = useCallback(async (
    chartType: string, 
    preferences: Record<string, any>
  ): Promise<boolean> => {
    try {
      if (!chartType || typeof preferences !== 'object') {
        throw new Error('بيانات غير صالحة للحفظ');
      }

      // Mock saving - just add to the local state
      const newPreference: VisualizationPreference = {
        id: `mock-${Date.now()}`,
        user_id: 'mock-user-1',
        chart_type: chartType,
        preferences: preferences,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUserPreferences(prev => {
        const filtered = prev.filter(p => p.chart_type !== chartType);
        return [...filtered, newPreference];
      });
      
      toast.success('تم حفظ التفضيلات بنجاح');
      return true;
    } catch (error) {
      console.error('Error saving user preference:', error);
      const errorMessage = error?.message || 'خطأ في حفظ التفضيلات';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const getUserPreference = useCallback((chartType: string) => {
    if (!chartType || typeof chartType !== 'string') {
      return undefined;
    }
    return userPreferences.find(pref => 
      pref && pref.chart_type === chartType
    );
  }, [userPreferences]);

  return {
    userPreferences,
    loadUserPreferences,
    saveUserPreference,
    getUserPreference
  };
};
