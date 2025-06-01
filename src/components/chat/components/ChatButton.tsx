
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
  className?: string;
}

export const ChatButton = ({ onClick, className }: ChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg ${className}`}
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
};
