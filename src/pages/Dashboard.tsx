
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { EnhancedDashboardLayout } from '@/components/dashboard/EnhancedDashboardLayout';
import { AgentManager } from '@/components/dashboard/AgentManager';
import { CampaignBuilder } from '@/components/dashboard/CampaignBuilder';
import { IntegrationManager } from '@/components/dashboard/IntegrationManager';
import { AssetLibrary } from '@/components/dashboard/AssetLibrary';
import { WebhookListener } from '@/components/railway/WebhookListener';
import { useChatControlledDashboard } from "@/hooks/useChatControlledDashboard";
import { useComponentPerformance } from "@/hooks/useEnhancedPerformance";
import { DashboardSplitContent } from '@/components/dashboard/DashboardSplitContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home,
  BarChart3,
  Users,
  Megaphone,
  PenTool,
  Link,
  Brain,
  LogOut
} from 'lucide-react';

const Dashboard = () => {
  useComponentPerformance('Dashboard');
  
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  const {
    dashboardState,
    handleChatCommand,
    updateActiveTab
  } = useChatControlledDashboard();

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
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">مورفو AI</h1>
              <p className="text-gray-600 mt-2">منصة التسويق الذكي</p>
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
    <div className="min-h-screen flex w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20" dir="rtl">
      <WebhookListener />
      
      <DashboardSplitContent>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-purple-700 px-8 py-6 shadow-lg relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full opacity-50"></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/30">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    مرحباً بك في مورفو AI
                  </h1>
                  <p className="text-blue-100 text-lg">
                    أهلاً {user?.email?.split('@')[0]}، مرحباً بك في منصة مورفو
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-6 py-3 text-sm text-white/90 hover:text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border-b border-gray-200 rounded-none h-16 shadow-sm">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-l data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white rounded-lg mx-1 transition-all duration-300 hover:bg-blue-50"
                >
                  <Home className="w-4 h-4" />
                  الرئيسية
                </TabsTrigger>
                <TabsTrigger 
                  value="agents" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-l data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg mx-1 transition-all duration-300 hover:bg-purple-50"
                >
                  <Users className="w-4 h-4" />
                  الوكلاء
                </TabsTrigger>
                <TabsTrigger 
                  value="campaigns" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-l data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white rounded-lg mx-1 transition-all duration-300 hover:bg-purple-50"
                >
                  <Megaphone className="w-4 h-4" />
                  الحملات
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-l data-[state=active]:from-green-600 data-[state=active]:to-green-700 data-[state=active]:text-white rounded-lg mx-1 transition-all duration-300 hover:bg-green-50"
                >
                  <PenTool className="w-4 h-4" />
                  المحتوى
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-l data-[state=active]:from-orange-600 data-[state=active]:to-orange-700 data-[state=active]:text-white rounded-lg mx-1 transition-all duration-300 hover:bg-orange-50"
                >
                  <BarChart3 className="w-4 h-4" />
                  التحليلات
                </TabsTrigger>
                <TabsTrigger 
                  value="integrations" 
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-l data-[state=active]:from-teal-600 data-[state=active]:to-teal-700 data-[state=active]:text-white rounded-lg mx-1 transition-all duration-300 hover:bg-teal-50"
                >
                  <Link className="w-4 h-4" />
                  التكاملات
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
                <TabsContent value="dashboard" className="h-full p-8 m-0">
                  <EnhancedDashboardLayout />
                </TabsContent>
                <TabsContent value="agents" className="h-full p-8 m-0">
                  <AgentManager />
                </TabsContent>
                <TabsContent value="campaigns" className="h-full p-8 m-0">
                  <CampaignBuilder />
                </TabsContent>
                <TabsContent value="content" className="h-full p-8 m-0">
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <PenTool className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">مبدع المحتوى</h3>
                    <p className="text-gray-600 text-lg">قادم قريباً - أدوات إنتاج المحتوى الإبداعي</p>
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="h-full p-8 m-0">
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BarChart3 className="w-10 h-10 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">التحليلات المتقدمة</h3>
                    <p className="text-gray-600 text-lg">قادم قريباً - تحليلات شاملة بالذكاء الاصطناعي</p>
                  </div>
                </TabsContent>
                <TabsContent value="integrations" className="h-full p-8 m-0">
                  <IntegrationManager />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DashboardSplitContent>
    </div>
  );
};

export default Dashboard;
