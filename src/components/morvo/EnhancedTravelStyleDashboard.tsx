
import React, { useState } from 'react';
import { TravelStyleDashboard } from './TravelStyleDashboard';
import { DynamicChartsPanel } from '@/components/dashboard/DynamicChartsPanel';
import { ExternalAgentChatSection } from './ExternalAgentChatSection';
import { useChartCommands } from '@/hooks/useChartCommands';

export const EnhancedTravelStyleDashboard: React.FC = () => {
  const { activeCharts, removeChart, clearAllCharts } = useChartCommands();

  const handleDashboardCommand = (command: any) => {
    console.log('Dashboard command received:', command);
    // Handle commands from the external agent
    if (command.type === 'chart_created') {
      // Chart creation is handled by the existing useChartCommands hook
      console.log('Chart created by external agent:', command.chart);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Main Dashboard - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Travel Dashboard */}
          <TravelStyleDashboard />
          
          {/* Dynamic Charts Panel */}
          <DynamicChartsPanel
            charts={activeCharts}
            onRemoveChart={removeChart}
            onClearAll={clearAllCharts}
          />
        </div>
        
        {/* External Agent Chat - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 h-[calc(100vh-3rem)]">
            <ExternalAgentChatSection onDashboardCommand={handleDashboardCommand} />
          </div>
        </div>
      </div>
    </div>
  );
};
