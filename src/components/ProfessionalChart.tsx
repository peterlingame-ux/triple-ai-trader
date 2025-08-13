import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Activity, Maximize2, Settings, Brain } from "lucide-react";

interface ProfessionalChartProps {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
}

export const ProfessionalChart = ({ symbol, price, change24h, changePercent24h }: ProfessionalChartProps) => {
  const isPositive = changePercent24h >= 0;

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-600/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-bold text-foreground">{symbol}</CardTitle>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : symbol === 'SOL' ? 'Solana' : symbol}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-3">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-2">
          <div>
            <p className="text-3xl font-bold text-foreground">
              ${price.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${isPositive ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'} border-current/30`}>
                {isPositive ? '+' : ''}{changePercent24h.toFixed(2)}%
              </Badge>
              <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}${change24h.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="chart" className="text-xs">价格图表</TabsTrigger>
            <TabsTrigger value="volume" className="text-xs">成交量</TabsTrigger>
            <TabsTrigger value="depth" className="text-xs">订单深度</TabsTrigger>
            <TabsTrigger value="trades" className="text-xs">实时交易</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="mt-4">
            <div className="relative">
              {/* Time frame selector */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 px-3 bg-slate-700/50">1H</Button>
                  <Button variant="outline" size="sm" className="h-8 px-3">1D</Button>
                  <Button variant="outline" size="sm" className="h-8 px-3">1W</Button>
                  <Button variant="outline" size="sm" className="h-8 px-3">1M</Button>
                </div>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Activity className="w-3 h-3 mr-1" />
                  实时数据
                </Badge>
              </div>
              
              {/* Chart placeholder */}
              <div className="h-64 bg-slate-800/30 border border-slate-700/30 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simulated chart lines */}
                <div className="absolute inset-0 p-4">
                  <svg className="w-full h-full">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3"/>
                        <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.05"/>
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    <g stroke="#374151" strokeWidth="0.5" opacity="0.3">
                      {[...Array(5)].map((_, i) => (
                        <line key={`h-${i}`} x1="0" y1={i * 50} x2="100%" y2={i * 50} />
                      ))}
                      {[...Array(8)].map((_, i) => (
                        <line key={`v-${i}`} x1={`${i * 12.5}%`} y1="0" x2={`${i * 12.5}%`} y2="100%" />
                      ))}
                    </g>
                    
                    {/* Simulated price line */}
                    <path
                      d="M 0 150 Q 50 120 100 100 T 200 110 T 300 90 T 400 120 T 500 100"
                      stroke={isPositive ? "#10b981" : "#ef4444"}
                      strokeWidth="2"
                      fill="url(#chartGradient)"
                      opacity="0.8"
                    />
                  </svg>
                </div>
                
                <div className="text-center z-10">
                  <BarChart3 className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">交互式蜡烛图 (1D)</p>
                  <p className="text-xs text-slate-500 mt-1">实时K线数据 - {symbol}</p>
                </div>
              </div>
              
              {/* Chart controls */}
              <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span>开盘: ${(price * 0.98).toFixed(2)}</span>
                  <span>最高: ${(price * 1.05).toFixed(2)}</span>
                  <span>最低: ${(price * 0.92).toFixed(2)}</span>
                  <span>收盘: ${price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    AI分析
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="volume" className="mt-4">
            <div className="h-48 bg-slate-800/30 border border-slate-700/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">成交量分析图表</p>
                <p className="text-xs text-slate-500 mt-1">24H成交量: $2.4B</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="depth" className="mt-4">
            <div className="h-48 bg-slate-800/30 border border-slate-700/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">订单深度图</p>
                <p className="text-xs text-slate-500 mt-1">买卖盘分布可视化</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trades" className="mt-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-800/30 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge className={`${Math.random() > 0.5 ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'} text-xs`}>
                      {Math.random() > 0.5 ? 'BUY' : 'SELL'}
                    </Badge>
                    <span className="text-slate-400">{(Math.random() * 5).toFixed(3)}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground">${(price + (Math.random() - 0.5) * 100).toFixed(2)}</p>
                    <p className="text-slate-500">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};