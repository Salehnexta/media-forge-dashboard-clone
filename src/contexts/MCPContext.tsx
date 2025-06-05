
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { environment, agentTypeMap } from '@/config/environment';
import { 
  AgentMemory, 
  CrossAgentContext, 
  AgentSpecificContext, 
  MCPContextType,
  AgentMemoryRow,
  MemoryType
} from './types/mcpTypes';
import { useMCPOperations } from './hooks/useMCPOperations';
import { useAgentOperations } from './hooks/useAgentOperations';
import type { AgentType } from '@/config/environment';

const MCPContext = createContext<MCPContextType | undefined>(undefined);

export const useMCPContext = () => {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error('useMCPContext must be used within MCPProvider');
  }
  return context;
};

interface MCPProviderProps {
  children: ReactNode;
}

export const MCPProvider = ({ children }: MCPProviderProps) => {
  const [agentMemories, setAgentMemories] = useState<AgentMemory[]>([]);
  const [crossAgentContext, setCrossAgentContext] = useState<CrossAgentContext>({
    shared_insights: {},
    collaboration_history: [],
    contextual_data: {},
    agent_interactions: {},
    cross_pollination: {}
  });
  const [agentSpecificContext, setAgentSpecificContext] = useState<AgentSpecificContext>({
    M1: { market_analysis: {}, competitor_insights: {}, strategic_recommendations: {}, goal_tracking: {} },
    M2: { platform_performance: {}, audience_insights: {}, content_calendar: {}, engagement_patterns: {} },
    M3: { campaign_performance: {}, optimization_results: {}, ab_test_data: {}, budget_allocation: {} },
    M4: { content_library: {}, performance_analytics: {}, creative_brief: {}, brand_guidelines: {} },
    M5: { performance_metrics: {}, predictive_models: {}, reporting_data: {}, insights_generated: {} }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize operations hooks
  const mcpOps = useMCPOperations();
  const agentOps = useAgentOperations(crossAgentContext, setCrossAgentContext, mcpOps.retrieveMemory, agentMemories);

  useEffect(() => {
    if (environment.mcpEnabled) {
      loadAgentMemories();
      loadCrossAgentContext();
    }
  }, []);

  const loadAgentMemories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('agent_memories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const memories: AgentMemory[] = (data || []).map((row: AgentMemoryRow) => ({
        id: row.id,
        agent_type: row.agent_type,
        agent_id: agentTypeMap[row.agent_type as AgentType],
        memory_type: row.memory_type as MemoryType,
        content: (row.content as Record<string, any>) || {},
        company_id: row.company_id || undefined,
        created_at: row.created_at,
        expires_at: row.expires_at || undefined,
        relevance_score: Number(row.relevance_score),
        tags: (row.content as any)?.tags || [],
        related_memories: (row.content as any)?.related_memories || []
      }));
      
      setAgentMemories(memories);
    } catch (error) {
      console.error('خطأ في تحميل ذاكرة الوكلاء:', error);
    }
  };

  const loadCrossAgentContext = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('cross_agent_context')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        const contextData = data.context_data as Record<string, any>;
        setCrossAgentContext({
          shared_insights: contextData.shared_insights || {},
          collaboration_history: contextData.collaboration_history || [],
          contextual_data: contextData.contextual_data || {},
          agent_interactions: contextData.agent_interactions || {},
          cross_pollination: contextData.cross_pollination || {}
        });
      }
    } catch (error) {
      console.error('خطأ في تحميل السياق المشترك:', error);
    }
  };

  // Enhanced store memory with reload
  const storeMemory = async (
    agentType: string, 
    memoryType: MemoryType, 
    content: Record<string, any>,
    options?: any
  ) => {
    await mcpOps.storeMemory(agentType, memoryType, content, options);
    await loadAgentMemories();
  };

  // Enhanced clear memory with reload
  const clearMemory = async (agentType?: string, agentId?: any) => {
    await mcpOps.clearMemory(agentType, agentId);
    await loadAgentMemories();
  };

  // Enhanced update relevance with reload
  const updateRelevanceScore = async (memoryId: string, score: number) => {
    await mcpOps.updateRelevanceScore(memoryId, score);
    await loadAgentMemories();
  };

  return (
    <MCPContext.Provider value={{
      agentMemories,
      crossAgentContext,
      agentSpecificContext,
      isLoading,
      storeMemory,
      retrieveMemory: mcpOps.retrieveMemory,
      getAgentSpecificMemory: agentOps.getAgentSpecificMemory,
      shareInsightBetweenAgents: agentOps.shareInsightBetweenAgents,
      getCollaborationHistory: agentOps.getCollaborationHistory,
      shareContext: agentOps.shareContext,
      initiateCollaboration: agentOps.initiateCollaboration,
      clearMemory,
      updateRelevanceScore,
      optimizeMemoryStorage: mcpOps.optimizeMemoryStorage,
      getMemoryInsights: agentOps.getMemoryInsights,
      generateCrossAgentReport: agentOps.generateCrossAgentReport
    }}>
      {children}
    </MCPContext.Provider>
  );
};

// Re-export types for backward compatibility
export type { MemoryType, AgentMemory } from './types/mcpTypes';
