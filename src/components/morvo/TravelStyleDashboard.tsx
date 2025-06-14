
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, PlusCircle } from 'lucide-react';
import { useMorvoChat } from '@/hooks/useMorvoChat';
import { EnhancedConnectionIndicator } from './EnhancedConnectionIndicator';
import { EnhancedTypingIndicator } from './EnhancedTypingIndicator';
import { EnhancedMessageBubble } from './EnhancedMessageBubble';
import { ConversationStats } from './ConversationStats';

export const TravelStyleDashboard: React.FC = () => {
  const {
    messages,
    isLoading,
    isTyping,
    connectionStatus,
    conversationStats,
    sendMessage,
    retryMessage,
    clearChat,
    checkConnection
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

          {/* Enhanced Connection Status */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <EnhancedConnectionIndicator status={connectionStatus} />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                disabled={!connectionStatus.isConnected || isLoading}
                className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-700/90 hover:to-purple-700/90 text-white border-none backdrop-blur-sm px-6 py-3 text-lg font-medium transition-all duration-200 hover:scale-105"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-6 max-w-7xl mx-auto w-full px-6 lg:px-8 pb-6">
          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <Card className="flex-1 bg-white/10 backdrop-blur-md border-white/20 mb-6">
              <CardContent className="p-0">
                <ScrollArea className="h-96 p-6">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <span className="text-white text-2xl font-bold">AI</span>
                        </div>
                        <h4 className="font-bold text-white mb-4 text-xl">مرحباً! كيف يمكنني مساعدتك؟</h4>
                        <p className="text-blue-100 max-w-md mx-auto leading-relaxed mb-6">
                          مساعدك الذكي في التسويق مع 9 وكلاء متخصصين جاهزين للمساعدة في استراتيجية التسويق، وسائل التواصل الاجتماعي، تحسين محركات البحث، والمزيد.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setInputMessage('أريد تحليل موقعي')}
                            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                          >
                            تحليل الموقع
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setInputMessage('أريد إنشاء حملة')}
                            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                          >
                            إنشاء حملة
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setInputMessage('أريد تحليل المنافسين')}
                            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                          >
                            تحليل المنافسين
                          </Button>
                        </div>
                      </div>
                    )}

                    {messages.map((message) => (
                      <EnhancedMessageBubble
                        key={message.id}
                        message={message}
                        onRetry={retryMessage}
                      />
                    ))}

                    {isTyping && <EnhancedTypingIndicator />}
                    
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
                    className="flex-1 bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-600 transition-all duration-200 focus:ring-2 focus:ring-blue-400"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading || !connectionStatus.isConnected}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 transition-all duration-200 hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {!connectionStatus.isConnected && (
                  <p className="text-red-300 text-sm mt-2 text-center">
                    {connectionStatus.error || 'غير متصل بـ Morvo AI'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Panel */}
          {conversationStats.totalMessages > 0 && (
            <div className="w-80 flex-shrink-0">
              <ConversationStats stats={conversationStats} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
