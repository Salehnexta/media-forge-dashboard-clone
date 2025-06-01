
import React from 'react';
import { Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/types/morvo';

interface MessageListProps {
  chatHistory: ChatMessage[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList = ({ chatHistory, isTyping, messagesEndRef }: MessageListProps) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {chatHistory.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <div className="flex items-start gap-2">
              {msg.sender === 'ai' && (
                <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
              )}
              {msg.sender === 'user' && (
                <User className="w-4 h-4 mt-1 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
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
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-1">
              <Bot className="w-4 h-4" />
              <span className="text-sm">يكتب...</span>
              <div className="flex gap-1">
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
  );
};
