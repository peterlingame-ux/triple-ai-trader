// Performance optimization utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization utility for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Batch DOM updates for better performance
export const batchUpdates = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
};

// Lazy loading utility
export const createLazyComponent = <T>(importFunc: () => Promise<{ default: T }>) => {
  let component: T | null = null;
  let promise: Promise<T> | null = null;

  return () => {
    if (component) return Promise.resolve(component);
    if (promise) return promise;

    promise = importFunc().then(module => {
      component = module.default;
      return component;
    });

    return promise;
  };
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
    };
  }
  return null;
};

// Image loading optimization
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Critical resource hints
export const addResourceHint = (href: string, rel: 'preload' | 'prefetch' | 'preconnect') => {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  if (rel === 'preload') {
    link.as = 'script';
  }
  document.head.appendChild(link);
};

// Bundle size analysis helpers
export const logBundleSize = (componentName: string, size: number) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${componentName} bundle size: ${(size / 1024).toFixed(2)}KB`);
  }
};

// Virtual scrolling utility
export const calculateVisibleItems = (
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  buffer = 5
) => {
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    Number.MAX_SAFE_INTEGER
  );

  return {
    start: Math.max(0, visibleStart - buffer),
    end: visibleEnd + buffer,
  };
};