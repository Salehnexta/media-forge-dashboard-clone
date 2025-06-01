
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
  className?: string;
}

export const ChatButton = ({
  onClick,
  className
}: ChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${className || ''}`}
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};
