
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Send, Bot, User, Plus, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExternalAgentChat } from "@/hooks/useExternalAgentChat";
import { useIsMobile } from "@/hooks/use-mobile";
import { InputSanitizer } from "@/components/security/InputSanitizer";
import { chatRateLimiter } from "@/components/security/RateLimiter";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ExternalAgentConfig } from "@/components/chat/ExternalAgentConfig";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
    <div className="flex flex-col h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Chat header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-sm lg:text-base">External AI Agent</span>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-2 h-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full ${isConnected ? 'animate-pulse' : ''}`}></div>
                <span className="text-xs text-gray-500">{isConnected ? 'Connected' : 'Disconnected'}</span>
                {currentConversationId && (
                  <span className="text-xs text-gray-400 ml-2">
                    ID: {currentConversationId.slice(-8)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={showConfig} onOpenChange={setShowConfig}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="w-4 h-4" />
                  {!isMobile && "Config"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Agent Configuration</DialogTitle>
                </DialogHeader>
                <ExternalAgentConfig />
              </DialogContent>
            </Dialog>
            <Button
              onClick={clearChat}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              {!isMobile && "New Chat"}
            </Button>
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 lg:py-12">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-white font-bold text-xl lg:text-2xl">AI</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Welcome to External AI Agent</h3>
              <p className="text-gray-600 text-sm lg:text-base mb-6 px-4">
                I'm your external AI agent. How can I help you today?
              </p>
              {!isConnected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Agent not connected. Please configure your external agents in settings.
                  </p>
                </div>
              )}
              <div className="flex flex-wrap gap-2 justify-center">
                {commandSuggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(suggestion)}
                    className="text-xs"
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
              <div className={`max-w-[85%] lg:max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <span className="text-xs text-gray-500">External Agent</span>
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
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <p className="text-xs opacity-75">Suggestions:</p>
                          <div className="flex flex-wrap gap-1">
                            {msg.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                onClick={() => setMessage(suggestion)}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
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
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-500">External Agent</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Typing...</span>
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
            placeholder="Type your message here..."
            className="flex-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm lg:text-base"
            onKeyPress={handleKeyPress}
            disabled={isTyping || !isConnected}
            maxLength={1000}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isTyping || !isConnected}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 rounded-xl px-4 lg:px-6 shadow-lg hover:shadow-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <p className="text-xs text-gray-500">
            External AI Agent {isConnected ? 'ready' : 'disconnected'}
          </p>
          <div className={`w-2 h-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full ${isConnected ? 'animate-pulse' : ''} ml-auto`}></div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>{rateLimitInfo.messageLength}/1000</span>
          <span>Messages remaining: {rateLimitInfo.remaining}</span>
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
