
// Enhanced API client with retry logic and caching
class MorvoAPIClient {
  private baseURL: string;
  private wsURL: string;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private retryAttempts: number;
  private timeout: number;

  constructor() {
    this.baseURL = import.meta.env.PROD 
      ? 'https://morvo-ai-v2.up.railway.app'
      : 'http://localhost:8090';
    this.wsURL = import.meta.env.PROD
      ? 'wss://morvo-ai-v2.up.railway.app/ws'
      : 'ws://localhost:8090/ws';
    
    this.cache = new Map();
    this.retryAttempts = 3;
    this.timeout = 30000;
  }

  // Cache management
  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}_${JSON.stringify(params || {})}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  // Enhanced request with retry and caching
  async request(endpoint: string, options: RequestInit = {}, useCache: boolean = true, cacheTTL: number = 300000): Promise<any> {
    const cacheKey = this.getCacheKey(endpoint, options.body);
    
    // Check cache for GET requests
    if (useCache && (!options.method || options.method === 'GET')) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful GET requests
        if (useCache && (!options.method || options.method === 'GET')) {
          this.setCache(cacheKey, data, cacheTTL);
        }

        return data;

      } catch (error: any) {
        console.warn(`🔄 Attempt ${attempt} failed:`, error.message);
        
        if (attempt === this.retryAttempts) {
          throw new Error(`Failed after ${this.retryAttempts} attempts: ${error.message}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  // API methods
  async health() {
    return this.request('/health');
  }

  async sendMessage(message: string, userId: string = 'user_123') {
    return this.request('/api/v2/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, user_id: userId })
    }, false); // Don't cache chat messages
  }

  async analyzeWebsite(url: string, orgId: string = 'org_123') {
    return this.request('/api/v2/website/analyze', {
      method: 'POST',
      body: JSON.stringify({ url, org_id: orgId })
    }, false);
  }

  async getAvailablePlatforms() {
    return this.request('/api/v2/platforms/available', {}, true, 600000); // Cache for 10 minutes
  }

  async connectPlatform(platform: string, credentials: any, orgId: string = 'org_123') {
    return this.request('/api/v2/platforms/connect', {
      method: 'POST',
      body: JSON.stringify({ platform, credentials, org_id: orgId })
    }, false);
  }

  async getPlatformStatus(orgId: string) {
    return this.request(`/api/v2/platforms/status/${orgId}`);
  }

  // WebSocket connection with auto-reconnect
  connectWebSocket(
    onMessage: (data: any) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
  ): WebSocket {
    const ws = new WebSocket(`${this.wsURL}/chat`);
    
    ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError?.(error);
    };
    
    ws.onclose = () => {
      console.log('❌ WebSocket disconnected');
      onClose?.();
    };
    
    return ws;
  }

  sendWebSocketMessage(ws: WebSocket, message: string, userId: string = 'user_123') {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'chat_message',
        message,
        user_id: userId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  // Test full connectivity
  async testConnection() {
    const results = {
      api: false,
      websocket: false,
      platforms: false,
      overall: false
    };

    try {
      // Test API
      const health = await this.health();
      results.api = health.status === 'healthy';

      // Test platforms
      const platforms = await this.getAvailablePlatforms();
      results.platforms = Array.isArray(platforms);

      // Test WebSocket
      const wsTest = new Promise<boolean>((resolve) => {
        const ws = this.connectWebSocket(
          () => {
            ws.close();
            resolve(true);
          },
          () => resolve(false),
          () => resolve(false)
        );

        setTimeout(() => {
          ws.close();
          resolve(false);
        }, 5000);
      });

      results.websocket = await wsTest;
      results.overall = results.api && results.platforms;

      return results;
    } catch (error) {
      console.error('Connection test failed:', error);
      return results;
    }
  }
}

const morvoAPI = new MorvoAPIClient();
export default morvoAPI;
