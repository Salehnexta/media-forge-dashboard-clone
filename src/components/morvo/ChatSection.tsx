
import { useState, useEffect } from "react";
import { Send, Bot, User, Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIManager } from "@/types/morvo";
import { useChatLogic } from "@/hooks/useChatLogic";
import { useIsMobile } from "@/hooks/use-mobile";
import { InputSanitizer } from "@/components/security/InputSanitizer";
import { chatRateLimiter } from "@/components/security/RateLimiter";
import { toast } from "sonner";

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
    currentAgent,
    isTyping,
    isConnected,
    message,
    setMessage,
    handleSendMessage: originalHandleSendMessage,
    setCurrentAgent,
    setDashboardCommandCallback,
    messagesEndRef
  } = useChatLogic();

  const isMobile = useIsMobile();

  // Set up dashboard command callback
  useEffect(() => {
    if (onDashboardCommand) {
      setDashboardCommandCallback(() => onDashboardCommand);
    }
  }, [onDashboardCommand, setDashboardCommandCallback]);

  // Sync current agent with selected manager
  useEffect(() => {
    setCurrentAgent(selectedManager);
  }, [selectedManager, setCurrentAgent]);

  // Secure message handling with rate limiting and sanitization
  const handleSendMessage = () => {
    // Rate limiting check
    if (!chatRateLimiter.isAllowed()) {
      toast.error('تم إرسال رسائل كثيرة. يرجى الانتظار قليلاً.');
      return;
    }

    // Input validation
    if (!message.trim()) {
      toast.error('يرجى كتابة رسالة أولاً');
      return;
    }

    if (message.length > 1000) {
      toast.error('الرسالة طويلة جداً');
      return;
    }

    // Sanitize message before sending
    const sanitizedMessage = InputSanitizer.sanitizeText(message);
    
    // Update message state with sanitized content
    setMessage(sanitizedMessage);
    
    // Send the message
    originalHandleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Basic input validation
    if (value.length <= 1000) {
      setMessage(value);
    }
  };

  const clearChat = () => {
    // يمكن إضافة وظيفة مسح المحادثة هنا
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageContent = (text: string) => {
    // Sanitize message content before rendering
    const sanitizedText = InputSanitizer.sanitizeHTML(text, {
      allowedTags: ['p', 'br', 'strong', 'em'],
      allowedAttributes: []
    });
    
    return (
      <div 
        dangerouslySetInnerHTML={{ 
          __html: sanitizedText 
        }} 
      />
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Chat header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-sm lg:text-base">مورفو AI</span>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-2 h-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full ${isConnected ? 'animate-pulse' : ''}`}></div>
                <span className="text-xs text-gray-500">{isConnected ? 'متصل' : 'غير متصل'}</span>
              </div>
            </div>
          </div>
          <Button
            onClick={clearChat}
            variant="outline"
            size="sm"
            className="gap-2 hover:bg-gray-50 transition-colors border-gray-200"
          >
            <Plus className="w-4 h-4" />
            {!isMobile && "محادثة جديدة"}
          </Button>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 lg:py-12">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-white font-bold text-xl lg:text-2xl">M</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">مرحباً بك في مورفو AI</h3>
              <p className="text-gray-600 text-sm lg:text-base mb-6 px-4">
                أنا مورفو، مساعدك الذكي في التسويق. كيف يمكنني مساعدتك اليوم؟
              </p>
              <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-200 shadow-lg mx-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 text-sm">الخدمات المتاحة</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs lg:text-sm">
                  <div className="text-gray-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    تحليل الاستراتيجيات التسويقية
                  </div>
                  <div className="text-gray-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    إدارة الحملات الإعلانية
                  </div>
                  <div className="text-gray-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    إنشاء المحتوى الإبداعي
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-[85%] lg:max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <span className="text-xs text-gray-500">مورفو AI</span>
                  </div>
                )}
                
                <div className={`p-3 lg:p-4 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-start gap-2">
                    {msg.sender === 'user' && (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    {msg.sender === 'ai' && (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-blue-600" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm lg:text-base whitespace-pre-line leading-relaxed">
                        {renderMessageContent(msg.text)}
                      </div>
                      {msg.actionButton && (
                        <Button
                          onClick={msg.actionButton.action}
                          className="mt-3 text-xs"
                          size="sm"
                          variant={msg.sender === 'user' ? 'secondary' : 'default'}
                        >
                          {msg.actionButton.label}
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs mt-2 ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-gray-200 rounded-2xl p-3 lg:p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <span className="text-xs text-gray-500">مورفو AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">يكتب...</span>
                  <div className="flex gap-1 mr-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="p-4 lg:p-6 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="flex gap-2 lg:gap-3 mb-3">
          <Input
            value={message}
            onChange={handleMessageChange}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm lg:text-base"
            onKeyPress={handleKeyPress}
            disabled={isTyping}
            maxLength={1000}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isTyping}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 rounded-xl px-4 lg:px-6 shadow-lg hover:shadow-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <p className="text-xs text-gray-500">
            مورفو AI جاهز للمساعدة
          </p>
          <div className={`w-2 h-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full ${isConnected ? 'animate-pulse' : ''} ml-auto`}></div>
        </div>
        
        {/* Rate limit indicator */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>{message.length}/1000</span>
          <span>
            الرسائل المتبقية: {chatRateLimiter.getRemainingRequests()}
          </span>
        </div>
      </div>
    </div>
  );
};
