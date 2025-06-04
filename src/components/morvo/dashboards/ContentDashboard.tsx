
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, FileText, Image, Video, Share2, BarChart3, Clock, CheckCircle } from 'lucide-react';

export const ContentDashboard = () => {
  const contentCalendar = [
    { 
      title: 'منشور عن المنتج الجديد', 
      platform: 'إنستغرام', 
      type: 'صورة', 
      status: 'منشور', 
      date: '2024-01-15',
      engagement: '2.5K',
      scheduled: false
    },
    { 
      title: 'فيديو تعليمي', 
      platform: 'يوتيوب', 
      type: 'فيديو', 
      status: 'مجدول', 
      date: '2024-01-18',
      engagement: '-',
      scheduled: true
    },
    { 
      title: 'مقال المدونة الأسبوعي', 
      platform: 'الموقع', 
      type: 'مقال', 
      status: 'مسودة', 
      date: '2024-01-20',
      engagement: '-',
      scheduled: false
    },
    { 
      title: 'قصة انستغرام', 
      platform: 'إنستغرام', 
      type: 'قصة', 
      status: 'في المراجعة', 
      date: '2024-01-16',
      engagement: '-',
      scheduled: false
    }
  ];

  const contentPerformance = [
    { 
      title: 'أفضل 10 نصائح للتسويق', 
      type: 'مقال', 
      views: '15.2K', 
      likes: '342', 
      shares: '89', 
      platform: 'لينكد إن',
      score: 92
    },
    { 
      title: 'فيديو توضيحي للمنتج', 
      type: 'فيديو', 
      views: '8.7K', 
      likes: '245', 
      shares: '67', 
      platform: 'يوتيوب',
      score: 85
    },
    { 
      title: 'صورة منتج مع عرض خاص', 
      type: 'صورة', 
      views: '12.1K', 
      likes: '456', 
      shares: '123', 
      platform: 'إنستغرام',
      score: 88
    },
    { 
      title: 'نصائح سريعة للنجاح', 
      type: 'منشور', 
      views: '6.4K', 
      likes: '189', 
      shares: '34', 
      platform: 'تويتر',
      score: 76
    }
  ];

  const aiGeneratedIdeas = [
    { 
      title: 'اتجاهات التسويق لعام 2024', 
      type: 'مقال', 
      priority: 'عالية', 
      estimated_engagement: 'عالية',
      platforms: ['لينكد إن', 'تويتر'],
      difficulty: 'متوسطة'
    },
    { 
      title: 'فيديو "يوم في الحياة" للموظفين', 
      type: 'فيديو', 
      priority: 'متوسطة', 
      estimated_engagement: 'متوسطة',
      platforms: ['إنستغرام', 'يوتيوب'],
      difficulty: 'سهلة'
    },
    { 
      title: 'إنفوجرافيك عن الإحصائيات', 
      type: 'صورة', 
      priority: 'عالية', 
      estimated_engagement: 'عالية',
      platforms: ['إنستغرام', 'لينكد إن'],
      difficulty: 'متوسطة'
    }
  ];

  const mediaLibrary = [
    { name: 'صور المنتجات', count: 156, type: 'صور', size: '2.3 GB', lastUsed: 'منذ يومين' },
    { name: 'فيديوهات تعليمية', count: 23, type: 'فيديو', size: '8.7 GB', lastUsed: 'منذ أسبوع' },
    { name: 'شعارات العلامة التجارية', count: 45, type: 'صور', size: '125 MB', lastUsed: 'منذ 3 أيام' },
    { name: 'خلفيات وقوالب', count: 78, type: 'تصميم', size: '890 MB', lastUsed: 'منذ يوم واحد' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'منشور': return 'bg-green-500';
      case 'مجدول': return 'bg-blue-500';
      case 'مسودة': return 'bg-gray-500';
      case 'في المراجعة': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالية': return 'bg-red-500';
      case 'متوسطة': return 'bg-yellow-500';
      case 'منخفضة': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'فيديو': return Video;
      case 'صورة': case 'صور': return Image;
      case 'مقال': case 'منشور': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Content Calendar */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            تقويم المحتوى
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentCalendar.map((content, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-sm">{content.title}</h4>
                  <Badge className={`${getStatusColor(content.status)} text-white`}>
                    {content.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>المنصة:</span>
                    <span>{content.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>النوع:</span>
                    <span>{content.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>التاريخ:</span>
                    <span>{content.date}</span>
                  </div>
                  {content.engagement !== '-' && (
                    <div className="flex justify-between">
                      <span>التفاعل:</span>
                      <span className="text-green-600 font-medium">{content.engagement}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              أداء المحتوى
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentPerformance.map((content, index) => {
              const IconComponent = getTypeIcon(content.type);
              return (
                <div key={index} className="p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">{content.title}</span>
                    <Badge className="bg-blue-500 text-white text-xs">{content.platform}</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-2">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{content.views}</div>
                      <div>مشاهدات</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{content.likes}</div>
                      <div>إعجابات</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{content.shares}</div>
                      <div>مشاركات</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">{content.score}%</div>
                      <div>النتيجة</div>
                    </div>
                  </div>
                  <Progress value={content.score} className="h-1" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* AI Content Ideas */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-600" />
              أفكار محتوى ذكية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiGeneratedIdeas.map((idea, index) => {
              const IconComponent = getTypeIcon(idea.type);
              return (
                <div key={index} className="p-3 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-sm">{idea.title}</span>
                    </div>
                    <Badge className={`${getPriorityColor(idea.priority)} text-white text-xs`}>
                      {idea.priority}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>التفاعل المتوقع:</span>
                      <span>{idea.estimated_engagement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الصعوبة:</span>
                      <span>{idea.difficulty}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {idea.platforms.map((platform, platformIndex) => (
                        <Badge key={platformIndex} className="bg-gray-200 text-gray-700 text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Media Library */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-orange-600" />
            مكتبة الوسائط
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaLibrary.map((folder, index) => {
              const IconComponent = getTypeIcon(folder.type);
              return (
                <div key={index} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="w-5 h-5 text-orange-600" />
                    <span className="font-medium">{folder.name}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>العدد:</span>
                      <span>{folder.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الحجم:</span>
                      <span>{folder.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>آخر استخدام:</span>
                      <span>{folder.lastUsed}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
