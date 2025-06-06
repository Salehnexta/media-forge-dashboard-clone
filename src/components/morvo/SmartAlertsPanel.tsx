
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Info, CheckCircle, X, ExternalLink, RefreshCw } from 'lucide-react';
import { SmartAlert, AlertsStatus, smartAlertsManager } from '@/services/SmartAlertsManager';
import { toast } from 'sonner';

interface SmartAlertsPanelProps {
  className?: string;
}

export const SmartAlertsPanel = ({ className = '' }: SmartAlertsPanelProps) => {
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [alertsStatus, setAlertsStatus] = useState<AlertsStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAlerts, setIsCheckingAlerts] = useState(false);

  useEffect(() => {
    fetchAlertsStatus();
    loadAlerts();

    // Set up callback for new alerts
    smartAlertsManager.setOnAlertCallback((alert) => {
      setAlerts(prev => [alert, ...prev]);
    });
  }, []);

  const fetchAlertsStatus = async () => {
    setIsLoading(true);
    try {
      const status = await smartAlertsManager.getAlertsStatus();
      setAlertsStatus(status);
    } catch (error) {
      console.error('Error fetching alerts status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlerts = () => {
    const currentAlerts = smartAlertsManager.getAlerts();
    setAlerts(currentAlerts);
  };

  const handleTriggerAlertsCheck = async () => {
    setIsCheckingAlerts(true);
    try {
      await smartAlertsManager.triggerAlertsCheck('default_org');
      toast.success('تم بدء فحص التنبيهات الذكية');
    } catch (error) {
      toast.error('فشل في تشغيل فحص التنبيهات');
    } finally {
      setIsCheckingAlerts(false);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    smartAlertsManager.acknowledgeAlert(alertId);
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const handleClearAlerts = () => {
    smartAlertsManager.clearAlerts();
    setAlerts([]);
    toast.success('تم مسح جميع التنبيهات');
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;
  const priorityStats = smartAlertsManager.getPriorityStats();

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            التنبيهات الذكية
            {unacknowledgedCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unacknowledgedCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAlertsStatus}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={handleTriggerAlertsCheck}
              disabled={isCheckingAlerts}
              size="sm"
            >
              {isCheckingAlerts ? 'جاري الفحص...' : 'فحص التنبيهات'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Status Section */}
        {alertsStatus && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">حالة النظام</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">الحالة: </span>
                <Badge variant={alertsStatus.status === 'active' ? 'default' : 'secondary'}>
                  {alertsStatus.status === 'active' ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
              <div>
                <span className="text-gray-600">الاتصالات: </span>
                <span className="font-medium">{alertsStatus.websocket_connections}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">آخر فحص: </span>
                <span className="font-medium">
                  {new Date(alertsStatus.last_check).toLocaleString('ar-SA')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Priority Stats */}
        {Object.values(priorityStats).some(count => count > 0) && (
          <div className="mb-4 flex gap-2 flex-wrap">
            {priorityStats.critical > 0 && (
              <Badge className="bg-red-100 text-red-800">
                حرج: {priorityStats.critical}
              </Badge>
            )}
            {priorityStats.high > 0 && (
              <Badge className="bg-orange-100 text-orange-800">
                عالي: {priorityStats.high}
              </Badge>
            )}
            {priorityStats.medium > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800">
                متوسط: {priorityStats.medium}
              </Badge>
            )}
            {priorityStats.low > 0 && (
              <Badge className="bg-green-100 text-green-800">
                منخفض: {priorityStats.low}
              </Badge>
            )}
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد تنبيهات حالياً</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all ${
                  alert.acknowledged 
                    ? 'bg-gray-50 border-gray-200 opacity-60' 
                    : `${getPriorityColor(alert.priority)}`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getPriorityIcon(alert.priority)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{alert.title}</h5>
                        <Badge variant="outline" className="text-xs">
                          {alert.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(alert.timestamp).toLocaleString('ar-SA')}</span>
                        {alert.action_url && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => window.open(alert.action_url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            عرض التفاصيل
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear Alerts Button */}
        {alerts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAlerts}
              className="w-full"
            >
              مسح جميع التنبيهات
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
