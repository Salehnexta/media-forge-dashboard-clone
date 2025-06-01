
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSection } from "@/components/morvo/DashboardSection";
import { ChatSection } from "@/components/morvo/ChatSection";
import { OnboardingTrigger } from "@/components/onboarding/OnboardingTrigger";
import { AIManager } from "@/types/morvo";

const Dashboard = () => {
  const [selectedManager, setSelectedManager] = useState<AIManager>("strategic");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed in Dashboard:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Redirect to auth if not authenticated
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

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
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <OnboardingTrigger user={user}>
      <div className="min-h-screen bg-gray-50 flex" dir="rtl">
        {/* Chat Section on the left */}
        <div className="w-96 bg-white border-l border-gray-200 shadow-lg">
          <ChatSection 
            selectedManager={selectedManager}
            onManagerSelect={setSelectedManager}
          />
        </div>

        {/* Main Dashboard Content on the right */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم Morvo</h1>
            <p className="text-gray-600">منصة التسويق الذكي المتكاملة</p>
          </div>

          {/* Dashboard Content with Tabs */}
          <div className="flex-1 p-6">
            <Tabs value={selectedManager} onValueChange={(value) => setSelectedManager(value as AIManager)}>
              <TabsList className="grid w-full grid-cols-5 mb-6 bg-white shadow-sm">
                <TabsTrigger value="strategic" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">الاستراتيجي</TabsTrigger>
                <TabsTrigger value="monitor" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">السوشال ميديا</TabsTrigger>
                <TabsTrigger value="executor" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">الحملات</TabsTrigger>
                <TabsTrigger value="creative" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">المحتوى</TabsTrigger>
                <TabsTrigger value="analyst" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">التحليلات</TabsTrigger>
              </TabsList>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
      </div>
    </OnboardingTrigger>
  );
};

export default Dashboard;
