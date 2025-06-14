
export const MORVO_API_CONFIG = { 
  BASE_URL: "https://morvo-production.up.railway.app",
  TIMEOUT: 10000,
  ENDPOINTS: {
    HEALTH: "/health",
    AGENT_STATUS: "/agents/status",
    CHAT_MESSAGE: "/v1/chat/test", 
    SEO_AUDIT: "/seo/audit",
    ANALYTICS_STATUS: "/analytics/status"
  }
};

export type AgentId = 'M1' | 'M2' | 'M3' | 'M4' | 'M5';

export interface Agent {
  id: AgentId;
  name: string;
  description: string;
  specialization: string;
  color: string;
  emoji: string;
}

export const AGENTS: Record<AgentId, Agent> = {
  M1: {
    id: 'M1',
    name: 'الوكيل الاستراتيجي',
    description: 'التخطيط الاستراتيجي وتحليل السوق',
    specialization: 'استراتيجية التسويق',
    color: 'from-blue-500 to-blue-600',
    emoji: '🎯'
  },
  M2: {
    id: 'M2', 
    name: 'وكيل وسائل التواصل',
    description: 'إدارة واستراتيجية وسائل التواصل الاجتماعي',
    specialization: 'التسويق الاجتماعي',
    color: 'from-pink-500 to-pink-600', 
    emoji: '📱'
  },
  M3: {
    id: 'M3',
    name: 'وكيل الحملات',
    description: 'تحسين وإدارة الحملات الإعلانية',
    specialization: 'إدارة الحملات',
    color: 'from-green-500 to-green-600',
    emoji: '🚀'
  },
  M4: {
    id: 'M4',
    name: 'وكيل المحتوى', 
    description: 'إنشاء وإدارة المحتوى التسويقي',
    specialization: 'إنتاج المحتوى',
    color: 'from-purple-500 to-purple-600',
    emoji: '✍️'
  },
  M5: {
    id: 'M5',
    name: 'وكيل التحليلات',
    description: 'تحليل البيانات والتقارير التسويقية', 
    specialization: 'تحليل البيانات',
    color: 'from-orange-500 to-orange-600',
    emoji: '📊'
  }
};
