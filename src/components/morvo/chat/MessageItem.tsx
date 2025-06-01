
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatMessage, AIManager } from '@/types/morvo';
import { agentInfo } from '@/components/chat/constants';

interface MessageItemProps {
  message: ChatMessage;
  getManagerColor: (manager: AIManager) => string;
  formatTime: (date: Date) => string;
}

export const MessageItem = ({ message, getManagerColor, formatTime }: MessageItemProps) => {
  if (message.sender === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs">
          <p className="text-sm">{message.text}</p>
          <p className="text-xs opacity-75 mt-1">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="bg-white border rounded-lg p-4 max-w-xs shadow-sm">
        {message.manager && (
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 ${getManagerColor(message.manager)} rounded-full flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">
                {agentInfo[message.manager]?.name.charAt(0)}
              </span>
            </div>
            <Badge className={`${agentInfo[message.manager]?.color} text-white text-xs`}>
              {agentInfo[message.manager]?.name}
            </Badge>
          </div>
        )}
        <p className="text-sm text-gray-800 leading-relaxed">{message.text}</p>
        {message.actionButton && (
          <Button
            onClick={message.actionButton.action}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            {message.actionButton.label}
          </Button>
        )}
        <p className="text-xs text-gray-500 mt-2">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
};
