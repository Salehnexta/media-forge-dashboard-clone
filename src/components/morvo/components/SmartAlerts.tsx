
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Plus, 
  Settings, 
  Mail, 
  MessageSquare, 
  Webhook,
  TrendingUp,
  TrendingDown,
  Eye,
  Bell,
  Clock,
  Shield
} from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  threshold: number;
  metric: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  notifications: string[];
  lastTriggered?: string;
  triggerCount: number;
}

interface ActiveAlert {
  id: string;
  ruleName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  isRead: boolean;
  actionTaken?: string;
}

export const SmartAlerts = () => {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'مشاعر سلبية عالية',
      description: 'تنبيه عند ارتفاع المشاعر السلبية فوق 20%',
      condition: 'greater_than',
      threshold: 20,
      metric: 'negative_sentiment',
      severity: 'high',
      isActive: true,
      notifications: ['email', 'slack'],
      lastTriggered: 'منذ 3 ساعات',
      triggerCount: 12
    },
    {
      id: '2',
      name: 'نمو الإشارات السريع',
      description: 'تنبيه عند زيادة الإشارات بنسبة 30% في ساعة واحدة',
      condition: 'growth_rate',
      threshold: 30,
      metric: 'mentions_growth',
      severity: 'critical',
      isActive: true,
      notifications: ['email', 'webhook', 'app'],
      lastTriggered: 'منذ 1 ساعة',
      triggerCount: 5
    },
    {
      id: '3',
      name: 'تفاعل المؤثرين',
      description: 'تنبيه عند تفاعل أحد المؤثرين الكبار مع العلامة التجارية',
      condition: 'influencer_mention',
      threshold: 50000,
      metric: 'influencer_followers',
      severity: 'medium',
      isActive: true,
      notifications: ['app', 'email'],
      lastTriggered: 'منذ 6 ساعات',
      triggerCount: 8
    }
  ]);

  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([
    {
      id: '1',
      ruleName: 'مشاعر سلبية عالية',
      message: 'ارتفعت المشاعر السلبية إلى 25% في آخر ساعة',
      severity: 'high',
      timestamp: 'منذ 15 دقيقة',
      isRead: false
    },
    {
      id: '2',
      ruleName: 'نمو الإشارات السريع',
      message: 'زادت الإشارات بنسبة 45% في آخر ساعة',
      severity: 'critical',
      timestamp: 'منذ 1 ساعة',
      isRead: false,
      actionTaken: 'تم إشعار فريق إدارة الأزمات'
    },
    {
      id: '3',
      ruleName: 'تفاعل المؤثرين',
      message: 'ذكر أحمد محمد (125K متابع) علامتكم التجارية بشكل إيجابي',
      severity: 'medium',
      timestamp: 'منذ 3 ساعات',
      isRead: true
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'high': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      default: return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'medium': return <Eye className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'slack': return <MessageSquare className="w-4 h-4" />;
      case 'webhook': return <Webhook className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const AlertRuleCard = ({ rule }: { rule: AlertRule }) => (
    <Card className="border-0 shadow-xl bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getSeverityIcon(rule.severity)}
              <CardTitle className="text-lg font-bold text-gray-900">{rule.name}</CardTitle>
            </div>
            <Badge className={getSeverityColor(rule.severity)}>
              {rule.severity === 'critical' && 'حرج'}
              {rule.severity === 'high' && 'عالي'}
              {rule.severity === 'medium' && 'متوسط'}
              {rule.severity === 'low' && 'منخفض'}
            </Badge>
          </div>
          <Switch checked={rule.isActive} />
        </div>
        <p className="text-sm text-gray-600">{rule.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">العتبة</p>
            <p className="text-lg font-bold text-gray-900">{rule.threshold}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">مرات التنبيه</p>
            <p className="text-lg font-bold text-gray-900">{rule.triggerCount}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">قنوات التنبيه</p>
          <div className="flex gap-2">
            {rule.notifications.map((type, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {getNotificationIcon(type)}
                {type === 'email' && 'بريد إلكتروني'}
                {type === 'slack' && 'سلاك'}
                {type === 'webhook' && 'ويبهوك'}
                {type === 'app' && 'التطبيق'}
              </Badge>
            ))}
          </div>
        </div>

        {rule.lastTriggered && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            آخر تنبيه: {rule.lastTriggered}
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            تعديل
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            اختبار
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ActiveAlertCard = ({ alert }: { alert: ActiveAlert }) => (
    <Card className={`border-0 shadow-xl ${alert.isRead ? 'bg-gray-50' : 'bg-white'} ${
      !alert.isRead ? 'border-l-4 border-l-blue-600' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getSeverityIcon(alert.severity)}
              <h4 className="font-semibold text-gray-900">{alert.ruleName}</h4>
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity === 'critical' && 'حرج'}
                {alert.severity === 'high' && 'عالي'}
                {alert.severity === 'medium' && 'متوسط'}
                {alert.severity === 'low' && 'منخفض'}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
            {alert.actionTaken && (
              <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                إجراء متخذ: {alert.actionTaken}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{alert.timestamp}</p>
            {!alert.isRead && (
              <Badge className="bg-blue-500 text-white mt-1">
                جديد
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="text-xs">
            عرض التفاصيل
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            اتخاذ إجراء
          </Button>
          {!alert.isRead && (
            <Button size="sm" variant="outline" className="text-xs">
              تعليم كمقروء
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* التنبيهات النشطة */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-600" />
              التنبيهات النشطة
              <Badge className="bg-red-500 text-white">
                {activeAlerts.filter(alert => !alert.isRead).length}
              </Badge>
            </CardTitle>
            <Button size="sm" variant="outline">
              تعليم الكل كمقروء
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <ActiveAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* إعدادات قواعد التنبيه */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">قواعد التنبيه</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          إضافة قاعدة جديدة
        </Button>
      </div>

      {/* قواعد التنبيه */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {alertRules.map((rule) => (
          <AlertRuleCard key={rule.id} rule={rule} />
        ))}
      </div>

      {/* إعدادات عامة للتنبيهات */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            إعدادات التنبيهات العامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">إعدادات البريد الإلكتروني</h3>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">بريد المدير</label>
                <Input placeholder="admin@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">قالب التنبيه</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القالب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">أساسي</SelectItem>
                    <SelectItem value="detailed">مفصل</SelectItem>
                    <SelectItem value="summary">ملخص</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">إعدادات سلاك</h3>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">رابط الويبهوك</label>
                <Input placeholder="https://hooks.slack.com/..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">القناة</label>
                <Input placeholder="#alerts" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">إعدادات متقدمة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">التنبيهات الصوتية</p>
                  <p className="text-sm text-gray-600">تشغيل صوت عند التنبيهات الحرجة</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">التنبيهات المتكررة</p>
                  <p className="text-sm text-gray-600">منع إرسال نفس التنبيه خلال ساعة</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white">
            حفظ الإعدادات
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
