
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Maximize2, X } from 'lucide-react';
import { AIManager } from '@/types/morvo';
import { agentInfo } from '../constants';

interface MinimizedViewProps {
  currentAgent: AIManager;
  onMaximize: () => void;
  onClose: () => void;
}

export const MinimizedView = ({ currentAgent, onMaximize, onClose }: MinimizedViewProps) => {
  return (
    <Card className="fixed bottom-6 right-6 z-50 w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span className="font-medium">مساعد Morvo AI</span>
            <Badge className={`${agentInfo[currentAgent].color} text-white text-xs`}>
              {agentInfo[currentAgent].name}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              onClick={onMaximize}
              variant="ghost"
              size="sm"
            >
              <Maximize2 className="w-4 h-4" />
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
      </CardContent>
    </Card>
  );
};
