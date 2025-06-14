
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
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async getAgents(): Promise<Agent[]> {
    try {
      const response = await fetch(`${this.baseURL}/v1/agents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const data = await response.json();
      return data.agents || [];
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      return this.getDefaultAgents();
    }
  }

  private getDefaultAgents(): Agent[] {
    return [
      { id: 'auto', name: 'Auto-Route', description: 'Automatically routes to the best agent', status: 'active' },
      { id: 'client_experience', name: 'Client Experience Agent', description: 'Master Coordinator for client interactions', status: 'active' },
      { id: 'social_media', name: 'Social Media Agent', description: 'Social media strategy and management', status: 'active' },
      { id: 'seo', name: 'SEO Agent', description: 'Search engine optimization specialist', status: 'active' },
      { id: 'brand_monitoring', name: 'Brand Monitoring Agent', description: 'Brand reputation and monitoring', status: 'active' },
      { id: 'analytics', name: 'Analytics Agent', description: 'Data analytics and business intelligence', status: 'active' },
      { id: 'paid_ads', name: 'Paid Ads Agent', description: 'Paid advertising campaigns', status: 'active' },
      { id: 'email_marketing', name: 'Email Marketing Agent', description: 'Email campaign management', status: 'active' },
      { id: 'content_management', name: 'Content Management Agent', description: 'Content creation and management', status: 'active' },
      { id: 'competitor_analysis', name: 'Competitor Analysis Agent', description: 'Competitive intelligence and analysis', status: 'active' }
    ];
  }

  async sendMessage(
    message: string, 
    conversationId: string, 
    selectedAgent?: string
  ): Promise<MorvoResponse> {
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
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  getClientId(): string {
    return this.clientId;
  }
}

export default new MorvoAIService();
