
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploadState {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export const useFileUpload = () => {
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    uploadProgress: 0,
    error: null
  });

  const uploadFile = async (file: File, documentType: string = 'general') => {
    setState(prev => ({ ...prev, isUploading: true, error: null, uploadProgress: 0 }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('المستخدم غير مصرح له');
      }

      // Get client_id
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) {
        throw new Error('لم يتم العثور على بيانات العميل');
      }

      // Store document metadata in content_sources_data
      const { data, error } = await supabase
        .from('content_sources_data')
        .insert({
          client_id: client.id,
          source_type: 'document_upload',
          data: {
            document_name: file.name,
            document_type: documentType,
            file_size: file.size,
            mime_type: file.type,
            upload_date: new Date().toISOString(),
            status: 'uploaded'
          }
        })
        .select()
        .single();

      if (error) throw error;

      setState(prev => ({ ...prev, uploadProgress: 100 }));
      toast.success('تم رفع الملف بنجاح');
      
      return { success: true, data };
    } catch (error: any) {
      console.error('خطأ في رفع الملف:', error);
      setState(prev => ({ ...prev, error: error.message }));
      toast.error(error.message || 'فشل في رفع الملف');
      return { success: false, error: error.message };
    } finally {
      setState(prev => ({ ...prev, isUploading: false }));
    }
  };

  const getUploadedFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) return [];

      const { data, error } = await supabase
        .from('content_sources_data')
        .select('*')
        .eq('client_id', client.id)
        .eq('source_type', 'document_upload')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('خطأ في جلب الملفات:', error);
      return [];
    }
  };

  return {
    ...state,
    uploadFile,
    getUploadedFiles
  };
};
