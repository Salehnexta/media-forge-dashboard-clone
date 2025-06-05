
import React, { Suspense, memo } from 'react';
import { SkeletonChart, SkeletonCard } from '@/components/ui/enhanced-skeleton';
import { useComponentPerformance } from '@/hooks/useEnhancedPerformance';

interface LazyDashboardTabProps {
  children: React.ReactNode;
  tabName: string;
  fallback?: React.ReactNode;
}

const DefaultFallback = () => (
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonChart />
      <SkeletonChart />
    </div>
  </div>
);

const LazyDashboardTabInner: React.FC<LazyDashboardTabProps> = ({ 
  children, 
  tabName, 
  fallback = <DefaultFallback /> 
}) => {
  useComponentPerformance(`LazyDashboardTab-${tabName}`);
  
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export const LazyDashboardTab = memo(LazyDashboardTabInner);
LazyDashboardTab.displayName = 'LazyDashboardTab';

// Simplified HOC for creating lazy dashboard tabs
export const withLazyLoading = <P extends {}>(
  WrappedComponent: React.ComponentType<P>,
  tabName: string
) => {
  const LazyComponent = React.lazy(() => 
    Promise.resolve({ default: WrappedComponent })
  );
  
  const WithLazyLoadingComponent = memo((props: P) => (
    <LazyDashboardTab tabName={tabName}>
      <LazyComponent {...props} />
    </LazyDashboardTab>
  ));
  
  WithLazyLoadingComponent.displayName = `withLazyLoading(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithLazyLoadingComponent;
};
