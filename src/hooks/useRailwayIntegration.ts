import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { runAgent, runCrew, checkRailwayHealth } from '@/api/railway';
import { AgentType, CrewType } from '@/api/railway/agentEndpoints';
import { toast } from 'sonner';

export interface RailwayExecutionState {
  isRunning: boolean;
  progress: number;
  status: 'idle' | 'running' | 'completed' | 'error';
  result: any;
  error: string | null;
  executionId: string | null;
  estimatedTime: number | null;
  railwayConnected: boolean;
}

export interface CompanyData {
  company_name: string;
  industry: string;
  website_url?: string;
  description?: string;
  target_market?: string[];
}

export const useRailwayIntegration = () => {
  const [state, setState] = useState<RailwayExecutionState>({
    isRunning: false,
    progress: 0,
    status: 'idle',
    result: null,
    error: null,
    executionId: null,
    estimatedTime: null,
    railwayConnected: false
  });

  // Check Railway connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const health = await checkRailwayHealth();
        setState(prev => ({
          ...prev,
          railwayConnected: health.status === 'online'
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          railwayConnected: false
        }));
      }
    };

    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get estimated completion time based on agent type
  const getEstimatedTime = (agentType: AgentType | CrewType): number => {
    const estimations = {
      'M1_STRATEGIC': 15000,      // 15 seconds
      'M2_SOCIAL': 10000,         // 10 seconds
      'M3_CAMPAIGN': 20000,       // 20 seconds
      'M4_CONTENT': 12000,        // 12 seconds
      'M5_ANALYTICS': 18000,      // 18 seconds
      'MARKET_ANALYSIS': 25000,   // 25 seconds (M1 + M5)
      'CONTENT_SOCIAL': 22000,    // 22 seconds (M2 + M4)
      'CAMPAIGN_EXECUTION': 35000, // 35 seconds (M3 + M2 + M5)
      'COMPLETE_AUTOMATION': 60000 // 60 seconds (All agents)
    };
    return estimations[agentType] || 15000;
  };

  // Progress simulation based on estimated time
  const simulateProgress = (estimatedTime: number) => {
    const interval = 100; // Update every 100ms
    const steps = estimatedTime / interval;
    const increment = 100 / steps;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 95) { // Stop at 95% to wait for actual completion
        clearInterval(progressInterval);
        return;
      }
      
      setState(prev => ({
        ...prev,
        progress: Math.min(currentProgress, 95)
      }));
    }, interval);

    return progressInterval;
  };

  // Enhanced function to save agent results with proper data distribution
  const saveAgentResults = async (agentType: AgentType | CrewType, companyData: CompanyData, result: any, estimatedTime: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get company profile
      const { data: company } = await supabase
        .from('company_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Save to main agent_results table
      const { error: agentError } = await supabase
        .from('agent_results')
        .insert({
          agent_id: agentType,
          task_type: agentType.startsWith('M') ? 'agent_execution' : 'crew_execution',
          input_data: companyData as any,
          output_data: result as any,
          status: 'completed',
          execution_time_ms: estimatedTime,
          user_id: user.id,
          company_id: company?.id,
          chart_configs: result.chart_configs || {}
        });

      if (agentError) {
        console.error('Error saving to agent_results:', agentError);
        return;
      }

      // Save to specific tables based on agent type
      switch (agentType) {
        case 'M1_STRATEGIC':
          await supabase
            .from('strategic_analyses')
            .insert({
              user_id: user.id,
              company_id: company?.id,
              swot_analysis: result.swot_analysis || {},
              competitor_data: result.competitor_analysis || {},
              market_trends: result.market_trends || {},
              positioning_map: result.positioning || {},
              kpi_metrics: result.kpis || {}
            });
          break;

        case 'M2_SOCIAL':
          await supabase
            .from('social_monitoring')
            .insert({
              user_id: user.id,
              company_id: company?.id,
              sentiment_analysis: result.sentiment_analysis || {},
              engagement_metrics: result.engagement_metrics || {},
              audience_insights: result.audience_insights || {},
              platform_comparison: result.platform_comparison || {},
              follower_growth: result.follower_growth || {}
            });
          break;

        case 'M3_CAMPAIGN':
          if (result.campaigns) {
            for (const campaign of result.campaigns) {
              await supabase
                .from('marketing_campaigns')
                .insert({
                  user_id: user.id,
                  name: campaign.name || 'حملة جديدة',
                  description: campaign.description,
                  performance_data: campaign.performance || {},
                  conversion_funnel: campaign.funnel || {},
                  budget_allocation: campaign.budget || {},
                  attribution_data: campaign.attribution || {},
                  ab_testing_results: campaign.ab_testing || {}
                });
            }
          }
          break;

        case 'M4_CONTENT':
          if (result.content_items) {
            for (const content of result.content_items) {
              await supabase
                .from('content_calendar')
                .insert({
                  user_id: user.id,
                  title: content.title || 'محتوى جديد',
                  content_text: content.text,
                  content_type: content.type,
                  platform: content.platform,
                  seo_performance: content.seo || {},
                  topic_clusters: content.topics || {},
                  distribution_metrics: content.distribution || {},
                  status: 'draft'
                });
            }
          }
          break;

        case 'M5_ANALYTICS':
          await supabase
            .from('bi_reports')
            .insert({
              user_id: user.id,
              report_name: `تقرير تحليلي - ${new Date().toLocaleDateString('ar-SA')}`,
              report_type: 'comprehensive',
              report_data: result.report_data || {},
              predictive_models: result.predictive_models || {},
              customer_segments: result.customer_segments || {},
              cohort_analysis: result.cohort_analysis || {},
              roi_calculator: result.roi_calculator || {},
              insights: result.insights || {},
              recommendations: result.recommendations || {}
            });
          break;
      }
    } catch (error) {
      console.error('Error saving enhanced results:', error);
    }
  };

  const executeAgent = useCallback(async (
    agentType: AgentType,
    companyData: CompanyData,
    options?: { analysisMode?: string; language?: string }
  ) => {
    if (!state.railwayConnected) {
      toast.error('Railway backend غير متصل حالياً');
      return;
    }

    const estimatedTime = getEstimatedTime(agentType);
    
    setState(prev => ({
      ...prev,
      isRunning: true,
      status: 'running',
      progress: 0,
      error: null,
      estimatedTime
    }));

    const progressInterval = simulateProgress(estimatedTime);

    try {
      console.log(`Executing agent ${agentType} with data:`, companyData);
      
      const result = await runAgent(agentType, companyData, {
        analysisMode: options?.analysisMode || 'comprehensive',
        language: options?.language || 'ar'
      });

      clearInterval(progressInterval);

      // Save enhanced results
      await saveAgentResults(agentType, companyData, result, estimatedTime);

      setState(prev => ({
        ...prev,
        isRunning: false,
        status: 'completed',
        progress: 100,
        result,
        executionId: result.execution_id || null
      }));

      toast.success('تم تشغيل الوكيل الذكي بنجاح');
      return result;
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error(`Error executing agent ${agentType}:`, error);
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        status: 'error',
        error: error.message || 'حدث خطأ في تشغيل الوكيل الذكي'
      }));

      toast.error(error.message || 'حدث خطأ في تشغيل الوكيل الذكي');
      throw error;
    }
  }, [state.railwayConnected]);

  const executeCrew = useCallback(async (
    crewType: CrewType,
    companyData: CompanyData,
    options?: { analysisMode?: string; language?: string }
  ) => {
    if (!state.railwayConnected) {
      toast.error('Railway backend غير متصل حالياً');
      return;
    }

    const estimatedTime = getEstimatedTime(crewType);
    
    setState(prev => ({
      ...prev,
      isRunning: true,
      status: 'running',
      progress: 0,
      error: null,
      estimatedTime
    }));

    const progressInterval = simulateProgress(estimatedTime);

    try {
      console.log(`Executing crew ${crewType} with data:`, companyData);
      
      const result = await runCrew(crewType, companyData, {
        analysisMode: options?.analysisMode || 'comprehensive',
        language: options?.language || 'ar'
      });

      clearInterval(progressInterval);

      // Save enhanced results
      await saveAgentResults(crewType, companyData, result, estimatedTime);

      setState(prev => ({
        ...prev,
        isRunning: false,
        status: 'completed',
        progress: 100,
        result,
        executionId: result.execution_id || null
      }));

      toast.success('تم تشغيل فريق الوكلاء الذكي بنجاح');
      return result;
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error(`Error executing crew ${crewType}:`, error);
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        status: 'error',
        error: error.message || 'حدث خطأ في تشغيل فريق الوكلاء الذكي'
      }));

      toast.error(error.message || 'حدث خطأ في تشغيل فريق الوكلاء الذكي');
      throw error;
    }
  }, [state.railwayConnected]);

  const resetState = useCallback(() => {
    setState({
      isRunning: false,
      progress: 0,
      status: 'idle',
      result: null,
      error: null,
      executionId: null,
      estimatedTime: null,
      railwayConnected: state.railwayConnected
    });
  }, [state.railwayConnected]);

  return {
    ...state,
    executeAgent,
    executeCrew,
    resetState
  };
};
