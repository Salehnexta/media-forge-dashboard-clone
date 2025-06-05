
import { useState, useCallback } from 'react';
import { AIManager } from '@/types/morvo';

interface DashboardState {
  activeTab: AIManager;
  widgets: any[];
  charts: any[];
  stats: {
    visitors: number;
    sales: number;
    conversions: number;
    roi: number;
  };
}

interface DashboardCommand {
  type: 'UPDATE_STATS' | 'SHOW_CHART' | 'SWITCH_TAB';
  payload: any;
}

export const useChatControlledDashboard = () => {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    activeTab: 'strategic',
    widgets: [],
    charts: [],
    stats: {
      visitors: 2847,
      sales: 47250,
      conversions: 3.2,
      roi: 285
    }
  });

  const handleChatCommand = useCallback((command: DashboardCommand) => {
    console.log('Executing dashboard command:', command);
    
    switch (command.type) {
      case 'UPDATE_STATS':
        setDashboardState(prev => ({
          ...prev,
          stats: { ...prev.stats, ...command.payload }
        }));
        break;
        
      case 'SHOW_CHART':
        setDashboardState(prev => ({
          ...prev,
          charts: [...prev.charts.filter(c => c.id !== command.payload.id), command.payload]
        }));
        break;
        
      case 'SWITCH_TAB':
        setDashboardState(prev => ({
          ...prev,
          activeTab: command.payload.tab
        }));
        break;
    }
  }, []);

  const updateActiveTab = useCallback((tab: AIManager) => {
    setDashboardState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  return {
    dashboardState,
    handleChatCommand,
    updateActiveTab
  };
};
