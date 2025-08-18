import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializePerformanceOptimizations } from './utils/performanceOptimizations'
import { initializeConsoleCleanup } from './utils/cleanupLogs'
import { productionCleanup } from './utils/codeCleanup'
import { productionOptimizations } from './utils/productionOptimizations'

// Initialize optimizations before app starts
initializePerformanceOptimizations();
initializeConsoleCleanup();
productionCleanup();
productionOptimizations.init();

createRoot(document.getElementById("root")!).render(
  <App />
);
