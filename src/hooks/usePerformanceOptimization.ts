
import { useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export const usePerformanceOptimization = () => {
  const location = useLocation();

  // Measure page load time
  const measurePageLoad = useCallback(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      console.log(`Page ${location.pathname} loaded in ${loadTime}ms`);
      
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
    if (typeof window !== 'undefined' && window.gc) {
      window.gc();
    }
  }, []);

  // Performance monitoring
  useEffect(() => {
    const metrics = measurePageLoad();
    
    // Report to analytics service if needed
    if (metrics && metrics.loadTime > 3000) {
      console.warn(`Slow page load detected: ${metrics.loadTime}ms for ${location.pathname}`);
    }

    return optimizeImages();
  }, [location.pathname, measurePageLoad, optimizeImages]);

  // Memoized optimization utilities
  const optimizationUtils = useMemo(() => ({
    preloadResource,
    cleanupMemory,
    measurePageLoad
  }), [preloadResource, cleanupMemory, measurePageLoad]);

  return optimizationUtils;
};

// Hook for component-level performance monitoring
export const useComponentPerformance = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) { // Log if render takes more than 100ms
        console.warn(`${componentName} took ${renderTime}ms to render`);
      }
    };
  }, [componentName]);
};
