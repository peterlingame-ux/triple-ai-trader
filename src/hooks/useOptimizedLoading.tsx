import { useState, useCallback, useRef, useEffect } from 'react';

interface UseOptimizedLoadingOptions {
  minLoadingTime?: number;
  maxLoadingTime?: number;
  onTimeout?: () => void;
}

export const useOptimizedLoading = (options: UseOptimizedLoadingOptions = {}) => {
  const {
    minLoadingTime = 300,
    maxLoadingTime = 10000,
    onTimeout,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
    startTimeRef.current = Date.now();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setError('Request timed out');
      onTimeout?.();
    }, maxLoadingTime);
  }, [maxLoadingTime, onTimeout]);

  const stopLoading = useCallback(async (errorMessage?: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (errorMessage) {
      setError(errorMessage);
    }

    const elapsedTime = Date.now() - startTimeRef.current;
    const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }

    setIsLoading(false);
  }, [minLoadingTime]);

  const executeWithLoading = useCallback(async (
    asyncFunction: () => Promise<any>
  ): Promise<any> => {
    try {
      startLoading();
      const result = await asyncFunction();
      await stopLoading();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      await stopLoading(errorMessage);
      return null;
    }
  }, [startLoading, stopLoading]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    executeWithLoading,
  };
};

export const useCryptoDataLoading = () => {
  return useOptimizedLoading({
    minLoadingTime: 500,
    maxLoadingTime: 15000,
    onTimeout: () => {
      console.warn('Crypto data loading timed out');
    },
  });
};

export const useTradingLoading = () => {
  return useOptimizedLoading({
    minLoadingTime: 200,
    maxLoadingTime: 5000,
    onTimeout: () => {
      console.error('Trading operation timed out');
    },
  });
};