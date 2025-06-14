
import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { ConnectionStatus } from '@/types/morvoChat';

interface EnhancedConnectionIndicatorProps {
  status: ConnectionStatus;
  className?: string;
}

export const EnhancedConnectionIndicator: React.FC<EnhancedConnectionIndicatorProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusColor = () => {
    if (status.isConnected) return 'text-green-400';
    return 'text-red-400';
  };

  const getStatusIcon = () => {
    if (status.isConnected) return <Wifi className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (status.isConnected) return 'متصل بـ Morvo AI';
    return 'غير متصل';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${getStatusColor()}`}>
        {getStatusIcon()}
      </div>
      <span className={`text-sm ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {status.isConnected && (
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      )}
    </div>
  );
};
