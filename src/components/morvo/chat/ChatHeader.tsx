
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Bot } from 'lucide-react';

interface ChatHeaderProps {
  onStartNewChat: () => void;
}

export const ChatHeader = ({ onStartNewChat }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900">فريق Morvo AI</span>
        </div>
        <Button
          onClick={onStartNewChat}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          محادثة جديدة
        </Button>
      </div>
    </div>
  );
};
