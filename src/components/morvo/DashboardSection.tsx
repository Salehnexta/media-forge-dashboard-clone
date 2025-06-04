
import { AIManager } from "@/types/morvo";
import { EnhancedStrategicDashboard } from "./dashboards/EnhancedStrategicDashboard";
import { EnhancedSocialMediaDashboard } from "./dashboards/EnhancedSocialMediaDashboard";
import { EnhancedCampaignsDashboard } from "./dashboards/EnhancedCampaignsDashboard";
import { ContentDashboard } from "./dashboards/ContentDashboard";
import { AnalyticsDashboard } from "./dashboards/AnalyticsDashboard";

interface DashboardSectionProps {
  selectedManager: AIManager;
}

export const DashboardSection = ({ selectedManager }: DashboardSectionProps) => {
  const renderDashboard = () => {
    switch (selectedManager) {
      case "strategic":
        return <EnhancedStrategicDashboard />;
      case "monitor":
        return <EnhancedSocialMediaDashboard />;
      case "executor":
        return <EnhancedCampaignsDashboard />;
      case "creative":
        return <ContentDashboard />;
      case "analyst":
        return <AnalyticsDashboard />;
      default:
        return <EnhancedStrategicDashboard />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl shadow-xl border border-gray-100 overflow-hidden">
      {renderDashboard()}
    </div>
  );
};
