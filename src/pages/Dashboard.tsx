
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
  FolderOpen
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

  // Chat-controlled dashboard hook with performance optimizations
  const {
    dashboardState,
    handleChatCommand,
    updateActiveTab
  } = useChatControlledDashboard();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <EnhancedDashboardLayout />;
      case 'agents':
        return <AgentManager />;
      case 'campaigns':
        return <CampaignBuilder />;
      case 'integrations':
        return <IntegrationManager />;
      case 'assets':
        return <AssetLibrary />;
      case 'content':
        return (
          <div className="text-center py-12">
            <PenTool className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">مبدع المحتوى</h3>
            <p className="text-gray-600">قادم قريباً - أدوات إنتاج المحتوى الإبداعي</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">التحليلات المتقدمة</h3>
            <p className="text-gray-600">قادم قريباً - تحليلات شاملة بالذكاء الاصطناعي</p>
          </div>
        );
      default:
        return <EnhancedDashboardLayout />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <h1 className="text-2xl font-bold text-gray-900 text-center">تسجيل الدخول مطلوب</h1>
            <div className="mt-8">
              <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google', 'facebook']} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-gray-50" dir="rtl">
      {/* Add webhook listener */}
      <WebhookListener />
      
      {/* Split Content Area: 60% Dashboard + 40% Chat */}
      <DashboardSplitContent>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  مرحباً بك في مورفو AI
                </h1>
                <p className="text-gray-600 mt-1">
                  أهلاً {user?.email?.split('@')[0]}، مرحباً بك في منصة مورفو
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-6 bg-white border-b">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  الرئيسية
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  الوكلاء
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  الحملات
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  المحتوى
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  التحليلات
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  التكاملات
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
                <TabsContent value="dashboard" className="h-full p-6">
                  <EnhancedDashboardLayout />
                </TabsContent>
                <TabsContent value="agents" className="h-full p-6">
                  <AgentManager />
                </TabsContent>
                <TabsContent value="campaigns" className="h-full p-6">
                  <CampaignBuilder />
                </TabsContent>
                <TabsContent value="content" className="h-full p-6">
                  <div className="text-center py-12">
                    <PenTool className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">مبدع المحتوى</h3>
                    <p className="text-gray-600">قادم قريباً - أدوات إنتاج المحتوى الإبداعي</p>
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="h-full p-6">
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">التحليلات المتقدمة</h3>
                    <p className="text-gray-600">قادم قريباً - تحليلات شاملة بالذكاء الاصطناعي</p>
                  </div>
                </TabsContent>
                <TabsContent value="integrations" className="h-full p-6">
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
