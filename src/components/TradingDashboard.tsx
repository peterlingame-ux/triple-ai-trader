import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CryptoCard } from "./CryptoCard";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WalletConnector } from "./WalletConnector";
import { AutoTrader } from "./AutoTrader";
import { UpcomingAdvisors } from "./UpcomingAdvisors";
import { AIAdvisorsGrid } from "./AIAdvisorsGrid";
import { UserProfile } from "./UserProfile";
import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData, filterCryptoData } from "@/hooks/useCryptoData";
import { useWalletData } from "@/hooks/useWalletData";
import { CryptoSearch } from "./CryptoSearch";
import { BinanceAPIConfig } from "./BinanceAPIConfig";
import { ProfessionalCryptoGrid } from "./ProfessionalCryptoGrid";
import { OptimizedPortfolioCards } from "./OptimizedPortfolioCards";
import { BarChart3, Brain, RefreshCw } from "lucide-react";
import { AIControlCenter } from "./AIControlCenter";
import { useMobileViewport } from "@/hooks/useMobileViewport";

// Removed duplicate mock data - using centralized data from useCryptoData hook


export const TradingDashboard = memo(() => {
  const { t } = useLanguage();
  const { cryptoData, newsData, loading, error, refreshData } = useCryptoData();
  const { getPortfolioData, isWalletConnected } = useWalletData();
  const { isMobile, enableDesktopLayout } = useMobileViewport();
  const [showAllCrypto, setShowAllCrypto] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIControlCenter, setShowAIControlCenter] = useState(false);
  const [advisorStates, setAdvisorStates] = useState<Record<string, boolean>>({});
  const [forceDesktopMode, setForceDesktopMode] = useState(false);

  // 强制桌面模式切换
  const toggleDesktopMode = useCallback(() => {
    setForceDesktopMode(!forceDesktopMode);
    if (!forceDesktopMode) {
      enableDesktopLayout();
    } else {
      // Reset viewport
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
      }
    }
  }, [forceDesktopMode, enableDesktopLayout]);
  const handleOpenAIControlCenter = useCallback(() => {
    if (!showAIControlCenter) { // 避免重复打开
      setShowAIControlCenter(true);
    }
  }, [showAIControlCenter]);

  useEffect(() => {
    window.addEventListener('openAIControlCenter', handleOpenAIControlCenter);
    return () => {
      window.removeEventListener('openAIControlCenter', handleOpenAIControlCenter);
    };
  }, [handleOpenAIControlCenter]);
  
  // Memoize filtered crypto data for performance
  const filteredCryptoData = useMemo(() => 
    filterCryptoData(cryptoData, searchQuery), 
    [cryptoData, searchQuery]
  );

  // Get portfolio data from either wallet or auto-trader
  const portfolioData = useMemo(() => getPortfolioData(), [getPortfolioData]);
  const { totalValue, dailyChange, activeTrades, source } = portfolioData;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="min-h-screen relative p-2 md:p-6 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background elements - 桌面级密度 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-6 left-6 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent text-lg font-bold">₿</span>
        </div>
        <div className="absolute top-32 right-20 w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
          <span className="text-accent text-sm font-bold">Ξ</span>
        </div>
        <div className="absolute bottom-1/3 right-10 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent text-lg font-bold">$</span>
        </div>
      </div>
      
      {/* Main content with backdrop blur */}
      <div className="relative z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Professional Header Design - 全屏幕统一设计 */}
        <div className="relative">
          {/* Background with enhanced glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-950/80 to-slate-900/90 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-2xl"></div>
          
          {/* Content */}
          <div className="relative px-4 md:px-10 py-6 md:py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              {/* Left Section - Brand */}
              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 tracking-tight">
                    Meta BrainX
                  </h1>
                  <p className="text-base md:text-lg text-slate-300 font-inter font-medium tracking-wide">
                    {t('app.subtitle')}
                  </p>
                </div>
              </div>
              
              {/* Center Section - Status Indicator */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="relative">
                  <Badge variant="outline" className="px-6 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 border-green-500/20 backdrop-blur-sm hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse shadow-lg shadow-green-400/50"></div>
                    <Brain className="w-5 h-5 mr-2" />
                    {t('status.live')}
                  </Badge>
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-md -z-10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Right Section - User Controls */}
              <div className="flex items-center gap-3 justify-center lg:justify-end">
                {isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleDesktopMode}
                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-600/30 text-xs px-2"
                  >
                    {forceDesktopMode ? '移动版' : '桌面版'}
                  </Button>
                )}
                <UserProfile />
                <WalletConnector />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
          
          {/* Subtle bottom accent */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-sm"></div>
        </div>

        {/* AI Opportunity Alert - Temporarily disabled due to API issues */}
        {/* <AIOpportunityAlert /> */}

        {/* Portfolio Overview with Dynamic Data Source */}
        <OptimizedPortfolioCards portfolioData={portfolioData} />

        {/* 币安API配置 */}
        <BinanceAPIConfig />

        {/* Crypto Cards Grid - 桌面级密度显示 */}
        <div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
              {t('market.overview')}
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto">
              <Button 
                variant="outline" 
                onClick={refreshData}
                size="sm"
                className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/30 text-sm whitespace-nowrap"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {t('button.refresh')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAllCrypto(!showAllCrypto)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 text-sm whitespace-nowrap"
              >
                {showAllCrypto ? t('button.collapse') : t('button.all_categories')}
                <BarChart3 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          
          {/* Search Component */}
          <div className="mb-6">
            <CryptoSearch
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
              searchQuery={searchQuery}
              totalCryptos={cryptoData.length}
              filteredCount={filteredCryptoData.length}
            />
          </div>
          
          <ProfessionalCryptoGrid 
            cryptoData={filteredCryptoData} 
            showAll={showAllCrypto}
            maxVisible={12}
          />
                  
          {/* 货币计数和折叠状态显示 */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              {t('search.showing')} {showAllCrypto ? filteredCryptoData.length : Math.min(12, filteredCryptoData.length)} {t('search.of')} {filteredCryptoData.length} {t('search.currencies')}
            </div>
            {filteredCryptoData.length > 12 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllCrypto(!showAllCrypto)}
                className="text-primary hover:text-primary/80 text-sm"
              >
                {showAllCrypto ? t('button.collapse') : `${t('button.view_all')} ${filteredCryptoData.length}`}
              </Button>
            )}
          </div>
          
          {filteredCryptoData.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t('search.not_found')} "{searchQuery}" {t('search.try_other')}
              </p>
              <p className="text-muted-foreground/70 text-sm mt-2">
                {t('search.suggestion')}
              </p>
            </div>
          )}
        </div>

        {/* AI Control Center Modal */}
        <AIControlCenter 
          open={showAIControlCenter} 
          onOpenChange={setShowAIControlCenter}
          advisorStates={advisorStates}
        />

        {/* AI Advisors Section - Three Column Grid */}
        <div className="mb-6">
          <AIAdvisorsGrid 
            cryptoData={cryptoData} 
            newsData={newsData} 
            onActivationChange={setAdvisorStates}
          />
        </div>

        {/* Upcoming Advisors Section */}
        <UpcomingAdvisors />
      </div>
      </div>
    </div>
  );
});

TradingDashboard.displayName = "TradingDashboard";