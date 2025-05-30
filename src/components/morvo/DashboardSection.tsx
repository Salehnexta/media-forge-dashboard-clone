
import { useState } from 'react';
import { AIManager } from "@/types/morvo";
import { StrategicCharts } from './charts/StrategicCharts';
import { SocialCharts } from './charts/SocialCharts';
import { CampaignCharts } from './charts/CampaignCharts';
import { ContentCharts } from './charts/ContentCharts';
import { AnalyticsCharts } from './charts/AnalyticsCharts';

interface DashboardSectionProps {
  selectedManager: AIManager;
}

export const DashboardSection = ({ selectedManager }: DashboardSectionProps) => {
  const renderCharts = () => {
    switch (selectedManager) {
      case 'strategic':
        return <StrategicCharts />;
      case 'monitor':
        return <SocialCharts />;
      case 'executor':
        return <CampaignCharts />;
      case 'creative':
        return <ContentCharts />;
      case 'analyst':
        return <AnalyticsCharts />;
      default:
        return <StrategicCharts />;
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto">
        {renderCharts()}
      </div>
    </div>
  );
};
