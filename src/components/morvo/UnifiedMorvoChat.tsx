import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles, BarChart3, PenTool, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'morvo';
  timestamp: Date;
  type?: 'text' | 'analytics' | 'content' | 'campaign';
  data?: any;
}

export const UnifiedMorvoChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load system prompt from Supabase
  useEffect(() => {
    loadSystemPrompt();
    addWelcomeMessage();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSystemPrompt = async () => {
    try {
      const { data } = await supabase
        .from('system_prompts')
        .select('prompt_text')
        .eq('name', 'morvo_unified')
        .eq('is_active', true)
        .single();

      if (data) {
        setSystemPrompt(data.prompt_text);
      }
    } catch (error) {
      console.error('Error loading system prompt:', error);
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: `مرحباً! أنا مورفو 🚀 رفيق التسويق الذكي الذي يجمع كل ما تحتاجه في محادثة واحدة.

يمكنني مساعدتك في:
• تحليل الأداء وحساب ROI فورياً  
• إنشاء محتوى مخصص لعلامتك التجارية
• تصميم حملات مع اختبارات A/B تلقائية
• تتبع المشاعر ومراقبة المنافسين

ما الذي تريد أن نعمل عليه اليوم؟`,
      sender: 'morvo',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare context data
      const context = await gatherUserContext();
      
      // Send to AI with unified prompt
      const response = await sendToMorvoAI(inputMessage, context);
      
      const morvoResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'morvo',
        timestamp: new Date(),
        type: (response.type || 'text') as 'text' | 'analytics' | 'content' | 'campaign',
        data: response.data
      };

      setMessages(prev => [...prev, morvoResponse]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
      setInputMessage('');
    }
  };

  const gatherUserContext = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {};

      // Get company profile
      const { data: company } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Get recent performance data
      const { data: campaigns } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        company,
        campaigns,
        userId: user.id
      };
    } catch (error) {
      console.error('Error gathering context:', error);
      return {};
    }
  };

  const sendToMorvoAI = async (message: string, context: any): Promise<{content: string, type?: 'text' | 'analytics' | 'content' | 'campaign', data?: any}> => {
    // Simulate AI response with the new unified approach
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = generateMorvoResponse(message, context);
        resolve(response);
      }, 1500);
    });
  };

  const generateMorvoResponse = (message: string, context: any): {content: string, type?: 'text' | 'analytics' | 'content' | 'campaign', data?: any} => {
    const lowerMessage = message.toLowerCase();

    // Analytics request
    if (lowerMessage.includes('تحليل') || lowerMessage.includes('أداء') || lowerMessage.includes('roi')) {
      return {
        content: `📊 **تحليل سريع لأدائك:**

• المبيعات هذا الشهر: ↗️ +15% (SAR 45,000)
• معدل التحويل: 3.2% (تحسن من 2.8%)
• أفضل منصة: إنستغرام (40% من الزيارات)

**التوصية:** ركز ميزانية إضافية 20% على إنستغرام لاستغلال الزخم الحالي.

🌐 المزيد في التقارير المرفقة`,
        type: 'analytics' as const
      };
    }

    // Content creation request
    if (lowerMessage.includes('محتوى') || lowerMessage.includes('منشور') || lowerMessage.includes('نص')) {
      return {
        content: `✨ **منشور جاهز لك:**

"تخيل لو عملك ينمو وأنت نايم 😴 مع استراتيجيات التسويق الذكي، أحلامك تصير حقيقة. ابدأ رحلتك اليوم!"

**فكرة الصورة:** شخص ينام والرسوم البيانية ترتفع حوله

**أفضل وقت للنشر:** 8 مساءً (ذروة التفاعل +45%)`,
        type: 'content' as const
      };
    }

    // Campaign request
    if (lowerMessage.includes('حملة') || lowerMessage.includes('إعلان') || lowerMessage.includes('ميزانية')) {
      return {
        content: `🎯 **حملة مصممة خصيصاً لك:**

**الهدف:** زيادة المبيعات بنسبة 25%
**الميزانية المقترحة:** SAR 5,000/شهر
• فيسبوك: 40% (SAR 2,000)
• إنستغرام: 35% (SAR 1,750)  
• جوجل: 25% (SAR 1,250)

**اختبار A/B تلقائي:** نص "خصم محدود" vs "عرض حصري"

تريد أبدأ الحملة فوراً؟`,
        type: 'campaign' as const
      };
    }

    // Default friendly response
    return {
      content: `أهلاً وسهلاً! 👋 

أنا هنا لأساعدك في كل ما يخص التسويق. يمكنك أن تسألني عن:

• "كيف أداء متجري؟" - للتحليلات السريعة
• "اكتب لي منشور عن المنتج الجديد" - للمحتوى
• "صمم لي حملة إعلانية" - للحملات

إيش اللي تبي نشتغل عليه؟`,
      type: 'text' as const
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (message: ChatMessage) => {
    return (
      <div
        key={message.id}
        className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        {message.sender === 'morvo' && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
          <div
            className={`p-3 rounded-2xl ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
            dir="auto"
          >
            {/* Type indicator for morvo responses */}
            {message.sender === 'morvo' && message.type !== 'text' && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {message.type === 'analytics' && <BarChart3 className="w-3 h-3" />}
                  {message.type === 'content' && <PenTool className="w-3 h-3" />}
                  {message.type === 'campaign' && <Target className="w-3 h-3" />}
                  {message.type === 'analytics' && 'تحليل فوري'}
                  {message.type === 'content' && 'محتوى إبداعي'}
                  {message.type === 'campaign' && 'استراتيجية حملة'}
                </span>
              </div>
            )}

            <p className="text-sm whitespace-pre-line leading-relaxed">
              {message.content}
            </p>
          </div>
          
          <p className="text-xs text-gray-400 mt-1">
            {message.timestamp.toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {message.sender === 'user' && (
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">مورفو - رفيق التسويق الذكي</h3>
            <p className="text-sm text-gray-600">تحليل • إبداع • حملات - كلها في محادثة واحدة</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map(renderMessage)}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">مورفو يفكر...</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اسأل مورفو عن التحليلات، المحتوى، أو الحملات..."
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="text-sm"
              dir="auto"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage('كيف أداء متجري هذا الشهر؟')}
              className="text-xs"
            >
              📊 تحليل الأداء
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage('اكتب منشور لترويج المنتج الجديد')}
              className="text-xs"
            >
              ✨ إنشاء محتوى
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputMessage('صمم حملة إعلانية بميزانية 3000 ريال')}
              className="text-xs"
            >
              🎯 تصميم حملة
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
