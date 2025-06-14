
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw, Database, Clock } from 'lucide-react';
import { useMemoryManagement } from '@/hooks/useMemoryManagement';
import { useToast } from '@/hooks/use-toast';

export const MemoryDashboard = () => {
  const { stats, cleanupStats, cleanupExpiredMemories, deleteMemoriesByAgent, fetchMemoryUsage } = useMemoryManagement();
  const { toast } = useToast();

  const handleCleanup = async () => {
    try {
      const cleanedCount = await cleanupExpiredMemories();
      toast({
        title: "تم تنظيف الذكريات",
        description: `تم حذف ${cleanedCount} ذكريات منتهية الصلاحية`
      });
    } catch (error) {
      toast({
        title: "خطأ في التنظيف",
        description: "فشل في تنظيف الذكريات المنتهية الصلاحية",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAgentMemories = async (agentType: string) => {
    try {
      await deleteMemoriesByAgent(agentType);
      toast({
        title: "تم حذف الذكريات",
        description: `تم حذف جميع ذكريات ${agentType}`
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف ذكريات الوكيل",
        variant: "destructive"
      });
    }
  };

  if (stats.totalEntries === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>جاري تحميل إحصائيات الذاكرة...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الذكريات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حجم البيانات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSizeMB.toFixed(2)} MB</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">آخر تنظيف</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {cleanupStats.lastCleanup 
                ? cleanupStats.lastCleanup.toLocaleDateString('ar')
                : 'لم يتم بعد'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إدارة الذاكرة</CardTitle>
          <CardDescription>
            إدارة وتنظيف ذكريات الوكلاء الذكيين
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleCleanup} 
              disabled={cleanupStats.isCleaningUp}
              size="sm"
            >
              {cleanupStats.isCleaningUp ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              تنظيف الذكريات المنتهية
            </Button>
            
            <Button 
              onClick={fetchMemoryUsage} 
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث الإحصائيات
            </Button>
          </div>

          {cleanupStats.lastCleanup && (
            <div className="text-sm text-muted-foreground">
              آخر تنظيف: تم حذف {cleanupStats.cleanedCount} ذكريات في {cleanupStats.lastCleanup.toLocaleString('ar')}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>توزيع الذكريات حسب الوكيل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.agentBreakdown.map((agent) => (
              <div key={agent.agent_type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Badge variant="secondary">{agent.agent_type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {agent.memory_count} ذكريات
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-medium">
                      {agent.total_size_mb.toFixed(2)} MB
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteAgentMemories(agent.agent_type)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Progress 
                  value={(agent.total_size_mb / stats.totalSizeMB) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
