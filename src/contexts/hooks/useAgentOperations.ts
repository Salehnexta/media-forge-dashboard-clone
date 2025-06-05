
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { environment, agentIdMap } from '@/config/environment';
import { AgentMemory, MemoryType, CrossAgentContext } from '../types/mcpTypes';
import type { AgentId } from '@/config/environment';

export const useAgentOperations = (
  crossAgentContext: CrossAgentContext,
  setCrossAgentContext: (context: CrossAgentContext) => void,
  retrieveMemory: (agentType: string, memoryType?: MemoryType, agentId?: AgentId) => Promise<AgentMemory[]>,
  agentMemories: AgentMemory[]
) => {
  // Get memories specific to an agent (M1-M5)
  const getAgentSpecificMemory = async (agentId: AgentId, memoryType?: MemoryType): Promise<AgentMemory[]> => {
    const agentType = agentIdMap[agentId];
    return retrieveMemory(agentType, memoryType, agentId);
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

  return {
    getAgentSpecificMemory,
    shareInsightBetweenAgents,
    getCollaborationHistory,
    initiateCollaboration,
    shareContext,
    getMemoryInsights,
    generateCrossAgentReport
  };
};
