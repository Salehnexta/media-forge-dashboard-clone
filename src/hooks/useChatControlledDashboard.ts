import { useState, useCallback, useMemo } from 'react';
import { AIManager } from '@/types/morvo';
import { useComponentPerformance } from '@/hooks/useEnhancedPerformance';

interface DashboardState {
  activeTab: AIManager;
  widgets: any[];
  charts: any[];
  notifications: any[];
  stats: {
    visitors: number;
    sales: number;
    conversions: number;
    roi: number;
  };
  loading: boolean;
  lastUpdate: number;
}

interface DashboardCommand {
  type: 'UPDATE_STATS' | 'SHOW_CHART' | 'SWITCH_TAB' | 'ADD_NOTIFICATION' | 'CREATE_WIDGET' | 'REMOVE_WIDGET';
  payload: any;
}

export const useChatControlledDashboard = () => {
  useComponentPerformance('ChatControlledDashboard');
  
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    activeTab: 'strategic',
    widgets: [],
    charts: [],
    notifications: [],
    stats: {
      visitors: 2847,
      sales: 47250,
      conversions: 3.2,
      roi: 285
    },
    loading: false,
    lastUpdate: Date.now()
  });

  // Memoized stats for performance
  const formattedStats = useMemo(() => ({
    visitors: dashboardState.stats.visitors.toLocaleString('ar-SA'),
    sales: dashboardState.stats.sales.toLocaleString('ar-SA'),
    conversions: `${dashboardState.stats.conversions}%`,
    roi: `${dashboardState.stats.roi}%`
  }), [dashboardState.stats]);

  const handleChatCommand = useCallback((command: DashboardCommand) => {
    console.log('Executing dashboard command:', command);
    
    setDashboardState(prev => {
      const newState = { ...prev, lastUpdate: Date.now() };
      
      switch (command.type) {
        case 'UPDATE_STATS':
          newState.stats = { ...prev.stats, ...command.payload };
          break;
          
        case 'SHOW_CHART':
          newState.charts = [...prev.charts.filter(c => c.id !== command.payload.id), command.payload];
          break;
          
        case 'SWITCH_TAB':
          newState.activeTab = command.payload.tab;
          break;
          
        case 'ADD_NOTIFICATION':
          newState.notifications = [...prev.notifications, {
            ...command.payload,
            id: Date.now(),
            timestamp: new Date()
          }];
          break;
          
        case 'CREATE_WIDGET':
          newState.widgets = [...prev.widgets, {
            ...command.payload,
            id: Date.now(),
            created: new Date()
          }];
          break;
          
        case 'REMOVE_WIDGET':
          newState.widgets = prev.widgets.filter(w => w.id !== command.payload.id);
          break;
      }
      
      return newState;
    });
  }, []);

  const updateActiveTab = useCallback((tab: AIManager) => {
    setDashboardState(prev => ({ 
      ...prev, 
      activeTab: tab,
      lastUpdate: Date.now()
    }));
  }, []);

  // Batch updates for performance
  const batchUpdate = useCallback((commands: DashboardCommand[]) => {
    setDashboardState(prev => {
      let newState = { ...prev, lastUpdate: Date.now() };
      
      commands.forEach(command => {
        switch (command.type) {
          case 'UPDATE_STATS':
            newState.stats = { ...newState.stats, ...command.payload };
            break;
          case 'SWITCH_TAB':
            newState.activeTab = command.payload.tab;
            break;
          // ... other cases
        }
      });
      
      return newState;
    });
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setDashboardState(prev => ({
      ...prev,
      notifications: [],
      lastUpdate: Date.now()
    }));
  }, []);

  return {
    dashboardState,
    formattedStats,
    handleChatCommand,
    updateActiveTab,
    batchUpdate,
    clearNotifications
  };
};
