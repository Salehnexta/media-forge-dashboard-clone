
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { SimplifiedDashboardLayout } from '@/components/dashboard/SimplifiedDashboardLayout';
import { WebhookListener } from '@/components/railway/WebhookListener';
import { MetricsOverview } from '@/components/morvo/MetricsOverview';
import { ChartsSection } from '@/components/morvo/ChartsSection';
import { Button } from "@/components/ui/button";
import { 
  Brain,
  LogOut,
  Sparkles,
  BarChart3,
  Target,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">مورفو AI</h1>
              <p className="text-gray-600 mt-2">رفيق التسويق الذكي</p>
            </div>
            <Auth 
              supabaseClient={supabase} 
              appearance={{ 
                theme: ThemeSupa,
                style: {
                  button: {
                    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600'
                  },
                  input: {
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    padding: '12px 16px',
                    fontSize: '16px'
                  }
                }
              }} 
              providers={['google']} 
              redirectTo={window.location.origin}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <WebhookListener />
      
      <SimplifiedDashboardLayout>
        <div className="h-full flex flex-col">
          {/* Simplified Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">مورفو - رفيق التسويق</h1>
                  <p className="text-sm text-gray-600">تحليل وإبداع وحملات في مكان واحد</p>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                مرحباً بك في تجربة التسويق الجديدة 🚀
              </h2>
              <p className="text-gray-600 text-lg">
                كل ما تحتاجه من تحليل وإبداع ونشر - في محادثة واحدة مع مورفو
              </p>
            </div>

            {/* Quick Stats */}
            <div className="mb-8">
              <MetricsOverview />
            </div>

            {/* Performance Charts */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                نظرة سريعة على الأداء
              </h3>
              <p className="text-gray-600 mb-6">
                مؤشرات أداء سريعة - للتحليل المفصل، تحدث مع مورفو في الشات
              </p>
              <ChartsSection selectedManager="strategic" />
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    ابدأ محادثتك مع مورفو الآن
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    اسأل عن أي شيء: "كيف أداء متجري؟" أو "اكتب منشور للمنتج الجديد" أو "صمم حملة بميزانية 5000 ريال"
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Target className="w-3 h-3" />
                    <span>تحليل فوري</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Sparkles className="w-3 h-3" />
                    <span>محتوى إبداعي</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <BarChart3 className="w-3 h-3" />
                    <span>حملات ذكية</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SimplifiedDashboardLayout>
    </div>
  );
};

export default Dashboard;
