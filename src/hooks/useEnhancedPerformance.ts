
import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

// Enhanced performance monitoring hook
export const useComponentPerformance = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const mounted = useRef<boolean>(true);

  useEffect(() => {
    const renderTime = Date.now() - startTime.current;
    
    if (renderTime > 100) {
      console.warn(`⚠️ Slow render detected in ${componentName}: ${renderTime}ms`);
    }

    return () => {
      mounted.current = false;
    };
  }, [componentName]);

  const measureOperation = useCallback((operationName: string, operation: () => void) => {
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
