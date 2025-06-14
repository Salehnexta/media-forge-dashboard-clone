
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AgentContext {
  user_id: string;
  context_data: Record<string, any>;
  agent_id: string;
  timestamp: string;
}

export const useAgentOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeAgentContext = useCallback(async (context: Omit<AgentContext, 'timestamp'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Store in content_sources_data table instead of cross_agent_context
      const { error: insertError } = await supabase
        .from('content_sources_data')
        .insert({
          client_id: context.user_id, // Using user_id as client_id
          source_type: 'agent_context',
          data: {
            agent_id: context.agent_id,
            context_data: context.context_data,
            timestamp: new Date().toISOString()
          }
        });

      if (insertError) throw insertError;
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to store agent context';
      setError(errorMessage);
      console.error('Error storing agent context:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getAgentContext = useCallback(async (userId: string, agentId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('content_sources_data')
        .select('*')
        .eq('client_id', userId)
        .eq('source_type', 'agent_context')
        .order('timestamp', { ascending: false });

      if (agentId) {
        // Filter by agent_id in the data field (this is a simplified approach)
        query = query.contains('data', { agent_id: agentId });
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      
      return { success: true, data: data || [] };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch agent context';
      setError(errorMessage);
      console.error('Error fetching agent context:', err);
      return { success: false, error: errorMessage, data: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAgentContext = useCallback(async (
    userId: string, 
    agentId: string, 
    contextData: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update existing context in content_sources_data
      const { error: updateError } = await supabase
        .from('content_sources_data')
        .update({
          data: {
            agent_id: agentId,
            context_data: contextData,
            timestamp: new Date().toISOString()
          }
        })
        .eq('client_id', userId)
        .eq('source_type', 'agent_context')
        .contains('data', { agent_id: agentId });

      if (updateError) throw updateError;
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update agent context';
      setError(errorMessage);
      console.error('Error updating agent context:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAgentContext = useCallback(async (userId: string, agentId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('content_sources_data')
        .delete()
        .eq('client_id', userId)
        .eq('source_type', 'agent_context');

      if (agentId) {
        query = query.contains('data', { agent_id: agentId });
      }

      const { error: deleteError } = await query;

      if (deleteError) throw deleteError;
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to clear agent context';
      setError(errorMessage);
      console.error('Error clearing agent context:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    storeAgentContext,
    getAgentContext,
    updateAgentContext,
    clearAgentContext
  };
};
