
export interface DashboardCommand {
  type: 'TAB_CHANGE' | 'DATA_REFRESH' | 'CHART_CREATE' | 'FILTER_APPLY' | 'WIDGET_UPDATE' | 'STATS_UPDATE';
  payload: any;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  manager?: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
}
