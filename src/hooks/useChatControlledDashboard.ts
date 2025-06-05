import { useState, useCallback, useMemo } from 'react';
import { useComponentPerformance } from './useEnhancedPerformance';

interface DashboardCommand {
  type: 'SWITCH_TAB' | 'UPDATE_STATS' | 'SHOW_CHART' | 'ADD_NOTIFICATION' | 'UPDATE_WIDGET';
  payload: any;
}

interface DashboardState {
  activeTab: string;
  widgets: any[];
  charts: any[];
  notifications: any[];
  stats: Record<string, any>;
}

export const useChatControlledDashboard = () => {
  useComponentPerformance('ChatControlledDashboard');
  
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    activeTab: 'overview',
    widgets: [],
    charts: [],
    notifications: [],
    stats: {
      visitors: 2847,
      conversions: 125,
      revenue: 47250,
      campaigns: 8
    }
  });

  const handleChatCommand = useCallback((command: DashboardCommand) => {
    console.log('Processing dashboard command:', command);
    
    switch(command.type) {
      case 'SWITCH_TAB':
        setDashboardState(prev => ({
          ...prev,
          activeTab: command.payload.tab
        }));
        break;
        
      case 'UPDATE_STATS':
        setDashboardState(prev => ({
          ...prev,
          stats: { ...prev.stats, ...command.payload.stats }
        }));
        break;
        
      case 'SHOW_CHART':
        setDashboardState(prev => ({
          ...prev,
          charts: [...prev.charts, command.payload.chart]
        }));
        break;
        
      case 'ADD_NOTIFICATION':
        setDashboardState(prev => ({
          ...prev,
          notifications: [...prev.notifications, command.payload.notification]
        }));
        break;
        
      case 'UPDATE_WIDGET':
        setDashboardState(prev => ({
          ...prev,
          widgets: prev.widgets.map(widget => 
            widget.id === command.payload.widgetId 
              ? { ...widget, ...command.payload.updates }
              : widget
          )
        }));
        break;
    }
  }, []);

  const updateActiveTab = useCallback((tab: string) => {
    handleChatCommand({ type: 'SWITCH_TAB', payload: { tab } });
  }, [handleChatCommand]);

  const formattedStats = useMemo(() => ({
    visitors: {
      value: dashboardState.stats.visitors?.toLocaleString('ar-SA') || '0',
      label: 'الزوار اليوم',
      trend: '+12%',
      positive: true
    },
    conversions: {
      value: dashboardState.stats.conversions?.toString() || '0',
      label: 'التحويلات',
      trend: '+8%',
      positive: true
    },
    revenue: {
      value: `${dashboardState.stats.revenue?.toLocaleString('ar-SA') || '0'} ريال`,
      label: 'الإيرادات',
      trend: '+15%',
      positive: true
    },
    campaigns: {
      value: dashboardState.stats.campaigns?.toString() || '0',
      label: 'الحملات النشطة',
      trend: '+2',
      positive: true
    }
  }), [dashboardState.stats]);

  return {
    dashboardState,
    formattedStats,
    handleChatCommand,
    updateActiveTab
  };
};
