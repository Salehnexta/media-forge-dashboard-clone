
import { useCallback } from 'react';
import { AGENT_ENDPOINTS, CREW_ENDPOINTS, AgentType, CrewType } from '@/api/railway/agentEndpoints';
import { enhancedRailwayClient } from '@/api/railway/enhancedClient';
import { useOptimisticMutation } from '../useOptimisticMutation';
import { toast } from 'sonner';
import { getEstimatedTime, simulateProgress } from './railwayProgressService';
import { saveAgentResults } from './railwayDataService';
import { CompanyData } from '../useRailwayIntegration';

export const useRailwayExecution = (
  railwayConnected: boolean,
  setState: (updater: (prev: any) => any) => void
) => {
  // Optimistic mutation for better UX
  const agentMutation = useOptimisticMutation({
    mutationFn: async ({ agentType, companyData, options }: {
      agentType: AgentType,
      companyData: CompanyData,
      options?: { analysisMode?: string; language?: string }
    }) => {
      const endpoint = AGENT_ENDPOINTS[agentType];
      if (!endpoint) {
        throw new Error(`Unknown agent type: ${agentType}`);
      }

      const payload = {
        company_info: companyData,
        analysis_mode: options?.analysisMode || 'comprehensive',
        language: options?.language || 'ar'
      };

      return enhancedRailwayClient.post(endpoint, payload);
    },
    queryKey: ['agentResults'],
    optimisticUpdate: (oldData, variables) => ({
      ...oldData,
      isLoading: true,
      agentType: variables.agentType
    }),
    successMessage: 'تم تشغيل الوكيل الذكي بنجاح',
    errorMessage: 'حدث خطأ في تشغيل الوكيل الذكي'
  });

  const executeAgent = useCallback(async (
    agentType: AgentType,
    companyData: CompanyData,
    options?: { analysisMode?: string; language?: string }
  ) => {
    if (!railwayConnected) {
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

    const clearProgress = simulateProgress(estimatedTime, (progress) => {
      setState(prev => ({ ...prev, progress }));
    });

    try {
      const result = await agentMutation.mutateAsync({
        agentType,
        companyData,
        options
      });

      clearProgress();
      await saveAgentResults(agentType, companyData, result, estimatedTime);

      setState(prev => ({
        ...prev,
        isRunning: false,
        status: 'completed',
        progress: 100,
        result,
        executionId: result.execution_id || null
      }));

      return result;
    } catch (error: any) {
      clearProgress();
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        status: 'error',
        error: error.message || 'حدث خطأ في تشغيل الوكيل الذكي'
      }));

      throw error;
    }
  }, [railwayConnected, agentMutation, setState]);

  const executeCrew = useCallback(async (
    crewType: CrewType,
    companyData: CompanyData,
    options?: { analysisMode?: string; language?: string }
  ) => {
    if (!railwayConnected) {
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

    const clearProgress = simulateProgress(estimatedTime, (progress) => {
      setState(prev => ({ ...prev, progress }));
    });

    try {
      const endpoint = CREW_ENDPOINTS[crewType];
      if (!endpoint) {
        throw new Error(`Unknown crew type: ${crewType}`);
      }

      const payload = {
        company_info: companyData,
        analysis_mode: options?.analysisMode || 'comprehensive',
        language: options?.language || 'ar'
      };

      const result = await enhancedRailwayClient.post(endpoint, payload);

      clearProgress();
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
      clearProgress();
      
      setState(prev => ({
        ...prev,
        isRunning: false,
        status: 'error',
        error: error.message || 'حدث خطأ في تشغيل فريق الوكلاء الذكي'
      }));

      toast.error(error.message || 'حدث خطأ في تشغيل فريق الوكلاء الذكي');
      throw error;
    }
  }, [railwayConnected, setState]);

  return {
    executeAgent,
    executeCrew
  };
};
