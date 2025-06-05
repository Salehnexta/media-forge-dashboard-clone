import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  componentName: string;
}

const performanceStore = new Map<string, PerformanceMetrics[]>();

export const useComponentPerformance = (componentName: string) => {
  const startTime = useRef<number>(performance.now());
  
  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    // Store performance data
    const metrics: PerformanceMetrics = {
      loadTime: 0,
      renderTime,
      componentName,
      memoryUsage: (performance as any).memory?.usedJSHeapSize
    };
    
    const existing = performanceStore.get(componentName) || [];
    existing.push(metrics);
    
    // Keep only last 10 measurements
    if (existing.length > 10) {
      existing.shift();
    }
    
    performanceStore.set(componentName, existing);
    
    // Warn if render time is too high
    if (renderTime > 100) {
      console.warn(`⚠️ ${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }
  }, [componentName]);
};

export const usePerformanceOptimization = () => {
  const location = useLocation();
  
  // Measure page load time
  const measurePageLoad = useCallback(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      console.log(`📊 Page ${location.pathname} loaded in ${loadTime.toFixed(2)}ms`);
      
      return {
        loadTime,
        renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        memoryUsage: (performance as any).memory?.usedJSHeapSize
      };
    }
    return null;
  }, [location.pathname]);

  // Preload critical resources
  const preloadResource = useCallback((href: string, as: string = 'script') => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    }
  }, []);

  // Optimize images with lazy loading
  const optimizeImages = useCallback(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach((img) => imageObserver.observe(img));

      return () => {
        lazyImages.forEach((img) => imageObserver.unobserve(img));
      };
    }
  }, []);

  // Memory cleanup
  const cleanupMemory = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
    }
  }, []);

  // Get performance report
  const getPerformanceReport = useCallback(() => {
    const report: Record<string, any> = {};
    
    performanceStore.forEach((metrics, componentName) => {
      const avgRenderTime = metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length;
      const maxRenderTime = Math.max(...metrics.map(m => m.renderTime));
      
      report[componentName] = {
        averageRenderTime: avgRenderTime.toFixed(2),
        maxRenderTime: maxRenderTime.toFixed(2),
        measurements: metrics.length,
        needsOptimization: avgRenderTime > 50
      };
    });
    
    return report;
  }, []);

  // Performance monitoring
  useEffect(() => {
    const metrics = measurePageLoad();
    
    // Report slow page loads
    if (metrics && metrics.loadTime > 3000) {
      console.warn(`🐌 Slow page load detected: ${metrics.loadTime.toFixed(2)}ms for ${location.pathname}`);
    }

    return optimizeImages();
  }, [location.pathname, measurePageLoad, optimizeImages]);

  // Memoized optimization utilities
  const optimizationUtils = useMemo(() => ({
    preloadResource,
    cleanupMemory,
    measurePageLoad,
    getPerformanceReport
  }), [preloadResource, cleanupMemory, measurePageLoad, getPerformanceReport]);

  return optimizationUtils;
};

// Clear performance data
export const clearPerformanceData = () => {
  performanceStore.clear();
};

// Get performance data for debugging
export const getPerformanceData = () => {
  return Object.fromEntries(performanceStore.entries());
};
