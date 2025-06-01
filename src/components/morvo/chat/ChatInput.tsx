
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
}

export const ChatInput = ({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  onKeyPress, 
  isTyping 
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex gap-2">
        <Button
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
        </Button>
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="تحدث مع فريق التسويق الذكي..."
          className="flex-1"
          onKeyPress={onKeyPress}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        اختر مديراً من الأعلى للتحدث معه عملياً، أو اطلب إنشاء محتوى أو تحليلات
      </p>
    </div>
  );
};
