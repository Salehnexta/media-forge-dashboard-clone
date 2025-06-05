
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { railwayConnectionService } from '@/services/RailwayConnectionService';

export const WebhookListener = () => {
  useEffect(() => {
    const handleDeploymentSuccess = async (event: CustomEvent) => {
      console.log('🎉 Railway deployment successful, checking connection health');
      toast.success('تم نشر الخادم بنجاح - جاري فحص الاتصال');
      
      // Wait a moment for the service to be ready
      setTimeout(async () => {
        await railwayConnectionService.forceReconnect();
      }, 3000);
    };

    const handleDeploymentFailed = (event: CustomEvent) => {
      console.log('❌ Railway deployment failed');
      toast.error('فشل في نشر الخادم - قد يتأثر الاتصال');
    };

    const handleServiceCrashed = (event: CustomEvent) => {
      console.log('💥 Railway service crashed');
      toast.error('تعطل الخادم - جاري المحاولة للاتصال مرة أخرى');
      
      // Try to reconnect after a delay
      setTimeout(async () => {
        await railwayConnectionService.checkRailwayHealth();
      }, 5000);
    };

    // Listen for Railway webhook events
    window.addEventListener('railwayDeploymentSuccess', handleDeploymentSuccess as EventListener);
    window.addEventListener('railwayDeploymentFailed', handleDeploymentFailed as EventListener);
    window.addEventListener('railwayServiceCrashed', handleServiceCrashed as EventListener);

    return () => {
      window.removeEventListener('railwayDeploymentSuccess', handleDeploymentSuccess as EventListener);
      window.removeEventListener('railwayDeploymentFailed', handleDeploymentFailed as EventListener);
      window.removeEventListener('railwayServiceCrashed', handleServiceCrashed as EventListener);
    };
  }, []);

  return null; // This is a listener component, no UI needed
};
