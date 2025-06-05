
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

// Simplified HOC with any types to avoid TypeScript constraint issues
export const withLazyLoading = (
  WrappedComponent: React.ComponentType<any>,
  tabName: string,
  fallback?: React.ReactNode
) => {
  const LazyComponent = React.lazy(() => 
    new Promise<{ default: React.ComponentType<any> }>((resolve) => {
      setTimeout(() => {
        resolve({ default: WrappedComponent });
      }, 100);
    })
  );
  
  const WithLazyLoadingComponent = memo((props: any) => (
    <LazyDashboardTab tabName={tabName} fallback={fallback}>
      <LazyComponent {...props} />
    </LazyDashboardTab>
  ));
  
  WithLazyLoadingComponent.displayName = `withLazyLoading(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;
  
  return WithLazyLoadingComponent;
};

// Alternative factory function with simplified types
export const createLazyTab = (
  component: React.ComponentType<any>,
  options: {
    tabName: string;
    fallback?: React.ReactNode;
    delay?: number;
  }
) => {
  const { tabName, fallback, delay = 100 } = options;
  
  const LazyComponent = React.lazy(() => 
    new Promise<{ default: React.ComponentType<any> }>((resolve) => {
      setTimeout(() => {
        resolve({ default: component });
      }, delay);
    })
  );
  
  const CreatedLazyTab = memo((props: any) => (
    <LazyDashboardTab tabName={tabName} fallback={fallback}>
      <LazyComponent {...props} />
    </LazyDashboardTab>
  ));
  
  CreatedLazyTab.displayName = `LazyTab(${
    component.displayName || component.name || 'Component'
  })`;
  
  return CreatedLazyTab;
};

// Usage hook for managing lazy tab loading state
export const useLazyTabLoader = () => {
  const [loadedTabs, setLoadedTabs] = React.useState<Set<string>>(new Set());
  
  const loadTab = React.useCallback((tabName: string) => {
    setLoadedTabs(prev => new Set([...prev, tabName]));
  }, []);
  
  const isTabLoaded = React.useCallback((tabName: string) => {
    return loadedTabs.has(tabName);
  }, [loadedTabs]);
  
  return { loadTab, isTabLoaded, loadedTabs: Array.from(loadedTabs) };
};

export default LazyDashboardTab;
