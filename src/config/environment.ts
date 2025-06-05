
/**
 * Morvo AI Environment Configuration
 * Centralized configuration with validation and type safety
 */

interface MorvoEnvironment {
  // Core API Configuration
  openaiApiKey: string;
  apiKey: string;
  apiKeyHeader: string;
  
  // Supabase Configuration
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  supabaseProjectRef: string;
  supabaseAccessToken: string;
  
  // Morvo API Configuration - Updated for Railway Production
  morvoApiUrl: string;
  morvoWebSocketUrl: string;
  
  // MCP Configuration
  mcpEnabled: boolean;
  mcpMemoryTable: string;
  mcpContextTable: string;
  mcpMaxMemoriesPerAgent: number;
  
  // Agent Configuration
  agents: {
    M1: { id: string; name: string; type: 'strategic' };
    M2: { id: string; name: string; type: 'monitor' };
    M3: { id: string; name: string; type: 'executor' };
    M4: { id: string; name: string; type: 'creative' };
    M5: { id: string; name: string; type: 'analyst' };
  };
  
  // Language Configuration
  defaultLanguage: string;
  supportedLanguages: string[];
  
  // Environment Info
  isDevelopment: boolean;
  isProduction: boolean;
  port: number;
  logLevel: string;
}

// Environment variable validation
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[`VITE_${key}`] || defaultValue;
  if (!value && !defaultValue) {
    console.warn(`⚠️ Missing environment variable: VITE_${key}`);
    return '';
  }
  return value;
};

// Environment configuration with Railway Production URLs
export const environment: MorvoEnvironment = {
  // Core API Configuration
  openaiApiKey: getEnvVar('OPENAI_API_KEY', ''),
  apiKey: getEnvVar('MORVO_API_KEY', 'morvo-production-key'),
  apiKeyHeader: getEnvVar('API_KEY_HEADER', 'X-API-Key'),
  
  // Supabase Configuration
  supabaseUrl: getEnvVar('SUPABASE_URL', 'https://teniefzxdikestahndur.supabase.co'),
  supabaseAnonKey: getEnvVar('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjI2NTIsImV4cCI6MjA2NDE5ODY1Mn0.k5eor_-j2aTheb1q6OhGK8DWGjucRWK11eFAOpAZP3I'),
  supabaseServiceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', ''),
  supabaseProjectRef: getEnvVar('SUPABASE_PROJECT_REF', 'teniefzxdikestahndur'),
  supabaseAccessToken: getEnvVar('SUPABASE_ACCESS_TOKEN', ''),
  
  // Railway Production URLs - Direct Production Connection
  morvoApiUrl: getEnvVar('MORVO_BASE_URL', 'https://morvo-ai-v2.up.railway.app'),
  morvoWebSocketUrl: getEnvVar('MORVO_WS_URL', 'wss://morvo-ai-v2.up.railway.app/ws'),
  
  // MCP Configuration
  mcpEnabled: getEnvVar('MCP_ENABLED', 'true') === 'true',
  mcpMemoryTable: getEnvVar('MCP_MEMORY_TABLE', 'agent_memories'),
  mcpContextTable: getEnvVar('MCP_CONTEXT_TABLE', 'cross_agent_context'),
  mcpMaxMemoriesPerAgent: parseInt(getEnvVar('MCP_MAX_MEMORIES_PER_AGENT', '50')),
  
  // Agent Configuration
  agents: {
    M1: { 
      id: getEnvVar('M1_AGENT_ID', 'm1'), 
      name: 'المدير الاستراتيجي', 
      type: 'strategic' as const 
    },
    M2: { 
      id: getEnvVar('M2_AGENT_ID', 'm2'), 
      name: 'مراقب وسائل التواصل', 
      type: 'monitor' as const 
    },
    M3: { 
      id: getEnvVar('M3_AGENT_ID', 'm3'), 
      name: 'منفذ الحملات', 
      type: 'executor' as const 
    },
    M4: { 
      id: getEnvVar('M4_AGENT_ID', 'm4'), 
      name: 'المبدع الإبداعي', 
      type: 'creative' as const 
    },
    M5: { 
      id: getEnvVar('M5_AGENT_ID', 'm5'), 
      name: 'محلل البيانات', 
      type: 'analyst' as const 
    }
  },
  
  // Language Configuration
  defaultLanguage: getEnvVar('DEFAULT_LANGUAGE', 'ar'),
  supportedLanguages: getEnvVar('SUPPORTED_LANGUAGES', 'ar,en').split(','),
  
  // Environment Info
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  port: parseInt(getEnvVar('PORT', '8080')),
  logLevel: getEnvVar('LOG_LEVEL', 'INFO')
};

// Environment validation function
export const validateEnvironment = (): boolean => {
  const requiredVars = [
    'supabaseUrl',
    'supabaseAnonKey'
  ];
  
  const missingVars = requiredVars.filter(key => !environment[key as keyof MorvoEnvironment]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars);
    return false;
  }
  
  console.log('✅ Environment configuration loaded successfully');
  console.log('🔧 Environment:', environment.isDevelopment ? 'Development' : 'Production');
  console.log('🌐 Morvo API:', environment.morvoApiUrl);
  console.log('🗄️ Supabase:', environment.supabaseUrl);
  console.log('🤖 MCP Enabled:', environment.mcpEnabled);
  
  return true;
};

// Agent type mappings
export const agentTypeMap = {
  'strategic': 'M1',
  'monitor': 'M2', 
  'executor': 'M3',
  'creative': 'M4',
  'analyst': 'M5'
} as const;

export const agentIdMap = {
  'M1': 'strategic',
  'M2': 'monitor',
  'M3': 'executor', 
  'M4': 'creative',
  'M5': 'analyst'
} as const;

export type AgentId = keyof typeof agentIdMap;
export type AgentType = keyof typeof agentTypeMap;
