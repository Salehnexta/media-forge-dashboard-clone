
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/morvo/AppSidebar";
import { TopNavigation } from "@/components/morvo/TopNavigation";
import { MorvoDashboard } from "@/components/morvo/dashboards/MorvoDashboard";
import { SocialDashboard } from "@/components/morvo/dashboards/SocialDashboard";
import { CampaignsDashboard } from "@/components/morvo/dashboards/CampaignsDashboard";
import { ContentDashboard } from "@/components/morvo/dashboards/ContentDashboard";
import { AnalyticsDashboard } from "@/components/morvo/dashboards/AnalyticsDashboard";
import { AIManager } from "@/types/morvo";

const Dashboard = () => {
  const [selectedManager, setSelectedManager] = useState<AIManager>("strategic");
  const [activeTab, setActiveTab] = useState("morvo");
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

  const renderDashboard = () => {
    switch (activeTab) {
      case 'morvo':
        return <MorvoDashboard />;
      case 'social':
        return <SocialDashboard />;
      case 'campaigns':
        return <CampaignsDashboard />;
      case 'content':
        return <ContentDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return <MorvoDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full" dir="rtl">
        <AppSidebar 
          selectedManager={selectedManager}
          onManagerSelect={setSelectedManager}
        />
        <div className="flex-1 flex flex-col">
          <TopNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <main className="flex-1 overflow-auto">
            {renderDashboard()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
