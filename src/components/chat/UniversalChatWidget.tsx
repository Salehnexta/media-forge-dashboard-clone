
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { useMCPContext } from '@/contexts/MCPContext';
import { ChatMessage, AIManager } from '@/types/morvo';

interface ChatWidgetProps {
  className?: string;
}

interface ContextualResponse {
  text: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
  shareWithAgents?: AIManager[];
}

interface SmartSuggestion {
  question: string;
  category: 'analysis' | 'chart' | 'strategy' | 'action';
  icon?: React.ReactNode;
}

export const UniversalChatWidget = ({ className }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AIManager>('strategic');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { storeMemory, retrieveMemory, shareContext } = useMCPContext();

  const agentInfo = {
    strategic: { name: 'المدير الاستراتيجي', color: 'bg-blue-500', description: 'تحليل استراتيجي وتخطيط' },
    monitor: { name: 'مراقب الأداء', color: 'bg-green-500', description: 'مراقبة ومتابعة الأداء' },
    executor: { name: 'منفذ الحملات', color: 'bg-purple-500', description: 'تنفيذ وإدارة الحملات' },
    creative: { name: 'المبدع', color: 'bg-orange-500', description: 'إنتاج المحتوى الإبداعي' },
    analyst: { name: 'المحلل', color: 'bg-red-500', description: 'تحليل البيانات والتقارير' }
  };

  // الأسئلة المقترحة الذكية مع أوامر الرسوم البيانية
  const smartSuggestions: Record<AIManager, SmartSuggestion[]> = {
    strategic: [
      { question: 'أنشئ رسم بياني لتحليل SWOT لشركتي', category: 'chart', icon: <BarChart3 className="w-3 h-3" /> },
      { question: 'اعرض خارطة الطريق الاستراتيجية لـ 6 أشهر', category: 'chart', icon: <TrendingUp className="w-3 h-3" /> },
      { question: 'ما هي أفضل استراتيجية لدخول السوق الجديد؟', category: 'strategy' },
      { question: 'حلل موقعي التنافسي مقارنة بالمنافسين', category: 'analysis' },
      { question: 'اقترح أهداف KPI قابلة للقياس', category: 'action' }
    ],
    monitor: [
      { question: 'أنشئ رسم بياني لأداء منصات التواصل الاجتماعي', category: 'chart', icon: <BarChart3 className="w-3 h-3" /> },
      { question: 'اعرض تطور معدل التفاعل خلال الشهر الماضي', category: 'chart', icon: <TrendingUp className="w-3 h-3" /> },
      { question: 'كيف أحسن معدل الوصول على انستغرام؟', category: 'action' },
      { question: 'ما أفضل أوقات النشر لجمهوري؟', category: 'analysis' },
      { question: 'حلل أداء الهاشتاجات الأخيرة', category: 'analysis' }
    ],
    executor: [
      { question: 'أنشئ رسم بياني لأداء الحملات الإعلانية', category: 'chart', icon: <PieChart className="w-3 h-3" /> },
      { question: 'اعرض مقارنة تكلفة النقرة بين المنصات', category: 'chart', icon: <BarChart3 className="w-3 h-3" /> },
      { question: 'كيف أقلل تكلفة الحصول على عميل جديد؟', category: 'action' },
      { question: 'ما أفضل استهداف لحملة المنتج الجديد؟', category: 'strategy' },
      { question: 'حلل معدل التحويل لحملاتي الحالية', category: 'analysis' }
    ],
    creative: [
      { question: 'أنشئ رسم بياني لأداء أنواع المحتوى المختلفة', category: 'chart', icon: <BarChart3 className="w-3 h-3" /> },
      { question: 'اعرض اتجاهات المحتوى الرائج حسب المنصة', category: 'chart', icon: <TrendingUp className="w-3 h-3" /> },
      { question: 'اقترح أفكار محتوى لحملة رمضان', category: 'action' },
      { question: 'ما الألوان الأنسب لهوية علامتي التجارية؟', category: 'strategy' },
      { question: 'حلل أداء الفيديوهات مقابل الصور', category: 'analysis' }
    ],
    analyst: [
      { question: 'أنشئ لوحة تحكم تفاعلية لمؤشرات الأداء', category: 'chart', icon: <BarChart3 className="w-3 h-3" /> },
      { question: 'اعرض توقعات المبيعات للربع القادم', category: 'chart', icon: <TrendingUp className="w-3 h-3" /> },
      { question: 'حلل سلوك العملاء وأنماط الشراء', category: 'analysis' },
      { question: 'ما أهم المؤشرات لقياس نجاح استراتيجيتي؟', category: 'strategy' },
      { question: 'اقترح تحسينات بناءً على البيانات الحالية', category: 'action' }
    ]
  };

  // أوامر الرسوم البيانية السريعة
  const quickChartCommands = [
    { command: '/رسم-دائري', description: 'إنشاء رسم بياني دائري', icon: <PieChart className="w-3 h-3" /> },
    { command: '/رسم-أعمدة', description: 'إنشاء رسم أعمدة بيانية', icon: <BarChart3 className="w-3 h-3" /> },
    { command: '/رسم-خطي', description: 'إنشاء رسم بياني خطي', icon: <TrendingUp className="w-3 h-3" /> },
    { command: '/لوحة-تحكم', description: 'إنشاء لوحة تحكم شاملة', icon: <BarChart3 className="w-3 h-3" /> }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      manager: currentAgent
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Store user message in MCP memory
    await storeMemory(currentAgent, 'context', {
      type: 'user_message',
      message: message,
      timestamp: new Date().toISOString()
    });

    // Simulate AI response with context from memory
    setTimeout(async () => {
      const memories = await retrieveMemory(currentAgent, 'context');
      const contextualResponse = generateContextualResponse(message, currentAgent, memories);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: contextualResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        manager: currentAgent,
        actionButton: contextualResponse.actionButton
      };

      setChatHistory(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Store AI response in memory
      await storeMemory(currentAgent, 'insight', {
        type: 'ai_response',
        message: contextualResponse.text,
        user_question: message,
        timestamp: new Date().toISOString()
      });

      // Share insights with other agents if relevant
      if (contextualResponse.shareWithAgents) {
        for (const agent of contextualResponse.shareWithAgents) {
          await shareContext(currentAgent, agent, {
            type: 'insight',
            data: contextualResponse.text,
            original_question: message
          });
        }
      }
    }, 1500);
  };

  const generateContextualResponse = (userMessage: string, agent: AIManager, memories: any[]): ContextualResponse => {
    // Check if message contains chart commands
    if (userMessage.includes('/رسم') || userMessage.includes('أنشئ رسم') || userMessage.includes('اعرض')) {
      return generateChartResponse(userMessage, agent);
    }

    const responses: Record<AIManager, ContextualResponse> = {
      strategic: {
        text: `بناءً على تحليل الوضع الحالي وسياق المحادثات السابقة، أنصح بالتركيز على تطوير استراتيجية تسويقية متكاملة تأخذ في الاعتبار نقاط القوة والضعف الحالية. يمكنني مساعدتك في تحديد الأولويات وإنشاء خطة عمل محددة.`,
        actionButton: {
          label: 'إنشاء استراتيجية',
          action: () => console.log('Creating strategy...')
        },
        shareWithAgents: ['analyst', 'executor']
      },
      monitor: {
        text: `من خلال مراجعة البيانات المتاحة والسياق السابق، يبدو أن هناك نقاط تحتاج متابعة. سأقوم بإنشاء تقرير مفصل يتضمن المؤشرات الحالية والتوصيات للتحسين.`,
        actionButton: {
          label: 'عرض التقرير',
          action: () => console.log('Showing report...')
        }
      },
      executor: {
        text: `بناءً على الاستراتيجية المقترحة والتحليلات السابقة، يمكنني مساعدتك في تنفيذ حملة فعالة. سأحتاج لبعض التفاصيل الإضافية حول الجمهور المستهدف والميزانية المتاحة.`,
        actionButton: {
          label: 'بدء الحملة',
          action: () => console.log('Starting campaign...')
        }
      },
      creative: {
        text: `استناداً إلى الاتجاهات الحالية وسياق عملك، لدي عدة أفكار إبداعية مميزة. سأقوم بإنتاج محتوى يتماشى مع هوية علامتك التجارية ويجذب جمهورك المستهدف.`,
        actionButton: {
          label: 'إنتاج المحتوى',
          action: () => console.log('Creating content...')
        }
      },
      analyst: {
        text: `بعد تحليل البيانات المتاحة والسياق التاريخي، تظهر النتائج اتجاهات مثيرة للاهتمام. سأقوم بإنشاء تقرير تحليلي شامل مع توقعات مستقبلية ورؤى قابلة للتنفيذ.`,
        actionButton: {
          label: 'عرض التحليل',
          action: () => console.log('Showing analysis...')
        },
        shareWithAgents: ['strategic', 'monitor']
      }
    };

    return responses[agent] || responses.strategic;
  };

  const generateChartResponse = (userMessage: string, agent: AIManager): ContextualResponse => {
    return {
      text: `ممتاز! سأقوم بإنشاء الرسم البياني المطلوب بناءً على البيانات المتاحة. سيتضمن الرسم تحليلاً تفاعلياً يمكنك استخدامه لاتخاذ قرارات مدروسة.

📊 **نوع الرسم**: ${userMessage.includes('دائري') ? 'رسم دائري' : userMessage.includes('أعمدة') ? 'رسم أعمدة' : 'رسم بياني متقدم'}
🎯 **البيانات**: ستُحدث تلقائياً من مصادرك المتصلة
📈 **التحليل**: يشمل الاتجاهات والرؤى الذكية`,
      actionButton: {
        label: 'إنشاء الرسم البياني',
        action: () => console.log('Creating chart...')
      }
    };
  };

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chart': return '📊';
      case 'analysis': return '🔍';
      case 'strategy': return '🎯';
      case 'action': return '⚡';
      default: return '💡';
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg ${className}`}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <Card className="fixed bottom-6 right-6 z-50 w-80 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <span className="font-medium">مساعد Morvo AI</span>
              <Badge className={`${agentInfo[currentAgent].color} text-white text-xs`}>
                {agentInfo[currentAgent].name}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                onClick={() => setIsMinimized(false)}
                variant="ghost"
                size="sm"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-lg flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span className="font-medium">مساعد Morvo AI</span>
        </div>
        <div className="flex gap-1">
          <Button
            onClick={() => setIsMinimized(true)}
            variant="ghost"
            size="sm"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Agent Selector */}
      <div className="p-3 border-b">
        <select
          value={currentAgent}
          onChange={(e) => setCurrentAgent(e.target.value as AIManager)}
          className="w-full p-2 border rounded-lg text-sm"
        >
          {Object.entries(agentInfo).map(([key, info]) => (
            <option key={key} value={key}>
              {info.name} - {info.description}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center text-gray-500 space-y-4">
            <p className="text-sm">
              مرحباً! أنا {agentInfo[currentAgent].name}. كيف يمكنني مساعدتك اليوم؟
            </p>
            
            {/* أوامر الرسوم البيانية السريعة */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-blue-600">أوامر الرسوم البيانية السريعة:</p>
              <div className="grid grid-cols-2 gap-1">
                {quickChartCommands.map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(cmd.command)}
                    className="flex items-center gap-1 text-xs p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    {cmd.icon}
                    <span className="truncate">{cmd.command}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* الأسئلة المقترحة الذكية */}
            <div className="space-y-2">
              <p className="text-xs font-medium">اقتراحات ذكية:</p>
              {smartSuggestions[currentAgent].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(suggestion.question)}
                  className="flex items-start gap-2 w-full text-xs text-right p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                  <div className="flex-1">
                    <span className="block">{suggestion.question}</span>
                    {suggestion.icon && (
                      <div className="flex items-center gap-1 mt-1 text-blue-500">
                        {suggestion.icon}
                        <span className="text-xs">رسم بياني</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {msg.sender === 'ai' && (
                  <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                )}
                {msg.sender === 'user' && (
                  <User className="w-4 h-4 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  {msg.actionButton && (
                    <Button
                      onClick={msg.actionButton.action}
                      className="mt-2 text-xs"
                      size="sm"
                      variant={msg.sender === 'user' ? 'secondary' : 'default'}
                    >
                      {msg.actionButton.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-1">
                <Bot className="w-4 h-4" />
                <span className="text-sm">يكتب...</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك أو استخدم أوامر مثل /رسم-دائري..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isTyping}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge className={`${agentInfo[currentAgent].color} text-white text-xs`}>
            {agentInfo[currentAgent].name}
          </Badge>
          <span className="text-xs text-gray-500">
            جاهز للمساعدة في {agentInfo[currentAgent].description}
          </span>
        </div>
      </div>
    </Card>
  );
};
