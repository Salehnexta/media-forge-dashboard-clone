
import { toast } from 'sonner';
import { railwayConnectionService } from './RailwayConnectionService';
import { DiagnosticService } from './chat/DiagnosticService';
import { FallbackService } from './chat/FallbackService';
import { ConnectionManager } from './chat/ConnectionManager';
import { ChatMessage, WebSocketConfig, ConnectionStatus } from './chat/types';

export class ChatWebSocketService {
  private connectionManager: ConnectionManager;
  private diagnosticService: DiagnosticService;
  private fallbackService: FallbackService;
  private messageQueue: any[] = [];
  
  constructor() {
    console.log('🔧 ChatWebSocketService initialized with Railway integration');
    this.diagnosticService = new DiagnosticService();
    this.fallbackService = new FallbackService();
    this.connectionManager = new ConnectionManager(this.diagnosticService, this.fallbackService);
  }

  async connect(userId: string, token?: string, config: WebSocketConfig = {}): Promise<boolean> {
    // Check Railway status first
    const railwayStatus = await railwayConnectionService.checkRailwayHealth();
    
    if (!railwayStatus.httpReachable) {
      this.diagnosticService.logDiagnostic('railway_unreachable', railwayStatus);
      this.fallbackService.enableFallbackMode();
      return false;
    }

    const connected = await this.connectionManager.connect(userId, token, config);
    
    if (connected) {
      this.flushMessageQueue();
    }
    
    return connected;
  }

  sendMessage(message: any): boolean {
    if (this.connectionManager.isConnected()) {
      return this.connectionManager.sendMessage(message);
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
      console.warn('⚠️ WebSocket not connected, queuing message');
      this.messageQueue.push(message);
      
      // Try reconnecting
      if (!this.connectionManager.isConnected()) {
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
    this.connectionManager.disconnect();
  }

  isConnected(): boolean {
    return this.connectionManager.isConnected();
  }

  getConnectionState(): string {
    return this.connectionManager.getConnectionState();
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
      fallbackMode: this.fallbackService.isInFallbackMode()
    };
  }

  async performConnectionTest(): Promise<ConnectionStatus> {
    return await this.connectionManager.performConnectionTest();
  }

  isInFallbackMode(): boolean {
    return this.fallbackService.isInFallbackMode();
  }

  async performHealthCheck(): Promise<ConnectionStatus> {
    const railwayStatus = await railwayConnectionService.checkRailwayHealth();
    
    return {
      success: railwayStatus.isOnline,
      details: railwayStatus
    };
  }
}

// Export singleton instance
export const chatWebSocketService = new ChatWebSocketService();

// Re-export types for backward compatibility
export type { ChatMessage, WebSocketConfig };
