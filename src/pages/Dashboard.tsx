
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AIManager } from '@/types/morvo';
import { EnhancedLovableChat } from '@/components/chat/EnhancedLovableChat';
import { AgentManager } from '@/components/dashboard/AgentManager';
import { EnhancedDashboardLayout } from '@/components/dashboard/EnhancedDashboardLayout';
import { CampaignBuilder } from '@/components/dashboard/CampaignBuilder';
import { IntegrationManager } from '@/components/dashboard/IntegrationManager';
import { AssetLibrary } from '@/components/dashboard/AssetLibrary';
import { WebhookListener } from '@/components/railway/WebhookListener';
import { useChatControlledDashboard } from "@/hooks/useChatControlledDashboard";
import { useComponentPerformance } from "@/hooks/useEnhancedPerformance";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home,
  BarChart3,
  MessageCircle,
  Users,
  Megaphone,
  PenTool,
  Settings,
  Link,
  FolderOpen,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  Sparkles,
  Brain,
  Zap
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
        <Sidebar className="border-l bg-white shadow-lg">
          <SidebarHeader className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <h2 className="font-bold text-xl text-gray-900">Morvo AI</h2>
                  <p className="text-sm text-gray-600">منصة التسويق الذكي</p>
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-12 gap-3 ${
                      isActive 
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <Icon className="w-5 h-5" />
                    {!isSidebarCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Button>
                );
              })}
            </nav>

            {/* AI Status */}
            {!isSidebarCollapsed && (
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">حالة الذكاء الاصطناعي</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">5 وكلاء نشطين</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">المحادثة متاحة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">التحليل الذكي جاري</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {!isSidebarCollapsed && (
              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">إجراءات سريعة</p>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Bell className="w-4 h-4" />
                  الإشعارات
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <HelpCircle className="w-4 h-4" />
                  المساعدة
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Settings className="w-4 h-4" />
                  الإعدادات
                </Button>
              </div>
            )}
          </SidebarContent>

          {/* Sidebar Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-600">مستخدم نشط</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Sidebar>

        {/* Main Content Area - Split Layout */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {navigationItems.find(item => item.id === activeSection)?.label || 'لوحة التحكم'}
                </h1>
                <p className="text-sm text-gray-600">
                  مرحباً، {user?.email?.split('@')[0]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Zap className="w-4 h-4" />
                تحسين ذكي
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Split Content Area: 60% Dashboard + 40% Chat */}
          <div className="flex-1 flex overflow-hidden">
            {/* Dashboard Content Area - 60% */}
            <div className="flex-1 w-3/5 p-6 overflow-auto bg-gray-50">
              <div className="h-full">
                {renderActiveSection()}
              </div>
            </div>

            {/* Chat Area - 40% */}
            <div className="w-2/5 bg-white border-l border-gray-200 flex flex-col min-w-0">
              <div className="flex-1 flex flex-col h-full">
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">المحادثة الذكية</h3>
                      <p className="text-sm text-gray-600">تحدث مع مساعد Morvo AI</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 min-h-0">
                  <EnhancedLovableChat />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
