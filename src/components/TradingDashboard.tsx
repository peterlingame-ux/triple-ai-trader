import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CryptoCard } from "./CryptoCard";
import { AIAdvisor } from "./AIAdvisor";
import { ElonProfile } from "./ElonProfile";
import { WarrenProfile } from "./WarrenProfile";
import { BillProfile } from "./BillProfile";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WalletConnector } from "./WalletConnector";

import { AutoTrader } from "./AutoTrader";
import { CryptoAnalysisDialog } from "./CryptoAnalysisDialog";
import { UpcomingAdvisors } from "./UpcomingAdvisors";
import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData, filterCryptoData } from "@/hooks/useCryptoData";
import { useWalletData } from "@/hooks/useWalletData";
import { CryptoSearch } from "./CryptoSearch";
import { BarChart3, Brain, DollarSign, TrendingUp, Zap, RefreshCw, Wallet, Bot } from "lucide-react";

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

// Mock AI advisors data
const aiAdvisors = [
  {
    name: "Elon Musk",
    specialty: "Visionary Tech & Market Disruption",
    confidence: 94,
    recommendation: "BUY DOGE, BTC",
    reasoning: "Mars missions need funding, and crypto is the future of interplanetary commerce. Dogecoin to the moon! Tesla will accept more crypto payments. The simulation theory suggests all investments are digital anyway.",
    avatar: "/lovable-uploads/9cc92493-5e50-470d-9543-d2fe07d350f6.png",
    isSpecial: true
  },
  {
    name: "Warren Buffett",
    specialty: "Value Investing & Long-term Wealth Building",
    confidence: 88,
    recommendation: "HOLD BTC, BUY ETH",
    reasoning: "My investment philosophy centers on buying wonderful businesses at fair prices and holding them forever. In crypto, I see Bitcoin as digital gold with scarcity value, while Ethereum represents the infrastructure of the digital economy. Remember: 'Time in the market beats timing the market.' Focus on intrinsic value, not market volatility. The best investment is in yourself and technologies that create lasting value.",
    avatar: "/lovable-uploads/ed9162db-2b3e-40ac-8c54-4c00f966b7a7.png",
    isSpecial: true
  },
  {
    name: "Bill Gates",
    specialty: "Technology Innovation & Philanthropic Investment",
    confidence: 92,
    recommendation: "BUY ETH, HOLD MATIC",
    reasoning: "As someone who has witnessed the evolution of technology from personal computers to the internet, I believe blockchain represents the next fundamental shift. Ethereum's smart contract platform mirrors what we built with Windows - a foundation for others to innovate upon. My investment philosophy focuses on technologies that can solve humanity's greatest challenges. Cryptocurrency and blockchain can democratize financial services globally, especially in developing nations. However, we must ensure these technologies serve the greater good, not just speculation.",
    avatar: "/lovable-uploads/11d23e11-5de1-45f8-9894-919cd96033d1.png",
    isSpecial: true
  }
];

