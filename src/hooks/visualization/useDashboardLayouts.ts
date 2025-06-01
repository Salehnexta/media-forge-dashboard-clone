
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/types/visualization';
import { toast } from 'sonner';
import { safeParseJSON } from './visualizationUtils';

export const useDashboardLayouts = () => {
  const [dashboardLayouts, setDashboardLayouts] = useState<DashboardLayout[]>([]);

  const loadDashboardLayouts = useCallback(async () => {
    try {
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
      console.error('Error loading dashboard layouts:', error);
      const errorMessage = error?.message || 'خطأ في تحميل تخطيطات لوحة التحكم';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const saveDashboardLayout = useCallback(async (
    layoutName: string, 
    layoutConfig: Record<string, any>, 
    isDefault = false
  ): Promise<boolean> => {
    try {
      if (!layoutName || typeof layoutConfig !== 'object') {
        throw new Error('بيانات غير صالحة للحفظ');
      }

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
      console.error('Error saving dashboard layout:', error);
      const errorMessage = error?.message || 'خطأ في حفظ تخطيط لوحة التحكم';
      toast.error(errorMessage);
      return false;
    }
  }, [loadDashboardLayouts]);

  return {
    dashboardLayouts,
    loadDashboardLayouts,
    saveDashboardLayout
  };
};
