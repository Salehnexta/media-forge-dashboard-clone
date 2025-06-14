
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

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface PollingConfig {
  onMessage?: (message: MorvoMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
  onSmartAlert?: (alert: SmartAlert) => void;
  pollInterval?: number;
}

export class MorvoPollingService {
  private userId: string;
  private config: PollingConfig;
  private status: ConnectionStatus = 'disconnected';
  private sessionId: string;
  private pollInterval: number;
  private pollTimer?: NodeJS.Timeout;
  private conversationId: string;
  private clientId: string;

  constructor(userId: string, config: PollingConfig = {}) {
    this.userId = userId;
    this.config = config;
    this.sessionId = `session_${Date.now()}`;
    this.conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.pollInterval = config.pollInterval || 2000;
  }

  async connect(): Promise<boolean> {
    console.log('🔌 Starting HTTP polling connection to Morvo AI');
    this.updateStatus('connecting');
    
    try {
      const response = await fetch('https://morvo-production.up.railway.app/health');
      
      if (response.ok) {
        this.updateStatus('connected');
        this.config.onConnect?.();
        toast.success('تم الاتصال بمورفو AI بنجاح');
        this.startPolling();
        return true;
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      console.error('❌ Failed to connect:', error);
      this.updateStatus('error');
      this.config.onError?.(error as Error);
      toast.error('خطأ في الاتصال بالخادم');
      return false;
    }
  }

  private startPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }

    this.pollTimer = setInterval(() => {
      if (this.status === 'connected') {
        this.pingServer();
      }
    }, this.pollInterval);
  }

  private async pingServer(): Promise<void> {
    try {
      const response = await fetch('https://morvo-production.up.railway.app/health');
      if (!response.ok) {
        this.updateStatus('error');
        this.config.onDisconnect?.();
      }
    } catch (error) {
      console.error('Ping failed:', error);
      this.updateStatus('error');
      this.config.onDisconnect?.();
    }
  }

  async sendMessage(content: string): Promise<boolean> {
    if (this.status !== 'connected') {
      console.error('❌ Not connected. Status:', this.status);
      toast.error('الاتصال غير متاح. جاري المحاولة...');
      
      await this.connect();
      
      if (this.status !== 'connected') {
        return false;
      }
    }

    try {
      console.log('📤 Sending message to Morvo AI:', content);
      
      const response = await fetch('https://morvo-production.up.railway.app/v1/chat/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          client_id: this.clientId,
          conversation_id: this.conversationId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const assistantMessage: MorvoMessage = {
        id: Date.now().toString(),
        type: 'message',
        content: data.message,
        message: data.message,
        intent_detected: data.intent_analysis?.intent,
        confidence_score: data.intent_analysis?.confidence,
        timestamp: new Date().toISOString(),
        sender: 'assistant'
      };

      this.config.onMessage?.(assistantMessage);
      
      return true;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast.error('خطأ في إرسال الرسالة');
      this.config.onError?.(error as Error);
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
    return this.status === 'connected';
  }

  disconnect(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = undefined;
    }
    this.updateStatus('disconnected');
    console.log('🔴 Polling connection stopped');
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
