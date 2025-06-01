
import { AIManager } from "@/types/morvo";
import { MorvoDashboard } from "./dashboards/MorvoDashboard";
import { SocialDashboard } from "./dashboards/SocialDashboard";
import { CampaignsDashboard } from "./dashboards/CampaignsDashboard";
import { ContentDashboard } from "./dashboards/ContentDashboard";
import { AnalyticsDashboard } from "./dashboards/AnalyticsDashboard";
import { PerformanceDashboard } from "./PerformanceDashboard";

interface DashboardSectionProps {
  selectedManager: AIManager;
}

export const DashboardSection = ({ selectedManager }: DashboardSectionProps) => {
  const renderDashboard = () => {
    switch (selectedManager) {
      case "strategic":
        return <MorvoDashboard />;
      case "monitor":
        return <SocialDashboard />;
      case "executor":
        return <CampaignsDashboard />;
      case "creative":
        return <ContentDashboard />;
      case "analyst":
        return <AnalyticsDashboard />;
      case "performance":
        return <PerformanceDashboard />;
      default:
        return <MorvoDashboard />;
    }
  };

  return (
    <div className="p-6">
      {renderDashboard()}
    </div>
  );
};
