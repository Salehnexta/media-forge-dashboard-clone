
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { environment, agentTypeMap, agentIdMap } from '@/config/environment';
import { AgentMemory, AgentMemoryRow, MemoryType, StoreMemoryOptions } from '../types/mcpTypes';
import type { AgentId } from '@/config/environment';

export const useMCPOperations = () => {
  // Enhanced memory storage with agent-specific features
  const storeMemory = async (
    agentType: string, 
    memoryType: MemoryType, 
    content: Record<string, any>,
    options?: StoreMemoryOptions
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
        agent_id: options?.agentId || agentTypeMap[agentType as keyof typeof agentTypeMap],
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
      toast.success(`تم حفظ ذاكرة ${environment.agents[options?.agentId || 'M1'].name} بنجاح`);
    } catch (error: any) {
      console.error('خطأ في حفظ الذاكرة:', error);
      toast.error(error.message || 'خطأ في حفظ ذاكرة الوكيل');
    }
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
        agent_id: agentTypeMap[row.agent_type as keyof typeof agentTypeMap],
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
    } catch (error) {
      console.error('خطأ في تحديث درجة الصلة:', error);
    }
  };

  const optimizeMemoryStorage = async (agentId?: AgentId) => {
    try {
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
