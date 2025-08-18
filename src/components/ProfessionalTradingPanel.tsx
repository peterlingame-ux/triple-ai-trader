import React, { useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Settings
} from "lucide-react";
import { EnhancedChartPanel } from "./EnhancedChartPanel";
import { EnhancedAIChat } from "./EnhancedAIChat";
import { SimpleTradingChart } from "./SimpleTradingChart";
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

  const currentCrypto = cryptoData.find(c => c.symbol === selectedCrypto) || cryptoData[0];

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
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full h-full bg-slate-900 border-slate-700 shadow-2xl overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="bg-slate-800/90 border-b border-slate-700 p-2">
          <div className="flex items-center justify-between">
            {/* 左侧 - 标题和货币信息 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-bold text-white">
                  {selectedCrypto}/USDT 永续
                </h2>
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  实时
                </Badge>
              </div>
              
              {/* 价格信息 */}
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-2xl font-bold text-white">
                    ${currentCrypto?.price?.toFixed(2) || "43,364.25"}
                  </div>
                  <div className={`text-sm flex items-center gap-1 ${
                    (currentCrypto?.changePercent24h || -2.34) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(currentCrypto?.changePercent24h || -2.34) >= 0 ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {(currentCrypto?.changePercent24h || -2.34).toFixed(2)}% 
                    (${Math.abs(currentCrypto?.change24h || -104.69).toFixed(2)})
                  </div>
                </div>

                <div className="text-xs text-slate-400 grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-slate-500">24h最高</div>
                    <div className="text-white">${technicalData.high24h}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">24h最低</div>
                    <div className="text-white">${technicalData.low24h}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">24h量(BTC)</div>
                    <div className="text-white">688.42万</div>
                  </div>
                  <div>
                    <div className="text-slate-500">24h额</div>
                    <div className="text-white">$261.88亿</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧 - 控制按钮 */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowOrderBook(!showOrderBook)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs h-7"
              >
                <Eye className="w-3 h-3 mr-1" />
                订单簿
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAIChat(!showAIChat)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs h-7"
              >
                <Zap className="w-3 h-3 mr-1" />
                AI分析
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs h-7"
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs h-7"
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-700 h-7"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex h-full">
          {/* 左侧 - 图表区域 */}
          <div className={`${showOrderBook && showAIChat ? 'w-2/3' : showOrderBook || showAIChat ? 'w-3/4' : 'w-full'} flex flex-col`}>
            {/* 时间周期和工具栏 */}
            <div className="bg-slate-800/50 border-b border-slate-700/50 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {timeframes.map((tf) => (
                    <Button
                      key={tf.value}
                      variant={selectedTimeframe === tf.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedTimeframe(tf.value)}
                      className={selectedTimeframe === tf.value 
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs h-6 px-2" 
                        : "text-slate-300 hover:text-white hover:bg-slate-700 text-xs h-6 px-2"
                      }
                    >
                      {tf.label}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>开: <span className="text-white">${technicalData.open}</span></span>
                  <span>高: <span className="text-green-400">${technicalData.high24h}</span></span>
                  <span>低: <span className="text-red-400">${technicalData.low24h}</span></span>
                  <span>收: <span className="text-white">${technicalData.close}</span></span>
                  <span>量: <span className="text-blue-400">{technicalData.volume}</span></span>
                </div>
              </div>
            </div>

            {/* K线图表 */}
            <div className="flex-1 bg-slate-900 relative">
              <SimpleTradingChart 
                symbol={selectedCrypto} 
                className="h-full w-full"
              />
              
              {/* AI绘制的标记和注释 */}
              {drawingAnnotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className="absolute pointer-events-none z-10"
                  style={{
                    left: annotation.coordinates[0]?.x || 0,
                    top: annotation.coordinates[0]?.y || 0,
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full border-2" 
                    style={{ backgroundColor: annotation.color, borderColor: annotation.color }}
                  ></div>
                  {annotation.text && (
                    <div className="bg-slate-900/90 text-white text-xs p-2 rounded mt-1 whitespace-nowrap border border-slate-600">
                      {annotation.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 底部技术指标 */}
            <div className="bg-slate-800/50 border-t border-slate-700/50 p-2">
              <div className="flex items-center gap-6 text-xs text-slate-400">
                <span>RSI(14): <span className="text-yellow-400">{technicalData.rsi}</span></span>
                <span>MACD: <span className="text-green-400">{technicalData.macd}</span></span>
                <span>成交量: <span className="text-blue-400">{technicalData.volume}</span></span>
                <span>资金费率: <span className="text-orange-400">0.01%</span></span>
              </div>
            </div>
          </div>

          {/* 右侧面板 */}
          <div className="flex">
            {/* 订单簿 */}
            {showOrderBook && (
              <div className="w-80 bg-slate-800/30 border-l border-slate-700/50">
                <Tabs defaultValue="orderbook" className="h-full">
                  <TabsList className="grid grid-cols-3 bg-slate-800/50 border-b border-slate-700 w-full h-8">
                    <TabsTrigger value="orderbook" className="text-xs">订单簿</TabsTrigger>
                    <TabsTrigger value="trades" className="text-xs">最新成交</TabsTrigger>
                    <TabsTrigger value="chart" className="text-xs">深度图</TabsTrigger>
                  </TabsList>

                  <TabsContent value="orderbook" className="mt-0 h-full">
                    <div className="p-2">
                      <div className="text-xs text-slate-400 grid grid-cols-3 gap-2 mb-2">
                        <span>价格(USDT)</span>
                        <span className="text-right">数量(BTC)</span>
                        <span className="text-right">合计(BTC)</span>
                      </div>

                      {/* 卖单 */}
                      <div className="space-y-0.5 mb-3">
                        {orderBookData.asks.map((ask, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2 text-xs hover:bg-red-500/10 p-1 rounded">
                            <span className="text-red-400">{ask.price.toFixed(2)}</span>
                            <span className="text-right text-white">{ask.amount.toFixed(2)}</span>
                            <span className="text-right text-slate-400">{ask.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* 当前价格 */}
                      <div className="text-center py-2 border-y border-slate-700/50 mb-3">
                        <div className="text-lg font-bold text-red-400">
                          ${currentCrypto?.price?.toFixed(2) || "43,364.25"}
                        </div>
                        <div className="text-xs text-slate-500">最新成交价</div>
                      </div>

                      {/* 买单 */}
                      <div className="space-y-0.5">
                        {orderBookData.bids.map((bid, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2 text-xs hover:bg-green-500/10 p-1 rounded">
                            <span className="text-green-400">{bid.price.toFixed(2)}</span>
                            <span className="text-right text-white">{bid.amount.toFixed(2)}</span>
                            <span className="text-right text-slate-400">{bid.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="trades" className="mt-0 h-full">
                    <div className="p-2">
                      <div className="text-xs text-slate-400 grid grid-cols-3 gap-2 mb-2">
                        <span>价格(USDT)</span>
                        <span className="text-right">数量(BTC)</span>
                        <span className="text-right">时间</span>
                      </div>
                      <div className="space-y-0.5">
                        {recentTrades.map((trade, index) => (
                          <div key={index} className={`grid grid-cols-3 gap-2 text-xs p-1 rounded hover:bg-slate-700/30`}>
                            <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                              {trade.price.toFixed(2)}
                            </span>
                            <span className="text-right text-white">{trade.amount.toFixed(2)}</span>
                            <span className="text-right text-slate-400">{trade.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* AI聊天面板 */}
            {showAIChat && (
              <div className="w-80 border-l border-slate-700/50">
                <EnhancedAIChat
                  selectedCrypto={selectedCrypto}
                  aiConfigs={aiConfigs}
                  customApis={[]}
                  onDrawAnalysis={handleDrawAnalysis}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};