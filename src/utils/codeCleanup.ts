// Code cleanup utilities for production optimization

// Remove development-only code in production builds
export const productionCleanup = () => {
  // Remove debug statements
  if (process.env.NODE_ENV === 'production') {
    // Override performance monitoring in production
    const noop = () => {};
    
    // Replace development logging
    (window as any).__DEV_LOG__ = noop;
    (window as any).__DEV_WARN__ = noop;
    (window as any).__DEV_ERROR__ = noop;
  }
};

// Clean up event listeners
export const cleanupEventListeners = () => {
  const listeners = new Set<() => void>();
  
  const addCleanup = (cleanup: () => void) => {
    listeners.add(cleanup);
  };
  
  const cleanupAll = () => {
    listeners.forEach(cleanup => cleanup());
    listeners.clear();
  };
  
  // Auto cleanup on page unload
  window.addEventListener('beforeunload', cleanupAll);
  
  return { addCleanup, cleanupAll };
};

// Remove unused CSS classes (to be used with build tools)
export const unusedCSSClasses = [
  'story-link', // If not used
  'hover-scale', // If not used
  'pulse', // If not used
];

// Dead code elimination markers
export const deadCodeMarkers = {
  // Mark code blocks for removal
  REMOVE_IN_PRODUCTION: 'REMOVE_IN_PRODUCTION',
  DEBUG_ONLY: 'DEBUG_ONLY',
  TODO_REMOVE: 'TODO_REMOVE'
};