import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AIManager } from '@/types/morvo';
import { DashboardSection } from '@/components/morvo/DashboardSection';
import { UniversalChatWidget } from '@/components/chat/UniversalChatWidget';
import { useChatControlledDashboard } from "@/hooks/useChatControlledDashboard";
import { useComponentPerformance } from "@/hooks/useEnhancedPerformance";

const Dashboard = () => {
  useComponentPerformance('Dashboard');
  
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

  // Chat-controlled dashboard hook with performance optimizations
  const {
    dashboardState,
    formattedStats,
    handleChatCommand,
    updateActiveTab
  } = useChatControlledDashboard();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const onDashboardCommand = useCallback((command: any) => {
    console.log('Dashboard received command from chat:', command);
    handleChatCommand(command);
    
    // Show minimal user feedback
    if (command.type === 'SWITCH_TAB') {
      updateActiveTab(command.payload.tab);
    }
  }, [handleChatCommand, updateActiveTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            لوحة التحكم
          </h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم الذكية</h1>
            <p className="text-gray-600">إدارة حملاتك التسويقية بذكاء اصطناعي متقدم</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{formattedStats.visitors.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{formattedStats.visitors.value}</p>
                </div>
                <div className={`text-sm font-medium ${formattedStats.visitors.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {formattedStats.visitors.trend}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{formattedStats.conversions.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{formattedStats.conversions.value}</p>
                </div>
                <div className={`text-sm font-medium ${formattedStats.conversions.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {formattedStats.conversions.trend}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{formattedStats.revenue.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{formattedStats.revenue.value}</p>
                </div>
                <div className={`text-sm font-medium ${formattedStats.revenue.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {formattedStats.revenue.trend}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{formattedStats.campaigns.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{formattedStats.campaigns.value}</p>
                </div>
                <div className={`text-sm font-medium ${formattedStats.campaigns.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {formattedStats.campaigns.trend}
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <DashboardSection selectedManager={dashboardState.activeTab as AIManager} />
        </div>
      </div>

      {/* Chat Widget */}
      <UniversalChatWidget />
    </div>
  );
};

export default Dashboard;
