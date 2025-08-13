import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Zap, 
  Target, 
  Shield, 
  Activity,
  BarChart3,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  Percent
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TradingSignal {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  reasoning: string;
  timestamp: Date;
  status: 'pending' | 'executed' | 'closed';
}

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entry: number;
  size: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  openTime: Date;
  status: 'open' | 'closed';
}

interface AutoTraderConfig {
  enabled: boolean;
  minConfidence: number;
  maxPositions: number;
  riskPerTrade: number;
  virtualBalance: number;
  allowedSymbols: string[];
  stopLoss: number;
  takeProfit: number;
}

export const AutoTrader = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AutoTraderConfig>({
    enabled: false,
    minConfidence: 90,
    maxPositions: 5,
    riskPerTrade: 2,
    virtualBalance: 100000,
    allowedSymbols: ['BTC', 'ETH', 'SOL'],
    stopLoss: 5,
    takeProfit: 10
  });

  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [totalPnL, setTotalPnL] = useState(0);
  const [winRate, setWinRate] = useState(87.5);
  const [totalTrades, setTotalTrades] = useState(48);

  // Mock AI signal generation
  useEffect(() => {
    if (!config.enabled) return;

    const generateSignal = () => {
      const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const type = Math.random() > 0.5 ? 'long' : 'short';
      const confidence = Math.floor(Math.random() * 20) + 80; // 80-100%
      const entry = Math.random() * 50000 + 20000;

      if (confidence >= config.minConfidence && positions.length < config.maxPositions) {
        const newSignal: TradingSignal = {
          id: Date.now().toString(),
          symbol,
          type,
          confidence,
          entry,
          stopLoss: type === 'long' ? entry * 0.95 : entry * 1.05,
          takeProfit: type === 'long' ? entry * 1.1 : entry * 0.9,
          reasoning: `AI检测到${symbol}在${type === 'long' ? '上升' : '下降'}通道中，技术指标显示强烈${type === 'long' ? '看涨' : '看跌'}信号`,
          timestamp: new Date(),
          status: 'pending'
        };

        setSignals(prev => [newSignal, ...prev.slice(0, 9)]);
        
        // Auto execute if confidence is high enough
        setTimeout(() => executeSignal(newSignal), 2000);
      }
    };

    const interval = setInterval(generateSignal, Math.random() * 10000 + 5000);
    return () => clearInterval(interval);
  }, [config.enabled, config.minConfidence, config.maxPositions, positions.length]);

  const executeSignal = (signal: TradingSignal) => {
    const positionSize = (config.virtualBalance * config.riskPerTrade) / 100;
    
    const newPosition: Position = {
      id: signal.id,
      symbol: signal.symbol,
      type: signal.type,
      entry: signal.entry,
      size: positionSize,
      currentPrice: signal.entry,
      pnl: 0,
      pnlPercent: 0,
      openTime: signal.timestamp,
      status: 'open'
    };

    setPositions(prev => [...prev, newPosition]);
    setSignals(prev => 
      prev.map(s => s.id === signal.id ? { ...s, status: 'executed' } : s)
    );

    toast({
      title: "交易执行成功",
      description: `${signal.symbol} ${signal.type === 'long' ? '买入' : '卖空'} 订单已执行`,
    });
  };

  // Simulate price movements and P&L updates
  useEffect(() => {
    const updatePrices = () => {
      setPositions(prev => prev.map(position => {
        if (position.status === 'closed') return position;

        const priceChange = (Math.random() - 0.5) * 0.02; // ±1% price movement
        const newPrice = position.currentPrice * (1 + priceChange);
        
        let pnl = 0;
        if (position.type === 'long') {
          pnl = (newPrice - position.entry) * (position.size / position.entry);
        } else {
          pnl = (position.entry - newPrice) * (position.size / position.entry);
        }
        
        const pnlPercent = (pnl / position.size) * 100;

        return {
          ...position,
          currentPrice: newPrice,
          pnl,
          pnlPercent
        };
      }));
    };

    const interval = setInterval(updatePrices, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate total P&L
  useEffect(() => {
    const total = positions.reduce((sum, position) => sum + position.pnl, 0);
    setTotalPnL(total);
  }, [positions]);

  const toggleAutoTrader = () => {
    setConfig(prev => ({ ...prev, enabled: !prev.enabled }));
    toast({
      title: config.enabled ? "自动交易已停止" : "自动交易已启动",
      description: config.enabled ? "AI自动交易系统已暂停" : "AI自动交易系统正在运行",
    });
  };

  const closePosition = (positionId: string) => {
    setPositions(prev => 
      prev.map(p => p.id === positionId ? { ...p, status: 'closed' } : p)
    );
    setTotalTrades(prev => prev + 1);
    
    // Update win rate (simulate)
    const closedPosition = positions.find(p => p.id === positionId);
    if (closedPosition && closedPosition.pnl > 0) {
      setWinRate(prev => (prev * totalTrades + 100) / (totalTrades + 1));
    } else {
      setWinRate(prev => (prev * totalTrades) / (totalTrades + 1));
    }
  };

  const resetVirtualAccount = () => {
    setConfig(prev => ({ ...prev, virtualBalance: 100000 }));
    setPositions([]);
    setSignals([]);
    setTotalPnL(0);
    setTotalTrades(0);
    setWinRate(87.5);
    
    toast({
      title: "虚拟账户已重置",
      description: "所有交易记录和余额已重置",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-orbitron tracking-wide px-6 py-2">
          <Bot className="w-4 h-4 mr-2" />
          AI自动交易
          {config.enabled && (
            <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse" />
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[95vw] bg-slate-900 border-slate-700 max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 font-orbitron">
            <Bot className="w-5 h-5" />
            AI自动交易系统 - 智能信号执行
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left Panel - Controls & Stats */}
          <div className="w-1/3 space-y-4">
            {/* Main Controls */}
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">系统控制</h3>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={toggleAutoTrader}
                  />
                  {config.enabled ? (
                    <Play className="w-4 h-4 text-green-400" />
                  ) : (
                    <Pause className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">状态</span>
                  <Badge className={config.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                    {config.enabled ? '运行中' : '已停止'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">最低信号置信度</span>
                  <span className="text-white font-mono">{config.minConfidence}%</span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-slate-400 text-sm">置信度阈值</span>
                  <Slider
                    value={[config.minConfidence]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, minConfidence: value[0] }))}
                    max={100}
                    min={70}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>

            {/* Virtual Account */}
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                虚拟账户
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">虚拟余额</span>
                  <span className="text-white font-mono">
                    ${(config.virtualBalance + totalPnL).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">总盈亏</span>
                  <span className={`font-mono ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">胜率</span>
                  <span className="text-white font-mono">{winRate.toFixed(1)}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">总交易数</span>
                  <span className="text-white font-mono">{totalTrades}</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetVirtualAccount}
                  className="w-full mt-2"
                >
                  重置账户
                </Button>
              </div>
            </Card>

            {/* Settings */}
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                交易设置
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-sm">单笔风险 (%)</label>
                  <Slider
                    value={[config.riskPerTrade]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, riskPerTrade: value[0] }))}
                    max={10}
                    min={1}
                    step={0.5}
                    className="w-full mt-1"
                  />
                  <span className="text-white text-xs">{config.riskPerTrade}%</span>
                </div>
                
                <div>
                  <label className="text-slate-400 text-sm">最大持仓数</label>
                  <Slider
                    value={[config.maxPositions]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, maxPositions: value[0] }))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full mt-1"
                  />
                  <span className="text-white text-xs">{config.maxPositions} 个</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Signals & Positions */}
          <div className="flex-1 space-y-4">
            <Tabs defaultValue="signals" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                <TabsTrigger value="signals">AI信号</TabsTrigger>
                <TabsTrigger value="positions">持仓</TabsTrigger>
                <TabsTrigger value="history">交易历史</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signals" className="space-y-3 mt-4">
                <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    实时AI信号
                  </h4>
                  
                  {signals.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <Bot className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                      <p>AI正在分析市场...</p>
                      <p className="text-sm">启动自动交易以接收信号</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {signals.map((signal) => (
                        <Card key={signal.id} className="p-3 bg-slate-700/50 border-slate-600">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={signal.type === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {signal.symbol} {signal.type === 'long' ? '买入' : '卖空'}
                              </Badge>
                              <Badge className="bg-blue-500/20 text-blue-400">
                                <Percent className="w-3 h-3 mr-1" />
                                {signal.confidence}%
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {signal.status === 'executed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                              {signal.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                            <div>
                              <span className="text-slate-400">入场:</span>
                              <p className="text-white font-mono">${signal.entry.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">止损:</span>
                              <p className="text-red-400 font-mono">${signal.stopLoss.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">止盈:</span>
                              <p className="text-green-400 font-mono">${signal.takeProfit.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <p className="text-slate-300 text-xs">{signal.reasoning}</p>
                          <p className="text-slate-500 text-xs mt-1">
                            {signal.timestamp.toLocaleTimeString()}
                          </p>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="positions" className="space-y-3 mt-4">
                <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    当前持仓 ({positions.filter(p => p.status === 'open').length})
                  </h4>
                  
                  {positions.filter(p => p.status === 'open').length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <Activity className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                      <p>暂无持仓</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {positions.filter(p => p.status === 'open').map((position) => (
                        <Card key={position.id} className="p-3 bg-slate-700/50 border-slate-600">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={position.type === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {position.symbol} {position.type === 'long' ? '多头' : '空头'}
                              </Badge>
                              <Badge className={position.pnl >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => closePosition(position.id)}
                              className="text-xs"
                            >
                              平仓
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div>
                              <span className="text-slate-400">入场价:</span>
                              <p className="text-white font-mono">${position.entry.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">当前价:</span>
                              <p className="text-white font-mono">${position.currentPrice.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">仓位:</span>
                              <p className="text-white font-mono">${position.size.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">盈亏:</span>
                              <p className={`font-mono ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-3 mt-4">
                <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h4 className="text-white font-semibold mb-3">交易历史</h4>
                  <div className="text-center text-slate-400 py-8">
                    <p>历史交易记录将在此显示</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Warning Notice */}
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-400 font-medium">风险提示</p>
              <p className="text-amber-200/80 text-xs">
                此为虚拟交易系统，用于策略测试。实盘交易存在风险，请谨慎操作。AI信号仅供参考，不构成投资建议。
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};