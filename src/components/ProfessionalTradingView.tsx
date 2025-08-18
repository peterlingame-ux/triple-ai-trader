import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target,
  Brain,
  LineChart,
  Layers,
  Newspaper
} from "lucide-react";
import { BinanceKlineChart } from "./BinanceKlineChart";
import { useCryptoData } from "@/hooks/useCryptoData";
import { CryptoSearch } from "./CryptoSearch";

interface CryptoOption {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const ProfessionalTradingView = () => {
  const { cryptoData, loading } = useCryptoData();
  const [selectedCrypto, setSelectedCrypto] = useState("BTCUSDT");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1H");
  const [searchQuery, setSearchQuery] = useState("");

  // 转换为CryptoOption格式
  const cryptoOptions: CryptoOption[] = useMemo(() => 
    cryptoData.map(crypto => ({
      symbol: `${crypto.symbol}USDT`,
      name: crypto.name,
      price: crypto.price,
      change: crypto.change24h,
      changePercent: crypto.changePercent24h
    })), [cryptoData]
  );

  const filteredOptions = useMemo(() => 
    cryptoOptions.filter(crypto => 
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [cryptoOptions, searchQuery]
  );

  const currentCrypto = cryptoOptions.find(c => c.symbol === selectedCrypto) || cryptoOptions[0];

  const timeframes = [
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "30m", value: "30m" },
    { label: "1H", value: "1H" },
    { label: "4H", value: "4H" },
    { label: "1D", value: "1D" },
    { label: "1W", value: "1W" }
  ];

  const technicalIndicators = [
    { name: "RSI(14)", value: "59.18", color: "text-yellow-400" },
    { name: "MACD", value: "0.68%", color: "text-green-400" },
    { name: "KDJ", value: "43.5", color: "text-blue-400" },
    { name: "成交量", value: "$0.31B", color: "text-orange-400" }
  ];

  const supportLevels = [
    { type: "阻力", value: "$44500", strength: "强", color: "text-red-400" },
    { type: "当前", value: "$43832", strength: "-", color: "text-white" },
    { type: "支撑", value: "$43200", strength: "中", color: "text-green-400" }
  ];

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        <div className="h-8 bg-slate-700 animate-pulse rounded"></div>
        <div className="h-96 bg-slate-700 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2 bg-slate-900 min-h-screen">
      {/* 顶部工具栏 */}
      <Card className="bg-slate-800 border-slate-700">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-blue-400" />
              <h1 className="text-sm font-semibold text-white">专业交易分析</h1>
              <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 text-xs">
                实时
              </Badge>
            </div>
            
