
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  PlayCircle, 
  PauseCircle, 
  BarChart3, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users, 
  Clock,
  Plus,
  Settings,
  Eye,
  AlertTriangle,
  Zap,
  Share2,
  Mail,
  FileText,
  Megaphone,
  LineChart,
  PieChart,
  Filter,
  Download,
  Bell
} from 'lucide-react';

export const EnhancedCampaignsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  // بيانات الحملات متعددة القنوات
  const multiChannelCampaigns = [
    {
      id: '1',
      name: 'حملة إطلاق المنتج الجديد',
      status: 'نشطة',
      template: 'إطلاق منتج',
      channels: ['Instagram', 'Facebook', 'Email', 'Google Ads'],
      budget: 75000,
      spent: 45000,
      performance: {
        reach: 125000,
        engagement: 8.5,
        ctr: 3.2,
        conversions: 156,
        roas: 4.2
      },
      abTests: {
        active: 3,
        completed: 2,
        winners: ['Ad Copy A', 'Image B']
      },
      timeline: '30 يوم',
      progress: 60
    },
    {
      id: '2',
      name: 'العرض الموسمي - رمضان',
      status: 'مجدولة',
      template: 'عرض موسمي',
      channels: ['WhatsApp', 'Twitter', 'Blog', 'Display Ads'],
      budget: 50000,
      spent: 0,
      performance: {
        reach: 0,
        engagement: 0,
        ctr: 0,
        conversions: 0,
        roas: 0
      },
      abTests: {
        active: 0,
        completed: 0,
        winners: []
      },
      timeline: '45 يوم',
      progress: 0
    }
  ];

  // قوالب الحملات المُعدة مسبقاً
  const campaignTemplates = [
    {
      name: 'إطلاق منتج',
      description: 'حملة شاملة لإطلاق منتج جديد',
      channels: ['Social Media', 'Email', 'Paid Ads', 'Content Marketing'],
      duration: '4-6 أسابيع',
      estimatedBudget: '50,000 - 100,000 ريال'
    },
    {
      name: 'عرض موسمي',
      description: 'حملة للعروض والمناسبات الخاصة',
      channels: ['Social Media', 'Email', 'Display Ads'],
      duration: '2-4 أسابيع',
      estimatedBudget: '30,000 - 60,000 ريال'
    },
    {
      name: 'زيادة الوعي بالعلامة التجارية',
      description: 'حملة لبناء الوعي والحضور الرقمي',
      channels: ['Social Media', 'Content Marketing', 'Influencer Marketing'],
      duration: '8-12 أسبوع',
      estimatedBudget: '40,000 - 80,000 ريال'
    }
  ];

  // اختبارات A/B النشطة
  const activeABTests = [
    {
      id: '1',
      campaign: 'حملة إطلاق المنتج',
      testType: 'عنوان الإعلان',
      variants: ['العنوان A', 'العنوان B', 'العنوان C'],
      metrics: {
        impressions: [15000, 14500, 15200],
        ctr: [3.2, 2.8, 3.5],
        conversions: [45, 38, 52]
      },
      confidence: 85,
      winner: 'العنوان C',
      status: 'مكتمل',
      budget_allocation: [35, 25, 40]
    },
    {
      id: '2',
      campaign: 'حملة إطلاق المنتج',
      testType: 'صورة الإعلان',
      variants: ['الصورة A', 'الصورة B'],
      metrics: {
        impressions: [22000, 21500],
        ctr: [2.9, 3.4],
        conversions: [63, 78]
      },
      confidence: 92,
      winner: 'الصورة B',
      status: 'مكتمل',
      budget_allocation: [30, 70]
    },
    {
      id: '3',
      campaign: 'حملة إطلاق المنتج',
      testType: 'الجمهور المستهدف',
      variants: ['الجمهور A', 'الجمهور B', 'الجمهور C'],
      metrics: {
        impressions: [18000, 16500, 19200],
        ctr: [2.7, 3.1, 2.4],
        conversions: [42, 56, 38]
      },
      confidence: 67,
      winner: 'جاري التحليل',
      status: 'نشط',
      budget_allocation: [33, 40, 27]
    }
  ];

  // تحليل المسار الكامل
  const funnelAnalysis = {
    touchpoints: [
      { stage: 'الوعي', users: 125000, conversion: 100, source: 'Social Media + Display' },
      { stage: 'الاهتمام', users: 45000, conversion: 36, source: 'Website + Content' },
      { stage: 'الاعتبار', users: 18000, conversion: 14.4, source: 'Email + Retargeting' },
      { stage: 'القصد', users: 6800, conversion: 5.4, source: 'Product Pages + Demos' },
      { stage: 'الشراء', users: 2850, conversion: 2.3, source: 'Checkout + Payment' }
    ],
    attributionModels: {
      lastClick: { revenue: 285000, attribution: 'آخر نقرة' },
      firstClick: { revenue: 312000, attribution: 'أول نقرة' },
      linear: { revenue: 298500, attribution: 'خطي' },
      timeDecay: { revenue: 291200, attribution: 'تناقص الوقت' },
      positionBased: { revenue: 305800, attribution: 'موضع النقرة' }
    }
  };

  // إدارة الميزانيات
  const budgetManagement = {
    totalBudget: 200000,
    allocated: 145000,
    spent: 98500,
    remaining: 101500,
    campaigns: [
      { name: 'إطلاق المنتج', budget: 75000, spent: 45000, performance: 'ممتاز', recommendation: 'زيادة الميزانية' },
      { name: 'العرض الموسمي', budget: 50000, spent: 32000, performance: 'جيد', recommendation: 'استمرار' },
      { name: 'الوعي بالعلامة', budget: 20000, spent: 21500, performance: 'ضعيف', recommendation: 'تقليل الميزانية' }
    ],
    alerts: [
      { type: 'تحذير', message: 'حملة الوعي بالعلامة تجاوزت الميزانية بـ 7.5%', severity: 'high' },
      { type: 'اقتراح', message: 'حملة إطلاق المنتج تحقق ROAS عالي - يُنصح بزيادة الميزانية', severity: 'low' },
      { type: 'تنبيه', message: 'تكلفة الاكتساب ارتفعت بـ 15% في آخر أسبوع', severity: 'medium' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشطة': return 'bg-green-500';
      case 'مجدولة': return 'bg-blue-500';
      case 'متوقفة': return 'bg-red-500';
      case 'مكتملة': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-orange-500 bg-orange-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الحملات المتقدمة</h1>
          <p className="text-gray-600">بناء وإدارة حملات متعددة القنوات مع ذكاء اصطناعي</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            حملة جديدة
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            تصدير التقارير
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="campaigns">الحملات النشطة</TabsTrigger>
          <TabsTrigger value="ab-testing">اختبارات A/B</TabsTrigger>
          <TabsTrigger value="funnel">تحليل المسار</TabsTrigger>
          <TabsTrigger value="budget">إدارة الميزانية</TabsTrigger>
        </TabsList>

        {/* نظرة عامة */}
        <TabsContent value="overview" className="space-y-6">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">الحملات النشطة</p>
                    <p className="text-3xl font-bold text-gray-900">8</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي الوصول</p>
                    <p className="text-3xl font-bold text-gray-900">2.5M</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">معدل العائد</p>
                    <p className="text-3xl font-bold text-gray-900">4.2x</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">اختبارات A/B النشطة</p>
                    <p className="text-3xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* قوالب الحملات */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                قوالب الحملات المُعدة مسبقاً
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {campaignTemplates.map((template, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-gray-900 mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">المدة:</span>
                        <span className="font-medium">{template.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">الميزانية المتوقعة:</span>
                        <span className="font-medium">{template.estimatedBudget}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {template.channels.map((channel, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      استخدام القالب
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الحملات النشطة */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="space-y-4">
            {multiChannelCampaigns.map((campaign) => (
              <Card key={campaign.id} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">{campaign.name}</h3>
                      <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                        {campaign.status}
                      </Badge>
                      <Badge variant="outline">{campaign.template}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* القنوات */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">القنوات المفعلة</h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.channels.map((channel, idx) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-800">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* الأداء والميزانية */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">الميزانية والإنفاق</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>الميزانية الإجمالية:</span>
                          <span className="font-medium">{campaign.budget.toLocaleString()} ريال</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>المصروف:</span>
                          <span className="font-medium">{campaign.spent.toLocaleString()} ريال</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                        <div className="text-center text-xs text-gray-600">
                          {campaign.progress}% مكتمل
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">مؤشرات الأداء</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-lg">{campaign.performance.reach.toLocaleString()}</div>
                          <div className="text-gray-600">الوصول</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">{campaign.performance.engagement}%</div>
                          <div className="text-gray-600">التفاعل</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">{campaign.performance.ctr}%</div>
                          <div className="text-gray-600">CTR</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg">{campaign.performance.roas}x</div>
                          <div className="text-gray-600">ROAS</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* اختبارات A/B */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">اختبارات A/B</h4>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>نشطة: {campaign.abTests.active}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>مكتملة: {campaign.abTests.completed}</span>
                      </div>
                      {campaign.abTests.winners.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gold-500 rounded-full"></div>
                          <span>الفائزة: {campaign.abTests.winners.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* اختبارات A/B */}
        <TabsContent value="ab-testing" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                اختبارات A/B/n النشطة والمكتملة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeABTests.map((test) => (
                  <div key={test.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{test.testType}</h4>
                        <p className="text-sm text-gray-600">{test.campaign}</p>
                      </div>
                      <Badge className={test.status === 'مكتمل' ? 'bg-green-500' : 'bg-blue-500'}>
                        {test.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {test.variants.map((variant, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-semibold text-sm mb-2">{variant}</h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>المشاهدات:</span>
                              <span>{test.metrics.impressions[idx].toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>CTR:</span>
                              <span>{test.metrics.ctr[idx]}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>التحويلات:</span>
                              <span>{test.metrics.conversions[idx]}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>نسبة الميزانية:</span>
                              <span>{test.budget_allocation[idx]}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-gray-600">مستوى الثقة: </span>
                        <span className="font-bold">{test.confidence}%</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">الفائز: </span>
                        <span className="font-bold text-green-600">{test.winner}</span>
                      </div>
                    </div>

                    {test.status === 'مكتمل' && (
                      <Button className="w-full mt-3 bg-gradient-to-r from-green-600 to-green-700 text-white">
                        تطبيق النتائج على الحملة
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تحليل المسار */}
        <TabsContent value="funnel" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* قمع التحويل */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-600" />
                  رحلة العميل الكاملة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelAnalysis.touchpoints.map((stage, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{stage.stage}</h4>
                          <p className="text-xs text-gray-600">{stage.source}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{stage.users.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">{stage.conversion}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                          style={{ width: `${stage.conversion}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* نماذج النسب */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-600" />
                  نماذج نسب المشاركة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(funnelAnalysis.attributionModels).map(([model, data]) => (
                    <div key={model} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{data.attribution}</h4>
                        <p className="text-sm text-gray-600">نموذج {model}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{data.revenue.toLocaleString()} ريال</div>
                        <div className="text-xs text-gray-600">الإيراد المنسوب</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* تكامل Google Analytics */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                تكامل Google Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">1.2M</div>
                  <div className="text-sm text-gray-600">جلسات الموقع</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">4:32</div>
                  <div className="text-sm text-gray-600">متوسط مدة الجلسة</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">68%</div>
                  <div className="text-sm text-gray-600">معدل الارتداد</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* إدارة الميزانية */}
        <TabsContent value="budget" className="space-y-6">
          {/* نظرة عامة على الميزانية */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">الميزانية الإجمالية</p>
                  <p className="text-3xl font-bold text-gray-900">{budgetManagement.totalBudget.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">ريال سعودي</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">المُخصص</p>
                  <p className="text-3xl font-bold text-blue-600">{budgetManagement.allocated.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">ريال سعودي</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">المصروف</p>
                  <p className="text-3xl font-bold text-orange-600">{budgetManagement.spent.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">ريال سعودي</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">المتبقي</p>
                  <p className="text-3xl font-bold text-green-600">{budgetManagement.remaining.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">ريال سعودي</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* توزيع الميزانية على الحملات */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                توزيع الميزانية والأداء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetManagement.campaigns.map((campaign, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold">{campaign.name}</h4>
                        <p className="text-sm text-gray-600">
                          {campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()} ريال
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          campaign.performance === 'ممتاز' ? 'bg-green-500' :
                          campaign.performance === 'جيد' ? 'bg-blue-500' : 'bg-red-500'
                        }>
                          {campaign.performance}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">{campaign.recommendation}</p>
                      </div>
                    </div>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* تنبيهات الميزانية */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-600" />
                تنبيهات الميزانية والأداء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {budgetManagement.alerts.map((alert, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2">{alert.type}</Badge>
                        <p className="text-gray-800">{alert.message}</p>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
