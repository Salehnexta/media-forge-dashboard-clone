
import { Database } from '@/integrations/supabase/types';
import { AgentId, AgentType } from '@/config/environment';

// Using content_sources_data instead of non-existent tables
export type ContentSourcesRow = Database['public']['Tables']['content_sources_data']['Row'];

// Enhanced memory types for specialized agents
export type MemoryType = 
  | 'analysis' | 'insight' | 'context' | 'preference'
  | 'strategic' | 'social' | 'campaign' | 'content' | 'analytics'
  | 'market_research' | 'competitor_analysis' | 'audience_insight'
  | 'performance_data' | 'optimization_result';

export interface AgentMemory {
  id: string;
  agent_type: string;
  agent_id?: AgentId; // M1, M2, M3, M4, M5
  memory_type: MemoryType;
  content: Record<string, any>;
  company_id?: string;
  created_at: string;
  expires_at?: string;
  relevance_score: number;
  tags?: string[]; // For better categorization
  related_memories?: string[]; // IDs of related memories
}

export interface CrossAgentContext {
  shared_insights: Record<string, any>;
  collaboration_history: any[];
  contextual_data: Record<string, any>;
  agent_interactions: Record<string, any>; // Track M1-M5 interactions
  cross_pollination: Record<string, any>; // Knowledge sharing between agents
}

// Specialized context for each agent type
export interface AgentSpecificContext {
  M1: { // Strategic Marketing Agent
    market_analysis: any;
    competitor_insights: any;
    strategic_recommendations: any;
    goal_tracking: any;
  };
  M2: { // Social Media Agent
    platform_performance: any;
    audience_insights: any;
    content_calendar: any;
    engagement_patterns: any;
  };
  M3: { // Campaign Optimization Agent
    campaign_performance: any;
    optimization_results: any;
    ab_test_data: any;
    budget_allocation: any;
  };
  M4: { // Content Creation Agent
    content_library: any;
    performance_analytics: any;
    creative_brief: any;
    brand_guidelines: any;
  };
  M5: { // Data Analytics Agent
    performance_metrics: any;
    predictive_models: any;
    reporting_data: any;
    insights_generated: any;
  };
}

export interface StoreMemoryOptions {
  agentId?: AgentId;
  tags?: string[];
  relatedMemories?: string[];
  expiresIn?: number;
}

export interface MCPContextType {
  agentMemories: AgentMemory[];
  crossAgentContext: CrossAgentContext;
  agentSpecificContext: AgentSpecificContext;
  isLoading: boolean;
  
  // Enhanced memory management
  storeMemory: (agentType: string, memoryType: MemoryType, content: Record<string, any>, options?: StoreMemoryOptions) => Promise<void>;
  retrieveMemory: (agentType: string, memoryType?: MemoryType, agentId?: AgentId) => Promise<AgentMemory[]>;
  
  // Agent-specific methods
  getAgentSpecificMemory: (agentId: AgentId, memoryType?: MemoryType) => Promise<AgentMemory[]>;
  shareInsightBetweenAgents: (fromAgent: AgentId, toAgent: AgentId, insight: any, context?: any) => Promise<void>;
  getCollaborationHistory: (agentId?: AgentId) => any[];
  
  // Cross-agent collaboration
  shareContext: (fromAgent: string, toAgent: string, context: any) => Promise<void>;
  initiateCollaboration: (initiatorAgent: AgentId, targetAgents: AgentId[], task: any) => Promise<void>;
  
  // Memory optimization
  clearMemory: (agentType?: string, agentId?: AgentId) => Promise<void>;
  updateRelevanceScore: (memoryId: string, score: number) => Promise<void>;
  optimizeMemoryStorage: (agentId?: AgentId) => Promise<void>;
  
  // Analytics and insights
  getMemoryInsights: (agentId?: AgentId) => Promise<any>;
  generateCrossAgentReport: () => Promise<any>;
}
