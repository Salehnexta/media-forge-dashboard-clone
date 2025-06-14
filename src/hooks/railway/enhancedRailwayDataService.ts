
import { supabase } from '@/integrations/supabase/client';
import { useClientManagement } from '@/hooks/useClientManagement';
import { useEnhancedMCPOperations } from '@/contexts/hooks/useEnhancedMCPOperations';
import { CompanyData } from '../useRailwayIntegration';

export const useEnhancedRailwayDataService = () => {
  const { getOrCreateClient } = useClientManagement();
  const { storeMemory, storeAgentPerformance, storeA2AMessage } = useEnhancedMCPOperations();

  const saveEnhancedAgentResults = async (
    agentType: string,
    companyData: CompanyData,
    result: any,
    estimatedTime: number,
    emotionalContext?: any
  ) => {
    try {
      const clientId = await getOrCreateClient();
      if (!clientId) {
        console.error('Failed to get client ID for enhanced data saving');
        return;
      }

      // Save to agent_results table
      const { error: agentError } = await supabase
        .from('agent_results')
        .insert({
          agent_id: agentType,
          task_type: agentType.startsWith('M') ? 'agent_execution' : 'crew_execution',
          input_data: companyData as any,
          output_data: result as any,
          status: 'completed',
          execution_time_ms: estimatedTime,
          user_id: clientId, // Now using proper UUID
          chart_configs: result?.chart_configs || {}
        });

      if (agentError) {
        console.error('Error saving to agent_results:', agentError);
        return;
      }

      // Store enhanced memory with emotional context
      await storeMemory(
        agentType,
        'analysis',
        {
          company_data: companyData,
          analysis_result: result,
          execution_time: estimatedTime,
          emotional_context: emotionalContext
        },
        {
          tags: ['analysis', 'company', agentType.toLowerCase()],
          expiresIn: 30 * 24 * 60 * 60 * 1000 // 30 days
        }
      );

      // Store performance metrics with emotional impact
      await storeAgentPerformance(
        agentType,
        'analysis_execution',
        true,
        estimatedTime,
        result?.tokens_used,
        emotionalContext?.impact_score
      );

      // Save to content_sources_data for compatibility
      await saveToContentSources(agentType, result, clientId);

      console.log(`✅ Enhanced agent results saved for ${agentType}`);
    } catch (error) {
      console.error('Error saving enhanced agent results:', error);
    }
  };

  const saveToContentSources = async (
    agentType: string,
    result: any,
    clientId: string
  ) => {
    try {
      const sourceType = `${agentType.toLowerCase()}_analysis`;
      
      await supabase
        .from('content_sources_data')
        .insert({
          client_id: clientId,
          source_type: sourceType,
          data: {
            agent_type: agentType,
            analysis_result: result,
            timestamp: new Date().toISOString(),
            processed: true,
            enhanced: true // Mark as enhanced version
          }
        });
    } catch (error) {
      console.error(`Error saving ${agentType} data to content sources:`, error);
    }
  };

  const saveA2AInteraction = async (
    fromAgent: string,
    toAgent: string,
    taskType: string,
    payload: any,
    emotionalContext?: any
  ) => {
    try {
      await storeA2AMessage(
        fromAgent,
        toAgent,
        taskType,
        payload,
        { timestamp: new Date().toISOString() },
        emotionalContext
      );
      
      console.log(`✅ A2A interaction saved: ${fromAgent} → ${toAgent}`);
    } catch (error) {
      console.error('Error saving A2A interaction:', error);
    }
  };

  return {
    saveEnhancedAgentResults,
    saveA2AInteraction
  };
};
