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
import { AICommunicator } from "./AICommunicator";
import { AutoTrader } from "./AutoTrader";
import { UpcomingAdvisors } from "./UpcomingAdvisors";
import { AIOpportunityAlert } from "./AIOpportunityAlert";
import { UserProfile } from "./UserProfile";
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
    specialty: "elon.specialty",
    confidence: 94,
    recommendation: "BUY DOGE, BTC",
    reasoning: "mars.missions.funding", // 使用翻译键
    avatar: "/lovable-uploads/9cc92493-5e50-470d-9543-d2fe07d350f6.png",
    isSpecial: true
  },
  {
    name: "Warren Buffett",
    specialty: "warren.specialty",
    confidence: 88,
    recommendation: "HOLD BTC, BUY ETH",
    reasoning: "warren.investment.philosophy", // 使用翻译键
    avatar: "/lovable-uploads/ed9162db-2b3e-40ac-8c54-4c00f966b7a7.png",
    isSpecial: true
  },
  {
    name: "Bill Gates",
    specialty: "bill.specialty",
    confidence: 92,
    recommendation: "BUY ETH, HOLD MATIC",
    reasoning: "bill.blockchain.evolution", // 使用翻译键
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
      {/* Simplified background elements for better performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Professional Header Design */}
        <div className="relative">
          {/* Background with enhanced glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-950/80 to-slate-900/90 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-2xl"></div>
          
          {/* Content */}
          <div className="relative px-10 py-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Section - Brand */}
              <div className="flex items-center gap-8">
                <div className="space-y-2">
                  <h1 className="text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 tracking-tight">
                    Meta BrainX
                  </h1>
                  <p className="text-lg text-slate-300 font-inter font-medium tracking-wide">
                    {t('app.subtitle')}
                  </p>
                </div>
              </div>
              
              {/* Center Section - Status Indicator */}
              <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-lg">
                  <UserProfile />
                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                  <WalletConnector />
                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle bottom accent */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-sm"></div>
        </div>

        {/* AI Opportunity Alert */}
        <AIOpportunityAlert />

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
                      {t('wallet.ai_virtual_badge')}
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
              <AICommunicator cryptoData={cryptoData} newsData={newsData} />
              <AutoTrader />
            </div>
          </div>
          <div className="space-y-6">
            {aiAdvisors.map((advisor, index) => (
              <div key={index}>
                {advisor.name === 'Elon Musk' && (
                  <ElonProfile
                    name={advisor.name}
                    specialty={t(advisor.specialty)}
                    confidence={advisor.confidence}
                    recommendation={advisor.recommendation}
                    reasoning={t('elon.current.analysis')}
                    avatar={advisor.avatar}
                    isSpecial={advisor.isSpecial}
                  />
                )}
                {advisor.name === 'Warren Buffett' && (
                  <WarrenProfile
                    name={advisor.name}
                    specialty={t(advisor.specialty)}
                    confidence={advisor.confidence}
                    recommendation={advisor.recommendation}
                    reasoning={t('warren.current.analysis')}
                    avatar={advisor.avatar}
                    isSpecial={advisor.isSpecial}
                  />
                )}
                {advisor.name === 'Bill Gates' && (
                  <BillProfile
                    name={advisor.name}
                    specialty={t(advisor.specialty)}
                    confidence={advisor.confidence}
                    recommendation={advisor.recommendation}
                    reasoning={t('bill.current.analysis')}
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