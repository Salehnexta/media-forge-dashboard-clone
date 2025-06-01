
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChatWidgetProps } from './types';
import { useChatLogic } from './hooks/useChatLogic';
import { ChatButton } from './components/ChatButton';
import { MinimizedView } from './components/MinimizedView';
import { ChatHeader } from './components/ChatHeader';
import { AgentSelector } from './components/AgentSelector';
import { WelcomeMessage } from './components/WelcomeMessage';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';

export const UniversalChatWidget = ({ className }: ChatWidgetProps) => {
  const {
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    message,
    setMessage,
    chatHistory,
    currentAgent,
    setCurrentAgent,
    isTyping,
    messagesEndRef,
    handleSendMessage
  } = useChatLogic();

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
  };

  if (!isOpen) {
    return <ChatButton onClick={() => setIsOpen(true)} className={className} />;
  }

  if (isMinimized) {
    return (
      <MinimizedView
        currentAgent={currentAgent}
        onMaximize={() => setIsMinimized(false)}
        onClose={() => setIsOpen(false)}
      />
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-lg flex flex-col">
      <ChatHeader
        onMinimize={() => setIsMinimized(true)}
        onClose={() => setIsOpen(false)}
      />

      <AgentSelector
        currentAgent={currentAgent}
        onAgentChange={setCurrentAgent}
      />

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatHistory.length === 0 ? (
          <WelcomeMessage
            currentAgent={currentAgent}
            onSuggestedQuestion={handleSuggestedQuestion}
          />
        ) : (
          <MessageList
            chatHistory={chatHistory}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />
        )}
      </div>

      <ChatInput
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        currentAgent={currentAgent}
        isTyping={isTyping}
      />
    </Card>
  );
};
