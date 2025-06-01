
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AgentMemory {
  id: string;
  agent_type: string;
  memory_type: 'analysis' | 'insight' | 'context' | 'preference';
  content: Record<string, any>;
  company_id?: string;
  created_at: string;
  expires_at?: string;
  relevance_score: number;
}

export interface CrossAgentContext {
  shared_insights: Record<string, any>;
  collaboration_history: any[];
  contextual_data: Record<string, any>;
}

interface MCPContextType {
  agentMemories: AgentMemory[];
  crossAgentContext: CrossAgentContext;
  isLoading: boolean;
  storeMemory: (agentType: string, memoryType: string, content: Record<string, any>) => Promise<void>;
  retrieveMemory: (agentType: string, memoryType?: string) => Promise<AgentMemory[]>;
  shareContext: (fromAgent: string, toAgent: string, context: any) => Promise<void>;
  clearMemory: (agentType?: string) => Promise<void>;
  updateRelevanceScore: (memoryId: string, score: number) => Promise<void>;
}

const MCPContext = createContext<MCPContextType | undefined>(undefined);

export const useMCPContext = () => {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error('useMCPContext must be used within MCPProvider');
  }
  return context;
};

interface MCPProviderProps {
  children: ReactNode;
}

export const MCPProvider = ({ children }: MCPProviderProps) => {
  const [agentMemories, setAgentMemories] = useState<AgentMemory[]>([]);
  const [crossAgentContext, setCrossAgentContext] = useState<CrossAgentContext>({
    shared_insights: {},
    collaboration_history: [],
    contextual_data: {}
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAgentMemories();
    loadCrossAgentContext();
  }, []);

  const loadAgentMemories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('agent_memories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgentMemories(data || []);
    } catch (error) {
      console.error('خطأ في تحميل ذاكرة الوكلاء:', error);
    }
  };

  const loadCrossAgentContext = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('cross_agent_context')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setCrossAgentContext(data.context_data);
      }
    } catch (error) {
      console.error('خطأ في تحميل السياق المشترك:', error);
    }
  };

  const storeMemory = async (agentType: string, memoryType: string, content: Record<string, any>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('المستخدم غير مصرح له');

      const { error } = await supabase
        .from('agent_memories')
        .insert({
          user_id: user.id,
          agent_type: agentType,
          memory_type: memoryType,
          content,
          relevance_score: 1.0
        });

      if (error) throw error;
      await loadAgentMemories();
      toast.success('تم حفظ ذاكرة الوكيل بنجاح');
    } catch (error: any) {
      console.error('خطأ في حفظ الذاكرة:', error);
      toast.error(error.message || 'خطأ في حفظ ذاكرة الوكيل');
    }
  };

  const retrieveMemory = async (agentType: string, memoryType?: string): Promise<AgentMemory[]> => {
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
      return data || [];
    } catch (error) {
      console.error('خطأ في استرجاع الذاكرة:', error);
      return [];
    }
  };

  const shareContext = async (fromAgent: string, toAgent: string, context: any) => {
    try {
      const newContext = {
        ...crossAgentContext,
        collaboration_history: [
          ...crossAgentContext.collaboration_history,
          {
            from_agent: fromAgent,
            to_agent: toAgent,
            context,
            timestamp: new Date().toISOString()
          }
        ],
        shared_insights: {
          ...crossAgentContext.shared_insights,
          [`${fromAgent}_to_${toAgent}`]: context
        }
      };

      setCrossAgentContext(newContext);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('cross_agent_context')
        .upsert({
          user_id: user.id,
          context_data: newContext
        });

      toast.success('تم مشاركة السياق بين الوكلاء');
    } catch (error) {
      console.error('خطأ في مشاركة السياق:', error);
      toast.error('خطأ في مشاركة السياق بين الوكلاء');
    }
  };

  const clearMemory = async (agentType?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase.from('agent_memories').delete().eq('user_id', user.id);
      
      if (agentType) {
        query = query.eq('agent_type', agentType);
      }

      const { error } = await query;
      if (error) throw error;

      await loadAgentMemories();
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
      await loadAgentMemories();
    } catch (error) {
      console.error('خطأ في تحديث درجة الصلة:', error);
    }
  };

  return (
    <MCPContext.Provider value={{
      agentMemories,
      crossAgentContext,
      isLoading,
      storeMemory,
      retrieveMemory,
      shareContext,
      clearMemory,
      updateRelevanceScore
    }}>
      {children}
    </MCPContext.Provider>
  );
};
