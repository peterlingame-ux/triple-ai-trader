// Debug cleanup utility for removing console logs and debug code
export const debugCleanup = {
  // Replace console methods in production
  removeConsoleLogs: () => {
    if (process.env.NODE_ENV === 'production') {
      const noop = () => {};
      console.log = noop;
      console.debug = noop;
      console.info = noop;
      console.warn = noop;
      console.error = noop;
    }
  },

  // Development-only logger
  devLog: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] ${message}`, ...args);
    }
  },

  devWarn: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[DEV] ${message}`, ...args);
    }
  },

  devError: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[DEV] ${message}`, ...args);
    }
  },

  // Clean debug markers from code
  removeDebugMarkers: () => {
    if (process.env.NODE_ENV === 'production') {
      // Remove any remaining debug markers
      const debugElements = document.querySelectorAll('[data-debug]');
      debugElements.forEach(element => {
        element.removeAttribute('data-debug');
      });
    }
  }
};

// Auto-initialize in production
if (process.env.NODE_ENV === 'production') {
  debugCleanup.removeConsoleLogs();
  debugCleanup.removeDebugMarkers();
}

export default debugCleanup;