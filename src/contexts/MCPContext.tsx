import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { environment, AgentId, AgentType, agentIdMap, agentTypeMap } from '@/config/environment';

type AgentMemoryRow = Database['public']['Tables']['agent_memories']['Row'];
type CrossAgentContextRow = Database['public']['Tables']['cross_agent_context']['Row'];

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

interface MCPContextType {
  agentMemories: AgentMemory[];
  crossAgentContext: CrossAgentContext;
  agentSpecificContext: AgentSpecificContext;
  isLoading: boolean;
  
  // Enhanced memory management
  storeMemory: (agentType: string, memoryType: MemoryType, content: Record<string, any>, options?: {
    agentId?: AgentId;
    tags?: string[];
    relatedMemories?: string[];
    expiresIn?: number;
  }) => Promise<void>;
  
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

  // Enhanced memory storage with agent-specific features
  const storeMemory = async (
    agentType: string, 
    memoryType: MemoryType, 
    content: Record<string, any>,
    options?: {
      agentId?: AgentId;
      tags?: string[];
      relatedMemories?: string[];
      expiresIn?: number;
    }
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('المستخدم غير مصرح له');

      const expiresAt = options?.expiresIn 
        ? new Date(Date.now() + options.expiresIn).toISOString()
        : undefined;

      const enhancedContent = {
        ...content,
        tags: options?.tags || [],
        related_memories: options?.relatedMemories || [],
        agent_id: options?.agentId || agentTypeMap[agentType as AgentType],
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from('agent_memories')
        .insert({
          user_id: user.id,
          agent_type: agentType,
          memory_type: memoryType,
          content: enhancedContent,
          relevance_score: 1.0,
          expires_at: expiresAt
        });

      if (error) throw error;
      await loadAgentMemories();
      toast.success(`تم حفظ ذاكرة ${environment.agents[options?.agentId || 'M1'].name} بنجاح`);
    } catch (error: any) {
      console.error('خطأ في حفظ الذاكرة:', error);
      toast.error(error.message || 'خطأ في حفظ ذاكرة الوكيل');
    }
  };

  // Get memories specific to an agent (M1-M5)
  const getAgentSpecificMemory = async (agentId: AgentId, memoryType?: MemoryType): Promise<AgentMemory[]> => {
    const agentType = agentIdMap[agentId];
    return retrieveMemory(agentType, memoryType, agentId);
  };

