
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  manager?: string;
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
  
  constructor() {
    console.log('🔧 ChatWebSocketService initialized');
  }

  async connect(userId: string, token?: string, config: WebSocketConfig = {}): Promise<boolean> {
    if (this.isConnecting) return false;
    
    this.config = config;
    this.isConnecting = true;

    try {
      // Use environment-based URL selection
      const wsUrl = this.getWebSocketUrl();
      const urlWithAuth = token 
        ? `${wsUrl}?userId=${userId}&token=${token}`
        : `${wsUrl}?userId=${userId}`;

      console.log('🔌 Attempting WebSocket connection to:', wsUrl);
      
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
      return false;
    }
  }

  private getWebSocketUrl(): string {
    // Environment-based URL selection
    if (import.meta.env.PROD) {
      return import.meta.env.VITE_MORVO_WS_URL || 'wss://morvo-ai-v2.up.railway.app/ws';
    }
    return 'ws://localhost:8090/ws';
  }

  private handleOpen(): void {
    console.log('✅ WebSocket connected successfully');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.config.onConnect?.();
    
    // Send queued messages
    this.flushMessageQueue();
    
    toast.success('متصل بالخادم بنجاح');
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
    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error);
    }
  }

  private handleClose(): void {
    console.log('❌ WebSocket connection closed');
    this.isConnecting = false;
    this.config.onDisconnect?.();
    
    // Attempt reconnection
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.attemptReconnection();
    } else {
      toast.error('فشل الاتصال بالخادم');
    }
  }

  private handleError(error: Event): void {
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
        // Retry with last known config
        // Note: This is a simplified retry - in real implementation, 
        // you'd need to store the original connection parameters
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
