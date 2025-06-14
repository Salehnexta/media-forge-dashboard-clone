
import { supabase } from '@/integrations/supabase/client';
import { CompanyData } from '../useRailwayIntegration';

export const saveAgentResults = async (
  agentType: string,
  companyData: CompanyData,
  result: any,
  estimatedTime: number
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Try to get company from companies table
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const companyId = company?.id;

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
        user_id: user.id,
        company_id: companyId,
        chart_configs: result?.chart_configs || {}
      });

    if (agentError) {
      console.error('Error saving to agent_results:', agentError);
      return;
    }

    // Save to specific tables based on agent type using content_sources_data
    await saveToContentSources(agentType, result, user.id);
  } catch (error) {
    console.error('Error saving enhanced results:', error);
  }
};

const saveToContentSources = async (
  agentType: string,
  result: any,
  userId: string
) => {
  try {
    const sourceType = `${agentType.toLowerCase()}_analysis`;
    
    await supabase
      .from('content_sources_data')
      .insert({
        client_id: userId,
        source_type: sourceType,
        data: {
          agent_type: agentType,
          analysis_result: result,
          timestamp: new Date().toISOString(),
          processed: true
        }
      });
  } catch (error) {
    console.error(`Error saving ${agentType} data to content sources:`, error);
  }
};
