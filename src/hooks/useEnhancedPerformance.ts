
import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

// Enhanced performance monitoring hook with error handling
export const useComponentPerformance = (componentName: string) => {
  const startTime = useRef<number>();
  const mounted = useRef<boolean>(true);

  useEffect(() => {
    // Only run if we have a valid React context
    if (typeof window === 'undefined') return;
    
    if (!startTime.current) {
      startTime.current = Date.now();
    }
    
    const renderTime = Date.now() - startTime.current;
    
    if (renderTime > 100) {
      console.warn(`⚠️ Slow render detected in ${componentName}: ${renderTime}ms`);
    }

    return () => {
      mounted.current = false;
    };
  }, [componentName]);

  const measureOperation = useCallback((operationName: string, operation: () => void) => {
    if (typeof performance === 'undefined') {
      operation();
      return;
    }

    const start = performance.now();
    operation();
    const end = performance.now();
    
    if (end - start > 50) {
      console.warn(`⚠️ Slow operation in ${componentName}.${operationName}: ${(end - start).toFixed(2)}ms`);
    }
  }, [componentName]);

  return { measureOperation };
};

// Enhanced dashboard optimization hook
export const useDashboardOptimization = (dashboardName: string) => {
  const { measureOperation } = useComponentPerformance(dashboardName);

  const optimizeChartRendering = useCallback(() => {
    if (typeof document === 'undefined') return;
    
    measureOperation('chartOptimization', () => {
      const charts = document.querySelectorAll('[data-chart]');
      charts.forEach((chart) => {
        if (chart.children.length > 100) {
          console.warn(`Large dataset detected in ${dashboardName} chart, consider virtualization`);
        }
      });
    });
  }, [dashboardName, measureOperation]);

  const cleanup = useCallback(() => {
    if (typeof window !== 'undefined' && window.performance) {
      console.log(`Cleaning up ${dashboardName} dashboard`);
    }
  }, [dashboardName]);

  useEffect(() => {
    optimizeChartRendering();
    return cleanup;
  }, [optimizeChartRendering, cleanup]);

  return { optimizeChartRendering, cleanup };
};
