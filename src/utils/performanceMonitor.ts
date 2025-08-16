import React from 'react';

// Performance monitoring utilities for the crypto trading platform

interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private isProduction = process.env.NODE_ENV === 'production';

  // Start measuring performance
  start(name: string): void {
    if (this.isProduction) return;
    
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  // End measurement and log results
  end(name: string): number | null {
    if (this.isProduction) return null;
    
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" not found`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    metric.endTime = endTime;
    metric.duration = duration;
    
    // Log slow operations (>100ms)
    if (duration > 100) {
      console.warn(`🐌 Slow operation: ${name} took ${duration.toFixed(2)}ms`);
    } else if (duration > 16) {
      console.log(`⚡ ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  // Measure React component render time
  measureComponent<T extends any[]>(
    componentName: string,
    fn: (...args: T) => any
  ) {
    return (...args: T) => {
      this.start(`render-${componentName}`);
      const result = fn(...args);
      this.end(`render-${componentName}`);
      return result;
    };
  }

  // Measure API call performance
  async measureAsync<T>(name: string, asyncFn: () => Promise<T>): Promise<T> {
    if (this.isProduction) return asyncFn();
    
    this.start(name);
    try {
      const result = await asyncFn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  // Get all metrics
  getAllMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
  }

  // Get memory usage info
  getMemoryInfo(): any {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }

  // Log performance summary
  logSummary(): void {
    if (this.isProduction) return;
    
    const metrics = this.getAllMetrics();
    if (metrics.length === 0) return;
    
    console.group('📊 Performance Summary');
    metrics.forEach(metric => {
      if (metric.duration) {
        console.log(`${metric.name}: ${metric.duration.toFixed(2)}ms`);
      }
    });
    
    const memoryInfo = this.getMemoryInfo();
    if (memoryInfo) {
      console.log(`Memory: ${(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    }
    console.groupEnd();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for measuring component performance
export const usePerformanceMonitor = (componentName: string) => {
  return {
    start: () => performanceMonitor.start(`component-${componentName}`),
    end: () => performanceMonitor.end(`component-${componentName}`),
    measure: <T extends any[]>(fn: (...args: T) => any) => 
      performanceMonitor.measureComponent(componentName, fn),
  };
};

// Higher-order component for automatic performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const MonitoredComponent = (props: P) => {
    performanceMonitor.start(`render-${displayName}`);
    
    // Use effect to measure after render
    React.useEffect(() => {
      performanceMonitor.end(`render-${displayName}`);
    });
    
    return React.createElement(WrappedComponent, props);
  };
  
  MonitoredComponent.displayName = `withPerformanceMonitoring(${displayName})`;
  return MonitoredComponent;
};