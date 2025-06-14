
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  agentsInvolved?: string[];
  processingTime?: number;
  costTracking?: {
    total_cost: number;
    tokens_used: number;
  };
  conversationId: string;
  isError?: boolean;
  isRetrying?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: Date;
  error?: string;
}

export interface ConversationStats {
  totalMessages: number;
  totalCost: number;
  totalTokens: number;
  averageProcessingTime: number;
}
