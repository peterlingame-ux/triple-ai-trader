import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CryptoCard } from "./CryptoCard";
import { LanguageSwitcher } from "./LanguageSwitcher";


import { AutoTrader } from "./AutoTrader";
import { UpcomingAdvisors } from "./UpcomingAdvisors";
import { AIAdvisorsGrid } from "./AIAdvisorsGrid";
// import { AIOpportunityAlert } from "./AIOpportunityAlert"; // Temporarily disabled
import { UserProfile } from "./UserProfile";

import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData, filterCryptoData } from "@/hooks/useCryptoData";
import { useWalletData } from "@/hooks/useWalletData";
import { CryptoSearch } from "./CryptoSearch";
import { BinanceAPIConfig } from "./BinanceAPIConfig";
import { ProfessionalCryptoGrid } from "./ProfessionalCryptoGrid";
// Portfolio cards moved to AI Control Center
import { BarChart3, Brain, RefreshCw } from "lucide-react";
import { AIControlCenter } from "./AIControlCenter";

// Removed duplicate mock data - using centralized data from useCryptoData hook


export const TradingDashboard = memo(() => {
  const { t } = useLanguage();
  const { cryptoData, newsData, loading, error, refreshData, isRealTimeEnabled } = useCryptoData();
  const { getPortfolioData } = useWalletData();
  const [showAllCrypto, setShowAllCrypto] = useState(false); // 默认折叠状态
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIControlCenter, setShowAIControlCenter] = useState(false);
  const [advisorStates, setAdvisorStates] = useState<Record<string, boolean>>({});

  // Listen for AI Control Center open events - 优化事件监听
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

  // Get portfolio data from auto-trader
  const portfolioData = useMemo(() => getPortfolioData(), [getPortfolioData]);
  const { totalValue, dailyChange, activeTrades, source } = portfolioData;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="min-h-screen relative p-3 sm:p-6 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 overflow-hidden">
      {/* Simplified background elements for better mobile performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 sm:opacity-30">
        <div className="absolute top-6 sm:top-10 left-6 sm:left-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent text-sm sm:text-lg font-bold">₿</span>
        </div>
        <div className="absolute top-20 sm:top-32 right-12 sm:right-20 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-accent/15 flex items-center justify-center">
          <span className="text-accent text-xs sm:text-sm font-bold">Ξ</span>
        </div>
        <div className="absolute bottom-1/3 right-6 sm:right-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent text-base sm:text-lg font-bold">$</span>
        </div>
      </div>
      
      {/* Main content with backdrop blur */}
      <div className="relative z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {/* Professional Header Design - Enhanced Layout */}
        <div className="relative">
          {/* Enhanced glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl"></div>
          
          {/* Content with proper professional spacing */}
          <div className="relative px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Section - Brand Identity (4 columns) */}
              <div className="lg:col-span-4">
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 tracking-tight leading-none">
                    Meta BrainX
                  </h1>
                  <p className="text-base lg:text-lg text-slate-300/90 font-inter font-medium tracking-wide max-w-md">
                    {t('app.subtitle')}
                  </p>
                </div>
              </div>
              
              {/* Center Section - Status & Indicators (4 columns) */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="flex flex-col items-center gap-4">
                  {/* Real-time Status Badge */}
                  <div className="relative group">
                    <Badge variant="outline" className="px-6 py-3 bg-gradient-to-r from-green-500/15 to-emerald-500/15 text-green-300 border-green-400/30 backdrop-blur-md hover:from-green-500/25 hover:to-emerald-500/25 transition-all duration-300 shadow-lg">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse shadow-lg shadow-green-400/60"></div>
                      <Brain className="w-5 h-5 mr-2" />
                      <span className="font-semibold tracking-wide">{t('status.live')}</span>
                    </Badge>
                    <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-xl -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Enhanced User Profile - Center Position */}
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <UserProfile />
                  </div>
                </div>
              </div>
              
              {/* Right Section - Controls & Settings (4 columns) */}
              <div className="lg:col-span-4 flex justify-end">
                <div className="flex items-center gap-4">
                  <LanguageSwitcher />
                </div>
              </div>
              
            </div>
          </div>
          
          {/* Professional accent line */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
          
          {/* Corner accents for premium feel */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-400/30 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-400/30 rounded-tr-lg"></div>
          
        </div>

        {/* AI Opportunity Alert - Temporarily disabled due to API issues */}
        {/* <AIOpportunityAlert /> */}

        {/* Portfolio Overview moved to AI Control Center */}

        {/* 币安API配置 */}
        <BinanceAPIConfig />

        {/* Crypto Cards Grid */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                {t('market.overview')}
                {loading && <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />}
              </h2>
              {isRealTimeEnabled && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  实时数据
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <Button 
                variant="outline" 
                onClick={refreshData}
                size="sm"
                className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/30 text-xs sm:text-sm whitespace-nowrap"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {t('button.refresh')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAllCrypto(!showAllCrypto)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-3 sm:px-6 text-xs sm:text-sm whitespace-nowrap"
              >
                {showAllCrypto ? t('button.collapse') : t('button.all_categories')}
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              </Button>
            </div>
          </div>
          
          {/* Search Component - Mobile Optimized */}
          <div className="mb-4 sm:mb-6">
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
                    maxVisible={6}
                  />
                  
                  {/* 货币计数和折叠状态显示 */}
                  <div className="flex items-center justify-between mt-4 px-2">
                    <div className="text-sm text-muted-foreground">
                      {t('search.showing')} {showAllCrypto ? filteredCryptoData.length : Math.min(6, filteredCryptoData.length)} {t('search.of')} {filteredCryptoData.length} {t('search.currencies')}
                    </div>
                    {filteredCryptoData.length > 6 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllCrypto(!showAllCrypto)}
                        className="text-primary hover:text-primary/80 text-xs sm:text-sm"
                      >
                        {showAllCrypto ? t('button.collapse') : `${t('button.view_all')} ${filteredCryptoData.length}`}
                      </Button>
                    )}
                  </div>
          
          {filteredCryptoData.length === 0 && searchQuery && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-muted-foreground text-base sm:text-lg">
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
          portfolioData={portfolioData}
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