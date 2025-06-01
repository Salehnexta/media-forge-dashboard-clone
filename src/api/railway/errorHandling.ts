
// Error handling utilities for Railway API
export const ERROR_TYPES = {
  CONNECTION: 'connection_error',
  AUTHENTICATION: 'auth_error',
  TIMEOUT: 'timeout_error',
  SERVER: 'server_error',
  VALIDATION: 'validation_error',
  UNKNOWN: 'unknown_error'
} as const;

export type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];

// Define retryable error types specifically
type RetryableErrorType = typeof ERROR_TYPES.CONNECTION | typeof ERROR_TYPES.TIMEOUT | typeof ERROR_TYPES.SERVER;

export interface ProcessedError {
  type: ErrorType;
  message: string;
  original: any;
}

export const handleApiError = (error: any): ProcessedError => {
  if (!error.response) {
    // Network error or server not responding
    return {
      type: ERROR_TYPES.CONNECTION,
      message: 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك.',
      original: error
    };
  }

  const status = error.response.status;
  
  if (status === 401 || status === 403) {
    return {
      type: ERROR_TYPES.AUTHENTICATION,
      message: 'خطأ في المصادقة. يرجى تسجيل الدخول مرة أخرى.',
      original: error
    };
  }
  
  if (status === 408 || error.code === 'ECONNABORTED') {
    return {
      type: ERROR_TYPES.TIMEOUT,
      message: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
      original: error
    };
  }
  
  if (status >= 500) {
    return {
      type: ERROR_TYPES.SERVER,
      message: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقًا.',
      original: error
    };
  }
  
  if (status === 422 || status === 400) {
    return {
      type: ERROR_TYPES.VALIDATION,
      message: 'بيانات غير صالحة. يرجى التحقق من المدخلات.',
      original: error
    };
  }
  
  return {
    type: ERROR_TYPES.UNKNOWN,
    message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    original: error
  };
};

export const isRetryableError = (errorType: ErrorType): errorType is RetryableErrorType => {
  const retryableTypes: RetryableErrorType[] = [ERROR_TYPES.CONNECTION, ERROR_TYPES.TIMEOUT, ERROR_TYPES.SERVER];
  return retryableTypes.includes(errorType as RetryableErrorType);
};
