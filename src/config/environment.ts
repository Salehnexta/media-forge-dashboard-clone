
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

// Environment variable validation with multiple fallback options
const getEnvVar = (key: string, defaultValue?: string): string => {
  // Try multiple environment variable naming conventions
  const viteKey = `VITE_${key}`;
  const regularKey = key;
  
  const value = import.meta.env[viteKey] || 
                import.meta.env[regularKey] || 
                defaultValue;
  
  if (!value && !defaultValue) {
    console.warn(`⚠️ Missing environment variable: ${viteKey} or ${regularKey}`);
    return '';
  }
  return value;
};

// Environment configuration with proper fallbacks
export const environment: MorvoEnvironment = {
  // Core API Configuration
  openaiApiKey: getEnvVar('OPENAI_API_KEY', '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'),
  apiKey: getEnvVar('API_KEY', 'generated_secure_api_key_here'),
  apiKeyHeader: getEnvVar('API_KEY_HEADER', 'X-API-Key'),
  
  // Supabase Configuration with fallbacks
  supabaseUrl: getEnvVar('SUPABASE_URL', 'https://teniefzxdikestahdnur.supabase.co'),
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 
                   import.meta.env.SUPABASE_ANON_KEY || 
                   import.meta.env.SUPABASE_KEY ||
                   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDczMjcsImV4cCI6MjA2NDg4MzMyN30.9-WD35_UTe4_nBLMxZaSNS-VWfZit5ORUI6jahEYQUM',
  supabaseServiceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', ''),
  supabaseProjectRef: getEnvVar('SUPABASE_PROJECT_REF', 'teniefzxdikestahdnur'),
  supabaseAccessToken: getEnvVar('SUPABASE_ACCESS_TOKEN', ''),
  
  // Railway Production URLs - Direct Production Connection
  morvoApiUrl: getEnvVar('MORVO_API_URL', 'https://morvo-production.up.railway.app'),
  morvoWebSocketUrl: getEnvVar('MORVO_WS_URL', 'wss://morvo-production.up.railway.app/ws'),
  
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
