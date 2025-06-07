
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Zap, 
  Target, 
  DollarSign,
  Activity,
  Bell,
  Settings,
  Plus,
  ChevronRight,
  Calendar,
  Globe,
  Megaphone,
  PenTool,
  Brain
} from 'lucide-react';

interface KPIMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'campaign' | 'content' | 'analysis' | 'social';
  status: 'success' | 'pending' | 'warning';
}

const kpiMetrics: KPIMetric[] = [
  {
    id: 'revenue',
    title: 'الإيرادات الشهرية',
    value: '124,500 ر.س',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-green-600'
  },
  {
    id: 'campaigns',
    title: 'الحملات النشطة',
    value: '8',
    change: '+2',
    trend: 'up',
    icon: Megaphone,
    color: 'text-blue-600'
  },
  {
    id: 'engagement',
    title: 'معدل التفاعل',
    value: '4.2%',
    change: '+0.8%',
    trend: 'up',
    icon: Users,
    color: 'text-purple-600'
  },
  {
    id: 'conversion',
    title: 'معدل التحويل',
    value: '2.8%',
    change: '-0.2%',
    trend: 'down',
    icon: Target,
    color: 'text-orange-600'
  }
];

const quickActions: QuickAction[] = [
  {
    id: 'new-campaign',
    title: 'حملة جديدة',
    description: 'إنشاء حملة تسويقية',
    icon: Megaphone,
    color: 'bg-blue-500',
    onClick: () => console.log('New campaign')
  },
  {
    id: 'create-content',
    title: 'محتوى إبداعي',
    description: 'إنتاج محتوى جديد',
    icon: PenTool,
    color: 'bg-purple-500',
    onClick: () => console.log('Create content')
  },
  {
    id: 'analyze-data',
    title: 'تحليل البيانات',
    description: 'تحليل أداء شامل',
    icon: BarChart3,
    color: 'bg-green-500',
    onClick: () => console.log('Analyze data')
  },
  {
    id: 'ai-insights',
    title: 'رؤى ذكية',
    description: 'توصيات مدعومة بالذكاء الاصطناعي',
    icon: Brain,
    color: 'bg-orange-500',
    onClick: () => console.log('AI insights')
  }
];

const recentActivities: RecentActivity[] = [
  {
    id: '1',
    title: 'تم إطلاق حملة "العروض الصيفية"',
    description: 'حملة إعلانية على فيسبوك وانستغرام',
    timestamp: 'منذ 30 دقيقة',
    type: 'campaign',
    status: 'success'
  },
  {
    id: '2',
    title: 'تم إنتاج 5 منشورات جديدة',
    description: 'محتوى إبداعي للمنصات الاجتماعية',
    timestamp: 'منذ ساعة',
    type: 'content',
    status: 'success'
  },
  {
    id: '3',
    title: 'تحليل أداء الحملات',
    description: 'تقرير شامل لحملات الشهر الماضي',
    timestamp: 'منذ 3 ساعات',
    type: 'analysis',
    status: 'pending'
  },
  {
    id: '4',
    title: 'مراجعة التفاعل على تويتر',
    description: 'انخفاض في معدل التفاعل بنسبة 5%',
    timestamp: 'منذ 5 ساعات',
    type: 'social',
    status: 'warning'
  }
];

export const EnhancedDashboardLayout = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'campaign': return Megaphone;
      case 'content': return PenTool;
      case 'analysis': return BarChart3;
      case 'social': return Globe;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'warning': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم الرئيسية</h1>
          <p className="text-gray-600 mt-1">نظرة شاملة على أداء التسويق الرقمي</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={selectedTimeframe === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('day')}
            >
              اليوم
            </Button>
            <Button
              variant={selectedTimeframe === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('week')}
            >
              الأسبوع
            </Button>
            <Button
              variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe('month')}
            >
              الشهر
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            مشروع جديد
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className={`w-4 h-4 ${
                        metric.trend === 'up' ? 'text-green-500' : 
                        metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="ghost"
                    className="w-full h-auto p-4 justify-start"
                    onClick={action.onClick}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-right flex-1">
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                توصيات ذكية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      زيادة ميزانية حملة "المنتجات الجديدة"
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      الحملة تحقق أداءً ممتازاً بمعدل تحويل 3.2%
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      إنتاج محتوى لمنصة تيك توك
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      فرصة للوصول لجمهور الشباب بمحتوى مرئي
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      تحسين كلمات البحث المدفوعة
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      3 كلمات مفتاحية جديدة بإمكانات عالية
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className={`p-2 rounded-lg ${getStatusColor(activity.status)} bg-gray-100`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={
                                activity.status === 'success' ? 'default' :
                                activity.status === 'pending' ? 'secondary' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {activity.status === 'success' ? 'مكتمل' :
                               activity.status === 'pending' ? 'قيد التنفيذ' : 'يحتاج مراجعة'}
                            </Badge>
                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
