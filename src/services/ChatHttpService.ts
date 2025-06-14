
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  agentsInvolved?: string[];
  processingTime?: number;
  cost?: number;
}

export interface ConnectionStatus {
  success: boolean;
  details?: any;
  isOnline?: boolean;
  httpReachable?: boolean;
}

export interface HttpConfig {
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
}

export class ChatHttpService {
  private baseUrl = 'https://morvo-production.up.railway.app';
  private isOnline = false;
  private lastHealthCheck = 0;
  private healthCheckInterval = 30000; // 30 seconds
  private messageQueue: any[] = [];
  private clientId: string;
  private conversationId: string | null = null;

  constructor() {
    console.log('🔧 ChatHttpService initialized with Railway HTTP integration');
    this.clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.startHealthChecking();
  }

  private startHealthChecking(): void {
    this.performHealthCheck();
    setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckInterval);
  }

  async connect(userId: string, token?: string, config: HttpConfig = {}): Promise<boolean> {
    console.log('🔗 Connecting to Morvo AI via HTTP...');
    
    if (config.baseUrl) {
      this.baseUrl = config.baseUrl;
    }

    const healthStatus = await this.performHealthCheck();
    
    if (healthStatus.success) {
      this.flushMessageQueue();
      toast.success('متصل بنجاح مع مورفو AI');
      return true;
    } else {
      toast.error('فشل في الاتصال مع مورفو AI');
      return false;
    }
  }

  async sendMessage(message: any): Promise<boolean> {
    const messageContent = message.content || message.message || message;
    
    if (!this.isOnline) {
      console.warn('⚠️ Service offline, queuing message');
      this.messageQueue.push(message);
      toast.warning('غير متصل - سيتم إرسال الرسالة عند الاتصال');
      return false;
    }

    try {
      console.log('📤 Sending message to Morvo AI:', messageContent);
      
      const response = await fetch(`${this.baseUrl}/v1/chat/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          client_id: this.clientId,
          conversation_id: this.conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.conversationId = data.conversation_id;

      // Dispatch response event for components to listen
      window.dispatchEvent(new CustomEvent('morvoResponse', { 
        detail: {
          message: data.message,
          agentsInvolved: data.agents_involved || [],
          processingTime: data.processing_time_ms / 1000,
          cost: data.cost_tracking?.total_cost || 0,
          conversationId: data.conversation_id,
        }
      }));

      console.log('✅ Message sent successfully');
      return true;

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      toast.error('فشل في إرسال الرسالة');
      
      // Queue message for retry
      this.messageQueue.push(message);
      return false;
    }
  }

  private flushMessageQueue(): void {
    console.log(`📬 Flushing ${this.messageQueue.length} queued messages`);
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  disconnect(): void {
    console.log('🔌 Disconnecting from Morvo AI HTTP service');
    this.isOnline = false;
  }

  isConnected(): boolean {
    return this.isOnline;
  }

  getConnectionState(): string {
    return this.isOnline ? 'connected' : 'disconnected';
  }

  async performHealthCheck(): Promise<ConnectionStatus> {
    try {
      console.log('🏥 Performing health check...');
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isHealthy = response.ok;
      this.isOnline = isHealthy;
      this.lastHealthCheck = Date.now();

      const status: ConnectionStatus = {
        success: isHealthy,
        isOnline: isHealthy,
        httpReachable: isHealthy,
        details: {
          status: response.status,
          timestamp: new Date().toISOString(),
          baseUrl: this.baseUrl,
        }
      };

      if (isHealthy) {
        console.log('✅ Health check passed');
      } else {
        console.warn('⚠️ Health check failed');
      }

      return status;

    } catch (error) {
      console.error('❌ Health check error:', error);
      this.isOnline = false;
      
      return {
        success: false,
        isOnline: false,
        httpReachable: false,
        details: {
          error: error.message,
          timestamp: new Date().toISOString(),
        }
      };
    }
  }

  async performConnectionTest(): Promise<ConnectionStatus> {
    return await this.performHealthCheck();
  }

  isInFallbackMode(): boolean {
    return !this.isOnline;
  }

  getDetailedStatus(): object {
    return {
      connectionState: this.getConnectionState(),
      isConnected: this.isConnected(),
      queuedMessages: this.messageQueue.length,
      lastHealthCheck: new Date(this.lastHealthCheck).toISOString(),
      navigatorOnline: navigator.onLine,
      fallbackMode: this.isInFallbackMode(),
      baseUrl: this.baseUrl,
      clientId: this.clientId,
      conversationId: this.conversationId,
    };
  }

  // Get available agents
  async getAgents(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/agents`);
      if (response.ok) {
        const data = await response.json();
        return data.agents || [];
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
    return [];
  }

  // Send message to specific agent
  async sendToAgent(agentId: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/agents/${agentId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          client_id: this.clientId,
          conversation_id: this.conversationId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.conversationId = data.conversation_id;
        
        window.dispatchEvent(new CustomEvent('morvoResponse', { 
          detail: {
            message: data.message,
            agentsInvolved: [agentId],
            processingTime: data.processing_time_ms / 1000,
            cost: data.cost_tracking?.total_cost || 0,
          }
        }));
        
        return true;
      }
    } catch (error) {
      console.error(`Failed to send message to agent ${agentId}:`, error);
    }
    return false;
  }
}

// Export singleton instance
export const chatHttpService = new ChatHttpService();

// Export types
export type { ConnectionStatus, HttpConfig };
