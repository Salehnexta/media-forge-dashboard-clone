
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

export const RailwayAgentPanel = ({
  className
}: RailwayAgentPanelProps) => {
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
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) return;
        const {
          data: companies
        } = await supabase.from('companies').select('*').eq('user_id', user.id).limit(1);
        if (companies && companies.length > 0) {
          const company = companies[0];
          setCompanyData({
            company_name: company.name,
            industry: company.industry,
            website_url: company.website,
            description: company.description,
            target_market: company.primary_markets || []
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

  return <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          الوكلاء الذكيين - Railway AI
        </CardTitle>
        <RailwayConnectionStatus />
      </CardHeader>
      
      
    </Card>;
};
