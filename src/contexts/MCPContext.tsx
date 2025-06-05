import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AgentId } from '@/config/environment';

export interface AgentMemory {
  id: string;
  agent_type: string;
  agent_id?: AgentId;
  memory_type: MemoryType;
  content: Record<string, any>;
  created_at: string;
  relevance_score: number;
  tags?: string[];
  related_memories?: string[];
  expires_at?: string;
}

export type MemoryType = 'analysis' | 'insight' | 'context' | 'preference' | 'interaction' | 'learning';

export interface CrossAgentContext {
  shared_insights: Record<string, any>;
  collaboration_history: any[];
  contextual_data: Record<string, any>;
  agent_interactions: Record<string, any>;
  cross_pollination: Record<string, any>;
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
  agentSpecificContext: any;
  isLoading: boolean;
  storeMemory: (
    agentType: string, 
    memoryType: MemoryType, 
    content: Record<string, any>,
    options?: StoreMemoryOptions
  ) => Promise<void>;
  retrieveMemory: (
    agentType: string, 
    memoryType?: MemoryType, 
    agentId?: AgentId
  ) => Promise<AgentMemory[]>;
  getAgentSpecificMemory: (
    agentId: AgentId, 
    memoryType?: MemoryType
  ) => Promise<AgentMemory[]>;
  shareInsightBetweenAgents: (
    fromAgent: AgentId, 
    toAgent: AgentId, 
    insight: any, 
    context?: any
  ) => Promise<void>;
  getCollaborationHistory: (agentId?: AgentId) => any[];
  shareContext: (fromAgent: string, toAgent: string, context: any) => Promise<void>;
  initiateCollaboration: (
    initiatorAgent: AgentId, 
    targetAgents: AgentId[], 
    task: any
  ) => Promise<void>;
  clearMemory: (agentType?: string, agentId?: AgentId) => Promise<void>;
  updateRelevanceScore: (memoryId: string, score: number) => Promise<void>;
  optimizeMemoryStorage: (agentId?: AgentId) => Promise<void>;
  getMemoryInsights: (agentId?: AgentId) => Promise<any>;
  generateCrossAgentReport: () => Promise<any>;
}

const MCPContext = createContext<MCPContextType | null>(null);

interface MCPProviderProps {
  children: ReactNode;
}

