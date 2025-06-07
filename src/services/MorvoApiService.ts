
import { MORVO_API_CONFIG, AGENTS, AgentId } from '@/config/morvoApi';

export interface AgentStatus {
  agent_id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  last_seen: string;
  specialization: string;
}

export interface ChatMessage {
  message: string;
  agent_id?: string;
  user_id?: string;
}

export interface ChatResponse {
  response: string;
  agent_id: string;
  timestamp: string;
  conversation_id?: string;
}

export interface SEOAuditRequest {
  website: string;
  detailed?: boolean;
}

export interface SEOAuditResult {
  url: string;
  score: number;
  issues: Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  recommendations: string[];
  performance_metrics: Record<string, any>;
}

export class MorvoApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = MORVO_API_CONFIG.BASE_URL;
    this.timeout = MORVO_API_CONFIG.TIMEOUT;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request(MORVO_API_CONFIG.ENDPOINTS.HEALTH);
  }

  async getAgentStatus(): Promise<AgentStatus[]> {
    try {
      const response = await this.request<{ agents: AgentStatus[] }>(
        MORVO_API_CONFIG.ENDPOINTS.AGENT_STATUS
      );
      return response.agents || [];
    } catch (error) {
      // Return mock data if API is unavailable
      return Object.entries(AGENTS).map(([id, agent]) => ({
        agent_id: id.toLowerCase(),
        name: agent.name,
        status: 'online' as const,
        last_seen: new Date().toISOString(),
        specialization: agent.specialization
      }));
    }
  }

  async sendChatMessage(message: ChatMessage): Promise<ChatResponse> {
    return this.request<ChatResponse>(
      MORVO_API_CONFIG.ENDPOINTS.CHAT_MESSAGE,
      {
        method: 'POST',
        body: JSON.stringify(message),
      }
    );
  }

  async performSEOAudit(request: SEOAuditRequest): Promise<SEOAuditResult> {
    return this.request<SEOAuditResult>(
      MORVO_API_CONFIG.ENDPOINTS.SEO_AUDIT,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  async getAnalyticsStatus(): Promise<any> {
    return this.request(MORVO_API_CONFIG.ENDPOINTS.ANALYTICS_STATUS);
  }
}

export const morvoApiService = new MorvoApiService();
