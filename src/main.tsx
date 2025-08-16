import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializePerformanceOptimizations } from './utils/performanceOptimizations'
import { initializeConsoleCleanup } from './utils/cleanupLogs'
import { productionCleanup } from './utils/codeCleanup'

// Initialize optimizations before app starts
initializePerformanceOptimizations();
initializeConsoleCleanup();
productionCleanup();

createRoot(document.getElementById("root")!).render(
  <App />
);
