
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles, BarChart3, MessageCircle, Plus, Loader2 } from 'lucide-react';
import { useConversationalDashboard } from '@/hooks/useConversationalDashboard';
import { DynamicDashboardRenderer } from './DynamicDashboardRenderer';
import { ConversationMessage } from '@/types/conversational';

interface ConversationalInterfaceProps {
  className?: string;
}

export const ConversationalInterface: React.FC<ConversationalInterfaceProps> = ({
  className = ''
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    conversation,
    currentDashboard,
    isGenerating,
    generateDashboard,
    executeAction,
    clearConversation
  } = useConversationalDashboard();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!message.trim() || isGenerating) return;
    
    const currentMessage = message;
    setMessage('');
    await generateDashboard(currentMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const suggestedQuestions = [
    'كيف أداء وسائل التواصل الاجتماعي؟',
    'أظهر لي المبيعات والإيرادات',
    'أريد نظرة عامة على الأعمال',
    'ما هي أفضل المنتجات مبيعاً؟'
  ];

  return (
    <div className={`h-full flex flex-col bg-gradient-to-br from-gray-50 to-white ${className}`} dir="rtl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">مورفو AI - لوحة التحكم التفاعلية</h1>
              <p className="text-sm text-gray-600">اسأل أي سؤال وسأقوم بإنشاء لوحة تحكم مخصصة لك</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
              متصل
            </Badge>
            <Button
              onClick={clearConversation}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              محادثة جديدة
            </Button>
          </div>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Chat Column */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {conversation.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">مرحباً بك في مورفو AI</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  أسلوب جديد كلياً للتفاعل مع بياناتك. اسأل أي سؤال وسأقوم بإنشاء لوحة تحكم مخصصة لك فوراً!
                </p>
                
                {/* Suggested Questions */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">جرب هذه الأسئلة:</p>
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="mb-2 mx-1 text-xs"
                      onClick={() => {
                        setMessage(question);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {conversation.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.sender === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">مورفو AI</span>
                    </div>
                  )}
                  
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}>
                    <div className="flex items-start gap-2">
                      {msg.sender === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                      {msg.sender === 'ai' && <MessageCircle className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600" />}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                        {msg.dashboard && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-700 font-medium">
                              ✨ تم إنشاء لوحة تحكم تفاعلية - انظر في الجانب الأيسر
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className={`text-xs mt-2 ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">أقوم بتحليل بياناتك وإنشاء لوحة التحكم...</p>
                      <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-6 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
            <div className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اسأل عن أي شيء تريد تحليله... مثل: كيف أداء المبيعات؟"
                className="flex-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                onKeyPress={handleKeyPress}
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isGenerating}
                size="default"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl px-6 shadow-lg"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Column */}
        <div className="hidden lg:block w-1/2 border-r border-gray-200 bg-gray-50/50">
          <div className="h-full overflow-y-auto p-6">
            {currentDashboard ? (
              <DynamicDashboardRenderer
                dashboard={currentDashboard}
                onActionClick={executeAction}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد لوحة تحكم بعد</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    اسأل سؤالاً في المحادثة وسيتم إنشاء لوحة تحكم مخصصة هنا
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dashboard View */}
      {currentDashboard && (
        <div className="lg:hidden">
          <div className="p-6 border-t border-gray-200 bg-white">
            <DynamicDashboardRenderer
              dashboard={currentDashboard}
              onActionClick={executeAction}
            />
          </div>
        </div>
      )}
    </div>
  );
};
