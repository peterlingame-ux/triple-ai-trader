import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });

  const startTimeRef = useRef<number>();

  const startMeasure = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const endMeasure = useCallback(() => {
    if (startTimeRef.current) {
      const renderTime = performance.now() - startTimeRef.current;
      const metrics = metricsRef.current;
      
      metrics.renderCount++;
      metrics.lastRenderTime = renderTime;
      metrics.averageRenderTime = 
        (metrics.averageRenderTime * (metrics.renderCount - 1) + renderTime) / metrics.renderCount;

      // Log performance warnings in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms (>16ms)`);
      }
    }
  }, [componentName]);

  useEffect(() => {
    startMeasure();
    return endMeasure;
  });

  return {
    metrics: metricsRef.current,
    startMeasure,
    endMeasure,
  };
};

// Hook for measuring component mount/unmount times
export const useMountTime = (componentName: string) => {
  const mountTimeRef = useRef<number>();

  useEffect(() => {
    mountTimeRef.current = performance.now();
    
    return () => {
      if (mountTimeRef.current) {
        const mountDuration = performance.now() - mountTimeRef.current;
        if (process.env.NODE_ENV === 'development') {
          console.log(`${componentName} was mounted for ${mountDuration.toFixed(2)}ms`);
        }
      }
    };
  }, [componentName]);
};

// Hook for detecting performance bottlenecks
export const useRenderOptimization = () => {
  const renderCountRef = useRef(0);
  const lastOptimizationCheck = useRef(Date.now());

  useEffect(() => {
    renderCountRef.current++;
    
    // Check every 100 renders
    if (renderCountRef.current % 100 === 0) {
      const now = Date.now();
      const timeSinceLastCheck = now - lastOptimizationCheck.current;
      const rendersPerSecond = 100 / (timeSinceLastCheck / 1000);
      
      if (process.env.NODE_ENV === 'development' && rendersPerSecond > 60) {
        console.warn(`High render frequency detected: ${rendersPerSecond.toFixed(1)} renders/sec`);
      }
      
      lastOptimizationCheck.current = now;
    }
  });

  return renderCountRef.current;
};