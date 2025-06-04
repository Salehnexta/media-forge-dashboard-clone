
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  Star,
  Search,
  Filter,
  Eye,
  Share2,
  Crown,
  Zap
} from 'lucide-react';

interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: number;
  engagement: number;
  reach: number;
  mentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: string;
  platforms: string[];
  influenceScore: number;
  recentActivity: string;
  tier: 'mega' | 'macro' | 'micro' | 'nano';
}

export const InfluencersManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');

  const influencers: Influencer[] = [
    {
      id: '1',
      name: 'أحمد محمد',
      handle: '@ahmed_tech',
      avatar: '/placeholder.svg',
      followers: 125000,
      engagement: 4.2,
      reach: 85000,
      mentions: 45,
      sentiment: 'positive',
      category: 'تقنية',
      platforms: ['تويتر', 'لينكد إن'],
      influenceScore: 95,
      recentActivity: 'ذكر منتجكم في تغريدة قبل ساعتين',
      tier: 'macro'
    },
    {
      id: '2',
      name: 'فاطمة السعد',
      handle: '@fatima_lifestyle',
      avatar: '/placeholder.svg',
      followers: 89000,
      engagement: 6.1,
      reach: 62000,
      mentions: 32,
      sentiment: 'positive',
      category: 'أسلوب حياة',
      platforms: ['إنستغرام', 'يوتيوب'],
      influenceScore: 88,
      recentActivity: 'نشر قصة عن تجربته مع خدمتكم',
      tier: 'macro'
    },
    {
      id: '3',
      name: 'محمد العلي',
      handle: '@mohammed_business',
      avatar: '/placeholder.svg',
      followers: 67000,
      engagement: 5.3,
      reach: 45000,
      mentions: 28,
      sentiment: 'positive',
      category: 'الأعمال',
      platforms: ['لينكد إن', 'تويتر'],
      influenceScore: 82,
      recentActivity: 'كتب مقال يشيد بحلولكم التقنية',
      tier: 'micro'
    },
    {
      id: '4',
      name: 'نورا حسن',
      handle: '@nora_education',
      avatar: '/placeholder.svg',
      followers: 45000,
      engagement: 7.8,
      reach: 38000,
      mentions: 22,
      sentiment: 'positive',
      category: 'تعليم',
      platforms: ['يوتيوب', 'إنستغرام'],
      influenceScore: 79,
      recentActivity: 'أنشأ فيديو تعليمي يستخدم منتجكم',
      tier: 'micro'
    },
    {
      id: '5',
      name: 'خالد الراشد',
      handle: '@khalid_sports',
      avatar: '/placeholder.svg',
      followers: 156000,
      engagement: 3.9,
      reach: 95000,
      mentions: 38,
      sentiment: 'neutral',
      category: 'رياضة',
      platforms: ['تويتر', 'إنستغرام'],
      influenceScore: 85,
      recentActivity: 'ذكر علامتكم التجارية في بودكاست',
      tier: 'macro'
    }
  ];

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.handle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || influencer.category === selectedCategory;
    const matchesTier = selectedTier === 'all' || influencer.tier === selectedTier;
    return matchesSearch && matchesCategory && matchesTier;
  });

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'mega':
        return { label: 'ميجا', color: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white', icon: Crown };
      case 'macro':
        return { label: 'ماكرو', color: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white', icon: Star };
      case 'micro':
        return { label: 'مايكرو', color: 'bg-gradient-to-r from-green-500 to-green-600 text-white', icon: TrendingUp };
      case 'nano':
        return { label: 'نانو', color: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white', icon: Zap };
      default:
        return { label: 'غير محدد', color: 'bg-gray-500 text-white', icon: Users };
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const InfluencerCard = ({ influencer }: { influencer: Influencer }) => {
    const tierInfo = getTierInfo(influencer.tier);
    const TierIcon = tierInfo.icon;

    return (
      <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={influencer.avatar} alt={influencer.name} />
                <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-gray-900">{influencer.name}</h3>
                <p className="text-sm text-gray-600">{influencer.handle}</p>
                <p className="text-xs text-gray-500">{influencer.category}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={tierInfo.color}>
                <TierIcon className="w-3 h-3 mr-1" />
                {tierInfo.label}
              </Badge>
              <Badge className={getSentimentColor(influencer.sentiment)}>
                {influencer.sentiment === 'positive' && 'إيجابي'}
                {influencer.sentiment === 'neutral' && 'محايد'}
                {influencer.sentiment === 'negative' && 'سلبي'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">المتابعون</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {(influencer.followers / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="text-sm text-gray-600">التفاعل</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{influencer.engagement}%</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">الوصول</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {(influencer.reach / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">الإشارات</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{influencer.mentions}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">نقاط التأثير</span>
              <span className="text-sm font-bold text-blue-600">{influencer.influenceScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${influencer.influenceScore}%` }}
              ></div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-600 mb-2">المنصات:</p>
            <div className="flex gap-2 mb-3">
              {influencer.platforms.map((platform, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {platform}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              آخر نشاط: {influencer.recentActivity}
            </p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              تواصل
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              تتبع
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* إحصائيات المؤثرين */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">إجمالي المؤثرين</p>
                <p className="text-3xl font-bold text-blue-900">247</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">مؤثرين نشطين</p>
                <p className="text-3xl font-bold text-green-900">89</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">متوسط التأثير</p>
                <p className="text-3xl font-bold text-purple-900">78%</p>
              </div>
              <Star className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">إجمالي الوصول</p>
                <p className="text-3xl font-bold text-orange-900">2.4M</p>
              </div>
              <Eye className="w-12 h-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث عن المؤثرين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                <SelectItem value="تقنية">تقنية</SelectItem>
                <SelectItem value="أسلوب حياة">أسلوب حياة</SelectItem>
                <SelectItem value="الأعمال">الأعمال</SelectItem>
                <SelectItem value="تعليم">تعليم</SelectItem>
                <SelectItem value="رياضة">رياضة</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="المستوى" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                <SelectItem value="mega">ميجا (1M+)</SelectItem>
                <SelectItem value="macro">ماكرو (100K-1M)</SelectItem>
                <SelectItem value="micro">مايكرو (10K-100K)</SelectItem>
                <SelectItem value="nano">نانو (1K-10K)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المؤثرين */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInfluencers.map((influencer) => (
          <InfluencerCard key={influencer.id} influencer={influencer} />
        ))}
      </div>
    </div>
  );
};
