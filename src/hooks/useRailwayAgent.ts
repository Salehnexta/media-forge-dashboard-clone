
import { useState, useCallback } from 'react';
import { runAgent, runCrew, checkAgentStatus } from '@/api/railway';
import { AgentType, CrewType } from '@/api/railway/agentEndpoints';
import { toast } from 'sonner';

export interface AgentExecutionState {
  isRunning: boolean;
  progress: number;
  status: 'idle' | 'running' | 'completed' | 'error';
  result: any;
  error: string | null;
  executionId: string | null;
}

export interface CompanyData {
  company_name: string;
  industry: string;
  website_url?: string;
  description?: string;
  target_market?: string[];
}

export const useRailwayAgent = () => {
  const [state, setState] = useState<AgentExecutionState>({
    isRunning: false,
    progress: 0,
    status: 'idle',
    result: null,
    error: null,
    executionId: null
  });

  const executeAgent = useCallback(async (
    agentType: AgentType,
    companyData: CompanyData,
    options?: { analysisMode?: string; language?: string }
  ) => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      status: 'running',
      progress: 0,
      error: null
    }));

    try {
      console.log(`Executing agent ${agentType} with data:`, companyData);
      
      const result = await runAgent(agentType, companyData, {
        analysisMode: options?.analysisMode || 'comprehensive',
        language: options?.language || 'ar'
      });

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
  }, []);

  const executeCrew = useCallback(async (
    crewType: CrewType,
    companyData: CompanyData,
    options?: { analysisMode?: string; language?: string }
  ) => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      status: 'running',
      progress: 0,
      error: null
    }));

    try {
      console.log(`Executing crew ${crewType} with data:`, companyData);
      
      const result = await runCrew(crewType, companyData, {
        analysisMode: options?.analysisMode || 'comprehensive',
        language: options?.language || 'ar'
      });

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
  }, []);

  const resetState = useCallback(() => {
    setState({
      isRunning: false,
      progress: 0,
      status: 'idle',
      result: null,
      error: null,
      executionId: null
    });
  }, []);

  return {
    ...state,
    executeAgent,
    executeCrew,
    resetState
  };
};
