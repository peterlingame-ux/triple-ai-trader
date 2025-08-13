import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Send, Bot, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Clock, Globe, LineChart, Zap, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
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
  source: string;
  time: string;
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

export const AICommunicator = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");
  const [timeframe, setTimeframe] = useState<string>("1D");
  const chartRef = useRef<HTMLDivElement>(null);

  // Enhanced cryptocurrency analytics data with more professional parameters
  const cryptoAnalytics: CryptoAnalytics[] = [
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

  // Enhanced news data with more professional market analysis
  const newsData: NewsItem[] = [
    {
      title: "Bitcoin ETF Trading Volume Hits $2.8B Daily Record",
      source: "CoinDesk Pro",
      time: "15 min ago",
      sentiment: "bullish",
      impact: "high"
    },
    {
      title: "Ethereum Shanghai Upgrade: $4.7B ETH Unlocked",
      source: "The Block Research",
      time: "32 min ago",
      sentiment: "neutral",
      impact: "high"
    },
    {
      title: "Institutional Adoption: BlackRock Files for Solana ETF",
      source: "Bloomberg Terminal",
      time: "1 hour ago",
      sentiment: "bullish",
      impact: "high"
    },
    {
      title: "Fed Chair Powell: Digital Assets Regulation Framework Q2",
      source: "Reuters Financial",
      time: "2 hours ago",
      sentiment: "neutral",
      impact: "medium"
    },
    {
      title: "Crypto Derivatives Market Reaches $3.2T Daily Volume",
      source: "CoinGecko Analytics",
      time: "3 hours ago",
      sentiment: "bullish",
      impact: "medium"
    },
    {
      title: "Major Exchange Reports 150% Increase in DeFi Trading",
      source: "DeFiPulse",
      time: "4 hours ago",
      sentiment: "bullish",
      impact: "low"
    },
    {
      title: "Whale Alert: 50,000 BTC Moved to Unknown Wallet",
      source: "Whale Alert",
      time: "5 hours ago",
      sentiment: "bearish",
      impact: "medium"
    }
  ];

  // Mock chart data
  const generateChartData = (symbol: string, timeframe: string): ChartData[] => {
    const basePrice = cryptoAnalytics.find(c => c.symbol === symbol)?.price || 40000;
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
    const currentCrypto = cryptoAnalytics.find(c => c.symbol === selectedCrypto);
    const responses = [
      `🚀 Elon: Based on ${selectedCrypto} RSI of ${currentCrypto?.rsi}, ${currentCrypto?.rsi > 70 ? 'overbought but still HODL! To the moon!' : 'good entry point for Mars funding!'}`,
      `💰 Warren: ${selectedCrypto} trading at ${((currentCrypto?.price || 0) / (currentCrypto?.ma20 || 1) * 100 - 100).toFixed(1)}% ${currentCrypto?.price > currentCrypto?.ma20 ? 'above' : 'below'} MA20. ${currentCrypto?.price < currentCrypto?.ma20 ? 'Value opportunity emerging.' : 'Price reflects fair value.'}`,
      `🔬 Bill: Technical analysis shows ${selectedCrypto} ${currentCrypto?.rsi > 50 ? 'gaining momentum' : 'consolidating'}. Focus on blockchain adoption fundamentals.`
    ];
    
    return `**Combined Analysis for ${selectedCrypto}:**\n\n${responses.join('\n\n')}\n\n**Unified Recommendation:** Current market conditions suggest ${currentCrypto?.changePercent24h > 0 ? 'continued positive momentum' : 'potential buying opportunity'} based on technical and fundamental analysis.`;
  };

  const getSelectedCryptoData = () => {
    return cryptoAnalytics.find(c => c.symbol === selectedCrypto) || cryptoAnalytics[0];
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
      
      <DialogContent className="sm:max-w-[95vw] bg-slate-900 border-slate-700 max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 font-orbitron">
            <Bot className="w-5 h-5" />
            SUPREME BRAIN - Advanced Trading Analytics
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left side - Conversation */}
          <div className="w-1/3 flex flex-col space-y-4">
            <div className="flex-1 bg-slate-800/50 rounded-lg p-4 overflow-y-auto space-y-3">
              {conversation.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                  <p className="font-inter text-sm">Ask for analysis on selected crypto with live market data</p>
                </div>
              ) : (
                conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-3 rounded-lg text-xs ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-slate-100'
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
                placeholder="Ask about technical analysis..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-3"
                size="sm"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Right side - Advanced Analytics */}
          <div className="flex-1 space-y-4">
            <Tabs value={selectedCrypto} onValueChange={setSelectedCrypto} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                <TabsTrigger value="BTC" className="data-[state=active]:bg-orange-500/20">BTC</TabsTrigger>
                <TabsTrigger value="ETH" className="data-[state=active]:bg-purple-500/20">ETH</TabsTrigger>
                <TabsTrigger value="SOL" className="data-[state=active]:bg-purple-500/20">SOL</TabsTrigger>
              </TabsList>

              {cryptoAnalytics.map((crypto) => (
                <TabsContent key={crypto.symbol} value={crypto.symbol} className="space-y-4 mt-4">
                  {/* Price Header */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-orbitron font-bold text-white">{crypto.symbol}</h3>
                        <span className="text-slate-400 font-inter">{crypto.name}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${crypto.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.changePercent24h >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        <span className="font-mono font-bold">{crypto.changePercent24h.toFixed(2)}%</span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-3xl font-mono font-bold text-white">${crypto.price.toLocaleString()}</span>
                      <span className={`font-mono ${crypto.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.changePercent24h >= 0 ? '+' : ''}${crypto.change24h.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Chart and Data Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Chart Section */}
                    <div className="col-span-2 bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-inter font-semibold">Price Chart</h4>
                        <div className="flex gap-1">
                          {['1H', '1D', '1W', '1M'].map((tf) => (
                            <Button
                              key={tf}
                              size="sm"
                              variant={timeframe === tf ? "default" : "outline"}
                              onClick={() => setTimeframe(tf)}
                              className="text-xs px-2 py-1 h-6"
                            >
                              {tf}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div ref={chartRef} className="h-48 bg-slate-900 rounded border flex items-center justify-center">
                        <div className="text-center text-slate-400">
                          <LineChart className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">Interactive Chart ({timeframe})</p>
                          <p className="text-xs">Candlestick data for {crypto.symbol}</p>
                        </div>
                      </div>
                    </div>

                    {/* Technical Indicators */}
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="text-white font-inter font-semibold mb-3">Technical Indicators</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">RSI(14)</span>
                          <span className={`font-mono ${crypto.rsi > 70 ? 'text-red-400' : crypto.rsi < 30 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {crypto.rsi}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">MA20</span>
                          <span className="text-white font-mono">${crypto.ma20.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">MA50</span>
                          <span className="text-white font-mono">${crypto.ma50.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Support</span>
                          <span className="text-green-400 font-mono">${crypto.support.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Resistance</span>
                          <span className="text-red-400 font-mono">${crypto.resistance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">24h High</span>
                          <span className="text-white font-mono">${crypto.high24h.toLocaleString()}</span>
                        </div>
                         <div className="flex justify-between">
                           <span className="text-slate-400">24h Low</span>
                           <span className="text-white font-mono">${crypto.low24h.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-slate-400">ATH</span>
                           <span className="text-yellow-400 font-mono">${crypto.ath.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between">
                           <span className="text-slate-400">ATL</span>
                           <span className="text-blue-400 font-mono">${crypto.atl}</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Enhanced Market Data Grid */}
                   <div className="grid grid-cols-6 gap-3">
                     <Card className="bg-slate-800/50 p-3 border-slate-700">
                       <div className="text-center">
                         <p className="text-slate-400 text-xs mb-1">Market Cap</p>
                         <p className="text-white font-mono font-bold text-sm">${(crypto.marketCap / 1e9).toFixed(1)}B</p>
                       </div>
                     </Card>
                     <Card className="bg-slate-800/50 p-3 border-slate-700">
                       <div className="text-center">
                         <p className="text-slate-400 text-xs mb-1">24h Volume</p>
                         <p className="text-white font-mono font-bold text-sm">${(crypto.volume24h / 1e9).toFixed(1)}B</p>
                       </div>
                     </Card>
                     <Card className="bg-slate-800/50 p-3 border-slate-700">
                       <div className="text-center">
                         <p className="text-slate-400 text-xs mb-1">Dominance</p>
                         <p className="text-white font-mono font-bold text-sm">{crypto.dominance}%</p>
                       </div>
                     </Card>
                     <Card className="bg-slate-800/50 p-3 border-slate-700">
                       <div className="text-center">
                         <p className="text-slate-400 text-xs mb-1">Circulating</p>
                         <p className="text-white font-mono font-bold text-sm">{(crypto.circulatingSupply / 1e6).toFixed(1)}M</p>
                       </div>
                     </Card>
                     <Card className="bg-slate-800/50 p-3 border-slate-700">
                       <div className="text-center">
                         <p className="text-slate-400 text-xs mb-1">Max Supply</p>
                         <p className="text-white font-mono font-bold text-sm">
                           {crypto.maxSupply === 0 ? '∞' : `${(crypto.maxSupply / 1e6).toFixed(1)}M`}
                         </p>
                       </div>
                     </Card>
                     <Card className="bg-slate-800/50 p-3 border-slate-700">
                       <div className="text-center">
                         <p className="text-slate-400 text-xs mb-1">Supply Ratio</p>
                         <p className="text-white font-mono font-bold text-sm">
                           {crypto.maxSupply === 0 ? 'N/A' : `${((crypto.circulatingSupply / crypto.maxSupply) * 100).toFixed(1)}%`}
                         </p>
                       </div>
                     </Card>
                   </div>

                   {/* Professional Trading Signals */}
                   <Card className="bg-slate-800/50 p-4 border-slate-700">
                     <h4 className="text-white font-inter font-semibold mb-3 flex items-center gap-2">
                       <Zap className="w-4 h-4 text-yellow-400" />
                       AI Trading Signals
                     </h4>
                     <div className="grid grid-cols-3 gap-4 text-sm">
                       <div className="text-center">
                         <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                           crypto.rsi > 70 ? 'bg-red-500/20 text-red-400' : 
                           crypto.rsi < 30 ? 'bg-green-500/20 text-green-400' : 
                           'bg-yellow-500/20 text-yellow-400'
                         }`}>
                           <Activity className="w-3 h-3" />
                           {crypto.rsi > 70 ? 'OVERBOUGHT' : crypto.rsi < 30 ? 'OVERSOLD' : 'NEUTRAL'}
                         </div>
                         <p className="text-slate-400 text-xs mt-1">RSI Signal</p>
                       </div>
                       <div className="text-center">
                         <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                           crypto.price > crypto.ma20 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                         }`}>
                           <TrendingUp className="w-3 h-3" />
                           {crypto.price > crypto.ma20 ? 'BULLISH' : 'BEARISH'}
                         </div>
                         <p className="text-slate-400 text-xs mt-1">MA20 Trend</p>
                       </div>
                       <div className="text-center">
                         <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                           crypto.price > crypto.support && crypto.price < crypto.resistance ? 'bg-blue-500/20 text-blue-400' : 
                           crypto.price <= crypto.support ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                         }`}>
                           <BarChart3 className="w-3 h-3" />
                           {crypto.price > crypto.support && crypto.price < crypto.resistance ? 'RANGE' : 
                            crypto.price <= crypto.support ? 'SUPPORT TEST' : 'BREAKOUT'}
                         </div>
                         <p className="text-slate-400 text-xs mt-1">S/R Level</p>
                       </div>
                      </div>
                    </Card>

                   {/* News Feed */}
                   <div className="bg-slate-800/50 rounded-lg p-4">
                     <div className="flex items-center gap-2 mb-3">
                       <Globe className="w-4 h-4 text-blue-400" />
                       <h4 className="text-white font-inter font-semibold">Market News</h4>
                     </div>
                     <div className="space-y-2 max-h-32 overflow-y-auto">
                       {newsData.map((news, index) => (
                         <div key={index} className="flex items-start gap-3 p-2 bg-slate-700/50 rounded text-xs">
                           <div className="flex-1">
                             <p className="text-white font-medium">{news.title}</p>
                             <div className="flex items-center gap-2 mt-1">
                               <span className="text-slate-400">{news.source}</span>
                               <span className="text-slate-500">•</span>
                               <span className="text-slate-400">{news.time}</span>
                             </div>
                           </div>
                           <div className="flex flex-col gap-1">
                             <Badge className={`text-xs ${getSentimentColor(news.sentiment)}`}>
                               {news.sentiment.toUpperCase()}
                             </Badge>
                             <Badge className={`text-xs ${getImpactBadge(news.impact)}`}>
                               {news.impact.toUpperCase()}
                             </Badge>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>

                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};