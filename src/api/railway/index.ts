
// Main Railway API client
import axios from 'axios';
import { AGENT_ENDPOINTS, CREW_ENDPOINTS, AgentType, CrewType } from './agentEndpoints';
import { getAuthHeaders, isTokenValid, initializeAuth } from './authService';
import { handleApiError, isRetryableError, ProcessedError } from './errorHandling';

const RAILWAY_BASE_URL = import.meta.env.VITE_RAILWAY_API_URL || 'https://crewai-production-d99a.up.railway.app';
const DEFAULT_TIMEOUT = parseInt(import.meta.env.VITE_RAILWAY_TIMEOUT || '120000');

// Initialize auth on module load
initializeAuth();

// Create axios instance with default config
const railwayClient = axios.create({
  baseURL: RAILWAY_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
});

// Add request interceptor for auth headers
railwayClient.interceptors.request.use(
  (config) => {
    if (!isTokenValid()) {
      return Promise.reject(new Error('No valid Railway token available'));
    }
    
    // Add auth headers to every request
    const authHeaders = getAuthHeaders();
    Object.keys(authHeaders).forEach(key => {
      config.headers.set(key, authHeaders[key]);
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Retry logic for failed requests
const retryRequest = async (errorConfig: any, maxRetries = 3) => {
  let retryCount = 0;
  let lastError = null;
  
  while (retryCount < maxRetries) {
    try {
      retryCount++;
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, retryCount - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return await railwayClient(errorConfig);
    } catch (error) {
      lastError = error;
      const processedError = handleApiError(error);
      
      // Only retry if it's a retryable error
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

// API functions
export const checkRailwayHealth = async () => {
  try {
    const response = await railwayClient.get('/health');
    return { status: response.status === 200 ? 'online' : 'offline' };
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
    
    const response = await railwayClient.post(endpoint, payload);
    return response.data;
  } catch (error) {
    const processedError = handleApiError(error);
    
    // Retry logic for certain errors
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
    
    // Retry logic for certain errors
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
