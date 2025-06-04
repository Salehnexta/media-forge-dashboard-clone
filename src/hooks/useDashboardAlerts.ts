
import { useState, useEffect, useCallback } from 'react';

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

      // Simulate API call with mock data for now
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockAlerts: DashboardAlert[] = [
        {
          id: '1',
          user_id: 'mock-user',
          alert_type: 'crisis',
          agent_source: 'm2',
          title: 'أزمة في وسائل التواصل الاجتماعي',
          message: 'تم اكتشاف مشاعر سلبية عالية في المنشورات الأخيرة',
          severity: 'high',
          is_read: false,
          metadata: {},
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: 'mock-user',
          alert_type: 'opportunity',
          agent_source: 'm1',
          title: 'فرصة استراتيجية جديدة',
          message: 'تم اكتشاف ترند صاعد في قطاعكم',
          severity: 'medium',
          is_read: false,
          metadata: {},
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        }
      ];

      setAlerts(mockAlerts);
    } catch (err) {
      console.error('Error fetching dashboard alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (alertId: string) => {
    try {
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
      const newAlert: DashboardAlert = {
        id: Date.now().toString(),
        user_id: 'mock-user',
        alert_type,
        agent_source,
        title,
        message,
        severity,
        is_read: false,
        metadata,
        created_at: new Date().toISOString()
      };

      setAlerts(prev => [newAlert, ...prev]);
      return newAlert;
    } catch (err) {
      console.error('Error creating alert:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

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
