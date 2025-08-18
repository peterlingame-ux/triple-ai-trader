import React, { useState, useCallback, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target,
  Volume2,
  Zap,
  X,
  Maximize2,
  Eye,
  Settings,
  Send,
  Bot,
  User,
  Minus,
  Plus,
  RotateCcw,
  Crosshair,
  TrendingUpIcon,
  Palette,
  Type,
  Smile
} from "lucide-react";
import { BinanceKlineChart } from "./BinanceKlineChart";
import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData } from "@/hooks/useCryptoData";

interface DrawingAnnotation {
  id: string;
  type: 'line' | 'support' | 'resistance' | 'fibonacci' | 'note';
  coordinates: Array<{x: number, y: number}>;
  color: string;
  text?: string;
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ProfessionalTradingPanelProps {
  selectedCrypto: string;
  onCryptoChange: (crypto: string) => void;
  onClose: () => void;
  aiConfigs: Record<string, { enabled: boolean; apiKey: string; model: string }>;
}

export const ProfessionalTradingPanel = ({ 
  selectedCrypto, 
  onCryptoChange, 
  onClose, 
  aiConfigs 
}: ProfessionalTradingPanelProps) => {
  const { t } = useLanguage();
  const { cryptoData } = useCryptoData();
  const [selectedTimeframe, setSelectedTimeframe] = useState("15m");
  const [drawingAnnotations, setDrawingAnnotations] = useState<DrawingAnnotation[]>([]);
  const [showOrderBook, setShowOrderBook] = useState(true);
  const [showAIChat, setShowAIChat] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedDrawingTool, setSelectedDrawingTool] = useState<string>('cursor');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);

  const currentCrypto = cryptoData.find(c => c.symbol === selectedCrypto) || cryptoData[0];

  // 模拟实时价格更新
  useEffect(() => {
    if (currentCrypto) {
      setCurrentPrice(currentCrypto.price || 43364.25);
      setPriceChange(currentCrypto.change24h || -104.69);
      setPriceChangePercent(currentCrypto.changePercent24h || -2.34);
    }
  }, [currentCrypto]);

  // 刷新数据函数
  const fetchKlineData = useCallback(() => {
    console.log('手动刷新K线数据:', selectedCrypto);
    setRefreshKey(prev => prev + 1);
  }, [selectedCrypto]);

  // AI聊天功能
  const sendMessage = useCallback(() => {
    if (!inputMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `关于 ${selectedCrypto} 的分析：基于当前技术指标，RSI处于65.42，MACD显示正向趋势。建议关注支撑位43200和阻力位44500。`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  }, [inputMessage, selectedCrypto]);

  const timeframes = [
    { label: "1分", value: "1m" },
    { label: "5分", value: "5m" },
    { label: "15分", value: "15m" },
    { label: "30分", value: "30m" },
    { label: "1小时", value: "1h" },
    { label: "4小时", value: "4h" },
    { label: "1日", value: "1d" },
    { label: "1周", value: "1w" },
    { label: "1月", value: "1M" }
  ];

  const technicalData = {
    rsi: "65.42",
    macd: "+0.68%", 
    volume: "$0.31B",
    high24h: "$44,532.81",
    low24h: "$42,222.47",
    open: "$43,744.00",
    close: "$43,832.25"
  };

  // 订单簿数据模拟
  const orderBookData = {
    asks: [
      { price: 4364.28, amount: 0.05, total: 706.99 },
      { price: 4364.27, amount: 7.70, total: 714.69 },
      { price: 4364.26, amount: 706.94, total: 706.94 },
      { price: 4364.25, amount: 1.99, total: 1.99 },
      { price: 4364.24, amount: 0.07, total: 1.99 }
    ],
    bids: [
      { price: 4364.13, amount: 1.02, total: 1.99 },
      { price: 4364.11, amount: 6.69, total: 2.00 },
      { price: 4364.10, amount: 7.70, total: 2.00 },
      { price: 4364.05, amount: 1.63, total: 2.00 },
      { price: 4364.00, amount: 7.74, total: 2.01 }
    ]
  };

  // 最近成交数据模拟
  const recentTrades = [
    { price: 4364.25, amount: 0.20, time: "21:14:19", type: "buy" },
    { price: 4364.24, amount: 1.92, time: "21:14:18", type: "sell" },
    { price: 4364.13, amount: 52.04, time: "21:14:17", type: "buy" },
    { price: 4364.11, amount: 20.00, time: "21:14:16", type: "sell" },
    { price: 4364.10, amount: 33.05, time: "21:14:15", type: "buy" }
  ];

  const handleAddAnnotation = useCallback((annotation: DrawingAnnotation) => {
    setDrawingAnnotations(prev => [...prev, annotation]);
  }, []);

  const handleDrawAnalysis = useCallback((coordinates: Array<{x: number, y: number}>, type: string) => {
    const newAnnotation: DrawingAnnotation = {
      id: Date.now().toString(),
      type: type as any,
      coordinates,
      color: '#3b82f6',
      text: 'AI分析',
      timestamp: new Date()
    };
    handleAddAnnotation(newAnnotation);
  }, [handleAddAnnotation]);

  return (
    <div className="fixed inset-0 bg-black/98 backdrop-blur-sm z-50">
      <div className="w-full h-full bg-slate-950 border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        
        {/* 币安风格顶部价格栏 */}
        <div className="bg-slate-900/95 border-b border-slate-700 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* 左侧 - 交易对和价格信息 */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xs">{selectedCrypto.slice(0,3)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedCrypto}/USDT
                  </h2>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2">
                    现货
                  </Badge>
                </div>
              </div>
              
              {/* 实时价格信息 */}
              <div className="flex items-center gap-8">
                <div className="space-y-1">
                  <div className={`text-3xl font-bold font-mono ${
                    priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm font-mono flex items-center gap-1 ${
                    priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {priceChangePercent >= 0 ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-6 text-xs">
                  <div>
                    <div className="text-slate-400 mb-1">指数价格</div>
                    <div className="text-white font-mono">${(currentPrice * 1.0001).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">标记价格</div>
                    <div className="text-white font-mono">${(currentPrice * 0.9999).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">资金费率/倒计时</div>
                    <div className="text-orange-400 font-mono">0.01% / 3小时45分40秒</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">24小时最低</div>
                    <div className="text-white font-mono">${(currentPrice * 0.95).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">24小时最高</div>
                    <div className="text-white font-mono">${(currentPrice * 1.05).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">持仓量</div>
                    <div className="text-white font-mono">688.42万张</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">24小时量</div>
                    <div className="text-white font-mono">6,000.72万张</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">24小时额</div>
                    <div className="text-white font-mono">$261.38亿</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧 - 控制按钮 */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-700 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 导航标签栏 */}
        <div className="bg-slate-900/50 border-b border-slate-700/50 px-6">
          <div className="flex items-center gap-8 py-2">
            <div className="flex items-center gap-6 text-sm">
              <span className="text-white font-medium border-b-2 border-yellow-400 pb-2">现货</span>
              <span className="text-slate-400 hover:text-white cursor-pointer">BTC/USDT</span>
              <span className="text-slate-400 hover:text-white cursor-pointer">ETH/USDT</span>
              <span className="text-slate-400 hover:text-white cursor-pointer">OKB/USDT</span>
              <span className="text-slate-400 hover:text-white cursor-pointer">XRP/USDT</span>
              <span className="text-slate-400 hover:text-white cursor-pointer">SOL/USDT</span>
              <span className="text-slate-400 hover:text-white cursor-pointer">DOGE/USDT</span>
              <span className="text-slate-400 hover:text-white cursor-pointer">ADA/USDT</span>
              <span className="text-slate-400 hover:text-white cursor-pointer">LINK/USDT</span>
              <span className="text-slate-400 hover:text-white cursor-pointer">添加自选</span>
            </div>
          </div>
        </div>

        {/* 主体布局 */}
        <div className="flex flex-1 min-h-0">
          
          {/* 左侧绘图工具栏 */}
          <div className="w-12 bg-slate-900/50 border-r border-slate-700/50 flex flex-col items-center py-4 gap-2">
            {[
              { icon: Crosshair, key: 'cursor', tooltip: '十字光标' },
              { icon: Minus, key: 'line', tooltip: '趋势线' },
              { icon: Plus, key: 'horizontal', tooltip: '水平线' },
              { icon: Target, key: 'vertical', tooltip: '垂直线' },
              { icon: TrendingUpIcon, key: 'fibonacci', tooltip: '斐波那契' },
              { icon: Palette, key: 'brush', tooltip: '画笔' },
              { icon: Type, key: 'text', tooltip: '文字' },
              { icon: Smile, key: 'emoji', tooltip: '表情' },
              { icon: RotateCcw, key: 'clear', tooltip: '清除' }
            ].map((tool) => (
              <Button
                key={tool.key}
                size="sm"
                variant={selectedDrawingTool === tool.key ? "default" : "ghost"}
                onClick={() => setSelectedDrawingTool(tool.key)}
                className={`h-8 w-8 p-0 ${
                  selectedDrawingTool === tool.key 
                    ? 'bg-yellow-500 text-black' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
                title={tool.tooltip}
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          {/* 中间区域：图表和时间周期 */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* 图表头部 - 时间周期和OHLCV信息 */}
            <div className="bg-slate-900/30 border-b border-slate-700/30 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.value}
                    variant={selectedTimeframe === tf.value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(tf.value)}
                    className={selectedTimeframe === tf.value 
                      ? "bg-yellow-500 text-black text-xs h-6 px-3 font-medium" 
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50 text-xs h-6 px-3"
                    }
                  >
                    {tf.label}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <span className="text-slate-400">开: <span className="text-white">{currentPrice.toFixed(2)}</span></span>
                <span className="text-slate-400">高: <span className="text-green-400">{(currentPrice * 1.02).toFixed(2)}</span></span>
                <span className="text-slate-400">低: <span className="text-red-400">{(currentPrice * 0.98).toFixed(2)}</span></span>
                <span className="text-slate-400">收: <span className="text-white">{currentPrice.toFixed(2)}</span></span>
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                  币安实时数据
                </Badge>
              </div>
            </div>

            {/* 主图表区域 */}
            <div className="flex-1 bg-slate-950 relative min-h-0">
              <BinanceKlineChart 
                key={`${selectedCrypto}-${refreshKey}`}
                symbol={selectedCrypto} 
                className="h-full w-full"
              />
            </div>

            {/* 成交量图表区域 */}
            <div className="h-32 bg-slate-900/30 border-t border-slate-700/30 relative">
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                成交量(Volume) SMA 250.271K
              </div>
            </div>

          </div>

          {/* 右侧面板组合 */}
          <div className="flex">
            {/* 订单簿面板 */}
            {showOrderBook && (
              <div className="w-80 bg-slate-900/50 border-l border-slate-700/50">
                <Tabs defaultValue="orderbook" className="h-full">
                  <TabsList className="grid grid-cols-3 bg-slate-800/50 border-b border-slate-700/50 w-full h-10">
                    <TabsTrigger value="orderbook" className="text-xs">订单簿</TabsTrigger>
                    <TabsTrigger value="trades" className="text-xs">最新成交</TabsTrigger>
                    <TabsTrigger value="depth" className="text-xs">深度图</TabsTrigger>
                  </TabsList>

                  <TabsContent value="orderbook" className="mt-0 h-full p-3">
                    <div className="space-y-3">
                      <div className="text-xs text-slate-400 grid grid-cols-3 gap-2">
                        <span>价格(USDT)</span>
                        <span className="text-right">数量({selectedCrypto})</span>
                        <span className="text-right">合计({selectedCrypto})</span>
                      </div>

                      {/* 卖单区域 */}
                      <div className="space-y-0.5">
                        {Array.from({length: 8}, (_, i) => {
                          const price = currentPrice + (i + 1) * 0.50;
                          const amount = Math.random() * 100;
                          const total = Math.random() * 1000;
                          return (
                            <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-red-500/10 p-1 rounded cursor-pointer">
                              <span className="text-red-400 font-mono">{price.toFixed(2)}</span>
                              <span className="text-right text-white font-mono">{amount.toFixed(2)}</span>
                              <span className="text-right text-slate-400 font-mono">{total.toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* 当前价格指示器 */}
                      <div className="flex items-center justify-between py-2 border-y border-slate-700/50">
                        <div className={`text-lg font-bold font-mono ${priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {currentPrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500">≈ $4,364.13</div>
                      </div>

                      {/* 买单区域 */}
                      <div className="space-y-0.5">
                        {Array.from({length: 8}, (_, i) => {
                          const price = currentPrice - (i + 1) * 0.50;
                          const amount = Math.random() * 100;
                          const total = Math.random() * 1000;
                          return (
                            <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-green-500/10 p-1 rounded cursor-pointer">
                              <span className="text-green-400 font-mono">{price.toFixed(2)}</span>
                              <span className="text-right text-white font-mono">{amount.toFixed(2)}</span>
                              <span className="text-right text-slate-400 font-mono">{total.toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* 底部统计 */}
                      <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>71.05%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>28.95%</span>
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="trades" className="mt-0 h-full p-3">
                    <div className="space-y-2">
                      <div className="text-xs text-slate-400 grid grid-cols-3 gap-2">
                        <span>价格(USDT)</span>
                        <span className="text-right">数量({selectedCrypto})</span>
                        <span className="text-right">时间</span>
                      </div>
                      <div className="space-y-0.5">
                        {Array.from({length: 20}, (_, i) => {
                          const price = currentPrice + (Math.random() - 0.5) * 10;
                          const amount = Math.random() * 50;
                          const isBuy = Math.random() > 0.5;
                          const time = new Date(Date.now() - i * 60000).toLocaleTimeString().slice(-8);
                          return (
                            <div key={i} className="grid grid-cols-3 gap-2 text-xs p-1 rounded hover:bg-slate-700/30">
                              <span className={`font-mono ${isBuy ? 'text-green-400' : 'text-red-400'}`}>
                                {price.toFixed(2)}
                              </span>
                              <span className="text-right text-white font-mono">{amount.toFixed(2)}</span>
                              <span className="text-right text-slate-400 font-mono">{time}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* AI聊天面板 */}
            {showAIChat && (
              <div className="w-80 bg-slate-900/50 border-l border-slate-700/50 flex flex-col">
                <div className="bg-slate-800/50 border-b border-slate-700/50 p-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-400" />
                    AI 分析师 - {selectedCrypto}
                  </h3>
                </div>

                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-slate-400 text-sm">
                      <Bot className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                      <p>我是您的专业AI分析师</p>
                      <p className="text-xs mt-1">询问技术指标、价格预测或交易建议</p>
                    </div>
                  )}
                  
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.type === 'ai' && (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[75%] rounded-lg p-2.5 text-sm ${
                        message.type === 'user' 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-slate-800 text-white'
                      }`}>
                        {message.content}
                        <div className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-black/60' : 'text-slate-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800/50 border-t border-slate-700/50 p-3">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="询问关于交易的问题..."
                      className="flex-1 bg-slate-900/50 border-slate-700 text-white placeholder-slate-400 text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button 
                      onClick={sendMessage}
                      size="sm"
                      disabled={!inputMessage.trim()}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black p-2"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧功能切换按钮 */}
          <div className="w-12 bg-slate-900/50 border-l border-slate-700/50 flex flex-col items-center py-4 gap-2">
            <Button
              size="sm"
              variant={showOrderBook ? "default" : "ghost"}
              onClick={() => setShowOrderBook(!showOrderBook)}
              className={`h-8 w-8 p-0 ${
                showOrderBook 
                  ? 'bg-yellow-500 text-black' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title="订单簿"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={showAIChat ? "default" : "ghost"}
              onClick={() => setShowAIChat(!showAIChat)}
              className={`h-8 w-8 p-0 ${
                showAIChat 
                  ? 'bg-yellow-500 text-black' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title="AI分析"
            >
              <Bot className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchKlineData}
              disabled={loading}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
              title="刷新数据"
            >
              <Activity className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};