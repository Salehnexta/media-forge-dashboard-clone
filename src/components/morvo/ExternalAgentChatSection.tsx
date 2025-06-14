
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Send, Bot, User, Plus, MessageCircle, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExternalAgentChat } from "@/hooks/useExternalAgentChat";
import { useIsMobile } from "@/hooks/use-mobile";
import { InputSanitizer } from "@/components/security/InputSanitizer";
import { chatRateLimiter } from "@/components/security/RateLimiter";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ExternalAgentConfigPanel } from "@/components/chat/ExternalAgentConfig";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ExternalAgentChatSectionProps {
  onDashboardCommand?: (command: any) => void;
}

const ExternalAgentChatSectionInner = ({
  onDashboardCommand
}: ExternalAgentChatSectionProps) => {
  const [showConfig, setShowConfig] = useState(false);
  
  const {
    messages,
    isTyping,
    isConnected,
    message,
    setMessage,
    handleSendMessage: originalHandleSendMessage,
    setDashboardCommandCallback,
    messagesEndRef,
    getCommandSuggestions,
    clearChat,
    testAgentConnection,
    currentConversationId
  } = useExternalAgentChat();

  const isMobile = useIsMobile();

  // Set up dashboard command callback
  const memoizedOnDashboardCommand = useCallback((command: any) => {
    console.log('Dashboard command received:', command);
    onDashboardCommand?.(command);
  }, [onDashboardCommand]);

  useEffect(() => {
    if (memoizedOnDashboardCommand) {
      setDashboardCommandCallback(() => memoizedOnDashboardCommand);
    }
  }, [memoizedOnDashboardCommand, setDashboardCommandCallback]);

  // Secure message handling
  const handleSendMessage = useCallback(() => {
    if (!chatRateLimiter.isAllowed()) {
      toast.error('Too many messages sent. Please wait a moment.');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message first');
      return;
    }

    if (message.length > 1000) {
      toast.error('Message is too long');
      return;
    }

    if (!isConnected) {
      toast.error('Agent is not connected. Please check configuration.');
      return;
    }

    const sanitizedMessage = InputSanitizer.sanitizeText(message);
    setMessage(sanitizedMessage);
    originalHandleSendMessage();
  }, [message, originalHandleSendMessage, setMessage, isConnected]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setMessage(value);
    }
  }, [setMessage]);

  const formatTime = useMemo(() => (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  const renderMessageContent = useCallback((text: string) => {
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
  }, []);

  const rateLimitInfo = useMemo(() => ({
    remaining: chatRateLimiter.getRemainingRequests(),
    messageLength: message.length
  }), [message.length]);

  const commandSuggestions = useMemo(() => getCommandSuggestions(), [getCommandSuggestions]);

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Modern Chat Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white" />
              </div>
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm">AI Assistant</span>
                <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                  {isConnected ? 'Online' : 'Offline'}
                </Badge>
              </div>
              {currentConversationId && (
                <span className="text-xs text-gray-500">
                  Session: {currentConversationId.slice(-6)}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Dialog open={showConfig} onOpenChange={setShowConfig}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agent Configuration</DialogTitle>
                </DialogHeader>
                <ExternalAgentConfigPanel />
              </DialogContent>
            </Dialog>
            <Button
              onClick={clearChat}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Welcome to AI Assistant</h3>
            <p className="text-gray-600 text-sm mb-4 px-4">
              I'm your intelligent marketing assistant. How can I help you today?
            </p>
            {!isConnected && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 mx-4">
                <p className="text-amber-800 text-sm">
                  ⚠️ Agent offline. Please configure agents in settings.
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-2 justify-center px-4">
              {commandSuggestions.slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage(suggestion)}
                  className="text-xs h-7 text-gray-600 hover:text-blue-600 hover:border-blue-300"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`rounded-2xl p-3 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white ml-4'
                  : 'bg-gray-50 text-gray-900 mr-4 border border-gray-100'
              }`}>
                <div className="flex items-start gap-2">
                  {msg.sender === 'ai' && (
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="text-sm leading-relaxed">
                      {renderMessageContent(msg.text)}
                    </div>
                    {msg.actionButton && (
                      <Button
                        onClick={msg.actionButton.action}
                        className="mt-2 h-7 text-xs"
                        size="sm"
                        variant={msg.sender === 'user' ? 'secondary' : 'default'}
                      >
                        {msg.actionButton.label}
                      </Button>
                    )}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs opacity-75 font-medium">Quick actions:</p>
                        <div className="flex flex-wrap gap-1">
                          {msg.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              onClick={() => setMessage(suggestion)}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 px-2"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 mr-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-gray-600">Thinking...</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Message Input */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex gap-2 mb-2">
          <Input
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message..."
            className="flex-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg text-sm"
            onKeyPress={handleKeyPress}
            disabled={isTyping || !isConnected}
            maxLength={1000}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isTyping || !isConnected}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
            <span>AI Assistant {isConnected ? 'ready' : 'offline'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{rateLimitInfo.messageLength}/1000</span>
            <span>Messages: {rateLimitInfo.remaining}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExternalAgentChatSection = (props: ExternalAgentChatSectionProps) => (
  <ErrorBoundary>
    <ExternalAgentChatSectionInner {...props} />
  </ErrorBoundary>
);
