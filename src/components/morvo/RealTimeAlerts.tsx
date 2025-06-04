
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';
import { useDashboardAlerts } from '@/hooks/useDashboardAlerts';
import { toast } from 'sonner';

export const RealTimeAlerts = () => {
  const { alerts, markAsRead, unreadCount } = useDashboardAlerts();

  const recentAlerts = alerts.slice(0, 3).filter(alert => !alert.is_read);

  useEffect(() => {
    // Show toast for new high priority alerts
    const highPriorityUnread = alerts.filter(
      alert => !alert.is_read && (alert.severity === 'high' || alert.severity === 'critical')
    );

    if (highPriorityUnread.length > 0) {
      const latestAlert = highPriorityUnread[0];
      toast.error(latestAlert.title, {
        description: latestAlert.message,
        duration: 5000,
      });
    }
  }, [alerts]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Info className="w-4 h-4 text-blue-600" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-gradient-to-r from-red-50 to-red-100';
      case 'high':
        return 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100';
      case 'medium':
        return 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100';
      case 'low':
        return 'border-green-500 bg-gradient-to-r from-green-50 to-green-100';
      default:
        return 'border-gray-200 bg-gradient-to-r from-gray-50 to-white';
    }
  };

  if (recentAlerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 max-w-sm space-y-2">
      {recentAlerts.map((alert) => (
        <Alert
          key={alert.id}
          className={`relative ${getSeverityColor(alert.severity)} border-l-4 shadow-xl animate-in slide-in-from-left-5`}
        >
          <div className="flex items-start gap-3">
            {getSeverityIcon(alert.severity)}
            <div className="flex-1 min-w-0">
              <AlertTitle className="text-sm font-semibold flex items-center gap-2 text-gray-900">
                {alert.title}
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                  {alert.agent_source.toUpperCase()}
                </Badge>
              </AlertTitle>
              <AlertDescription className="text-xs text-gray-600 mt-1">
                {alert.message}
              </AlertDescription>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-gray-200 text-gray-500 hover:text-gray-700"
              onClick={() => markAsRead(alert.id)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </Alert>
      ))}
      
      {unreadCount > 3 && (
        <div className="text-center">
          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            +{unreadCount - 3} تنبيهات أخرى
          </Badge>
        </div>
      )}
    </div>
  );
};
