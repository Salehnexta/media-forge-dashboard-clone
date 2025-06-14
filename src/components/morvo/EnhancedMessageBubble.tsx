
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, User, RotateCcw } from 'lucide-react';
import { ChatMessage } from '@/types/morvoChat';
import { EnhancedAgentBadges } from './EnhancedAgentBadges';

interface EnhancedMessageBubbleProps {
  message: ChatMessage;
  onRetry: (messageId: string) => void;
}

export const EnhancedMessageBubble: React.FC<EnhancedMessageBubbleProps> = ({ 
  message, 
  onRetry 
}) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-white">Morvo AI</span>
          </div>
        )}
        
        <div className={`p-4 rounded-2xl shadow-lg transition-all duration-200 ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
            : message.isError 
            ? 'bg-red-500/90 text-white'
            : 'bg-white/90 text-gray-900'
        }`}>
          {isUser && (
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">أنت</span>
            </div>
          )}
          
          <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
          
          {!isUser && (
            <EnhancedAgentBadges
              agentsInvolved={message.agentsInvolved}
              processingTime={message.processingTime}
              costTracking={message.costTracking}
            />
          )}
          
          {message.isError && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetry(message.id)}
              className="mt-3 gap-2 text-white border-white/30 hover:bg-white/20"
            >
              <RotateCcw className="w-3 h-3" />
              إعادة المحاولة
            </Button>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-blue-200">
          <span>
            {message.timestamp.toLocaleTimeString('ar-SA', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
