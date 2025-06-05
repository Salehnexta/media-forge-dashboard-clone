
import { AIManager } from "@/types/morvo";
import { EnhancedStrategicDashboard } from "./dashboards/EnhancedStrategicDashboard";
import { EnhancedSocialMediaDashboard } from "./dashboards/EnhancedSocialMediaDashboard";
import { EnhancedCampaignsDashboard } from "./dashboards/EnhancedCampaignsDashboard";
import { ContentDashboard } from "./dashboards/ContentDashboard";
import { AnalyticsDashboard } from "./dashboards/AnalyticsDashboard";

interface DashboardSectionProps {
  selectedManager: AIManager;
  dashboardState?: {
    widgets: any[];
    charts: any[];
    stats: any;
    notifications: any[];
  };
  onUserAction?: (action: any) => void;
}

export const DashboardSection = ({ 
  selectedManager, 
  dashboardState,
  onUserAction 
}: DashboardSectionProps) => {
  
  const handleUserAction = (action: any) => {
    console.log('Dashboard user action:', action);
    onUserAction?.(action);
  };

  const renderDashboard = () => {
    // Don't pass unsupported props to the dashboard components
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
      {/* Chat-controlled status indicator */}
      {dashboardState && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            يديره مورفو AI
          </div>
        </div>
      )}
      
      {renderDashboard()}
    </div>
  );
};
