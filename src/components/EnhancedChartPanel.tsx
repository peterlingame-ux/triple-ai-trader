import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Newspaper,
  Settings,
  Pencil,
  Eraser,
  Target,
  TrendingUpIcon,
  Volume2,
  Zap
} from "lucide-react";
import { BinanceKlineChart } from "./BinanceKlineChart";
import { useLanguage } from "@/hooks/useLanguage";

interface CryptoOption {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface TechnicalIndicator {
  name: string;
  value: string;
  color: string;
  signal?: 'buy' | 'sell' | 'neutral';
}

interface DrawingAnnotation {
  id: string;
  type: 'line' | 'support' | 'resistance' | 'fibonacci' | 'note';
  coordinates: Array<{x: number, y: number}>;
  color: string;
  text?: string;
  timestamp: Date;
}

interface EnhancedChartPanelProps {
  selectedCrypto: string;
  onCryptoChange: (crypto: string) => void;
  cryptoOptions: CryptoOption[];
  drawingAnnotations: DrawingAnnotation[];
  onAddAnnotation: (annotation: DrawingAnnotation) => void;
}

export const EnhancedChartPanel = ({ 
  selectedCrypto, 
  onCryptoChange, 
  cryptoOptions,
  drawingAnnotations,
  onAddAnnotation 
}: EnhancedChartPanelProps) => {
  const { t } = useLanguage();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [drawingMode, setDrawingMode] = useState<string | null>(null);
  const [showIndicators, setShowIndicators] = useState(true);
  const [activeTab, setActiveTab] = useState("chart");
  const chartRef = useRef<HTMLDivElement>(null);

  const currentCrypto = cryptoOptions.find(c => c.symbol === selectedCrypto) || cryptoOptions[0];

  const timeframes = [
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "30m", value: "30m" },
    { label: "1H", value: "1H" },
    { label: "4H", value: "4H" },
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" }
  ];

  const technicalIndicators: TechnicalIndicator[] = [
    { name: "RSI(14)", value: "59.18", color: "text-yellow-400", signal: "neutral" },
    { name: "MACD", value: "0.68%", color: "text-green-400", signal: "buy" },
    { name: "KDJ", value: "43.5", color: "text-purple-400", signal: "neutral" },
    { name: "布林带", value: "中轨", color: "text-blue-400", signal: "neutral" },
    { name: "成交量", value: "$0.31B", color: "text-orange-400" },
    { name: "市值", value: "$859.2B", color: "text-cyan-400" }
  ];

  const movingAverages = [
    { period: "MA5", value: "$43613.1", color: "text-orange-400", position: "上方" },
    { period: "MA10", value: "$43481.7", color: "text-pink-400", position: "上方" },
    { period: "MA20", value: "$43245.8", color: "text-green-400", position: "下方" },
    { period: "MA50", value: "$42890.3", color: "text-blue-400", position: "下方" },
    { period: "MA200", value: "$41256.7", color: "text-red-400", position: "下方" }
  ];

  const supportResistanceLevels = [
    { type: "阻力位", value: "$44500", strength: "强", color: "text-red-400" },
    { type: "阻力位", value: "$44200", strength: "中", color: "text-orange-400" },
    { type: "当前价格", value: "$43832", strength: "-", color: "text-yellow-400" },
    { type: "支撑位", value: "$43200", strength: "中", color: "text-green-400" },
    { type: "支撑位", value: "$42800", strength: "强", color: "text-green-500" }
  ];

  const marketSentiment = {
    overall: "谨慎乐观",
    fearGreedIndex: 68,
    socialSentiment: "积极",
    institutionalFlow: "+$127M",
    retailSentiment: "FOMO"
  };

