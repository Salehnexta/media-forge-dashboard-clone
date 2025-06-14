
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Wifi, WifiOff, RotateCcw, Trash2, Clock, DollarSign, Zap } from 'lucide-react';
import { useMorvoChat } from '@/hooks/useMorvoChat';
import { ChatMessage } from '@/types/morvoChat';
import { AIManager } from '@/types/morvo';

interface ChatSectionProps {
  selectedManager: AIManager;
  onManagerSelect: (manager: AIManager) => void;
  onDashboardCommand?: (command: any) => void;
}

export const ChatSection = ({
  selectedManager,
  onManagerSelect,
  onDashboardCommand
}: ChatSectionProps) => {
  const {
    messages,
    agents,
    selectedAgent,
    setSelectedAgent,
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

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`;
  };

  const formatTime = (time: number) => {
    return `${time.toFixed(1)}s`;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Chat header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Morvo AI</h3>
              <p className="text-sm text-gray-600">مساعد التسويق الذكي</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkConnection}
              className="gap-2"
            >
              {connectionStatus.isConnected ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-600" />
              )}
              {connectionStatus.isConnected ? 'متصل' : 'غير متصل'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="gap-2"
              disabled={messages.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              مسح
            </Button>
          </div>
        </div>

        {/* Agent Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">اختر الوكيل:</label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-xs text-gray-500">{agent.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        {conversationStats.totalMessages > 0 && (
          <div className="flex gap-4 text-xs text-gray-600 pt-2 border-t">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {formatCost(conversationStats.totalCost)}
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {conversationStats.totalTokens} رمز
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(conversationStats.averageProcessingTime)} متوسط
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h4 className="font-bold text-gray-900 mb-2">مرحباً بك في Morvo AI</h4>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  مساعدك الذكي في التسويق مع 9 وكلاء متخصصين جاهزين للمساعدة في 
                  استراتيجية وسائل التواصل الاجتماعي، تحسين محركات البحث، مراقبة العلامة التجارية، التحليلات والذكاء التجاري، 
                  الإعلانات المدفوعة، التسويق عبر البريد الإلكتروني، إدارة المحتوى، وتحليل المنافسين.
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
                <div className="bg-white rounded-2xl p-4 shadow-sm border max-w-[80%]">
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

        {/* Input */}
        <div className="p-4 border-t bg-white/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اسأل Morvo AI أي شيء عن التسويق..."
              onKeyPress={handleKeyPress}
              disabled={isLoading || !connectionStatus.isConnected}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || !connectionStatus.isConnected}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {!connectionStatus.isConnected && (
            <p className="text-xs text-red-600 mt-2 text-center">
              {connectionStatus.error || 'غير متصل بـ Morvo AI'}
            </p>
          )}
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
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Morvo AI</span>
            {message.agentsInvolved && message.agentsInvolved.length > 0 && (
              <div className="flex gap-1">
                {message.agentsInvolved.map((agent, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {agent}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className={`p-4 rounded-2xl shadow-sm border ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
            : message.isError 
            ? 'bg-red-50 border-red-200 text-red-900'
            : 'bg-white text-gray-900'
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
              className="mt-2 gap-2 text-red-700 border-red-300 hover:bg-red-50"
            >
              <RotateCcw className="w-3 h-3" />
              إعادة المحاولة
            </Button>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
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
