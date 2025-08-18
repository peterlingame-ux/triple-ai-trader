// Production optimizations and cleanup utilities
export const productionOptimizations = {
  // Remove all console logs in production
  removeDebugLogs: () => {
    if (process.env.NODE_ENV === 'production') {
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
      console.debug = () => {};
      console.info = () => {};
    }
  },

  // Cleanup event listeners and timers
  cleanupResources: () => {
    if (typeof window !== 'undefined') {
      // Clear performance entries periodically
      if (typeof performance !== 'undefined') {
        performance.clearMarks();
        performance.clearMeasures();
        performance.clearResourceTimings();
      }
      
      // Force garbage collection in development (if available)
      if ((window as any).gc && typeof (window as any).gc === 'function') {
        try {
          (window as any).gc();
        } catch (e) {
          // Ignore GC errors
        }
      }
    }
  },

  // Memory optimization
  optimizeMemory: () => {
    if (process.env.NODE_ENV === 'production') {
      // Clear performance entries periodically
      if (typeof performance !== 'undefined') {
        setInterval(() => {
          if (performance.getEntriesByType('navigation').length > 100) {
            performance.clearMarks();
            performance.clearMeasures();
            performance.clearResourceTimings();
          }
        }, 300000); // Every 5 minutes
      }

      // Force garbage collection in development (if available)
      if ((window as any).gc && typeof (window as any).gc === 'function') {
        setInterval(() => {
          try {
            (window as any).gc();
          } catch (e) {
            // Ignore GC errors
          }
        }, 600000); // Every 10 minutes
      }
    }
  },

  // Initialize all optimizations
  init: () => {
    productionOptimizations.removeDebugLogs();
    productionOptimizations.optimizeMemory();
    
    // Cleanup on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        productionOptimizations.cleanupResources();
      });
    }
  }
};

// Auto-initialize optimizations
if (process.env.NODE_ENV === 'production') {
  productionOptimizations.init();
}