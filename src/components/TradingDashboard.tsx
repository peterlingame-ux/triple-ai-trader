import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { TechnicalAnalysis } from "./TechnicalAnalysis";
import { NewsAnalysis } from "./NewsAnalysis";
import { MarketAnalysis } from "./MarketAnalysis";
import { ProfessionalChart } from "./ProfessionalChart";
import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData, filterCryptoData } from "@/hooks/useCryptoData";
import { useWalletData } from "@/hooks/useWalletData";
import { CryptoSearch } from "./CryptoSearch";
import { BarChart3, Brain, DollarSign, TrendingUp, Zap, RefreshCw, Wallet, Bot, Activity, Target, Globe, Newspaper } from "lucide-react";

export const TradingDashboard = () => {
  const { t } = useLanguage();
  const { cryptoData, newsData, loading, error, refreshData } = useCryptoData();
  const { getPortfolioData, isWalletConnected } = useWalletData();
  const [showAllCrypto, setShowAllCrypto] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");
  
  // Filter crypto data based on search query
  const filteredCryptoData = filterCryptoData(cryptoData, searchQuery);

  // Get portfolio data from either wallet or auto-trader
  const portfolioData = getPortfolioData();
  const { totalValue, dailyChange, activeTrades, source } = portfolioData;

  // Get selected crypto data for detailed analysis
  const selectedCryptoData = cryptoData.find(crypto => crypto.symbol === selectedCrypto) || cryptoData[0];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleCryptoSelect = (symbol: string) => {
    setSelectedCrypto(symbol);
  };

  // AI advisors data
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
      reasoning: "My investment philosophy centers on buying wonderful businesses at fair prices and holding them forever. In crypto, I see Bitcoin as digital gold with scarcity value, while Ethereum represents the infrastructure of the digital economy.",
      avatar: "/lovable-uploads/ed9162db-2b3e-40ac-8c54-4c00f966b7a7.png",
      isSpecial: true
    },
    {
      name: "Bill Gates",
      specialty: "Technology Innovation & Philanthropic Investment",
      confidence: 92,
      recommendation: "BUY ETH, HOLD MATIC",
      reasoning: "Blockchain represents the next fundamental shift. Ethereum's smart contract platform mirrors what we built with Windows - a foundation for others to innovate upon.",
      avatar: "/lovable-uploads/11d23e11-5de1-45f8-9894-919cd96033d1.png",
      isSpecial: true
    }
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center animate-pulse">
          <span className="text-blue-300 text-xl font-bold">₿</span>
        </div>
        <div className="absolute top-32 right-20 w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center animate-bounce">
          <span className="text-emerald-300 text-lg font-bold">Ξ</span>
        </div>
        <div className="absolute bottom-1/3 right-10 w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center animate-bounce delay-500">
          <span className="text-purple-300 text-xl font-bold">$</span>
        </div>
        <div className="absolute bottom-20 left-1/5 w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center animate-pulse delay-700">
          <span className="text-indigo-300 text-lg font-bold">⟠</span>
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Professional Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 tracking-wide">
                  SUPREME BRAIN
                </h1>
                <Badge variant="outline" className="px-3 py-1.5 bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                  <Activity className="w-3 h-3 mr-1" />
                  Advanced Trading Analytics
                </Badge>
              </div>
              <p className="text-slate-300 font-medium text-lg max-w-2xl">
                专业级交易分析平台 · AI驱动 · 实时数据 · 智能决策
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <WalletConnector />
              <LanguageSwitcher />
              <Button 
                variant="outline" 
                onClick={refreshData}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-600/30"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                刷新数据
              </Button>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-r from-slate-800/50 to-blue-900/30 border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  {source === 'wallet' ? (
                    <Wallet className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Bot className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-400">
                      {source === 'wallet' ? '真实资产' : 'AI模拟'}
                    </p>
                    {source === 'autotrader' && (
                      <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                        虚拟
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-blue-400 font-mono">
                    ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-slate-800/50 to-emerald-900/30 border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">24H 收益</p>
                  <p className={`text-2xl font-bold font-mono ${dailyChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {dailyChange >= 0 ? '+' : ''}${dailyChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-slate-800/50 to-purple-900/30 border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">活跃交易</p>
                  <p className="text-2xl font-bold text-purple-400 font-mono">{activeTrades}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Professional Analysis Interface */}
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 p-1">
              <TabsTrigger value="analysis" className="text-sm font-medium">
                <BarChart3 className="w-4 h-4 mr-2" />
                专业分析
              </TabsTrigger>
              <TabsTrigger value="market" className="text-sm font-medium">
                <Globe className="w-4 h-4 mr-2" />
                市场行情
              </TabsTrigger>
              <TabsTrigger value="news" className="text-sm font-medium">
                <Newspaper className="w-4 h-4 mr-2" />
                新闻解读
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-sm font-medium">
                <Brain className="w-4 h-4 mr-2" />
                AI顾问
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                交易工具
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Chart section - spans 2 columns on xl screens */}
                <div className="xl:col-span-2">
                  {selectedCryptoData && (
                    <ProfessionalChart
                      symbol={selectedCryptoData.symbol}
                      price={selectedCryptoData.price}
                      change24h={selectedCryptoData.change24h}
                      changePercent24h={selectedCryptoData.changePercent24h}
                    />
                  )}
                </div>
                
                {/* Technical Analysis */}
                <div>
                  {selectedCryptoData && (
                    <TechnicalAnalysis
                      symbol={selectedCryptoData.symbol}
                      price={selectedCryptoData.price}
                      data={{
                        rsi: selectedCryptoData.rsi,
                        ma20: selectedCryptoData.ma20,
                        ma50: selectedCryptoData.ma50,
                        support: selectedCryptoData.support,
                        resistance: selectedCryptoData.resistance,
                        high24h: selectedCryptoData.high24h,
                        low24h: selectedCryptoData.low24h,
                        ath: selectedCryptoData.ath,
                        atl: selectedCryptoData.atl,
                      }}
                    />
                  )}
                </div>
              </div>
              
              {/* Crypto selector */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  选择分析币种
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {cryptoData.slice(0, 12).map((crypto) => (
                    <Button
                      key={crypto.symbol}
                      variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
                      onClick={() => handleCryptoSelect(crypto.symbol)}
                      className={`h-16 flex-col gap-1 ${
                        selectedCrypto === crypto.symbol
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-slate-800/30 hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="font-bold text-sm">{crypto.symbol}</span>
                      <span className={`text-xs ${crypto.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.changePercent24h >= 0 ? '+' : ''}{crypto.changePercent24h.toFixed(1)}%
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="market" className="space-y-6 mt-6">
              <MarketAnalysis cryptoData={cryptoData} />
              
              {/* Crypto cards grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    实时行情
                  </h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllCrypto(!showAllCrypto)}
                    className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-600/30"
                  >
                    {showAllCrypto ? '收起' : '查看全部'}
                    <BarChart3 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <CryptoSearch
                  onSearch={handleSearch}
                  onClearSearch={handleClearSearch}
                  searchQuery={searchQuery}
                  totalCryptos={cryptoData.length}
                  filteredCount={filteredCryptoData.length}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {(showAllCrypto ? filteredCryptoData : filteredCryptoData.slice(0, 9)).map((crypto) => (
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
              </div>
            </TabsContent>
            
            <TabsContent value="news" className="space-y-6 mt-6">
              <NewsAnalysis news={newsData} />
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  AI投资顾问团队
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
              
              <UpcomingAdvisors />
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-400">AI自动交易</h3>
                      <p className="text-xs text-slate-400">智能算法交易</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    基于AI算法的自动化交易系统，24/7监控市场机会
                  </p>
                  <AutoTrader />
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-emerald-900/30 to-blue-900/30 border-emerald-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-emerald-400">AI智能助手</h3>
                      <p className="text-xs text-slate-400">专业市场分析</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    与AI助手交流，获取实时市场洞察和投资建议
                  </p>
                  <AICommunicator cryptoData={cryptoData} newsData={newsData} />
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-400">风险管理</h3>
                      <p className="text-xs text-slate-400">智能风控系统</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-4">
                    AI驱动的风险评估和资产配置优化建议
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Target className="w-4 h-4 mr-2" />
                    风险分析
                  </Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};