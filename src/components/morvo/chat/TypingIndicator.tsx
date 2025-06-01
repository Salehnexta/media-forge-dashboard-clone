
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AIManager } from '@/types/morvo';
import { agentInfo } from '@/components/chat/constants';

interface TypingIndicatorProps {
  currentTypingManager: AIManager;
  getManagerColor: (manager: AIManager) => string;
}

export const TypingIndicator = ({ currentTypingManager, getManagerColor }: TypingIndicatorProps) => {
  return (
    <div className="flex justify-start">
      <div className="bg-white border rounded-lg p-4 max-w-xs shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-6 h-6 ${getManagerColor(currentTypingManager)} rounded-full flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">
              {agentInfo[currentTypingManager]?.name.charAt(0)}
            </span>
          </div>
          <Badge className={`${agentInfo[currentTypingManager]?.color} text-white text-xs`}>
            {agentInfo[currentTypingManager]?.name}
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};
