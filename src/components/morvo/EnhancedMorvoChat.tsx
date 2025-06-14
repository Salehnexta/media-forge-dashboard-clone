
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Wifi, WifiOff } from 'lucide-react';
import { chatHttpService } from '@/services/ChatHttpService';
import MorvoAIService from '@/services/MorvoAIService';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  agentsInvolved?: string[];
  processingTime?: number;
  cost?: number;
  displayTime: string;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export const EnhancedMorvoChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize connection to Morvo AI HTTP service
    const initializeMorvo = async () => {
      console.log('🚀 Initializing Morvo AI HTTP service...');
      setConnectionStatus('connecting');
      
      try {
        // Connect to the HTTP service
        const connected = await chatHttpService.connect('user', undefined, {
          baseUrl: 'https://morvo-production.up.railway.app'
        });
        
        if (connected) {
          console.log('✅ Connected to Morvo AI Railway backend');
          setConnectionStatus('connected');
          toast.success('متصل بنجاح مع مورفو AI');
        } else {
          console.error('❌ Failed to connect to Morvo AI');
          setConnectionStatus('error');
          toast.error('فشل في الاتصال مع مورفو AI');
        }
      } catch (error) {
        console.error('Connection initialization failed:', error);
        setConnectionStatus('error');
        toast.error('خطأ في تهيئة الاتصال');
      }
    };

    initializeMorvo();

    // Listen for Morvo responses
    const handleMorvoResponse = (event: CustomEvent) => {
      const response = event.detail;
      console.log('📥 Received Morvo response:', response);
      
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        content: response.message,
        sender: 'assistant',
        timestamp: new Date(),
        agentsInvolved: response.agentsInvolved || [],
        processingTime: response.processingTime,
        cost: response.cost,
        displayTime: new Date().toLocaleTimeString('ar-SA', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    };

    window.addEventListener('morvoResponse', handleMorvoResponse as EventListener);
    
    return () => {
      window.removeEventListener('morvoResponse', handleMorvoResponse as EventListener);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    console.log('🔍 Debug: Sending message via HTTP service:', {
      httpService: chatHttpService.isConnected(),
      baseUrl: 'https://morvo-production.up.railway.app',
      message: inputMessage
    });

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      displayTime: new Date().toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Send message via HTTP service
      const success = await chatHttpService.sendMessage(inputMessage);
      console.log('📥 Message send result:', success);
      
      if (!success) {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setIsTyping(false);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        content: 'عذراً، حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
        sender: 'assistant',
        timestamp: new Date(),
        displayTime: new Date().toLocaleTimeString('ar-SA', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('فشل في إرسال الرسالة');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const testMorvoConnection = async () => {
    try {
      console.log('🧪 Testing Morvo AI connection...');
      const health = await chatHttpService.performHealthCheck();
      console.log('Health check result:', health);
      
      if (health.success) {
        setConnectionStatus('connected');
        toast.success('✅ Morvo AI is connected and working!');
      } else {
        setConnectionStatus('error');
        toast.error('❌ Morvo AI connection failed');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
      toast.error('Connection test failed');
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
        return 'متصل بـ Railway';
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
            <span className="font-bold">مورفو AI - HTTP</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={testMorvoConnection}
          className="mt-2"
        >
          Test Connection
        </Button>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h4 className="font-bold text-gray-900 mb-2">مرحباً بك في مورفو AI</h4>
                <p className="text-sm text-gray-600">
                  متصل مباشرة بـ Railway backend
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Base URL: https://morvo-production.up.railway.app
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
                    <p className="text-sm">{message.content}</p>
                    {message.agentsInvolved && message.agentsInvolved.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.agentsInvolved.map((agent, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {agent}
                          </Badge>
                        ))}
                      </div>
                    )}
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
            {connectionStatus !== 'connected' && (
              <p className="text-xs text-red-600 mt-2 text-center">
                غير متصل بـ Morvo AI - جاري المحاولة...
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
