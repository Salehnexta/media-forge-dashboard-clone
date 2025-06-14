
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Wifi, WifiOff, Clock, DollarSign } from 'lucide-react';
import { useMorvoChat } from '@/hooks/useMorvoChat';
import { ChatMessage } from '@/types/morvoChat';

export const TravelStyleDashboard: React.FC = () => {
  const {
    messages,
    isLoading,
    isTyping,
    connectionStatus,
    conversationStats,
    sendMessage,
    retryMessage,
    clearChat
  } = useMorvoChat();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      await sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'عرض التحليلات +', action: () => sendMessage('أريد عرض تحليل شامل للأداء') },
    { label: 'إدارة المحتوى +', action: () => sendMessage('أريد إدارة المحتوى التسويقي') },
    { label: 'إنشاء حملة +', action: () => sendMessage('أريد إنشاء حملة تسويقية جديدة') }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-purple-900/90" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header Section */}
        <div className="flex-none p-6 lg:p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              مرحباً بك في مورفو AI
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              ابدأ من هنا واسألني أي شيء عن التسويق الذكي
            </p>
          </div>

          {/* Connection Status */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              {connectionStatus.isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <span className="text-white text-sm">
                {connectionStatus.isConnected ? 'متصل بـ Morvo AI' : 'غير متصل'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                disabled={!connectionStatus.isConnected || isLoading}
                className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-700/90 hover:to-purple-700/90 text-white border-none backdrop-blur-sm px-6 py-3 text-lg font-medium"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-6 lg:px-8 pb-6">
          {/* Messages Area */}
          <Card className="flex-1 bg-white/10 backdrop-blur-md border-white/20 mb-6">
            <CardContent className="p-0">
              <ScrollArea className="h-96 p-6">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <Bot className="w-16 h-16 mx-auto mb-4 text-blue-300" />
                      <h4 className="font-bold text-white mb-2">مرحباً! كيف يمكنني مساعدتك؟</h4>
                      <p className="text-blue-100 max-w-md mx-auto leading-relaxed">
                        مساعدك الذكي في التسويق مع 9 وكلاء متخصصين جاهزين للمساعدة في استراتيجية التسويق، وسائل التواصل الاجتماعي، تحسين محركات البحث، والمزيد.
                      </p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onRetry={retryMessage}
                    />
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/90 rounded-2xl p-4 shadow-lg max-w-[80%]">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">Morvo AI</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">يفكر...</span>
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Input Section */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="اسأل أي شيء، كلما شاركت أكثر كلما تمكنا من مساعدتك أكثر..."
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || !connectionStatus.isConnected}
                  className="flex-1 bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-600"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || !connectionStatus.isConnected}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {!connectionStatus.isConnected && (
                <p className="text-red-300 text-sm mt-2 text-center">
                  {connectionStatus.error || 'غير متصل بـ Morvo AI'}
                </p>
              )}

              {/* Stats */}
              {conversationStats.totalMessages > 0 && (
                <div className="flex justify-center gap-4 text-xs text-blue-200 mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${conversationStats.totalCost.toFixed(4)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {conversationStats.averageProcessingTime.toFixed(1)}s متوسط
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{
  message: ChatMessage;
  onRetry: (messageId: string) => void;
}> = ({ message, onRetry }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-medium text-white">Morvo AI</span>
            {message.agentsInvolved && message.agentsInvolved.length > 0 && (
              <div className="flex gap-1">
                {message.agentsInvolved.map((agent, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-blue-600/80 text-white">
                    {agent}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className={`p-4 rounded-2xl shadow-lg ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
            : message.isError 
            ? 'bg-red-500/90 text-white'
            : 'bg-white/90 text-gray-900'
        }`}>
          {isUser && (
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">أنت</span>
            </div>
          )}
          
          <p className="text-sm whitespace-pre-line">{message.text}</p>
          
          {message.isError && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetry(message.id)}
              className="mt-2 gap-2 text-white border-white/30 hover:bg-white/20"
            >
              إعادة المحاولة
            </Button>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1 text-xs text-blue-200">
          <span>
            {message.timestamp.toLocaleTimeString('ar-SA', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          
          {message.processingTime && (
            <div className="flex items-center gap-3">
              {message.costTracking && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${message.costTracking.total_cost.toFixed(4)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {message.processingTime.toFixed(1)}s
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
