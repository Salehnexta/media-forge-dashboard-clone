
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardMetrics } from '../DashboardMetrics';
import { RealTimeAlerts } from '../RealTimeAlerts';
import { TopicsMonitor } from '../components/TopicsMonitor';
import { SentimentAnalysis } from '../components/SentimentAnalysis';
import { InfluencersManager } from '../components/InfluencersManager';
import { SmartAlerts } from '../components/SmartAlerts';
import { 
  MessageSquare, 
  Heart, 
  Users, 
  Bell, 
  TrendingUp, 
  Eye,
  Brain,
  Crown,
  AlertTriangle,
  Zap
} from 'lucide-react';

export const SocialMediaDashboard = () => {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <RealTimeAlerts />
      
      {/* عرض المقاييس الرئيسية */}
      <DashboardMetrics agentType="monitor" />

      {/* التبويبات الرئيسية */}
      <Tabs defaultValue="topics" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            مراقبة الموضوعات
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            تحليل المشاعر
          </TabsTrigger>
          <TabsTrigger value="influencers" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            المؤثرون
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            التنبيهات الذكية
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            تحليلات متقدمة
          </TabsTrigger>
        </TabsList>

        {/* تبويب مراقبة الموضوعات */}
        <TabsContent value="topics">
          <TopicsMonitor />
        </TabsContent>

        {/* تبويب تحليل المشاعر */}
        <TabsContent value="sentiment">
          <SentimentAnalysis />
        </TabsContent>

        {/* تبويب المؤثرين */}
        <TabsContent value="influencers">
          <InfluencersManager />
        </TabsContent>

        {/* تبويب التنبيهات الذكية */}
        <TabsContent value="alerts">
          <SmartAlerts />
        </TabsContent>

        {/* تبويب التحليلات المتقدمة */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            {/* مقارنة المشاريع والمنافسين */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  مقارنة المشاريع والمنافسين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* حصة الصوت */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">حصة الصوت (Share of Voice)</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'علامتنا التجارية', percentage: 35, color: 'bg-blue-500', mentions: 2450 },
                        { name: 'المنافس الأول', percentage: 28, color: 'bg-red-500', mentions: 1980 },
                        { name: 'المنافس الثاني', percentage: 22, color: 'bg-yellow-500', mentions: 1560 },
                        { name: 'أخرى', percentage: 15, color: 'bg-gray-500', mentions: 1200 }
                      ].map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{item.name}</span>
                            <span className="text-sm text-gray-600">{item.mentions.toLocaleString()} إشارة</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${item.color}`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ترندات الأداء */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">مؤشرات الأداء الرئيسية</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700">نمو الإشارات</span>
                        </div>
                        <p className="text-2xl font-bold text-green-900">+23%</p>
                        <p className="text-xs text-green-600">مقارنة بالشهر الماضي</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-700">متوسط الوصول</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">2.4M</p>
                        <p className="text-xs text-blue-600">إجمالي الوصول الشهري</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-purple-700">معدل التفاعل</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">8.7%</p>
                        <p className="text-xs text-purple-600">متوسط عبر المنصات</p>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-orange-700">مؤشر الصحة</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-900">82/100</p>
                        <p className="text-xs text-orange-600">صحة العلامة التجارية</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* اتجاهات الصناعة */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Zap className="w-5 h-5 text-purple-600" />
                  اتجاهات الصناعة والموضوعات الرائجة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { trend: 'الذكاء الاصطناعي', growth: 45, mentions: 12500, sentiment: 'positive' },
                    { trend: 'التجارة الإلكترونية', growth: 32, mentions: 8900, sentiment: 'positive' },
                    { trend: 'الاستدامة البيئية', growth: 28, mentions: 7200, sentiment: 'positive' },
                    { trend: 'العملات الرقمية', growth: -15, mentions: 5600, sentiment: 'neutral' },
                    { trend: 'العمل عن بُعد', growth: 18, mentions: 4300, sentiment: 'positive' },
                    { trend: 'الأمن السيبراني', growth: 22, mentions: 3800, sentiment: 'neutral' }
                  ].map((trend, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{trend.trend}</h4>
                        <div className="flex items-center gap-1">
                          {trend.growth >= 0 ? 
                            <TrendingUp className="w-4 h-4 text-green-600" /> : 
                            <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                          }
                          <span className={`text-sm font-medium ${
                            trend.growth >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {trend.growth >= 0 ? '+' : ''}{trend.growth}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{trend.mentions.toLocaleString()} إشارة</p>
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          trend.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          trend.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {trend.sentiment === 'positive' && 'إيجابي'}
                          {trend.sentiment === 'negative' && 'سلبي'}
                          {trend.sentiment === 'neutral' && 'محايد'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* تحليل الجمهور */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Users className="w-5 h-5 text-blue-600" />
                  تحليل الجمهور المتفاعل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* التوزيع الجغرافي */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">التوزيع الجغرافي</h3>
                    <div className="space-y-3">
                      {[
                        { country: 'السعودية', percentage: 45, flag: '🇸🇦' },
                        { country: 'الإمارات', percentage: 22, flag: '🇦🇪' },
                        { country: 'مصر', percentage: 18, flag: '🇪🇬' },
                        { country: 'الكويت', percentage: 10, flag: '🇰🇼' },
                        { country: 'أخرى', percentage: 5, flag: '🌍' }
                      ].map((country, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-sm font-medium text-gray-900">{country.country}</span>
                          </div>
                          <span className="text-sm text-gray-600">{country.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* الفئات العمرية */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">الفئات العمرية</h3>
                    <div className="space-y-3">
                      {[
                        { age: '18-24', percentage: 28, color: 'bg-blue-500' },
                        { age: '25-34', percentage: 35, color: 'bg-green-500' },
                        { age: '35-44', percentage: 22, color: 'bg-yellow-500' },
                        { age: '45-54', percentage: 12, color: 'bg-purple-500' },
                        { age: '55+', percentage: 3, color: 'bg-gray-500' }
                      ].map((age, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">{age.age}</span>
                            <span className="text-sm text-gray-600">{age.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${age.color}`}
                              style={{ width: `${age.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* اهتمامات الجمهور */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">اهتمامات الجمهور</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'التكنولوجيا', 'الرياضة', 'السفر', 'الطعام', 'الموضة',
                        'التعليم', 'الصحة', 'الأعمال', 'الترفيه', 'الثقافة'
                      ].map((interest, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
