
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AGENT_TYPES, AGENT_NAMES_AR, AgentType } from '@/api/railway/agentEndpoints';
import { useRailwayIntegration, CompanyData } from '@/hooks/useRailwayIntegration';
import { RailwayConnectionStatus } from './RailwayConnectionStatus';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Play, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

interface RailwayAgentPanelProps {
  className?: string;
}

export const RailwayAgentPanel = ({ className }: RailwayAgentPanelProps) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>(AGENT_TYPES.M1);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const { 
    isRunning, 
    progress, 
    status, 
    result, 
    error, 
    estimatedTime,
    railwayConnected,
    executeAgent, 
    resetState 
  } = useRailwayIntegration();

  // Load company data from Supabase
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: companies } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);

        if (companies && companies.length > 0) {
          const company = companies[0];
          setCompanyData({
            company_name: company.company_name,
            industry: company.industry,
            website_url: company.website_url,
            description: company.company_description,
            target_market: company.target_markets || []
          });
        }
      } catch (error) {
        console.error('Error loading company data:', error);
      }
    };

    loadCompanyData();
  }, []);

  const handleExecute = async () => {
    if (!companyData || !railwayConnected) return;
    
    try {
      await executeAgent(selectedAgent, companyData);
    } catch (error) {
      console.error('Agent execution failed:', error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Play className="w-4 h-4 text-gray-600" />;
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

  const formatEstimatedTime = (ms: number | null) => {
    if (!ms) return '';
    const seconds = Math.round(ms / 1000);
    return `~${seconds} ثانية`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          الوكلاء الذكيين - Railway AI
        </CardTitle>
        <RailwayConnectionStatus />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Agent Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">اختر الوكيل الذكي:</label>
          <Select value={selectedAgent} onValueChange={(value) => setSelectedAgent(value as AgentType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AGENT_TYPES).map((agentType) => (
                <SelectItem key={agentType} value={agentType}>
                  {AGENT_NAMES_AR[agentType]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status and Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
            </div>
            
            {estimatedTime && isRunning && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                {formatEstimatedTime(estimatedTime)}
              </div>
            )}
          </div>

          {isRunning && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-600 text-center">
                جاري معالجة البيانات... {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {result && status === 'completed' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600 mb-2">
              تم إنجاز التحليل بنجاح
            </p>
            <details className="text-xs">
              <summary className="cursor-pointer text-green-700 hover:text-green-800">
                عرض النتائج
              </summary>
              <pre className="mt-2 p-2 bg-white rounded border overflow-auto max-h-32 text-left" dir="ltr">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleExecute}
            disabled={isRunning || !companyData || !railwayConnected}
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

        {/* Company Data Status */}
        {!companyData && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              يرجى إكمال ملف الشركة أولاً من خلال نظام التأهيل
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
