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
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'fallback' | 'offline'>('checking');

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
        
        // Check connection status after user is loaded
        if (user) {
          checkConnectionStatus();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  const checkConnectionStatus = async () => {
    try {
      setConnectionStatus('checking');
      const health = await morvoApiService.checkHealth();
      
      if (health.status === 'fallback') {
        setConnectionStatus('fallback');
      } else if (health.status === 'online' || health.status === 'OK') {
        setConnectionStatus('online');
      } else {
        setConnectionStatus('offline');
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('fallback');
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

  const handleRetryConnection = async () => {
    morvoApiService.resetFallbackMode();
    await checkConnectionStatus();
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
      case 'online':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">متصل</span>
          </div>
        );
      case 'fallback':
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">وضع محلي</span>
            <Button onClick={handleRetryConnection} variant="ghost" size="sm" className="text-xs">
              إعادة المحاولة
            </Button>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm">غير متصل</span>
            <Button onClick={handleRetryConnection} variant="ghost" size="sm" className="text-xs">
              إعادة المحاولة
            </Button>
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
                    <p className="text-sm text-gray-600">النظام الجديد - Railway API</p>
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

          {/* Connection Status Alert */}
          {connectionStatus === 'fallback' && (
            <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-yellow-800 font-medium">النظام يعمل في الوضع المحلي</p>
                    <p className="text-yellow-600 text-sm">بعض الميزات قد تكون محدودة</p>
                  </div>
                </div>
                <Button onClick={handleRetryConnection} variant="outline" size="sm">
                  إعادة الاتصال
                </Button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                لوحة تحكم Morvo AI الجديدة
              </h2>
              <p className="text-gray-600 text-lg">
                نظام متطور مع تكامل Railway API
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
                مؤشرات الأداء مع التكامل الجديد
              </p>
              <ChartsSection selectedManager="strategic" />
            </div>

            {/* Updated API Status Message */}
            <div className={`rounded-xl p-6 border ${
              connectionStatus === 'online' 
                ? 'bg-green-50 border-green-200' 
                : connectionStatus === 'fallback'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  connectionStatus === 'online'
                    ? 'bg-green-600'
                    : connectionStatus === 'fallback'
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    {connectionStatus === 'online' && '🚀 تم تفعيل النظام الجديد بنجاح!'}
                    {connectionStatus === 'fallback' && '⚠️ النظام يعمل في الوضع المحلي'}
                    {connectionStatus === 'offline' && '❌ النظام غير متصل حالياً'}
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {connectionStatus === 'online' && 
                      'يستخدم النظام الآن Railway Production API مع 5 وكلاء ذكيين متخصصين. جميع المحادثات والتحليلات تتم عبر الخوادم الجديدة المحسّنة.'
                    }
                    {connectionStatus === 'fallback' && 
                      'النظام متاح مع البيانات المحلية. يمكنك استخدام الميزات الأساسية مع إمكانية محدودة للاتصال بالخوادم الخارجية.'
                    }
                    {connectionStatus === 'offline' && 
                      'لا يمكن الاتصال بالخوادم حالياً. يرجى التحقق من الاتصال بالإنترنت وإعادة المحاولة.'
                    }
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• API Base: https://morvo-production.up.railway.app</div>
                    <div>• WebSocket: {connectionStatus === 'online' ? 'متاح للمحادثات المباشرة' : 'غير متاح'}</div>
                    <div>• SEO Audit: {connectionStatus === 'online' ? 'متاح للتحليلات المتقدمة' : 'وضع محلي'}</div>
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
