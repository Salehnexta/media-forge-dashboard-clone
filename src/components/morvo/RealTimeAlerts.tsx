
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const RealTimeAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: 'success',
      title: 'حملة ناجحة',
      message: 'حملة التسويق الرقمي حققت النتائج المطلوبة',
      time: 'منذ 5 دقائق'
    },
    {
      id: 2,
      type: 'warning',
      title: 'تحذير الميزانية',
      message: 'تم استهلاك 80% من ميزانية الحملة',
      time: 'منذ 15 دقيقة'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="border-0 shadow-lg mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Bell className="w-5 h-5 text-blue-600" />
          التنبيهات الفورية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              {getIcon(alert.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <Badge className={getBadgeColor(alert.type)}>
                    {alert.type === 'success' && 'نجاح'}
                    {alert.type === 'warning' && 'تحذير'}
                    {alert.type === 'error' && 'خطأ'}
                    {alert.type === 'info' && 'معلومة'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                <span className="text-xs text-gray-500">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { RealTimeAlerts };
