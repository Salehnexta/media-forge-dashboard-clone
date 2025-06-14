
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { environment, agentTypeMap, agentIdMap } from '@/config/environment';
import { AgentMemory, MemoryType, StoreMemoryOptions } from '../types/mcpTypes';
import type { AgentId } from '@/config/environment';

export const useMCPOperations = () => {
  // Enhanced memory storage with agent-specific features using content_sources_data table
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
        timestamp: new Date().toISOString(),
        memory_type: memoryType,
        agent_type: agentType,
        relevance_score: 1.0,
        expires_at: expiresAt
      };

      // Store in content_sources_data table as agent memory
      const { error } = await supabase
        .from('content_sources_data')
        .insert({
          client_id: user.id,
          source_type: 'agent_memory',
          data: enhancedContent
        });

      if (error) throw error;
      toast.success(`تم حفظ ذاكرة ${environment.agents[options?.agentId || 'M1'].name} بنجاح`);
    } catch (error: any) {
      console.error('خطأ في حفظ الذاكرة:', error);
      toast.error(error.message || 'خطأ في حفظ ذاكرة الوكيل');
    }
  };

  // Enhanced memory retrieval with agent filtering using content_sources_data
  const retrieveMemory = async (agentType: string, memoryType?: MemoryType, agentId?: AgentId): Promise<AgentMemory[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from('content_sources_data')
        .select('*')
        .eq('client_id', user.id)
        .eq('source_type', 'agent_memory')
        .order('timestamp', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      
      let memories: AgentMemory[] = (data || []).map((row: any) => {
        const content = row.data as any;
        return {
          id: row.id,
          agent_type: content.agent_type || agentType,
          agent_id: content.agent_id,
          memory_type: (content.memory_type || 'context') as MemoryType,
          content: content,
          created_at: row.timestamp,
          expires_at: content.expires_at || undefined,
          relevance_score: Number(content.relevance_score || 1.0),
          tags: content.tags || [],
          related_memories: content.related_memories || []
        };
      });

      // Filter by agent type
      memories = memories.filter(memory => memory.agent_type === agentType);

      // Filter by memory type if specified
      if (memoryType) {
        memories = memories.filter(memory => memory.memory_type === memoryType);
      }

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

      let query = supabase
        .from('content_sources_data')
        .delete()
        .eq('client_id', user.id)
        .eq('source_type', 'agent_memory');

      // For now, we'll clear all agent memories since we can't easily filter by agent_type in the data field
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
      // Since we're using content_sources_data, we need to update the data field
      const { data: existing } = await supabase
        .from('content_sources_data')
        .select('data')
        .eq('id', memoryId)
        .single();

      if (existing) {
        const updatedData = {
          ...existing.data,
          relevance_score: score
        };

        const { error } = await supabase
          .from('content_sources_data')
          .update({ data: updatedData })
          .eq('id', memoryId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('خطأ في تحديث درجة الصلة:', error);
    }
  };

  const optimizeMemoryStorage = async (agentId?: AgentId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Remove expired memories by checking the expires_at field in the data
      const { data: memories } = await supabase
        .from('content_sources_data')
        .select('*')
        .eq('client_id', user.id)
        .eq('source_type', 'agent_memory');

      if (memories) {
        const now = new Date().toISOString();
        const expiredIds = memories
          .filter(memory => {
            const data = memory.data as any;
            return data.expires_at && data.expires_at < now;
          })
          .map(memory => memory.id);

        if (expiredIds.length > 0) {
          await supabase
            .from('content_sources_data')
            .delete()
            .in('id', expiredIds);
        }
      }

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
