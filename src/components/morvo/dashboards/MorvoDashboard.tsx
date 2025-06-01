
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
import { Rocket, BarChart3, Target, Zap, TrendingUp, Users, DollarSign, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const MorvoDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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
    { title: 'إجمالي الحملات', value: '12', change: '+15%', icon: Rocket, color: 'from-blue-500 to-blue-600', trend: 'up' },
    { title: 'معدل التحويل', value: '3.2%', change: '+8%', icon: Target, color: 'from-green-500 to-green-600', trend: 'up' },
    { title: 'العائد على الاستثمار', value: '275%', change: '+22%', icon: DollarSign, color: 'from-purple-500 to-purple-600', trend: 'up' },
    { title: 'الجمهور المستهدف', value: '45K', change: '+12%', icon: Users, color: 'from-orange-500 to-orange-600', trend: 'up' }
  ];

  const tasks = [
    { title: 'تحليل SWOT للشركة', progress: 75, status: 'قيد التنفيذ', priority: 'عالية', color: 'bg-red-500' },
    { title: 'مراجعة أداء الحملات', progress: 90, status: 'شبه مكتمل', priority: 'متوسطة', color: 'bg-yellow-500' },
    { title: 'تحديث استراتيجية المحتوى', progress: 45, status: 'قيد التطوير', priority: 'عالية', color: 'bg-red-500' },
    { title: 'تحليل المنافسين', progress: 30, status: 'بدء حديث', priority: 'منخفضة', color: 'bg-gray-500' }
  ];

  const insights = [
    { title: 'أفضل وقت للنشر', content: 'بين الساعة 7-9 مساءً يحقق أعلى تفاعل', icon: '⏰', color: 'from-blue-500 to-blue-600' },
    { title: 'المحتوى الأكثر تفاعلاً', content: 'الفيديوهات القصيرة تحقق 3x تفاعل أكثر', icon: '📹', color: 'from-green-500 to-green-600' },
    { title: 'الجمهور المستهدف', content: '68% من جمهورك بين 25-35 سنة', icon: '👥', color: 'from-purple-500 to-purple-600' },
    { title: 'منصة النمو', content: 'Instagram يظهر نمو 45% هذا الشهر', icon: '📈', color: 'from-orange-500 to-orange-600' }
  ];

  return (
    <div className="p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            لوحة تحكم Morvo
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">نظرة عامة شاملة على منصة التسويق الذكي</p>
        </div>
        
        {/* المؤشرات الرئيسية */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 lg:grid-cols-4 gap-6'} mb-6 lg:mb-8`}>
          {metrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' ? (
                        <ArrowUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-red-600" />
                      )}
                      <p className="text-xs lg:text-sm text-green-600 font-medium">{metric.change}</p>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-r ${metric.color} p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <metric.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-3 gap-8'} mb-6 lg:mb-8`}>
          {/* الرسوم البيانية */}
          <div className={`${isMobile ? 'col-span-1' : 'lg:col-span-2'} space-y-6`}>
            <StrategicCharts />
          </div>
          
          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* المهام الحالية */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  المهام الحالية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className="space-y-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-medium text-gray-900 flex-1">{task.title}</h4>
                      <div className={`w-3 h-3 rounded-full ${task.color} flex-shrink-0 mt-1`}></div>
                    </div>
                    <Progress 
                      value={task.progress} 
                      className="h-2 bg-gray-200"
                    />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">{task.status}</span>
                      <span className="font-medium text-blue-600">{task.progress}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* الإحصائيات السريعة */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <span className="text-sm text-gray-700">الزيارات اليوم</span>
                  <span className="font-bold text-green-600">+1,234</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <span className="text-sm text-gray-700">التحويلات</span>
                  <span className="font-bold text-blue-600">42</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                  <span className="text-sm text-gray-700">معدل الارتداد</span>
                  <span className="font-bold text-orange-600">34%</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                  <span className="text-sm text-gray-700">متوسط الجلسة</span>
                  <span className="font-bold text-purple-600">4:32</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* رؤى ذكية */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
              رؤى ذكية من m1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6'}`}>
              {insights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br ${insight.color} p-4 lg:p-6 rounded-xl text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl`}
                >
                  <div className="text-2xl lg:text-3xl mb-2">{insight.icon}</div>
                  <h4 className="font-semibold text-sm lg:text-base mb-2">{insight.title}</h4>
                  <p className="text-xs lg:text-sm opacity-90 leading-relaxed">{insight.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* إعادة تشغيل الإعداد */}
        {user && (
          <div className="mt-6 lg:mt-8">
            <OnboardingRestart user={user} />
          </div>
        )}
      </div>
    </div>
  );
};