export const TradingDashboard = () => {
  const { t } = useLanguage();
  const { cryptoData, newsData, loading, error, refreshData } = useCryptoData();
  const { getPortfolioData, isWalletConnected } = useWalletData();
  const [showAllCrypto, setShowAllCrypto] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter crypto data based on search query
  const filteredCryptoData = filterCryptoData(cryptoData, searchQuery);

  // Get portfolio data from either wallet or auto-trader
  const portfolioData = getPortfolioData();
  const { totalValue, dailyChange, activeTrades, source } = portfolioData;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen relative p-6 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated crypto symbols background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
          <span className="text-blue-300 text-xl font-bold">₿</span>
        </div>
        <div className="absolute top-32 right-20 w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center animate-bounce">
          <span className="text-blue-200 text-lg font-bold">Ξ</span>
        </div>
        <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center animate-pulse delay-300">
          <span className="text-blue-300 text-sm font-bold">◆</span>
        </div>
        <div className="absolute bottom-1/3 right-10 w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center animate-bounce delay-500">
          <span className="text-blue-200 text-xl font-bold">$</span>
        </div>
        <div className="absolute bottom-20 left-1/5 w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center animate-pulse delay-700">
          <span className="text-blue-300 text-lg font-bold">⟠</span>
        </div>
        <div className="absolute top-1/2 right-1/3 w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center animate-bounce delay-1000">
          <span className="text-blue-200 text-xl font-bold">◇</span>
        </div>
        <div className="absolute top-3/4 left-10 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse delay-1200">
          <span className="text-blue-300 text-sm font-bold">○</span>
        </div>
        <div className="absolute bottom-10 right-1/2 w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center animate-bounce delay-1500">
          <span className="text-blue-200 text-lg font-bold">⬟</span>
        </div>
      </div>
      
      {/* Main content with backdrop blur */}
      <div className="relative z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section with Analysis Button */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 tracking-wide">
                {t('app.title')}
              </h1>
              <Badge variant="outline" className="px-3 py-1.5 bg-success/10 text-success border-success/30 animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                {t('status.live')}
              </Badge>
            </div>
            <p className="text-amber-200/80 font-inter font-medium text-lg tracking-wide max-w-2xl mx-auto mb-6">
              {t('app.subtitle')}
            </p>
            <CryptoAnalysisDialog />
          </div>
        </div>

        {/* Enhanced Professional Header */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3">
            <WalletConnector />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Portfolio Overview with Dynamic Data Source */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-crypto border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                {source === 'wallet' ? (
                  <Wallet className="w-6 h-6 text-accent" />
                ) : (
                  <Bot className="w-6 h-6 text-accent" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground font-inter">
                    {source === 'wallet' ? t('wallet.real') : t('wallet.virtual')}
                  </p>
                  {source === 'autotrader' && (
                    <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                      AI模拟
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-accent font-mono tracking-wider">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-crypto border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground font-inter">{t('portfolio.change')}</p>
                  {source === 'wallet' && (
                    <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                      实时
                    </Badge>
                  )}
                </div>
                <p className={`text-2xl font-bold font-mono tracking-wider ${dailyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {dailyChange >= 0 ? '+' : ''}${dailyChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-crypto border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-inter">
                  {source === 'wallet' ? '持仓交易' : t('portfolio.trades')}
                </p>
                <p className="text-2xl font-bold text-foreground font-mono tracking-wider">{activeTrades}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Crypto Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
              <BarChart3 className="w-6 h-6" />
              {t('market.overview')}
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
            </h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={refreshData}
                size="sm"
                className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/30"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {t('button.refresh')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAllCrypto(!showAllCrypto)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6"
              >
                {showAllCrypto ? t('button.show_top') : t('button.all_categories')}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAllCrypto ? filteredCryptoData : filteredCryptoData.slice(0, 6)).map((crypto) => (
              <CryptoCard
                key={crypto.symbol}
                symbol={crypto.symbol}
                name={crypto.name}
                price={crypto.price}
                change={crypto.change24h}
                changePercent={crypto.changePercent24h}
                image={crypto.image}
                volume={crypto.volume24h}
                marketCap={crypto.marketCap}
              />
            ))}
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

        {/* AI Advisors Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
              <Brain className="w-6 h-6" />
              {t('ai.advisors')}
            </h2>
            <div className="flex items-center gap-2">
              <AutoTrader />
            </div>
          </div>
          <div className="space-y-6">
            {aiAdvisors.map((advisor, index) => (
              <div key={index}>
                {advisor.name === 'Elon Musk' && (
                  <ElonProfile
                    name={advisor.name}
                    specialty={advisor.specialty}
                    confidence={advisor.confidence}
                    recommendation={advisor.recommendation}
                    reasoning={advisor.reasoning}
                    avatar={advisor.avatar}
                    isSpecial={advisor.isSpecial}
                  />
                )}
                {advisor.name === 'Warren Buffett' && (
                  <WarrenProfile
                    name={advisor.name}
                    specialty={advisor.specialty}
                    confidence={advisor.confidence}
                    recommendation={advisor.recommendation}
                    reasoning={advisor.reasoning}
                    avatar={advisor.avatar}
                    isSpecial={advisor.isSpecial}
                  />
                )}
                {advisor.name === 'Bill Gates' && (
                  <BillProfile
                    name={advisor.name}
                    specialty={advisor.specialty}
                    confidence={advisor.confidence}
                    recommendation={advisor.recommendation}
                    reasoning={advisor.reasoning}
                    avatar={advisor.avatar}
                    isSpecial={advisor.isSpecial}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Advisors Section */}
        <UpcomingAdvisors />
      </div>
      </div>
    </div>
  );
};