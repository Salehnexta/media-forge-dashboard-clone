
import { useState, useCallback } from 'react';
import { DashboardLayout } from '@/types/visualization';
import { toast } from 'sonner';

// Mock dashboard layouts since the database table doesn't exist
const mockDashboardLayouts: DashboardLayout[] = [
  {
    id: '1',
    user_id: 'mock-user-1',
    company_id: 'mock-company-1',
    layout_name: 'Default SEO Layout',
    layout_config: {
      charts: ['keyword_rankings', 'organic_traffic'],
      metrics: ['total_keywords', 'organic_visitors']
    },
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'mock-user-1',
    company_id: 'mock-company-1',
    layout_name: 'Content Dashboard',
    layout_config: {
      charts: ['content_performance', 'engagement_trends'],
      metrics: ['content_pieces', 'avg_engagement']
    },
    is_default: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const useDashboardLayouts = () => {
  const [dashboardLayouts, setDashboardLayouts] = useState<DashboardLayout[]>(mockDashboardLayouts);

  const loadDashboardLayouts = useCallback(async () => {
    try {
      // Since the dashboard_layouts table doesn't exist, we'll use mock data
      setDashboardLayouts(mockDashboardLayouts);
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

      // Mock saving - just add to the local state
      const newLayout: DashboardLayout = {
        id: `mock-${Date.now()}`,
        user_id: 'mock-user-1',
        layout_name: layoutName,
        layout_config: layoutConfig,
        is_default: isDefault,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setDashboardLayouts(prev => [...prev, newLayout]);
      toast.success('تم حفظ تخطيط لوحة التحكم بنجاح');
      return true;
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
      const errorMessage = error?.message || 'خطأ في حفظ تخطيط لوحة التحكم';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  return {
    dashboardLayouts,
    loadDashboardLayouts,
    saveDashboardLayout
  };
};
