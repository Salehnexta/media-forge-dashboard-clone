import { toast } from 'sonner';
import { WebSocketConfig } from './types';
import { DiagnosticService } from './DiagnosticService';
import { FallbackService } from './FallbackService';

export class ConnectionManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectInterval = 3000;
  private isConnecting = false;
  private heartbeatInterval: any = null;
  private config: WebSocketConfig = {};
  private diagnosticService: DiagnosticService;
  private fallbackService: FallbackService;

  constructor(diagnosticService: DiagnosticService, fallbackService: FallbackService) {
    this.diagnosticService = diagnosticService;
    this.fallbackService = fallbackService;
  }

  private getWebSocketUrl(): string {
    return 'wss://crewai-production-d99a.up.railway.app:8000/ws';
  }

  async connect(userId: string, token?: string, config: WebSocketConfig = {}): Promise<boolean> {
    if (this.isConnecting) {
      this.diagnosticService.logDiagnostic('connect_attempt_blocked', { reason: 'already_connecting' });
      return false;
    }
    
    this.config = config;
    this.isConnecting = true;
    this.diagnosticService.logDiagnostic('connect_start', { userId, hasToken: !!token });

    try {
      const wsUrl = this.getWebSocketUrl();
      const urlWithAuth = token 
        ? `${wsUrl}/${userId}?token=${token}`
        : `${wsUrl}/${userId}`;

      this.diagnosticService.logDiagnostic('websocket_create', { url: urlWithAuth });
      console.log('🔌 Connecting to Railway WebSocket:', wsUrl);
      
      this.ws = new WebSocket(urlWithAuth);
      
      this.setupWebSocketHandlers();

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.diagnosticService.logDiagnostic('connect_timeout', { duration: 10000 });
          this.isConnecting = false;
          this.fallbackService.enableFallbackMode();
          resolve(false);
        }, 10000);

        this.ws!.onopen = () => {
          clearTimeout(timeout);
          this.handleOpen();
          this.fallbackService.disableFallbackMode();
          resolve(true);
        };

        this.ws!.onerror = () => {
          clearTimeout(timeout);
          this.fallbackService.enableFallbackMode();
          resolve(false);
        };
      });
    } catch (error) {
      this.diagnosticService.logDiagnostic('connect_exception', { error: error instanceof Error ? error.message : error });
      console.error('❌ WebSocket connection failed:', error);
      this.isConnecting = false;
      this.fallbackService.enableFallbackMode();
      return false;
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = (event) => {
      this.diagnosticService.logDiagnostic('websocket_open', { readyState: this.ws?.readyState });
      this.handleOpen();
    };
    
    this.ws.onmessage = (event) => {
      this.diagnosticService.logDiagnostic('websocket_message', { 
        dataLength: event.data?.length,
        type: this.diagnosticService.parseMessageType(event.data)
      });
      this.handleMessage(event);
    };
    
    this.ws.onclose = (event) => {
      this.diagnosticService.logDiagnostic('websocket_close', { 
        code: event.code, 
        reason: event.reason,
        wasClean: event.wasClean
      });
      this.handleClose();
    };
    
    this.ws.onerror = (event) => {
      this.diagnosticService.logDiagnostic('websocket_error', { 
        type: event.type,
        readyState: this.ws?.readyState,
        url: this.ws?.url
      });
      this.handleError(event);
    };
  }

  private handleOpen(): void {
    this.diagnosticService.logDiagnostic('connection_established', { 
      attempts: this.reconnectAttempts
    });
    
    console.log('✅ WebSocket connected successfully to production');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.config.onConnect?.();
    
    this.startHeartbeat();
    toast.success('متصل بالخادم بنجاح');
  }
  
  private startHeartbeat(): void {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
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
        const message = {
          id: data.id || Date.now().toString(),
          text: data.content,
          sender: data.sender || 'ai',
          timestamp: new Date(data.timestamp || Date.now()),
          manager: data.manager
        };
        
        this.config.onMessage?.(message);
      }
      
      if (data.type === 'dashboard_command') {
        this.handleDashboardCommand(data.command);
      }
      
    } catch (error) {
      this.diagnosticService.logDiagnostic('message_parse_error', { 
        error: error instanceof Error ? error.message : error,
        dataLength: event.data?.length
      });
      console.error('❌ Error parsing WebSocket message:', error);
    }
  }
  
  private handleDashboardCommand(command: any): void {
    const event = new CustomEvent('dashboardCommand', { 
      detail: command 
    });
    window.dispatchEvent(event);
    
    if (this.config.onMessage) {
      const feedbackMessage = {
        id: Date.now().toString(),
        text: `تم تنفيذ: ${command.type}`,
        sender: 'system' as const,
        timestamp: new Date(),
        isCommand: true
      };
      
      this.config.onMessage(feedbackMessage);
    }
  }

  private handleClose(): void {
    this.diagnosticService.logDiagnostic('connection_closed', { 
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
      this.diagnosticService.logDiagnostic('max_reconnects_reached', { attempts: this.reconnectAttempts });
      toast.error('فشل الاتصال بالخادم بعد عدة محاولات');
    }
  }

  private handleError(error: Event): void {
    this.diagnosticService.logDiagnostic('connection_error', {
      type: error.type,
      url: this.ws?.url,
      readyState: this.ws?.readyState,
      online: navigator.onLine,
      attempts: this.reconnectAttempts
    });
    
    console.error('❌ WebSocket error:', error);
    this.config.onError?.(error);
    this.isConnecting = false;
  }

  private attemptReconnection(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * this.reconnectAttempts;
    
    console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
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
    }
    return false;
  }

  disconnect(): void {
    this.diagnosticService.logDiagnostic('manual_disconnect');
    
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
}
