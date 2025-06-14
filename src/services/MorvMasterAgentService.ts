
import { toast } from 'sonner';

export interface MasterAgentMessage {
  id: string;
  message: string;
  conversation_id: string;
  agents_involved: string[];
  intent_analysis: {
    intent: string;
    language: 'ar' | 'en';
    confidence: number;
  };
  processing_time_ms: number;
  cost_tracking: {
    total_cost: number;
    tokens_used: number;
  };
  timestamp: string;
  sender: 'user' | 'assistant';
}

export interface MasterAgentRequest {
  message: string;
  client_id: string;
  conversation_id: string;
}

export interface MorvAgent {
  id: string;
  backend_name: string;
  arabic_name: string;
  role: string;
  status: 'active' | 'inactive';
  specialty: string;
  endpoint: string;
}

export class MorvMasterAgentService {
  private baseUrl = 'https://morvo-production.up.railway.app';
  private clientId: string;
  private conversationId: string;
  
  // Define the 9-agent system
  public agents: MorvAgent[] = [
    {
      id: 'master_agent',
      backend_name: 'ClientExperienceAgent',
      arabic_name: 'وكيل تجربة العملاء',
      role: 'Master Coordinator & Client Experience Manager',
      status: 'active',
      specialty: 'تنسيق الوكلاء وإدارة تجربة العملاء',
      endpoint: '/v1/agents/master_agent/chat'
    },
    {
      id: 'analytics_agent',
      backend_name: 'AnalyticsAgent',
      arabic_name: 'وكيل التحليلات',
      role: 'Data Analysis and Business Intelligence',
      status: 'active',
      specialty: 'مقاييس الأداء وتحليل العائد على الاستثمار',
      endpoint: '/v1/agents/analytics_agent/chat'
    },
    {
      id: 'social_media_agent',
      backend_name: 'SocialMediaAgent',
      arabic_name: 'وكيل وسائل التواصل الاجتماعي',
      role: 'Social Media Strategy and Management',
      status: 'active',
      specialty: 'تخطيط المحتوى واستراتيجيات التفاعل',
      endpoint: '/v1/agents/social_media_agent/chat'
    },
    {
      id: 'seo_agent',
      backend_name: 'SEOAgent',
      arabic_name: 'وكيل تحسين محركات البحث',
      role: 'Search Engine Optimization Specialist',
      status: 'active',
      specialty: 'البحث عن الكلمات المفتاحية وتحسين المحتوى',
      endpoint: '/v1/agents/seo_agent/chat'
    },
    {
      id: 'brand_monitoring_agent',
      backend_name: 'BrandMonitoringAgent',
      arabic_name: 'وكيل مراقبة العلامة التجارية',
      role: 'Brand Reputation and Monitoring',
      status: 'active',
      specialty: 'تحليل المشاعر وإدارة السمعة',
      endpoint: '/v1/agents/brand_monitoring_agent/chat'
    },
    {
      id: 'paid_ads_agent',
      backend_name: 'PaidAdsAgent',
      arabic_name: 'وكيل الإعلانات المدفوعة',
      role: 'Paid Advertising Campaigns',
      status: 'active',
      specialty: 'إعلانات جوجل وفيسبوك وتحسين الحملات',
      endpoint: '/v1/agents/paid_ads_agent/chat'
    },
    {
      id: 'email_marketing_agent',
      backend_name: 'EmailMarketingAgent',
      arabic_name: 'وكيل التسويق عبر البريد الإلكتروني',
      role: 'Email Campaign Management',
      status: 'active',
      specialty: 'الأتمتة والتقسيم وتحسين التحويل',
      endpoint: '/v1/agents/email_marketing_agent/chat'
    },
    {
      id: 'content_management_agent',
      backend_name: 'ContentManagementAgent',
      arabic_name: 'وكيل إدارة المحتوى',
      role: 'Content Creation and Management',
      status: 'active',
      specialty: 'استراتيجية المحتوى وسير العمل الإبداعي',
      endpoint: '/v1/agents/content_management_agent/chat'
    },
    {
      id: 'competitor_analysis_agent',
      backend_name: 'CompetitorAnalysisAgent',
      arabic_name: 'وكيل تحليل المنافسين',
      role: 'Competitive Intelligence and Analysis',
      status: 'active',
      specialty: 'بحث السوق وتتبع المنافسين والرؤى الاستراتيجية',
      endpoint: '/v1/agents/competitor_analysis_agent/chat'
    }
  ];

  constructor() {
    this.clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async sendMessage(message: string, agentId: string = 'master_agent'): Promise<MasterAgentMessage | null> {
    try {
      const agent = this.agents.find(a => a.id === agentId);
      if (!agent) {
        throw new Error(`Agent ${agentId} not found`);
      }

      console.log(`📤 Sending message to ${agent.arabic_name}:`, message);

      const request: MasterAgentRequest = {
        message,
        client_id: this.clientId,
        conversation_id: this.conversationId
      };

      const response = await fetch(`${this.baseUrl}${agent.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Convert response to MasterAgentMessage format
      const agentMessage: MasterAgentMessage = {
        id: Date.now().toString(),
        message: data.message,
        conversation_id: data.conversation_id || this.conversationId,
        agents_involved: data.agents_involved || [agentId],
        intent_analysis: {
          intent: data.intent_analysis?.intent || 'general_inquiry',
          language: data.intent_analysis?.language || 'ar',
          confidence: data.intent_analysis?.confidence || 0.8
        },
        processing_time_ms: data.processing_time_ms || 1000,
        cost_tracking: {
          total_cost: data.cost_tracking?.total_cost || 0.004,
          tokens_used: data.cost_tracking?.tokens_used || 150
        },
        timestamp: new Date().toISOString(),
        sender: 'assistant'
      };

      return agentMessage;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast.error('خطأ في إرسال الرسالة');
      return null;
    }
  }

  getAgentById(agentId: string): MorvAgent | undefined {
    return this.agents.find(agent => agent.id === agentId);
  }

  getActiveAgents(): MorvAgent[] {
    return this.agents.filter(agent => agent.status === 'active');
  }

  static detectTextDirection(text: string): 'rtl' | 'ltr' {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text) ? 'rtl' : 'ltr';
  }

  static detectTextLanguage(text: string): 'ar' | 'en' {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text) ? 'ar' : 'en';
  }
}
