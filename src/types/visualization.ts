
export interface ChartConfig {
  type: 'quadrant' | 'radar' | 'line' | 'donut' | 'stackedBar' | 'column' | 'funnel' | 'timeline' | 'bullet' | 'forecast' | 'cluster' | 'treemap' | 'sankey' | 'network' | 'heatmap' | 'bubble';
  title: string;
  data?: any[];
  options?: Record<string, any>;
  theme?: 'light' | 'dark';
  rtl?: boolean;
}

export interface VisualizationPreference {
  id: string;
  user_id: string;
  chart_type: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DashboardLayout {
  id: string;
  user_id: string;
  company_id?: string;
  layout_name: string;
  layout_config: Record<string, any>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChartTemplate {
  id: string;
  template_name: string;
  agent_type: string;
  chart_config: ChartConfig;
  is_system_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitorData {
  name: string;
  metrics: Record<string, number>;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface EngagementMetrics {
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
}
