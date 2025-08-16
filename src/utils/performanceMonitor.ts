import React from 'react';

// Enhanced performance monitoring utilities
export const performanceMonitor = {
  startMeasure: (name: string) => {
    if (typeof performance !== 'undefined' && process.env.NODE_ENV === 'development') {
      performance.mark(`${name}-start`);
    }
  },

  endMeasure: (name: string) => {
    if (typeof performance !== 'undefined' && process.env.NODE_ENV === 'development') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      if (measure && measure.duration > 100) {
        console.warn(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
      }
    }
  },

  clearMeasures: () => {
    if (typeof performance !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
    }
  },

  // Memory usage monitoring (development only)
  monitorMemory: () => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        console.log('Memory Usage:', {
          used: `${Math.round(memory.usedJSHeapSize / 1048576)} MB`,
          total: `${Math.round(memory.totalJSHeapSize / 1048576)} MB`,
          limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)} MB`
        });
      }
    }
  }
};