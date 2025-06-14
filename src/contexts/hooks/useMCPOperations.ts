
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { environment, agentTypeMap, agentIdMap } from '@/config/environment';
import { AgentMemory, MemoryType, StoreMemoryOptions } from '../types/mcpTypes';
import type { AgentId } from '@/config/environment';

export const useMCPOperations = () => {
  // Enhanced memory storage with agent-specific features using agent_memory table
  const storeMemory = async (
    agentType: string, 
    memoryType: MemoryType, 
    content: Record<string, any>,
    options?: StoreMemoryOptions
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('المستخدم غير مصرح له');

      // Get client_id from clients table
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) {
        console.error('No client found for user');
        return;
      }

      const expiresAt = options?.expiresIn 
        ? new Date(Date.now() + options.expiresIn).toISOString()
        : undefined;

      const enhancedContent = {
        ...content,
        tags: options?.tags || [],
        related_memories: options?.relatedMemories || [],
        agent_id: options?.agentId || agentTypeMap[agentType as keyof typeof agentTypeMap],
        timestamp: new Date().toISOString(),
        memory_type: memoryType,
        agent_type: agentType,
        relevance_score: 1.0,
        expires_at: expiresAt
      };

      // Store in agent_memory table
      const { error } = await supabase
        .from('agent_memory')
        .insert({
          client_id: client.id,
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
      toast.success(`تم حفظ ذاكرة ${environment.agents[options?.agentId || 'M1'].name} بنجاح`);
    } catch (error: any) {
      console.error('خطأ في حفظ الذاكرة:', error);
      toast.error(error.message || 'خطأ في حفظ ذاكرة الوكيل');
    }
  };

  // Enhanced memory retrieval with agent filtering using agent_memory table
  const retrieveMemory = async (agentType: string, memoryType?: MemoryType, agentId?: AgentId): Promise<AgentMemory[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get client_id from clients table
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) return [];

      let query = supabase
        .from('agent_memory')
        .select('*')
        .eq('client_id', client.id)
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

  const clearMemory = async (agentType?: string, agentId?: AgentId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get client_id from clients table
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) return;

      let query = supabase
        .from('agent_memory')
        .delete()
        .eq('client_id', client.id);

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

  const updateRelevanceScore = async (memoryId: string, score: number) => {
    try {
      const { error } = await supabase
        .from('agent_memory')
        .update({ importance_score: score })
        .eq('id', memoryId);

      if (error) throw error;
    } catch (error) {
      console.error('خطأ في تحديث درجة الصلة:', error);
    }
  };

  const optimizeMemoryStorage = async (agentId?: AgentId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get client_id from clients table
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) return;

      // Remove expired memories
      const now = new Date().toISOString();
      await supabase
        .from('agent_memory')
        .delete()
        .eq('client_id', client.id)
        .lt('expires_at', now);

      toast.success('تم تحسين تخزين الذاكرة');
    } catch (error) {
      console.error('خطأ في تحسين الذاكرة:', error);
    }
  };

  return {
    storeMemory,
    retrieveMemory,
    clearMemory,
    updateRelevanceScore,
    optimizeMemoryStorage
  };
};
