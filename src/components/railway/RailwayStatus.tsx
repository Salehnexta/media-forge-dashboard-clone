
// Railway connection status indicator component
import React from 'react';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';

export const RailwayStatus = () => {
  const { status, lastChecked, checkConnection } = useConnectionStatus();
  
  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'مورفو متصل';
      case 'offline':
        return 'مورفو غير متصل';
      case 'checking':
        return 'جاري التحقق...';
      default:
        return 'حالة غير معروفة';
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'text-green-600';
      case 'offline':
        return 'text-red-600';
      case 'checking':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" dir="rtl">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'online' ? 'bg-green-500 animate-pulse' :
          status === 'offline' ? 'bg-red-500' :
          'bg-yellow-500 animate-pulse'
        }`} />
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {lastChecked && (
        <span className="text-xs text-gray-500">
          آخر تحقق: {lastChecked.toLocaleTimeString('ar-SA')}
        </span>
      )}
      
      {status === 'offline' && (
        <button 
          onClick={checkConnection}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};
