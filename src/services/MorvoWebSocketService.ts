
import { toast } from 'sonner';

export interface MorvoMessage {
  id: string;
  type: 'welcome' | 'message' | 'rich_component' | 'error';
  content?: string;
  message?: string;
  rich_components?: RichComponent[];
  timestamp: string;
  sender: 'user' | 'assistant';
}

export interface RichComponent {
  type: 'button' | 'card' | 'chart' | 'link';
  text?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  action?: string;
  url?: string;
}

export interface WebSocketConfig {
  onMessage?: (message: MorvoMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export class MorvoWebSocketService {
  private ws: WebSocket | null = null;
  private userId: string;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private status: ConnectionStatus = 'disconnected';

  constructor(userId: string, config: WebSocketConfig = {}) {
    this.userId = userId;
    this.config = config;
  }

  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      this.updateStatus('connecting');
      
      // Production WebSocket URL as specified
      const wsUrl = `wss://crewai-production-d99a.up.railway.app/ws/${this.userId}`;
      
      console.log('🔌 Connecting to Morvo AI WebSocket:', wsUrl);
      
      try {
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = (event) => {
          console.log('✅ Connected to Morvo AI WebSocket');
          this.updateStatus('connected');
          this.reconnectAttempts = 0;
          this.config.onConnect?.();
          toast.success('تم الاتصال بمورفو AI بنجاح');
          resolve(true);
        };
        
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleIncomingMessage(data);
          } catch (error) {
            console.error('❌ Error parsing WebSocket message:', error);
            toast.error('خطأ في تحليل رسالة من الخادم');
          }
        };
        
        this.ws.onclose = (event) => {
          console.log('🔴 WebSocket connection closed:', event.code, event.reason);
          this.updateStatus('disconnected');
          this.config.onDisconnect?.();
          
          // Automatic reconnection logic
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.reconnectInterval}ms`);
            setTimeout(() => this.connect(), this.reconnectInterval);
            toast.info(`محاولة إعادة الاتصال ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          } else {
            toast.error('فشل في الاتصال بعد عدة محاولات');
          }
          resolve(false);
        };
        
        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.updateStatus('error');
          this.config.onError?.(error);
          toast.error('خطأ في الاتصال بالخادم');
          resolve(false);
        };
        
      } catch (error) {
        console.error('❌ Failed to create WebSocket:', error);
        this.updateStatus('error');
        resolve(false);
      }
    });
  }

  private handleIncomingMessage(data: any): void {
    const message: MorvoMessage = {
      id: data.id || Date.now().toString(),
      type: data.type || 'message',
      content: data.content || data.message,
      message: data.message,
      rich_components: data.rich_components,
      timestamp: data.timestamp || new Date().toISOString(),
      sender: 'assistant'
    };

    switch (data.type) {
      case 'welcome':
        console.log('👋 Welcome message received:', message.content);
        break;
      
      case 'message':
        console.log('💬 Message received:', message.content);
        if (data.rich_components && data.rich_components.length) {
          console.log('🎨 Rich components included:', data.rich_components);
        }
        break;
        
      default:
        console.log('❓ Unknown message type:', data.type);
    }

    this.config.onMessage?.(message);
  }

  sendMessage(content: string): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const msgData = {
        type: 'message',
        content: content,
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 Sending message to Morvo AI:', msgData);
      this.ws.send(JSON.stringify(msgData));
      return true;
    } else {
      console.error('❌ WebSocket is not open. ReadyState:', this.ws?.readyState);
      toast.error('الاتصال غير متاح. جاري المحاولة...');
      
      // Try to reconnect
      if (this.status !== 'connecting') {
        this.connect();
      }
      return false;
    }
  }

  private updateStatus(status: ConnectionStatus): void {
    this.status = status;
    this.config.onStatusChange?.(status);
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.updateStatus('disconnected');
  }

  // Helper methods for text direction detection
  static detectTextDirection(text: string): 'rtl' | 'ltr' {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text) ? 'rtl' : 'ltr';
  }

  static detectTextLanguage(text: string): 'ar' | 'en' {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text) ? 'ar' : 'en';
  }
}
