
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardAlert {
  id: string;
  user_id: string;
  alert_type: 'crisis' | 'milestone' | 'anomaly' | 'opportunity';
  agent_source: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
  action_url?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export const useDashboardAlerts = () => {
  const [alerts, setAlerts] = useState<DashboardAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: alertsError } = await supabase
        .from('dashboard_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (alertsError) {
        throw alertsError;
      }

      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching dashboard alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('dashboard_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) {
        throw error;
      }

      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      );
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  }, []);

  const createAlert = useCallback(async (
    alert_type: DashboardAlert['alert_type'],
    agent_source: string,
    title: string,
    message: string,
    severity: DashboardAlert['severity'] = 'medium',
    metadata: Record<string, any> = {}
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('dashboard_alerts')
        .insert({
          user_id: user.id,
          alert_type,
          agent_source,
          title,
          message,
          severity,
          metadata
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setAlerts(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating alert:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Set up real-time subscription for new alerts
  useEffect(() => {
    const { data: { user } } = supabase.auth.getUser();
    
    user.then((userData) => {
      if (!userData.user) return;

      const channel = supabase
        .channel('dashboard_alerts_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'dashboard_alerts',
            filter: `user_id=eq.${userData.user.id}`
          },
          (payload) => {
            const newAlert = payload.new as DashboardAlert;
            setAlerts(prev => [newAlert, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });
  }, []);

  return {
    alerts,
    isLoading,
    error,
    markAsRead,
    createAlert,
    refreshAlerts: fetchAlerts,
    unreadCount: alerts.filter(alert => !alert.is_read).length
  };
};
