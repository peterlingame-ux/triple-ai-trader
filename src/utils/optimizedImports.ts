// Optimized imports utility to reduce bundle size
export const lazyImports = {
  // Lazy load heavy components
  TradingDashboard: () => import('@/components/TradingDashboard'),
  AIControlCenter: () => import('@/components/AIControlCenter'),
  
  // Lazy load chart components
  Chart: () => import('@/components/ui/chart'),
  
  // Lazy load 3D components when needed
  Crypto3DIcon: () => import('@/components/Crypto3DIcon'),
  Static3DIconShowcase: () => import('@/components/Static3DIconShowcase'),
};

// Code splitting utility
export const splitChunks = {
  // AI related components
  ai: [
    'AIAdvisor',
    'AICommunicator', 
    'AIConfigPanel',
    'AIControlCenter',
    'AIOpportunityAlert',
    'SuperBrainDetection'
  ],
  
  // Trading components
  trading: [
    'AutoTrader',
    'TradingDashboard', 
    'ProfessionalTradingInterface',
    'BinanceAPIConfig'
  ],
  
  // UI components
  ui: [
    'CryptoCard',
    'CryptoIcon',
    'ProfessionalCryptoGrid',
    'OptimizedPortfolioCards'
  ]
};

// Tree shaking optimizations
export const optimizedExports = {
  // Only export what's needed from large libraries
  lucideIcons: [
    'BarChart3',
    'Brain', 
    'RefreshCw',
    'LogOut',
    'User',
    'LogIn',
    'Loader2',
    'ArrowLeft'
  ]
};