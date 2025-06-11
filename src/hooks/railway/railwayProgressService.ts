
export const getEstimatedTime = (agentType: string): number => {
  const estimations: Record<string, number> = {
    'M1_STRATEGIC': 15000,
    'M2_SOCIAL': 10000,
    'M3_CAMPAIGN': 20000,
    'M4_CONTENT': 12000,
    'M5_ANALYTICS': 18000,
    'MARKET_ANALYSIS': 25000,
    'CONTENT_SOCIAL': 22000,
    'CAMPAIGN_EXECUTION': 35000,
    'COMPLETE_AUTOMATION': 60000
  };
  return estimations[agentType] || 15000;
};

export const simulateProgress = (
  estimatedTime: number,
  onProgressUpdate: (progress: number) => void
): (() => void) => {
  const interval = 200;
  const steps = estimatedTime / interval;
  const increment = 95 / steps;
  let currentProgress = 0;

  const progressInterval = setInterval(() => {
    currentProgress += increment;
    if (currentProgress >= 95) {
      clearInterval(progressInterval);
      return;
    }
    
    onProgressUpdate(Math.min(currentProgress, 95));
  }, interval);

  return () => clearInterval(progressInterval);
};
