import { toast } from 'sonner';

export interface AlertsStatus {
  status: 'active' | 'inactive' | 'error';
  websocket_connections: number;
  last_check: string;
  categories: string[];
}

export interface SmartAlert {
  id: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  action_url?: string;
  timestamp: string;
  acknowledged?: boolean;
}

export class SmartAlertsManager {
  private apiUrl: string;
  private alerts: SmartAlert[] = [];
  private onAlertCallback?: (alert: SmartAlert) => void;

  constructor(apiUrl: string = 'https://crewai-production-d99a.up.railway.app') {
    this.apiUrl = apiUrl;
  }

  setOnAlertCallback(callback: (alert: SmartAlert) => void): void {
    this.onAlertCallback = callback;
  }

  async getAlertsStatus(): Promise<AlertsStatus | null> {
    try {
      console.log('🔍 Fetching alerts status from:', `${this.apiUrl}/api/v2/alerts/status`);
      const response = await fetch(`${this.apiUrl}/api/v2/alerts/status`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Alerts status received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error getting alerts status:', error);
      toast.error('فشل في جلب حالة التنبيهات');
      return null;
    }
  }

  async triggerAlertsCheck(organizationId: string): Promise<any> {
    try {
      console.log('🔍 Triggering alerts check for org:', organizationId);
      const response = await fetch(`${this.apiUrl}/api/v2/alerts/check/${organizationId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Alerts check triggered:', data);
      toast.success('تم بدء فحص التنبيهات الذكية');
      return data;
    } catch (error) {
      console.error('❌ Error triggering alerts:', error);
      toast.error('فشل في تشغيل فحص التنبيهات');
      throw error;
    }
  }

  addAlert(alert: SmartAlert): void {
    this.alerts.unshift(alert);
    this.onAlertCallback?.(alert);
    
    // Keep only the latest 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(0, 50);
    }
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      console.log('✅ Alert acknowledged:', alertId);
    }
  }

  getAlerts(): SmartAlert[] {
    return this.alerts;
  }

  getUnacknowledgedAlerts(): SmartAlert[] {
    return this.alerts.filter(alert => !alert.acknowledged);
  }

  clearAlerts(): void {
    this.alerts = [];
  }

  getPriorityStats(): Record<string, number> {
    const stats = { low: 0, medium: 0, high: 0, critical: 0 };
    this.alerts.forEach(alert => {
      if (!alert.acknowledged) {
        stats[alert.priority]++;
      }
    });
    return stats;
  }
}

// Export singleton instance
export const smartAlertsManager = new SmartAlertsManager();
