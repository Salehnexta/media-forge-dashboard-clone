
import { toast } from 'sonner';
import { railwayConnectionService } from './RailwayConnectionService';

// Standardized message type to fix TypeScript errors
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  manager?: string;
  isCommand?: boolean;
}

export interface WebSocketConfig {
  onMessage?: (message: ChatMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
}

export class ChatWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3; // Reduced from 5
  private reconnectInterval = 3000;
  private isConnecting = false;
  private messageQueue: any[] = [];
  private config: WebSocketConfig = {};
  private heartbeatInterval: any = null;
  private diagnosticMode = false;
  private connectionHistory: Array<{timestamp: Date, event: string, details?: any}> = [];
  private fallbackMode = false;
  
  constructor() {
    console.log('🔧 ChatWebSocketService initialized with Railway integration');
    this.enableDiagnosticMode();
  }

  private enableDiagnosticMode(): void {
    this.diagnosticMode = true;
    this.logDiagnostic('service_initialized', { mode: 'production' });
  }

  private logDiagnostic(event: string, details?: any): void {
    if (!this.diagnosticMode) return;
    
    const logEntry = {
      timestamp: new Date(),
      event,
      details
    };
    
    this.connectionHistory.push(logEntry);
    
    // Keep only last 50 entries
    if (this.connectionHistory.length > 50) {
      this.connectionHistory = this.connectionHistory.slice(-50);
    }
    
    console.log(`🔍 [Diagnostic] ${event}:`, details);
  }

  // Always return Railway production WebSocket URL
  private getWebSocketUrl(): string {
    return 'wss://morvo-ai-v2.up.railway.app/ws';
  }

  async connect(userId: string, token?: string, config: WebSocketConfig = {}): Promise<boolean> {
    if (this.isConnecting) {
      this.logDiagnostic('connect_attempt_blocked', { reason: 'already_connecting' });
      return false;
    }
    
    this.config = config;
    this.isConnecting = true;
    this.logDiagnostic('connect_start', { userId, hasToken: !!token });

    // Check Railway status first
    const railwayStatus = await railwayConnectionService.checkRailwayHealth();
    
    if (!railwayStatus.httpReachable) {
      this.logDiagnostic('railway_unreachable', railwayStatus);
      this.enableFallbackMode();
      this.isConnecting = false;
      return false;
    }

    try {
      const wsUrl = this.getWebSocketUrl();
      const urlWithAuth = token 
        ? `${wsUrl}/${userId}?token=${token}`
        : `${wsUrl}/${userId}`;

      this.logDiagnostic('websocket_create', { url: urlWithAuth });
      console.log('🔌 Connecting to Railway WebSocket:', wsUrl);
      
      this.ws = new WebSocket(urlWithAuth);
      
      // Enhanced error tracking
      this.ws.onopen = (event) => {
        this.logDiagnostic('websocket_open', { readyState: this.ws?.readyState });
        this.handleOpen();
      };
      
      this.ws.onmessage = (event) => {
        this.logDiagnostic('websocket_message', { 
          dataLength: event.data?.length,
          type: this.parseMessageType(event.data)
        });
        this.handleMessage(event);
      };
      
      this.ws.onclose = (event) => {
        this.logDiagnostic('websocket_close', { 
          code: event.code, 
          reason: event.reason,
          wasClean: event.wasClean
        });
        this.handleClose();
      };
      
      this.ws.onerror = (event) => {
        this.logDiagnostic('websocket_error', { 
          type: event.type,
          readyState: this.ws?.readyState,
          url: this.ws?.url
        });
        this.handleError(event);
      };

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.logDiagnostic('connect_timeout', { duration: 10000 });
          this.isConnecting = false;
          this.enableFallbackMode();
          resolve(false);
        }, 10000);

        this.ws!.onopen = () => {
          clearTimeout(timeout);
          this.handleOpen();
          this.disableFallbackMode();
          resolve(true);
        };

