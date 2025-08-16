// Global performance optimizations to reduce lag
import { throttle, debounce } from './performance';

// Store original ResizeObserver reference
const OriginalResizeObserver = window.ResizeObserver;

class OptimizedResizeObserver {
  private observer: ResizeObserver;
  
  constructor(callback: ResizeObserverCallback) {
    const wrappedCallback: ResizeObserverCallback = (entries, observer) => {
      window.requestAnimationFrame(() => {
        try {
          callback(entries, observer);
        } catch (error) {
          // Silently handle ResizeObserver errors
        }
      });
    };
    this.observer = new OriginalResizeObserver(wrappedCallback);
  }
  
  observe(target: Element) {
    return this.observer.observe(target);
  }
  
  unobserve(target: Element) {
    return this.observer.unobserve(target);
  }
  
  disconnect() {
    return this.observer.disconnect();
  }
}

// Replace global ResizeObserver
(window as any).ResizeObserver = OptimizedResizeObserver;

// Optimize scroll and resize events globally
const optimizeGlobalEvents = () => {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  
  EventTarget.prototype.addEventListener = function(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    let optimizedListener = listener;
    
    // Throttle expensive events
    if (type === 'scroll' || type === 'resize' || type === 'mousemove') {
      const delay = type === 'scroll' ? 16 : type === 'resize' ? 100 : 50;
      optimizedListener = throttle(listener as EventListener, delay) as EventListener;
    }
    
    // Debounce input events
    if (type === 'input' || type === 'keyup') {
      optimizedListener = debounce(listener as EventListener, 300) as EventListener;
    }
    
    return originalAddEventListener.call(this, type, optimizedListener, options);
  };
};

// Memory cleanup optimization
const optimizeMemoryUsage = () => {
  // Clear unused performance entries periodically
  setInterval(() => {
    if (performance.getEntries) {
      const entries = performance.getEntries();
      if (entries.length > 1000) {
        performance.clearResourceTimings();
        performance.clearMeasures();
        performance.clearMarks();
      }
    }
    
    // Force garbage collection in development
    if (process.env.NODE_ENV === 'development' && window.gc) {
      window.gc();
    }
  }, 30000); // Every 30 seconds
};

// Reduce animation frame pressure
const optimizeAnimations = () => {
  const originalRAF = window.requestAnimationFrame;
  let rafQueue: Array<FrameRequestCallback> = [];
  let rafScheduled = false;
  
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    rafQueue.push(callback);
    
    if (!rafScheduled) {
      rafScheduled = true;
      originalRAF(() => {
        const callbacks = rafQueue.splice(0);
        rafScheduled = false;
        
        // Process callbacks in batches to prevent blocking
        const processCallbacks = (index: number = 0) => {
          const batchSize = 5;
          const end = Math.min(index + batchSize, callbacks.length);
          
          for (let i = index; i < end; i++) {
            try {
              callbacks[i](performance.now());
            } catch (error) {
              console.warn('RAF callback error:', error);
            }
          }
          
          if (end < callbacks.length) {
            setTimeout(() => processCallbacks(end), 0);
          }
        };
        
        processCallbacks();
      });
    }
    
    return 0; // Return dummy ID
  };
};

// Initialize all optimizations
export const initializePerformanceOptimizations = () => {
  optimizeGlobalEvents();
  optimizeMemoryUsage();
  optimizeAnimations();
  
  // Disable console logs in production for better performance
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
  }
  
  // Optimize CSS animations
  document.documentElement.style.setProperty('--animation-speed', '0.3s');
  
  console.log('Performance optimizations initialized');
};

// Export type for global window extension
declare global {
  interface Window {
    gc?: () => void;
  }
}