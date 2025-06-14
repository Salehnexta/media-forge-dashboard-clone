
import React, { useState } from 'react';
import { TravelStyleDashboard } from './TravelStyleDashboard';
import { DynamicChartsPanel } from '@/components/dashboard/DynamicChartsPanel';
import { useChartCommands } from '@/hooks/useChartCommands';

export const EnhancedTravelStyleDashboard: React.FC = () => {
  const { activeCharts, removeChart, clearAllCharts } = useChartCommands();

  return (
    <div className="space-y-6 h-full">
      {/* لوحة التحكم الأساسية */}
      <TravelStyleDashboard />
      
      {/* لوحة الرسوم البيانية الديناميكية */}
      {activeCharts.length > 0 && (
        <DynamicChartsPanel
          charts={activeCharts}
          onRemoveChart={removeChart}
          onClearAll={clearAllCharts}
        />
      )}
    </div>
  );
};
