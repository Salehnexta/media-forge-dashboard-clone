
import { toast } from 'sonner';
import { ChatMessage } from './types';

export class FallbackService {
  private fallbackMode = false;

  enableFallbackMode(): void {
    this.fallbackMode = true;
    console.log('🔄 Fallback mode enabled');
    toast.warning('تم التبديل للوضع المحلي - الردود ستكون محلية');
  }

  disableFallbackMode(): void {
    this.fallbackMode = false;
    console.log('✅ Fallback mode disabled');
  }

  isInFallbackMode(): boolean {
    return this.fallbackMode;
  }

  generateFallbackResponse(message: string): ChatMessage {
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
    } as ChatMessage;
  }
}
