
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MemoryUsage {
  agent_type: string;
  memory_count: number;
  total_size_mb: number;
}

interface MemoryStats {
  totalMemories: number;
  totalSizeMB: number;
  agentBreakdown: MemoryUsage[];
  isLoading: boolean;
  error: string | null;
}

export const useMemoryManagement = () => {
  const [memoryStats, setMemoryStats] = useState<MemoryStats>({
    totalMemories: 0,
    totalSizeMB: 0,
    agentBreakdown: [],
    isLoading: true,
    error: null
  });

  const [cleanupStats, setCleanupStats] = useState({
    isCleaningUp: false,
    lastCleanup: null as Date | null,
    cleanedCount: 0
  });

  const fetchMemoryUsage = async () => {
    try {
      setMemoryStats(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('get_user_memory_usage', {
        p_user_id: user.id
      });

      if (error) {
        throw error;
      }

      const agentBreakdown = data || [];
      const totalMemories = agentBreakdown.reduce((sum, agent) => sum + agent.memory_count, 0);
      const totalSizeMB = agentBreakdown.reduce((sum, agent) => sum + agent.total_size_mb, 0);

      setMemoryStats({
        totalMemories,
        totalSizeMB,
        agentBreakdown,
        isLoading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch memory usage';
      setMemoryStats(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  };

  const cleanupExpiredMemories = async () => {
    try {
      setCleanupStats(prev => ({ ...prev, isCleaningUp: true }));

      // Get count before cleanup
      const { count: beforeCount } = await supabase
        .from('agent_memories')
        .select('*', { count: 'exact', head: true })
        .not('expires_at', 'is', null)
        .lt('expires_at', new Date().toISOString());

      // Run cleanup function
      const { error } = await supabase.rpc('cleanup_expired_memories');

      if (error) {
        throw error;
      }

      // Get count after cleanup
      const { count: afterCount } = await supabase
        .from('agent_memories')
        .select('*', { count: 'exact', head: true })
        .not('expires_at', 'is', null)
        .lt('expires_at', new Date().toISOString());

      const cleanedCount = (beforeCount || 0) - (afterCount || 0);

      setCleanupStats({
        isCleaningUp: false,
        lastCleanup: new Date(),
        cleanedCount
      });

      // Refresh memory usage after cleanup
      await fetchMemoryUsage();

      return cleanedCount;
    } catch (error) {
      setCleanupStats(prev => ({ ...prev, isCleaningUp: false }));
      throw error;
    }
  };

  const deleteMemoriesByAgent = async (agentType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('agent_memories')
        .delete()
        .eq('user_id', user.id)
        .eq('agent_type', agentType);

      if (error) {
        throw error;
      }

      await fetchMemoryUsage();
    } catch (error) {
      throw error;
    }
  };

  const optimizeMemoryRelevance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update relevance scores based on age and usage
      const { error } = await supabase
        .from('agent_memories')
        .update({
          relevance_score: supabase.rpc('calculate_relevance_score', {
            created_at: 'created_at',
            content: 'content'
          })
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchMemoryUsage();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchMemoryUsage();
  }, []);

  return {
    memoryStats,
    cleanupStats,
    fetchMemoryUsage,
    cleanupExpiredMemories,
    deleteMemoriesByAgent,
    optimizeMemoryRelevance
  };
};
