
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, PauseCircle, BarChart3, DollarSign, Target, TrendingUp, Users, Clock } from 'lucide-react';

export const CampaignsDashboard = () => {
  const activeCampaigns = [
    { 
      name: 'حملة الربيع 2024', 
      status: 'نشطة', 
      budget: '50,000 ريال', 
      spent: '32,000 ريال', 
      ctr: '3.2%', 
      roas: '4.5x',
      progress: 64
    },
    { 
      name: 'إعلانات وسائل التواصل', 
      status: 'نشطة', 
      budget: '25,000 ريال', 
      spent: '18,500 ريال', 
      ctr: '2.8%', 
      roas: '3.2x',
      progress: 74
    },
    { 
      name: 'حملة جوجل ادز', 
      status: 'متوقفة', 
      budget: '35,000 ريال', 
      spent: '35,000 ريال', 
      ctr: '4.1%', 
      roas: '5.1x',
      progress: 100
    },
    { 
      name: 'إعادة الاستهداف', 
      status: 'مسودة', 
      budget: '15,000 ريال', 
      spent: '0 ريال', 
      ctr: '-', 
      roas: '-',
      progress: 0
    }
  ];

  const channelPerformance = [
    { channel: 'فيسبوك', impressions: '125K', clicks: '3.2K', conversions: 45, cost: '8,500 ريال' },
    { channel: 'جوجل', impressions: '89K', clicks: '4.1K', conversions: 67, cost: '12,300 ريال' },
    { channel: 'إنستغرام', impressions: '67K', clicks: '2.1K', conversions: 23, cost: '5,200 ريال' },
    { channel: 'لينكد إن', impressions: '34K', clicks: '1.5K', conversions: 18, cost: '6,800 ريال' }
  ];

  const abTests = [
    { 
      name: 'اختبار العنوان الرئيسي', 
      status: 'جاري', 
      confidence: 85, 
      winner: 'النسخة ب', 
      lift: '+23%',
      remaining: '3 أيام'
    },
    { 
      name: 'اختبار الصورة', 
      status: 'مكتمل', 
      confidence: 95, 
      winner: 'النسخة أ', 
      lift: '+18%',
      remaining: 'مكتمل'
    },
    { 
      name: 'اختبار الجمهور', 
      status: 'جاري', 
      confidence: 67, 
      winner: 'غير محدد', 
      lift: '+5%',
      remaining: '7 أيام'
    }
  ];

  const budgetAlerts = [
    { type: 'تحذير', message: 'حملة الربيع تقترب من حد الميزانية', urgency: 'high' },
    { type: 'معلومات', message: 'أداء ممتاز لحملة جوجل ادز - فكر في زيادة الميزانية', urgency: 'low' },
    { type: 'عاجل', message: 'تكلفة الاكتساب تجاوزت الحد المسموح', urgency: 'critical' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشطة': return 'bg-green-500';
      case 'متوقفة': return 'bg-red-500';
      case 'مسودة': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Active Campaigns Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-green-600" />
            الحملات النشطة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Progress value={campaign.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">CTR: </span>
                    <span className="font-medium">{campaign.ctr}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ROAS: </span>
                    <span className="font-medium">{campaign.roas}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              أداء القنوات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {channelPerformance.map((channel, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{channel.channel}</span>
                  <span className="text-sm text-gray-600">{channel.cost}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{channel.impressions}</div>
                    <div>مشاهدات</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{channel.clicks}</div>
                    <div>نقرات</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{channel.conversions}</div>
                    <div>تحويلات</div>
                  </div>
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
              نتائج الاختبارات
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
                    <span>الثقة: {test.confidence}%</span>
                    <span>المتبقي: {test.remaining}</span>
                  </div>
                  <Progress value={test.confidence} className="h-1" />
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">الفائز: {test.winner}</span>
                    <span className="text-green-600 font-medium">{test.lift}</span>
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
            <DollarSign className="w-5 h-5 text-orange-600" />
            تنبيهات الميزانية
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
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