        this.ws!.onerror = () => {
          clearTimeout(timeout);
          this.enableFallbackMode();
          resolve(false);
        };
      });
    } catch (error) {
      this.logDiagnostic('connect_exception', { error: error instanceof Error ? error.message : error });
      console.error('❌ WebSocket connection failed:', error);
      this.isConnecting = false;
      this.enableFallbackMode();
      return false;
    }
  }

  private enableFallbackMode(): void {
    this.fallbackMode = true;
    this.logDiagnostic('fallback_mode_enabled');
    toast.warning('تم التبديل للوضع المحلي - الردود ستكون محلية');
  }

  private disableFallbackMode(): void {
    this.fallbackMode = false;
    this.logDiagnostic('fallback_mode_disabled');
  }

  private generateFallbackResponse(message: string): any {
    const responses = [
      'أعتذر، لا يمكنني الاتصال بالخادم حالياً. سأعمل في الوضع المحلي.',
      'الخادم غير متاح حالياً. يمكنك المتابعة مع الردود المحلية.',
      'تم تفعيل الوضع المحلي. سأساعدك بما أستطيع محلياً.'
    ];
    
    return {
      id: Date.now().toString(),
      text: responses[Math.floor(Math.random() * responses.length)],
      sender: 'ai',
      timestamp: new Date(),
      manager: 'strategic',
      isFallback: true
    };
  }

  private parseMessageType(data: string): string {
    try {
      const parsed = JSON.parse(data);
      return parsed.type || 'unknown';
    } catch {
      return 'invalid_json';
    }
  }

  private handleOpen(): void {
    this.logDiagnostic('connection_established', { 
      attempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length
    });
    
    console.log('✅ WebSocket connected successfully to production');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.config.onConnect?.();
    
    this.flushMessageQueue();
    this.startHeartbeat();
    
    toast.success('متصل بالخادم بنجاح');
  }
  
  private startHeartbeat(): void {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log('📨 Received WebSocket message:', data);
      
      if (data.type === 'typing_start') {
        this.config.onTypingStart?.();
        return;
      }
      
      if (data.type === 'typing_end') {
        this.config.onTypingEnd?.();
        return;
      }

      if (data.type === 'message' && data.content) {
        const message: ChatMessage = {
          id: data.id || Date.now().toString(),
          text: data.content,
          sender: data.sender || 'ai',
          timestamp: new Date(data.timestamp || Date.now()),
          manager: data.manager
        };
        
        this.config.onMessage?.(message);
      }
      
      // Handle dashboard commands from server
      if (data.type === 'dashboard_command') {
        this.handleDashboardCommand(data.command);
      }
      
    } catch (error) {
      this.logDiagnostic('message_parse_error', { 
        error: error instanceof Error ? error.message : error,
        dataLength: event.data?.length
      });
      console.error('❌ Error parsing WebSocket message:', error);
    }
  }
  
  private handleDashboardCommand(command: any): void {
    // Emit a custom event for dashboard components to listen to
    const event = new CustomEvent('dashboardCommand', { 
      detail: command 
    });
    window.dispatchEvent(event);
    
    // Optionally create a feedback message in chat
    if (this.config.onMessage) {
      const feedbackMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `تم تنفيذ: ${command.type}`,
        sender: 'system',
        timestamp: new Date(),
        isCommand: true
      };
      
      this.config.onMessage(feedbackMessage);
    }
  }

  private handleClose(): void {
    this.logDiagnostic('connection_closed', { 
      attempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    });
    
    console.log('❌ WebSocket connection closed');
    this.isConnecting = false;
    this.config.onDisconnect?.();
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnection();
    } else {
      this.logDiagnostic('max_reconnects_reached', { attempts: this.reconnectAttempts });
      toast.error('فشل الاتصال بالخادم بعد عدة محاولات');
    }
  }

  private handleError(error: Event): void {
    this.logDiagnostic('connection_error', {
      type: error.type,
      url: this.ws?.url,
      readyState: this.ws?.readyState,
      online: navigator.onLine,
      attempts: this.reconnectAttempts
    });
    
    console.error('❌ WebSocket error:', error);
    this.config.onError?.(error);
    this.isConnecting = false;
    
    // Enhanced diagnostic info
    console.log('WebSocket URL attempted:', this.ws?.url);
    console.log('Connection state:', this.getConnectionState());
    console.log('Navigator online:', navigator.onLine);
    console.log('Error details:', {
      type: error.type,
      timeStamp: error.timeStamp,
      isTrusted: error.isTrusted
    });
  }

  private attemptReconnection(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * this.reconnectAttempts;
    
    console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        // Try to reconnect with last known user ID
        const userId = localStorage.getItem('morvo_user_id') || 'guest';
        const token = localStorage.getItem('morvo_auth_token');
        this.connect(userId, token, this.config);
        toast.info(`محاولة إعادة الاتصال ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      }
    }, delay);
  }

  sendMessage(message: any): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('📤 Sending WebSocket message:', message);
      this.ws.send(JSON.stringify(message));
      return true;
    } else if (this.fallbackMode) {
      // Handle message in fallback mode
      console.log('📤 Handling message in fallback mode');
      setTimeout(() => {
        const fallbackResponse = this.generateFallbackResponse(message.content || message.message);
        this.config.onMessage?.(fallbackResponse);
      }, 1000);
      return true;
    } else {
      console.warn('⚠️ WebSocket not connected, queuing message');
      this.messageQueue.push(message);
      
      // Try reconnecting
      if (this.ws?.readyState === WebSocket.CLOSED && !this.isConnecting) {
        const userId = localStorage.getItem('morvo_user_id') || 'guest';
        const token = localStorage.getItem('morvo_auth_token');
        this.connect(userId, token, this.config);
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
    this.logDiagnostic('manual_disconnect');
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }

  getDiagnosticHistory(): Array<{timestamp: Date, event: string, details?: any}> {
    return [...this.connectionHistory];
  }

  getDetailedStatus(): object {
    return {
      connectionState: this.getConnectionState(),
      isConnected: this.isConnected(),
      isConnecting: this.isConnecting,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      queuedMessages: this.messageQueue.length,
      hasHeartbeat: !!this.heartbeatInterval,
      lastEvents: this.connectionHistory.slice(-5),
      wsUrl: this.ws?.url,
      wsReadyState: this.ws?.readyState,
      navigatorOnline: navigator.onLine,
      protocol: this.ws?.protocol,
      extensions: this.ws?.extensions
    };
  }

  async performConnectionTest(): Promise<{success: boolean, details: any}> {
    try {
      const wsUrl = this.getWebSocketUrl();
      const testWs = new WebSocket(`${wsUrl}/test`);
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          testWs.close();
          resolve({
            success: false,
            details: { error: 'Connection timeout', duration: 5000 }
          });
        }, 5000);

        testWs.onopen = () => {
          clearTimeout(timeout);
          const openTime = Date.now();
          testWs.close();
          resolve({
            success: true,
            details: { 
              connectionTime: Date.now() - openTime,
              url: wsUrl,
              protocol: testWs.protocol
            }
          });
        };

        testWs.onerror = (error) => {
          clearTimeout(timeout);
          resolve({
            success: false,
            details: { 
              error: 'Connection failed',
              type: error.type,
              url: wsUrl
            }
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          phase: 'websocket_creation'
        }
      };
    }
  }

  isInFallbackMode(): boolean {
    return this.fallbackMode;
  }

  async performHealthCheck(): Promise<{success: boolean, details: any}> {
    const railwayStatus = await railwayConnectionService.checkRailwayHealth();
    
    return {
      success: railwayStatus.isOnline,
      details: railwayStatus
    };
  }
}

// Export singleton instance
export const chatWebSocketService = new ChatWebSocketService();
