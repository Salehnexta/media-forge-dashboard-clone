
export type AgentId = 'M1' | 'M2' | 'M3' | 'M4' | 'M5';

export type AgentType = 'strategic' | 'social' | 'campaigns' | 'content' | 'analytics';

export interface Agent {
  id: AgentId;
  name: string;
  description: string;
  type: AgentType;
  color: string;
  icon: string;
}

export const agents: Record<AgentId, Agent> = {
  M1: {
    id: 'M1',
    name: 'Strategic Agent',
    description: 'Strategic planning and market analysis',
    type: 'strategic',
    color: 'bg-blue-500',
    icon: 'Brain'
  },
  M2: {
    id: 'M2',
    name: 'Social Media Agent',
    description: 'Social media management and strategy',
    type: 'social',
    color: 'bg-pink-500',
    icon: 'MessageCircle'
  },
  M3: {
    id: 'M3',
    name: 'Campaign Agent',
    description: 'Campaign optimization and management',
    type: 'campaigns',
    color: 'bg-green-500',
    icon: 'Target'
  },
  M4: {
    id: 'M4',
    name: 'Content Agent',
    description: 'Content creation and management',
    type: 'content',
    color: 'bg-purple-500',
    icon: 'Palette'
  },
  M5: {
    id: 'M5',
    name: 'Analytics Agent',
    description: 'Data analytics and reporting',
    type: 'analytics',
    color: 'bg-orange-500',
    icon: 'BarChart3'
  }
};

export const agentIdMap: Record<AgentId, string> = {
  M1: 'strategic_agent',
  M2: 'social_media_agent',
  M3: 'campaign_agent',
  M4: 'content_agent',
  M5: 'analytics_agent'
};

export const agentTypeMap: Record<AgentType, AgentId> = {
  strategic: 'M1',
  social: 'M2',
  campaigns: 'M3',
  content: 'M4',
  analytics: 'M5'
};

export const environment = {
  morvoApiUrl: 'https://morvo-production.up.railway.app',
  morvoWebSocketUrl: 'wss://morvo-production.up.railway.app/ws',
  apiKey: import.meta.env.VITE_MORVO_API_KEY || '',
  apiKeyHeader: 'X-API-Key',
  defaultLanguage: 'ar',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  agents: agents
};

// Export for backward compatibility
export const config = environment;
