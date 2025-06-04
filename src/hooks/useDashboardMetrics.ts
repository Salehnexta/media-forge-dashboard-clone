
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardMetrics {
  active_goals: number;
  average_progress: number;
  roi_percentage: number;
  active_campaigns: number;
}

interface MetricsCacheEntry {
  id: string;
  user_id: string;
  metric_type: string;
  metric_name: string;
  agent_type: string;
  metric_value: DashboardMetrics;
  last_updated: string;
  expires_at: string;
  created_at: string;
}

export const useDashboardMetrics = (agentType: string) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Try to get cached metrics first
      const { data: cachedData, error: cacheError } = await supabase
        .from('dashboard_metrics_cache')
        .select('*')
        .eq('user_id', user.id)
        .eq('agent_type', agentType)
        .eq('metric_type', 'kpi')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (cachedData && !cacheError) {
        setMetrics(cachedData.metric_value as DashboardMetrics);
      } else {
        // Generate fresh metrics (would normally call the refresh function)
        const freshMetrics: DashboardMetrics = {
          active_goals: Math.floor(Math.random() * 10) + 1,
          average_progress: Math.floor(Math.random() * 100),
          roi_percentage: Math.floor(Math.random() * 200) + 50,
          active_campaigns: Math.floor(Math.random() * 5) + 1
        };

        // Cache the metrics
        await supabase
          .from('dashboard_metrics_cache')
          .upsert({
            user_id: user.id,
            metric_type: 'kpi',
            metric_name: `${agentType}_overview`,
            agent_type: agentType,
            metric_value: freshMetrics,
            expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
          });

        setMetrics(freshMetrics);
      }
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

  // Set up real-time subscription for metrics updates
  useEffect(() => {
    const channel = supabase
      .channel('dashboard_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_metrics_cache',
          filter: `agent_type=eq.${agentType}`
        },
        (payload) => {
          if (payload.new && payload.new.metric_value) {
            setMetrics(payload.new.metric_value as DashboardMetrics);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentType]);

  return {
    metrics,
    isLoading,
    error,
    refreshMetrics: fetchMetrics
  };
};
