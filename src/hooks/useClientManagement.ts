
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ClientData {
  id: string;
  user_id: string;
  name: string;
  active: boolean;
  api_key: string;
  quota_limit: number;
  quota_used: number;
  created_at: string;
  updated_at: string;
}

export const useClientManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrCreateClient = useCallback(async (userEmail?: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('المستخدم غير مصرح له');
      }

      // First try to get existing client
      const { data: existingClient, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingClient) {
        return existingClient.id;
      }

      // Create new client if doesn't exist
      const { data: newClient, error: createError } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          name: userEmail || user.email || 'عميل جديد'
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      return newClient.id;
    } catch (error: any) {
      console.error('خطأ في إدارة العميل:', error);
      setError(error.message || 'خطأ في إدارة العميل');
      toast.error(error.message || 'خطأ في إدارة العميل');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getClientById = useCallback(async (clientId: string): Promise<ClientData | null> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      return data as ClientData;
    } catch (error: any) {
      console.error('خطأ في جلب بيانات العميل:', error);
      return null;
    }
  }, []);

  const updateClientQuota = useCallback(async (clientId: string, tokensUsed: number) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ quota_used: tokensUsed })
        .eq('id', clientId);

      if (error) throw error;
    } catch (error: any) {
      console.error('خطأ في تحديث حصة العميل:', error);
    }
  }, []);

  return {
    loading,
    error,
    getOrCreateClient,
    getClientById,
    updateClientQuota
  };
};
