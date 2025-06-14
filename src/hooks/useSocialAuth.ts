
import { useState } from 'react';
import { toast } from 'sonner';

interface SocialPlatform {
  id: string;
  name: string;
  permissions: string[];
}

interface ConnectedAccount {
  platform: string;
  accountId: string;
  accessToken: string;
  refreshToken?: string;
  permissions: string[];
}

export const useSocialAuth = () => {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);

  const connectPlatform = async (platform: SocialPlatform) => {
    setConnecting(platform.id);
    
    try {
      // Mock OAuth flow since social_accounts table doesn't exist
      const mockAuthData = {
        platform: platform.id,
        accountId: `${platform.id}_account_123`,
        accessToken: `mock_access_token_${platform.id}`,
        refreshToken: `mock_refresh_token_${platform.id}`,
        permissions: platform.permissions
      };

      // Store in local state instead of database
      setConnectedAccounts(prev => [...prev, mockAuthData]);
      toast.success(`تم ربط ${platform.name} بنجاح!`);
      
      return mockAuthData;
    } catch (error: any) {
      console.error(`Error connecting ${platform.name}:`, error);
      toast.error(`فشل في ربط ${platform.name}`);
      throw error;
    } finally {
      setConnecting(null);
    }
  };

  const disconnectPlatform = async (platformId: string) => {
    try {
      setConnectedAccounts(prev => 
        prev.filter(account => account.platform !== platformId)
      );
      
      toast.success('تم قطع الاتصال بنجاح');
    } catch (error: any) {
      console.error(`Error disconnecting ${platformId}:`, error);
      toast.error('فشل في قطع الاتصال');
    }
  };

  const getConnectedPlatforms = async () => {
    try {
      // Return current connected accounts from state
      return connectedAccounts;
    } catch (error: any) {
      console.error('Error fetching connected platforms:', error);
      return [];
    }
  };

  return {
    connecting,
    connectedAccounts,
    connectPlatform,
    disconnectPlatform,
    getConnectedPlatforms
  };
};
