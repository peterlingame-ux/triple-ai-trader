import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, Send, Bot, TrendingUp, TrendingDown, BarChart3, Activity, 
  DollarSign, Clock, Globe, LineChart, Zap, AlertTriangle, Search, Brain,
  Lightbulb, Eye, ChevronRight, PieChart, Calendar, Shield, Target, X
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useToast } from "@/hooks/use-toast";

interface CryptoAnalytics {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  dominance: number;
  rsi: number;
  ma20: number;
  ma50: number;
  support: number;
  resistance: number;
  high24h: number;
  low24h: number;
  ath: number;
  atl: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
}

interface NewsItem {
  title: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
  source: { name: string } | string;
  time?: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface AICommunicatorProps {
  cryptoData?: CryptoAnalytics[];
  newsData?: NewsItem[];
}

export const AICommunicator = ({ cryptoData = [], newsData = [] }: AICommunicatorProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { cryptoData: liveCryptoData } = useCryptoData();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState<string>("1D");
  const chartRef = useRef<HTMLDivElement>(null);

  // 预设的热门货币标签
  const popularCryptos = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'AVAX', 'MATIC'];

  // 使用实时数据或回退到模拟数据
  const activeCryptoData = liveCryptoData.length > 0 ? liveCryptoData : (cryptoData.length > 0 ? cryptoData.slice(0, 8) : [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 43250,
      change24h: 1245.50,
      changePercent24h: 2.97,
      volume24h: 18500000000,
      marketCap: 847000000000,
      dominance: 51.2,
      rsi: 67.3,
      ma20: 42100,
      ma50: 39800,
      support: 41500,
      resistance: 45000,
      high24h: 44200,
      low24h: 41800,
      ath: 69000,
      atl: 0.06,
      circulatingSupply: 19600000,
      totalSupply: 19600000,
      maxSupply: 21000000
    },
    {
      symbol: "ETH", 
      name: "Ethereum",
      price: 4724.70,
      change24h: 3.65,
      changePercent24h: 0.08,
      volume24h: 18735000000,
      marketCap: 308000000000,
      dominance: 18.6,
      rsi: 45.2,
      ma20: 4650,
      ma50: 4580,
      support: 4620,
      resistance: 4780,
      high24h: 4760,
      low24h: 4620,
      ath: 4878,
      atl: 0.43,
      circulatingSupply: 120000000,
      totalSupply: 120000000,
      maxSupply: 0
    },
    {
      symbol: "SOL",
      name: "Solana", 
      price: 98.75,
      change24h: 3.42,
      changePercent24h: 3.59,
      volume24h: 2100000000,
      marketCap: 43500000000,
      dominance: 2.6,
      rsi: 72.1,
      ma20: 95.20,
      ma50: 89.50,
      support: 92.00,
      resistance: 105.00,
      high24h: 102.34,
      low24h: 94.12,
      ath: 259.96,
      atl: 0.5,
      circulatingSupply: 440000000,
      totalSupply: 550000000,
      maxSupply: 0
    }
  ]);

  // Use passed news data or fallback to mock data
  const activeNewsData = newsData.length > 0 ? newsData : [
    {
      title: "Bitcoin ETF Trading Volume Hits Record $3.2B Daily",
      description: "Institutional adoption reaches new heights",
      url: "#",
      urlToImage: "",
      publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      source: { name: "CoinDesk Pro" },
      sentiment: "bullish" as const,
      impact: "high" as const
    },
    {
      title: "Ethereum Shanghai Upgrade Successfully Deployed",
      description: "Network improvements show positive results",
      url: "#",
      urlToImage: "",
      publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      source: { name: "The Block" },
      sentiment: "bullish" as const,
      impact: "high" as const
    },
    {
      title: "Major Exchange Reports 200% Increase in DeFi Volume",
      description: "Decentralized finance continues rapid growth",
      url: "#",
      urlToImage: "",
      publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      source: { name: "DeFiPulse" },
      sentiment: "bullish" as const,
      impact: "medium" as const
    }
  ];


  // Mock chart data using active crypto data
  const generateChartData = (symbol: string, timeframe: string): ChartData[] => {
    const basePrice = activeCryptoData.find(c => c.symbol === symbol)?.price || 40000;
    const data: ChartData[] = [];
    const periods = timeframe === "1H" ? 24 : timeframe === "1D" ? 30 : timeframe === "1W" ? 7 : 12;
    
    for (let i = 0; i < periods; i++) {
      const volatility = 0.02;
      const trend = Math.sin(i * 0.1) * 0.01;
      const random = (Math.random() - 0.5) * volatility;
      const close = basePrice * (1 + trend + random);
      const open = close * (1 + (Math.random() - 0.5) * 0.01);
      const high = Math.max(open, close) * (1 + Math.random() * 0.015);
      const low = Math.min(open, close) * (1 - Math.random() * 0.015);
      
      data.push({
        time: new Date(Date.now() - (periods - i) * 3600000).toISOString(),
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000000
      });
    }
    return data;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newConversation = [...conversation, { role: 'user' as const, content: message }];
    const aiResponse = generateCombinedResponse(message);
    newConversation.push({ role: 'ai' as const, content: aiResponse });
    
    setConversation(newConversation);
    setMessage("");
    
    toast({
      title: "Message Sent",
      description: "AI advisors are analyzing market data...",
    });
  };

  const generateCombinedResponse = (userMessage: string) => {
    const currentCrypto = activeCryptoData.find(c => c.symbol === selectedCrypto);
    const responses = [
      `基于${currentCrypto?.name || selectedCrypto}当前的技术分析，价格为$${currentCrypto?.price.toFixed(4)}，24小时变动${currentCrypto?.changePercent24h.toFixed(2)}%。从图表形态来看，${currentCrypto?.changePercent24h > 0 ? '呈现上涨趋势，可以考虑适度建仓' : '存在下跌压力，建议控制风险'}。`,
      `我分析了${currentCrypto?.name}的技术指标，RSI显示${currentCrypto?.rsi > 70 ? '超买状态，注意回调风险' : currentCrypto?.rsi < 30 ? '超卖区域，可能存在反弹机会' : '中性区间，可以观望'}。当前支撑位在$${currentCrypto?.support?.toFixed(4)}，阻力位在$${currentCrypto?.resistance?.toFixed(4)}。`,
      `从市场数据来看，${currentCrypto?.name}市值排名较高，24小时最高价$${currentCrypto?.high24h?.toFixed(4)}，最低价$${currentCrypto?.low24h?.toFixed(4)}。建议关注成交量变化和市场情绪。`,
      `${currentCrypto?.name}的技术面分析显示，MA20线在$${currentCrypto?.ma20?.toFixed(4)}，MA50线在$${currentCrypto?.ma50?.toFixed(4)}。价格${currentCrypto?.price > (currentCrypto?.ma20 || 0) ? '位于均线上方，技术面偏强' : '跌破均线，需要谨慎'}。`,
      `基于当前市场环境，${currentCrypto?.name}的波动率较高，流动性良好。建议采用分批建仓的策略，设置合理的止损止盈位。`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getSelectedCryptoData = () => {
    return activeCryptoData.find(c => c.symbol === selectedCrypto) || activeCryptoData[0];
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;  
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercent = (num: number): string => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  // 搜索过滤功能
  const filteredCryptos = activeCryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-orbitron tracking-wide px-6 py-2">
          <MessageSquare className="w-4 h-4 mr-2" />
          {t('ai.communicate')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[1200px] bg-slate-900 border-slate-700 max-h-[95vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-2 font-orbitron text-xl">
              <Bot className="w-6 h-6 text-blue-400" />
              {t('language') === 'zh' ? 'SUPREME BRAIN - 高级交易分析' : 'SUPREME BRAIN - Advanced Trading Analytics'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - AI Assistant */}
          <div className="w-80 bg-slate-800/30 border-r border-slate-700 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI 分析师</h3>
                <p className="text-slate-400 text-sm">Ask for analysis on selected crypto with live market data</p>
              </div>
            </div>

            {/* Crypto Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder={t('language') === 'zh' ? '搜索加密货币...' : 'Search cryptocurrencies...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white text-sm"
                />
              </div>
              
              {searchTerm && (
                <ScrollArea className="h-32 mt-2">
                  <div className="space-y-1">
                    {filteredCryptos.map((crypto) => (
                      <Card 
                        key={crypto.symbol}
                        className="p-2 bg-slate-700/50 border-slate-600 hover:border-slate-500 cursor-pointer transition-all"
                        onClick={() => {
                          setSelectedCrypto(crypto.symbol);
                          setSearchTerm('');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-medium">{crypto.name}</p>
                            <p className="text-slate-400 text-xs">{crypto.symbol}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-sm">${crypto.price.toFixed(4)}</p>
                            <p className={`text-xs ${crypto.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatPercent(crypto.changePercent24h)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
            </div>

            {/* AI Chat Messages */}
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-3">
                {conversation.length === 0 && (
                  <div className="text-slate-400 text-sm text-center py-8">
                    <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>问我关于{selectedCrypto}的任何技术分析问题</p>
                  </div>
                )}
                {conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-slate-200'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* AI Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="询问技术分析..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-slate-700 border-slate-600 text-white text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {/* Crypto Selection Tabs */}
            <div className="flex items-center gap-2 mb-6">
              {popularCryptos.map((symbol) => {
                const crypto = activeCryptoData.find(c => c.symbol === symbol);
                if (!crypto) return null;
                
                return (
                  <Button
                    key={symbol}
                    variant={selectedCrypto === symbol ? "default" : "outline"}
                    onClick={() => setSelectedCrypto(symbol)}
                    className={`${
                      selectedCrypto === symbol
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-800/50 text-slate-300 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    {symbol}
                  </Button>
                );
              })}
            </div>

            {/* Selected Crypto Header */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <Card className="p-4 bg-slate-800/30 border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {selectedCrypto}
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold">{selectedCrypto}</h2>
                    <p className="text-slate-400">{activeCryptoData.find(c => c.symbol === selectedCrypto)?.name}</p>
                  </div>
                  <Badge className={`ml-auto ${
                    (activeCryptoData.find(c => c.symbol === selectedCrypto)?.changePercent24h || 0) >= 0 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {formatPercent(activeCryptoData.find(c => c.symbol === selectedCrypto)?.changePercent24h || 0)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-white text-2xl font-bold">${(activeCryptoData.find(c => c.symbol === selectedCrypto)?.price || 0).toFixed(6)}</p>
                  <p className={`text-sm ${
                    (activeCryptoData.find(c => c.symbol === selectedCrypto)?.change24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(activeCryptoData.find(c => c.symbol === selectedCrypto)?.change24h || 0) >= 0 ? '+' : ''}${(activeCryptoData.find(c => c.symbol === selectedCrypto)?.change24h || 0).toFixed(2)}
                  </p>
                </div>
              </Card>

              <Card className="p-4 bg-slate-800/30 border-slate-700">
                <h3 className="text-slate-400 text-sm mb-2">Price Chart</h3>
                <div className="flex items-center gap-2 mb-4">
                  {['1H', '1D', '1W', '1M'].map((period) => (
                    <Button
                      key={period}
                      variant="ghost"
                      size="sm"
                      className={`text-xs ${period === timeframe ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                      onClick={() => setTimeframe(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
                <div className="h-16 bg-slate-700/50 rounded flex items-center justify-center">
                  <LineChart className="w-8 h-8 text-slate-500" />
                  <span className="text-slate-500 text-sm ml-2">Interactive Chart ({timeframe})</span>
                </div>
                <p className="text-slate-400 text-xs mt-2">Candlestick data for {selectedCrypto}</p>
              </Card>

              <Card className="p-4 bg-slate-800/30 border-slate-700">
                <h3 className="text-slate-400 text-sm mb-3">Technical Indicators</h3>
                <div className="space-y-2">
                  {['rsi', 'ma20', 'ma50', 'support', 'resistance', 'high24h', 'low24h', 'ath', 'atl'].map((indicator) => {
                    const crypto = activeCryptoData.find(c => c.symbol === selectedCrypto);
                    const value = crypto?.[indicator as keyof typeof crypto] || 0;
                    return (
                      <div key={indicator} className="flex justify-between text-sm">
                        <span className="text-slate-400">{indicator.toUpperCase()}</span>
                        <span className={`text-white ${
                          indicator === 'support' ? 'text-green-400' : 
                          indicator === 'resistance' ? 'text-red-400' : 
                          indicator === 'ath' ? 'text-yellow-400' : 
                          indicator === 'atl' ? 'text-blue-400' : 'text-white'
                        }`}>
                          {typeof value === 'number' ? (value < 1 ? value.toFixed(8) : value.toFixed(2)) : value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Market Data Grid */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              {[
                { label: 'Market Cap', value: formatNumber(activeCryptoData.find(c => c.symbol === selectedCrypto)?.marketCap || 74700000000) },
                { label: '24h Volume', value: formatNumber(activeCryptoData.find(c => c.symbol === selectedCrypto)?.volume24h || 9700000000) },
                { label: 'Dominance', value: `${(activeCryptoData.find(c => c.symbol === selectedCrypto)?.dominance || 4.88).toFixed(2)}%` },
                { label: 'Circulating Supply', value: `${((activeCryptoData.find(c => c.symbol === selectedCrypto)?.circulatingSupply || 555800000) / 1000000).toFixed(1)}M` },
                { label: 'Max Supply', value: `${((activeCryptoData.find(c => c.symbol === selectedCrypto)?.maxSupply || 21000000) / 1000000).toFixed(1)}M` },
                { label: 'Supply Ratio', value: '153.8%' }
              ].map((item, index) => (
                <Card key={index} className="p-3 bg-slate-800/30 border-slate-700 text-center">
                  <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                  <p className="text-white font-semibold text-sm">{item.value}</p>
                </Card>
              ))}
            </div>

            {/* AI Chat Input at Bottom */}
            <Card className="p-4 bg-slate-800/30 border-slate-700">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Ask about technical analysis..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-slate-700 border-slate-600 text-white"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};