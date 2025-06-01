
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Minimize2, X } from 'lucide-react';

interface ChatHeaderProps {
  onMinimize: () => void;
  onClose: () => void;
}

export const ChatHeader = ({ onMinimize, onClose }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5 text-blue-600" />
        <span className="font-medium">مساعد Morvo AI</span>
      </div>
      <div className="flex gap-1">
        <Button
          onClick={onMinimize}
          variant="ghost"
          size="sm"
        >
          <Minimize2 className="w-4 h-4" />
        </Button>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
