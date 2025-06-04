
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Globe, Search, Users, Eye, MousePointer, Clock } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const seoMetrics = [
    { metric: 'الكلمات المفتاحية في المرتبة الأولى', value: '23', change: '+5', trend: 'up' },
    { metric: 'الترافيك العضوي', value: '15.2K', change: '+12%', trend: 'up' },
    { metric: 'نتيجة صحة الموقع', value: '85/100', change: '+3', trend: 'up' },
    { metric: 'سرعة الموقع', value: '2.3s', change: '-0.2s', trend: 'up' }
  ];

  const keywordPerformance = [
    { keyword: 'التسويق الرقمي', position: 3, volume: '12K', difficulty: 45, trend: 'up' },
    { keyword: 'استراتيجية التسويق', position: 7, volume: '8.5K', difficulty: 38, trend: 'up' },
    { keyword: 'وسائل التواصل الاجتماعي', position: 12, volume: '15K', difficulty: 52, trend: 'down' },
    { keyword: 'تحليل البيانات', position: 5, volume: '6.2K', difficulty: 41, trend: 'stable' }
  ];

  const trafficSources = [
    { source: 'البحث العضوي', visitors: '45.2K', percentage: 42, revenue: '25,000 ريال' },
    { source: 'المباشر', visitors: '28.7K', percentage: 27, revenue: '18,500 ريال' },
    { source: 'وسائل التواصل', visitors: '18.4K', percentage: 17, revenue: '12,300 ريال' },
    { source: 'الإعلانات المدفوعة', visitors: '15.1K', percentage: 14, revenue: '22,800 ريال' }
  ];

  const userBehavior = [
    { page: '/الصفحة-الرئيسية', views: '12.5K', bounce: '35%', time: '2:45', conversions: 234 },
    { page: '/المنتجات', views: '8.7K', bounce: '45%', time: '3:12', conversions: 167 },
    { page: '/حول-الشركة', views: '5.2K', bounce: '28%', time: '1:58', conversions: 89 },
    { page: '/اتصل-بنا', views: '3.9K', bounce: '52%', time: '1:23', conversions: 145 }
  ];

  const competitorAnalysis = [
    { competitor: 'منافس أ', organicTraffic: '125K', keywords: '2.3K', backlinks: '1.2K', score: 85 },
    { competitor: 'منافس ب', organicTraffic: '98K', keywords: '1.8K', backlinks: '890', score: 76 },
    { competitor: 'منافس ج', organicTraffic: '87K', keywords: '1.5K', backlinks: '750', score: 68 },
    { competitor: 'شركتنا', organicTraffic: '65K', keywords: '1.2K', backlinks: '456', score: 72 }
  ];

  const predictiveInsights = [
    { 
      insight: 'توقع زيادة في الترافيك بنسبة 25% الشهر القادم', 
      confidence: 85, 
      category: 'نمو',
      impact: 'عالي'
    },
    { 
      insight: 'موسم الذروة متوقع في أبريل ومايو', 
      confidence: 92, 
      category: 'موسمية',
      impact: 'متوسط'
    },
    { 
      insight: 'فرصة لتحسين ترتيب 5 كلمات مفتاحية', 
      confidence: 78, 
      category: 'SEO',
      impact: 'عالي'
    },
    { 
      insight: 'انخفاض متوقع في معدل الارتداد', 
      confidence: 71, 
      category: 'تجربة المستخدم',
      impact: 'متوسط'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'عالي': return 'bg-red-500';
      case 'متوسط': return 'bg-yellow-500';
      case 'منخفض': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* SEO Metrics Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            مؤشرات SEO الرئيسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {seoMetrics.map((metric, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50">
                <h4 className="text-sm font-medium text-gray-600 mb-2">{metric.metric}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                    <span className="text-sm font-medium">{metric.change}</span>
                    <span>{getTrendIcon(metric.trend)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Keyword Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              أداء الكلمات المفتاحية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {keywordPerformance.map((keyword, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">{keyword.keyword}</span>
                  <div className={`flex items-center gap-1 ${getTrendColor(keyword.trend)}`}>
                    <span className="text-xs">المرتبة {keyword.position}</span>
                    <span>{getTrendIcon(keyword.trend)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                  <div>
                    <span>حجم البحث: </span>
                    <span className="font-medium">{keyword.volume}</span>
                  </div>
                  <div>
                    <span>الصعوبة: </span>
                    <span className="font-medium">{keyword.difficulty}%</span>
                  </div>
                </div>
                <Progress value={100 - keyword.difficulty} className="h-1 mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              مصادر الزيارات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{source.source}</span>
                  <span className="text-sm text-gray-600">{source.visitors}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>{source.percentage}% من إجمالي الزيارات</span>
                  <span className="text-green-600 font-medium">{source.revenue}</span>
                </div>
                <Progress value={source.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* User Behavior Analysis */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            تحليل سلوك المستخدمين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-2">الصفحة</th>
                  <th className="text-right py-2">المشاهدات</th>
                  <th className="text-right py-2">معدل الارتداد</th>
                  <th className="text-right py-2">متوسط الوقت</th>
                  <th className="text-right py-2">التحويلات</th>
                </tr>
              </thead>
              <tbody>
                {userBehavior.map((page, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium">{page.page}</td>
                    <td className="py-3">{page.views}</td>
                    <td className="py-3">
                      <span className={`${parseInt(page.bounce) > 40 ? 'text-red-600' : 'text-green-600'}`}>
                        {page.bounce}
                      </span>
                    </td>
                    <td className="py-3">{page.time}</td>
                    <td className="py-3 text-green-600 font-medium">{page.conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitor Analysis */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              تحليل المنافسين
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competitorAnalysis.map((competitor, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{competitor.competitor}</span>
                  <Badge className="bg-blue-500 text-white">{competitor.score}%</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{competitor.organicTraffic}</div>
                    <div>ترافيك عضوي</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{competitor.keywords}</div>
                    <div>كلمات مفتاحية</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{competitor.backlinks}</div>
                    <div>روابط خلفية</div>
                  </div>
                </div>
                <Progress value={competitor.score} className="h-1 mt-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Predictive Insights */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              رؤى تنبؤية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictiveInsights.map((prediction, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium">{prediction.insight}</p>
                  <Badge className={`${getImpactColor(prediction.impact)} text-white text-xs`}>
                    {prediction.impact}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">فئة: {prediction.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">الثقة:</span>
                    <Progress value={prediction.confidence} className="h-1 w-16" />
                    <span className="text-xs font-medium">{prediction.confidence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
