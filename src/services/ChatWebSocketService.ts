import { toast } from 'sonner';

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
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private isConnecting = false;
  private messageQueue: any[] = [];
  private config: WebSocketConfig = {};
  private heartbeatInterval: any = null;
  
  constructor() {
    console.log('🔧 ChatWebSocketService initialized in PRODUCTION mode');
  }

  // Always return Railway production WebSocket URL
  private getWebSocketUrl(): string {
    return 'wss://morvo-ai-v2.up.railway.app/ws';
  }

  async connect(userId: string, token?: string, config: WebSocketConfig = {}): Promise<boolean> {
    if (this.isConnecting) return false;
    
    this.config = config;
    this.isConnecting = true;

    try {
      // Get production Railway WebSocket URL and format properly
      const wsUrl = this.getWebSocketUrl();
      
      // Format URL for FastAPI path parameter style: /ws/{userId}
      const urlWithAuth = token 
        ? `${wsUrl}/${userId}?token=${token}`
        : `${wsUrl}/${userId}`;

      console.log('🔌 Connecting to production WebSocket:', wsUrl);
      
      this.ws = new WebSocket(urlWithAuth);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.isConnecting = false;
          resolve(false);
        }, 10000);

        this.ws!.onopen = () => {
          clearTimeout(timeout);
          this.handleOpen();
          resolve(true);
        };
      });
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      this.isConnecting = false;
      toast.error('فشل الاتصال بالخادم، جاري المحاولة مرة أخرى');
      return false;
    }
  }

  private handleOpen(): void {
    console.log('✅ WebSocket connected successfully to production');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.config.onConnect?.();
    
    // Send queued messages
    this.flushMessageQueue();
    
    // Setup heartbeat to keep connection alive
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
    console.log('❌ WebSocket connection closed');
    this.isConnecting = false;
    this.config.onDisconnect?.();
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // Attempt reconnection
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnection();
    } else {
      toast.error('فشل الاتصال بالخادم بعد عدة محاولات');
    }
  }

  private handleError(error: Event): void {
    console.error('❌ WebSocket error:', error);
    this.config.onError?.(error);
    this.isConnecting = false;
    
    // Additional diagnostic info
    console.log('WebSocket URL attempted:', this.ws?.url);
    console.log('Connection state:', this.getConnectionState());
    console.log('Navigator online:', navigator.onLine);
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
}

// Export singleton instance
export const chatWebSocketService = new ChatWebSocketService();