  // Enhanced memory retrieval with agent filtering
  const retrieveMemory = async (agentType: string, memoryType?: MemoryType, agentId?: AgentId): Promise<AgentMemory[]> => {
    try {
      let query = supabase
        .from('agent_memories')
        .select('*')
        .eq('agent_type', agentType)
        .order('relevance_score', { ascending: false });

      if (memoryType) {
        query = query.eq('memory_type', memoryType);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      let memories: AgentMemory[] = (data || []).map((row: AgentMemoryRow) => ({
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

      // Filter by agent ID if specified
      if (agentId) {
        memories = memories.filter(memory => memory.agent_id === agentId);
      }
      
      return memories;
    } catch (error) {
      console.error('خطأ في استرجاع الذاكرة:', error);
      return [];
    }
  };

  // Share insights between specific agents (M1-M5)
  const shareInsightBetweenAgents = async (fromAgent: AgentId, toAgent: AgentId, insight: any, context?: any) => {
    try {
      const collaboration = {
        from_agent: fromAgent,
        to_agent: toAgent,
        insight,
        context: context || {},
        timestamp: new Date().toISOString(),
        collaboration_type: 'insight_sharing'
      };

      const newContext = {
        ...crossAgentContext,
        collaboration_history: [...crossAgentContext.collaboration_history, collaboration],
        agent_interactions: {
          ...crossAgentContext.agent_interactions,
          [`${fromAgent}_to_${toAgent}`]: {
            last_interaction: new Date().toISOString(),
            interaction_count: (crossAgentContext.agent_interactions[`${fromAgent}_to_${toAgent}`]?.interaction_count || 0) + 1,
            latest_insight: insight
          }
        },
        cross_pollination: {
          ...crossAgentContext.cross_pollination,
          [toAgent]: {
            ...crossAgentContext.cross_pollination[toAgent],
            [fromAgent]: insight
          }
        }
      };

      setCrossAgentContext(newContext);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('cross_agent_context')
        .upsert({
          user_id: user.id,
          context_data: newContext
        });

      toast.success(`تم مشاركة الرؤية من ${environment.agents[fromAgent].name} إلى ${environment.agents[toAgent].name}`);
    } catch (error) {
      console.error('خطأ في مشاركة الرؤية:', error);
      toast.error('خطأ في مشاركة الرؤية بين الوكلاء');
    }
  };

  // Get collaboration history for specific agent
  const getCollaborationHistory = (agentId?: AgentId) => {
    if (!agentId) return crossAgentContext.collaboration_history;
    
    return crossAgentContext.collaboration_history.filter(
      (collab: any) => collab.from_agent === agentId || collab.to_agent === agentId
    );
  };

  // Initiate collaboration between multiple agents
  const initiateCollaboration = async (initiatorAgent: AgentId, targetAgents: AgentId[], task: any) => {
    try {
      const collaboration = {
        type: 'multi_agent_collaboration',
        initiator: initiatorAgent,
        participants: [initiatorAgent, ...targetAgents],
        task,
        status: 'initiated',
        timestamp: new Date().toISOString()
      };

      const newContext = {
        ...crossAgentContext,
        collaboration_history: [...crossAgentContext.collaboration_history, collaboration]
      };

      setCrossAgentContext(newContext);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('cross_agent_context')
          .upsert({
            user_id: user.id,
            context_data: newContext
          });
      }

      toast.success(`تم بدء تعاون بين ${targetAgents.length + 1} وكلاء`);
    } catch (error) {
      console.error('خطأ في بدء التعاون:', error);
      toast.error('خطأ في بدء التعاون بين الوكلاء');
    }
  };

  // ... keep existing code (shareContext, clearMemory, updateRelevanceScore methods)

  const shareContext = async (fromAgent: string, toAgent: string, context: any) => {
    try {
      const newContext = {
        ...crossAgentContext,
        collaboration_history: [
          ...crossAgentContext.collaboration_history,
          {
            from_agent: fromAgent,
            to_agent: toAgent,
            context,
            timestamp: new Date().toISOString()
          }
        ],
        shared_insights: {
          ...crossAgentContext.shared_insights,
          [`${fromAgent}_to_${toAgent}`]: context
        }
      };

      setCrossAgentContext(newContext);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('cross_agent_context')
        .upsert({
          user_id: user.id,
          context_data: newContext
        });

      toast.success('تم مشاركة السياق بين الوكلاء');
    } catch (error) {
      console.error('خطأ في مشاركة السياق:', error);
      toast.error('خطأ في مشاركة السياق بين الوكلاء');
    }
  };

  const clearMemory = async (agentType?: string, agentId?: AgentId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase.from('agent_memories').delete().eq('user_id', user.id);
      
      if (agentType) {
        query = query.eq('agent_type', agentType);
      }

      const { error } = await query;
      if (error) throw error;

      await loadAgentMemories();
      toast.success('تم مسح الذاكرة بنجاح');
    } catch (error) {
      console.error('خطأ في مسح الذاكرة:', error);
      toast.error('خطأ في مسح ذاكرة الوكيل');
    }
  };

  const updateRelevanceScore = async (memoryId: string, score: number) => {
    try {
      const { error } = await supabase
        .from('agent_memories')
        .update({ relevance_score: score })
        .eq('id', memoryId);

      if (error) throw error;
      await loadAgentMemories();
    } catch (error) {
      console.error('خطأ في تحديث درجة الصلة:', error);
    }
  };

  // New methods for enhanced functionality
  const optimizeMemoryStorage = async (agentId?: AgentId) => {
    try {
      // Remove expired memories and low relevance ones
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('agent_memories')
        .delete()
        .eq('user_id', user.id)
        .or('expires_at.lt.now(),relevance_score.lt.0.3');

      if (agentId) {
        const agentType = agentIdMap[agentId];
        query = query.eq('agent_type', agentType);
      }

      await query;
      await loadAgentMemories();
      toast.success('تم تحسين تخزين الذاكرة');
    } catch (error) {
      console.error('خطأ في تحسين الذاكرة:', error);
    }
  };

  const getMemoryInsights = async (agentId?: AgentId) => {
    const memories = agentId 
      ? await getAgentSpecificMemory(agentId)
      : agentMemories;

    return {
      total_memories: memories.length,
      memory_types: [...new Set(memories.map(m => m.memory_type))],
      average_relevance: memories.reduce((acc, m) => acc + m.relevance_score, 0) / memories.length,
      recent_activity: memories.filter(m => 
        new Date(m.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      top_tags: memories.flatMap(m => m.tags || [])
        .reduce((acc: any, tag: string) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {})
    };
  };

  const generateCrossAgentReport = async () => {
    const insights = await Promise.all(
      Object.keys(environment.agents).map(agentId => 
        getMemoryInsights(agentId as AgentId)
      )
    );

    return {
      agent_insights: insights,
      collaboration_stats: {
        total_collaborations: crossAgentContext.collaboration_history.length,
        active_interactions: Object.keys(crossAgentContext.agent_interactions).length,
        knowledge_shared: Object.keys(crossAgentContext.cross_pollination).length
      },
      system_health: {
        memory_efficiency: insights.reduce((acc, insight) => acc + insight.average_relevance, 0) / insights.length,
        activity_level: insights.reduce((acc, insight) => acc + insight.recent_activity, 0)
      }
    };
  };

  return (
    <MCPContext.Provider value={{
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
    }}>
      {children}
    </MCPContext.Provider>
  );
};
