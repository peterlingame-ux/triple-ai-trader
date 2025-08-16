// Production console cleanup utility
export const initializeConsoleCleanup = () => {
  if (process.env.NODE_ENV === 'production') {
    // Override console methods in production
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
    // Keep console.error for critical debugging
    const originalError = console.error;
    console.error = (...args: any[]) => {
      // Only log critical errors in production
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Critical:')) {
        originalError(...args);
      }
    };
  }
};

// Development-only console methods
export const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export const devWarn = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(...args);
  }
};

export const devError = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};
