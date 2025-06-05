
export interface RailwayWebhookEvent {
  type: 'DEPLOY' | 'BUILD' | 'CRASH' | 'REMOVE';
  status: 'SUCCESS' | 'FAILED' | 'BUILDING' | 'DEPLOYING' | 'CRASHED' | 'REMOVED';
  project: {
    id: string;
    name: string;
  };
  environment: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
  };
  deployment?: {
    id: string;
    url?: string;
    createdAt: string;
  };
  timestamp: string;
}

export const handleRailwayWebhook = async (event: RailwayWebhookEvent) => {
  console.log('🚂 Railway webhook received:', event);
  
  // Handle deployment success - update connection status
  if (event.type === 'DEPLOY' && event.status === 'SUCCESS') {
    console.log('✅ Railway deployment successful, updating connection status');
    
    // Trigger connection health check
    const healthCheckEvent = new CustomEvent('railwayDeploymentSuccess', {
      detail: {
        deploymentUrl: event.deployment?.url,
        timestamp: event.timestamp
      }
    });
    window.dispatchEvent(healthCheckEvent);
  }
  
  // Handle deployment failure
  if (event.type === 'DEPLOY' && event.status === 'FAILED') {
    console.log('❌ Railway deployment failed');
    
    const failureEvent = new CustomEvent('railwayDeploymentFailed', {
      detail: {
        timestamp: event.timestamp
      }
    });
    window.dispatchEvent(failureEvent);
  }
  
  // Handle service crash
  if (event.type === 'CRASH') {
    console.log('💥 Railway service crashed');
    
    const crashEvent = new CustomEvent('railwayServiceCrashed', {
      detail: {
        timestamp: event.timestamp
      }
    });
    window.dispatchEvent(crashEvent);
  }
  
  return { success: true, processed: true };
};
