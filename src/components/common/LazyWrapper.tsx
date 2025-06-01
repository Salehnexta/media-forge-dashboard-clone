
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper = ({ children, fallback }: LazyWrapperProps) => {
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      <span className="mr-2 text-gray-600">جاري التحميل...</span>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};
