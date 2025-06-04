import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Eye, 
  MessageSquare,
  Heart,
  Share2,
  Filter,
  Star,
  MoreHorizontal
} from 'lucide-react';

interface TopicData {
  id: string;
  name: string;
  mentions: number;
  growth: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  reach: number;
  engagement: number;
  platforms: string[];
  isStarred: boolean;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: string;
}

export const TopicsMonitor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [topicsData, setTopicsData] = useState<TopicData[]>([]);

  useEffect(() => {
    const mockTopics: TopicData[] = [
      {
        id: '1',
        name: 'العلامة التجارية الرئيسية',
        mentions: 1250,
        growth: 45,
        sentiment: { positive: 65, neutral: 25, negative: 10 },
        reach: 85000,
        engagement: 12.5,
        platforms: ['تويتر', 'إنستغرام', 'لينكد إن'],
        isStarred: true,
        alertLevel: 'high',
        lastActivity: 'منذ 2 دقيقة'
      },
      {
        id: '2',
        name: 'المنتج الجديد',
        mentions: 890,
        growth: 78,
        sentiment: { positive: 80, neutral: 15, negative: 5 },
        reach: 52000,
        engagement: 15.8,
        platforms: ['إنستغرام', 'فيسبوك'],
        isStarred: true,
        alertLevel: 'critical',
        lastActivity: 'منذ 1 دقيقة'
      },
      {
        id: '3',
        name: 'حملة الصيف',
        mentions: 567,
        growth: -12,
        sentiment: { positive: 70, neutral: 20, negative: 10 },
        reach: 38000,
        engagement: 9.2,
        platforms: ['تويتر', 'فيسبوك'],
        isStarred: true,
        alertLevel: 'medium',
        lastActivity: 'منذ 5 دقائق'
      },
      {
        id: '4',
        name: 'خدمة العملاء',
        mentions: 445,
        growth: 23,
        sentiment: { positive: 45, neutral: 35, negative: 20 },
        reach: 25000,
        engagement: 8.7,
        platforms: ['تويتر', 'لينكد إن'],
        isStarred: true,
        alertLevel: 'medium',
        lastActivity: 'منذ 8 دقائق'
      },
      {
        id: '5',
        name: 'المنافس الرئيسي',
        mentions: 334,
        growth: 15,
        sentiment: { positive: 55, neutral: 30, negative: 15 },
        reach: 42000,
        engagement: 7.3,
        platforms: ['تويتر', 'إنستغرام'],
        isStarred: true,
        alertLevel: 'low',
        lastActivity: 'منذ 12 دقيقة'
      },
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 6}`,
        name: `موضوع ${i + 6}`,
        mentions: Math.floor(Math.random() * 300) + 50,
        growth: Math.floor(Math.random() * 100) - 30,
        sentiment: {
          positive: Math.floor(Math.random() * 40) + 40,
          neutral: Math.floor(Math.random() * 30) + 20,
          negative: Math.floor(Math.random() * 20) + 5
        },
        reach: Math.floor(Math.random() * 30000) + 10000,
        engagement: Math.floor(Math.random() * 10) + 3,
        platforms: ['تويتر', 'فيسبوك'].slice(0, Math.floor(Math.random() * 2) + 1),
        isStarred: false,
        alertLevel: ['low', 'medium'][Math.floor(Math.random() * 2)] as 'low' | 'medium',
        lastActivity: `منذ ${Math.floor(Math.random() * 60) + 1} دقيقة`
      }))
    ];
    setTopicsData(mockTopics);
  }, []);

  const topTopics = topicsData.filter(topic => topic.isStarred).slice(0, 5);
  const otherTopics = topicsData.filter(topic => !topic.isStarred);

  const filteredOtherTopics = otherTopics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || topic.platforms.includes(selectedPlatform);
    return matchesSearch && matchesPlatform;
  });

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'high': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      default: return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    }
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const TopicCard = ({ topic, isMain = false }: { topic: TopicData; isMain?: boolean }) => (
    <Card className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white ${
      isMain ? 'border-l-4 border-l-blue-600' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {topic.isStarred && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
            {topic.name}
          </CardTitle>
          <Badge className={getAlertColor(topic.alertLevel)}>
            {topic.alertLevel === 'critical' && 'حرج'}
            {topic.alertLevel === 'high' && 'عالي'}
            {topic.alertLevel === 'medium' && 'متوسط'}
            {topic.alertLevel === 'low' && 'منخفض'}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{topic.lastActivity}</span>
          <span>•</span>
          <span>{topic.platforms.join(' • ')}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">الإشارات</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {topic.mentions.toLocaleString()}
              </span>
              {getGrowthIcon(topic.growth)}
              <span className={`text-sm font-medium ${
                topic.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(topic.growth)}%
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600">الوصول</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {(topic.reach / 1000).toFixed(1)}K
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-600">إيجابي ({topic.sentiment.positive}%)</span>
            <span className="text-yellow-600">محايد ({topic.sentiment.neutral}%)</span>
            <span className="text-red-600">سلبي ({topic.sentiment.negative}%)</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
            <div 
              className="bg-green-500" 
              style={{ width: `${topic.sentiment.positive}%` }}
            ></div>
            <div 
              className="bg-yellow-500" 
              style={{ width: `${topic.sentiment.neutral}%` }}
            ></div>
            <div 
              className="bg-red-500" 
              style={{ width: `${topic.sentiment.negative}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-600" />
            <span className="text-sm text-gray-600">
              معدل التفاعل: {topic.engagement}%
            </span>
          </div>
          {topic.alertLevel === 'critical' && (
            <div className="flex items-center gap-1 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium">نشاط مرتفع</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500 fill-current" />
          <h2 className="text-2xl font-bold text-gray-900">أهم الموضوعات المراقبة</h2>
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            مباشر
          </Badge>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {topTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} isMain={true} />
          ))}
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
              باقي الموضوعات المراقبة ({otherTopics.length})
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="البحث في الموضوعات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="المنصة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المنصات</SelectItem>
                  <SelectItem value="تويتر">تويتر</SelectItem>
                  <SelectItem value="إنستغرام">إنستغرام</SelectItem>
                  <SelectItem value="فيسبوك">فيسبوك</SelectItem>
                  <SelectItem value="لينكد إن">لينكد إن</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="grid">عرض الشبكة</TabsTrigger>
              <TabsTrigger value="table">عرض الجدول</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOtherTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="table">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-right py-3 px-4 text-gray-900 font-medium">الموضوع</th>
                      <th className="text-center py-3 px-4 text-gray-900 font-medium">الإشارات</th>
                      <th className="text-center py-3 px-4 text-gray-900 font-medium">النمو</th>
                      <th className="text-center py-3 px-4 text-gray-900 font-medium">المشاعر</th>
                      <th className="text-center py-3 px-4 text-gray-900 font-medium">الوصول</th>
                      <th className="text-center py-3 px-4 text-gray-900 font-medium">التنبيه</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOtherTopics.map((topic) => (
                      <tr key={topic.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{topic.name}</div>
                            <div className="text-sm text-gray-600">{topic.platforms.join(' • ')}</div>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="font-bold text-gray-900">
                            {topic.mentions.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            {getGrowthIcon(topic.growth)}
                            <span className={`font-medium ${
                              topic.growth >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {Math.abs(topic.growth)}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto flex">
                            <div 
                              className="bg-green-500" 
                              style={{ width: `${topic.sentiment.positive}%` }}
                            ></div>
                            <div 
                              className="bg-yellow-500" 
                              style={{ width: `${topic.sentiment.neutral}%` }}
                            ></div>
                            <div 
                              className="bg-red-500" 
                              style={{ width: `${topic.sentiment.negative}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="text-gray-600">
                            {(topic.reach / 1000).toFixed(1)}K
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge className={getAlertColor(topic.alertLevel)}>
                            {topic.alertLevel === 'critical' && 'حرج'}
                            {topic.alertLevel === 'high' && 'عالي'}
                            {topic.alertLevel === 'medium' && 'متوسط'}
                            {topic.alertLevel === 'low' && 'منخفض'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
