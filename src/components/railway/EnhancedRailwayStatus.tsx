
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useSecureRailwayToken } from '@/hooks/useSecureRailwayToken';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { useToast } from '@/hooks/use-toast';

export const EnhancedRailwayStatus = () => {
  const { token, isLoading, error, lastRefresh, refreshToken } = useSecureRailwayToken();
  const { isOnline, latency } = useConnectionStatus();
  const { toast } = useToast();

  const handleRefreshToken = async () => {
    try {
      await refreshToken();
      toast({
        title: "تم تحديث الرمز المميز",
        description: "تم تحديث رمز Railway بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "فشل في تحديث رمز Railway",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = () => {
    if (error) return 'destructive';
    if (!token) return 'secondary';
    if (!isOnline) return 'outline';
    return 'default';
  };

  const getStatusIcon = () => {
    if (error) return <AlertTriangle className="h-4 w-4" />;
    if (!token) return <Clock className="h-4 w-4" />;
    if (!isOnline) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (error) return 'خطأ في الاتصال';
    if (!token) return 'غير متصل';
    if (!isOnline) return 'لا يوجد اتصال بالإنترنت';
    return 'متصل';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
          <Shield className="h-5 w-5" />
          <span>حالة Railway المحسنة</span>
        </CardTitle>
        <CardDescription>
          مراقبة أمان اتصال Railway وإدارة الرموز المميزة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {getStatusIcon()}
            <span className="font-medium">حالة الاتصال:</span>
            <Badge variant={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshToken}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            تحديث الرمز
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">خطأ:</span>
            </div>
            <p className="text-sm text-destructive mt-1">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">زمن الاستجابة:</span>
            <p className="font-medium">
              {latency ? `${latency}ms` : 'غير متوفر'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">آخر تحديث:</span>
            <p className="font-medium">
              {lastRefresh ? lastRefresh.toLocaleTimeString('ar') : 'لم يتم بعد'}
            </p>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>الرمز المميز محمي بتشفير Supabase Vault</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
