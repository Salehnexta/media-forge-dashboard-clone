
import { useState, useEffect, useCallback } from 'react';

interface DashboardMetrics {
  active_goals: number;
  average_progress: number;
  roi_percentage: number;
  active_campaigns: number;
}

export const useDashboardMetrics = (agentType: string) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API call with mock data for now
      // In the future, this will be replaced with actual Supabase queries once the tables are properly created
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading

      const mockMetrics: DashboardMetrics = {
        active_goals: Math.floor(Math.random() * 10) + 1,
        average_progress: Math.floor(Math.random() * 100),
        roi_percentage: Math.floor(Math.random() * 200) + 50,
        active_campaigns: Math.floor(Math.random() * 5) + 1
      };

      setMetrics(mockMetrics);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
    }
  }, [agentType]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refreshMetrics: fetchMetrics
  };
};
