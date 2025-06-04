
import { AIManager } from "@/types/morvo";
import { StrategicDashboard } from "./dashboards/StrategicDashboard";
import { SocialMediaDashboard } from "./dashboards/SocialMediaDashboard";
import { CampaignsDashboard } from "./dashboards/CampaignsDashboard";
import { ContentDashboard } from "./dashboards/ContentDashboard";
import { AnalyticsDashboard } from "./dashboards/AnalyticsDashboard";

interface DashboardSectionProps {
  selectedManager: AIManager;
}

export const DashboardSection = ({ selectedManager }: DashboardSectionProps) => {
  const renderDashboard = () => {
    switch (selectedManager) {
      case "strategic":
        return <StrategicDashboard />;
      case "monitor":
        return <SocialMediaDashboard />;
      case "executor":
        return <CampaignsDashboard />;
      case "creative":
        return <ContentDashboard />;
      case "analyst":
        return <AnalyticsDashboard />;
      default:
        return <StrategicDashboard />;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {renderDashboard()}
    </div>
  );
};
