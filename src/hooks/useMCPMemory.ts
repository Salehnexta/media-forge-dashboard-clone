
import { useState, useCallback, useEffect } from 'react';
import { useMCPContext } from '@/contexts/MCPContext';
import { AgentMemory, MemoryType } from '@/contexts/MCPContext';

interface UseMCPMemoryProps {
  agentType: string;
  autoLoad?: boolean;
}

export const useMCPMemory = ({ agentType, autoLoad = true }: UseMCPMemoryProps) => {
  const { 
    storeMemory, 
    retrieveMemory, 
    clearMemory, 
    updateRelevanceScore,
    agentMemories 
  } = useMCPContext();
  
  const [memories, setMemories] = useState<AgentMemory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMemories = useCallback(async (memoryType?: string) => {
    setIsLoading(true);
    try {
      const data = await retrieveMemory(agentType, memoryType as MemoryType);
      setMemories(data);
    } catch (error) {
      console.error('خطأ في تحميل الذاكرة:', error);
    } finally {
      setIsLoading(false);
    }
  }, [agentType, retrieveMemory]);

  useEffect(() => {
    if (autoLoad) {
      loadMemories();
    }
  }, [loadMemories, autoLoad]);

  // Update local memories when global memories change
  useEffect(() => {
    const agentSpecificMemories = agentMemories.filter(m => m.agent_type === agentType);
    setMemories(agentSpecificMemories);
  }, [agentMemories, agentType]);

  const saveMemory = useCallback(async (
    memoryType: string, 
    content: Record<string, any>
  ) => {
    await storeMemory(agentType, memoryType as MemoryType, content);
    await loadMemories();
  }, [agentType, storeMemory, loadMemories]);

  const clearAgentMemory = useCallback(async () => {
    await clearMemory(agentType);
    setMemories([]);
  }, [agentType, clearMemory]);

  const getMemoriesByType = useCallback((memoryType: string) => {
    return memories.filter(m => m.memory_type === memoryType);
  }, [memories]);

  const getRecentMemories = useCallback((limit: number = 5) => {
    return memories
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }, [memories]);

  const getHighRelevanceMemories = useCallback((threshold: number = 0.7) => {
    return memories.filter(m => m.relevance_score >= threshold);
  }, [memories]);

  return {
    memories,
    isLoading,
    loadMemories,
    saveMemory,
    clearAgentMemory,
    updateRelevanceScore,
    getMemoriesByType,
    getRecentMemories,
    getHighRelevanceMemories
  };
};
