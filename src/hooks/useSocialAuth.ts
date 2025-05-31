
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      // محاكاة OAuth flow - سيتم استبداله بـ OAuth حقيقي
      const mockAuthData = {
        platform: platform.id,
        accountId: `${platform.id}_account_123`,
        accessToken: `mock_access_token_${platform.id}`,
        refreshToken: `mock_refresh_token_${platform.id}`,
        permissions: platform.permissions
      };

      // حفظ في قاعدة البيانات
      const { error } = await supabase
        .from('social_accounts')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          platform: platform.id,
          account_id: mockAuthData.accountId,
          access_token: mockAuthData.accessToken,
          refresh_token: mockAuthData.refreshToken,
          permissions: platform.permissions
        });

      if (error) throw error;

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
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('platform', platformId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

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
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      const accounts = data.map(account => {
        // Safely handle permissions conversion from Json to string[]
        let permissions: string[] = [];
        if (Array.isArray(account.permissions)) {
          permissions = account.permissions.filter((p): p is string => typeof p === 'string');
        } else if (typeof account.permissions === 'string') {
          try {
            const parsed = JSON.parse(account.permissions);
            if (Array.isArray(parsed)) {
              permissions = parsed.filter((p): p is string => typeof p === 'string');
            }
          } catch {
            // If parsing fails, treat as empty array
            permissions = [];
          }
        }

        return {
          platform: account.platform,
          accountId: account.account_id || '',
          accessToken: account.access_token || '',
          refreshToken: account.refresh_token || '',
          permissions
        };
      });

      setConnectedAccounts(accounts);
      return accounts;
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
