
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VisualizationPreference } from '@/types/visualization';
import { toast } from 'sonner';
import { safeParseJSON } from './visualizationUtils';

export const useUserPreferences = () => {
  const [userPreferences, setUserPreferences] = useState<VisualizationPreference[]>([]);

  const loadUserPreferences = useCallback(async () => {
    try {
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
      console.error('Error saving user preference:', error);
      const errorMessage = error?.message || 'خطأ في حفظ التفضيلات';
      toast.error(errorMessage);
      return false;
    }
  }, [loadUserPreferences]);

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
