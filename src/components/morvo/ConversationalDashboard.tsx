
import React from 'react';
import { ConversationalInterface } from '@/components/conversational/ConversationalInterface';

interface ConversationalDashboardProps {
  className?: string;
}

export const ConversationalDashboard: React.FC<ConversationalDashboardProps> = ({
  className = ''
}) => {
  return (
    <div className={`min-h-screen ${className}`}>
      <ConversationalInterface />
    </div>
  );
};
