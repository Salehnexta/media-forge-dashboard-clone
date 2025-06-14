
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bot, Clock, DollarSign } from 'lucide-react';

interface EnhancedAgentBadgesProps {
  agentsInvolved?: string[];
  processingTime?: number;
  costTracking?: {
    total_cost: number;
    tokens_used: number;
  };
}

export const EnhancedAgentBadges: React.FC<EnhancedAgentBadgesProps> = ({
  agentsInvolved,
  processingTime,
  costTracking
}) => {
  if (!agentsInvolved?.length && !processingTime && !costTracking) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {agentsInvolved?.map((agent, index) => (
        <Badge 
          key={index} 
          variant="secondary" 
          className="text-xs bg-blue-100 text-blue-800 flex items-center gap-1"
        >
          <Bot className="w-3 h-3" />
          {agent}
        </Badge>
      ))}
      
      {processingTime && (
        <Badge variant="outline" className="text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {processingTime.toFixed(1)}s
        </Badge>
      )}
      
      {costTracking && (
        <Badge variant="outline" className="text-xs flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          ${costTracking.total_cost.toFixed(4)}
        </Badge>
      )}
    </div>
  );
};
