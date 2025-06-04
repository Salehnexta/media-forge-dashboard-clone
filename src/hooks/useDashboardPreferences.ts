
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardPreferences {
  id?: string;
  user_id: string;
  default_tab: 'strategic' | 'monitor' | 'executor' | 'creative' | 'analyst';
  chart_preferences: Record<string, any>;
  kpi_order: string[];
  refresh_interval: number;
  timezone: string;
  language: string;
  dark_mode: boolean;
  notification_settings: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

const defaultPreferences: Omit<DashboardPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  default_tab: 'strategic',
  chart_preferences: {},
  kpi_order: [],
  refresh_interval: 120,
  timezone: 'Asia/Riyadh',
  language: 'ar',
  dark_mode: false,
  notification_settings: {
    email: true,
    push: true,
    in_app: true
  }
};

export const useDashboardPreferences = () => {
  const [preferences, setPreferences] = useState<DashboardPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: prefsError } = await supabase
        .from('dashboard_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefsError && prefsError.code !== 'PGRST116') {
        throw prefsError;
      }

      if (data) {
        setPreferences(data as DashboardPreferences);
      } else {
        // Create default preferences if none exist
        const newPrefs = { ...defaultPreferences, user_id: user.id };
        const { data: createdData, error: createError } = await supabase
          .from('dashboard_preferences')
          .insert(newPrefs)
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        setPreferences(createdData as DashboardPreferences);
      }
    } catch (err) {
      console.error('Error fetching dashboard preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<DashboardPreferences>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('dashboard_preferences')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setPreferences(data as DashboardPreferences);
      return data;
    } catch (err) {
      console.error('Error updating dashboard preferences:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    refreshPreferences: fetchPreferences
  };
};
