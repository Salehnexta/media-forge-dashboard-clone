
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIManager } from '@/types/morvo';
import { agentInfo, smartSuggestions, quickChartCommands } from '../constants';
import { PieChart, BarChart3, TrendingUp } from 'lucide-react';

interface WelcomeMessageProps {
  currentAgent: AIManager;
  onSuggestedQuestion: (question: string) => void;
}

export const WelcomeMessage = ({ currentAgent, onSuggestedQuestion }: WelcomeMessageProps) => {
  const getIconComponent = (iconName: string) => {
    const iconMap = {
      PieChart: PieChart,
      BarChart3: BarChart3,
      TrendingUp: TrendingUp
    };
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || BarChart3;
    return <IconComponent className="w-3 h-3" />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chart':
        return <BarChart3 className="w-3 h-3" />;
      case 'analysis':
        return <TrendingUp className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <div>
            <h3 className="font-semibold">مرحباً بك في Morvo AI</h3>
            <Badge className={`${agentInfo[currentAgent].color} text-white text-xs`}>
              {agentInfo[currentAgent].name}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          كيف يمكنني مساعدتك في {agentInfo[currentAgent].description}؟
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">أسئلة مقترحة:</h4>
        <div className="space-y-2">
          {smartSuggestions[currentAgent].slice(0, 3).map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full text-right justify-start text-sm h-auto py-2 px-3"
              onClick={() => onSuggestedQuestion(suggestion.question)}
            >
              <div className="flex items-center gap-2">
                {getCategoryIcon(suggestion.category)}
                <span>{suggestion.question}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">أوامر سريعة:</h4>
        <div className="grid grid-cols-2 gap-2">
          {quickChartCommands.map((command, index) => (
            <Button
              key={index}
              variant="ghost"
              className="text-xs h-auto py-2 px-2 flex flex-col items-center gap-1"
              onClick={() => onSuggestedQuestion(command.command)}
            >
              {getIconComponent(command.iconName)}
              <span className="text-center">{command.description}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
