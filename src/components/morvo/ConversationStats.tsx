
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, DollarSign, Clock, Zap } from 'lucide-react';
import { ConversationStats as StatsType } from '@/types/morvoChat';

interface ConversationStatsProps {
  stats: StatsType;
  className?: string;
}

export const ConversationStats: React.FC<ConversationStatsProps> = ({ 
  stats, 
  className = '' 
}) => {
  if (stats.totalMessages === 0) return null;

  return (
    <Card className={`bg-white/10 backdrop-blur-md border-white/20 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm font-medium">إحصائيات المحادثة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span className="text-blue-100">الرسائل:</span>
            <span className="text-white font-medium">{stats.totalMessages}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="w-3 h-3 text-green-300" />
            <span className="text-blue-100">التكلفة:</span>
            <span className="text-white font-medium">${stats.totalCost.toFixed(4)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-300" />
            <span className="text-blue-100">الرموز:</span>
            <span className="text-white font-medium">{stats.totalTokens}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-purple-300" />
            <span className="text-blue-100">متوسط:</span>
            <span className="text-white font-medium">{stats.averageProcessingTime.toFixed(1)}s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