  // 处理图表点击事件
  const handleChartClick = useCallback((event: React.MouseEvent) => {
    if (!drawingMode || !chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newAnnotation: DrawingAnnotation = {
      id: Date.now().toString(),
      type: drawingMode as any,
      coordinates: [{ x, y }],
      color: drawingMode === 'support' ? '#22c55e' : drawingMode === 'resistance' ? '#ef4444' : '#3b82f6',
      timestamp: new Date()
    };

    onAddAnnotation(newAnnotation);
    setDrawingMode(null);
  }, [drawingMode, onAddAnnotation]);

  // 绘图工具
  const drawingTools = [
    { id: 'line', label: '趋势线', icon: Pencil, color: 'text-blue-400' },
    { id: 'support', label: '支撑位', icon: Target, color: 'text-green-400' },
    { id: 'resistance', label: '阻力位', icon: Target, color: 'text-red-400' },
    { id: 'fibonacci', label: '斐波那契', icon: Activity, color: 'text-purple-400' }
  ];

  return (
    <div className="space-y-3 h-full">
      {/* 顶部货币信息和控制 - 紧凑型 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 货币选择 */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <div className="p-2">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-3 h-3 text-yellow-400" />
              <span className="text-white font-medium text-xs">货币选择</span>
            </div>
            
            {/* 快速选择按钮 */}
            <div className="grid grid-cols-4 gap-1 mb-2">
              {cryptoOptions.slice(0, 8).map((crypto) => (
                <Button
                  key={crypto.symbol}
                  variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCryptoChange(crypto.symbol)}
                  className={selectedCrypto === crypto.symbol 
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs h-6" 
                    : "border-slate-600 text-slate-300 hover:bg-slate-700 text-xs h-6"
                  }
                >
                  {crypto.symbol}
                </Button>
              ))}
            </div>

            <Select value={selectedCrypto} onValueChange={onCryptoChange}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                {cryptoOptions.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white text-xs">
                    <div className="flex items-center justify-between w-full">
                      <span>{crypto.symbol} • {crypto.name}</span>
                      <span className={`text-xs ml-2 ${crypto.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {crypto.changePercent > 0 ? '+' : ''}{crypto.changePercent}%
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* 价格显示 */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <div className="p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-white">{currentCrypto.symbol}</span>
                <span className="text-slate-400 text-xs">{currentCrypto.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {currentCrypto.changePercent > 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs ${currentCrypto.changePercent > 0 ? "text-green-400" : "text-red-400"}`}>
                  {currentCrypto.changePercent > 0 ? "+" : ""}{currentCrypto.changePercent}%
                </span>
              </div>
            </div>
            
            <div className="text-xl font-bold text-white mb-0.5">
              ${currentCrypto.price.toLocaleString()}
            </div>
            
            <div className={`text-sm ${currentCrypto.change > 0 ? "text-green-400" : "text-red-400"}`}>
              {currentCrypto.change > 0 ? "+" : ""}${currentCrypto.change}
            </div>
          </div>
        </Card>
      </div>

      {/* 主图表区域 - 紧凑型 */}
      <div className="grid grid-cols-4 gap-3 flex-1">
        {/* 图表 */}
        <div className="col-span-3">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm h-full">
            <div className="p-2 h-full flex flex-col">
              {/* 图表控制栏 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{selectedCrypto}/USDT</h3>
                  <Badge variant="outline" className="text-green-400 border-green-400/20 text-xs px-1 py-0">
                    实时
                  </Badge>
                </div>
                
                {/* 绘图工具 */}
                <div className="flex items-center gap-1">
                  {drawingTools.map((tool) => (
                    <Button
                      key={tool.id}
                      size="sm"
                      variant={drawingMode === tool.id ? "default" : "outline"}
                      onClick={() => setDrawingMode(drawingMode === tool.id ? null : tool.id)}
                      className={`text-xs h-6 px-2 ${drawingMode === tool.id 
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black" 
                        : `border-slate-600 ${tool.color} hover:bg-slate-700`
                      }`}
                      title={tool.label}
                    >
                      <tool.icon className="w-2.5 h-2.5 mr-1" />
                      {tool.label}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDrawingMode(null)}
                    className="border-slate-600 text-slate-400 hover:bg-slate-700 text-xs h-6 px-2"
                  >
                    <Eraser className="w-2.5 h-2.5" />
                  </Button>
                </div>
              </div>

              {/* 时间周期选择 */}
              <div className="flex items-center gap-1 mb-2">
                {timeframes.slice(0, 9).map((tf) => (
                  <Button
                    key={tf.value}
                    variant={selectedTimeframe === tf.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(tf.value)}
                    className={selectedTimeframe === tf.value 
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs h-6 px-2" 
                      : "border-slate-600 text-slate-300 hover:bg-slate-700 text-xs h-6 px-2"
                    }
                  >
                    {tf.label}
                  </Button>
                ))}
              </div>

              {/* OHLCV 数据显示 */}
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                <span>开: <span className="text-white">$43744</span></span>
                <span>高: <span className="text-green-400">$44763</span></span>
                <span>低: <span className="text-red-400">$42767</span></span>
                <span>收: <span className="text-white">$43832</span></span>
                <span>量: <span className="text-blue-400">125.8K</span></span>
              </div>

              {/* 图表容器 */}
              <div 
                ref={chartRef}
                className="flex-1 relative cursor-crosshair"
                onClick={handleChartClick}
              >
                <BinanceKlineChart 
                  symbol={selectedCrypto} 
                  className="h-full w-full"
                />
                
                {/* AI绘制的标记和注释 */}
                {drawingAnnotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: annotation.coordinates[0]?.x || 0,
                      top: annotation.coordinates[0]?.y || 0,
                      borderColor: annotation.color
                    }}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full border`} style={{ backgroundColor: annotation.color }}></div>
                    {annotation.text && (
                      <div className="bg-slate-900/90 text-white text-xs p-1 rounded mt-0.5 whitespace-nowrap">
                        {annotation.text}
                      </div>
                    )}
                  </div>
                ))}

                {/* 绘图模式提示 */}
                {drawingMode && (
                  <div className="absolute top-2 left-2 bg-slate-900/90 text-yellow-400 text-xs p-1 rounded border border-yellow-400/30">
                    点击添加 {drawingTools.find(t => t.id === drawingMode)?.label}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* 右侧分析面板 */}
        <div className="col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid grid-cols-3 bg-slate-800/50 border-slate-700 w-full h-6">
              <TabsTrigger value="technical" className="text-xs">技术</TabsTrigger>
              <TabsTrigger value="levels" className="text-xs">位置</TabsTrigger>
              <TabsTrigger value="sentiment" className="text-xs">情绪</TabsTrigger>
            </TabsList>

            {/* 技术指标 */}
            <TabsContent value="technical" className="mt-2 h-full">
              <Card className="bg-slate-800/50 border-slate-700/50 h-full">
                <div className="p-2 space-y-2">
                  <div className="flex items-center gap-1 mb-2">
                    <Activity className="w-3 h-3 text-yellow-400" />
                    <h4 className="text-xs font-semibold text-white">技术指标</h4>
                  </div>

                  {/* 主要指标 */}
                  <div className="space-y-1">
                    {technicalIndicators.map((indicator, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-slate-300 text-xs">{indicator.name}</span>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs font-medium ${indicator.color}`}>
                            {indicator.value}
                          </span>
                          {indicator.signal && (
                            <div className={`w-1 h-1 rounded-full ${
                              indicator.signal === 'buy' ? 'bg-green-400' :
                              indicator.signal === 'sell' ? 'bg-red-400' : 'bg-yellow-400'
                            }`}></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 移动平均线 */}
                  <div className="pt-2 border-t border-slate-700/50">
                    <h5 className="text-yellow-400 text-xs font-medium mb-1">移动平均</h5>
                    <div className="space-y-1">
                      {movingAverages.slice(0, 4).map((ma, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-slate-300 text-xs">{ma.period}</span>
                          <div className="text-right">
                            <span className={`text-xs ${ma.color}`}>{ma.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* 支撑阻力位 */}
            <TabsContent value="levels" className="mt-2 h-full">
              <Card className="bg-slate-800/50 border-slate-700/50 h-full">
                <div className="p-2">
                  <div className="flex items-center gap-1 mb-2">
                    <Target className="w-3 h-3 text-yellow-400" />
                    <h4 className="text-xs font-semibold text-white">关键位置</h4>
                  </div>

                  <div className="space-y-1">
                    {supportResistanceLevels.map((level, index) => (
                      <div key={index} className="flex justify-between items-center p-1 rounded bg-slate-700/30">
                        <div>
                          <div className={`text-xs font-medium ${level.color}`}>{level.type}</div>
                        </div>
                        <div className={`text-xs font-bold ${level.color}`}>
                          {level.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* 市场情绪 */}
            <TabsContent value="sentiment" className="mt-2 h-full">
              <Card className="bg-slate-800/50 border-slate-700/50 h-full">
                <div className="p-2 space-y-2">
                  <div className="flex items-center gap-1 mb-2">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <h4 className="text-xs font-semibold text-white">市场情绪</h4>
                  </div>

                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400 mb-0.5">
                        {marketSentiment.fearGreedIndex}
                      </div>
                      <div className="text-xs text-slate-300">恐慌贪婪指数</div>
                      <div className="text-xs text-green-400">{marketSentiment.overall}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-300">社交情绪</span>
                        <span className="text-xs text-green-400">{marketSentiment.socialSentiment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-300">机构资金</span>
                        <span className="text-xs text-green-400">{marketSentiment.institutionalFlow}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-300">散户情绪</span>
                        <span className="text-xs text-orange-400">{marketSentiment.retailSentiment}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};