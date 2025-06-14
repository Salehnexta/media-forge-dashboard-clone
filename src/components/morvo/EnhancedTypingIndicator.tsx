
import React from 'react';
import { Bot } from 'lucide-react';

export const EnhancedTypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white/90 rounded-2xl p-4 shadow-lg max-w-[80%]">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-900">Morvo AI</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">يفكر...</span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
