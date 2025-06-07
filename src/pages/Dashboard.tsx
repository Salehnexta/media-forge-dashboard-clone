
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
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardTopHeader } from '@/components/dashboard/DashboardTopHeader';
import { DashboardSplitContent } from '@/components/dashboard/DashboardSplitContent';
import { 
  Home,
  BarChart3,
  Users,
  Megaphone,
  PenTool,
  Link,
  FolderOpen
} from 'lucide-react';

// Define the sidebar navigation items
const navigationItems = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
  { id: 'agents', label: 'إدارة الوكلاء', icon: Users },
  { id: 'campaigns', label: 'منشئ الحملات', icon: Megaphone },
  { id: 'content', label: 'المحتوى الإبداعي', icon: PenTool },
  { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
  { id: 'integrations', label: 'التكاملات', icon: Link },
  { id: 'assets', label: 'مكتبة الأصول', icon: FolderOpen }
];

const Dashboard = () => {
  useComponentPerformance('Dashboard');
  
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const renderActiveSection = () => {
    switch (activeSection) {
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50" dir="rtl">
        {/* Add webhook listener */}
        <WebhookListener />
        
        {/* Enhanced Sidebar */}
        <DashboardSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isSidebarCollapsed={isSidebarCollapsed}
          user={user}
          handleSignOut={handleSignOut}
        />

        {/* Main Content Area - Split Layout */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <DashboardTopHeader
            activeSection={activeSection}
            navigationItems={navigationItems}
            user={user}
          />

          {/* Split Content Area: 60% Dashboard + 40% Chat */}
          <DashboardSplitContent>
            {renderActiveSection()}
          </DashboardSplitContent>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
