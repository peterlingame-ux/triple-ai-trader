// Centralized error handling utilities

export interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  context?: any;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  component?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLog[] = [];
  private maxLogs = 1000;

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  log(level: ErrorLog['level'], message: string, context?: any, component?: string): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      message,
      context,
      timestamp: new Date(),
      level,
      component,
      stack: level === 'error' ? new Error().stack : undefined
    };

    this.logs.unshift(errorLog);
    
    // Keep only the latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console output only in development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = level === 'error' ? 'error' : 
                           level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}] ${component || 'App'}:`, message, context);
    }
  }

  error(message: string, context?: any, component?: string): void {
    this.log('error', message, context, component);
  }

  warn(message: string, context?: any, component?: string): void {
    this.log('warn', message, context, component);
  }

  info(message: string, context?: any, component?: string): void {
    this.log('info', message, context, component);
  }

  debug(message: string, context?: any, component?: string): void {
    this.log('debug', message, context, component);
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogsByLevel(level: ErrorLog['level']): ErrorLog[] {
    return this.logs.filter(log => log.level === level);
  }

  getLogsByComponent(component: string): ErrorLog[] {
    return this.logs.filter(log => log.component === component);
  }
}

export const logger = ErrorLogger.getInstance();

// Error boundary utility
export const handleAsyncError = async <T>(
  operation: () => Promise<T>,
  errorMessage: string,
  component?: string
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    logger.error(errorMessage, { error }, component);
    return null;
  }
};

// Retry utility with exponential backoff
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  component?: string
): Promise<T | null> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        logger.error(`Final retry attempt failed`, { error, attempt }, component);
        return null;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.warn(`Retry attempt ${attempt} failed, retrying in ${delay}ms`, { error }, component);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return null;
};
