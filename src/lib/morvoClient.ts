
import { environment } from '@/config/environment';

interface MorvoMessage {
  type: string;
  content: string;
  timestamp: string;
  sender: 'user' | 'assistant' | 'system';
}

interface WebSocketOptions {
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export class MorvoClient {
  private ws: WebSocket | null = null;
  private baseURL: string;
  private wsURL: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  constructor() {
    this.baseURL = environment.morvoApiUrl;
    this.wsURL = environment.morvoWebSocketUrl;
    console.log('🔧 Morvo Client initialized:', { baseURL: this.baseURL, wsURL: this.wsURL });
  }

  async connectWebSocket(options: WebSocketOptions = {}): Promise<WebSocket> {
    const { onMessage, onConnect, onDisconnect, onError } = options;

    if (this.ws?.readyState === WebSocket.OPEN) {
      return this.ws;
    }

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsURL);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected to Morvo');
          this.reconnectAttempts = 0;
          onConnect?.();
          resolve(this.ws!);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            onMessage?.(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('❌ WebSocket disconnected from Morvo');
          onDisconnect?.();
          this.attemptReconnect(options);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          onError?.(error);
          reject(error);
        };

        // Timeout after 10 seconds
        setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000);

      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        reject(error);
      }
    });
  }

  private attemptReconnect(options: WebSocketOptions) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket(options);
      }, this.reconnectInterval * this.reconnectAttempts);
    }
  }

  async sendMessage(content: string, userId = 'user_123'): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/api/v2/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': environment.apiKey
        },
        body: JSON.stringify({
          message: content,
          user_id: userId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  sendWebSocketMessage(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      return true;
    }
    console.warn('WebSocket is not connected');
    return false;
  }

  async analyzeWebsite(url: string, orgId = 'org_123'): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/api/v2/website/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': environment.apiKey
        },
        body: JSON.stringify({ url, org_id: orgId })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to analyze website:', error);
      throw error;
    }
  }

  async getAvailablePlatforms(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/v2/platforms/available`, {
        headers: {
          'X-API-Key': environment.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get platforms:', error);
      throw error;
    }
  }

  async testConnection(): Promise<{ api: boolean; websocket: boolean; overall: boolean }> {
    try {
      // Test API
      const healthResponse = await fetch(`${this.baseURL}/health`);
      const apiConnected = healthResponse.ok;

      // Test WebSocket
      let wsConnected = false;
      try {
        const ws = await this.connectWebSocket();
        wsConnected = ws.readyState === WebSocket.OPEN;
        ws.close();
      } catch (error) {
        wsConnected = false;
      }

      return {
        api: apiConnected,
        websocket: wsConnected,
        overall: apiConnected && wsConnected
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return { api: false, websocket: false, overall: false };
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const morvoClient = new MorvoClient();
export default morvoClient;
