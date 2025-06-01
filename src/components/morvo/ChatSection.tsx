
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AIManager, ChatMessage } from "@/types/morvo";
import { aiManagers } from "@/data/morvoData";
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

  const getManagerColor = (manager: AIManager) => {
    const colors = {
      strategic: 'bg-blue-500',
      monitor: 'bg-pink-500',
      executor: 'bg-green-500',
      creative: 'bg-purple-500',
      analyst: 'bg-orange-500'
    };
    return colors[manager];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-gray-900">فريق Morvo AI</span>
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

        {/* AI Manager Selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">اختر المدير المختص:</p>
          <div className="grid grid-cols-1 gap-2">
            {aiManagers.map((manager) => (
              <button
                key={manager.id}
                onClick={() => onManagerSelect(manager.id)}
                className={`p-3 rounded-lg border text-right transition-all ${
                  selectedManager === manager.id
                    ? `${getManagerColor(manager.id)} text-white shadow-md`
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedManager === manager.id ? 'bg-white/20' : getManagerColor(manager.id)
                  } ${selectedManager === manager.id ? 'text-white' : 'text-white'}`}>
                    {manager.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{manager.name}</p>
                    <p className={`text-xs ${
                      selectedManager === manager.id ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      {manager.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">مرحباً بك في Morvo AI</h3>
              <p className="text-gray-600 text-sm mb-4">
                اختر أحد المديرين من الأعلى وابدأ محادثتك معه
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <Badge className={`${getManagerColor(selectedManager)} text-white mb-2`}>
                  {aiManagers.find(m => m.id === selectedManager)?.name}
                </Badge>
                <p className="text-sm text-gray-600">
                  {aiManagers.find(m => m.id === selectedManager)?.description}
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
                {msg.sender === 'ai' && msg.manager && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 ${getManagerColor(msg.manager)} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">
                        {aiManagers.find(m => m.id === msg.manager)?.name.charAt(0)}
                      </span>
                    </div>
                    <Badge className={`${getManagerColor(msg.manager)} text-white text-xs`}>
                      {aiManagers.find(m => m.id === msg.manager)?.name}
                    </Badge>
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
                  <div className={`w-6 h-6 ${getManagerColor(selectedManager)} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">
                      {aiManagers.find(m => m.id === selectedManager)?.name.charAt(0)}
                    </span>
                  </div>
                  <Badge className={`${getManagerColor(selectedManager)} text-white text-xs`}>
                    {aiManagers.find(m => m.id === selectedManager)?.name}
                  </Badge>
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
          <Badge className={`${getManagerColor(selectedManager)} text-white text-xs`}>
            {aiManagers.find(m => m.id === selectedManager)?.name}
          </Badge>
          <p className="text-xs text-gray-500">
            جاهز للمساعدة في {aiManagers.find(m => m.id === selectedManager)?.description}
          </p>
        </div>
      </div>
    </div>
  );
};
