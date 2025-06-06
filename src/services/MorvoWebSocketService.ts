
import { toast } from 'sonner';

export interface MorvoMessage {
  id: string;
  type: 'welcome' | 'message' | 'rich_component' | 'error' | 'smart_alert' | 'alert_check_started';
  content?: string;
  message?: string;
  rich_components?: RichComponent[];
  intent_detected?: string;
  confidence_score?: number;
  timestamp: string;
  sender: 'user' | 'assistant';
  // Smart Alert properties
  priority?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  title?: string;
  action_url?: string;
}

export interface RichComponent {
  type: 'button' | 'card' | 'chart' | 'link' | 'alert_card';
  text?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  action?: string;
  url?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  action_button?: {
    text: string;
    action: string;
  };
}

export interface SmartAlert {
  id: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  action_url?: string;
  timestamp: string;
}

export interface WebSocketConfig {
  onMessage?: (message: MorvoMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
  onSmartAlert?: (alert: SmartAlert) => void;
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
  private sessionId: string;

  constructor(userId: string, config: WebSocketConfig = {}) {
    this.userId = userId;
    this.config = config;
    this.sessionId = `session_${Date.now()}`;
  }

  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      this.updateStatus('connecting');
      
      const wsUrl = `wss://crewai-production-d99a.up.railway.app/ws/${this.userId}`;
      
      console.log('🔌 Connecting to Morvo AI v2.0 WebSocket:', wsUrl);
      
      try {
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = (event) => {
          console.log('✅ Connected to Morvo AI v2.0 WebSocket');
          this.updateStatus('connected');
          this.reconnectAttempts = 0;
          this.config.onConnect?.();
          toast.success('تم الاتصال بمورفو AI v2.0 بنجاح');
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
      intent_detected: data.intent_detected,
      confidence_score: data.confidence_score,
      timestamp: data.timestamp || new Date().toISOString(),
      sender: 'assistant',
      priority: data.priority,
      category: data.category,
      title: data.title,
      action_url: data.action_url
    };

    switch (data.type) {
      case 'welcome':
        console.log('👋 Welcome message received:', message.content);
        break;
      
      case 'message':
        console.log('💬 Message received:', message.content);
        if (data.intent_detected) {
          console.log('🎯 Intent detected:', data.intent_detected, 'confidence:', data.confidence_score);
        }
        if (data.rich_components && data.rich_components.length) {
          console.log('🎨 Rich components included:', data.rich_components);
        }
        break;

      case 'smart_alert':
        console.log('🔔 Smart alert received:', data);
        const alert: SmartAlert = {
          id: data.id || Date.now().toString(),
          category: data.category || 'general',
          priority: data.priority || 'medium',
          title: data.title || 'تنبيه ذكي',
          message: data.message || data.content,
          action_url: data.action_url,
          timestamp: data.timestamp || new Date().toISOString()
        };
        this.config.onSmartAlert?.(alert);
        this.showSmartAlertToast(alert);
        break;

      case 'alert_check_started':
        console.log('🔍 Alert check started:', data);
        toast.info('تم بدء فحص التنبيهات الذكية');
        break;
        
      default:
        console.log('❓ Unknown message type:', data.type);
    }

    this.config.onMessage?.(message);
  }

  private showSmartAlertToast(alert: SmartAlert): void {
    const priorityEmoji = {
      low: '🟢',
      medium: '🟡', 
      high: '🟠',
      critical: '🔴'
    };

    const emoji = priorityEmoji[alert.priority] || '🔔';
    
    if (alert.priority === 'critical') {
      toast.error(`${emoji} ${alert.title}: ${alert.message}`, {
        duration: 10000,
        action: alert.action_url ? {
          label: 'عرض التفاصيل',
          onClick: () => window.open(alert.action_url, '_blank')
        } : undefined
      });
    } else {
      toast.info(`${emoji} ${alert.title}: ${alert.message}`, {
        duration: 5000
      });
    }
  }

  sendMessage(content: string): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const msgData = {
        content: content,
        user_id: this.userId,
        session_id: this.sessionId,
        message_type: 'user',
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 Sending message to Morvo AI v2.0:', msgData);
      this.ws.send(JSON.stringify(msgData));
      return true;
    } else {
      console.error('❌ WebSocket is not open. ReadyState:', this.ws?.readyState);
      toast.error('الاتصال غير متاح. جاري المحاولة...');
      
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

  static detectTextDirection(text: string): 'rtl' | 'ltr' {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text) ? 'rtl' : 'ltr';
  }

  static detectTextLanguage(text: string): 'ar' | 'en' {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text) ? 'ar' : 'en';
  }
}
