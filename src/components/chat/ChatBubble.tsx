
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChatMessage, AIManager } from '@/types/morvo';
import { Wifi, WifiOff } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
}

const getManagerColor = (manager: AIManager): string => {
  const colors = {
    strategic: 'bg-blue-500',
    monitor: 'bg-green-500',
    executor: 'bg-purple-500',
    creative: 'bg-orange-500',
    analyst: 'bg-red-500'
  };
  return colors[manager] || 'bg-gray-500';
};

const getManagerName = (manager: AIManager): string => {
  const names = {
    strategic: 'الاستراتيجي',
    monitor: 'المراقب',
    executor: 'المنفذ',
    creative: 'المبدع',
    analyst: 'المحلل'
  };
  return names[manager] || 'مورفو';
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ar-SA', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  if (message.sender === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs">
          <p className="text-sm">{message.text}</p>
          <p className="text-xs opacity-75 mt-1">{formatTime(message.timestamp)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white border rounded-lg p-4 max-w-xs shadow-sm">
        {message.manager && (
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 ${getManagerColor(message.manager)} rounded-full flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">
                {getManagerName(message.manager).charAt(0)}
              </span>
            </div>
            <Badge className={`${getManagerColor(message.manager)} text-white text-xs`}>
              {getManagerName(message.manager)}
            </Badge>
            {/* Fallback indicator */}
            {(message as any).isFallback && (
              <Badge variant="outline" className="text-xs">
                <WifiOff className="w-3 h-3 ml-1" />
                محلي
              </Badge>
            )}
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
