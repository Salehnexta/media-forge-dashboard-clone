
import { supabase } from '@/integrations/supabase/client';

export interface LocalAgentStatus {
  agent_id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  last_seen: string;
  specialization: string;
}

export interface LocalHealthCheck {
  status: string;
  timestamp: string;
  mode: 'local';
}

export class SupabaseOnlyService {
  private static instance: SupabaseOnlyService;

  static getInstance(): SupabaseOnlyService {
    if (!SupabaseOnlyService.instance) {
      SupabaseOnlyService.instance = new SupabaseOnlyService();
    }
    return SupabaseOnlyService.instance;
  }

  async checkHealth(): Promise<LocalHealthCheck> {
    // Always return local mode since we're not connecting to external APIs
    return {
      status: 'local',
      timestamp: new Date().toISOString(),
      mode: 'local'
    };
  }

  async getAgentStatus(): Promise<LocalAgentStatus[]> {
    // Return local agent data from Supabase or static data
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Try to get agent status from our local database first
      const { data: agentMemories } = await supabase
        .from('agent_memories')
        .select('agent_type')
        .eq('user_id', user.id);

      const activeAgents = agentMemories?.map(memory => memory.agent_type) || [];

      return [
        {
          agent_id: 'm1',
          name: 'المدير الاستراتيجي',
          status: activeAgents.includes('strategic') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'التخطيط الاستراتيجي وتحليل السوق'
        },
        {
          agent_id: 'm2',
          name: 'مدير المحتوى',
          status: activeAgents.includes('creative') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'إنشاء وإدارة المحتوى الرقمي'
        },
        {
          agent_id: 'm3',
          name: 'مدير الحملات',
          status: activeAgents.includes('executor') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'تنفيذ وإدارة الحملات التسويقية'
        },
        {
          agent_id: 'm4',
          name: 'مراقب الشبكات',
          status: activeAgents.includes('monitor') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'مراقبة وتحليل وسائل التواصل الاجتماعي'
        },
        {
          agent_id: 'm5',
          name: 'محلل البيانات',
          status: activeAgents.includes('analyst') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'تحليل البيانات والتقارير التفصيلية'
        }
      ];
    } catch (error) {
      console.error('Error fetching agent status:', error);
      // Return default offline status for all agents
      return [
        {
          agent_id: 'm1',
          name: 'المدير الاستراتيجي',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'التخطيط الاستراتيجي وتحليل السوق'
        },
        {
          agent_id: 'm2',
          name: 'مدير المحتوى',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'إنشاء وإدارة المحتوى الرقمي'
        },
        {
          agent_id: 'm3',
          name: 'مدير الحملات',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'تنفيذ وإدارة الحملات التسويقية'
        },
        {
          agent_id: 'm4',
          name: 'مراقب الشبكات',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'مراقبة وتحليل وسائل التواصل الاجتماعي'
        },
        {
          agent_id: 'm5',
          name: 'محلل البيانات',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'تحليل البيانات والتقارير التفصيلية'
        }
      ];
    }
  }

  async sendChatMessage(message: string, agentId?: string): Promise<{ response: string; agent_id: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Store the conversation in Supabase
      const { error } = await supabase
        .from('morvo_conversations')
        .insert({
          user_id: user.id,
          conversation_id: `local-${Date.now()}`,
          message_type: 'user',
          content: message,
          context_data: { agent_id: agentId || 'm1' }
        });

      if (error) {
        console.error('Error storing conversation:', error);
      }

      // Return a local response
      const responses = [
        'شكراً لتواصلك معي. النظام يعمل حالياً في الوضع المحلي مع قاعدة بيانات Supabase.',
        'تم استقبال رسالتك بنجاح. يمكنني مساعدتك بناءً على البيانات المحفوظة في النظام.',
        'النظام متاح ويعمل بكامل طاقته مع قاعدة البيانات المحلية. كيف يمكنني مساعدتك؟'
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];

      // Store the response
      await supabase
        .from('morvo_conversations')
        .insert({
          user_id: user.id,
          conversation_id: `local-${Date.now()}`,
          message_type: 'assistant',
          content: response,
          context_data: { agent_id: agentId || 'm1' }
        });

      return {
        response,
        agent_id: agentId || 'm1'
      };
    } catch (error) {
      console.error('Error in chat service:', error);
      return {
        response: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.',
        agent_id: agentId || 'm1'
      };
    }
  }
}

export const supabaseOnlyService = SupabaseOnlyService.getInstance();
