
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Send, Bot, User, Plus, MessageCircle, Heart, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AIManager } from "@/types/morvo";
import { useChatLogic } from "@/hooks/useChatLogic";
import { useMorvoMemory } from "@/hooks/useMorvoMemory";
import { useIsMobile } from "@/hooks/use-mobile";
import { InputSanitizer } from "@/components/security/InputSanitizer";
import { chatRateLimiter } from "@/components/security/RateLimiter";
import { useComponentPerformance } from "@/hooks/useEnhancedPerformance";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { toast } from "sonner";
import { getRandomResponse } from "@/data/morvoPersonality";

interface EnhancedChatSectionProps {
  selectedManager: AIManager;
  onManagerSelect: (manager: AIManager) => void;
  onDashboardCommand?: (command: any) => void;
}

const EnhancedChatSectionInner = ({
  selectedManager,
  onManagerSelect,
  onDashboardCommand
}: EnhancedChatSectionProps) => {
  useComponentPerformance('EnhancedChatSection');
  
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

  const {
    saveConversation,
    rememberUserPreference,
    getUserMemory,
    handleSpecialCommands,
    getContextualGreeting,
    personality
  } = useMorvoMemory();

  const isMobile = useIsMobile();
  const [showMemories, setShowMemories] = useState(false);

  // Memoized dashboard command callback
  const memoizedOnDashboardCommand = useCallback((command: any) => {
    console.log('Dashboard command received:', command);
    onDashboardCommand?.(command);
  }, [onDashboardCommand]);

  // Set up dashboard command callback
  useEffect(() => {
    if (memoizedOnDashboardCommand) {
      setDashboardCommandCallback(() => memoizedOnDashboardCommand);
    }
  }, [memoizedOnDashboardCommand, setDashboardCommandCallback]);

  // Sync current agent with selected manager
  useEffect(() => {
    if (currentAgent !== selectedManager) {
      setCurrentAgent(selectedManager);
    }
  }, [selectedManager, currentAgent, setCurrentAgent]);

  // Enhanced message handling with memory and special commands
  const handleSendMessage = useCallback(() => {
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

    // Check for special commands first
    if (handleSpecialCommands(message)) {
      setMessage('');
      return;
    }

    // Sanitize message before sending
    const sanitizedMessage = InputSanitizer.sanitizeText(message);
    
    // Save conversation with memory context
    saveConversation({
      message: sanitizedMessage,
      agent: currentAgent,
      timestamp: new Date().toISOString(),
      context: {
        selectedManager,
        userMemories: personality.memories.slice(0, 5) // Include recent memories for context
      }
    }, currentAgent);

    // Update message state with sanitized content
    setMessage(sanitizedMessage);
    
    // Send the message
    originalHandleSendMessage();
  }, [message, originalHandleSendMessage, setMessage, handleSpecialCommands, saveConversation, currentAgent, selectedManager, personality.memories]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Basic input validation
    if (value.length <= 1000) {
      setMessage(value);
    }
  }, [setMessage]);

  // Get user's name for personalization
  const userName = getUserMemory('user_name')?.value || 'صديقي';

  // Memoized greeting with personality
  const personalizedGreeting = useMemo(() => {
    return getContextualGreeting();
  }, [getContextualGreeting]);

  // Show user memories
  const userMemories = useMemo(() => {
    return personality.memories.slice(0, 3);
  }, [personality.memories]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50">
      {/* Enhanced Chat header with personality info */}
      <div className="p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-sm">مورفو AI</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full ${isConnected ? 'animate-pulse' : ''}`}></div>
                <span className="text-xs text-gray-500">{isConnected ? 'متصل' : 'غير متصل'}</span>
                <Heart className="w-3 h-3 text-red-400" />
                <span className="text-xs text-gray-500">صديق ذكي</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowMemories(!showMemories)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Brain className="w-4 h-4" />
              {!isMobile && "الذكريات"}
            </Button>
            <Button
              onClick={() => setMessage('')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              {!isMobile && "محادثة جديدة"}
            </Button>
          </div>
        </div>

        {/* Memory display */}
        {showMemories && userMemories.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">الذكريات المحفوظة:</h4>
            <div className="space-y-1">
              {userMemories.map((memory, index) => (
                <div key={index} className="text-xs text-blue-700">
                  <Badge variant="secondary" className="mr-1">{memory.key}</Badge>
                  {String(memory.value).substring(0, 50)}...
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat messages area with enhanced personality */}
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">مرحباً {userName}!</h3>
              <p className="text-gray-600 text-sm mb-4 px-4">
                {personalizedGreeting}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>💡 استخدم /remember [نص] لحفظ معلومة مهمة</p>
                <p>🎨 استخدم /create [وصف] لإنشاء محتوى</p>
                <p>🧠 استخدم /forget [مفتاح] لنسيان معلومة</p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <span className="text-xs text-gray-500">مورفو AI</span>
                    <Heart className="w-3 h-3 text-red-400" />
                  </div>
                )}
                
                <div className={`p-3 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
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
                      <div className="text-sm whitespace-pre-line leading-relaxed">
                        {msg.text}
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
                    {msg.timestamp.toLocaleTimeString('ar-SA', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <span className="text-xs text-gray-500">مورفو AI</span>
                  <Heart className="w-3 h-3 text-red-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">يكتب بحب...</span>
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

      {/* Enhanced message input with command hints */}
      <div className="p-4 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="flex gap-2 mb-3">
          <Input
            value={message}
            onChange={handleMessageChange}
            placeholder={`تحدث مع ${personality.name} كصديق...`}
            className="flex-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            onKeyPress={handleKeyPress}
            disabled={isTyping}
            maxLength={1000}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isTyping}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 rounded-xl px-6 shadow-lg hover:shadow-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-400" />
          <p className="text-xs text-gray-500">
            {personality.name} يتذكر محادثاتكم ويتعلم من تفاعلكم
          </p>
          <div className={`w-2 h-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full ${isConnected ? 'animate-pulse' : ''} ml-auto`}></div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>{message.length}/1000</span>
          <span>
            ذكريات محفوظة: {personality.memories.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export const EnhancedChatSection = (props: EnhancedChatSectionProps) => (
  <ErrorBoundary>
    <EnhancedChatSectionInner {...props} />
  </ErrorBoundary>
);
