
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { StrategicCharts } from '../charts/StrategicCharts';
import { OnboardingRestart } from '../../dashboard/OnboardingRestart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Rocket, BarChart3, Target, Zap, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

export const MorvoDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    supabase.auth.getUser().then(({
      data: {
        user
      }
    }) => {
      setUser(user);
    });
  }, []);

  const metrics = [
    { title: 'إجمالي الحملات', value: '12', change: '+15%', icon: Rocket, color: 'bg-blue-500' },
    { title: 'معدل التحويل', value: '3.2%', change: '+8%', icon: Target, color: 'bg-green-500' },
    { title: 'العائد على الاستثمار', value: '275%', change: '+22%', icon: DollarSign, color: 'bg-purple-500' },
    { title: 'الجمهور المستهدف', value: '45K', change: '+12%', icon: Users, color: 'bg-orange-500' }
  ];

  const tasks = [
    { title: 'تحليل SWOT للشركة', progress: 75, status: 'قيد التنفيذ', priority: 'عالية' },
    { title: 'مراجعة أداء الحملات', progress: 90, status: 'شبه مكتمل', priority: 'متوسطة' },
    { title: 'تحديث استراتيجية المحتوى', progress: 45, status: 'قيد التطوير', priority: 'عالية' },
    { title: 'تحليل المنافسين', progress: 30, status: 'بدء حديث', priority: 'منخفضة' }
  ];

  const insights = [
    { title: 'أفضل وقت للنشر', content: 'بين الساعة 7-9 مساءً يحقق أعلى تفاعل' },
    { title: 'المحتوى الأكثر تفاعلاً', content: 'الفيديوهات القصيرة تحقق 3x تفاعل أكثر' },
    { title: 'الجمهور المستهدف', content: '68% من جمهورك بين 25-35 سنة' },
    { title: 'منصة النمو', content: 'Instagram يظهر نمو 45% هذا الشهر' }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">لوحة تحكم Morvo</h1>
          <p className="text-gray-600">نظرة عامة شاملة على منصة التسويق الذكي</p>
        </div>
        
        {/* المؤشرات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <p className="text-sm text-green-600 mt-1">{metric.change}</p>
                  </div>
                  <div className={`${metric.color} p-3 rounded-lg`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* الرسوم البيانية */}
          <div className="lg:col-span-2 space-y-6">
            <StrategicCharts />
          </div>
          
          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* المهام الحالية */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  المهام الحالية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                      <Badge variant={task.priority === 'عالية' ? 'destructive' : task.priority === 'متوسطة' ? 'default' : 'secondary'} className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                    <p className="text-xs text-gray-500">{task.status} - {task.progress}%</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* الإحصائيات السريعة */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">الزيارات اليوم</span>
                  <span className="font-bold text-green-600">+1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">التحويلات</span>
                  <span className="font-bold text-blue-600">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">معدل الارتداد</span>
                  <span className="font-bold text-orange-600">34%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">متوسط الجلسة</span>
                  <span className="font-bold text-purple-600">4:32</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* رؤى ذكية */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              رؤى ذكية من m1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {insights.map((insight, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-blue-700">{insight.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* إعادة تشغيل الإعداد */}
        {user && (
          <div className="mt-8">
            <OnboardingRestart />
          </div>
        )}
      </div>
    </div>
  );
};
