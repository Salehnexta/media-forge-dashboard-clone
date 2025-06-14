
import React, { useState } from 'react';
import { TravelStyleDashboard } from './TravelStyleDashboard';
import { DynamicChartsPanel } from '@/components/dashboard/DynamicChartsPanel';
import { useChartCommands } from '@/hooks/useChartCommands';
import { MorvoAIChat } from '@/components/chat/MorvoAIChat';

export const EnhancedTravelStyleDashboard: React.FC = () => {
  const { activeCharts, removeChart, clearAllCharts } = useChartCommands();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left side - Dashboard */}
      <div className="lg:col-span-2 space-y-6">
        {/* لوحة التحكم الأساسية */}
        <TravelStyleDashboard />
        
        {/* لوحة الرسوم البيانية الديناميكية */}
        <DynamicChartsPanel
          charts={activeCharts}
          onRemoveChart={removeChart}
          onClearAll={clearAllCharts}
        />
      </div>
      
      {/* Right side - Morvo AI Chat */}
      <div className="lg:col-span-1">
        <MorvoAIChat />
      </div>
    </div>
  );
};
