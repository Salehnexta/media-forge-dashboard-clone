
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardMetrics } from '../DashboardMetrics';
import { RealTimeAlerts } from '../RealTimeAlerts';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BarChart3, Users, Calendar, Zap, TrendingDown, Eye, MapPin } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export const EnhancedStrategicDashboard = () => {
  // Mock data for trend forecasting
  const trendData = [
    { month: 'يناير', actual: 65, forecast: 70, confidence: 85 },
    { month: 'فبراير', actual: 72, forecast: 78, confidence: 82 },
    { month: 'مارس', actual: 80, forecast: 85, confidence: 88 },
    { month: 'أبريل', actual: null, forecast: 92, confidence: 75 },
    { month: 'مايو', actual: null, forecast: 98, confidence: 70 },
    { month: 'يونيو', actual: null, forecast: 105, confidence: 68 }
  ];

  // Mock data for keyword gap analysis
  const keywordGapData = [
    { keyword: 'تسويق رقمي', ourPosition: 8, competitorPosition: 3, searchVolume: 12000, opportunity: 'عالية' },
    { keyword: 'استراتيجية التسويق', ourPosition: 15, competitorPosition: 5, searchVolume: 8500, opportunity: 'متوسطة' },
    { keyword: 'تحليل المنافسين', ourPosition: 4, competitorPosition: 2, searchVolume: 6200, opportunity: 'منخفضة' },
    { keyword: 'SEO للشركات', ourPosition: 20, competitorPosition: 1, searchVolume: 15000, opportunity: 'عالية جداً' }
  ];

  // Mock data for competitive positioning
  const competitiveMap = [
    { name: 'شركتنا', marketShare: 15, brandStrength: 65, x: 65, y: 15 },
    { name: 'منافس أ', marketShare: 35, brandStrength: 85, x: 85, y: 35 },
    { name: 'منافس ب', marketShare: 28, brandStrength: 70, x: 70, y: 28 },
    { name: 'منافس ج', marketShare: 22, brandStrength: 60, x: 60, y: 22 }
  ];

  // Mock data for goal progress
  const goalProgress = [
    { goal: 'زيادة المبيعات', target: 100, current: 75, quarter: 'Q1' },
    { goal: 'تحسين الوعي بالعلامة التجارية', target: 100, current: 82, quarter: 'Q1' },
    { goal: 'توسيع قاعدة العملاء', target: 100, current: 68, quarter: 'Q1' },
    { goal: 'تحسين رضا العملاء', target: 100, current: 91, quarter: 'Q1' }
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

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'عالية جداً': return 'text-red-600';
      case 'عالية': return 'text-orange-600';
      case 'متوسطة': return 'text-yellow-600';
      case 'منخفضة': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <RealTimeAlerts />
      
      {/* Real-time KPI Metrics */}
      <DashboardMetrics agentType="strategic" />

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Trend Forecasting Chart */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              توقعات الاتجاهات المستقبلية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fill="url(#actualGradient)"
                  name="الأداء الفعلي"
                />
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  strokeDasharray="8 8"
                  fill="url(#forecastGradient)"
                  name="التوقعات"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Competitive Positioning Map */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <MapPin className="w-5 h-5 text-purple-600" />
              خريطة الموقع التنافسي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={competitiveMap}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="x" 
                  name="قوة العلامة التجارية"
                  stroke="#6b7280" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  dataKey="y" 
                  name="نصيب السوق"
                  stroke="#6b7280" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px'
                  }}
                  formatter={(value, name) => [
                    `${value}%`, 
                    name === 'x' ? 'قوة العلامة التجارية' : 'نصيب السوق'
                  ]}
                />
                <Scatter 
                  dataKey="y" 
                  fill="#8b5cf6" 
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {competitiveMap.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      item.name === 'شركتنا' ? 'bg-blue-600' : 'bg-purple-600'
                    }`}
                  ></div>
                  <span className={`${
                    item.name === 'شركتنا' ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Gap Analysis */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Eye className="w-5 h-5 text-orange-600" />
            تحليل فجوات الكلمات المفتاحية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right py-3 px-4 text-gray-900 font-medium">الكلمة المفتاحية</th>
                  <th className="text-center py-3 px-4 text-gray-900 font-medium">موقعنا</th>
                  <th className="text-center py-3 px-4 text-gray-900 font-medium">موقع المنافس</th>
                  <th className="text-center py-3 px-4 text-gray-900 font-medium">حجم البحث</th>
                  <th className="text-center py-3 px-4 text-gray-900 font-medium">الفرصة</th>
                </tr>
              </thead>
              <tbody>
                {keywordGapData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-900 font-medium">{item.keyword}</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        #{item.ourPosition}
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline" className="text-purple-600 border-purple-600">
                        #{item.competitorPosition}
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-600">
                      {item.searchVolume.toLocaleString()}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`font-medium ${getOpportunityColor(item.opportunity)}`}>
                        {item.opportunity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Goal Progress Tracker */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Target className="w-5 h-5 text-green-600" />
            متابعة تقدم الأهداف
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goalProgress.map((goal, index) => (
              <div key={index} className="space-y-3 p-4 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">{goal.goal}</h4>
                  <span className={`text-sm font-bold ${getProgressColor(goal.current)}`}>
                    {goal.current}%
                  </span>
                </div>
                <Progress value={goal.current} className="h-3" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>الهدف: {goal.target}%</span>
                  <span>{goal.quarter}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Competitor Analysis */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              تحليل المنافسين المحدث
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competitors.map((competitor, index) => (
              <div key={index} className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{competitor.name}</span>
                  <span className={`text-sm font-medium ${
                    competitor.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
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

        {/* Enhanced 90-Day Roadmap */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Calendar className="w-5 h-5 text-purple-600" />
              خارطة الطريق 90 يوم
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roadmapItems.map((item, index) => (
              <div key={index} className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">{item.task}</h4>
                  <Badge 
                    className={`${
                      item.priority === 'عالية' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                      item.priority === 'متوسطة' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                      'bg-gradient-to-r from-gray-500 to-gray-600'
                    } text-white border-0`}
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

      {/* Enhanced Executive Summary */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              الملخص التنفيذي المحدث
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6" />
                <h4 className="font-semibold">الأداء العام</h4>
              </div>
              <p className="text-3xl font-bold mb-2">نمو 23%</p>
              <p className="text-sm opacity-90">مقارنة بالشهر الماضي</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6" />
                <h4 className="font-semibold">التوصيات الاستراتيجية</h4>
              </div>
              <p className="text-3xl font-bold mb-2">8 توصيات</p>
              <p className="text-sm opacity-90">عالية الأولوية</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-6 h-6" />
                <h4 className="font-semibold">الاتجاهات المستقبلية</h4>
              </div>
              <p className="text-3xl font-bold mb-2">إيجابية</p>
              <p className="text-sm opacity-90">للربع القادم</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
