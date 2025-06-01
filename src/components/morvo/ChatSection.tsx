
import { useState } from "react";
import { Send, Bot, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIManager, ChatMessage } from "@/types/morvo";
import { useChatLogic } from "@/components/chat/hooks/useChatLogic";

interface ChatSectionProps {
  selectedManager: AIManager;
  onManagerSelect: (manager: AIManager) => void;
}

export const ChatSection = ({
  selectedManager,
  onManagerSelect
}: ChatSectionProps) => {
  const {
    message,
    setMessage,
    chatHistory,
    isTyping,
    messagesEndRef,
    handleSendMessage
  } = useChatLogic();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">m1</span>
            </div>
            <span className="font-semibold text-gray-900">مدير التسويق الذكي</span>
          </div>
          <Button
            onClick={clearChat}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            محادثة جديدة
          </Button>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">m1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">مرحباً بك في Morvo AI</h3>
              <p className="text-gray-600 text-sm mb-4">
                أنا m1، مدير التسويق الذكي. كيف يمكنني مساعدتك اليوم؟
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">
                  يمكنني مساعدتك في جميع جوانب التسويق الرقمي والاستراتيجيات التسويقية
                </p>
              </div>
            </div>
          )}

          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">m1</span>
                    </div>
                    <span className="text-xs text-gray-500">مدير التسويق</span>
                  </div>
                )}
                
                <div className={`p-3 rounded-lg shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
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
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
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
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">m1</span>
                  </div>
                  <span className="text-xs text-gray-500">مدير التسويق</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">يكتب...</span>
                  <div className="flex gap-1 mr-2">
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
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2 mb-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1"
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isTyping}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">m1</span>
          </div>
          <p className="text-xs text-gray-500">
            مدير التسويق الذكي جاهز للمساعدة
          </p>
        </div>
      </div>
    </div>
  );
};
