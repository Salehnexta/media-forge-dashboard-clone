
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3, Users, Calendar, Zap } from 'lucide-react';

export const StrategicDashboard = () => {
  const kpiData = [
    { title: 'نمو الزيارات العضوية', value: '23%', trend: '+5%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { title: 'ترتيب الكلمات المفتاحية', value: '145', trend: '+12', icon: Target, color: 'from-blue-500 to-blue-600' },
    { title: 'معدل التحويل', value: '3.2%', trend: '+0.5%', icon: BarChart3, color: 'from-purple-500 to-purple-600' },
    { title: 'الوصول الاجتماعي', value: '45K', trend: '+8%', icon: Users, color: 'from-orange-500 to-orange-600' }
  ];

  const competitors = [
    { name: 'منافس أ', shareOfVoice: 35, organicTraffic: '125K', trend: '+5%' },
    { name: 'منافس ب', shareOfVoice: 28, organicTraffic: '98K', trend: '-2%' },
    { name: 'منافس ج', shareOfVoice: 22, organicTraffic: '87K', trend: '+3%' },
    { name: 'شركتنا', shareOfVoice: 15, organicTraffic: '65K', trend: '+12%' }
  ];

  const roadmapItems = [
    { task: 'حملة الربع الأول', progress: 75, priority: 'عالية', deadline: '15 مارس' },
    { task: 'تحسين SEO التقني', progress: 60, priority: 'متوسطة', deadline: '30 مارس' },
    { task: 'استراتيجية المحتوى', progress: 40, priority: 'عالية', deadline: '10 أبريل' },
    { task: 'تحليل المنافسين', progress: 85, priority: 'منخفضة', deadline: '5 أبريل' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</p>
                  <p className="text-sm text-green-600 font-medium">{kpi.trend}</p>
                </div>
                <div className={`bg-gradient-to-r ${kpi.color} p-4 rounded-xl`}>
                  <kpi.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Analysis */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              تحليل المنافسين
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competitors.map((competitor, index) => (
              <div key={index} className="space-y-2 p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{competitor.name}</span>
                  <span className={`text-sm ${competitor.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {competitor.trend}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>نصيب الصوت: {competitor.shareOfVoice}%</span>
                  <span>الزيارات: {competitor.organicTraffic}</span>
                </div>
                <Progress value={competitor.shareOfVoice} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 90-Day Roadmap */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              خارطة الطريق 90 يوم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roadmapItems.map((item, index) => (
              <div key={index} className="space-y-3 p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{item.task}</h4>
                  <Badge 
                    className={`${
                      item.priority === 'عالية' ? 'bg-red-500' : 
                      item.priority === 'متوسطة' ? 'bg-yellow-500' : 'bg-gray-500'
                    } text-white`}
                  >
                    {item.priority}
                  </Badge>
                </div>
                <Progress value={item.progress} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الموعد النهائي: {item.deadline}</span>
                  <span className="font-medium text-blue-600">{item.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            الملخص التنفيذي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
              <h4 className="font-semibold mb-2">الأداء العام</h4>
              <p className="text-2xl font-bold mb-1">نمو 23%</p>
              <p className="text-sm opacity-90">مقارنة بالشهر الماضي</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <h4 className="font-semibold mb-2">التوصيات الاستراتيجية</h4>
              <p className="text-2xl font-bold mb-1">8 توصيات</p>
              <p className="text-sm opacity-90">عالية الأولوية</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <h4 className="font-semibold mb-2">الاتجاهات المستقبلية</h4>
              <p className="text-2xl font-bold mb-1">إيجابية</p>
              <p className="text-sm opacity-90">للربع القادم</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
