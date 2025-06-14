
interface MorvoMessage {
  message: string;
  client_id: string;
  conversation_id: string;
}

interface MorvoResponse {
  response: string;
  agents_involved: string[];
  conversation_id: string;
  processing_time: number;
  cost_tracking: {
    total_cost: number;
    tokens_used: number;
  };
}

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

class MorvoAIService {
  private baseURL = 'https://morvo-production.up.railway.app';
  private clientId: string;
  private timeout = 30000; // 30 seconds

  constructor() {
    this.clientId = this.generateClientId();
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async getAgents(): Promise<Agent[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}/v1/agents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const data = await response.json();
      return data.agents || this.getDefaultAgents();
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      return this.getDefaultAgents();
    }
  }

  private getDefaultAgents(): Agent[] {
    return [
      { 
        id: 'auto', 
        name: 'التوجيه التلقائي', 
        description: 'يوجه تلقائياً إلى أفضل وكيل', 
        status: 'active' 
      },
      { 
        id: 'client_experience_agent', 
        name: 'وكيل تجربة العملاء', 
        description: 'المنسق الرئيسي لتفاعلات العملاء', 
        status: 'active' 
      },
      { 
        id: 'social_media_agent', 
        name: 'وكيل وسائل التواصل الاجتماعي', 
        description: 'استراتيجية وإدارة وسائل التواصل الاجتماعي', 
        status: 'active' 
      },
      { 
        id: 'seo_agent', 
        name: 'وكيل تحسين محركات البحث', 
        description: 'متخصص في تحسين محركات البحث', 
        status: 'active' 
      },
      { 
        id: 'brand_monitoring_agent', 
        name: 'وكيل مراقبة العلامة التجارية', 
        description: 'سمعة العلامة التجارية والمراقبة', 
        status: 'active' 
      },
      { 
        id: 'analytics_agent', 
        name: 'وكيل التحليلات', 
        description: 'تحليل البيانات والذكاء التجاري', 
        status: 'active' 
      },
      { 
        id: 'paid_ads_agent', 
        name: 'وكيل الإعلانات المدفوعة', 
        description: 'حملات الإعلان المدفوع', 
        status: 'active' 
      },
      { 
        id: 'email_marketing_agent', 
        name: 'وكيل التسويق عبر البريد الإلكتروني', 
        description: 'إدارة حملات البريد الإلكتروني', 
        status: 'active' 
      },
      { 
        id: 'content_management_agent', 
        name: 'وكيل إدارة المحتوى', 
        description: 'إنشاء وإدارة المحتوى', 
        status: 'active' 
      },
      { 
        id: 'competitor_analysis_agent', 
        name: 'وكيل تحليل المنافسين', 
        description: 'الذكاء التنافسي والتحليل', 
        status: 'active' 
      }
    ];
  }

  async sendMessage(
    message: string, 
    conversationId: string, 
    selectedAgent?: string,
    retryCount: number = 0
  ): Promise<MorvoResponse> {
    const maxRetries = 3;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const payload: MorvoMessage = {
        message,
        client_id: this.clientId,
        conversation_id: conversationId
      };

      const endpoint = selectedAgent && selectedAgent !== 'auto' 
        ? `${this.baseURL}/v1/agents/${selectedAgent}/chat`
        : `${this.baseURL}/v1/chat/test`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Attempt ${retryCount + 1} failed:`, error);
      
      if (retryCount < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return this.sendMessage(message, conversationId, selectedAgent, retryCount + 1);
      }
      
      throw error;
    }
  }

  getClientId(): string {
    return this.clientId;
  }
}

export default new MorvoAIService();
