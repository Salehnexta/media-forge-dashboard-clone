
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
import { Wifi, WifiOff, AlertTriangle, MessageCircle, Bell, Settings, Sparkles } from 'lucide-react';
import { EnhancedMorvoChat } from './EnhancedMorvoChat';
import { SmartAlertsPanel } from './SmartAlertsPanel';
import { PlatformSelector } from './PlatformSelector';
import { SmartAlert } from '@/services/MorvoWebSocketService';
import { toast } from 'sonner';

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
  const [activeTab, setActiveTab] = useState<'chat' | 'alerts' | 'platforms'>('chat');
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  const handleSmartAlert = useCallback((alert: SmartAlert) => {
    setUnreadAlerts(prev => prev + 1);
    
    // Show toast notification
    const priorityEmoji = {
      low: '🟢',
      medium: '🟡', 
      high: '🟠',
      critical: '🔴'
    };
    
    const emoji = priorityEmoji[alert.priority] || '🔔';
    toast.info(`${emoji} تنبيه جديد: ${alert.title}`, {
      action: {
        label: 'عرض',
        onClick: () => setActiveTab('alerts')
      }
    });
  }, []);

  const handleTabChange = (tab: 'chat' | 'alerts' | 'platforms') => {
    setActiveTab(tab);
    if (tab === 'alerts') {
      setUnreadAlerts(0);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50" dir="rtl">
      {/* Enhanced header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/morvo-ai-avatar.png" />
              <AvatarFallback>
                <MessageCircle className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                مورفو AI v2.0
                <Sparkles className="w-4 h-4 text-purple-500" />
              </h2>
              <p className="text-sm text-gray-600">مساعد ذكي مع تنبيهات وتكامل المنصات</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mode Selector */}
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
            
            {/* Additional Controls */}
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
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation for Enhanced Mode */}
        {chatMode === 'enhanced' && (
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={activeTab === 'chat' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleTabChange('chat')}
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4 ml-1" />
              المحادثة
            </Button>
            <Button
              variant={activeTab === 'alerts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleTabChange('alerts')}
              className="flex-1 relative"
            >
              <Bell className="w-4 h-4 ml-1" />
              التنبيهات
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === 'platforms' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleTabChange('platforms')}
              className="flex-1"
            >
              <Wifi className="w-4 h-4 ml-1" />
              المنصات
            </Button>
          </div>
        )}
        
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

      {/* Content Area */}
      <div className="flex-grow overflow-hidden">
        {chatMode === 'enhanced' ? (
          <div className="h-full p-4">
            {activeTab === 'chat' && (
              <EnhancedMorvoChat onSmartAlert={handleSmartAlert} />
            )}
            {activeTab === 'alerts' && (
              <SmartAlertsPanel />
            )}
            {activeTab === 'platforms' && (
              <PlatformSelector />
            )}
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

  const formatCommandSuggestions = () => {
    const suggestions = getCommandSuggestions();
    return suggestions.map((suggestion: string) => ({
      command: suggestion,
      description: `تنفيذ الأمر: ${suggestion}`
    }));
  };

  return (
    <>
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

        {!isConnected && (
          <Alert className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              تم تفعيل الوضع المحلي. الردود ستكون أساسية حتى يتم استعادة الاتصال.
            </AlertDescription>
          </Alert>
        )}
      </div>

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
