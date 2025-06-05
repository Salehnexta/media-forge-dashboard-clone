
import { useMCPContext } from '@/contexts/MCPContext';
import { useCallback } from 'react';

export const useCrossAgentContext = () => {
  const { crossAgentContext } = useMCPContext();

  const getSharedInsights = useCallback((agentType: string) => {
    const insights = [];
    for (const [key, value] of Object.entries(crossAgentContext.shared_insights)) {
      if (key.includes(agentType)) {
        insights.push({
          fromAgent: key.split('_to_')[0],
          toAgent: key.split('_to_')[1],
          data: value
        });
      }
    }
    return insights;
  }, [crossAgentContext.shared_insights]);

  const collaborationHistory = crossAgentContext.collaboration_history;

  return {
    getSharedInsights,
    collaborationHistory
  };
};
