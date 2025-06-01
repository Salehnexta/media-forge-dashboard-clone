
// Main Railway API client with performance optimizations
import axios from 'axios';
import { AGENT_ENDPOINTS, CREW_ENDPOINTS, AgentType, CrewType } from './agentEndpoints';
import { getAuthHeaders, isTokenValid, initializeAuth } from './authService';
import { handleApiError, isRetryableError, ProcessedError } from './errorHandling';

const RAILWAY_BASE_URL = 'https://crewai-production-d99a.up.railway.app:8000';
const DEFAULT_TIMEOUT = 120000; // 2 minutes for long-running operations

// Connection pooling and request batching
const connectionPool = new Map<string, Promise<any>>();
const requestBatch = new Map<string, Array<{ resolve: Function, reject: Function }>>();

// Initialize auth on module load
initializeAuth();

// Create axios instance with optimized config
const railwayClient = axios.create({
  baseURL: RAILWAY_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Keep-Alive': 'timeout=120, max=1000',
    'Connection': 'keep-alive'
  }
});

// Add request interceptor for auth headers
railwayClient.interceptors.request.use(
  (config) => {
    if (!isTokenValid()) {
      return Promise.reject(new Error('No valid Railway token available'));
    }
    
    const authHeaders = getAuthHeaders();
    Object.keys(authHeaders).forEach(key => {
      config.headers.set(key, authHeaders[key]);
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Cache for frequently accessed data
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Retry logic with exponential backoff
const retryRequest = async (errorConfig: any, maxRetries = 3) => {
  let retryCount = 0;
  let lastError = null;
  
  while (retryCount < maxRetries) {
    try {
      retryCount++;
      const delay = Math.pow(2, retryCount - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return await railwayClient(errorConfig);
    } catch (error) {
      lastError = error;
      const processedError = handleApiError(error);
      
      if (!isRetryableError(processedError.type)) {
        break;
      }
    }
  }
  
  throw lastError;
};

interface CompanyData {
  company_name: string;
  industry: string;
  website_url?: string;
  description?: string;
  target_market?: string[];
  [key: string]: any;
}

interface AgentOptions {
  analysisMode?: string;
  language?: string;
  noRetry?: boolean;
  additionalParams?: Record<string, any>;
}

// Batch similar requests together
const batchRequest = async (key: string, requestFn: () => Promise<any>) => {
  if (requestBatch.has(key)) {
    return new Promise((resolve, reject) => {
      requestBatch.get(key)!.push({ resolve, reject });
    });
  }

  requestBatch.set(key, []);
  
  try {
    const result = await requestFn();
    requestBatch.get(key)?.forEach(({ resolve }) => resolve(result));
    requestBatch.delete(key);
    return result;
  } catch (error) {
    requestBatch.get(key)?.forEach(({ reject }) => reject(error));
    requestBatch.delete(key);
    throw error;
  }
};

// API functions with performance optimizations
export const checkRailwayHealth = async () => {
  const cacheKey = 'railway_health';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  try {
    const response = await railwayClient.get('/health');
    const result = { status: response.status === 200 ? 'online' : 'offline' };
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    const processedError = handleApiError(error);
    return { status: 'offline', error: processedError };
  }
};

export const runAgent = async (agentType: AgentType, companyData: CompanyData, options: AgentOptions = {}) => {
  try {
    if (!AGENT_ENDPOINTS[agentType]) {
      throw new Error(`Unknown agent type: ${agentType}`);
    }
    
    const endpoint = AGENT_ENDPOINTS[agentType];
    const payload = {
      company_info: companyData,
      analysis_mode: options.analysisMode || 'comprehensive',
      language: options.language || 'ar',
      ...options.additionalParams
    };
    
    // Use batching for similar requests
    const batchKey = `agent_${agentType}_${JSON.stringify(payload)}`;
    
    return await batchRequest(batchKey, async () => {
      const response = await railwayClient.post(endpoint, payload);
      return response.data;
    });
  } catch (error) {
    const processedError = handleApiError(error);
    
    if (isRetryableError(processedError.type) && !options.noRetry) {
      return retryRequest({
        method: 'post',
        url: AGENT_ENDPOINTS[agentType],
        data: {
          company_info: companyData,
          analysis_mode: options.analysisMode || 'comprehensive',
          language: options.language || 'ar',
          ...options.additionalParams
        }
      });
    }
    
    throw processedError;
  }
};

export const runCrew = async (crewType: CrewType, companyData: CompanyData, options: AgentOptions = {}) => {
  try {
    if (!CREW_ENDPOINTS[crewType]) {
      throw new Error(`Unknown crew type: ${crewType}`);
    }
    
    const endpoint = CREW_ENDPOINTS[crewType];
    const payload = {
      company_info: companyData,
      analysis_mode: options.analysisMode || 'comprehensive',
      language: options.language || 'ar',
      ...options.additionalParams
    };
    
    const response = await railwayClient.post(endpoint, payload);
    return response.data;
  } catch (error) {
    const processedError = handleApiError(error);
    
    if (isRetryableError(processedError.type) && !options.noRetry) {
      return retryRequest({
        method: 'post',
        url: CREW_ENDPOINTS[crewType],
        data: {
          company_info: companyData,
          analysis_mode: options.analysisMode || 'comprehensive',
          language: options.language || 'ar',
          ...options.additionalParams
        }
      });
    }
    
    throw processedError;
  }
};

export const checkAgentStatus = async (executionId: string) => {
  try {
    const response = await railwayClient.get(`/api/v2/status/${executionId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default {
  checkRailwayHealth,
  runAgent,
  runCrew,
  checkAgentStatus
};
