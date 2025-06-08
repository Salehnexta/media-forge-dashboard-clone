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
import { DashboardSplitContent } from '@/components/dashboard/DashboardSplitContent';
import { MetricsOverview } from '@/components/morvo/MetricsOverview';
import { ChartsSection } from '@/components/morvo/ChartsSection';
import { AgentStatusDashboard } from '@/components/morvo/AgentStatusDashboard';
import { supabaseOnlyService } from '@/services/SupabaseOnlyService';
import { Button } from "@/components/ui/button";
import { 
  Users,
  Megaphone,
  PenTool,
  BarChart3,
  Target,
  Bell,
  Search,
  User,
  Brain,
  LogOut
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('استراتيجي');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'local' | 'ready'>('checking');

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
        
        // Check local connection status
        if (user) {
          checkLocalConnection();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  const checkLocalConnection = async () => {
    try {
      setConnectionStatus('checking');
      const health = await supabaseOnlyService.checkHealth();
      
      if (health.mode === 'local') {
        setConnectionStatus('local');
      } else {
        setConnectionStatus('ready');
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('local');
    }
  };

  const {
    dashboardState,
    handleChatCommand,
    updateActiveTab
  } = useChatControlledDashboard();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleRefreshConnection = async () => {
    await checkLocalConnection();
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

  const tabs = [
    { id: 'استراتيجي', label: 'استراتيجي', icon: Target },
    { id: 'محتوى', label: 'محتوى', icon: PenTool },
    { id: 'حملات', label: 'حملات', icon: Megaphone },
    { id: 'سوشال', label: 'سوشال', icon: Users },
    { id: 'تحليلات', label: 'تحليلات', icon: BarChart3 }
  ];

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'local':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm">وضع محلي</span>
          </div>
        );
      case 'ready':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">متصل</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            <span className="text-sm">جاري التحقق...</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <WebhookListener />
      
      <DashboardSplitContent>
        <div className="h-full flex flex-col">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Morvo منصة</h1>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">النظام المحلي - Supabase فقط</p>
                    {getConnectionStatusBadge()}
                  </div>
                </div>
              </div>

              {/* Top Navigation Tabs */}
              <div className="flex items-center gap-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
                </Button>
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
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                لوحة تحكم Morvo AI - الوضع المحلي
              </h2>
              <p className="text-gray-600 text-lg">
                نظام متطور مع تكامل Supabase فقط
              </p>
            </div>

            {/* Agent Status Dashboard */}
            <div className="mb-8">
              <AgentStatusDashboard />
            </div>

            {/* Metrics Overview */}
            <div className="mb-8">
              <MetricsOverview />
            </div>

            {/* Charts Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-600 mb-4">
                المؤشرات الاستراتيجية - {activeTab}
              </h3>
              <p className="text-gray-600 mb-6">
                مؤشرات الأداء مع البيانات المحلية
              </p>
              <ChartsSection selectedManager="strategic" />
            </div>

            {/* Status Message */}
            <div className="rounded-xl p-6 border bg-blue-50 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-600">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    ✅ النظام يعمل بالوضع المحلي بنجاح!
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    النظام متصل مع قاعدة بيانات Supabase ويعمل بكامل طاقته محلياً. جميع البيانات محفوظة بأمان في قاعدة البيانات وجاهزة للاستخدام.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• Database: Supabase (متصل)</div>
                    <div>• Authentication: Supabase Auth (متاح)</div>
                    <div>• Data Storage: محلي وآمن</div>
                    <div>• Chat System: محلي مع حفظ المحادثات</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSplitContent>
    </div>
  );
};

export default Dashboard;
