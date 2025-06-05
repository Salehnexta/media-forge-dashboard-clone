
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Server,
  Zap
} from 'lucide-react';
import { railwayConnectionService, RailwayConnectionStatus } from '@/services/RailwayConnectionService';

export const EnhancedRailwayStatus = () => {
  const [status, setStatus] = useState<RailwayConnectionStatus>({
    isOnline: false,
    httpReachable: false,
    websocketSupported: false,
    lastChecked: new Date()
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const newStatus = await railwayConnectionService.checkRailwayHealth();
      setStatus(newStatus);
    } finally {
      setIsChecking(false);
    }
  };

  const forceReconnect = async () => {
    await railwayConnectionService.forceReconnect();
    await checkConnection();
  };

  useEffect(() => {
    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (status.isOnline) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = () => {
    if (isChecking) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (status.isOnline) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const getStatusText = () => {
    if (isChecking) return 'جاري الفحص...';
    if (status.isOnline) return 'Railway متصل';
    return 'Railway غير متصل';
  };

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          حالة خادم Railway
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <Badge className={`${getStatusColor()} border`}>
              {getStatusText()}
            </Badge>
            {status.latency && (
              <span className="text-sm text-gray-500">
                {status.latency}ms
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={checkConnection}
              disabled={isChecking}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 ml-1 ${isChecking ? 'animate-spin' : ''}`} />
              فحص
            </Button>
            
            {!status.isOnline && (
              <Button 
                onClick={forceReconnect}
                variant="default"
                size="sm"
              >
                <Wifi className="h-4 w-4 ml-1" />
                إعادة الاتصال
              </Button>
            )}
          </div>
        </div>

        {/* Detailed Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm">
            {status.httpReachable ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <span>HTTP: {status.httpReachable ? 'متصل' : 'غير متصل'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            {status.websocketSupported ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <span>WebSocket: {status.websocketSupported ? 'مدعوم' : 'غير مدعوم'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>آخر فحص: {status.lastChecked.toLocaleTimeString('ar-SA')}</span>
          </div>
        </div>

        {/* Error Message */}
        {status.errorMessage && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>تفاصيل الخطأ:</strong> {status.errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Railway URL:</strong> https://morvo-ai-v2.up.railway.app</p>
          <p><strong>WebSocket URL:</strong> wss://morvo-ai-v2.up.railway.app/ws</p>
          {!status.isOnline && (
            <p className="text-amber-600">
              <strong>نصيحة:</strong> تأكد من أن خادم Railway يعمل في لوحة التحكم
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
