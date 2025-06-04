
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Heart, Share2, TrendingUp, AlertTriangle, Users, Eye } from 'lucide-react';

export const SocialMediaDashboard = () => {
  const sentimentData = [
    { platform: 'تويتر', positive: 65, neutral: 25, negative: 10, mentions: 234 },
    { platform: 'إنستغرام', positive: 75, neutral: 20, negative: 5, mentions: 189 },
    { platform: 'لينكد إن', positive: 80, neutral: 15, negative: 5, mentions: 156 },
    { platform: 'فيسبوك', positive: 60, neutral: 30, negative: 10, mentions: 312 }
  ];

  const liveMentions = [
    { platform: 'تويتر', content: 'منتج رائع جداً، أنصح به بشدة!', sentiment: 'positive', reach: '5.2K', time: 'منذ 5 دقائق' },
    { platform: 'إنستغرام', content: 'تجربة مميزة مع خدمة العملاء', sentiment: 'positive', reach: '2.8K', time: 'منذ 12 دقيقة' },
    { platform: 'لينكد إن', content: 'نحتاج لتحسين سرعة التسليم', sentiment: 'neutral', reach: '1.5K', time: 'منذ 18 دقيقة' },
    { platform: 'فيسبوك', content: 'قيمة ممتازة مقابل السعر', sentiment: 'positive', reach: '3.1K', time: 'منذ 25 دقيقة' }
  ];

  const influencers = [
    { name: 'أحمد محمد', followers: '125K', engagement: '4.2%', niche: 'تقنية', score: 85 },
    { name: 'فاطمة السعد', followers: '89K', engagement: '6.1%', niche: 'أسلوب حياة', score: 78 },
    { name: 'محمد العلي', followers: '67K', engagement: '5.3%', niche: 'الأعمال', score: 72 },
    { name: 'نورا حسن', followers: '45K', engagement: '7.8%', niche: 'تعليم', score: 81 }
  ];

  const crisisAlerts = [
    { type: 'تحذير', message: 'زيادة في التعليقات السلبية بنسبة 15%', severity: 'medium', time: 'منذ ساعة' },
    { type: 'معلومات', message: 'ذروة في المشاركات الإيجابية', severity: 'low', time: 'منذ 3 ساعات' },
    { type: 'عاجل', message: 'انتشار واسع لمنشور العلامة التجارية', severity: 'high', time: 'منذ 30 دقيقة' }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Live Mentions Feed */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            تدفق الإشارات المباشر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liveMentions.map((mention, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <Badge className="bg-blue-500 text-white">{mention.platform}</Badge>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 mb-2">{mention.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <Badge className={getSentimentColor(mention.sentiment)}>
                      {mention.sentiment === 'positive' ? 'إيجابي' : mention.sentiment === 'negative' ? 'سلبي' : 'محايد'}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {mention.reach}
                    </span>
                    <span>{mention.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Analysis */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              تحليل المشاعر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sentimentData.map((platform, index) => (
              <div key={index} className="space-y-3 p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{platform.platform}</span>
                  <span className="text-sm text-gray-600">{platform.mentions} إشارة</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">إيجابي ({platform.positive}%)</span>
                    <span className="text-yellow-600">محايد ({platform.neutral}%)</span>
                    <span className="text-red-600">سلبي ({platform.negative}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                    <div className="bg-green-500" style={{ width: `${platform.positive}%` }}></div>
                    <div className="bg-yellow-500" style={{ width: `${platform.neutral}%` }}></div>
                    <div className="bg-red-500" style={{ width: `${platform.negative}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Influencer Identification */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              المؤثرون الرئيسيون
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {influencers.map((influencer, index) => (
              <div key={index} className="space-y-3 p-3 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{influencer.name}</h4>
                    <p className="text-sm text-gray-600">{influencer.niche}</p>
                  </div>
                  <Badge className="bg-purple-500 text-white">
                    {influencer.score}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{influencer.followers} متابع</span>
                  <span>تفاعل {influencer.engagement}</span>
                </div>
                <Progress value={influencer.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Crisis Alerts */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            التنبيهات الذكية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {crisisAlerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
                <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="mb-2">{alert.type}</Badge>
                      <p className="text-gray-800">{alert.message}</p>
                    </div>
                    <span className="text-sm text-gray-500">{alert.time}</span>
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
