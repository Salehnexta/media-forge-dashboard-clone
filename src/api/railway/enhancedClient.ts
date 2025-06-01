
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { connectionPool } from './connectionPool';
import { handleApiError, isRetryableError } from './errorHandling';
import { getAuthHeaders, isTokenValid } from './authService';

class EnhancedRailwayClient {
  private client: AxiosInstance;
  private requestQueue: Map<string, Promise<any>> = new Map();
  private rateLimitCounter: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: 'https://crewai-production-d99a.up.railway.app:8000',
      timeout: 120000,
      headers: {
        'Keep-Alive': 'timeout=120, max=1000',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (!isTokenValid()) {
          throw new Error('No valid Railway token available');
        }

        const authHeaders = getAuthHeaders();
        Object.assign(config.headers, authHeaders);

        // Add connection ID for tracking
        const connectionId = connectionPool.getConnection();
        config.metadata = { connectionId };

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const connectionId = response.config.metadata?.connectionId;
        if (connectionId) {
          connectionPool.releaseConnection(connectionId);
          connectionPool.resetRetry(connectionId);
        }
        return response;
      },
      async (error) => {
        const connectionId = error.config?.metadata?.connectionId;
        if (connectionId) {
          connectionPool.releaseConnection(connectionId);
        }

        const processedError = handleApiError(error);
        
        // Implement retry logic with exponential backoff
        if (isRetryableError(processedError.type) && this.shouldRetry(error.config)) {
          return this.retryRequest(error.config);
        }

        return Promise.reject(processedError);
      }
    );
  }

  private shouldRetry(config: any): boolean {
    const connectionId = config.metadata?.connectionId;
    if (!connectionId) return false;

    const retryCount = connectionPool.incrementRetry(connectionId);
    return retryCount <= 3;
  }

  private async retryRequest(config: any): Promise<AxiosResponse> {
    const connectionId = config.metadata?.connectionId;
    const retryCount = connectionId ? connectionPool.incrementRetry(connectionId) : 1;
    
    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount - 1) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Get new connection for retry
    const newConnectionId = connectionPool.getConnection();
    config.metadata = { connectionId: newConnectionId };

    return this.client(config);
  }

  // Request deduplication
  private getDedupKey(config: AxiosRequestConfig): string {
    const { method, url, data } = config;
    return `${method}:${url}:${JSON.stringify(data)}`;
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    // Check rate limiting
    if (this.isRateLimited(config.url || '')) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Request deduplication for GET requests
    if (config.method?.toLowerCase() === 'get') {
      const dedupKey = this.getDedupKey(config);
      
      if (this.requestQueue.has(dedupKey)) {
        return this.requestQueue.get(dedupKey)!;
      }

      const promise = this.client(config).then(response => response.data);
      this.requestQueue.set(dedupKey, promise);

      // Clean up after completion
      promise.finally(() => {
        this.requestQueue.delete(dedupKey);
      });

      return promise;
    }

    const response = await this.client(config);
    return response.data;
  }

  private isRateLimited(endpoint: string): boolean {
    const now = Date.now();
    const limit = this.rateLimitCounter.get(endpoint);

    if (!limit) {
      this.rateLimitCounter.set(endpoint, { count: 1, resetTime: now + 60000 });
      return false;
    }

    if (now > limit.resetTime) {
      this.rateLimitCounter.set(endpoint, { count: 1, resetTime: now + 60000 });
      return false;
    }

    if (limit.count >= 50) { // 50 requests per minute
      return true;
    }

    limit.count++;
    return false;
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'get', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'post', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'put', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'delete', url });
  }
}

export const enhancedRailwayClient = new EnhancedRailwayClient();
