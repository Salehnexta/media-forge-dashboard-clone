
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CREW_ENDPOINTS, CrewType } from '@/api/railway/agentEndpoints';
import { useRailwayAgent, CompanyData } from '@/hooks/useRailwayAgent';
import { Loader2, Play, CheckCircle, XCircle, Users } from 'lucide-react';

interface CrewRunnerProps {
  companyData: CompanyData | null;
  onResultReady?: (crewType: CrewType, result: any) => void;
}

const CREW_NAMES_AR = {
  MARKET_ANALYSIS: 'فريق تحليل السوق',
  CONTENT_SOCIAL: 'فريق المحتوى والسوشال ميديا',
  CAMPAIGN_EXECUTION: 'فريق تنفيذ الحملات',
  COMPLETE_AUTOMATION: 'الأتمتة الكاملة'
} as const;

const CREW_DESCRIPTIONS = {
  MARKET_ANALYSIS: 'تحليل شامل للسوق والمنافسين مع البيانات والإحصائيات',
  CONTENT_SOCIAL: 'إنشاء استراتيجية المحتوى وإدارة وسائل التواصل الاجتماعي',
  CAMPAIGN_EXECUTION: 'تخطيط وتنفيذ الحملات الإعلانية مع التحليل والمتابعة',
  COMPLETE_AUTOMATION: 'تشغيل جميع الوكلاء الخمسة معاً للحصول على تحليل شامل'
} as const;

export const CrewRunner = ({ companyData, onResultReady }: CrewRunnerProps) => {
  const { isRunning, progress, status, result, error, executeCrew, resetState } = useRailwayAgent();

  const handleExecuteCrew = async (crewType: CrewType) => {
    if (!companyData) {
      return;
    }

    try {
      const result = await executeCrew(crewType, companyData);
      onResultReady?.(crewType, result);
    } catch (error) {
      console.error('Crew execution failed:', error);
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
        return <Users className="w-4 h-4" />;
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
    <div className="space-y-4">
      {Object.entries(CREW_ENDPOINTS).map(([crewType, endpoint]) => (
        <Card key={crewType} className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">
                  {CREW_NAMES_AR[crewType as CrewType]}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {CREW_DESCRIPTIONS[crewType as CrewType]}
                </p>
              </div>
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
                  جاري تشغيل فريق العمل...
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
                  تم إنجاز التحليل بواسطة فريق العمل بنجاح
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => handleExecuteCrew(crewType as CrewType)}
                disabled={isRunning || !companyData}
                className="flex-1"
              >
                {getStatusIcon()}
                <span className="mr-2">
                  {isRunning ? 'جاري التشغيل...' : 'تشغيل فريق العمل'}
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
      ))}
    </div>
  );
};
