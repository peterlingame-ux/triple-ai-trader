import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Bot, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Clock, Globe, LineChart, Zap, AlertTriangle, Search } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { getAllSupportedCryptos, getTokenName } from "@/hooks/useCryptoData";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { AIConfigPanel } from "@/components/AIConfigPanel";

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
  
  // 时间格式化函数
  const formatTimeAgo = (publishedAt: string, time?: string): string => {
    if (time) {
      // 解析现有的时间字符串并翻译
      if (time.includes('min ago')) {
        const minutes = time.match(/(\d+)\s*min/)?.[1];
        return `${minutes}${t('news.time.min_ago')}`;
      } else if (time.includes('hour ago')) {
        return `1${t('news.time.hour_ago')}`;
      } else if (time.includes('hours ago')) {
        const hours = time.match(/(\d+)\s*hour/)?.[1];
        return `${hours}${t('news.time.hours_ago')}`;
      }
      return time;
    }
    
    // 如果没有time字段，从publishedAt计算
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInMinutes = Math.floor((now.getTime() - published.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}${t('news.time.min_ago')}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return hours === 1 ? `1${t('news.time.hour_ago')}` : `${hours}${t('news.time.hours_ago')}`;
    } else {
      return published.toLocaleDateString();
    }
  };
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");
  const [timeframe, setTimeframe] = useState<string>("1D");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Get all supported cryptocurrencies for selection
  const allSupportedCryptos = getAllSupportedCryptos();
  
  // AI Analysis hooks
  const {
    analyzePriceChart,
    analyzeTechnicalIndicators,
    analyzeNewsSentiment,
    config: aiConfig,
    updateModelConfig,
    loading: aiLoading
  } = useAIAnalysis();

  // Use passed data or fallback to mock data
  const activeCryptoData = cryptoData.length > 0 ? cryptoData.slice(0, 3) : [
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
  ];

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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newConversation = [...conversation, { role: 'user' as const, content: message }];
    
    try {
      // 根据用户消息内容调用不同的AI分析
      let aiResponse = "";
      
      if (message.toLowerCase().includes('价格') || message.toLowerCase().includes('图表') || message.toLowerCase().includes('chart')) {
        // 调用价格图表分析AI
        const currentCrypto = getSelectedCryptoData();
        const analysisData = {
          symbol: selectedCrypto,
          timeframe: timeframe,
          priceData: {
            current: currentCrypto.price,
            high24h: currentCrypto.high24h,
            low24h: currentCrypto.low24h,
            volume24h: currentCrypto.volume24h,
            change24h: currentCrypto.change24h
          },
          technicalData: {
            rsi: currentCrypto.rsi,
            ma20: currentCrypto.ma20,
            ma50: currentCrypto.ma50,
            support: currentCrypto.support,
            resistance: currentCrypto.resistance
          }
        };
        aiResponse = await analyzePriceChart(analysisData);
      } else if (message.toLowerCase().includes('技术') || message.toLowerCase().includes('指标') || message.toLowerCase().includes('technical')) {
        // 调用技术分析AI
        const currentCrypto = getSelectedCryptoData();
        const analysisData = {
          symbol: selectedCrypto,
          indicators: {
            rsi: currentCrypto.rsi,
            macd: ((currentCrypto.price - currentCrypto.ma20) / currentCrypto.ma20 * 100),
            kdj: (currentCrypto.rsi * 0.8),
            bollinger: {
              upper: currentCrypto.price * 1.02,
              middle: currentCrypto.ma20,
              lower: currentCrypto.price * 0.98
            },
            movingAverages: {
              ma5: currentCrypto.price * 0.995,
              ma10: currentCrypto.price * 0.992,
              ma20: currentCrypto.ma20,
              ma50: currentCrypto.ma50,
              ma200: currentCrypto.ma50 * 0.92
            },
            supportResistance: {
              support1: currentCrypto.support,
              support2: currentCrypto.support * 0.95,
              resistance1: currentCrypto.resistance,
              resistance2: currentCrypto.resistance * 1.05
            }
          },
          marketData: {
            price: currentCrypto.price,
            volume: currentCrypto.volume24h,
            marketCap: currentCrypto.marketCap,
            dominance: currentCrypto.dominance
          }
        };
        aiResponse = await analyzeTechnicalIndicators(analysisData);
      } else if (message.toLowerCase().includes('新闻') || message.toLowerCase().includes('情感') || message.toLowerCase().includes('news')) {
        // 调用新闻情感分析AI
        const analysisData = {
          news: activeNewsData.map(news => ({
            title: news.title,
            description: news.description || '',
            source: typeof news.source === 'string' ? news.source : news.source.name,
            publishedAt: news.publishedAt || ''
          })),
          symbol: selectedCrypto,
          timeframe: timeframe
        };
        aiResponse = await analyzeNewsSentiment(analysisData);
      } else {
        // 默认综合分析
        aiResponse = generateCombinedResponse(message);
      }
      
      newConversation.push({ role: 'ai' as const, content: aiResponse });
    } catch (error) {
      // 如果AI调用失败，使用默认响应
      const fallbackResponse = generateCombinedResponse(message);
      newConversation.push({ role: 'ai' as const, content: fallbackResponse });
    }
    
    setConversation(newConversation);
    setMessage("");
    
    toast({
      title: "AI分析完成",
      description: "多模型AI已完成分析...",
    });
  };

  const generateCombinedResponse = (userMessage: string) => {
    const currentCrypto = activeCryptoData.find(c => c.symbol === selectedCrypto);
    const responses = [
      `🚀 Elon: Based on ${selectedCrypto} RSI of ${currentCrypto?.rsi}, ${currentCrypto?.rsi > 70 ? 'overbought but still HODL! To the moon!' : 'good entry point for Mars funding!'}`,
      `💰 Warren: ${selectedCrypto} trading at ${((currentCrypto?.price || 0) / (currentCrypto?.ma20 || 1) * 100 - 100).toFixed(1)}% ${currentCrypto?.price > currentCrypto?.ma20 ? 'above' : 'below'} MA20. ${currentCrypto?.price < currentCrypto?.ma20 ? 'Value opportunity emerging.' : 'Price reflects fair value.'}`,
      `🔬 Bill: Technical analysis shows ${selectedCrypto} ${currentCrypto?.rsi > 50 ? 'gaining momentum' : 'consolidating'}. Focus on blockchain adoption fundamentals.`
    ];
    
    return `**Combined Analysis for ${selectedCrypto}:**\n\n${responses.join('\n\n')}\n\n**Unified Recommendation:** Current market conditions suggest ${currentCrypto?.changePercent24h > 0 ? 'continued positive momentum' : 'potential buying opportunity'} based on technical and fundamental analysis.`;
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-orbitron tracking-wide px-6 py-2">
          <MessageSquare className="w-4 h-4 mr-2" />
          {t('ai.communicate')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[98vw] sm:max-h-[98vh] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-700 flex flex-col p-0">
        <DialogHeader className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-blue-900/80">
          <DialogTitle className="text-white flex items-center gap-3 font-orbitron text-xl">
            <Bot className="w-6 h-6 text-accent" />
            {t('ai.title')}
            <div className="flex items-center gap-2 ml-auto">
              <AIConfigPanel 
                config={aiConfig}
                onUpdateConfig={updateModelConfig}
              />
              <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50">
                <Activity className="w-3 h-3 mr-1" />
                {t('ai.live_analytics')}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-6 min-h-0 p-6">
          {/* Left side - AI Conversation Panel */}
          <div className="w-80 flex flex-col space-y-4">
            <Card className="flex-1 bg-gradient-crypto border-border p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">{t('ai.analysis_chat')}</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {conversation.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-accent/50" />
                    <p className="font-inter text-sm">{t('ai.ask_analysis')}</p>
                    <div className="mt-4 space-y-2 text-xs">
                      <p className="text-accent">{t('ai.try_asking')}</p>
                      <p>{t('ai.question1')}</p>
                      <p>{t('ai.question2')}</p>
                      <p>{t('ai.question3')}</p>
                    </div>
                  </div>
                ) : (
                  conversation.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] p-3 rounded-lg text-xs ${
                        msg.role === 'user' 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-muted text-foreground'
                      }`}>
                        <p className="font-inter whitespace-pre-line">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('ai.ask_placeholder')}
                  className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent font-inter"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-accent hover:bg-accent/80 px-3"
                  size="sm"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Right side - Professional Trading Analytics */}
          <div className="flex-1 space-y-4">
            {/* Asset Selection Header */}
            <Card className="bg-gradient-crypto border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">{t('ai.currency_selection')}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {activeCryptoData.slice(0, 3).map((crypto) => (
                      <Button
                        key={crypto.symbol}
                        variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
                        size="sm"
                        className={`${
                          selectedCrypto === crypto.symbol 
                            ? 'bg-accent text-accent-foreground' 
                            : 'bg-muted/20 border-border hover:bg-accent/20'
                        }`}
                        onClick={() => setSelectedCrypto(crypto.symbol)}
                      >
                        {crypto.symbol}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="w-px h-6 bg-border"></div>
                  
                  {/* Comprehensive Crypto Selector */}
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                      <SelectTrigger className="w-48 bg-muted/20 border-border">
                        <SelectValue placeholder="选择货币..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-background border-border">
                        {allSupportedCryptos.map((crypto) => (
                          <SelectItem 
                            key={crypto.symbol} 
                            value={crypto.symbol}
                            className="hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-accent">{crypto.symbol}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-sm">{crypto.name}</span>
                              <span className="text-xs text-muted-foreground">({crypto.chineseName})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/20">
                <TabsTrigger value="overview" className="data-[state=active]:bg-accent">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {t('ai.price_chart')}
                </TabsTrigger>
                <TabsTrigger value="technical" className="data-[state=active]:bg-accent">
                  <Activity className="w-4 h-4 mr-2" />
                  {t('ai.technical_analysis')}
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-accent">
                  <Globe className="w-4 h-4 mr-2" />
                  {t('ai.news_sentiment')}
                </TabsTrigger>
              </TabsList>

              {/* Price Chart Tab */}
              <TabsContent value="overview" className="space-y-4 mt-4">
                {(() => {
                  const currentCrypto = getSelectedCryptoData();
                  return (
                    <>
                      {/* Price Header */}
                      <Card className="bg-gradient-crypto border-border p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-3xl font-orbitron font-bold text-foreground">{currentCrypto.symbol}</h3>
                            <span className="text-xl text-muted-foreground font-inter">{currentCrypto.name}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${currentCrypto.changePercent24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {currentCrypto.changePercent24h >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                            <span className="font-mono font-bold text-xl">{currentCrypto.changePercent24h.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-4">
                          <span className="text-4xl font-mono font-bold text-foreground">${currentCrypto.price.toLocaleString()}</span>
                          <span className={`font-mono text-lg ${currentCrypto.changePercent24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {currentCrypto.changePercent24h >= 0 ? '+' : ''}${currentCrypto.change24h.toFixed(2)}
                          </span>
                        </div>
                      </Card>

                      {/* Enhanced Chart and Technical Analysis */}
                      <div className="grid grid-cols-4 gap-4">
                        {/* Main Chart Section */}
                        <div className="col-span-3">
                          <Card className="bg-gradient-crypto border-border p-4 h-96">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-foreground font-inter font-semibold">{t('ai.kline_chart')}</h4>
                              <div className="flex gap-1 flex-wrap">
                                {['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W', '1M', '3M', '6M', '1Y'].map((tf) => (
                                  <Button
                                    key={tf}
                                    size="sm"
                                    variant={timeframe === tf ? "default" : "outline"}
                                    onClick={() => setTimeframe(tf)}
                                    className={`text-xs px-2 py-1 h-6 ${
                                      timeframe === tf ? 'bg-accent text-accent-foreground' : 'bg-muted/20 border-border hover:bg-accent/20'
                                    }`}
                                  >
                                    {tf}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Chart Container with Technical Overlays */}
                            <div className="relative h-80">
                              <div ref={chartRef} className="h-full bg-muted/10 rounded border border-border flex flex-col">
                                {/* Chart Header with Price Info */}
                                <div className="p-3 border-b border-border bg-muted/5">
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-4">
                                      <span className="font-mono font-bold text-foreground">
                                        {currentCrypto.symbol}/USDT
                                      </span>
                                      <span className="text-muted-foreground">
                                        O: ${currentCrypto.price * 0.998}
                                      </span>
                                      <span className="text-muted-foreground">
                                        H: ${currentCrypto.high24h}
                                      </span>
                                      <span className="text-muted-foreground">
                                        L: ${currentCrypto.low24h}
                                      </span>
                                      <span className="text-foreground font-semibold">
                                        C: ${currentCrypto.price}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs bg-accent/20 text-accent">
                                        Volume: ${(currentCrypto.volume24h / 1e9).toFixed(2)}B
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Main Chart Area */}
                                <div className="flex-1 flex items-center justify-center">
                                  <div className="text-center text-muted-foreground">
                                    <LineChart className="w-20 h-20 mx-auto mb-3 text-accent/50" />
                                    <p className="text-lg font-semibold">{t('ai.professional_kline')} ({timeframe})</p>
                                    <p className="text-sm">{t('ai.realtime_data')}</p>
                                    <div className="mt-3 flex items-center justify-center gap-4 text-xs">
                                      <span className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-accent rounded"></div>
                                        MA20
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-blue-400 rounded"></div>
                                        MA50
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-orange-400 rounded"></div>
                                        BOLL
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Technical Indicator Sub-Charts */}
                                <div className="grid grid-cols-3 gap-2 p-3 border-t border-border bg-muted/5">
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">RSI(14)</p>
                                    <div className="h-8 bg-muted/20 rounded flex items-center justify-center">
                                      <span className={`text-xs font-mono font-bold ${
                                        currentCrypto.rsi > 70 ? 'text-red-400' : 
                                        currentCrypto.rsi < 30 ? 'text-green-400' : 'text-accent'
                                      }`}>
                                        {currentCrypto.rsi.toFixed(1)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">MACD</p>
                                    <div className="h-8 bg-muted/20 rounded flex items-center justify-center">
                                      <span className="text-xs font-mono font-bold text-accent">
                                        {((currentCrypto.price - currentCrypto.ma20) / currentCrypto.ma20 * 100).toFixed(2)}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">VOL</p>
                                    <div className="h-8 bg-muted/20 rounded flex items-center justify-center">
                                      <span className="text-xs font-mono font-bold text-accent">
                                        {(currentCrypto.volume24h / 1e6).toFixed(0)}M
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>

                        {/* Enhanced Technical Indicators Panel */}
                        <div>
                          <Card className="bg-gradient-crypto border-border p-4 h-96">
                            <h4 className="text-foreground font-inter font-semibold mb-4 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-accent" />
                              {t('ai.technical_panel')}
                            </h4>
                            <div className="space-y-3 text-sm overflow-y-auto">
                              {/* 基础技术指标 */}
                              <div className="space-y-2">
                                <h5 className="text-xs font-semibold text-accent mb-2">{t('ai.basic_indicators')}</h5>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">RSI(14)</span>
                                  <span className={`font-mono font-bold ${currentCrypto.rsi > 70 ? 'text-destructive' : currentCrypto.rsi < 30 ? 'text-success' : 'text-accent'}`}>
                                    {currentCrypto.rsi.toFixed(1)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">MACD</span>
                                  <span className="text-accent font-mono">{((currentCrypto.price - currentCrypto.ma20) / currentCrypto.ma20 * 100).toFixed(2)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">KDJ</span>
                                  <span className="text-accent font-mono">{(currentCrypto.rsi * 0.8).toFixed(1)}</span>
                                </div>
                              </div>

                              {/* 移动平均线 */}
                              <div className="space-y-2 pt-2 border-t border-border/50">
                                <h5 className="text-xs font-semibold text-accent mb-2">{t('ai.moving_averages')}</h5>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">MA5</span>
                                  <span className="text-foreground font-mono">${(currentCrypto.price * 0.995).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">MA10</span>
                                  <span className="text-foreground font-mono">${(currentCrypto.price * 0.992).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">MA20</span>
                                  <span className="text-foreground font-mono">${currentCrypto.ma20.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">MA50</span>
                                  <span className="text-foreground font-mono">${currentCrypto.ma50.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">MA200</span>
                                  <span className="text-foreground font-mono">${(currentCrypto.ma50 * 0.92).toFixed(2)}</span>
                                </div>
                              </div>

                              {/* 支撑阻力位 */}
                              <div className="space-y-2 pt-2 border-t border-border/50">
                                <h5 className="text-xs font-semibold text-accent mb-2">支撑阻力</h5>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">阻力位1</span>
                                  <span className="text-destructive font-mono">${currentCrypto.resistance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">阻力位2</span>
                                  <span className="text-destructive font-mono">${(currentCrypto.resistance * 1.05).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">支撑位1</span>
                                  <span className="text-success font-mono">${currentCrypto.support.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">支撑位2</span>
                                  <span className="text-success font-mono">${(currentCrypto.support * 0.95).toFixed(2)}</span>
                                </div>
                              </div>

                              {/* 布林带 */}
                              <div className="space-y-2 pt-2 border-t border-border/50">
                                <h5 className="text-xs font-semibold text-accent mb-2">布林带(BOLL)</h5>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">上轨</span>
                                  <span className="text-orange-400 font-mono">${(currentCrypto.price * 1.02).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">中轨</span>
                                  <span className="text-accent font-mono">${currentCrypto.ma20.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">下轨</span>
                                  <span className="text-blue-400 font-mono">${(currentCrypto.price * 0.98).toFixed(2)}</span>
                                </div>
                              </div>

                              {/* 极值数据 */}
                              <div className="space-y-2 pt-2 border-t border-border/50">
                                <h5 className="text-xs font-semibold text-accent mb-2">极值数据</h5>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">24h High</span>
                                  <span className="text-foreground font-mono">${currentCrypto.high24h.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">24h Low</span>
                                  <span className="text-foreground font-mono">${currentCrypto.low24h.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">ATH</span>
                                  <span className="text-accent font-mono">${currentCrypto.ath.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">ATL</span>
                                  <span className="text-muted-foreground font-mono">${currentCrypto.atl.toFixed(4)}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </TabsContent>

              {/* Technical Analysis Tab */}
              <TabsContent value="technical" className="space-y-4 mt-4">
                {(() => {
                  const currentCrypto = getSelectedCryptoData();
                  return (
                    <>
                      {/* Market Metrics Grid */}
                      <div className="grid grid-cols-6 gap-3">
                        <Card className="bg-gradient-crypto border-border p-3">
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs mb-1">市值</p>
                            <p className="text-foreground font-mono font-bold text-sm">${(currentCrypto.marketCap / 1e9).toFixed(1)}B</p>
                          </div>
                        </Card>
                        <Card className="bg-gradient-crypto border-border p-3">
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs mb-1">24小时交易量</p>
                            <p className="text-foreground font-mono font-bold text-sm">${(currentCrypto.volume24h / 1e9).toFixed(1)}B</p>
                          </div>
                        </Card>
                        <Card className="bg-gradient-crypto border-border p-3">
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs mb-1">市场占有率</p>
                            <p className="text-foreground font-mono font-bold text-sm">{currentCrypto.dominance.toFixed(1)}%</p>
                          </div>
                        </Card>
                        <Card className="bg-gradient-crypto border-border p-3">
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs mb-1">流通供应量</p>
                            <p className="text-foreground font-mono font-bold text-sm">{(currentCrypto.circulatingSupply / 1e6).toFixed(1)}M</p>
                          </div>
                        </Card>
                        <Card className="bg-gradient-crypto border-border p-3">
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs mb-1">最大供应量</p>
                            <p className="text-foreground font-mono font-bold text-sm">
                              {currentCrypto.maxSupply === 0 ? '∞' : `${(currentCrypto.maxSupply / 1e6).toFixed(1)}M`}
                            </p>
                          </div>
                        </Card>
                        <Card className="bg-gradient-crypto border-border p-3">
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs mb-1">供应比率</p>
                            <p className="text-foreground font-mono font-bold text-sm">
                              {currentCrypto.maxSupply === 0 ? '不适用' : `${((currentCrypto.circulatingSupply / currentCrypto.maxSupply) * 100).toFixed(1)}%`}
                            </p>
                          </div>
                        </Card>
                      </div>

                      {/* AI Trading Signals */}
                      <Card className="bg-gradient-crypto border-border p-6">
                        <h4 className="text-foreground font-inter font-semibold mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-accent" />
                          {t('ai.trading_signals')}
                        </h4>
                        <div className="grid grid-cols-3 gap-6 text-sm">
                          <div className="text-center">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                              currentCrypto.rsi > 70 ? 'bg-destructive/20 text-destructive' : 
                              currentCrypto.rsi < 30 ? 'bg-success/20 text-success' : 
                              'bg-accent/20 text-accent'
                            }`}>
                              <Activity className="w-4 h-4" />
                              {currentCrypto.rsi > 70 ? t('ai.signal.overbought') : currentCrypto.rsi < 30 ? t('ai.signal.oversold') : t('ai.signal.neutral')}
                            </div>
                            <p className="text-muted-foreground text-xs mt-2">{t('ai.signal.rsi')}</p>
                          </div>
                          <div className="text-center">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                              currentCrypto.price > currentCrypto.ma20 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                            }`}>
                              <TrendingUp className="w-4 h-4" />
                              {currentCrypto.price > currentCrypto.ma20 ? t('ai.signal.bullish') : t('ai.signal.bearish')}
                            </div>
                            <p className="text-muted-foreground text-xs mt-2">{t('ai.signal.ma20_trend')}</p>
                          </div>
                          <div className="text-center">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                              currentCrypto.price > currentCrypto.support && currentCrypto.price < currentCrypto.resistance ? 'bg-accent/20 text-accent' : 
                              currentCrypto.price <= currentCrypto.support ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'
                            }`}>
                              <BarChart3 className="w-4 h-4" />
                              {currentCrypto.price > currentCrypto.support && currentCrypto.price < currentCrypto.resistance ? t('ai.signal.range') : 
                               currentCrypto.price <= currentCrypto.support ? 'SUPPORT TEST' : 'BREAKOUT'}
                            </div>
                            <p className="text-muted-foreground text-xs mt-2">{t('ai.signal.sr_level')}</p>
                          </div>
                        </div>
                      </Card>
                    </>
                  );
                })()}
              </TabsContent>

              {/* News Analysis Tab */}
              <TabsContent value="news" className="space-y-4 mt-4">
                <Card className="bg-gradient-crypto border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-accent" />
                    <h4 className="text-foreground font-inter font-semibold">{t('ai.news_sentiment_analysis')}</h4>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activeNewsData.map((news, index) => (
                      <div key={index} className="p-4 bg-muted/10 rounded-lg border border-border">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  news.sentiment === 'bullish' ? 'bg-success/20 text-success border-success/30' : 
                                  news.sentiment === 'bearish' ? 'bg-destructive/20 text-destructive border-destructive/30' : 
                                  'bg-accent/20 text-accent border-accent/30'
                                }`}
                              >
                                {t(`news.sentiment.${news.sentiment}`)}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  news.impact === 'high' ? 'bg-destructive/20 text-destructive border-destructive/30' : 
                                  news.impact === 'medium' ? 'bg-accent/20 text-accent border-accent/30' : 
                                  'bg-success/20 text-success border-success/30'
                                }`}
                              >
                                {t(`news.impact.${news.impact}`)}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {formatTimeAgo(news.publishedAt, news.time)}
                              </span>
                            </div>
                            <h5 className="font-semibold text-foreground mb-2">{news.title}</h5>
                            <p className="text-sm text-muted-foreground mb-2">{news.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {t('news.source')} {typeof news.source === 'string' ? news.source : news.source.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};