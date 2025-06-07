import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart3, TrendingUp, Users, MessageCircle, Zap, Target, DollarSign, Activity, Plus, ChevronRight, Megaphone, PenTool, Brain, Globe, Eye, MousePointer, ShoppingCart } from 'lucide-react';
interface KPIMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: string;
  bgColor: string;
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
const kpiMetrics: KPIMetric[] = [{
  id: 'revenue',
  title: 'الإيرادات الشهرية',
  value: '124,500 ر.س',
  change: '+12.5%',
  trend: 'up',
  icon: DollarSign,
  color: 'text-green-600',
  bgColor: 'bg-green-100'
}, {
  id: 'campaigns',
  title: 'الحملات النشطة',
  value: '8',
  change: '+2',
  trend: 'up',
  icon: Megaphone,
  color: 'text-blue-600',
  bgColor: 'bg-blue-100'
}, {
  id: 'engagement',
  title: 'معدل التفاعل',
  value: '4.2%',
  change: '+0.8%',
  trend: 'up',
  icon: Users,
  color: 'text-purple-600',
  bgColor: 'bg-purple-100'
}, {
  id: 'conversion',
  title: 'معدل التحويل',
  value: '2.8%',
  change: '-0.2%',
  trend: 'down',
  icon: Target,
  color: 'text-orange-600',
  bgColor: 'bg-orange-100'
}];
const quickActions: QuickAction[] = [{
  id: 'new-campaign',
  title: 'حملة جديدة',
  description: 'إنشاء حملة تسويقية متقدمة',
  icon: Megaphone,
  color: 'from-blue-500 to-blue-600',
  onClick: () => console.log('New campaign')
}, {
  id: 'create-content',
  title: 'محتوى إبداعي',
  description: 'إنتاج محتوى بالذكاء الاصطناعي',
  icon: PenTool,
  color: 'from-purple-500 to-purple-600',
  onClick: () => console.log('Create content')
}, {
  id: 'analyze-data',
  title: 'تحليل البيانات',
  description: 'تحليل شامل للأداء والنتائج',
  icon: BarChart3,
  color: 'from-green-500 to-green-600',
  onClick: () => console.log('Analyze data')
}, {
  id: 'ai-insights',
  title: 'رؤى ذكية',
  description: 'توصيات مدعومة بالذكاء الاصطناعي',
  icon: Brain,
  color: 'from-orange-500 to-orange-600',
  onClick: () => console.log('AI insights')
}];
const recentActivities: RecentActivity[] = [{
  id: '1',
  title: 'تم إطلاق حملة "العروض الصيفية"',
  description: 'حملة إعلانية متعددة المنصات بميزانية 15,000 ر.س',
  timestamp: 'منذ 30 دقيقة',
  type: 'campaign',
  status: 'success'
}, {
  id: '2',
  title: 'تم إنتاج 12 منشور جديد',
  description: 'محتوى إبداعي للمنصات الاجتماعية بـ 3 لغات',
  timestamp: 'منذ ساعة',
  type: 'content',
  status: 'success'
}, {
  id: '3',
  title: 'تقرير تحليل الأداء الأسبوعي',
  description: 'تحليل شامل لجميع الحملات والمقاييس الرئيسية',
  timestamp: 'منذ 3 ساعات',
  type: 'analysis',
  status: 'pending'
}, {
  id: '4',
  title: 'تنبيه: انخفاض التفاعل على تويتر',
  description: 'انخفاض بنسبة 5% - يحتاج مراجعة استراتيجية',
  timestamp: 'منذ 5 ساعات',
  type: 'social',
  status: 'warning'
}];
export const EnhancedDashboardLayout = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'campaign':
        return Megaphone;
      case 'content':
        return PenTool;
      case 'analysis':
        return BarChart3;
      case 'social':
        return Globe;
      default:
        return Activity;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'warning':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            مرحباً بك في مورفو AI
          </h1>
          <p className="text-gray-600 mt-1">نظرة شاملة على أداء التسويق الرقمي الخاص بك</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
            <Button variant={selectedTimeframe === 'day' ? 'default' : 'ghost'} size="sm" onClick={() => setSelectedTimeframe('day')} className={selectedTimeframe === 'day' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : ''}>
              اليوم
            </Button>
            <Button variant={selectedTimeframe === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => setSelectedTimeframe('week')} className={selectedTimeframe === 'week' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : ''}>
              الأسبوع
            </Button>
            <Button variant={selectedTimeframe === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setSelectedTimeframe('month')} className={selectedTimeframe === 'month' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : ''}>
              الشهر
            </Button>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-left">
            <Plus className="w-4 h-4" />
            مشروع جديد
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map(metric => {
        const Icon = metric.icon;
        return <Card key={metric.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
                      <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl ${metric.bgColor}`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-blue-600" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map(action => {
              const Icon = action.icon;
              return <Button key={action.id} variant="ghost" className="w-full h-auto p-4 justify-start hover:bg-gray-50 transition-all duration-200" onClick={action.onClick}>
                    <div className="flex items-center gap-3 w-full">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-right flex-1">
                        <p className="font-semibold text-sm text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Button>;
            })}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="mt-6 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-purple-600" />
                توصيات ذكية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      زيادة ميزانية حملة "المنتجات الجديدة"
                    </p>
                    <p className="text-xs text-blue-700">
                      الحملة تحقق أداءً ممتازاً بمعدل تحويل 3.2% وROAS عالي
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      إنتاج محتوى لمنصة تيك توك
                    </p>
                    <p className="text-xs text-green-700">
                      فرصة للوصول لجمهور الشباب - نمو 45% في المشاهدات
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-semibold text-purple-900 mb-1">
                      تحسين كلمات البحث المدفوعة
                    </p>
                    <p className="text-xs text-purple-700">
                      7 كلمات مفتاحية جديدة بإمكانات عالية وتكلفة منخفضة
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-green-600" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {recentActivities.map(activity => {
                  const Icon = getActivityIcon(activity.type);
                  const statusClasses = getStatusColor(activity.status);
                  return <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                        <div className={`p-3 rounded-xl ${statusClasses}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{activity.title}</p>
                          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                          <div className="flex items-center gap-3">
                            <Badge className={`text-xs ${statusClasses} border-0`}>
                              {activity.status === 'success' ? 'مكتمل' : activity.status === 'pending' ? 'قيد التنفيذ' : 'يحتاج مراجعة'}
                            </Badge>
                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          </div>
                        </div>
                      </div>;
                })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};