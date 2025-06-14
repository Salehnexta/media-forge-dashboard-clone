
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
        .from('agent_memory')
        .select('agent_id')
        .eq('client_id', user.id);

      const activeAgents = agentMemories?.map(memory => memory.agent_id) || [];

      return [
        {
          agent_id: 'client_experience',
          name: 'وكيل تجربة العميل',
          status: 'online',
          last_seen: new Date().toISOString(),
          specialization: 'إدارة تجربة العميل والتنسيق بين الوكلاء'
        },
        {
          agent_id: 'seo_agent',
          name: 'وكيل تحسين محركات البحث',
          status: activeAgents.includes('seo_agent') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'تحسين محركات البحث وتحليل الكلمات المفتاحية'
        },
        {
          agent_id: 'content_management',
          name: 'وكيل إدارة المحتوى',
          status: activeAgents.includes('content_management') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'إنشاء وإدارة المحتوى الرقمي'
        },
        {
          agent_id: 'social_media',
          name: 'وكيل وسائل التواصل الاجتماعي',
          status: activeAgents.includes('social_media') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'إدارة وسائل التواصل الاجتماعي'
        },
        {
          agent_id: 'paid_ads',
          name: 'وكيل الإعلانات المدفوعة',
          status: activeAgents.includes('paid_ads') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'إدارة الحملات الإعلانية المدفوعة'
        },
        {
          agent_id: 'email_marketing',
          name: 'وكيل التسويق عبر البريد الإلكتروني',
          status: activeAgents.includes('email_marketing') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'حملات البريد الإلكتروني والأتمتة'
        },
        {
          agent_id: 'analytics',
          name: 'وكيل التحليلات',
          status: activeAgents.includes('analytics') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'تحليل البيانات والتقارير التفصيلية'
        },
        {
          agent_id: 'brand_monitoring',
          name: 'وكيل مراقبة العلامة التجارية',
          status: activeAgents.includes('brand_monitoring') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'مراقبة السمعة والعلامة التجارية'
        },
        {
          agent_id: 'competitor_analysis',
          name: 'وكيل تحليل المنافسين',
          status: activeAgents.includes('competitor_analysis') ? 'online' : 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'تحليل السوق والمنافسة'
        }
      ];
    } catch (error) {
      console.error('Error fetching agent status:', error);
      // Return default offline status for all agents
      return [
        {
          agent_id: 'client_experience',
          name: 'وكيل تجربة العميل',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'إدارة تجربة العميل والتنسيق بين الوكلاء'
        },
        {
          agent_id: 'seo_agent',
          name: 'وكيل تحسين محركات البحث',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'تحسين محركات البحث وتحليل الكلمات المفتاحية'
        },
        {
          agent_id: 'content_management',
          name: 'وكيل إدارة المحتوى',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'إنشاء وإدارة المحتوى الرقمي'
        },
        {
          agent_id: 'social_media',
          name: 'وكيل وسائل التواصل الاجتماعي',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'إدارة وسائل التواصل الاجتماعي'
        },
        {
          agent_id: 'paid_ads',
          name: 'وكيل الإعلانات المدفوعة',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'إدارة الحملات الإعلانية المدفوعة'
        },
        {
          agent_id: 'email_marketing',
          name: 'وكيل التسويق عبر البريد الإلكتروني',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'حملات البريد الإلكتروني والأتمتة'
        },
        {
          agent_id: 'analytics',
          name: 'وكيل التحليلات',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'تحليل البيانات والتقارير التفصيلية'
        },
        {
          agent_id: 'brand_monitoring',
          name: 'وكيل مراقبة العلامة التجارية',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'مراقبة السمعة والعلامة التجارية'
        },
        {
          agent_id: 'competitor_analysis',
          name: 'وكيل تحليل المنافسين',
          status: 'offline',
          last_seen: new Date().toISOString(),
          specialization: 'تحليل السوق والمنافسة'
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

      // Store the conversation in Supabase using existing conversations table
      const { error } = await supabase
        .from('conversations')
        .insert({
          client_id: user.id,
          title: message.substring(0, 50),
          status: 'active'
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

      return {
        response,
        agent_id: agentId || 'client_experience'
      };
    } catch (error) {
      console.error('Error in chat service:', error);
      return {
        response: 'عذراً، حدث خطأ في النظام. يرجى المحاولة مرة أخرى.',
        agent_id: agentId || 'client_experience'
      };
    }
  }
}

export const supabaseOnlyService = SupabaseOnlyService.getInstance();
