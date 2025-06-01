
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Send to monitoring service (you can add your preferred service here)
    if (typeof window !== 'undefined') {
      // Example: Sentry, LogRocket, etc.
      console.error('Component Error:', { error, errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              حدث خطأ غير متوقع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              عذراً، حدث خطأ أثناء تحميل هذا المكون. يرجى المحاولة مرة أخرى.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-sm bg-gray-100 p-2 rounded">
                <summary>تفاصيل الخطأ (وضع التطوير)</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <Button onClick={this.handleRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              المحاولة مرة أخرى
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
