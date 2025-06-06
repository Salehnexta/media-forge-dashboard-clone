
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { MorvoWebSocketService, MorvoMessage, ConnectionStatus, SmartAlert } from '@/services/MorvoWebSocketService';
import { RichComponentRenderer } from './RichComponentRenderer';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { smartAlertsManager } from '@/services/SmartAlertsManager';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedMorvoChatProps {
  className?: string;
  onSmartAlert?: (alert: SmartAlert) => void;
}

export const EnhancedMorvoChat = ({ className = '', onSmartAlert }: EnhancedMorvoChatProps) => {
  const [messages, setMessages] = useState<MorvoMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [userId, setUserId] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsServiceRef = useRef<MorvoWebSocketService | null>(null);

  // Initialize user ID and WebSocket service
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userIdValue = user?.id || `guest_${Date.now()}`;
        setUserId(userIdValue);

        // Initialize WebSocket service with smart alerts support
        wsServiceRef.current = new MorvoWebSocketService(userIdValue, {
          onMessage: handleIncomingMessage,
          onConnect: () => setConnectionStatus('connected'),
          onDisconnect: () => setConnectionStatus('disconnected'),
          onError: () => setConnectionStatus('error'),
          onStatusChange: setConnectionStatus,
          onSmartAlert: handleSmartAlert
        });

        // Connect to WebSocket
        await wsServiceRef.current.connect();
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    initializeUser();

    return () => {
      wsServiceRef.current?.disconnect();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleIncomingMessage = (message: MorvoMessage) => {
    setMessages(prev => [...prev, message]);
    setIsLoading(false);
  };

  const handleSmartAlert = (alert: SmartAlert) => {
    // Add to smart alerts manager
    smartAlertsManager.addAlert(alert);
    
    // Call parent callback if provided
    onSmartAlert?.(alert);
    
    console.log('🔔 Smart alert received in chat:', alert);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !wsServiceRef.current) return;

    const userMessage: MorvoMessage = {
      id: Date.now().toString(),
      type: 'message',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      sender: 'user'
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Send message via WebSocket
    const sent = wsServiceRef.current.sendMessage(inputMessage);
    
    if (!sent) {
      setIsLoading(false);
    }

    setInputMessage('');
  };

  const handleRichComponentAction = (action: string) => {
    if (wsServiceRef.current) {
      wsServiceRef.current.sendMessage(action);
      setIsLoading(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getTextDirection = (text: string) => {
    return MorvoWebSocketService.detectTextDirection(text);
  };

  const getTextLanguage = (text: string) => {
    return MorvoWebSocketService.detectTextLanguage(text);
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                مورفو AI v2.0
                <Sparkles className="w-4 h-4 text-purple-500" />
              </h3>
              <p className="text-sm text-gray-600">مساعدك الذكي مع التنبيهات الذكية</p>
            </div>
          </div>
          <ConnectionStatusIndicator status={connectionStatus} />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h4 className="font-bold text-gray-700 mb-2">مرحباً بك في مورفو AI v2.0!</h4>
                <p className="text-sm text-gray-600 mb-4">
                  أنا هنا لمساعدتك في التسويق الرقمي مع ميزات ذكية جديدة
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage('أريد تحليل موقعي')}
                  >
                    تحليل الموقع
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage('ما هي أحدث التنبيهات؟')}
                  >
                    التنبيهات الذكية
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage('اربط منصات التواصل')}
                  >
                    ربط المنصات
                  </Button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'assistant' && (
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
                    dir={getTextDirection(message.content || '')}
                    lang={getTextLanguage(message.content || '')}
                  >
                    {/* Intent Detection Badge */}
                    {message.intent_detected && message.sender === 'assistant' && (
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          <Sparkles className="w-3 h-3" />
                          {message.intent_detected}
                          {message.confidence_score && (
                            <span className="opacity-75">
                              ({Math.round(message.confidence_score * 100)}%)
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    <p className="text-sm whitespace-pre-line">
                      {message.content || message.message}
                    </p>
                  </div>
                  
                  {message.rich_components && (
                    <RichComponentRenderer
                      components={message.rich_components}
                      onAction={handleRichComponentAction}
                    />
                  )}
                  
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('ar-SA', {
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
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">يفكر...</span>
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
              placeholder="اكتب رسالتك هنا..."
              onKeyPress={handleKeyPress}
              disabled={connectionStatus !== 'connected' || isLoading}
              className="text-sm"
              dir="auto"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || connectionStatus !== 'connected' || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {connectionStatus !== 'connected' && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              {connectionStatus === 'connecting' ? 'جاري الاتصال...' : 'في انتظار الاتصال'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
