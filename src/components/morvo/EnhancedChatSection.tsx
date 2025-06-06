
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
import { EnhancedRailwayStatus } from '@/components/railway/EnhancedRailwayStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, AlertTriangle, MessageCircle } from 'lucide-react';
import { EnhancedMorvoChat } from './EnhancedMorvoChat';

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
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showRailwayStatus, setShowRailwayStatus] = useState(false);
  const [chatMode, setChatMode] = useState<'enhanced' | 'legacy'>('enhanced');

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50" dir="rtl">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/morvo-ai-avatar.png" />
              <AvatarFallback>
                <MessageCircle className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">مورفو AI المساعد</h2>
              <p className="text-sm text-gray-600">نسخة محسّنة مع WebSocket</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={chatMode === 'enhanced' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChatMode('enhanced')}
            >
              محسّن
            </Button>
            <Button
              variant={chatMode === 'legacy' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChatMode('legacy')}
            >
              تقليدي
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRailwayStatus(!showRailwayStatus)}
              className="ml-2"
            >
              Railway
            </Button>

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
        
        {/* Railway Status Panel */}
        {showRailwayStatus && (
          <div className="mt-4">
            <EnhancedRailwayStatus />
          </div>
        )}
        
        {/* Diagnostics panel */}
        {showDiagnostics && (
          <div className="mt-4">
            <ConnectionDiagnostics />
          </div>
        )}
      </div>

      {/* Chat content */}
      <div className="flex-grow overflow-hidden">
        {chatMode === 'enhanced' ? (
          <div className="h-full p-4 flex items-center justify-center">
            <EnhancedMorvoChat />
          </div>
        ) : (
          <LegacyChatContent 
            selectedManager={selectedManager}
            onManagerSelect={onManagerSelect}
            onDashboardCommand={onDashboardCommand}
          />
        )}
      </div>
    </div>
  );
};

// Legacy chat component for backward compatibility
const LegacyChatContent = ({ selectedManager, onManagerSelect, onDashboardCommand }: any) => {
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

  // Convert string suggestions to CommandSuggestion objects
  const formatCommandSuggestions = () => {
    const suggestions = getCommandSuggestions();
    return suggestions.map((suggestion: string) => ({
      command: suggestion,
      description: `تنفيذ الأمر: ${suggestion}`
    }));
  };

  return (
    <>
      {/* Manager selector */}
      <div className="p-4 bg-white border-b">
        <select
          className="border rounded px-3 py-2 bg-white w-full"
          value={currentAgent}
          onChange={(e) => setCurrentAgent(e.target.value as AIManager)}
        >
          <option value="strategic">الاستراتيجي</option>
          <option value="monitor">المراقب</option>
          <option value="executor">المنفذ</option>
          <option value="creative">المبدع</option>
          <option value="analyst">المحلل</option>
        </select>
        
        {/* Connection status */}
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`} />
          <span className={`text-sm ${
            isConnected ? 'text-green-600' : 'text-red-600'
          }`}>
            {isConnected ? 'متصل' : 'غير متصل'}
          </span>
        </div>

        {/* Fallback Mode Alert */}
        {!isConnected && (
          <Alert className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              تم تفعيل الوضع المحلي. الردود ستكون أساسية حتى يتم استعادة الاتصال.
            </AlertDescription>
          </Alert>
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
    </>
  );
};
