
import { useRailwayState } from './railway/useRailwayState';
import { useRailwayExecution } from './railway/railwayExecutionService';

export interface CompanyData {
  company_name: string;
  industry: string;
  website_url?: string;
  description?: string;
  target_market?: string[];
}

export const useRailwayIntegration = () => {
  const { state, setState, resetState } = useRailwayState();
  const { executeAgent, executeCrew } = useRailwayExecution(
    state.railwayConnected,
    setState
  );

  return {
    ...state,
    executeAgent,
    executeCrew,
    resetState
  };
};
