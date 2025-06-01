
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AgentType, AGENT_NAMES_AR } from '@/api/railway/agentEndpoints';
import { useRailwayAgent, CompanyData } from '@/hooks/useRailwayAgent';
import { Loader2, Play, CheckCircle, XCircle } from 'lucide-react';

interface AgentCardProps {
  agentType: AgentType;
  companyData: CompanyData | null;
  onResultReady?: (result: any) => void;
}

export const AgentCard = ({ agentType, companyData, onResultReady }: AgentCardProps) => {
  const { isRunning, progress, status, result, error, executeAgent, resetState } = useRailwayAgent();

  const handleExecute = async () => {
    if (!companyData) {
      return;
    }

    try {
      const result = await executeAgent(agentType, companyData);
      onResultReady?.(result);
    } catch (error) {
      console.error('Agent execution failed:', error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'running':
        return 'قيد التشغيل...';
      case 'completed':
        return 'مكتمل';
      case 'error':
        return 'خطأ';
      default:
        return 'جاهز للتشغيل';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">
            {AGENT_NAMES_AR[agentType]}
          </CardTitle>
          <Badge className={`${getStatusColor()} text-white`}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRunning && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 text-center">
              جاري معالجة البيانات...
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && status === 'completed' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">
              تم إنجاز التحليل بنجاح
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleExecute}
            disabled={isRunning || !companyData}
            className="flex-1"
          >
            {getStatusIcon()}
            <span className="mr-2">
              {isRunning ? 'جاري التشغيل...' : 'تشغيل الوكيل'}
            </span>
          </Button>
          
          {(status === 'completed' || status === 'error') && (
            <Button
              onClick={resetState}
              variant="outline"
              size="sm"
            >
              إعادة تعيين
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
