
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSection } from "@/components/morvo/DashboardSection";
import { ChatSection } from "@/components/morvo/ChatSection";
import { OnboardingTrigger } from "@/components/onboarding/OnboardingTrigger";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AIManager } from "@/types/morvo";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatControlledDashboard } from "@/hooks/useChatControlledDashboard";
import { useComponentPerformance } from "@/hooks/useEnhancedPerformance";
import { toast } from "sonner";

const Dashboard = () => {
  useComponentPerformance('Dashboard');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Chat-controlled dashboard hook with performance optimizations
  const {
    dashboardState,
    formattedStats,
    handleChatCommand,
    updateActiveTab
  } = useChatControlledDashboard();

  // Memoized auth state management
  const handleAuthStateChange = useCallback((event: any, session: Session | null) => {
    console.log('Auth state changed in Dashboard:', event, session);
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
    
    // Redirect to auth if not authenticated
    if (!session?.user) {
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [handleAuthStateChange, navigate]);

  // Memoized dashboard command handler
  const onDashboardCommand = useCallback((command: any) => {
    console.log('Dashboard received command from chat:', command);
    handleChatCommand(command);
    
    // Show minimal user feedback
    if (command.type === 'SWITCH_TAB') {
      toast.success(`تم التبديل إلى ${getTabName(command.payload.tab)}`);
    }
  }, [handleChatCommand]);

  // Memoized tab name getter
  const getTabName = useCallback((tab: AIManager): string => {
    const names = {
      strategic: 'المدير الاستراتيجي',
      monitor: 'مراقب السوشال ميديا',
      executor: 'منفذ الحملات',
      creative: 'المبدع الإبداعي',
      analyst: 'محلل البيانات'
    };
    return names[tab] || tab;
  }, []);

  // Memoized manager selector
  const handleManagerSelect = useCallback((manager: AIManager) => {
    updateActiveTab(manager);
  }, [updateActiveTab]);

  // Memoized chat toggle handler
  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  // Memoized stats component
  const StatsDisplay = useMemo(() => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white/60 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <p className="text-xs text-gray-500">الزوار</p>
        <p className="text-lg font-bold text-blue-600">{formattedStats.visitors}</p>
      </div>
      <div className="bg-white/60 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <p className="text-xs text-gray-500">المبيعات</p>
        <p className="text-lg font-bold text-green-600">{formattedStats.sales}</p>
      </div>
      <div className="bg-white/60 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <p className="text-xs text-gray-500">التحويلات</p>
        <p className="text-lg font-bold text-purple-600">{formattedStats.conversions}</p>
      </div>
      <div className="bg-white/60 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <p className="text-xs text-gray-500">العائد</p>
        <p className="text-lg font-bold text-orange-600">{formattedStats.roi}</p>
      </div>
    </div>
  ), [formattedStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <p className="text-gray-600 animate-fade-in">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <ErrorBoundary>
      <OnboardingTrigger user={user}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col lg:flex-row" dir="rtl">
          {/* Mobile Chat Toggle Button */}
          {isMobile && (
            <button
              onClick={toggleChat}
              className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          )}

          {/* Chat Section */}
          <div className={`${
            isMobile 
              ? `fixed inset-y-0 right-0 z-40 w-full transform transition-transform duration-300 ${
                  isChatOpen ? 'translate-x-0' : 'translate-x-full'
                }`
              : 'w-80 xl:w-96'
          } bg-white border-l border-gray-200 shadow-xl flex-shrink-0`}>
            <ChatSection 
              selectedManager={dashboardState.activeTab}
              onManagerSelect={handleManagerSelect}
              onDashboardCommand={onDashboardCommand}
            />
            {isMobile && (
              <button
                onClick={toggleChat}
                className="absolute top-4 left-4 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white">
            {/* Optimized Header */}
            <div className="p-4 lg:p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    لوحة تحكم مورفو AI
                  </h1>
                  <p className="text-gray-600 text-sm lg:text-base">منصة التسويق الذكي المتكاملة</p>
                </div>
                
                {/* AI Control Indicator */}
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-700 font-medium">يديره مورفو AI</span>
                  </div>
                </div>
              </div>
              
              {/* Optimized Stats Display */}
              {StatsDisplay}
            </div>

            {/* Dashboard Content with Enhanced Tabs */}
            <div className="flex-1 p-4 lg:p-6 overflow-auto">
              <Tabs value={dashboardState.activeTab} onValueChange={(value) => handleManagerSelect(value as AIManager)}>
                <TabsList className={`${
                  isMobile 
                    ? 'grid w-full grid-cols-2 gap-2 h-auto p-2' 
                    : 'grid w-full grid-cols-5'
                } mb-6 bg-white shadow-lg rounded-xl border border-gray-200`}>
                  <TabsTrigger 
                    value="strategic" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg text-xs lg:text-sm font-medium"
                  >
                    الاستراتيجي (M1)
                  </TabsTrigger>
                  <TabsTrigger 
                    value="monitor" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg text-xs lg:text-sm font-medium"
                  >
                    السوشال ميديا (M2)
                  </TabsTrigger>
                  <TabsTrigger 
                    value="executor" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg text-xs lg:text-sm font-medium"
                  >
                    الحملات (M3)
                  </TabsTrigger>
                  <TabsTrigger 
                    value="creative" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg text-xs lg:text-sm font-medium"
                  >
                    المحتوى (M4)
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analyst" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-lg text-xs lg:text-sm font-medium"
                  >
                    التحليلات (M5)
                  </TabsTrigger>
                </TabsList>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <TabsContent value="strategic" className="m-0">
                    <DashboardSection selectedManager="strategic" />
                  </TabsContent>
                  <TabsContent value="monitor" className="m-0">
                    <DashboardSection selectedManager="monitor" />
                  </TabsContent>
                  <TabsContent value="executor" className="m-0">
                    <DashboardSection selectedManager="executor" />
                  </TabsContent>
                  <TabsContent value="creative" className="m-0">
                    <DashboardSection selectedManager="creative" />
                  </TabsContent>
                  <TabsContent value="analyst" className="m-0">
                    <DashboardSection selectedManager="analyst" />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Mobile overlay */}
          {isMobile && isChatOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={toggleChat}
            />
          )}
        </div>
      </OnboardingTrigger>
    </ErrorBoundary>
  );
};

export default Dashboard;
