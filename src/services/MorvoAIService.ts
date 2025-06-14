
import { chatHttpService } from './ChatHttpService';

interface MorvoMessage {
  message: string;
  client_id: string;
  conversation_id: string;
}

interface MorvoResponse {
  message: string;
  conversation_id: string;
  agents_involved: string[];
  intent_analysis: {
    intent: string;
    language: string;
    confidence: number;
  };
  processing_time_ms: number;
  // Legacy support for existing code
  response?: string;
  processing_time?: number;
  cost_tracking?: {
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
    console.log('🔧 MorvoAIService initialized with HTTP integration');
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async connect(): Promise<boolean> {
    console.log('🔗 Connecting MorvoAIService to HTTP backend...');
    return await chatHttpService.connect('user', undefined, {
      baseUrl: this.baseURL
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const isHealthy = response.ok;
      console.log(`🏥 Health check: ${isHealthy ? 'PASSED' : 'FAILED'}`);
      return isHealthy;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async getAgents(): Promise<Agent[]> {
    try {
      console.log('📋 Fetching agents from Morvo AI...');
      const agents = await chatHttpService.getAgents();
      if (agents.length > 0) {
        return agents;
      }
      
      // Fallback to default agents if API call fails
      return this.getDefaultAgents();
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
    console.log('📤 MorvoAIService sending message via HTTP service:', { message, selectedAgent });
    
    // Use the HTTP service for sending messages
    if (selectedAgent && selectedAgent !== 'auto') {
      const success = await chatHttpService.sendToAgent(selectedAgent, message);
      if (!success) {
        throw new Error('Failed to send message to specific agent');
      }
    } else {
      const success = await chatHttpService.sendMessage(message);
      if (!success) {
        throw new Error('Failed to send message');
      }
    }

    // Since HTTP service uses events, we need to return a compatible response
    // This is a simplified approach - in practice, you'd listen for the event
    return {
      message: 'Message sent successfully',
      conversation_id: conversationId,
      agents_involved: selectedAgent ? [selectedAgent] : ['auto'],
      intent_analysis: {
        intent: 'general',
        language: 'ar',
        confidence: 1.0
      },
      processing_time_ms: 1000,
      response: 'Message sent successfully',
      processing_time: 1.0,
      cost_tracking: {
        total_cost: 0.001,
        tokens_used: 100
      }
    };
  }

  isConnected(): boolean {
    return chatHttpService.isConnected();
  }

  getClientId(): string {
    return this.clientId;
  }

  // Direct access to HTTP service methods
  async sendMessageDirect(message: string, agentId?: string): Promise<boolean> {
    if (agentId) {
      return await chatHttpService.sendToAgent(agentId, message);
    } else {
      return await chatHttpService.sendMessage(message);
    }
  }

  getDetailedStatus(): object {
    return chatHttpService.getDetailedStatus();
  }
}

export default new MorvoAIService();
