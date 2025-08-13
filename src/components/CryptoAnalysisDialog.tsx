import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData } from "@/hooks/useCryptoData";
import { 
  Search, TrendingUp, TrendingDown, ShoppingCart, Zap, BarChart3, Bot, 
  MessageSquare, Send, Activity, DollarSign, Target, Shield,
  Lightbulb, Brain, Eye, ChevronRight, LineChart, PieChart,
  Calendar, Clock, Globe, AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  keyPoints: string[];
  technicalAnalysis: {
    rsi: number;
    rsiSignal: 'Oversold' | 'Overbought' | 'Neutral';
    ma20: number;
    ma50: number;
    ma200: number;
    macd: { value: number; signal: number; histogram: number };
    bollinger: { upper: number; middle: number; lower: number };
    support: number;
    resistance: number;
    volume24h: number;
    volumeChange: number;
    volatility: number;
    momentum: number;
  };
  marketData: {
    marketCap: number;
    marketCapRank: number;
    circulatingSupply: number;
    totalSupply: number;
    maxSupply: number;
    dominance: number;
    ath: number;
    athDate: string;
    atl: number;
    atlDate: string;
    high24h: number;
    low24h: number;
    priceChange1h: number;
    priceChange7d: number;
    priceChange30d: number;
  };
  priceTarget: {
    short: number;
    medium: number;
    long: number;
    stopLoss: number;
    takeProfit: number;
  };
  riskMetrics: {
    volatilityRating: 'Low' | 'Medium' | 'High' | 'Extreme';
    liquidityScore: number;
    correlationBTC: number;
    sharpRatio: number;
  };
}

