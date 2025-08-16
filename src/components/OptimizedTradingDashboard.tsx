import { lazy, Suspense, memo, useCallback, useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WalletConnector } from "./WalletConnector";
import { UserProfile } from "./UserProfile";
import { CryptoSearch } from "./CryptoSearch";
import { BinanceAPIConfig } from "./BinanceAPIConfig";
import { OptimizedPortfolioCards } from "./OptimizedPortfolioCards";
import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData, filterCryptoData } from "@/hooks/useCryptoData";
import { useWalletData } from "@/hooks/useWalletData";
import { useOptimizedLoading } from "@/hooks/useOptimizedLoading";
import { performanceMonitor } from "@/utils/performanceMonitor";
import { BarChart3, Brain, RefreshCw } from "lucide-react";

// Lazy load heavy components
const LazyAutoTrader = lazy(() => import("./AutoTrader").then(m => ({ default: m.AutoTrader })));
const LazyAIAdvisorsGrid = lazy(() => import("./AIAdvisorsGrid").then(m => ({ default: m.AIAdvisorsGrid })));
const LazyUpcomingAdvisors = lazy(() => import("./UpcomingAdvisors").then(m => ({ default: m.UpcomingAdvisors })));
const LazyProfessionalCryptoGrid = lazy(() => import("./ProfessionalCryptoGrid").then(m => ({ default: m.ProfessionalCryptoGrid })));
const LazyAIControlCenter = lazy(() => import("./AIControlCenter").then(m => ({ default: m.AIControlCenter })));

// Optimized loading fallbacks
const GridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-32 w-full" />
    ))}
  </div>
);

const AdvisorsSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  </div>
);

export const OptimizedTradingDashboard = memo(() => {
  performanceMonitor.start('trading-dashboard-render');
  
  const { t } = useLanguage();
  const { cryptoData, newsData, loading, error, refreshData } = useCryptoData();
  const { getPortfolioData, isWalletConnected } = useWalletData();
  const { isLoading: refreshLoading, executeWithLoading } = useOptimizedLoading({
    minLoadingTime: 500,
    maxLoadingTime: 10000,
  });
  
  const [showAllCrypto, setShowAllCrypto] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIControlCenter, setShowAIControlCenter] = useState(false);

  // Memoized filtered data
  const filteredCryptoData = useMemo(() => {
    performanceMonitor.start('filter-crypto-data');
    const filtered = filterCryptoData(cryptoData, searchQuery);
    performanceMonitor.end('filter-crypto-data');
    return filtered;
  }, [cryptoData, searchQuery]);

  // Memoized portfolio data
  const portfolioData = useMemo(() => {
    performanceMonitor.start('calculate-portfolio');
    const portfolio = isWalletConnected 
      ? getPortfolioData() 
      : {
          totalValue: 125420.35,
          dailyChange: 8.5,
          activeTrades: 3,
          source: 'wallet' as const
        };
    performanceMonitor.end('calculate-portfolio');
    return portfolio;
  }, [isWalletConnected, getPortfolioData]);

  // Optimized handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleRefresh = useCallback(async () => {
    await executeWithLoading(async () => {
      await refreshData();
    });
  }, [refreshData, executeWithLoading]);

  const handleOpenAIControlCenter = useCallback(() => {
    if (!showAIControlCenter) {
      setShowAIControlCenter(true);
    }
  }, [showAIControlCenter]);

  // Performance logging
  useEffect(() => {
    performanceMonitor.end('trading-dashboard-render');
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-optimize">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-crypto opacity-50 -z-10" />
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent -z-10" />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-glow">
                <BarChart3 className="w-7 h-7 text-background" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {t('dashboard.title')}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">{t('dashboard.realTimeData')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <UserProfile />
            <WalletConnector />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Portfolio Overview */}
        <OptimizedPortfolioCards portfolioData={portfolioData} />

        {/* API Configuration */}
        <BinanceAPIConfig />

        {/* Crypto Market Overview */}
        <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-crypto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-ai rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {t('dashboard.cryptoMarket')}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.liveMarketData')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleRefresh}
                  disabled={refreshLoading}
                  size="sm"
                  variant="outline"
                  className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshLoading ? 'animate-spin' : ''}`} />
                  {t('common.refresh')}
                </Button>
              </div>
            </div>

            <CryptoSearch 
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
              searchQuery={searchQuery}
              totalCryptos={cryptoData.length}
              filteredCount={filteredCryptoData.length}
            />

            <div className="mt-6">
              <Suspense fallback={<GridSkeleton />}>
                <LazyProfessionalCryptoGrid
                  cryptoData={filteredCryptoData}
                  showAll={showAllCrypto}
                  maxVisible={6}
                />
              </Suspense>
              
              {!showAllCrypto && filteredCryptoData.length > 6 && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => setShowAllCrypto(true)}
                    variant="outline"
                    className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary/10"
                  >
                    {t('dashboard.showMore')} ({filteredCryptoData.length - 6} {t('dashboard.more')})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* AI Control Center Modal */}
        {showAIControlCenter && (
          <Suspense fallback={<div className="fixed inset-0 bg-background/80 flex items-center justify-center"><Skeleton className="w-96 h-96" /></div>}>
            <LazyAIControlCenter
              open={showAIControlCenter}
              onOpenChange={setShowAIControlCenter}
            />
          </Suspense>
        )}

        {/* Auto Trader */}
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <LazyAutoTrader />
        </Suspense>

        {/* AI Advisors Grid */}
        <Suspense fallback={<AdvisorsSkeleton />}>
          <LazyAIAdvisorsGrid />
        </Suspense>

        {/* Upcoming Advisors */}
        <Suspense fallback={<AdvisorsSkeleton />}>
          <LazyUpcomingAdvisors />
        </Suspense>
      </div>
    </div>
  );
});

OptimizedTradingDashboard.displayName = 'OptimizedTradingDashboard';