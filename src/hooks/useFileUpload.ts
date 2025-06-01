
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'uploaded' | 'analyzing' | 'analyzed' | 'error';
  progress: number;
  analysisResults?: any;
}

export const useFileUpload = (userId: string, companyId?: string) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileId = Math.random().toString(36).substr(2, 9);
    const fileName = `${userId}/${fileId}-${file.name}`;
    
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading',
      progress: 0
    };

    setFiles(prev => [...prev, newFile]);

    try {
      // Update progress to show upload starting
      setFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: 50 }
            : f
        )
      );

      const { data, error } = await supabase.storage
        .from('company-documents')
        .upload(fileName, file);

      if (error) throw error;

      // Update progress to show upload complete
      setFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: 100 }
            : f
        )
      );

      const { error: dbError } = await supabase
        .from('company_documents')
        .insert({
          user_id: userId,
          company_id: companyId,
          document_name: file.name,
          document_type: file.type,
          file_path: data.path,
          file_size: file.size,
          mime_type: file.type,
          analysis_status: 'pending'
        });

      if (dbError) throw dbError;

      setFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'uploaded', progress: 100 }
            : f
        )
      );

      toast.success(`تم رفع ${file.name} بنجاح`);
      return data.path;

    } catch (error: any) {
      console.error('Error uploading file:', error);
      setFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error', progress: 0 }
            : f
        )
      );
      toast.error(`فشل في رفع ${file.name}: ${error.message}`);
      return null;
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return {
    files,
    uploadFile,
    removeFile,
    clearFiles,
    setFiles
  };
};
