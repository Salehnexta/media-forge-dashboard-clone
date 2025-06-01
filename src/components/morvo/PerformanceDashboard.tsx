
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemoryDashboard } from '@/components/admin/MemoryDashboard';
import { EnhancedRailwayStatus } from '@/components/railway/EnhancedRailwayStatus';
import { Activity, Database, Shield } from 'lucide-react';

export const PerformanceDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">لوحة الأداء والأمان</h2>
        <p className="text-muted-foreground">
          مراقبة أداء النظام وإدارة الأمان والذاكرة
        </p>
      </div>

      <Tabs defaultValue="memory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="memory" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Database className="h-4 w-4" />
            <span>إدارة الذاكرة</span>
          </TabsTrigger>
          <TabsTrigger value="railway" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Shield className="h-4 w-4" />
            <span>أمان Railway</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Activity className="h-4 w-4" />
            <span>مراقبة الأداء</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memory">
          <MemoryDashboard />
        </TabsContent>

        <TabsContent value="railway">
          <EnhancedRailwayStatus />
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>مراقبة الأداء</CardTitle>
              <CardDescription>
                إحصائيات الأداء وسرعة الاستجابة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                سيتم إضافة مقاييس الأداء في التحديث القادم
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
