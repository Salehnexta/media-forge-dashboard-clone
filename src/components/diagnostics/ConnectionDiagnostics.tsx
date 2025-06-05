import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, WifiOff, Wifi, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { chatWebSocketService } from "@/services/ChatWebSocketService";
import { toast } from "sonner";

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
}

export const ConnectionDiagnostics = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [connectionState, setConnectionState] = useState(chatWebSocketService.getConnectionState());

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionState(chatWebSocketService.getConnectionState());
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([
      { name: 'فحص الاتصال', status: 'pending', message: 'جاري الفحص...' }
    ]);
    
    // Step 1: Check internet connectivity
    try {
      const internetTest = await fetch('https://www.google.com');
      if (internetTest.ok) {
        setResults(prev => [
          { name: 'اتصال الإنترنت', status: 'success', message: 'الاتصال بالإنترنت يعمل' },
          { name: 'خادم Railway', status: 'pending', message: 'جاري فحص الخادم...' }
        ]);
      } else {
        setResults(prev => [
          { name: 'اتصال الإنترنت', status: 'error', message: 'مشكلة في الاتصال بالإنترنت' }
        ]);
        setIsRunning(false);
        return;
      }
    } catch (error) {
      setResults(prev => [
        { name: 'اتصال الإنترنت', status: 'error', message: `مشكلة في الاتصال بالإنترنت: ${error.message}` }
      ]);
      setIsRunning(false);
      return;
    }
    
    // Step 2: Check Railway server
    try {
      const serverStatus = await chatWebSocketService.checkServerStatus();
      if (serverStatus.isOnline) {
        setResults(prev => [
          ...prev.slice(0, 1),
          { name: 'خادم Railway', status: 'success', message: 'الخادم يعمل بشكل طبيعي' },
          { name: 'اتصال WebSocket', status: 'pending', message: 'جاري فحص اتصال WebSocket...' }
        ]);
      } else {
        setResults(prev => [
          ...prev.slice(0, 1),
          { name: 'خادم Railway', status: 'error', message: serverStatus.message }
        ]);
        setIsRunning(false);
        return;
      }
    } catch (error) {
      setResults(prev => [
        ...prev.slice(0, 1),
        { name: 'خادم Railway', status: 'error', message: `لا يمكن الوصول للخادم: ${error.message}` }
      ]);
      setIsRunning(false);
      return;
    }
    
    // Step 3: Test WebSocket connection
    try {
      const userId = localStorage.getItem('morvo_user_id') || 'guest';
      const token = localStorage.getItem('morvo_auth_token');
      
      const wsConnected = await chatWebSocketService.connect(userId, token);
      
      if (wsConnected) {
        setResults(prev => [
          ...prev.slice(0, 2),
          { name: 'اتصال WebSocket', status: 'success', message: 'تم الاتصال بنجاح' }
        ]);
      } else {
        setResults(prev => [
          ...prev.slice(0, 2),
          { name: 'اتصال WebSocket', status: 'error', message: 'فشل الاتصال بـ WebSocket' }
        ]);
      }
    } catch (error) {
      setResults(prev => [
        ...prev.slice(0, 2),
        { name: 'اتصال WebSocket', status: 'error', message: `فشل اتصال WebSocket: ${error.message}` }
      ]);
    }
    
    setIsRunning(false);
  };

  const reconnectManually = async () => {
    toast.info('جاري إعادة الاتصال...');
    const userId = localStorage.getItem('morvo_user_id') || 'guest';
    const token = localStorage.getItem('morvo_auth_token');
    
    const connected = await chatWebSocketService.connect(userId, token);
    
    if (connected) {
      toast.success('تم إعادة الاتصال بنجاح');
    } else {
      toast.error('فشل إعادة الاتصال');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-1.5 p-4 pb-2">
        <h3 className="text-lg font-semibold leading-none tracking-tight">تشخيص الاتصال المتقدم</h3>
        <p className="text-sm text-muted-foreground">فحص شامل لحالة الاتصال وتشخيص المشاكل</p>
      </div>
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-medium">حالة الاتصال الحالية:</span>
            <div className="flex items-center mt-1">
              {connectionState === 'connected' ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500 mr-1" />
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">متصل</Badge>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500 mr-1" />
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">غير متصل</Badge>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runDiagnostics} 
              disabled={isRunning}
            >
              {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              تشغيل التشخيص
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={reconnectManually}
              disabled={isRunning || connectionState === 'connected'}
            >
              إعادة الاتصال يدوياً
            </Button>
          </div>
        </div>
        
        {results.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">نتائج التشخيص:</h4>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                  <div className="flex items-center">
                    {getStatusIcon(result.status)}
                    <span className="text-sm mr-2">{result.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{result.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionDiagnostics;
