
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { AIManager } from '@/types/morvo';
import { DashboardSection } from '@/components/morvo/DashboardSection';
import { ChatSection } from '@/components/morvo/ChatSection';
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

  const handleManagerSelect = useCallback((manager: AIManager) => {
    updateActiveTab(manager);
  }, [updateActiveTab]);

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
    <div className="flex h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow border-b">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-gray-900">
            لوحة التحكم الذكية
          </h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Main Layout with Chat and Dashboard */}
      <div className="flex w-full pt-20">
        {/* Chat Panel - 40% */}
        <div className="w-2/5 border-l border-gray-200 flex flex-col bg-white shadow-lg">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h2 className="text-lg font-semibold">مورفو AI المساعد</h2>
            </div>
          </div>
          <div className="flex-grow overflow-hidden">
            <ChatSection 
              selectedManager={dashboardState.activeTab as AIManager}
              onManagerSelect={handleManagerSelect}
              onDashboardCommand={onDashboardCommand}
            />
          </div>
        </div>
        
        {/* Dashboard Panel - 60% */}
        <div className="w-3/5 flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="p-4 bg-white/90 backdrop-blur-sm border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">لوحة التحكم التفاعلية</h2>
            <p className="text-sm text-gray-600 mt-1">إدارة حملاتك التسويقية بذكاء اصطناعي متقدم</p>
          </div>
          <div className="flex-grow overflow-y-auto p-6">
            <DashboardSection selectedManager={dashboardState.activeTab as AIManager} />
          </div>
        </div>
      </div>

      {/* Mobile Layout Responsive Design */}
      <style jsx>{`
        @media (max-width: 768px) {
          .flex {
            flex-direction: column !important;
          }
          .w-2\/5, .w-3\/5 {
            width: 100% !important;
            height: 50vh !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
