
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2, AlertTriangle } from 'lucide-react';
import { ConnectionStatus } from '@/services/MorvoWebSocketService';

interface ConnectionStatusIndicatorProps {
  status: ConnectionStatus;
  className?: string;
}

export const ConnectionStatusIndicator = ({ status, className = '' }: ConnectionStatusIndicatorProps) => {
  const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
      case 'connecting':
        return {
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          text: 'جاري الاتصال...',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800'
        };
      case 'connected':
        return {
          icon: <Wifi className="w-3 h-3" />,
          text: 'متصل',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-3 h-3" />,
          text: 'غير متصل',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800'
        };
      case 'error':
        return {
          icon: <AlertTriangle className="w-3 h-3" />,
          text: 'خطأ في الاتصال',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: <WifiOff className="w-3 h-3" />,
          text: 'غير محدد',
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={`gap-1 ${config.className} ${className}`}>
      {config.icon}
      <span className="text-xs">{config.text}</span>
    </Badge>
  );
};
