
import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

// Safe performance monitoring hook with fallback
export const useComponentPerformance = (componentName: string) => {
  // Add safety check for React context
  let startTime: React.MutableRefObject<number | undefined> | null = null;
  let mounted: React.MutableRefObject<boolean> | null = null;

  try {
    startTime = useRef<number>();
    mounted = useRef<boolean>(true);
  } catch (error) {
    console.warn('React hooks not available, skipping performance monitoring');
    return { measureOperation: (name: string, op: () => void) => op() };
  }

  useEffect(() => {
    // Only run if we have a valid React context
    if (typeof window === 'undefined' || !startTime) return;
    
    if (!startTime.current) {
      startTime.current = Date.now();
    }
    
    const renderTime = Date.now() - startTime.current;
    
    if (renderTime > 100) {
      console.warn(`⚠️ Slow render detected in ${componentName}: ${renderTime}ms`);
    }

    return () => {
      if (mounted) {
        mounted.current = false;
      }
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

// Safe dashboard optimization hook
export const useDashboardOptimization = (dashboardName: string) => {
  let measureOperation: (name: string, operation: () => void) => void;

  try {
    const result = useComponentPerformance(dashboardName);
    measureOperation = result.measureOperation;
  } catch (error) {
    console.warn('Performance monitoring unavailable, using fallback');
    measureOperation = (name: string, operation: () => void) => operation();
  }

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

  try {
    useEffect(() => {
      optimizeChartRendering();
      return cleanup;
    }, [optimizeChartRendering, cleanup]);
  } catch (error) {
    console.warn('Effect hook unavailable, running optimization immediately');
    optimizeChartRendering();
  }

  return { optimizeChartRendering, cleanup };
};
