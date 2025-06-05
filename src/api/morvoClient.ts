
// Enhanced API client for Morvo AI with Railway/FastAPI integration
import { toast } from "sonner";

interface APIConfig {
  baseURL: string;
  wsURL: string;
  timeout: number;
  retryAttempts: number;
}

class MorvoAPIClient {
  private config: APIConfig;

  constructor() {
    // Environment-based configuration
    const isProduction = import.meta.env.PROD;
    
    this.config = {
      baseURL: isProduction 
        ? 'https://morvo-ai-v2.up.railway.app'
        : 'http://localhost:8090',
      wsURL: isProduction
        ? 'wss://morvo-ai-v2.up.railway.app/ws'
        : 'ws://localhost:8090/ws',
      timeout: 30000,
      retryAttempts: 3
    };

    console.log('🔧 MorvoAPI initialized:', {
      environment: isProduction ? 'Production' : 'Development',
      baseURL: this.config.baseURL,
      wsURL: this.config.wsURL
    });
  }

  // Enhanced request with retry logic
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();

      } catch (error: any) {
        console.warn(`🔄 Attempt ${attempt} failed:`, error.message);
        
        if (attempt === this.config.retryAttempts) {
          const message = `فشل في الاتصال بعد ${this.config.retryAttempts} محاولات`;
          toast.error(message);
          throw new Error(`${message}: ${error.message}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // API Methods
  async health() {
    return await this.request('/health');
  }

  async sendMessage(message: string, userId: string = 'user_123') {
    return await this.request('/api/v2/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, user_id: userId })
    });
  }

  async analyzeWebsite(url: string, orgId: string = 'org_123') {
    return await this.request('/api/v2/website/analyze', {
      method: 'POST',
      body: JSON.stringify({ url, org_id: orgId })
    });
  }

  async getAvailablePlatforms() {
    return await this.request('/api/v2/platforms/available');
  }

  async connectPlatform(platform: string, credentials: any, orgId: string = 'org_123') {
    return await this.request('/api/v2/platforms/connect', {
      method: 'POST',
      body: JSON.stringify({ platform, credentials, org_id: orgId })
    });
  }

  async getPlatformStatus(orgId: string) {
    return await this.request(`/api/v2/platforms/status/${orgId}`);
  }

  // WebSocket connection
  connectWebSocket(
    onMessage: (data: any) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
  ): WebSocket {
    const ws = new WebSocket(`${this.config.wsURL}/chat`);
    
    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      toast.success('متصل بالخادم');
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
      toast.error('خطأ في الاتصال');
      if (onError) onError(error);
    };
    
    ws.onclose = () => {
      console.log('❌ WebSocket disconnected');
      toast.warning('انقطع الاتصال');
      if (onClose) onClose();
    };
    
    return ws;
  }

  sendWebSocketMessage(ws: WebSocket, message: string, userId: string = 'user_123') {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'chat_message',
        message: message,
        user_id: userId,
        timestamp: new Date().toISOString()
      }));
    }
  }

  // Test all connections
  async testConnection(): Promise<{
    api: boolean;
    websocket: boolean;
    overall: boolean;
  }> {
    const results = {
      api: false,
      websocket: false,
      overall: false
    };

    try {
      // Test API
      console.log('📡 Testing FastAPI...');
      const healthCheck = await this.health();
      results.api = healthCheck && (healthCheck.status === 'healthy' || healthCheck.status === 'ok');
      console.log(results.api ? '✅ FastAPI connected' : '❌ FastAPI not connected');
      
      // Test WebSocket
      console.log('🔌 Testing WebSocket...');
      const wsTest = new Promise<boolean>((resolve) => {
        const ws = this.connectWebSocket(
          () => {
            results.websocket = true;
            ws.close();
            resolve(true);
          },
          () => resolve(false),
          () => resolve(false)
        );
        
        // Timeout after 5 seconds
        setTimeout(() => {
          ws.close();
          resolve(false);
        }, 5000);
      });
      
      results.websocket = await wsTest;
      console.log(results.websocket ? '✅ WebSocket connected' : '❌ WebSocket not connected');
      
      results.overall = results.api || results.websocket; // At least one should work
      
      console.log(`\n🎯 Overall status: ${results.overall ? '✅ System operational' : '❌ System issues'}`);
      
      return results;
      
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return results;
    }
  }
}

// Export singleton instance
export const morvoAPI = new MorvoAPIClient();
export default morvoAPI;
