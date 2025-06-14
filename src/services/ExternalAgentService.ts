
import { supabase } from '@/integrations/supabase/client';

export interface ExternalAgentConfig {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  type: 'conversation' | 'strategic' | 'creative' | 'analyst' | 'content' | 'social' | 'campaign' | 'performance' | 'automation';
}

export interface ChatRequest {
  message: string;
  userId: string;
  conversationId?: string;
  context?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  agentId: string;
  conversationId: string;
  context?: Record<string, any>;
  suggestions?: string[];
  actions?: Array<{
    type: string;
    label: string;
    payload: any;
  }>;
}

class ExternalAgentService {
  private agents: Map<string, ExternalAgentConfig> = new Map();

  constructor() {
    // Initialize your 9 agents configuration
    this.initializeAgents();
  }

  private initializeAgents() {
    const defaultAgents: ExternalAgentConfig[] = [
      { id: 'agent-1', name: 'Strategic Agent', baseUrl: '', type: 'strategic' },
      { id: 'agent-2', name: 'Creative Agent', baseUrl: '', type: 'creative' },
      { id: 'agent-3', name: 'Analytics Agent', baseUrl: '', type: 'analyst' },
      { id: 'agent-4', name: 'Content Agent', baseUrl: '', type: 'content' },
      { id: 'agent-5', name: 'Social Media Agent', baseUrl: '', type: 'social' },
      { id: 'agent-6', name: 'Campaign Agent', baseUrl: '', type: 'campaign' },
      { id: 'agent-7', name: 'Performance Agent', baseUrl: '', type: 'performance' },
      { id: 'agent-8', name: 'Automation Agent', baseUrl: '', type: 'automation' },
      { id: 'agent-9', name: 'Conversation Agent', baseUrl: '', type: 'conversation' }
    ];

    defaultAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  async sendMessage(agentId: string, request: ChatRequest): Promise<ChatResponse> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    try {
      // Log the request to Supabase for tracking
      await this.logAgentRequest(agentId, request);

      const response = await fetch(`${agent.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': agent.apiKey ? `Bearer ${agent.apiKey}` : '',
        },
        body: JSON.stringify({
          message: request.message,
          user_id: request.userId,
          conversation_id: request.conversationId,
          context: request.context,
          agent_type: agent.type
        })
      });

      if (!response.ok) {
        throw new Error(`Agent ${agentId} responded with status ${response.status}`);
      }

      const data = await response.json();
      
      const chatResponse: ChatResponse = {
        response: data.response || data.message,
        agentId: agentId,
        conversationId: data.conversation_id || request.conversationId || this.generateConversationId(),
        context: data.context,
        suggestions: data.suggestions,
        actions: data.actions
      };

      // Log the response to Supabase
      await this.logAgentResponse(agentId, chatResponse);

      return chatResponse;
    } catch (error) {
      console.error(`Error communicating with agent ${agentId}:`, error);
      
      // Log the error
      await this.logAgentError(agentId, error as Error);
      
      throw error;
    }
  }

  async updateAgentConfig(agentId: string, config: Partial<ExternalAgentConfig>) {
    const existingAgent = this.agents.get(agentId);
    if (existingAgent) {
      this.agents.set(agentId, { ...existingAgent, ...config });
      
      // Save to local storage for persistence (instead of Supabase for now)
      await this.saveAgentConfigToStorage(agentId, this.agents.get(agentId)!);
    }
  }

  private async logAgentRequest(agentId: string, request: ChatRequest) {
    try {
      await supabase.from('agent_activity_log').insert({
        agent_id: agentId,
        activity_type: 'request',
        description: 'Message sent to external agent',
        metrics: {
          message_length: request.message.length,
          has_context: !!request.context,
          conversation_id: request.conversationId
        },
        client_id: await this.getClientId(),
        project_id: await this.getClientId()
      });
    } catch (error) {
      console.error('Failed to log agent request:', error);
    }
  }

  private async logAgentResponse(agentId: string, response: ChatResponse) {
    try {
      await supabase.from('agent_activity_log').insert({
        agent_id: agentId,
        activity_type: 'response',
        description: 'Response received from external agent',
        metrics: {
          response_length: response.response.length,
          has_suggestions: !!response.suggestions?.length,
          has_actions: !!response.actions?.length,
          conversation_id: response.conversationId
        },
        client_id: await this.getClientId(),
        project_id: await this.getClientId()
      });
    } catch (error) {
      console.error('Failed to log agent response:', error);
    }
  }

  private async logAgentError(agentId: string, error: Error) {
    try {
      await supabase.from('agent_activity_log').insert({
        agent_id: agentId,
        activity_type: 'error',
        description: `Agent communication error: ${error.message}`,
        metrics: {
          error_type: error.name,
          error_message: error.message
        },
        client_id: await this.getClientId(),
        project_id: await this.getClientId()
      });
    } catch (logError) {
      console.error('Failed to log agent error:', logError);
    }
  }

  private async saveAgentConfigToStorage(agentId: string, config: ExternalAgentConfig) {
    try {
      // Store in localStorage for now - you can implement Supabase storage later
      const configs = JSON.parse(localStorage.getItem('externalAgentConfigs') || '{}');
      configs[agentId] = config;
      localStorage.setItem('externalAgentConfigs', JSON.stringify(configs));
    } catch (error) {
      console.error('Failed to save agent config:', error);
    }
  }

  private async getClientId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'anonymous';
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getAgent(agentId: string): ExternalAgentConfig | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): ExternalAgentConfig[] {
    return Array.from(this.agents.values());
  }

  getConversationAgent(): ExternalAgentConfig | undefined {
    return Array.from(this.agents.values()).find(agent => agent.type === 'conversation');
  }
}

export const externalAgentService = new ExternalAgentService();
