
/**
 * Morvo AI Production API Configuration
 * Centralized configuration for Railway Production Backend
 */

export const MORVO_API_CONFIG = {
  BASE_URL: 'https://morvo-production.up.railway.app',
  ENDPOINTS: {
    HEALTH: '/health',
    AGENT_STATUS: '/api/v2/chat/agents/status',
    CHAT_MESSAGE: '/api/v2/chat/message',
    SEO_AUDIT: '/api/v2/seo/audit',
    ANALYTICS_STATUS: '/api/v2/analytics/providers/status'
  },
  TIMEOUT: 10000,
  RETRY_COUNT: 3
};

export const AGENTS = {
  M1: {
    id: 'm1',
    name: 'أحمد - المحلل الاستراتيجي',
    specialization: 'تحليل السوق والاستراتيجية',
    color: 'from-blue-500 to-blue-600',
    emoji: '🎯'
  },
  M2: {
    id: 'm2',
    name: 'فاطمة - مديرة وسائل التواصل',
    specialization: 'إدارة المنصات الاجتماعية',
    color: 'from-pink-500 to-pink-600',
    emoji: '📱'
  },
  M3: {
    id: 'm3',
    name: 'محمد - مدير الحملات',
    specialization: 'تنفيذ وإدارة الحملات',
    color: 'from-green-500 to-green-600',
    emoji: '🚀'
  },
  M4: {
    id: 'm4',
    name: 'نورا - مديرة المحتوى',
    specialization: 'إنتاج المحتوى الإبداعي',
    color: 'from-purple-500 to-purple-600',
    emoji: '✨'
  },
  M5: {
    id: 'm5',
    name: 'خالد - محلل البيانات',
    specialization: 'تحليل البيانات والتقارير',
    color: 'from-orange-500 to-orange-600',
    emoji: '📊'
  }
} as const;

export type AgentId = keyof typeof AGENTS;
