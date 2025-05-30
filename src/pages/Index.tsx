
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/morvo/AppSidebar";
import { TopNavigation } from "@/components/morvo/TopNavigation";
import { MorvoDashboard } from "@/components/morvo/dashboards/MorvoDashboard";
import { SocialDashboard } from "@/components/morvo/dashboards/SocialDashboard";
import { CampaignsDashboard } from "@/components/morvo/dashboards/CampaignsDashboard";
import { ContentDashboard } from "@/components/morvo/dashboards/ContentDashboard";
import { AnalyticsDashboard } from "@/components/morvo/dashboards/AnalyticsDashboard";
import { DashboardHome } from "@/components/morvo/DashboardHome";
import { AIManager } from "@/types/morvo";

const Index = () => {
  const [selectedManager, setSelectedManager] = useState<AIManager>("strategic");
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderDashboard = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
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
        return <DashboardHome />;
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

export default Index;