            {/* 时间框架选择 */}
            <div className="flex items-center gap-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={selectedTimeframe === tf.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(tf.value)}
                  className={selectedTimeframe === tf.value 
                    ? "bg-blue-600 text-white h-6 px-2 text-xs" 
                    : "border-slate-600 text-slate-300 hover:bg-slate-700 h-6 px-2 text-xs"
                  }
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-5 gap-2 h-[calc(100vh-120px)]">
        {/* 左侧：货币选择 */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-2 h-full">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-3 h-3 text-blue-400" />
              <span className="text-white font-medium text-xs">货币选择</span>
            </div>
            
            {/* 搜索 */}
            <div className="mb-2">
              <CryptoSearch
                onSearch={setSearchQuery}
                onClearSearch={() => setSearchQuery("")}
                searchQuery={searchQuery}
                totalCryptos={cryptoOptions.length}
                filteredCount={filteredOptions.length}
              />
            </div>

            {/* 货币列表 */}
            <div className="space-y-1 overflow-y-auto h-[calc(100%-80px)]">
              {filteredOptions.slice(0, 20).map((crypto) => (
                <Button
                  key={crypto.symbol}
                  variant={selectedCrypto === crypto.symbol ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCrypto(crypto.symbol)}
                  className={`w-full justify-start h-8 px-2 text-xs ${
                    selectedCrypto === crypto.symbol 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{crypto.symbol.replace('USDT', '')}</span>
                    <span className={crypto.changePercent > 0 ? 'text-green-400' : 'text-red-400'}>
                      {crypto.changePercent > 0 ? '+' : ''}{crypto.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* 中间：价格信息和图表 */}
        <div className="col-span-3 space-y-2">
          {/* 价格信息 */}
          <Card className="bg-slate-800 border-slate-700">
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white">
                    {currentCrypto?.symbol.replace('USDT', '') || 'BTC'}
                  </span>
                  <span className="text-2xl font-bold text-white">
                    ${currentCrypto?.price.toLocaleString() || '0'}
                  </span>
                  <div className="flex items-center gap-1">
                    {(currentCrypto?.changePercent || 0) > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-semibold ${
                      (currentCrypto?.changePercent || 0) > 0 ? "text-green-400" : "text-red-400"
                    }`}>
                      {(currentCrypto?.changePercent || 0) > 0 ? "+" : ""}
                      {currentCrypto?.changePercent?.toFixed(2) || '0'}%
                    </span>
                    <span className={`text-xs ${
                      (currentCrypto?.change || 0) > 0 ? "text-green-400" : "text-red-400"
                    }`}>
                      ({(currentCrypto?.change || 0) > 0 ? "+" : ""}${currentCrypto?.change?.toFixed(2) || '0'})
                    </span>
                  </div>
                </div>
                
                {/* OHLCV 数据 */}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>开: <span className="text-white">$43744</span></span>
                  <span>高: <span className="text-green-400">$44763</span></span>
                  <span>低: <span className="text-red-400">$42767</span></span>
                  <span>量: <span className="text-blue-400">125.8K</span></span>
                </div>
              </div>
            </div>
          </Card>

          {/* 图表 */}
          <Card className="bg-slate-800 border-slate-700 flex-1">
            <div className="h-full">
              <BinanceKlineChart 
                symbol={selectedCrypto.replace('USDT', '')} 
                className="h-full w-full"
              />
            </div>
          </Card>
        </div>

        {/* 右侧：分析面板 */}
        <Card className="bg-slate-800 border-slate-700">
          <Tabs defaultValue="technical" className="h-full">
            <TabsList className="grid grid-cols-3 bg-slate-700/50 border-slate-600 w-full h-8">
              <TabsTrigger value="technical" className="text-xs">技术</TabsTrigger>
              <TabsTrigger value="levels" className="text-xs">位置</TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">AI</TabsTrigger>
            </TabsList>

            {/* 技术指标 */}
            <TabsContent value="technical" className="mt-2 p-2 space-y-2">
              <div className="flex items-center gap-1 mb-2">
                <Activity className="w-3 h-3 text-blue-400" />
                <h4 className="text-xs font-semibold text-white">技术指标</h4>
              </div>

              <div className="space-y-1">
                {technicalIndicators.map((indicator, index) => (
                  <div key={index} className="flex justify-between items-center p-1 rounded bg-slate-700/30">
                    <span className="text-slate-300 text-xs">{indicator.name}</span>
                    <span className={`text-xs font-medium ${indicator.color}`}>
                      {indicator.value}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 支撑阻力位 */}
            <TabsContent value="levels" className="mt-2 p-2 space-y-2">
              <div className="flex items-center gap-1 mb-2">
                <Target className="w-3 h-3 text-blue-400" />
                <h4 className="text-xs font-semibold text-white">关键位置</h4>
              </div>

              <div className="space-y-1">
                {supportLevels.map((level, index) => (
                  <div key={index} className="flex justify-between items-center p-1 rounded bg-slate-700/30">
                    <span className={`text-xs ${level.color}`}>{level.type}</span>
                    <span className={`text-xs font-bold ${level.color}`}>
                      {level.value}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* AI分析 */}
            <TabsContent value="ai" className="mt-2 p-2 space-y-2">
              <div className="flex items-center gap-1 mb-2">
                <Brain className="w-3 h-3 text-blue-400" />
                <h4 className="text-xs font-semibold text-white">AI分析</h4>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2 bg-slate-700/30 rounded">
                  <div className="font-medium text-green-400 mb-1">趋势分析</div>
                  <div>短期上涨趋势，建议关注支撑位</div>
                </div>
                
                <div className="p-2 bg-slate-700/30 rounded">
                  <div className="font-medium text-yellow-400 mb-1">风险提示</div>
                  <div>关注$44500阻力位突破</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};