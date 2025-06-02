
import React, { Component, ReactNode } from 'react';
import { toast } from "sonner";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string;
}

export class SecureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorId: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate a unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log error securely (without sensitive data)
    console.error(`[${errorId}] Application error occurred`, {
      message: error.message,
      stack: error.stack?.split('\n')[0], // Only first line of stack
      timestamp: new Date().toISOString()
    });

    return { hasError: true, errorId };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report to monitoring service (if available)
    this.reportError(error, errorInfo);
    
    // Show user-friendly message
    toast.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
  }

  private reportError(error: Error, errorInfo: React.ErrorInfo) {
    // In production, this would send to a monitoring service
    // For now, we'll just log sanitized error info
    const sanitizedError = {
      errorId: this.state.errorId,
      message: error.message,
      componentStack: errorInfo.componentStack?.split('\n')[0],
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Error reported:', sanitizedError);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              حدث خطأ غير متوقع
            </h2>
            <p className="text-gray-600 mb-6">
              نعتذر عن هذا الإزعاج. يرجى تحديث الصفحة والمحاولة مرة أخرى.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تحديث الصفحة
            </button>
            <p className="text-xs text-gray-400 mt-4">
              معرف الخطأ: {this.state.errorId}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