export const MCPProvider: React.FC<MCPProviderProps> = ({ children }) => {
  const [agentMemories, setAgentMemories] = useState<AgentMemory[]>([]);
  const [crossAgentContext, setCrossAgentContext] = useState<CrossAgentContext>({
    shared_insights: {},
    collaboration_history: [],
    contextual_data: {},
    agent_interactions: {},
    cross_pollination: {}
  });
  const [agentSpecificContext, setAgentSpecificContext] = useState({
    M1: { market_analysis: {}, competitor_insights: {}, strategic_recommendations: {}, goal_tracking: {} },
    M2: { platform_performance: {}, audience_insights: {}, content_calendar: {}, engagement_patterns: {} },
    M3: { campaign_performance: {}, optimization_results: {}, ab_test_data: {}, budget_allocation: {} },
    M4: { content_library: {}, performance_analytics: {}, creative_brief: {}, brand_guidelines: {} },
    M5: { performance_metrics: {}, predictive_models: {}, reporting_data: {}, insights_generated: {} }
  });
  const [isLoading, setIsLoading] = useState(false);

  const storeMemory = async (
    agentType: string, 
    memoryType: MemoryType, 
    content: Record<string, any>,
    options: StoreMemoryOptions = {}
  ): Promise<void> => {
    try {
      setIsLoading(true);
      
      const newMemory: AgentMemory = {
        id: Date.now().toString(),
        agent_type: agentType,
        agent_id: options.agentId,
        memory_type: memoryType,
        content,
        created_at: new Date().toISOString(),
        relevance_score: 1.0,
        tags: options.tags,
        related_memories: options.relatedMemories,
        expires_at: options.expiresIn ? new Date(Date.now() + options.expiresIn).toISOString() : undefined
      };

      setAgentMemories(prev => [...prev, newMemory]);
      
    } catch (error) {
      console.error('Error storing memory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const retrieveMemory = async (
    agentType: string, 
    memoryType?: MemoryType, 
    agentId?: AgentId
  ): Promise<AgentMemory[]> => {
    try {
      setIsLoading(true);
      
      let filtered = agentMemories.filter(memory => memory.agent_type === agentType);
      
      if (memoryType) {
        filtered = filtered.filter(memory => memory.memory_type === memoryType);
      }
      
      if (agentId) {
        filtered = filtered.filter(memory => memory.agent_id === agentId);
      }
      
      return filtered;
      
    } catch (error) {
      console.error('Error retrieving memory:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentSpecificMemory = async (
    agentId: AgentId, 
    memoryType?: MemoryType
  ): Promise<AgentMemory[]> => {
    return retrieveMemory('agent', memoryType, agentId);
  };

  const shareInsightBetweenAgents = async (
    fromAgent: AgentId, 
    toAgent: AgentId, 
    insight: any, 
    context?: any
  ): Promise<void> => {
    try {
      const sharedInsight = {
        from: fromAgent,
        to: toAgent,
        insight,
        context,
        timestamp: new Date().toISOString()
      };

      setCrossAgentContext(prev => ({
        ...prev,
        collaboration_history: [...prev.collaboration_history, sharedInsight],
        agent_interactions: {
          ...prev.agent_interactions,
          [`${fromAgent}_${toAgent}`]: sharedInsight
        }
      }));
      
    } catch (error) {
      console.error('Error sharing insight:', error);
    }
  };

  const getCollaborationHistory = (agentId?: AgentId): any[] => {
    if (!agentId) return crossAgentContext.collaboration_history;
    
    return crossAgentContext.collaboration_history.filter(
      (item: any) => item.from === agentId || item.to === agentId
    );
  };

  const shareContext = async (fromAgent: string, toAgent: string, context: any): Promise<void> => {
    try {
      setCrossAgentContext(prev => ({
        ...prev,
        shared_insights: {
          ...prev.shared_insights,
          [`${fromAgent}_to_${toAgent}`]: context
        }
      }));
    } catch (error) {
      console.error('Error sharing context:', error);
    }
  };

  const initiateCollaboration = async (
    initiatorAgent: AgentId, 
    targetAgents: AgentId[], 
    task: any
  ): Promise<void> => {
    try {
      const collaboration = {
        initiator: initiatorAgent,
        targets: targetAgents,
        task,
        timestamp: new Date().toISOString(),
        status: 'initiated'
      };

      setCrossAgentContext(prev => ({
        ...prev,
        collaboration_history: [...prev.collaboration_history, collaboration]
      }));
      
    } catch (error) {
      console.error('Error initiating collaboration:', error);
    }
  };

  const clearMemory = async (agentType?: string, agentId?: AgentId): Promise<void> => {
    try {
      if (!agentType && !agentId) {
        setAgentMemories([]);
        return;
      }

      setAgentMemories(prev => 
        prev.filter(memory => {
          if (agentType && memory.agent_type !== agentType) return true;
          if (agentId && memory.agent_id !== agentId) return true;
          return false;
        })
      );
      
    } catch (error) {
      console.error('Error clearing memory:', error);
    }
  };

  const updateRelevanceScore = async (memoryId: string, score: number): Promise<void> => {
    try {
      setAgentMemories(prev => 
        prev.map(memory => 
          memory.id === memoryId 
            ? { ...memory, relevance_score: score }
            : memory
        )
      );
    } catch (error) {
      console.error('Error updating relevance score:', error);
    }
  };

  const optimizeMemoryStorage = async (agentId?: AgentId): Promise<void> => {
    try {
      // Remove expired memories
      const now = new Date().toISOString();
      setAgentMemories(prev => 
        prev.filter(memory => !memory.expires_at || memory.expires_at > now)
      );
    } catch (error) {
      console.error('Error optimizing memory storage:', error);
    }
  };

  const getMemoryInsights = async (agentId?: AgentId): Promise<any> => {
    try {
      const memories = agentId 
        ? agentMemories.filter(m => m.agent_id === agentId)
        : agentMemories;

      return {
        total_memories: memories.length,
        memory_types: [...new Set(memories.map(m => m.memory_type))],
        average_relevance: memories.reduce((sum, m) => sum + m.relevance_score, 0) / memories.length || 0,
        recent_activity: memories.filter(m => 
          new Date(m.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length
      };
    } catch (error) {
      console.error('Error getting memory insights:', error);
      return {};
    }
  };

  const generateCrossAgentReport = async (): Promise<any> => {
    try {
      return {
        collaboration_count: crossAgentContext.collaboration_history.length,
        active_agents: [...new Set(agentMemories.map(m => m.agent_id).filter(Boolean))],
        shared_insights_count: Object.keys(crossAgentContext.shared_insights).length,
        cross_pollination_score: Object.keys(crossAgentContext.cross_pollination).length
      };
    } catch (error) {
      console.error('Error generating cross-agent report:', error);
      return {};
    }
  };

  useEffect(() => {
    // Cleanup expired memories periodically
    const interval = setInterval(() => {
      optimizeMemoryStorage();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const value: MCPContextType = {
    agentMemories,
    crossAgentContext,
    agentSpecificContext,
    isLoading,
    storeMemory,
    retrieveMemory,
    getAgentSpecificMemory,
    shareInsightBetweenAgents,
    getCollaborationHistory,
    shareContext,
    initiateCollaboration,
    clearMemory,
    updateRelevanceScore,
    optimizeMemoryStorage,
    getMemoryInsights,
    generateCrossAgentReport
  };

  return (
    <MCPContext.Provider value={value}>
      {children}
    </MCPContext.Provider>
  );
};

export const useMCPContext = (): MCPContextType => {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error('useMCPContext must be used within an MCPProvider');
  }
  return context;
};
