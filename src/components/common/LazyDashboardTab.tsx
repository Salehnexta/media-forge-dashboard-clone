
import React, { Suspense, memo } from 'react';
import { SkeletonChart, SkeletonCard } from '@/components/ui/enhanced-skeleton';
import { useComponentPerformance } from '@/hooks/useEnhancedPerformance';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

interface LazyDashboardTabProps {
  children: React.ReactNode;
  tabName: string;
  fallback?: React.ReactNode;
}

const DefaultFallback = memo(() => (
  <div className="p-6 space-y-6 animate-fade-in">
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
));

const LazyDashboardTabInner: React.FC<LazyDashboardTabProps> = ({ 
  children, 
  tabName, 
  fallback = <DefaultFallback /> 
}) => {
  useComponentPerformance(`LazyDashboardTab-${tabName}`);
  
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export const LazyDashboardTab = memo(LazyDashboardTabInner);
LazyDashboardTab.displayName = 'LazyDashboardTab';

// Enhanced HOC with performance monitoring
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

// Enhanced factory function with performance monitoring
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

// Enhanced tab loader with performance metrics
export const useLazyTabLoader = () => {
  const [loadedTabs, setLoadedTabs] = React.useState<Set<string>>(new Set());
  const [loadTimes, setLoadTimes] = React.useState<Map<string, number>>(new Map());
  
  const loadTab = React.useCallback((tabName: string) => {
    const startTime = performance.now();
    
    setLoadedTabs(prev => new Set([...prev, tabName]));
    
    // Measure load time
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      setLoadTimes(prev => new Map([...prev, [tabName, loadTime]]));
      
      if (loadTime > 200) {
        console.warn(`⚠️ Slow tab load: ${tabName} took ${loadTime.toFixed(2)}ms`);
      }
    });
  }, []);
  
  const isTabLoaded = React.useCallback((tabName: string) => {
    return loadedTabs.has(tabName);
  }, [loadedTabs]);
  
  const getTabLoadTime = React.useCallback((tabName: string) => {
    return loadTimes.get(tabName) || 0;
  }, [loadTimes]);
  
  return { 
    loadTab, 
    isTabLoaded, 
    getTabLoadTime,
    loadedTabs: Array.from(loadedTabs),
    loadTimes: Object.fromEntries(loadTimes)
  };
};

export default LazyDashboardTab;
