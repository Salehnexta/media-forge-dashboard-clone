
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageSquare, TrendingUp, AlertTriangle, Zap, Brain } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface EmotionData {
  emotion: string;
  value: number;
  color: string;
  trend: number;
}

interface SentimentTrend {
  time: string;
  positive: number;
  neutral: number;
  negative: number;
  volume: number;
}

export const SentimentAnalysis = () => {
  const emotionsData: EmotionData[] = [
    { emotion: 'فرح', value: 45, color: '#10b981', trend: 12 },
    { emotion: 'ثقة', value: 20, color: '#3b82f6', trend: 8 },
    { emotion: 'حماس', value: 15, color: '#f59e0b', trend: 15 },
    { emotion: 'غضب', value: 8, color: '#ef4444', trend: -5 },
    { emotion: 'خوف', value: 7, color: '#8b5cf6', trend: -3 },
    { emotion: 'حزن', value: 5, color: '#6b7280', trend: -2 }
  ];

  const sentimentTrends: SentimentTrend[] = [
    { time: '00:00', positive: 65, neutral: 25, negative: 10, volume: 1200 },
    { time: '04:00', positive: 62, neutral: 28, negative: 10, volume: 890 },
    { time: '08:00', positive: 70, neutral: 20, negative: 10, volume: 2100 },
    { time: '12:00', positive: 68, neutral: 22, negative: 10, volume: 3200 },
    { time: '16:00', positive: 72, neutral: 18, negative: 10, volume: 2800 },
    { time: '20:00', positive: 75, neutral: 15, negative: 10, volume: 3500 }
  ];

  const platformSentiment = [
    { platform: 'تويتر', positive: 68, neutral: 22, negative: 10, mentions: 2450 },
    { platform: 'إنستغرام', positive: 78, neutral: 18, negative: 4, mentions: 1890 },
    { platform: 'فيسبوك', positive: 65, neutral: 25, negative: 10, mentions: 1560 },
    { platform: 'لينكد إن', positive: 82, neutral: 15, negative: 3, mentions: 1200 },
    { platform: 'يوتيوب', positive: 70, neutral: 20, negative: 10, mentions: 890 }
  ];

  const crisisIndicators = [
    { indicator: 'سرعة انتشار المشاعر السلبية', value: 15, threshold: 30, status: 'safe' },
    { indicator: 'حجم الذكر السلبي', value: 8, threshold: 20, status: 'safe' },
    { indicator: 'تفاعل المؤثرين السلبي', value: 25, threshold: 40, status: 'warning' },
    { indicator: 'انتشار الهاشتاغات السلبية', value: 5, threshold: 15, status: 'safe' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'danger': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* نظرة عامة على المشاعر */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">المشاعر الإيجابية</p>
                <p className="text-3xl font-bold text-green-900">71%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+5%</span>
                </div>
              </div>
              <Heart className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">المشاعر المحايدة</p>
                <p className="text-3xl font-bold text-yellow-900">19%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">+2%</span>
                </div>
              </div>
              <MessageSquare className="w-12 h-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">المشاعر السلبية</p>
                <p className="text-3xl font-bold text-red-900">10%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">-3%</span>
                </div>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">درجة الثقة</p>
                <p className="text-3xl font-bold text-blue-900">87%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600">دقيق</span>
                </div>
              </div>
              <Zap className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* التحليل التفصيلي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* تحليل المشاعر العاطفية */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Brain className="w-5 h-5 text-purple-600" />
              التحليل العاطفي المتقدم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emotionsData.map((emotion, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{emotion.emotion}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{emotion.value}%</span>
                      <span className={`text-xs ${
                        emotion.trend >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {emotion.trend >= 0 ? '+' : ''}{emotion.trend}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${emotion.value}%`,
                        backgroundColor: emotion.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* مؤشرات الأزمات */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              مؤشرات إدارة الأزمات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crisisIndicators.map((indicator, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{indicator.indicator}</span>
                    <Badge className={getStatusColor(indicator.status)}>
                      {indicator.status === 'safe' && 'آمن'}
                      {indicator.status === 'warning' && 'تحذير'}
                      {indicator.status === 'danger' && 'خطر'}
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress value={indicator.value} className="h-3" />
                    <div 
                      className="absolute top-0 w-1 h-3 bg-red-500 opacity-70"
                      style={{ left: `${indicator.threshold}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{indicator.value}%</span>
                    <span>عتبة التحذير: {indicator.threshold}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* اتجاهات المشاعر عبر الوقت */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            اتجاهات المشاعر عبر الوقت
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sentimentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="positive" 
                stroke="#10b981" 
                strokeWidth={3}
                name="إيجابي"
              />
              <Line 
                type="monotone" 
                dataKey="neutral" 
                stroke="#f59e0b" 
                strokeWidth={3}
                name="محايد"
              />
              <Line 
                type="monotone" 
                dataKey="negative" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="سلبي"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* المشاعر حسب المنصة */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            تحليل المشاعر حسب المنصة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {platformSentiment.map((platform, index) => (
              <div key={index} className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900">{platform.platform}</h4>
                  <span className="text-sm text-gray-600">{platform.mentions.toLocaleString()} إشارة</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">إيجابي ({platform.positive}%)</span>
                    <span className="text-yellow-600">محايد ({platform.neutral}%)</span>
                    <span className="text-red-600">سلبي ({platform.negative}%)</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${platform.positive}%` }}
                    ></div>
                    <div 
                      className="bg-yellow-500" 
                      style={{ width: `${platform.neutral}%` }}
                    ></div>
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${platform.negative}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
