import { useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CryptoCard } from "./CryptoCard";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WalletConnector } from "./WalletConnector";
import { AICommunicator } from "./AICommunicator";
import { AutoTrader } from "./AutoTrader";
import { UpcomingAdvisors } from "./UpcomingAdvisors";
import { AIAdvisorsGrid } from "./AIAdvisorsGrid";
import { AIOpportunityAlert } from "./AIOpportunityAlert";
import { UserProfile } from "./UserProfile";

import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData, filterCryptoData } from "@/hooks/useCryptoData";
import { useWalletData } from "@/hooks/useWalletData";
import { CryptoSearch } from "./CryptoSearch";
import { BinanceAPIConfig } from "./BinanceAPIConfig";
import { ProfessionalCryptoGrid } from "./ProfessionalCryptoGrid";
import { OptimizedPortfolioCards } from "./OptimizedPortfolioCards";
import { BarChart3, Brain, RefreshCw } from "lucide-react";
import { ProfessionalCryptoAnalysis } from "./ProfessionalCryptoAnalysis";

// Mock data for crypto prices - expanded dataset
const mockCryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: 43250, change: 1245.50, changePercent: 2.97 },
  { symbol: "ETH", name: "Ethereum", price: 2567, change: -45.30, changePercent: -1.73 },
  { symbol: "ADA", name: "Cardano", price: 0.485, change: 0.023, changePercent: 4.98 },
  { symbol: "SOL", name: "Solana", price: 98.75, change: 3.42, changePercent: 3.59 },
  { symbol: "DOT", name: "Polkadot", price: 7.23, change: -0.18, changePercent: -2.43 },
  { symbol: "MATIC", name: "Polygon", price: 0.89, change: 0.065, changePercent: 7.88 },
];

const allCryptoData = [
  ...mockCryptoData,
  { symbol: "BNB", name: "Binance Coin", price: 315.67, change: 12.45, changePercent: 4.12 },
  { symbol: "XRP", name: "Ripple", price: 0.634, change: -0.021, changePercent: -3.20 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.078, change: 0.004, changePercent: 5.41 },
  { symbol: "AVAX", name: "Avalanche", price: 36.78, change: 1.89, changePercent: 5.42 },
  { symbol: "LINK", name: "Chainlink", price: 14.23, change: -0.67, changePercent: -4.50 },
  { symbol: "UNI", name: "Uniswap", price: 6.45, change: 0.34, changePercent: 5.57 },
  { symbol: "LTC", name: "Litecoin", price: 73.45, change: -2.12, changePercent: -2.81 },
  { symbol: "ATOM", name: "Cosmos", price: 8.67, change: 0.45, changePercent: 5.48 },
  { symbol: "ICP", name: "Internet Computer", price: 5.23, change: -0.23, changePercent: -4.21 },
  { symbol: "NEAR", name: "NEAR Protocol", price: 2.34, change: 0.12, changePercent: 5.41 },
  { symbol: "APT", name: "Aptos", price: 8.90, change: 0.67, changePercent: 8.13 },
  { symbol: "FTM", name: "Fantom", price: 0.445, change: 0.023, changePercent: 5.46 },
];


export const TradingDashboard = () => {
  const { t } = useLanguage();
  const { cryptoData, newsData, loading, error, refreshData } = useCryptoData();
  const { getPortfolioData, isWalletConnected } = useWalletData();
  const [showAllCrypto, setShowAllCrypto] = useState(false); // 默认折叠状态
  const [searchQuery, setSearchQuery] = useState("");
  
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
        {/* Professional Header Design - Mobile Optimized */}
        <div className="relative">
          {/* Background with enhanced glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-950/80 to-slate-900/90 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/5 shadow-2xl"></div>
          
          {/* Content */}
          <div className="relative px-4 sm:px-10 py-4 sm:py-8">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              {/* Left Section - Brand */}
              <div className="flex items-center gap-4 sm:gap-8">
                <div className="space-y-1 sm:space-y-2">
                  <h1 className="text-3xl sm:text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 tracking-tight">
                    Meta BrainX
                  </h1>
                  <p className="text-sm sm:text-lg text-slate-300 font-inter font-medium tracking-wide">
                    {t('app.subtitle')}
                  </p>
                </div>
              </div>
              
              {/* Center Section - Status Indicator - Mobile: Full Width */}
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <div className="relative">
                  <Badge variant="outline" className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 border-green-500/20 backdrop-blur-sm hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full mr-2 sm:mr-3 animate-pulse shadow-lg shadow-green-400/50"></div>
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    {t('status.live')}
                  </Badge>
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-md -z-10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Right Section - User Controls - Professional Cards Layout */}
              <div className="flex items-center gap-3">
                <UserProfile />
                <WalletConnector />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
          
          {/* Subtle bottom accent */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-sm"></div>
        </div>

        {/* AI Opportunity Alert */}
        <AIOpportunityAlert />

        {/* Portfolio Overview with Dynamic Data Source */}
        <OptimizedPortfolioCards portfolioData={portfolioData} />

        {/* 币安API配置 */}
        <BinanceAPIConfig />

        {/* Crypto Cards Grid */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              {t('market.overview')}
              {loading && <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />}
            </h2>
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

        {/* Professional Crypto Analysis Interface */}
        <ProfessionalCryptoAnalysis />

        {/* AI Advisors Section - Three Column Grid */}
        <div className="mb-6">
          <AIAdvisorsGrid cryptoData={cryptoData} newsData={newsData} />
        </div>

        {/* Upcoming Advisors Section */}
        <UpcomingAdvisors />
      </div>
      </div>
    </div>
  );
};