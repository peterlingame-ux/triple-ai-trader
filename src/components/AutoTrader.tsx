import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  TrendingUp, 
  Settings, 
  Play, 
  Pause, 
  DollarSign, 
  BarChart3, 
  Activity,
  Zap,
  AlertTriangle,
  Target,
  Clock,
  Award
} from "lucide-react";

interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  winRate: number;
  risk: 'low' | 'medium' | 'high';
  leverage: number;
}

interface TradingStats {
  totalAssets: number;
  dailyProfit: number;
  monthlyProfit: number;
  winRate: number;
  activeTrades: number;
  totalTrades: number;
}

export const AutoTrader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [customAmount, setCustomAmount] = useState("100000");
  const [tradingType, setTradingType] = useState<"spot" | "contract">("contract");
  const [selectedStrategy, setSelectedStrategy] = useState("stable");
  const [leverage, setLeverage] = useState([10]);
  const [riskLevel, setRiskLevel] = useState("medium");
  const { t } = useLanguage();
  const { toast } = useToast();

  const [stats, setStats] = useState<TradingStats>({
    totalAssets: 100000,
    dailyProfit: 0,
    monthlyProfit: 0,
    winRate: 0,
    activeTrades: 0,
    totalTrades: 0
  });

  const [tradingHistory, setTradingHistory] = useState<Array<{
    time: string;
    pair: string;
    type: string;
    amount: number;
    profit: number;
    status: 'profit' | 'loss' | 'pending';
  }>>([]);

  const strategies: TradingStrategy[] = [
    {
      id: "stable",
      name: "稳健策略",
      description: "低风险高胜率策略，适合稳定盈利",
      winRate: 92,
      risk: "low",
      leverage: 5
    },
    {
      id: "aggressive", 
      name: "激进策略",
      description: "高收益策略，适合追求最大利润",
      winRate: 78,
      risk: "high",
      leverage: 20
    },
    {
      id: "balanced",
      name: "平衡策略", 
      description: "风险收益平衡，适合大多数用户",
      winRate: 85,
      risk: "medium",
      leverage: 10
    }
  ];

  useEffect(() => {
    const amount = parseFloat(customAmount) || 100000;
    setStats(prev => ({ ...prev, totalAssets: amount }));
  }, [customAmount]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        // 模拟AI交易
        const strategy = strategies.find(s => s.id === selectedStrategy)!;
        const profit = (Math.random() - 0.3) * 1000; // 70% chance of profit
        const isProfit = profit > 0;
        
        // 添加交易记录
        const newTrade = {
          time: new Date().toLocaleTimeString(),
          pair: `BTC/USDT`,
          type: tradingType === "contract" ? `${leverage[0]}x合约` : "现货",
          amount: Math.floor(Math.random() * 5000) + 1000,
          profit: profit,
          status: isProfit ? 'profit' as const : 'loss' as const
        };
        
        setTradingHistory(prev => [newTrade, ...prev.slice(0, 9)]);
        
        // 更新统计数据
        setStats(prev => ({
          ...prev,
          dailyProfit: prev.dailyProfit + profit,
          monthlyProfit: prev.monthlyProfit + profit,
          totalTrades: prev.totalTrades + 1,
          activeTrades: Math.floor(Math.random() * 5) + 1,
          winRate: ((prev.winRate * (prev.totalTrades - 1) + (isProfit ? 100 : 0)) / prev.totalTrades) || 0
        }));
        
        if (isProfit) {
          toast({
            title: "AI交易盈利",
            description: `成功盈利 $${profit.toFixed(2)}`,
          });
        }
      }, 3000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, selectedStrategy, leverage, tradingType, toast]);

  const handleStart = () => {
    setIsRunning(true);
    toast({
      title: "AI自动交易已启动",
      description: `使用${strategies.find(s => s.id === selectedStrategy)?.name}开始智能交易`,
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    toast({
      title: "AI自动交易已停止",
      description: "交易系统安全停止",
      variant: "destructive",
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'high': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-orbitron tracking-wide px-6 py-2"
          size="lg"
        >
          <Bot className="w-5 h-5 mr-2" />
          AI自动交易系统
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[1200px] bg-slate-900 border-slate-700 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 font-orbitron text-xl">
            <Bot className="w-6 h-6 text-blue-400" />
            AI全自动交易系统 - 智能盈利引擎
            {isRunning && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                <Activity className="w-3 h-3 mr-1" />
                运行中
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <div className="space-y-4">
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">交易策略控制</h3>
              </div>
              
              {/* 交易策略选择 */}
              <div className="space-y-3 mb-4">
                <label className="text-slate-300 text-sm">交易策略</label>
                <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="选择交易策略" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.id} value={strategy.id} className="text-white focus:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <span>{strategy.name}</span>
                          <Badge className={`text-xs ${getRiskColor(strategy.risk)}`}>
                            {strategy.winRate}%胜率
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 交易类型 */}
              <div className="space-y-3 mb-4">
                <label className="text-slate-300 text-sm">交易类型</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tradingType === "spot" ? "default" : "outline"}
                    onClick={() => setTradingType("spot")}
                    className={tradingType === "spot" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-600 text-slate-300"}
                  >
                    现货交易
                  </Button>
                  <Button
                    variant={tradingType === "contract" ? "default" : "outline"}
                    onClick={() => setTradingType("contract")}
                    className={tradingType === "contract" ? "bg-purple-600 hover:bg-purple-700" : "border-slate-600 text-slate-300"}
                  >
                    合约交易
                  </Button>
                </div>
              </div>

              {/* 杠杆倍数 (仅合约交易) */}
              {tradingType === "contract" && (
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <label className="text-slate-300 text-sm">杠杆倍数</label>
                    <span className="text-white text-sm">{leverage[0]}x</span>
                  </div>
                  <Slider
                    value={leverage}
                    onValueChange={setLeverage}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1x</span>
                    <span>100x</span>
                  </div>
                </div>
              )}

              {/* 启动控制 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">AI自动交易</span>
                  <Switch checked={isRunning} onCheckedChange={isRunning ? handleStop : handleStart} />
                </div>
                <Button 
                  onClick={isRunning ? handleStop : handleStart}
                  className={`w-full ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      停止交易
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      开始AI交易
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* 虚拟交易账户 */}
            <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-semibold">交易账户</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-slate-300 text-sm">总资产 (USD)</label>
                  <Input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white text-xl font-bold text-center"
                    placeholder="100000"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-slate-400 text-xs">今日盈亏</p>
                    <p className={`font-bold ${stats.dailyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stats.dailyProfit >= 0 ? '+' : ''}${stats.dailyProfit.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs">月度盈亏</p>
                    <p className={`font-bold ${stats.monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stats.monthlyProfit >= 0 ? '+' : ''}${stats.monthlyProfit.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 中间和右侧区域 */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="realtime" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                <TabsTrigger value="realtime" className="text-white data-[state=active]:bg-blue-600">
                  实时动态
                </TabsTrigger>
                <TabsTrigger value="signals" className="text-white data-[state=active]:bg-blue-600">
                  AI信号
                </TabsTrigger>
                <TabsTrigger value="positions" className="text-white data-[state=active]:bg-blue-600">
                  持仓管理
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-600">
                  数据分析
                </TabsTrigger>
              </TabsList>

              <TabsContent value="realtime" className="space-y-4">
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-semibold">AI实时交易动态</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      LIVE
                    </Badge>
                  </div>
                  
                  {!isRunning ? (
                    <div className="text-center py-12">
                      <Bot className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">AI系统待命中...</p>
                      <p className="text-slate-500 text-sm mt-2">启动自动交易以查看实时动态</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {tradingHistory.map((trade, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${trade.status === 'profit' ? 'bg-green-400' : 'bg-red-400'}`} />
                            <div>
                              <p className="text-white text-sm">{trade.pair} - {trade.type}</p>
                              <p className="text-slate-400 text-xs">{trade.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-300 text-sm">${trade.amount.toLocaleString()}</p>
                            <p className={`text-sm font-bold ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="signals" className="space-y-4">
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-white font-semibold">AI交易信号</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div>
                        <p className="text-green-400 font-semibold">BTC/USDT 做多信号</p>
                        <p className="text-slate-300 text-sm">技术指标显示强烈买入信号</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">强烈推荐</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div>
                        <p className="text-blue-400 font-semibold">ETH/USDT 震荡</p>
                        <p className="text-slate-300 text-sm">等待更明确的突破信号</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">观望</Badge>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="positions" className="space-y-4">
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-purple-400" />
                    <h3 className="text-white font-semibold">当前持仓</h3>
                  </div>
                  <div className="text-center py-8">
                    <p className="text-slate-400">当前持仓: {stats.activeTrades} 笔</p>
                    <p className="text-slate-500 text-sm mt-2">总交易次数: {stats.totalTrades}</p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <Card className="p-6 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <h3 className="text-white font-semibold">交易统计</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-slate-300 text-sm">胜率</p>
                      <p className="text-white text-2xl font-bold">{stats.winRate.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                      <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-slate-300 text-sm">运行时长</p>
                      <p className="text-white text-2xl font-bold">{isRunning ? '运行中' : '未启动'}</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* 警告声明 */}
            <Card className="p-4 bg-yellow-500/10 border-yellow-500/30 mt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-semibold mb-1">虚拟交易系统 - 全自动盈利引擎</p>
                  <p className="text-xs">• 本系统使用虚拟资金进行策略测试 • AI自动分析、入场、止损、止盈，用户无需任何操作 • 稳健策略追求稳定收益(≥90%胜率)，激进策略追求最高收益(≥70%胜率) • 实盘交易存在风险，请谨慎操作 • AI信号仅供参考，不构成投资建议</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};