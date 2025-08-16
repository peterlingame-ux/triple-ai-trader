// Enhanced error recovery and resilience utilities
import { logger } from './errorHandler';

// Circuit breaker pattern for API calls
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly threshold: number = 5,
    private readonly timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }

  getState() {
    return this.state;
  }
}

// Retry with exponential backoff
export const retryWithExponentialBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 30000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        logger.error('Max retries exceeded', { 
          attempts: attempt + 1, 
          error: lastError.message 
        }, 'RetryMechanism');
        break;
      }
      
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = Math.random() * 0.1 * delay; // Add jitter to prevent thundering herd
      
      logger.warn(`Retrying operation in ${delay + jitter}ms`, { 
        attempt: attempt + 1, 
        error: lastError.message 
      }, 'RetryMechanism');
      
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }
  
  throw lastError!;
};

// Graceful degradation for features
export class FeatureFlag {
  private static flags: Map<string, boolean> = new Map();
  
  static enable(feature: string) {
    this.flags.set(feature, true);
  }
  
  static disable(feature: string) {
    this.flags.set(feature, false);
  }
  
  static isEnabled(feature: string, defaultValue: boolean = true): boolean {
    return this.flags.get(feature) ?? defaultValue;
  }
  
  static withFallback<T>(
    feature: string, 
    primaryFn: () => T, 
    fallbackFn: () => T
  ): T {
    try {
      if (this.isEnabled(feature)) {
        return primaryFn();
      }
    } catch (error) {
      logger.warn(`Feature ${feature} failed, using fallback`, { error }, 'FeatureFlag');
      this.disable(feature);
    }
    
    return fallbackFn();
  }
}

// Memory pressure monitoring
export class MemoryMonitor {
  private static instance: MemoryMonitor;
  private memoryPressure: 'low' | 'medium' | 'high' = 'low';
  private callbacks: Array<(pressure: 'low' | 'medium' | 'high') => void> = [];

  static getInstance(): MemoryMonitor {
    if (!this.instance) {
      this.instance = new MemoryMonitor();
    }
    return this.instance;
  }

  private constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    // Check memory usage periodically
    setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const used = memory.usedJSHeapSize;
        const limit = memory.jsHeapSizeLimit;
        const ratio = used / limit;

        let newPressure: 'low' | 'medium' | 'high';
        if (ratio > 0.8) {
          newPressure = 'high';
        } else if (ratio > 0.6) {
          newPressure = 'medium';
        } else {
          newPressure = 'low';
        }

        if (newPressure !== this.memoryPressure) {
          this.memoryPressure = newPressure;
          this.notifyCallbacks();
        }
      }
    }, 5000); // Check every 5 seconds
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback(this.memoryPressure);
      } catch (error) {
        logger.error('Memory monitor callback error', { error }, 'MemoryMonitor');
      }
    });
  }

  onPressureChange(callback: (pressure: 'low' | 'medium' | 'high') => void) {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  getCurrentPressure() {
    return this.memoryPressure;
  }
}

// Automatic cleanup for components
export const createAutoCleanup = () => {
  const cleanupTasks: Array<() => void> = [];
  
  const addCleanup = (task: () => void) => {
    cleanupTasks.push(task);
  };
  
  const cleanup = () => {
    cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        logger.error('Cleanup task failed', { error }, 'AutoCleanup');
      }
    });
    cleanupTasks.length = 0;
  };
  
  return { addCleanup, cleanup };
};

// Global error recovery system
export const errorRecoverySystem = {
  circuitBreaker: new CircuitBreaker(),
  memoryMonitor: MemoryMonitor.getInstance(),
  featureFlags: FeatureFlag,
  
  // Initialize recovery mechanisms
  initialize() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled promise rejection', { 
        reason: event.reason 
      }, 'ErrorRecovery');
      
      event.preventDefault(); // Prevent default browser error handling
    });
    
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      logger.error('Uncaught error', { 
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }, 'ErrorRecovery');
    });
    
    // Monitor memory pressure and adjust features
    this.memoryMonitor.onPressureChange((pressure) => {
      switch (pressure) {
        case 'high':
          FeatureFlag.disable('animations');
          FeatureFlag.disable('auto-refresh');
          logger.warn('High memory pressure detected, disabling non-essential features', {}, 'ErrorRecovery');
          break;
        case 'medium':
          FeatureFlag.disable('animations');
          break;
        case 'low':
          FeatureFlag.enable('animations');
          FeatureFlag.enable('auto-refresh');
          break;
      }
    });
  }
};