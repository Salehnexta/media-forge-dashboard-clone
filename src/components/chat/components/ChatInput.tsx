
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send } from 'lucide-react';
import { AIManager } from '@/types/morvo';
import { agentInfo } from '../constants';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  currentAgent: AIManager;
  isTyping: boolean;
}

export const ChatInput = ({ 
  message, 
  setMessage, 
  handleSendMessage, 
  currentAgent, 
  isTyping 
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك أو استخدم أوامر مثل /رسم-دائري..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="text-sm"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isTyping}
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Badge className={`${agentInfo[currentAgent].color} text-white text-xs`}>
          {agentInfo[currentAgent].name}
        </Badge>
        <span className="text-xs text-gray-500">
          جاهز للمساعدة في {agentInfo[currentAgent].description}
        </span>
      </div>
    </div>
  );
};
