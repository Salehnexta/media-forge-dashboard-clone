
// Agent types and endpoints for Railway integration
export const AGENT_TYPES = {
  M1: 'M1_STRATEGIC',
  M2: 'M2_SOCIAL', 
  M3: 'M3_CAMPAIGN',
  M4: 'M4_CONTENT',
  M5: 'M5_ANALYTICS'
} as const;

export const AGENT_ENDPOINTS = {
  [AGENT_TYPES.M1]: '/api/v2/agents/m1/strategic-analysis',
  [AGENT_TYPES.M2]: '/api/v2/agents/m2/social-monitoring',
  [AGENT_TYPES.M3]: '/api/v2/agents/m3/campaign-optimization',
  [AGENT_TYPES.M4]: '/api/v2/agents/m4/content-strategy',
  [AGENT_TYPES.M5]: '/api/v2/agents/m5/data-analytics'
} as const;

export const CREW_ENDPOINTS = {
  MARKET_ANALYSIS: '/api/v2/crews/market-analysis',         // M1 + M5
  CONTENT_SOCIAL: '/api/v2/crews/content-social',           // M2 + M4
  CAMPAIGN_EXECUTION: '/api/v2/crews/campaign-execution',   // M3 + M2 + M5
  COMPLETE_AUTOMATION: '/api/v2/marketing/complete-automation' // All M1-M5
} as const;

export const AGENT_NAMES_AR = {
  [AGENT_TYPES.M1]: 'أحمد - المحلل الاستراتيجي',
  [AGENT_TYPES.M2]: 'فاطمة - مديرة وسائل التواصل',
  [AGENT_TYPES.M3]: 'محمد - مدير الحملات',
  [AGENT_TYPES.M4]: 'نورا - مديرة المحتوى',
  [AGENT_TYPES.M5]: 'خالد - محلل البيانات'
} as const;

export type AgentType = typeof AGENT_TYPES[keyof typeof AGENT_TYPES];
export type CrewType = keyof typeof CREW_ENDPOINTS;
