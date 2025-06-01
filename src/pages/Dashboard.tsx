
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
      <div className="min-h-screen bg-gray-50 flex w-full" dir="rtl">
        {/* Chat Section on the left */}
        <div className="w-1/3 bg-white border-l border-gray-200">
          <ChatSection 
            selectedManager={selectedManager}
            onManagerSelect={setSelectedManager}
          />
        </div>

        {/* Main Dashboard Content on the right */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم Morvo</h1>
            <p className="text-gray-600">منصة التسويق الذكي المتكاملة</p>
          </div>

          {/* Dashboard Content with Tabs */}
          <div className="flex-1 p-6">
            <Tabs value={selectedManager} onValueChange={(value) => setSelectedManager(value as AIManager)}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="strategic">الاستراتيجي</TabsTrigger>
                <TabsTrigger value="monitor">السوشال ميديا</TabsTrigger>
                <TabsTrigger value="executor">الحملات</TabsTrigger>
                <TabsTrigger value="creative">المحتوى</TabsTrigger>
                <TabsTrigger value="analyst">التحليلات</TabsTrigger>
              </TabsList>

              <TabsContent value="strategic">
                <DashboardSection selectedManager="strategic" />
              </TabsContent>
              <TabsContent value="monitor">
                <DashboardSection selectedManager="monitor" />
              </TabsContent>
              <TabsContent value="executor">
                <DashboardSection selectedManager="executor" />
              </TabsContent>
              <TabsContent value="creative">
                <DashboardSection selectedManager="creative" />
              </TabsContent>
              <TabsContent value="analyst">
                <DashboardSection selectedManager="analyst" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </OnboardingTrigger>
  );
};

export default Dashboard;
