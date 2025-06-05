
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChatBubble } from "@/components/chat/ChatBubble";
import { useChatLogic } from '@/hooks/useChatLogic';
import { AIManager } from '@/types/morvo';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CommandSuggestions } from '@/components/chat/CommandSuggestions';
import { ConnectionDiagnostics } from '@/components/chat/ConnectionDiagnostics';

interface EnhancedChatSectionProps {
  selectedManager?: AIManager;
  onManagerSelect?: (manager: AIManager) => void;
  onDashboardCommand?: (command: any) => void;
}

export const EnhancedChatSection = ({ 
  selectedManager, 
  onManagerSelect, 
  onDashboardCommand 
}: EnhancedChatSectionProps) => {
  const {
    messages,
    message,
    setMessage,
    handleSendMessage,
    currentAgent,
    setCurrentAgent,
    isTyping,
    isConnected,
    messagesEndRef,
    setDashboardCommandCallback,
    getCommandSuggestions,
    connectionState
  } = useChatLogic();
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Convert string suggestions to CommandSuggestion objects
  const formatCommandSuggestions = () => {
    const suggestions = getCommandSuggestions();
    return suggestions.map((suggestion: string) => ({
      command: suggestion,
      description: `تنفيذ الأمر: ${suggestion}`
    }));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50" dir="rtl">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={`/morvo-${currentAgent}.png`} />
              <AvatarFallback>Morvo</AvatarFallback>
            </Avatar>
            <select
              className="border rounded px-3 py-2 bg-white"
              value={currentAgent}
              onChange={(e) => setCurrentAgent(e.target.value as AIManager)}
            >
              <option value="strategic">الاستراتيجي</option>
              <option value="monitor">المراقب</option>
              <option value="executor">المنفذ</option>
              <option value="creative">المبدع</option>
              <option value="analyst">المحلل</option>
            </select>
          </div>
          
          {/* Connection status and diagnostics */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className={`text-sm ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {isConnected ? 'متصل' : 'غير متصل'}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="ml-2"
            >
              {showDiagnostics ? 'إخفاء التشخيص' : 'تشخيص الاتصال'}
            </Button>
          </div>
        </div>
        
        {/* Diagnostics panel */}
        {showDiagnostics && (
          <div className="mt-4">
            <ConnectionDiagnostics />
          </div>
        )}
      </div>

      {/* Messages list */}
      <div className="flex-grow overflow-y-auto p-4">
        <ScrollArea className="h-[65vh] rounded-md">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <ChatBubble
              message={{
                id: 'typing',
                text: '...',
                sender: 'ai',
                timestamp: new Date(),
                manager: currentAgent
              }}
            />
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Input
            type="text"
            placeholder="اكتب رسالتك هنا..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
                setShowSuggestions(false);
              } else if (e.key === '/') {
                setShowSuggestions(true);
              }
            }}
            className="flex-grow rounded-l-md"
          />
          <Button onClick={handleSendMessage} className="rounded-r-md">إرسال</Button>
        </div>
        {showSuggestions && (
          <CommandSuggestions
            suggestions={formatCommandSuggestions()}
            onSelect={(command) => {
              setMessage(command);
              setShowSuggestions(false);
            }}
          />
        )}
      </div>
    </div>
  );
};
