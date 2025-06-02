
import { toast } from "sonner";

interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export class FileUploadSecurity {
  private static readonly DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly DEFAULT_ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  static validateFile(file: File, options: FileValidationOptions = {}): boolean {
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.DEFAULT_ALLOWED_TYPES;
    
    // Check file size
    if (file.size > maxSize) {
      toast.error(`حجم الملف كبير جداً. الحد الأقصى ${this.formatFileSize(maxSize)}`);
      return false;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('نوع الملف غير مدعوم');
      return false;
    }

    // Check file extension
    const extension = this.getFileExtension(file.name);
    const allowedExtensions = options.allowedExtensions || this.getExtensionsFromTypes(allowedTypes);
    
    if (!allowedExtensions.includes(extension)) {
      toast.error('امتداد الملف غير مدعوم');
      return false;
    }

    // Check for potentially malicious files
    if (this.isSuspiciousFile(file)) {
      toast.error('تم رفض الملف لأسباب أمنية');
      return false;
    }

    return true;
  }

  private static getFileExtension(filename: string): string {
    return filename.toLowerCase().split('.').pop() || '';
  }

  private static getExtensionsFromTypes(types: string[]): string[] {
    const typeToExtension: { [key: string]: string[] } = {
      'application/pdf': ['pdf'],
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/gif': ['gif'],
      'text/plain': ['txt'],
      'application/msword': ['doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx']
    };

    return types.flatMap(type => typeToExtension[type] || []);
  }

  private static isSuspiciousFile(file: File): boolean {
    const suspiciousExtensions = ['exe', 'bat', 'cmd', 'scr', 'vbs', 'js', 'jar', 'com', 'pif'];
    const extension = this.getFileExtension(file.name);
    
    return suspiciousExtensions.includes(extension) || 
           file.name.includes('..') || 
           file.name.length > 255;
  }

  private static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
  }

  static createSecureFormData(file: File, additionalData: Record<string, string> = {}): FormData {
    const formData = new FormData();
    
    // Sanitize filename
    const sanitizedFilename = file.name
      .replace(/[^a-zA-Z0-9\.\-_]/g, '_')
      .substring(0, 255);
    
    const secureFile = new File([file], sanitizedFilename, { type: file.type });
    formData.append('file', secureFile);

    // Add sanitized additional data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value.toString().substring(0, 1000)); // Limit field length
    });

    return formData;
  }
}
