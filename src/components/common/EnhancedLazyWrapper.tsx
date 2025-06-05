
import React, { Suspense, memo } from 'react';
import { Loader2 } from 'lucide-react';
import { useComponentPerformance } from '@/hooks/useEnhancedPerformance';

interface EnhancedLazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
  delay?: number;
}

const DefaultSkeleton = memo(() => (
  <div className="animate-pulse p-6 space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded"></div>
      ))}
    </div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
));

const LoadingFallback = memo(({ componentName }: { componentName?: string }) => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin text-blue-600 ml-2" />
    <span className="text-gray-600">
      جاري تحميل {componentName || 'المكون'}...
    </span>
  </div>
));

const EnhancedLazyWrapperInner = ({
  children,
  fallback,
  componentName = 'Component',
  delay = 0
}: EnhancedLazyWrapperProps) => {
  useComponentPerformance(`LazyWrapper-${componentName}`);

  const [showContent, setShowContent] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShowContent(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!showContent) {
    return fallback || <LoadingFallback componentName={componentName} />;
  }

  return (
    <Suspense fallback={fallback || <DefaultSkeleton />}>
      {children}
    </Suspense>
  );
};

export const EnhancedLazyWrapper = memo(EnhancedLazyWrapperInner);
EnhancedLazyWrapper.displayName = 'EnhancedLazyWrapper';
