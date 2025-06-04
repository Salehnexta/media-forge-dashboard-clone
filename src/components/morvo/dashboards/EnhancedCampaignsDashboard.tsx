
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '../shared/DashboardLayout';
import { MetricsGrid } from '../shared/MetricsGrid';
import { EnhancedCampaignCharts } from '../charts/EnhancedCampaignCharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, PlayCircle, PauseCircle, Settings, Plus, 
  DollarSign, TrendingUp, Users, BarChart3, AlertTriangle 
} from 'lucide-react';

export const EnhancedCampaignsDashboard = () => {
  const metrics = [
    { title: 'الحملات النشطة', value: '12', change: '+3', trend: 'up' as const, icon: PlayCircle, color: 'from-green-500 to-green-600' },
    { title: 'العائد على الاستثمار', value: '4.2x', change: '+15%', trend: 'up' as const, icon: DollarSign, color: 'from-blue-500 to-blue-600' },
    { title: 'معدل التحويل', value: '3.8%', change: '+8%', trend: 'up' as const, icon: Target, color: 'from-purple-500 to-purple-600' },
    { title: 'التكلفة لكل تحويل', value: '45 ريال', change: '-12%', trend: 'up' as const, icon: TrendingUp, color: 'from-orange-500 to-orange-600' }
  ];

  const campaignTemplates = [
    { name: 'إطلاق منتج جديد', description: 'حملة متكاملة لإطلاق منتج', channels: ['Social', 'Email', 'Ads'], estimatedROI: '3.5x' },
    { name: 'عرض موسمي', description: 'حملة ترويجية موسمية', channels: ['Social', 'Display', 'Email'], estimatedROI: '4.2x' },
    { name: 'زيادة الوعي بالعلامة', description: 'حملة لزيادة الوعي', channels: ['Social', 'Content', 'PR'], estimatedROI: '2.8x' },
    { name: 'إعادة استهداف', description: 'استهداف العملاء السابقين', channels: ['Ads', 'Email', 'Social'], estimatedROI: '5.1x' }
  ];

  const activeCampaigns = [
    { 
      name: 'حملة الربيع 2024', 
      status: 'نشطة', 
      budget: '50,000 ريال', 
      spent: '32,000 ريال', 
      performance: 85,
      channels: ['Facebook', 'Google', 'Instagram']
    },
    { 
      name: 'إعلانات وسائل التواصل', 
      status: 'نشطة', 
      budget: '25,000 ريال', 
      spent: '18,500 ريال', 
      performance: 92,
      channels: ['Twitter', 'LinkedIn', 'TikTok']
    },
    { 
      name: 'حملة جوجل ادز', 
      status: 'مكتملة', 
      budget: '35,000 ريال', 
      spent: '35,000 ريال', 
      performance: 95,
      channels: ['Google Ads', 'YouTube']
    }
  ];

  const abTests = [
    { 
      name: 'اختبار العنوان الرئيسي', 
      variants: 3, 
      confidence: 85, 
      winner: 'النسخة ب', 
      improvement: '+23%',
      status: 'جاري'
    },
    { 
      name: 'اختبار الصورة الإعلانية', 
      variants: 2, 
      confidence: 95, 
      winner: 'النسخة أ', 
      improvement: '+18%',
      status: 'مكتمل'
    },
    { 
      name: 'اختبار الجمهور المستهدف', 
      variants: 4, 
      confidence: 67, 
      winner: 'غير محدد', 
      improvement: '+5%',
      status: 'جاري'
    }
  ];

  const budgetAlerts = [
    { type: 'تحذير', message: 'حملة الربيع تقترب من حد الميزانية (85%)', urgency: 'medium' },
    { type: 'نجاح', message: 'حملة جوجل تحقق أداءً ممتازاً - فكر في زيادة الميزانية', urgency: 'low' },
    { type: 'عاجل', message: 'تكلفة الاكتساب تجاوزت الحد المسموح في إعلانات فيسبوك', urgency: 'high' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشطة': return 'bg-green-500';
      case 'مكتملة': return 'bg-blue-500';
      case 'متوقفة': return 'bg-red-500';
      case 'مسودة': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-orange-500 bg-orange-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Settings className="w-4 h-4 mr-2" />
        إعدادات
      </Button>
      <Button size="sm">
        <Plus className="w-4 h-4 mr-2" />
        حملة جديدة
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="مدير الحملات المتقدم"
      description="بناء وإدارة حملات متعددة القنوات مع اختبارات A/B آلية"
      icon={Target}
      headerActions={headerActions}
    >
      <MetricsGrid metrics={metrics} />

      {/* Campaign Templates */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            قوالب الحملات المُعدَّة مسبقًا
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {campaignTemplates.map((template, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer group">
                <h4 className="font-medium mb-2 group-hover:text-blue-600 transition-colors">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {template.channels.map((channel) => (
                      <Badge key={channel} variant="secondary" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">العائد المتوقع:</span>
                    <span className="font-medium text-green-600">{template.estimatedROI}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-green-600" />
              الحملات النشطة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCampaigns.map((campaign, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{campaign.name}</h4>
                  <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>الميزانية: {campaign.budget}</span>
                    <span>المصروف: {campaign.spent}</span>
                  </div>
                  <Progress value={campaign.performance} className="h-2" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {campaign.channels.map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* A/B Testing Results */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              نتائج اختبارات A/B/n
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {abTests.map((test, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{test.name}</h4>
                  <Badge className={test.status === 'مكتمل' ? 'bg-green-500' : 'bg-blue-500'}>
                    {test.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>متغيرات: {test.variants}</span>
                    <span>الثقة: {test.confidence}%</span>
                  </div>
                  <Progress value={test.confidence} className="h-1" />
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">الفائز: {test.winner}</span>
                    <span className="text-green-600 font-medium">{test.improvement}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Budget Alerts */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            تنبيهات الميزانية والأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {budgetAlerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${getUrgencyColor(alert.urgency)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2">{alert.type}</Badge>
                    <p className="text-gray-800">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Campaign Charts */}
      <EnhancedCampaignCharts />
    </DashboardLayout>
  );
};
