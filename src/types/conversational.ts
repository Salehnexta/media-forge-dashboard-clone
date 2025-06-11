
export interface DashboardComponent {
  id: string;
  type: 'metrics_cards' | 'line_chart' | 'bar_chart' | 'pie_chart' | 'area_chart' | 'table_view' | 'gauge_chart' | 'heatmap';
  title: string;
  data: any;
  config: ChartConfig;
  position: {
    row: number;
    col: number;
    span: number;
  };
}

export interface DashboardConfig {
  id: string;
  title: string;
  layout: 'single' | 'grid-2x2' | 'grid-3x1' | 'grid-2x3' | 'custom';
  components: DashboardComponent[];
  insights: string[];
  actions: Array<{
    label: string;
    command: string;
    type: 'primary' | 'secondary';
  }>;
  generatedAt: Date;
}

export interface ConversationMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  dashboard?: DashboardConfig;
  loading?: boolean;
}

export interface ChartConfig {
  colors?: string[];
  theme?: 'light' | 'dark';
  showLegend?: boolean;
  showGrid?: boolean;
  responsive?: boolean;
  animation?: boolean;
  rtl?: boolean;
}

export interface MetricCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}
