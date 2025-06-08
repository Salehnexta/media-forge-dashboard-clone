
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, FileText, Image, Video, Share2, BarChart3, Clock, CheckCircle, Plus, Send, CalendarDays, BookOpen, LayoutGrid, Eye, Edit3, Trash2, Camera, Upload } from 'lucide-react';

interface ContentPost {
  id: string;
  title: string;
  content: string;
  platform: string;
  type: 'post' | 'story' | 'video' | 'image';
  scheduled_date?: string;
  scheduled_time?: string;
  status: 'draft' | 'scheduled' | 'published';
  engagement_predicted?: number;
}

export const ContentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedView, setSelectedView] = useState('week');
  const [newPost, setNewPost] = useState<Partial<ContentPost>>({
    title: '',
    content: '',
    platform: '',
    type: 'post'
  });
  const [posts, setPosts] = useState<ContentPost[]>([
    {
      id: '1',
      title: 'منشور عن المنتج الجديد',
      content: 'اكتشف مجموعتنا الجديدة من المنتجات المبتكرة...',
      platform: 'instagram',
      type: 'image',
      scheduled_date: '2024-01-15',
      scheduled_time: '14:00',
      status: 'scheduled',
      engagement_predicted: 85
    },
    {
      id: '2',
      title: 'فيديو تعليمي',
      content: 'شاهد كيفية استخدام منتجنا بطريقة فعالة...',
      platform: 'youtube',
      type: 'video',
      scheduled_date: '2024-01-18',
      scheduled_time: '16:00',
      status: 'scheduled',
      engagement_predicted: 92
    }
  ]);

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
    }
  ];

  const handleCreatePost = () => {
    if (newPost.title && newPost.content && newPost.platform) {
      const post: ContentPost = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        platform: newPost.platform,
        type: newPost.type || 'post',
        status: 'draft',
        engagement_predicted: Math.floor(Math.random() * 30) + 70
      };
      setPosts([...posts, post]);
      setNewPost({ title: '', content: '', platform: '', type: 'post' });
    }
  };

  const handleSchedulePost = (postId: string, date: string, time: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, scheduled_date: date, scheduled_time: time, status: 'scheduled' }
        : post
    ));
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      'instagram': 'bg-pink-100 text-pink-800 border-pink-200',
      'facebook': 'bg-blue-100 text-blue-800 border-blue-200',
      'twitter': 'bg-sky-100 text-sky-800 border-sky-200',
      'youtube': 'bg-red-100 text-red-800 border-red-200',
      'linkedin': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'image': return Image;
      case 'post': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Tab Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">إدارة المحتوى</h2>
        <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600">
          <Plus className="w-4 h-4" />
          محتوى جديد
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            التقويم
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            التحليلات
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            المكتبة
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">المنشورات المجدولة</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">المسودات</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <FileText className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">المنشور هذا الشهر</p>
                      <p className="text-2xl font-bold">45</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Calendar Preview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    المحتوى القادم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentCalendar.slice(0, 3).map((content, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-gray-200">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(content.status)}`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{content.title}</p>
                          <p className="text-xs text-gray-600">{content.platform} • {content.date}</p>
                        </div>
                        <Badge className={getPlatformColor(content.platform.toLowerCase())}>
                          {content.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Create */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-600" />
                  إنشاء سريع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="عنوان المنشور"
                  value={newPost.title || ''}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
                <Textarea 
                  placeholder="محتوى المنشور..."
                  value={newPost.content || ''}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={3}
                />
                <Select value={newPost.platform} onValueChange={(value) => setNewPost({...newPost, platform: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنصة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">إنستغرام</SelectItem>
                    <SelectItem value="facebook">فيسبوك</SelectItem>
                    <SelectItem value="twitter">تويتر</SelectItem>
                    <SelectItem value="youtube">يوتيوب</SelectItem>
                    <SelectItem value="linkedin">لينكد إن</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button onClick={handleCreatePost} className="flex-1">
                    حفظ كمسودة
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('calendar')}>
                    إلى التقويم
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <div className="space-y-6">
            {/* Calendar Toolbar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={selectedView} onValueChange={setSelectedView}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">يوم</SelectItem>
                    <SelectItem value="week">أسبوع</SelectItem>
                    <SelectItem value="month">شهر</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  اليوم
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  تصفية المنصات
                </Button>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة منشور
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
                    <div key={day} className="text-center font-medium text-gray-700 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-4 min-h-[400px]">
                  {Array.from({ length: 35 }, (_, i) => {
                    const dayPosts = posts.filter(post => {
                      const postDate = new Date(post.scheduled_date || '');
                      const cellDate = new Date(2024, 0, i + 1);
                      return postDate.toDateString() === cellDate.toDateString();
                    });

                    return (
                      <div key={i} className="border border-gray-200 rounded-lg p-2 min-h-[100px] hover:bg-gray-50">
                        <div className="text-sm text-gray-600 mb-2">{i + 1}</div>
                        <div className="space-y-1">
                          {dayPosts.map((post) => (
                            <div
                              key={post.id}
                              className={`text-xs p-2 rounded border-r-2 ${getPlatformColor(post.platform)} cursor-pointer hover:shadow-sm`}
                            >
                              <div className="font-medium truncate">{post.title}</div>
                              <div className="text-xs opacity-75">{post.scheduled_time}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>أداء المحتوى</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.filter(p => p.status === 'published').map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{post.title}</p>
                        <p className="text-xs text-gray-600">{post.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{post.engagement_predicted}%</p>
                        <p className="text-xs text-gray-600">معدل التفاعل</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المنصات الأكثر فعالية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { platform: 'Instagram', engagement: 92, color: 'bg-pink-500' },
                    { platform: 'Facebook', engagement: 78, color: 'bg-blue-500' },
                    { platform: 'Twitter', engagement: 65, color: 'bg-sky-500' },
                    { platform: 'LinkedIn', engagement: 84, color: 'bg-indigo-500' }
                  ].map((item) => (
                    <div key={item.platform} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="flex-1">{item.platform}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={item.engagement} className="w-20 h-2" />
                        <span className="text-sm font-medium">{item.engagement}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Media Library */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  مكتبة الوسائط
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 cursor-pointer">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  ))}
                  <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle>القوالب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'قالب الإعلان',
                    'قالب القصة',
                    'قالب المنتج',
                    'قالب الحدث'
                  ].map((template) => (
                    <div key={template} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium">{template}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
