
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MemoryEntry {
  id: string;
  agent_id: string;
  content: any;
  importance_score: number;
  timestamp: string;
  memory_type: string;
  expires_at?: string;
}

interface MemoryStats {
  totalEntries: number;
  byAgent: Record<string, number>;
  byType: Record<string, number>;
  avgImportance: number;
  totalSizeMB: number;
  agentBreakdown: Array<{
    agent_type: string;
    memory_count: number;
    total_size_mb: number;
  }>;
}

interface CleanupStats {
  isCleaningUp: boolean;
  lastCleanup?: Date;
  cleanedCount: number;
}

export const useMemoryManagement = () => {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [stats, setStats] = useState<MemoryStats>({
    totalEntries: 0,
    byAgent: {},
    byType: {},
    avgImportance: 0,
    totalSizeMB: 0,
    agentBreakdown: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cleanupStats, setCleanupStats] = useState<CleanupStats>({
    isCleaningUp: false,
    cleanedCount: 0
  });

  const loadMemories = useCallback(async (agentId?: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) return;

      let query = supabase
        .from('agent_memory')
        .select('*')
        .eq('client_id', client.id)
        .order('timestamp', { ascending: false });

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const memoryEntries: MemoryEntry[] = (data || []).map((item: any) => ({
        id: item.id,
        agent_id: item.agent_id,
        content: item.content || {},
        importance_score: item.importance_score || 0,
        timestamp: item.timestamp || item.created_at,
        memory_type: item.memory_type || 'conversation',
        expires_at: item.expires_at
      }));

      setMemories(memoryEntries);
      calculateStats(memoryEntries);
    } catch (error) {
      console.error('خطأ في تحميل الذكريات:', error);
      toast.error('فشل في تحميل الذكريات');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateStats = (memoryEntries: MemoryEntry[]) => {
    const byAgent: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let totalImportance = 0;

    memoryEntries.forEach(memory => {
      byAgent[memory.agent_id] = (byAgent[memory.agent_id] || 0) + 1;
      byType[memory.memory_type] = (byType[memory.memory_type] || 0) + 1;
      totalImportance += memory.importance_score;
    });

    const agentBreakdown = Object.entries(byAgent).map(([agent_type, memory_count]) => ({
      agent_type,
      memory_count,
      total_size_mb: memory_count * 0.1 // Estimate
    }));

    setStats({
      totalEntries: memoryEntries.length,
      byAgent,
      byType,
      avgImportance: memoryEntries.length > 0 ? totalImportance / memoryEntries.length : 0,
      totalSizeMB: memoryEntries.length * 0.1, // Estimate
      agentBreakdown
    });
  };

  const deleteMemory = useCallback(async (memoryId: string) => {
    try {
      const { error } = await supabase
        .from('agent_memory')
        .delete()
        .eq('id', memoryId);

      if (error) throw error;

      setMemories(prev => prev.filter(m => m.id !== memoryId));
      toast.success('تم حذف الذاكرة بنجاح');
    } catch (error) {
      console.error('خطأ في حذف الذاكرة:', error);
      toast.error('فشل في حذف الذاكرة');
    }
  }, []);

  const clearAllMemories = useCallback(async (agentId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

      if (agentId) {
        query = query.eq('agent_id', agentId);
      }

      const { error } = await query;
      if (error) throw error;

      setMemories([]);
      setStats({ totalEntries: 0, byAgent: {}, byType: {}, avgImportance: 0, totalSizeMB: 0, agentBreakdown: [] });
      toast.success('تم مسح جميع الذكريات');
    } catch (error) {
      console.error('خطأ في مسح الذكريات:', error);
      toast.error('فشل في مسح الذكريات');
    }
  }, []);

  const updateImportanceScore = useCallback(async (memoryId: string, newScore: number) => {
    try {
      const { error } = await supabase
        .from('agent_memory')
        .update({ importance_score: newScore })
        .eq('id', memoryId);

      if (error) throw error;

      setMemories(prev => 
        prev.map(m => 
          m.id === memoryId 
            ? { ...m, importance_score: newScore }
            : m
        )
      );

      toast.success('تم تحديث درجة الأهمية');
    } catch (error) {
      console.error('خطأ في تحديث درجة الأهمية:', error);
      toast.error('فشل في تحديث درجة الأهمية');
    }
  }, []);

  const cleanupExpiredMemories = useCallback(async () => {
    setCleanupStats(prev => ({ ...prev, isCleaningUp: true }));
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) return 0;

      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('agent_memory')
        .delete()
        .eq('client_id', client.id)
        .lt('expires_at', now);

      if (error) throw error;

      // Fix: Handle both null and array cases properly
      const cleanedCount = data && Array.isArray(data) ? data.length : 0;
      
      setCleanupStats(prev => ({
        ...prev,
        lastCleanup: new Date(),
        cleanedCount
      }));

      return cleanedCount;
    } catch (error) {
      console.error('خطأ في تنظيف الذكريات:', error);
      return 0;
    } finally {
      setCleanupStats(prev => ({ ...prev, isCleaningUp: false }));
    }
  }, []);

  const deleteMemoriesByAgent = useCallback(async (agentType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) return;

      const { error } = await supabase
        .from('agent_memory')
        .delete()
        .eq('client_id', client.id)
        .eq('agent_id', agentType);

      if (error) throw error;

      setMemories(prev => prev.filter(m => m.agent_id !== agentType));
      toast.success(`تم حذف ذكريات ${agentType}`);
    } catch (error) {
      console.error('خطأ في حذف ذكريات الوكيل:', error);
      toast.error('فشل في حذف ذكريات الوكيل');
    }
  }, []);

  const fetchMemoryUsage = useCallback(async () => {
    await loadMemories();
  }, [loadMemories]);

  return {
    memories,
    stats,
    isLoading,
    memoryStats: stats, // Alias for backward compatibility
    cleanupStats,
    loadMemories,
    deleteMemory,
    clearAllMemories,
    updateImportanceScore,
    cleanupExpiredMemories,
    deleteMemoriesByAgent,
    fetchMemoryUsage
  };
};
