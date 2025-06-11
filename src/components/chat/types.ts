
import { AIManager } from '@/types/morvo';

export interface ContextualResponse {
  text: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
  shareWithAgents?: AIManager[];
  stepData?: {
    step: number;
    field: string;
    options: string[];
  };
}

export interface SmartSuggestion {
  question: string;
  category: 'analysis' | 'chart' | 'strategy' | 'action';
  icon?: React.ReactNode;
}

export interface QuickChartCommand {
  command: string;
  description: string;
  iconName: string;
}

export interface ChatWidgetProps {
  className?: string;
}
