import { useCallback, useRef, useEffect, useState } from 'react';
import { useThrottle, useDebounce } from '@/utils/performanceOptimizer';

// Optimized performance hook for crypto data
export const useOptimizedPerformance = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  // Monitor FPS to detect performance issues
  useEffect(() => {
    let animationFrameId: number;
    
    const measureFPS = () => {
      const now = performance.now();
      frameCount.current++;
      
      if (now - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
        setIsLowPerformance(fps < 30); // Consider low performance if FPS < 30
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      animationFrameId = requestAnimationFrame(measureFPS);
    };
    
    animationFrameId = requestAnimationFrame(measureFPS);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Page visibility API to pause updates when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Optimized scroll handler
  const createOptimizedScrollHandler = useCallback((
    handler: (event: Event) => void,
    throttleMs: number = 16
  ) => {
    return useThrottle(handler, throttleMs);
  }, []);

  // Optimized search handler
  const createOptimizedSearchHandler = useCallback((
    handler: (query: string) => void,
    debounceMs: number = 300
  ) => {
    return useDebounce(handler, debounceMs);
  }, []);

  // Memory cleanup utilities
  const createCleanupScheduler = useCallback(() => {
    const timeouts = new Set();
    const intervals = new Set();
    
    const addTimeout = (callback: () => void, delay: number) => {
      const timeout = setTimeout(() => {
        callback();
        timeouts.delete(timeout);
      }, delay);
      timeouts.add(timeout);
      return timeout;
    };
    
    const addInterval = (callback: () => void, delay: number) => {
      const interval = setInterval(callback, delay);
      intervals.add(interval);
      return interval;
    };
    
    const cleanup = () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      timeouts.clear();
      intervals.clear();
    };
    
    return { addTimeout, addInterval, cleanup };
  }, []);

  // Performance-aware rendering
  const shouldRender = useCallback((priority: 'high' | 'medium' | 'low' = 'medium') => {
    if (!isVisible) return false;
    
    if (isLowPerformance) {
      return priority === 'high';
    }
    
    return true;
  }, [isVisible, isLowPerformance]);

  return {
    isVisible,
    isLowPerformance,
    createOptimizedScrollHandler,
    createOptimizedSearchHandler,
    createCleanupScheduler,
    shouldRender
  };
};

// Hook for managing component lifecycle with cleanup
export const useComponentLifecycle = (
  onMount?: () => void | (() => void),
  onUnmount?: () => void
) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (onMount) {
      const cleanup = onMount();
      if (typeof cleanup === 'function') {
        cleanupRef.current = cleanup;
      }
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      if (onUnmount) {
        onUnmount();
      }
    };
  }, [onMount, onUnmount]);
};

// Optimized crypto data hook
export const useOptimizedCryptoRender = (
  cryptoData: any[],
  maxVisible: number = 50
) => {
  const [visibleData, setVisibleData] = useState<any[]>([]);
  const { shouldRender } = useOptimizedPerformance();

  useEffect(() => {
    if (shouldRender('medium')) {
      const newData = cryptoData.slice(0, maxVisible);
      setVisibleData(newData);
    }
  }, [cryptoData, maxVisible, shouldRender]);

  return {
    visibleData,
    shouldRender: shouldRender('low') // Lower priority for crypto cards
  };
};