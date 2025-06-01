
import React from 'react';
import { AIManager } from '@/types/morvo';
import { agentInfo, smartSuggestions, quickChartCommands } from '../constants';

interface WelcomeMessageProps {
  currentAgent: AIManager;
  onSuggestedQuestion: (question: string) => void;
}

export const WelcomeMessage = ({ currentAgent, onSuggestedQuestion }: WelcomeMessageProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chart': return '📊';
      case 'analysis': return '🔍';
      case 'strategy': return '🎯';
      case 'action': return '⚡';
      default: return '💡';
    }
  };

  return (
    <div className="text-center text-gray-500 space-y-4">
      <p className="text-sm">
        مرحباً! أنا {agentInfo[currentAgent].name}. كيف يمكنني مساعدتك اليوم؟
      </p>
      
      <div className="space-y-2">
        <p className="text-xs font-medium text-blue-600">أوامر الرسوم البيانية السريعة:</p>
        <div className="grid grid-cols-2 gap-1">
          {quickChartCommands.map((cmd, index) => (
            <button
              key={index}
              onClick={() => onSuggestedQuestion(cmd.command)}
              className="flex items-center gap-1 text-xs p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
            >
              {cmd.icon}
              <span className="truncate">{cmd.command}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium">اقتراحات ذكية:</p>
        {smartSuggestions[currentAgent].map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestedQuestion(suggestion.question)}
            className="flex items-start gap-2 w-full text-xs text-right p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
            <div className="flex-1">
              <span className="block">{suggestion.question}</span>
              {suggestion.icon && (
                <div className="flex items-center gap-1 mt-1 text-blue-500">
                  {suggestion.icon}
                  <span className="text-xs">رسم بياني</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
