
import { useState, useCallback, useEffect } from 'react';
import { useMCPContext } from '@/contexts/MCPContext';

export const useCrossAgentContext = () => {
  const { crossAgentContext, shareContext } = useMCPContext();
  const [collaborationHistory, setCollaborationHistory] = useState<any[]>([]);

  useEffect(() => {
    setCollaborationHistory(crossAgentContext.collaboration_history || []);
  }, [crossAgentContext]);

  const shareInsight = useCallback(async (
    fromAgent: string,
    toAgent: string,
    insight: any
  ) => {
    await shareContext(fromAgent, toAgent, {
      type: 'insight',
      data: insight,
      timestamp: new Date().toISOString()
    });
  }, [shareContext]);

  const shareAnalysis = useCallback(async (
    fromAgent: string,
    toAgent: string,
    analysis: any
  ) => {
    await shareContext(fromAgent, toAgent, {
      type: 'analysis',
      data: analysis,
      timestamp: new Date().toISOString()
    });
  }, [shareContext]);

  const getSharedInsights = useCallback((targetAgent: string) => {
    const insights: any[] = [];
    
    Object.entries(crossAgentContext.shared_insights || {}).forEach(([key, value]) => {
      if (key.endsWith(`_to_${targetAgent}`)) {
        insights.push({
          fromAgent: key.split('_to_')[0],
          data: value,
          key
        });
      }
    });
    
    return insights;
  }, [crossAgentContext.shared_insights]);

  const getCollaborationWith = useCallback((agentA: string, agentB: string) => {
    return collaborationHistory.filter(collab => 
      (collab.from_agent === agentA && collab.to_agent === agentB) ||
      (collab.from_agent === agentB && collab.to_agent === agentA)
    );
  }, [collaborationHistory]);

  const getAgentInteractions = useCallback((agentType: string) => {
    return collaborationHistory.filter(collab => 
      collab.from_agent === agentType || collab.to_agent === agentType
    );
  }, [collaborationHistory]);

  return {
    crossAgentContext,
    collaborationHistory,
    shareInsight,
    shareAnalysis,
    getSharedInsights,
    getCollaborationWith,
    getAgentInteractions
  };
};
