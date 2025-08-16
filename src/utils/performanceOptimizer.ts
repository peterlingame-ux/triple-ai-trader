// Performance optimization utilities
import { useCallback, useRef, useEffect } from 'react';

// Debounce hook for input handling
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
};

// Throttle hook for scroll/resize events
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T => {
  const inThrottle = useRef(false);

  return useCallback((...args: any[]) => {
    if (!inThrottle.current) {
      callback(...args);
      inThrottle.current = true;
      setTimeout(() => {
        inThrottle.current = false;
      }, limit);
    }
  }, [callback, limit]) as T;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  const observe = useCallback((element: Element) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element: Element) => {
    if (observerRef.current && element) {
      observerRef.current.unobserve(element);
    }
  }, []);

  return { observe, unobserve };
};

// Memory optimization for large lists
export const createVirtualizedList = (
  items: any[],
  itemHeight: number,
  containerHeight: number,
  scrollTop: number
) => {
  const totalHeight = items.length * itemHeight;
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  return {
    totalHeight,
    visibleItems: items.slice(visibleStart, visibleEnd),
    offsetY: visibleStart * itemHeight,
    visibleStart,
    visibleEnd
  };
};

// Performance monitoring
export const performanceMonitor = {
  startMeasure: (name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  },

  endMeasure: (name: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      if (measure && measure.duration > 100) { // Log slow operations > 100ms
        console.warn(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
      }
    }
  },

  clearMeasures: () => {
    if (typeof performance !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
};

// ResizeObserver wrapper to prevent errors
export const createResizeObserver = (
  callback: ResizeObserverCallback
): ResizeObserver => {
  let animationId: number;
  
  const wrappedCallback: ResizeObserverCallback = (entries, observer) => {
    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(() => {
      try {
        callback(entries, observer);
      } catch (error) {
        console.warn('ResizeObserver callback error:', error);
      }
    });
  };

  return new ResizeObserver(wrappedCallback);
};