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
  Calendar, Clock, Globe, AlertTriangle, X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ProfessionalCryptoAnalysis = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('BTC');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { cryptoData } = useCryptoData();

  // 预设的热门货币标签
  const popularCryptos = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'AVAX', 'MATIC'];

  // 获取选中的加密货币数据
  const getCurrentCrypto = () => {
    return cryptoData.find(crypto => crypto.symbol === selectedTab) || cryptoData[0];
  };

  useEffect(() => {
    const crypto = getCurrentCrypto();
    if (crypto) {
      setSelectedCrypto(crypto);
    }
  }, [selectedTab, cryptoData]);

  const handleAiChat = async () => {
    if (!currentMessage.trim() || !selectedCrypto) return;
    
    const userMessage = currentMessage;
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setCurrentMessage('');
    setIsAiResponding(true);
    
    // 模拟AI回复
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiResponse = generateAiResponse(userMessage, selectedCrypto);
    setAiMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    setIsAiResponding(false);
  };

  const generateAiResponse = (message: string, crypto: any): string => {
    const responses = [
      `根据${crypto.name}当前的技术分析，价格为$${crypto.price.toFixed(4)}，24小时变动${crypto.changePercent24h.toFixed(2)}%。从图表形态来看，${crypto.changePercent24h > 0 ? '呈现上涨趋势，可以考虑适度建仓' : '存在下跌压力，建议控制风险'}。`,
      `我分析了${crypto.name}的技术指标，RSI显示${crypto.rsi > 70 ? '超买状态，注意回调风险' : crypto.rsi < 30 ? '超卖区域，可能存在反弹机会' : '中性区间，可以观望'}。当前支撑位在$${crypto.support?.toFixed(4)}，阻力位在$${crypto.resistance?.toFixed(4)}。`,
      `从市场数据来看，${crypto.name}市值排名第${crypto.marketCapRank}位，24小时最高价$${crypto.high24h?.toFixed(4)}，最低价$${crypto.low24h?.toFixed(4)}。建议关注成交量变化和市场情绪。`,
      `${crypto.name}的技术面分析显示，MA20线在$${crypto.ma20?.toFixed(4)}，MA50线在$${crypto.ma50?.toFixed(4)}。价格${crypto.price > (crypto.ma20 || 0) ? '位于均线上方，技术面偏强' : '跌破均线，需要谨慎'}。`,
      `基于当前市场环境，${crypto.name}的波动率较${Math.random() > 0.5 ? '高' : '低'}，流动性良好。建议采用分批建仓的策略，设置合理的止损止盈位。`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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

  if (!selectedCrypto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          size="lg"
        >
          <Bot className="w-5 h-5 mr-2" />
          {t('language') === 'zh' ? 'SUPREME BRAIN - 高级交易分析' : 'SUPREME BRAIN - Advanced Trading Analytics'}
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

            {/* AI Chat Messages */}
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-3">
                {aiMessages.length === 0 && (
                  <div className="text-slate-400 text-sm text-center py-8">
                    <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>问我关于{selectedCrypto.name}的任何技术分析问题</p>
                  </div>
                )}
                {aiMessages.map((msg, index) => (
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
                {isAiResponding && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-slate-200 p-3 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span>AI 正在分析...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* AI Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="询问技术分析..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
                className="bg-slate-700 border-slate-600 text-white text-sm"
              />
              <Button
                onClick={handleAiChat}
                disabled={!currentMessage.trim() || isAiResponding}
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
                const crypto = cryptoData.find(c => c.symbol === symbol);
                if (!crypto) return null;
                
                return (
                  <Button
                    key={symbol}
                    variant={selectedTab === symbol ? "default" : "outline"}
                    onClick={() => setSelectedTab(symbol)}
                    className={`${
                      selectedTab === symbol
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
                  <img src={selectedCrypto.image} alt={selectedCrypto.name} className="w-10 h-10" />
                  <div>
                    <h2 className="text-white text-xl font-bold">{selectedCrypto.symbol}</h2>
                    <p className="text-slate-400">{selectedCrypto.name}</p>
                  </div>
                  <Badge className={`ml-auto ${
                    selectedCrypto.changePercent24h >= 0 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {formatPercent(selectedCrypto.changePercent24h)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-white text-2xl font-bold">${selectedCrypto.price.toFixed(6)}</p>
                  <p className={`text-sm ${
                    selectedCrypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {selectedCrypto.change24h >= 0 ? '+' : ''}${selectedCrypto.change24h.toFixed(2)}
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
                      className={`text-xs ${period === '1D' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
                <div className="h-16 bg-slate-700/50 rounded flex items-center justify-center">
                  <LineChart className="w-8 h-8 text-slate-500" />
                  <span className="text-slate-500 text-sm ml-2">Interactive Chart (1D)</span>
                </div>
                <p className="text-slate-400 text-xs mt-2">Candlestick data for {selectedCrypto.symbol}</p>
              </Card>

              <Card className="p-4 bg-slate-800/30 border-slate-700">
                <h3 className="text-slate-400 text-sm mb-3">Technical Indicators</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">RSI(14)</span>
                    <span className="text-white">{selectedCrypto.rsi?.toFixed(2) || '65.42'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">MA20</span>
                    <span className="text-white">${selectedCrypto.ma20?.toFixed(2) || (selectedCrypto.price * 0.98).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">MA50</span>
                    <span className="text-white">${selectedCrypto.ma50?.toFixed(2) || (selectedCrypto.price * 0.95).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Support</span>
                    <span className="text-green-400">${selectedCrypto.support?.toFixed(2) || (selectedCrypto.price * 0.92).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Resistance</span>
                    <span className="text-red-400">${selectedCrypto.resistance?.toFixed(2) || (selectedCrypto.price * 1.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">24h High</span>
                    <span className="text-white">${selectedCrypto.high24h?.toFixed(2) || (selectedCrypto.price * 1.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">24h Low</span>
                    <span className="text-white">${selectedCrypto.low24h?.toFixed(2) || (selectedCrypto.price * 0.95).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">ATH</span>
                    <span className="text-yellow-400">${selectedCrypto.ath?.toFixed(2) || (selectedCrypto.price * 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">ATL</span>
                    <span className="text-blue-400">${selectedCrypto.atl?.toFixed(8) || (selectedCrypto.price * 0.1).toFixed(8)}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Market Data Grid */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              <Card className="p-3 bg-slate-800/30 border-slate-700 text-center">
                <p className="text-slate-400 text-xs mb-1">Market Cap</p>
                <p className="text-white font-semibold text-sm">{formatNumber(selectedCrypto.marketCap || 74700000000)}</p>
              </Card>
              <Card className="p-3 bg-slate-800/30 border-slate-700 text-center">
                <p className="text-slate-400 text-xs mb-1">24h Volume</p>
                <p className="text-white font-semibold text-sm">{formatNumber(selectedCrypto.volume24h || 9700000000)}</p>
              </Card>
              <Card className="p-3 bg-slate-800/30 border-slate-700 text-center">
                <p className="text-slate-400 text-xs mb-1">Dominance</p>
                <p className="text-white font-semibold text-sm">{selectedCrypto.dominance?.toFixed(2) || '4.88'}%</p>
              </Card>
              <Card className="p-3 bg-slate-800/30 border-slate-700 text-center">
                <p className="text-slate-400 text-xs mb-1">Circulating Supply</p>
                <p className="text-white font-semibold text-sm">{((selectedCrypto.circulatingSupply || 555800000) / 1000000).toFixed(1)}M</p>
              </Card>
              <Card className="p-3 bg-slate-800/30 border-slate-700 text-center">
                <p className="text-slate-400 text-xs mb-1">Max Supply</p>
                <p className="text-white font-semibold text-sm">{((selectedCrypto.maxSupply || 21000000) / 1000000).toFixed(1)}M</p>
              </Card>
              <Card className="p-3 bg-slate-800/30 border-slate-700 text-center">
                <p className="text-slate-400 text-xs mb-1">Supply Ratio</p>
                <p className="text-white font-semibold text-sm">153.8%</p>
              </Card>
            </div>

            {/* AI Chat Input at Bottom */}
            <Card className="p-4 bg-slate-800/30 border-slate-700">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Ask about technical analysis..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
                  className="flex-1 bg-slate-700 border-slate-600 text-white"
                />
                <Button
                  onClick={handleAiChat}
                  disabled={!currentMessage.trim() || isAiResponding}
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