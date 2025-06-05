import { useState, useCallback, useMemo } from 'react';
import { useComponentPerformance } from './useEnhancedPerformance';
import { DashboardCommand } from '@/types/dashboard';
import { toast } from 'sonner';

interface DashboardState {
  activeTab: string;
  widgets: any[];
  charts: any[];
  notifications: any[];
  stats: Record<string, any>;
  lastCommandExecuted?: DashboardCommand;
  commandHistory: DashboardCommand[];
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
      conversions: 125,
      revenue: 47250,
      campaigns: 8
    },
    commandHistory: []
  });

  const handleChatCommand = useCallback((command: DashboardCommand) => {
    console.log('🎯 Processing dashboard command:', command);
    
    try {
      switch(command.type) {
        case 'TAB_CHANGE':
          setDashboardState(prev => ({
            ...prev,
            activeTab: command.payload.tab,
            lastCommandExecuted: command,
            commandHistory: [...prev.commandHistory, command].slice(-10)
          }));
          toast.success(`تم الانتقال إلى ${getTabDisplayName(command.payload.tab)}`);
          break;
          
        case 'STATS_UPDATE':
        case 'DATA_REFRESH':
          const newStats = generateRandomStats();
          setDashboardState(prev => ({
            ...prev,
            stats: { ...prev.stats, ...newStats },
            lastCommandExecuted: command,
            commandHistory: [...prev.commandHistory, command].slice(-10)
          }));
          toast.success('تم تحديث الإحصائيات بنجاح');
          break;
          
        case 'CHART_CREATE':
          const newChart = {
            id: Date.now().toString(),
            type: command.payload.chartType || 'default',
            title: 'رسم بياني جديد',
            data: generateChartData()
          };
          setDashboardState(prev => ({
            ...prev,
            charts: [...prev.charts, newChart],
            lastCommandExecuted: command,
            commandHistory: [...prev.commandHistory, command].slice(-10)
          }));
          toast.success('تم إنشاء رسم بياني جديد');
          break;
          
        case 'WIDGET_UPDATE':
          setDashboardState(prev => ({
            ...prev,
            widgets: prev.widgets.map(widget => 
              widget.id === command.payload.widgetId 
                ? { ...widget, ...command.payload.updates }
                : widget
            ),
            lastCommandExecuted: command,
            commandHistory: [...prev.commandHistory, command].slice(-10)
          }));
          toast.success('تم تحديث الويدجت');
          break;

        case 'FILTER_APPLY':
          setDashboardState(prev => ({
            ...prev,
            lastCommandExecuted: command,
            commandHistory: [...prev.commandHistory, command].slice(-10)
          }));
          toast.success('تم تطبيق المرشح');
          break;
          
        default:
          console.warn('⚠️ Unknown command type:', command.type);
          toast.error('أمر غير معروف');
      }
    } catch (error) {
      console.error('❌ Error executing dashboard command:', error);
      toast.error('خطأ في تنفيذ الأمر');
    }
  }, []);

  const updateActiveTab = useCallback((tab: string) => {
    const command: DashboardCommand = {
      type: 'TAB_CHANGE',
      payload: { tab },
      confidence: 1.0
    };
    handleChatCommand(command);
  }, [handleChatCommand]);

  const generateRandomStats = useCallback(() => {
    return {
      visitors: Math.floor(Math.random() * 1000) + 2500,
      conversions: Math.floor(Math.random() * 50) + 100,
      revenue: Math.floor(Math.random() * 20000) + 40000,
      campaigns: Math.floor(Math.random() * 5) + 5
    };
  }, []);

  const generateChartData = useCallback(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'][i],
      value: Math.floor(Math.random() * 100) + 20
    }));
  }, []);

  const getTabDisplayName = useCallback((tab: string) => {
    const tabNames: Record<string, string> = {
      strategic: 'التبويب الاستراتيجي',
      monitor: 'وسائل التواصل الاجتماعي',
      executor: 'الحملات الإعلانية',
      creative: 'المحتوى الإبداعي',
      analyst: 'التحليلات'
    };
    return tabNames[tab] || tab;
  }, []);

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

  const undoLastCommand = useCallback(() => {
    if (dashboardState.commandHistory.length > 0) {
      const history = [...dashboardState.commandHistory];
      history.pop(); // Remove last command
      
      setDashboardState(prev => ({
        ...prev,
        commandHistory: history,
        lastCommandExecuted: history[history.length - 1] || undefined
      }));
      
      toast.info('تم التراجع عن آخر أمر');
    }
  }, [dashboardState.commandHistory]);

  return {
    dashboardState,
    formattedStats,
    handleChatCommand,
    updateActiveTab,
    undoLastCommand,
    commandHistory: dashboardState.commandHistory,
    lastCommand: dashboardState.lastCommandExecuted
  };
};
