
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useClientManagement } from '@/hooks/useClientManagement';
import { AgentMemory, MemoryType, StoreMemoryOptions } from '../types/mcpTypes';
import type { AgentId } from '@/config/environment';

export const useEnhancedMCPOperations = () => {
  const { getOrCreateClient } = useClientManagement();

  // Enhanced memory storage with proper UUID client handling
  const storeMemory = async (
    agentType: string,
    memoryType: MemoryType,
    content: Record<string, any>,
    options?: StoreMemoryOptions
  ) => {
    try {
      const clientId = await getOrCreateClient();
      if (!clientId) {
        throw new Error('فشل في الحصول على معرف العميل');
      }

      const expiresAt = options?.expiresIn 
        ? new Date(Date.now() + options.expiresIn).toISOString()
        : undefined;

      const enhancedContent = {
        ...content,
        tags: options?.tags || [],
        related_memories: options?.relatedMemories || [],
        agent_id: options?.agentId || agentType,
        timestamp: new Date().toISOString(),
        memory_type: memoryType,
        agent_type: agentType,
        relevance_score: 1.0,
        expires_at: expiresAt
      };

      // Store in agent_memory table with proper UUID client_id
      const { error } = await supabase
        .from('agent_memory')
        .insert({
          client_id: clientId,
          agent_id: agentType,
          memory_type: memoryType,
          content: enhancedContent,
          importance_score: 1.0,
          expires_at: expiresAt,
          metadata: {
            tags: options?.tags || [],
            related_memories: options?.relatedMemories || []
          }
        });

      if (error) throw error;
      
      console.log(`✅ Agent memory stored successfully for ${agentType}`);
      toast.success(`تم حفظ ذاكرة ${agentType} بنجاح`);
    } catch (error: any) {
      console.error('خطأ في حفظ الذاكرة:', error);
      toast.error(error.message || 'خطأ في حفظ ذاكرة الوكيل');
    }
  };

  // Enhanced memory retrieval with proper client handling
  const retrieveMemory = async (
    agentType: string, 
    memoryType?: MemoryType, 
    agentId?: AgentId
  ): Promise<AgentMemory[]> => {
    try {
      const clientId = await getOrCreateClient();
      if (!clientId) return [];

      let query = supabase
        .from('agent_memory')
        .select('*')
        .eq('client_id', clientId)
        .eq('agent_id', agentType)
        .order('timestamp', { ascending: false });

      if (memoryType) {
        query = query.eq('memory_type', memoryType);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      const memories: AgentMemory[] = (data || []).map((row: any) => ({
        id: row.id,
        agent_type: row.agent_id,
        agent_id: row.agent_id as AgentId,
        memory_type: row.memory_type as MemoryType,
        content: row.content || {},
        created_at: row.created_at,
        expires_at: row.expires_at || undefined,
        relevance_score: Number(row.importance_score || 1.0),
        tags: row.metadata?.tags || [],
        related_memories: row.metadata?.related_memories || []
      }));

      return memories;
    } catch (error) {
      console.error('خطأ في استرجاع الذاكرة:', error);
      return [];
    }
  };

  // Store emotional context using content_sources_data instead of missing table
  const storeEmotionalContext = async (
    emotion: string,
    confidence: number,
    contextData: Record<string, any>,
    conversationId?: string
  ) => {
    try {
      const clientId = await getOrCreateClient();
      if (!clientId) return;

      const { error } = await supabase
        .from('content_sources_data')
        .insert({
          client_id: clientId,
          source_type: 'emotional_context',
          data: {
            primary_emotion: emotion,
            confidence,
            context_data: contextData,
            conversation_id: conversationId,
            timestamp: new Date().toISOString()
          }
        });

      if (error) throw error;
      console.log('✅ Emotional context stored successfully');
    } catch (error: any) {
      console.error('خطأ في حفظ السياق العاطفي:', error);
    }
  };

  // Enhanced A2A message storage using existing schema
  const storeA2AMessage = async (
    senderAgentId: string,
    recipientAgentId: string,
    taskType: string,
    payload: Record<string, any>,
    context?: Record<string, any>,
    emotionalContext?: Record<string, any>
  ) => {
    try {
      const clientId = await getOrCreateClient();
      if (!clientId) return;

      // Store emotional context in the context field instead of missing column
      const enhancedContext = {
        ...context,
        emotional_context: emotionalContext
      };

      const { error } = await supabase
        .from('a2a_messages')
        .insert({
          client_id: clientId,
          sender_agent_id: senderAgentId,
          recipient_agent_id: recipientAgentId,
          task_type: taskType,
          payload,
          context: enhancedContext,
          correlation_id: crypto.randomUUID(),
          status: 'sent'
        });

      if (error) throw error;
      console.log('✅ A2A message stored successfully');
    } catch (error: any) {
      console.error('خطأ في حفظ رسالة A2A:', error);
    }
  };

  // Store agent performance using existing schema
  const storeAgentPerformance = async (
    agentId: string,
    taskType: string,
    success: boolean,
    processingTimeMs: number,
    tokensUsed?: number,
    emotionalImpactScore?: number
  ) => {
    try {
      const clientId = await getOrCreateClient();
      if (!clientId) return;

      const { error } = await supabase
        .from('agent_performance')
        .insert({
          client_id: clientId,
          agent_id: agentId,
          task_type: taskType,
          success,
          processing_time_ms: processingTimeMs,
          tokens_used: tokensUsed,
          project_id: clientId // Using client_id as project_id for now
        });

      if (error) throw error;
      console.log('✅ Agent performance stored successfully');
    } catch (error: any) {
      console.error('خطأ في حفظ أداء الوكيل:', error);
    }
  };

  const clearMemory = async (agentType?: string, agentId?: AgentId) => {
    try {
      const clientId = await getOrCreateClient();
      if (!clientId) return;

      let query = supabase
        .from('agent_memory')
        .delete()
        .eq('client_id', clientId);

      if (agentType) {
        query = query.eq('agent_id', agentType);
      }

      const { error } = await query;
      if (error) throw error;

      toast.success('تم مسح الذاكرة بنجاح');
    } catch (error) {
      console.error('خطأ في مسح الذاكرة:', error);
      toast.error('خطأ في مسح ذاكرة الوكيل');
    }
  };

  return {
    storeMemory,
    retrieveMemory,
    storeEmotionalContext,
    storeA2AMessage,
    storeAgentPerformance,
    clearMemory
  };
};
