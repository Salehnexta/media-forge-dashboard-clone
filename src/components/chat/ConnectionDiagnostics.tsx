
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';
import { chatWebSocketService } from '@/services/ChatWebSocketService';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: string;
}

export const ConnectionDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    // Test 1: Check internet connectivity
    try {
      const response = await fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors', 
        cache: 'no-cache' 
      });
      results.push({
        test: 'Internet Connectivity',
        status: 'success',
        message: 'Internet connection is working',
        details: 'Successfully reached external servers'
      });
    } catch (error) {
      results.push({
        test: 'Internet Connectivity',
        status: 'error',
        message: 'No internet connection detected',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: Check Railway server HTTP endpoint
    try {
      const response = await fetch('https://morvo-ai-v2.up.railway.app/', {
        method: 'GET',
        mode: 'cors'
      });
      
      if (response.ok) {
        results.push({
          test: 'Railway HTTP Server',
          status: 'success',
          message: 'Railway server is responding',
          details: `Status: ${response.status} ${response.statusText}`
        });
      } else {
        results.push({
          test: 'Railway HTTP Server',
          status: 'warning',
          message: 'Railway server responded with error',
          details: `Status: ${response.status} ${response.statusText}`
        });
      }
    } catch (error) {
      results.push({
        test: 'Railway HTTP Server',
        status: 'error',
        message: 'Cannot reach Railway server',
        details: error instanceof Error ? error.message : 'Network error'
      });
    }

    // Test 3: Check WebSocket support
    if (typeof WebSocket !== 'undefined') {
      results.push({
        test: 'WebSocket Support',
        status: 'success',
        message: 'WebSocket is supported in this browser',
        details: 'Native WebSocket API available'
      });
    } else {
      results.push({
        test: 'WebSocket Support',
        status: 'error',
        message: 'WebSocket not supported',
        details: 'Browser does not support WebSocket API'
      });
    }

    // Test 4: Check current WebSocket connection
    const wsState = chatWebSocketService.getConnectionState();
    const isConnected = chatWebSocketService.isConnected();
    
    results.push({
      test: 'Current WebSocket State',
      status: isConnected ? 'success' : 'error',
      message: `WebSocket state: ${wsState}`,
      details: isConnected ? 'Active connection to Railway' : 'No active connection'
    });

    // Test 5: Check localStorage for auth data
    const userId = localStorage.getItem('morvo_user_id');
    const token = localStorage.getItem('morvo_auth_token');
    
    results.push({
      test: 'Authentication Data',
      status: userId ? 'success' : 'warning',
      message: userId ? 'User ID found' : 'No user ID stored',
      details: `User: ${userId || 'None'}, Token: ${token ? 'Present' : 'None'}`
    });

    // Test 6: Try direct WebSocket connection
    try {
      const testWs = new WebSocket('wss://morvo-ai-v2.up.railway.app/ws/diagnostic-test');
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          testWs.close();
          reject(new Error('Connection timeout'));
        }, 5000);

        testWs.onopen = () => {
          clearTimeout(timeout);
          testWs.close();
          resolve(true);
        };

        testWs.onerror = (error) => {
          clearTimeout(timeout);
          reject(error);
        };
      });

      results.push({
        test: 'Direct WebSocket Test',
        status: 'success',
        message: 'Can establish WebSocket connection',
        details: 'Successfully connected to Railway WebSocket endpoint'
      });
    } catch (error) {
      results.push({
        test: 'Direct WebSocket Test',
        status: 'error',
        message: 'Failed to establish WebSocket connection',
        details: error instanceof Error ? error.message : 'Connection failed'
      });
    }

    // Test 7: Check CORS and security policies
    results.push({
      test: 'Browser Security',
      status: 'info',
      message: 'Security context check',
      details: `HTTPS: ${location.protocol === 'https:'}, Origin: ${location.origin}`
    });

    setDiagnostics(results);
    setIsRunning(false);
  };

  // Monitor connection state
  useEffect(() => {
    const checkState = () => {
      setConnectionState(chatWebSocketService.getConnectionState());
    };

    const interval = setInterval(checkState, 1000);
    checkState();

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const forceReconnect = () => {
    const userId = localStorage.getItem('morvo_user_id') || 'guest';
    const token = localStorage.getItem('morvo_auth_token');
    
    chatWebSocketService.disconnect();
    setTimeout(() => {
      chatWebSocketService.connect(userId, token, {
        onConnect: () => console.log('Manual reconnection successful'),
        onDisconnect: () => console.log('Manual reconnection failed'),
        onError: (error) => console.error('Manual reconnection error:', error)
      });
    }, 1000);
  };

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          تشخيص الاتصال المتقدم
        </CardTitle>
        <CardDescription>
          فحص شامل لحالة الاتصال وتشخيص المشاكل
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>حالة الاتصال الحالية:</span>
              <Badge className={connectionState === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {connectionState === 'connected' ? 'متصل' : 'غير متصل'}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRunning ? 'جاري الفحص...' : 'تشغيل التشخيص'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={forceReconnect}
            className="flex items-center gap-2"
          >
            <Wifi className="h-4 w-4" />
            إعادة الاتصال يدوياً
          </Button>
        </div>

        {/* Diagnostic Results */}
        {diagnostics.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">نتائج التشخيص:</h3>
            {diagnostics.map((result, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  <Badge className={getStatusColor(result.status)}>
                    {result.message}
                  </Badge>
                </div>
                {result.details && (
                  <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Configuration Info */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">معلومات التكوين:</h3>
          <div className="text-sm space-y-1 text-gray-600">
            <p><strong>WebSocket URL:</strong> wss://morvo-ai-v2.up.railway.app/ws</p>
            <p><strong>Protocol:</strong> WebSocket Secure (WSS)</p>
            <p><strong>Max Reconnect Attempts:</strong> 5</p>
            <p><strong>Reconnect Interval:</strong> 3-15 seconds (progressive)</p>
            <p><strong>Heartbeat Interval:</strong> 30 seconds</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
