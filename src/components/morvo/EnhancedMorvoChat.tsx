
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Wifi, WifiOff } from 'lucide-react';
import { MorvoPollingService, MorvoMessage, PollingConfig, ConnectionStatus } from '@/services/MorvoPollingService';
import { toast } from 'sonner';

interface ChatMessage extends MorvoMessage {
  displayTime: string;
}

export const EnhancedMorvoChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingServiceRef = useRef<MorvoPollingService | null>(null);

  useEffect(() => {
    // Initialize polling service
    const config: PollingConfig = {
      onMessage: (message: MorvoMessage) => {
        const chatMessage: ChatMessage = {
          ...message,
          displayTime: new Date().toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        setMessages(prev => [...prev, chatMessage]);
        setIsTyping(false);
      },
      onConnect: () => {
        console.log('📡 Polling service connected');
        toast.success('تم الاتصال بمورفو AI');
      },
      onDisconnect: () => {
        console.log('📡 Polling service disconnected');
        toast.error('انقطع الاتصال مع مورفو AI');
      },
      onError: (error) => {
        console.error('📡 Polling service error:', error);
        toast.error('خطأ في الاتصال');
        setIsTyping(false);
      },
      onStatusChange: (status) => {
        setConnectionStatus(status);
      }
    };

    pollingServiceRef.current = new MorvoPollingService('user_123', config);
    pollingServiceRef.current.connect();

    return () => {
      if (pollingServiceRef.current) {
        pollingServiceRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !pollingServiceRef.current) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'message',
      content: inputMessage,
      message: inputMessage,
      timestamp: new Date().toISOString(),
      sender: 'user',
      displayTime: new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Send message via polling service
    const success = await pollingServiceRef.current.sendMessage(inputMessage);
    
    if (!success) {
      setIsTyping(false);
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: 'عذراً، حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
        message: 'عذراً، حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
        timestamp: new Date().toISOString(),
        sender: 'assistant',
        displayTime: new Date().toLocaleTimeString('ar-SA', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'connecting':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <WifiOff className="w-4 h-4 text-red-600" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'متصل';
      case 'connecting':
        return 'جاري الاتصال...';
      case 'error':
        return 'خطأ في الاتصال';
      default:
        return 'غير متصل';
    }
  };

  return (
    <Card className="h-[600px] w-full max-w-md mx-auto flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <span className="font-bold">مورفو AI المحسن</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h4 className="font-bold text-gray-900 mb-2">مرحباً بك في مورفو AI المحسن</h4>
                <p className="text-sm text-gray-600">
                  كيف يمكنني مساعدتك في التسويق اليوم؟
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'error'
                      ? 'bg-red-100 text-red-900 border border-red-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-xs font-medium">
                        {message.sender === 'user' ? 'أنت' : 'مورفو AI'}
                      </span>
                    </div>
                    <p className="text-sm">{message.content || message.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{message.displayTime}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span className="text-sm text-gray-600">يكتب...</span>
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

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                onKeyPress={handleKeyPress}
                disabled={isTyping || connectionStatus !== 'connected'}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping || connectionStatus !== 'connected'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
