
import { toast } from 'sonner';
import { railwayConnectionService } from './RailwayConnectionService';
import { DiagnosticService } from './chat/DiagnosticService';
import { FallbackService } from './chat/FallbackService';
import { ConnectionManager } from './chat/ConnectionManager';
import { ChatMessage, WebSocketConfig, ConnectionStatus } from './chat/types';
import { chatHttpService } from './ChatHttpService';

export class ChatWebSocketService {
  private connectionManager: ConnectionManager;
  private diagnosticService: DiagnosticService;
  private fallbackService: FallbackService;
  private messageQueue: any[] = [];
  
  constructor() {
    console.log('🔧 ChatWebSocketService initialized with HTTP integration (WebSocket compatibility layer)');
    this.diagnosticService = new DiagnosticService();
    this.fallbackService = new FallbackService();
    this.connectionManager = new ConnectionManager(this.diagnosticService, this.fallbackService);
  }

  async connect(userId: string, token?: string, config: WebSocketConfig = {}): Promise<boolean> {
    // Use HTTP service instead of WebSocket
    const connected = await chatHttpService.connect(userId, token, config);
    
    if (connected) {
      this.flushMessageQueue();
    }
    
    return connected;
  }

  sendMessage(message: any): boolean {
    if (chatHttpService.isConnected()) {
      return chatHttpService.sendMessage(message);
    } else if (this.fallbackService.isInFallbackMode()) {
      // Handle message in fallback mode
      console.log('📤 Handling message in fallback mode');
      setTimeout(() => {
        const fallbackResponse = this.fallbackService.generateFallbackResponse(message.content || message.message);
        // We need to access the config from connection manager, but for now we'll use a simple approach
        window.dispatchEvent(new CustomEvent('fallbackMessage', { detail: fallbackResponse }));
      }, 1000);
      return true;
    } else {
      console.warn('⚠️ Service not connected, queuing message');
      this.messageQueue.push(message);
      
      // Try reconnecting
      if (!chatHttpService.isConnected()) {
        const userId = localStorage.getItem('morvo_user_id') || 'guest';
        const token = localStorage.getItem('morvo_auth_token');
        this.connect(userId, token);
      }
      
      return false;
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  disconnect(): void {
    chatHttpService.disconnect();
  }

  isConnected(): boolean {
    return chatHttpService.isConnected();
  }

  getConnectionState(): string {
    return chatHttpService.getConnectionState();
  }

  getDiagnosticHistory() {
    return this.diagnosticService.getDiagnosticHistory();
  }

  getDetailedStatus(): object {
    return {
      connectionState: this.getConnectionState(),
      isConnected: this.isConnected(),
      queuedMessages: this.messageQueue.length,
      lastEvents: this.diagnosticService.getDiagnosticHistory().slice(-5),
      navigatorOnline: navigator.onLine,
      fallbackMode: this.fallbackService.isInFallbackMode(),
      httpServiceStatus: chatHttpService.getDetailedStatus()
    };
  }

  async performConnectionTest(): Promise<ConnectionStatus> {
    const httpStatus = await chatHttpService.performConnectionTest();
    return {
      success: httpStatus.success,
      details: httpStatus
    };
  }

  isInFallbackMode(): boolean {
    return this.fallbackService.isInFallbackMode();
  }

  async performHealthCheck(): Promise<ConnectionStatus> {
    const railwayStatus = await railwayConnectionService.checkRailwayHealth();
    const httpStatus = await chatHttpService.performHealthCheck();
    
    return {
      success: railwayStatus.isOnline && httpStatus.success,
      details: {
        railway: railwayStatus,
        http: httpStatus
      }
    };
  }
}

// Export singleton instance (now using HTTP service internally)
export const chatWebSocketService = new ChatWebSocketService();

// Re-export types for backward compatibility
export type { ChatMessage, WebSocketConfig };
