
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { Wifi, WifiOff, RotateCcw } from 'lucide-react';

export const RailwayConnectionStatus = () => {
  const { status, lastChecked, checkConnection } = useConnectionStatus();
  
  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'checking':
        return <RotateCcw className="w-4 h-4 text-yellow-600 animate-spin" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-600" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Railway متصل';
      case 'offline':
        return 'Railway غير متصل';
      case 'checking':
        return 'جاري التحقق...';
      default:
        return 'حالة غير معروفة';
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" dir="rtl">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <Badge className={`${getStatusColor()} border`}>
          {getStatusText()}
        </Badge>
      </div>
      
      {lastChecked && (
        <span className="text-xs text-gray-500">
          آخر تحقق: {lastChecked.toLocaleTimeString('ar-SA')}
        </span>
      )}
      
      {status === 'offline' && (
        <Button 
          onClick={checkConnection}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <RotateCcw className="w-3 h-3 ml-1" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};