export const CryptoAnalysisDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState('BTC');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { cryptoData } = useCryptoData();

  // 预设的热门货币标签
  const popularCryptos = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'AVAX', 'MATIC'];
  
  const filteredCryptos = cryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 8);

  const performAnalysis = async (crypto: any) => {
    setIsAnalyzing(true);
    
    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const rsiValue = 30 + Math.random() * 40; // 30-70
    const getRsiSignal = (rsi: number) => {
      if (rsi < 30) return 'Oversold';
      if (rsi > 70) return 'Overbought';
      return 'Neutral';
    };
    
    // 生成更详细的分析结果
    const mockAnalysis: AnalysisResult = {
      recommendation: crypto.changePercent24h > 5 ? 'BUY' : crypto.changePercent24h < -5 ? 'SELL' : 'HOLD',
      confidence: Math.floor(Math.random() * 25 + 75), // 75-100%
      keyPoints: [
        `${crypto.name} 当前价格 $${crypto.price.toFixed(4)}，24小时变动 ${crypto.changePercent24h >= 0 ? '+' : ''}${crypto.changePercent24h.toFixed(2)}%`,
        `技术面显示${crypto.changePercent24h > 3 ? '强势上涨动能' : crypto.changePercent24h < -3 ? '下跌压力明显' : '震荡整理格局'}`,
        `RSI指标处于${getRsiSignal(rsiValue)}区域，当前值${rsiValue.toFixed(1)}`,
        `交易量${Math.random() > 0.5 ? '放大' : '萎缩'}，${Math.random() > 0.5 ? '资金流入' : '获利了结'}明显`,
        `市场情绪${crypto.changePercent24h > 0 ? '偏向乐观' : '谨慎观望'}，建议${crypto.changePercent24h > 3 ? '逢低布局' : '控制仓位'}`
      ],
      technicalAnalysis: {
        rsi: rsiValue,
        rsiSignal: getRsiSignal(rsiValue),
        ma20: crypto.price * (0.95 + Math.random() * 0.1),
        ma50: crypto.price * (0.90 + Math.random() * 0.15),
        ma200: crypto.price * (0.85 + Math.random() * 0.20),
        macd: {
          value: (Math.random() - 0.5) * 20,
          signal: (Math.random() - 0.5) * 15,
          histogram: (Math.random() - 0.5) * 10
        },
        bollinger: {
          upper: crypto.price * (1.02 + Math.random() * 0.05),
          middle: crypto.price * (0.98 + Math.random() * 0.04),
          lower: crypto.price * (0.95 + Math.random() * 0.03)
        },
        support: crypto.price * (0.90 + Math.random() * 0.08),
        resistance: crypto.price * (1.05 + Math.random() * 0.10),
        volume24h: crypto.volume24h || (Math.random() * 1000000000),
        volumeChange: (Math.random() - 0.5) * 100,
        volatility: Math.random() * 5 + 1,
        momentum: (Math.random() - 0.5) * 50
      },
      marketData: {
        marketCap: crypto.marketCap || (Math.random() * 100000000000),
        marketCapRank: crypto.marketCapRank || Math.floor(Math.random() * 100 + 1),
        circulatingSupply: crypto.circulatingSupply || (Math.random() * 1000000000),
        totalSupply: crypto.totalSupply || (Math.random() * 1200000000),
        maxSupply: crypto.maxSupply || (Math.random() * 1500000000),
        dominance: crypto.dominance || (Math.random() * 10),
        ath: crypto.ath || (crypto.price * (1.5 + Math.random() * 2)),
        athDate: '2021-11-10',
        atl: crypto.atl || (crypto.price * (0.1 + Math.random() * 0.3)),
        atlDate: '2020-03-13',
        high24h: crypto.high24h || (crypto.price * (1.02 + Math.random() * 0.08)),
        low24h: crypto.low24h || (crypto.price * (0.92 + Math.random() * 0.08)),
        priceChange1h: (Math.random() - 0.5) * 5,
        priceChange7d: (Math.random() - 0.5) * 20,
        priceChange30d: (Math.random() - 0.5) * 50
      },
      priceTarget: {
        short: crypto.price * (0.95 + Math.random() * 0.15),
        medium: crypto.price * (1.00 + Math.random() * 0.25),
        long: crypto.price * (1.10 + Math.random() * 0.50),
        stopLoss: crypto.price * (0.85 + Math.random() * 0.10),
        takeProfit: crypto.price * (1.15 + Math.random() * 0.20)
      },
      riskMetrics: {
        volatilityRating: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
        liquidityScore: Math.floor(Math.random() * 40 + 60), // 60-100
        correlationBTC: Math.random() * 0.6 + 0.2, // 0.2-0.8
        sharpRatio: Math.random() * 2 + 0.5 // 0.5-2.5
      }
    };
    
    setAnalysisResult(mockAnalysis);
    setIsAnalyzing(false);
  };

  const handleAiChat = async () => {
    if (!currentMessage.trim() || !selectedCrypto) return;
    
    const userMessage = currentMessage;
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setCurrentMessage('');
    setIsAiResponding(true);
    
    // 模拟AI回复
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiResponse = generateAiResponse(userMessage, selectedCrypto, analysisResult);
    setAiMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    setIsAiResponding(false);
  };

  const generateAiResponse = (message: string, crypto: any, analysis: AnalysisResult | null): string => {
    const responses = [
      `基于当前${crypto.name}的技术分析，价格在$${crypto.price.toFixed(4)}附近。从图表形态来看，${analysis?.technicalAnalysis.rsi < 30 ? '已进入超卖区域，可能出现反弹' : analysis?.technicalAnalysis.rsi > 70 ? '处于超买状态，注意回调风险' : '技术指标中性，建议观望'}。`,
      `我看到${crypto.name}的24小时变动为${crypto.changePercent24h.toFixed(2)}%。从技术面分析，当前支撑位在$${analysis?.technicalAnalysis.support.toFixed(4)}，阻力位在$${analysis?.technicalAnalysis.resistance.toFixed(4)}。建议在支撑位附近考虑建仓。`,
      `根据图表分析，${crypto.name}的RSI指标为${analysis?.technicalAnalysis.rsi.toFixed(1)}，MACD显示${analysis?.technicalAnalysis.macd.value > 0 ? '金叉信号' : '死叉信号'}。结合成交量变化，${analysis?.technicalAnalysis.volumeChange > 0 ? '资金流入明显' : '成交量萎缩，观望情绪浓厚'}。`,
      `从风险管理角度，${crypto.name}的波动率评级为${analysis?.riskMetrics.volatilityRating}。建议设置止损位在$${analysis?.priceTarget.stopLoss.toFixed(4)}，止盈位在$${analysis?.priceTarget.takeProfit.toFixed(4)}。`,
      `${crypto.name}与比特币的相关性为${analysis?.riskMetrics.correlationBTC.toFixed(2)}，流动性评分${analysis?.riskMetrics.liquidityScore}/100。当前市值排名第${analysis?.marketData.marketCapRank}位，市场地位${analysis?.marketData.marketCapRank <= 10 ? '稳固' : analysis?.marketData.marketCapRank <= 50 ? '中等' : '较低'}。`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handlePurchase = (action: 'BUY' | 'SELL') => {
    toast({
      title: "交易功能需要后端支持",
      description: "请连接Supabase来实现真实的交易功能，包括订单管理、风险控制等",
      variant: "destructive",
    });
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const getVolatilityColor = (rating: string) => {
    switch (rating) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-orange-400';
      case 'Extreme': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'SELL': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'BUY': return <TrendingUp className="w-4 h-4" />;
      case 'SELL': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          size="lg"
        >
          <Bot className="w-5 h-5 mr-2" />
          {t('language') === 'zh' ? 'AI 货币分析' : 'AI Crypto Analysis'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px] bg-slate-900 border-slate-700 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 font-orbitron text-xl">
            <Bot className="w-6 h-6 text-blue-400" />
            {t('language') === 'zh' ? 'SUPREME BRAIN - 高级交易分析' : 'SUPREME BRAIN - Advanced Trading Analytics'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 搜索区域 */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder={t('language') === 'zh' ? '搜索加密货币 (如: Bitcoin, BTC, 比特币)...' : 'Search cryptocurrencies (e.g., Bitcoin, BTC)...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white"
              />
            </div>
            
            {searchTerm && (
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {filteredCryptos.map((crypto) => (
                    <Card 
                      key={crypto.symbol}
                      className="p-3 bg-slate-800/50 border-slate-700 hover:border-slate-600 cursor-pointer transition-all"
                      onClick={() => {
                        setSelectedCrypto(crypto);
                        setSearchTerm('');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                          <div>
                            <h4 className="text-white font-medium">{crypto.name}</h4>
                            <p className="text-slate-400 text-sm">{crypto.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${crypto.price.toFixed(4)}</p>
                          <p className={`text-sm ${crypto.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {crypto.changePercent24h >= 0 ? '+' : ''}{crypto.changePercent24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* 选中的货币 */}
          {selectedCrypto && (
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={selectedCrypto.image} alt={selectedCrypto.name} className="w-12 h-12" />
                  <div>
                    <h3 className="text-white text-xl font-bold">{selectedCrypto.name}</h3>
                    <p className="text-slate-400">{selectedCrypto.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-2xl font-bold">${selectedCrypto.price.toFixed(4)}</p>
                  <p className={`text-lg ${selectedCrypto.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedCrypto.changePercent24h >= 0 ? '+' : ''}${selectedCrypto.changePercent24h.toFixed(2)}%
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => performAnalysis(selectedCrypto)}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    {t('language') === 'zh' ? 'AI 分析中...' : 'AI Analyzing...'}
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-2" />
                    {t('language') === 'zh' ? '开始 AI 深度分析' : 'Start AI Deep Analysis'}
                  </>
                )}
              </Button>
            </Card>
          )}

          {/* 分析结果 */}
          {analysisResult && selectedCrypto && (
            <div className="space-y-4">
              {/* 推荐建议 */}
              <Card className="p-4 bg-slate-800/50 border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    {t('language') === 'zh' ? 'AI 推荐' : 'AI Recommendation'}
                  </h3>
                  <Badge className={`${getRecommendationColor(analysisResult.recommendation)}`}>
                    {getRecommendationIcon(analysisResult.recommendation)}
                    <span className="ml-1">{analysisResult.recommendation}</span>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-slate-400 text-sm">{t('language') === 'zh' ? '置信度' : 'Confidence'}</p>
                    <p className="text-white font-medium">{analysisResult.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">{t('language') === 'zh' ? '风险等级' : 'Risk Level'}</p>
                    <p className="text-white font-medium">
                      {analysisResult.confidence > 85 ? (t('language') === 'zh' ? '低风险' : 'Low Risk') : 
                       analysisResult.confidence > 70 ? (t('language') === 'zh' ? '中等风险' : 'Medium Risk') : 
                       (t('language') === 'zh' ? '高风险' : 'High Risk')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white font-medium">{t('language') === 'zh' ? '关键分析要点:' : 'Key Analysis Points:'}</h4>
                  {analysisResult.keyPoints.map((point, index) => (
                    <p key={index} className="text-slate-300 text-sm">• {point}</p>
                  ))}
                </div>
              </Card>

              {/* 技术指标 */}
              <Card className="p-4 bg-slate-800/50 border-slate-700">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  {t('language') === 'zh' ? '技术指标' : 'Technical Indicators'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">RSI(14)</p>
                    <p className="text-white font-medium">{analysisResult.technicalAnalysis.rsi}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">MA20</p>
                    <p className="text-white font-medium">${analysisResult.technicalAnalysis.ma20.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">MA50</p>
                    <p className="text-white font-medium">${analysisResult.technicalAnalysis.ma50.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">{t('language') === 'zh' ? '支撑位' : 'Support'}</p>
                    <p className="text-green-400 font-medium">${analysisResult.technicalAnalysis.support.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">{t('language') === 'zh' ? '阻力位' : 'Resistance'}</p>
                    <p className="text-red-400 font-medium">${analysisResult.technicalAnalysis.resistance.toFixed(4)}</p>
                  </div>
                </div>
              </Card>

              {/* 价格目标 */}
              <Card className="p-4 bg-slate-800/50 border-slate-700">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  {t('language') === 'zh' ? '价格目标' : 'Price Targets'}
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">{t('language') === 'zh' ? '短期 (1-7天)' : 'Short Term (1-7d)'}</p>
                    <p className="text-white font-medium">${analysisResult.priceTarget.short.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">{t('language') === 'zh' ? '中期 (1-4周)' : 'Medium Term (1-4w)'}</p>
                    <p className="text-white font-medium">${analysisResult.priceTarget.medium.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">{t('language') === 'zh' ? '长期 (1-6月)' : 'Long Term (1-6m)'}</p>
                    <p className="text-white font-medium">${analysisResult.priceTarget.long.toFixed(4)}</p>
                  </div>
                </div>
              </Card>

              {/* 交易按钮 */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => handlePurchase('BUY')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {t('language') === 'zh' ? '买入下单' : 'Buy Order'}
                </Button>
                <Button 
                  onClick={() => handlePurchase('SELL')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  {t('language') === 'zh' ? '卖出下单' : 'Sell Order'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};