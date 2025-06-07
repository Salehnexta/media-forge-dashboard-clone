
import React, { memo } from "react";
import { AIManager } from "@/types/morvo";
import { LazyDashboardTab } from "@/components/common/LazyDashboardTab";

// Lazy import للداش بوردات
const EnhancedStrategicDashboard = React.lazy(() => 
  import("./dashboards/EnhancedStrategicDashboard").then(module => ({
    default: module.EnhancedStrategicDashboard
  }))
);

const EnhancedSocialMediaDashboard = React.lazy(() => 
  import("./dashboards/EnhancedSocialMediaDashboard").then(module => ({
    default: module.EnhancedSocialMediaDashboard
  }))
);

const EnhancedCampaignsDashboard = React.lazy(() => 
  import("./dashboards/EnhancedCampaignsDashboard").then(module => ({
    default: module.EnhancedCampaignsDashboard
  }))
);

const ContentDashboard = React.lazy(() => 
  import("./dashboards/ContentDashboard").then(module => ({
    default: module.ContentDashboard
  }))
);

const AnalyticsDashboard = React.lazy(() => 
  import("./dashboards/AnalyticsDashboard").then(module => ({
    default: module.AnalyticsDashboard
  }))
);

interface DashboardSectionProps {
  selectedManager: AIManager;
}

const DashboardSectionInner = ({ selectedManager }: DashboardSectionProps) => {
  // Removed useComponentPerformance hook call to prevent React context errors
  
  const renderDashboard = () => {
    switch (selectedManager) {
      case "strategic":
        return (
          <LazyDashboardTab tabName="strategic">
            <EnhancedStrategicDashboard />
          </LazyDashboardTab>
        );
      case "monitor":
        return (
          <LazyDashboardTab tabName="monitor">
            <EnhancedSocialMediaDashboard />
          </LazyDashboardTab>
        );
      case "executor":
        return (
          <LazyDashboardTab tabName="executor">
            <EnhancedCampaignsDashboard />
          </LazyDashboardTab>
        );
      case "creative":
        return (
          <LazyDashboardTab tabName="creative">
            <ContentDashboard />
          </LazyDashboardTab>
        );
      case "analyst":
        return (
          <LazyDashboardTab tabName="analyst">
            <AnalyticsDashboard />
          </LazyDashboardTab>
        );
      default:
        return (
          <LazyDashboardTab tabName="strategic">
            <EnhancedStrategicDashboard />
          </LazyDashboardTab>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl shadow-xl border border-gray-100 overflow-hidden">
      {renderDashboard()}
    </div>
  );
};

export const DashboardSection = memo(DashboardSectionInner);
DashboardSection.displayName = 'DashboardSection';
