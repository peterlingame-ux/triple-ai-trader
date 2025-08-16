import { useEffect, useState } from 'react';

// Mobile viewport optimization hook
export const useMobileViewport = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setIsMobile(width < 768); // Mobile breakpoint
      
      // Set CSS custom properties for mobile viewport handling
      document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
      document.documentElement.style.setProperty('--vw', `${width * 0.01}px`);
    };

    // Initial call
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      // Delay to ensure proper viewport calculation after orientation change
      setTimeout(handleResize, 100);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Force desktop-like layout on mobile
  const enableDesktopLayout = () => {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=1200, initial-scale=0.3, user-scalable=yes');
    }
  };

  // Reset to responsive layout
  const enableResponsiveLayout = () => {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
    }
  };

  return {
    isMobile,
    screenSize,
    enableDesktopLayout,
    enableResponsiveLayout
  };
};