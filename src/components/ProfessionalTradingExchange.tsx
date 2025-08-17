import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Zap, 
  Shield, 
  Activity,
  BarChart3,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Target,
  Wallet,
  ArrowUp,
  ArrowDown,
  CircleDollarSign,
  Sparkles,
  Eye,
  EyeOff,
  RefreshCw,
  PieChart,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/hooks/useUserSettings";
import { cn } from "@/lib/utils";

interface VirtualAccount {
  balance: number;
  totalPnL: number;
  dailyPnL: number;
  winRate: number;
  totalTrades: number;
  activePositions: number;
}

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  size: number;
  margin: number;
  pnl: number;
  pnlPercent: number;
  confidence: number;
  strategy: 'conservative' | 'aggressive';
  openTime: Date;
  stopLoss: number;
  takeProfit: number;
  leverage: string;
  marginRate: number;
  liquidationPrice: number;
}

interface SuperBrainSignal {
  symbol: string;
  action: 'buy' | 'sell';
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  reasoning: string;
  timestamp: Date;
}

interface ProfessionalTradingExchangeProps {
  open: boolean;
  onClose: () => void;
}

export const ProfessionalTradingExchange = ({ open, onClose }: ProfessionalTradingExchangeProps) => {
  const { toast } = useToast();
  const { settings, updateSettings, isAuthenticated } = useUserSettings();
  
  // 交易状态
  const [isEnabled, setIsEnabled] = useState(settings.auto_trading_enabled);
  const [isSuperBrainActive, setIsSuperBrainActive] = useState(settings.super_brain_monitoring);
  
  // 虚拟账户
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount>(() => ({
    balance: settings.virtual_balance || 10000,
    totalPnL: 0,
    dailyPnL: 0,
    winRate: 0,
    totalTrades: 0,
    activePositions: 0  
  }));
  
  const [tempBalance, setTempBalance] = useState<string>(virtualAccount.balance.toString());
  const [selectedStrategy, setSelectedStrategy] = useState<'conservative' | 'aggressive'>(settings.trading_strategy || 'conservative');
  
  // 持仓管理
  const [positions, setPositions] = useState<Position[]>([]);
  const [tradingHistory, setTradingHistory] = useState<string[]>([]);

  // 交易策略配置
  const strategies = [
    {
      type: 'conservative' as const,
      name: '稳健型',
      description: '胜率大于85%才进行交易',
      minConfidence: 85,
      icon: <Shield className="w-4 h-4" />,
      color: 'text-blue-400'
    },
    {
      type: 'aggressive' as const,
      name: '激进型', 
      description: '胜率达到70%就进行交易',
      minConfidence: 70,
      icon: <Zap className="w-4 h-4" />,
      color: 'text-orange-400'
    }
  ];

  // 监听设置变化
  useEffect(() => {
    setIsEnabled(settings.auto_trading_enabled);
    setIsSuperBrainActive(settings.super_brain_monitoring);
    setSelectedStrategy(settings.trading_strategy || 'conservative');
    
    if (settings.virtual_balance !== undefined && settings.virtual_balance !== virtualAccount.balance) {
      setVirtualAccount(prev => ({
        ...prev,
        balance: settings.virtual_balance
      }));
      setTempBalance(settings.virtual_balance.toString());
    }
  }, [settings]);

  // 监听最强大脑信号
  useEffect(() => {
    const handleSuperBrainSignal = (event: CustomEvent) => {
      if (!isEnabled) return;
      
      const signal = event.detail as SuperBrainSignal;
      const strategy = strategies.find(s => s.type === selectedStrategy);
      
      if (!strategy || signal.confidence < strategy.minConfidence) {
        setTradingHistory(prev => [
          `⚠️ ${signal.symbol} 信号胜率${signal.confidence}%低于${strategy?.name}策略要求`,
          ...prev.slice(0, 19)
        ]);
        return;
      }

      // 检查是否已有该币种持仓
      if (positions.some(p => p.symbol === signal.symbol)) {
        setTradingHistory(prev => [
          `💰 ${signal.symbol} 已有持仓，跳过重复交易`,
          ...prev.slice(0, 19)
        ]);
        return;
      }

      executeAutomaticTrade(signal);
    };

    window.addEventListener('superBrainTradingSignal', handleSuperBrainSignal as EventListener);
    
    return () => {
      window.removeEventListener('superBrainTradingSignal', handleSuperBrainSignal as EventListener);
    };
  }, [isEnabled, selectedStrategy, positions]);

  // 执行自动交易
  const executeAutomaticTrade = useCallback(async (signal: SuperBrainSignal) => {
    const tradeSize = (virtualAccount.balance * 10) / 100; // 10%风险
    const leverage = signal.confidence >= 95 ? 20 : signal.confidence >= 90 ? 15 : 10;
    const positionSize = (tradeSize * leverage) / signal.entry;
    const margin = tradeSize;
    
    // 计算强平价格
    const liquidationPrice = signal.action === 'buy' 
      ? signal.entry * (1 - 0.95 / leverage) // 多单强平价
      : signal.entry * (1 + 0.95 / leverage); // 空单强平价
    
    const newPosition: Position = {
      id: Date.now().toString(),
      symbol: signal.symbol,
      type: signal.action === 'buy' ? 'long' : 'short',
      entryPrice: signal.entry,
      currentPrice: signal.entry,
      size: positionSize,
      margin: margin,
      pnl: 0,
      pnlPercent: 0,
      confidence: signal.confidence,
      strategy: selectedStrategy,
      openTime: new Date(),
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit,
      leverage: `${leverage}x`,
      marginRate: 1432.6, // 模拟维持保证金率
      liquidationPrice: liquidationPrice
    };

    setPositions(prev => [...prev, newPosition]);
    
    // 更新虚拟账户
    const updatedAccount = {
      ...virtualAccount,
      balance: virtualAccount.balance - margin,
      totalTrades: virtualAccount.totalTrades + 1,
      activePositions: virtualAccount.activePositions + 1
    };
    setVirtualAccount(updatedAccount);
    await updateSettings({ virtual_balance: updatedAccount.balance });

    // 添加交易历史
    setTradingHistory(prev => [
      `✅ 自动执行：${signal.symbol} ${signal.action === 'buy' ? '做多' : '做空'} ${leverage}x杠杆`,
      `📊 入场价格: $${signal.entry.toLocaleString()} | 胜率: ${signal.confidence}%`,
      ...prev.slice(0, 18)
    ]);

    toast({
      title: "🚀 AI自动交易执行",
      description: `${signal.symbol} ${signal.action === 'buy' ? '做多' : '做空'} ${leverage}x | 胜率${signal.confidence}%`,
    });
  }, [virtualAccount, selectedStrategy, updateSettings, toast]);

  // 启动/停止AI自动交易
  const toggleAutoTrader = async () => {
    if (!isSuperBrainActive) {
      toast({
        title: "无法启动AI自动交易",
        description: "请先开启最强大脑自动检测功能",
        variant: "destructive"
      });
      return;
    }

    const newState = !isEnabled;
    const success = await updateSettings({ auto_trading_enabled: newState });
    
    if (success) {
      setIsEnabled(newState);
      toast({
        title: newState ? "AI自动交易已启动" : "AI自动交易已停止",
        description: newState 
          ? `${strategies.find(s => s.type === selectedStrategy)?.name}策略已激活`
          : "自动交易功能已关闭",
      });
    }
  };

  // 更新虚拟余额
  const updateVirtualBalance = async () => {
    const newBalance = Number(tempBalance);
    
    if (isNaN(newBalance) || newBalance < 1000) {
      toast({
        title: "余额设置失败",
        description: "请输入有效的余额金额（最低1000 USDT）",
        variant: "destructive"
      });
      setTempBalance(virtualAccount.balance.toString());
      return;
    }
    
    const success = await updateSettings({ virtual_balance: newBalance });
    if (success) {
      toast({
        title: "余额更新成功",
        description: `账户余额已设置为 ${newBalance.toLocaleString()} USDT`,
      });
    }
  };

  // 平仓操作
  const closePosition = (position: Position) => {
    const pnl = position.type === 'long' 
      ? (position.currentPrice - position.entryPrice) * position.size
      : (position.entryPrice - position.currentPrice) * position.size;
    
    setVirtualAccount(prev => ({
      ...prev,
      balance: prev.balance + position.margin + pnl,
      totalPnL: prev.totalPnL + pnl,
      dailyPnL: prev.dailyPnL + pnl,
      activePositions: prev.activePositions - 1
    }));

    setPositions(prev => prev.filter(p => p.id !== position.id));

    setTradingHistory(prev => [
      `${pnl > 0 ? '✅' : '❌'} ${position.symbol} 平仓 ${pnl > 0 ? '+' : ''}$${pnl.toFixed(2)}`,
      ...prev.slice(0, 19)
    ]);

    toast({
      title: pnl > 0 ? "盈利平仓" : "止损平仓",
      description: `${position.symbol} ${pnl > 0 ? '+' : ''}$${pnl.toFixed(2)}`,
    });
  };

  // 定期更新持仓价格
  useEffect(() => {
    if (positions.length === 0) return;

    const interval = setInterval(() => {
      setPositions(prev => prev.map(position => {
        const priceChange = (Math.random() - 0.5) * 0.02;
        const newPrice = position.currentPrice * (1 + priceChange);
        const pnl = position.type === 'long' 
          ? (newPrice - position.entryPrice) * position.size
          : (position.entryPrice - newPrice) * position.size;
        const pnlPercent = (pnl / position.margin) * 100;

        return {
          ...position,
          currentPrice: newPrice,
          pnl: pnl,
          pnlPercent: pnlPercent
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [positions]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI自动赚钱</h2>
              <p className="text-slate-400 text-sm">智能自动交易系统</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Trading Control */}
          <div className="w-1/3 p-6 border-r border-slate-700 space-y-6">
            {/* Account Balance */}
            <Card className="bg-slate-800/50 border-slate-700">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    账户余额
                  </h3>
                  <Badge variant="outline" className="text-green-400 border-green-400/20">
                    USDT
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={tempBalance}
                      onChange={(e) => setTempBalance(e.target.value)}
                      className="flex-1 bg-slate-700/50 border-slate-600 text-white"
                      placeholder="设置虚拟余额"
                    />
                    <Button size="sm" onClick={updateVirtualBalance}>
                      确认
                    </Button>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${virtualAccount.balance.toLocaleString()}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">总盈亏</div>
                      <div className={cn("font-medium", virtualAccount.totalPnL >= 0 ? "text-green-400" : "text-red-400")}>
                        {virtualAccount.totalPnL >= 0 ? '+' : ''}${virtualAccount.totalPnL.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">胜率</div>
                      <div className="text-white font-medium">{virtualAccount.winRate.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Trading Strategy */}
            <Card className="bg-slate-800/50 border-slate-700">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  交易策略
                </h3>
                <Select value={selectedStrategy} onValueChange={(value) => setSelectedStrategy(value as 'conservative' | 'aggressive')}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.type} value={strategy.type}>
                        <div className="flex items-center gap-2">
                          {strategy.icon}
                          <span>{strategy.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 text-sm text-slate-400">
                  {strategies.find(s => s.type === selectedStrategy)?.description}
                </div>
              </div>
            </Card>

            {/* Control Panel */}
            <Card className="bg-slate-800/50 border-slate-700">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">AI交易控制</h3>
                  <div className={cn("w-3 h-3 rounded-full", isEnabled ? "bg-green-400 animate-pulse" : "bg-gray-500")} />
                </div>
                <Button
                  onClick={toggleAutoTrader}
                  className={cn(
                    "w-full font-medium",
                    isEnabled
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  )}
                >
                  {isEnabled ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      停止交易
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      启动交易
                    </>
                  )}
                </Button>
                <div className="mt-3 text-sm text-slate-400 text-center">
                  {!isSuperBrainActive && "需要先启动最强大脑监测"}
                </div>
              </div>
            </Card>

            {/* Statistics */}
            <Card className="bg-slate-800/50 border-slate-700">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-3">交易统计</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">总交易数</span>
                    <span className="text-white">{virtualAccount.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">活跃持仓</span>
                    <span className="text-white">{virtualAccount.activePositions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">今日盈亏</span>
                    <span className={cn(virtualAccount.dailyPnL >= 0 ? "text-green-400" : "text-red-400")}>
                      {virtualAccount.dailyPnL >= 0 ? '+' : ''}${virtualAccount.dailyPnL.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Positions & History */}
          <div className="flex-1 p-6 space-y-6">
            {/* Positions */}
            <Card className="bg-slate-800/50 border-slate-700 flex-1">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  持仓管理 ({positions.length})
                </h3>
              </div>
              <ScrollArea className="h-64">
                <div className="space-y-3 p-4">
                  {positions.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-slate-400 text-sm">暂无持仓</div>
                      <div className="text-slate-500 text-xs mt-1">AI检测到机会时将自动建仓</div>
                    </div>
                  ) : (
                    positions.map((position) => (
                      <Card key={position.id} className="bg-slate-700/30 border-slate-600">
                        <div className="p-4">
                          {/* Position Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="text-lg font-bold text-white">{position.symbol}USDT 永续</div>
                              <Badge variant={position.type === 'long' ? 'default' : 'destructive'} className="text-xs">
                                {position.type === 'long' ? '多' : '空'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">全仓</Badge>
                              <Badge variant="outline" className="text-xs">{position.leverage}</Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => closePosition(position)}
                              className="border-red-500 text-red-400 hover:bg-red-500/20"
                            >
                              平仓
                            </Button>
                          </div>

                          {/* Position Stats Grid */}
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-slate-400 mb-1">收益额 (USDT)</div>
                              <div className={cn("text-lg font-bold", position.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                                {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-400 mb-1">收益率</div>
                              <div className={cn("text-lg font-bold", position.pnlPercent >= 0 ? "text-green-400" : "text-red-400")}>
                                {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-400 mb-1">持仓量 ({position.symbol})</div>
                              <div className="text-white font-bold">{position.size.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 mb-1">保证金 (USDT)</div>
                              <div className="text-white font-bold">{position.margin.toFixed(0)}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 mb-1">维持保证金率</div>
                              <div className="text-white font-bold">{position.marginRate.toFixed(1)}%</div>
                            </div>
                            <div>
                              <div className="text-slate-400 mb-1">开仓均价</div>
                              <div className="text-white font-bold">{position.entryPrice.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 mb-1">标记价格</div>
                              <div className="text-white font-bold">{position.currentPrice.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 mb-1">预估强平价</div>
                              <div className="text-white font-bold">{position.liquidationPrice.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>

            {/* Trading History */}
            <Card className="bg-slate-800/50 border-slate-700 flex-1">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  交易记录
                </h3>
              </div>
              <ScrollArea className="h-48">
                <div className="p-4 space-y-2">
                  {tradingHistory.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 text-sm">暂无交易记录</div>
                  ) : (
                    tradingHistory.map((record, index) => (
                      <div key={index} className="text-sm text-slate-300 py-1 border-l-2 border-slate-600 pl-3">
                        {record}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};