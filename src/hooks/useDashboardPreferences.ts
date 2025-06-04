
import { useState, useEffect, useCallback } from 'react';

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

      // Simulate API call with mock data for now
      await new Promise(resolve => setTimeout(resolve, 200));

      const mockPreferences: DashboardPreferences = {
        ...defaultPreferences,
        id: 'mock-pref-1',
        user_id: 'mock-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setPreferences(mockPreferences);
    } catch (err) {
      console.error('Error fetching dashboard preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch preferences');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<DashboardPreferences>) => {
    try {
      if (!preferences) return null;

      const updatedPreferences = {
        ...preferences,
        ...updates,
        updated_at: new Date().toISOString()
      };

      setPreferences(updatedPreferences);
      return updatedPreferences;
    } catch (err) {
      console.error('Error updating dashboard preferences:', err);
      throw err;
    }
  }, [preferences]);

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
