
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RealTimeNotification {
  id: string;
  type: 'agent_completed' | 'agent_failed' | 'data_updated' | 'system_alert';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
}

export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification: Omit<RealTimeNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: RealTimeNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep only latest 50
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast.success(notification.title, {
      description: notification.message,
      action: {
        label: 'عرض',
        onClick: () => markAsRead(newNotification.id)
      }
    });
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Set up real-time subscriptions for data changes
  useEffect(() => {
    const agentResultsChannel = supabase
      .channel('agent_results_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'agent_results'
      }, (payload) => {
        const result = payload.new;
        addNotification({
          type: result.status === 'completed' ? 'agent_completed' : 'agent_failed',
          title: result.status === 'completed' ? 'تم إكمال تحليل الوكيل الذكي' : 'فشل في تحليل الوكيل الذكي',
          message: `تم ${result.status === 'completed' ? 'إكمال' : 'فشل'} تشغيل الوكيل ${result.agent_id}`,
          data: result
        });
      })
      .subscribe();

    const strategicAnalysesChannel = supabase
      .channel('strategic_analyses_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'strategic_analyses'
      }, () => {
        addNotification({
          type: 'data_updated',
          title: 'تحديث التحليل الاستراتيجي',
          message: 'تم إضافة تحليل استراتيجي جديد'
        });
      })
      .subscribe();

    const socialMonitoringChannel = supabase
      .channel('social_monitoring_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'social_monitoring'
      }, () => {
        addNotification({
          type: 'data_updated',
          title: 'تحديث مراقبة وسائل التواصل',
          message: 'تم إضافة بيانات مراقبة جديدة'
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(agentResultsChannel);
      supabase.removeChannel(strategicAnalysesChannel);
      supabase.removeChannel(socialMonitoringChannel);
    };
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
};
