import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useUserSettings } from "@/hooks/useUserSettings";
import { TradingStatistics } from "./TradingStatistics";

interface VirtualAccount {
  balance: number;
  totalPnL: number;
  dailyPnL: number;
  winRate: number;
  totalTrades: number;
  activePositions: number;
}

interface TradingStrategy {
  type: 'conservative' | 'aggressive';
  name: string;
  description: string;
  minConfidence: number;
  icon: React.ReactNode;
  color: string;
}

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  confidence: number;
  strategy: 'conservative' | 'aggressive';
  openTime: Date;
  stopLoss: number;
  takeProfit: number;
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

export const AutoTrader = () => {
  const { toast } = useToast();
  const { settings, isAuthenticated, updateSettings, startBackgroundMonitoring } = useUserSettings();
  
  // 使用数据库设置初始化状态
  const [isSuperBrainActive, setIsSuperBrainActive] = useState(settings.super_brain_monitoring);
  const [isEnabled, setIsEnabled] = useState(settings.auto_trading_enabled);
  
  // 虚拟账户从设置读取
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount>(() => ({
    balance: settings.virtual_balance || 100000,
    totalPnL: 0,
    dailyPnL: 0,
    winRate: 0,
    totalTrades: 0,
    activePositions: 0
  }));

  // 临时余额输入状态
  const [tempBalance, setTempBalance] = useState<string>(
    virtualAccount.balance.toString()
  );

  const [selectedStrategy, setSelectedStrategy] = useState<'conservative' | 'aggressive'>(settings.trading_strategy || 'conservative');
  const [tempStrategy, setTempStrategy] = useState<'conservative' | 'aggressive'>(settings.trading_strategy || 'conservative'); // 临时策略选择
  const [strategyChanged, setStrategyChanged] = useState(false); // 策略是否有变更
  const [maxPositions, setMaxPositions] = useState(settings.max_positions || 5);
  const [riskPerTrade, setRiskPerTrade] = useState(settings.risk_per_trade || 2);
  
  // 持仓管理
  const [positions, setPositions] = useState<Position[]>([]);
  const [tradingHistory, setTradingHistory] = useState<string[]>([]);
  const [pendingSignals, setPendingSignals] = useState<SuperBrainSignal[]>([]);

  // 交易策略配置
  const strategies: TradingStrategy[] = [
    {
      type: 'conservative',
      name: '稳健型',
      description: '胜率大于85%才进行交易，追求稳定收益', // 降低门槛从90%到85%
      minConfidence: 85, // 降低门槛
      icon: <Shield className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      type: 'aggressive',
      name: '激进型', 
      description: '胜率达到70%就进行交易，追求更多机会',
      minConfidence: 70,
      icon: <Zap className="w-5 h-5" />,
      color: 'text-orange-400'
    }
  ];

  // 监听设置变化，同步状态
  useEffect(() => {
    setIsSuperBrainActive(settings.super_brain_monitoring);
    setIsEnabled(settings.auto_trading_enabled);
    setSelectedStrategy(settings.trading_strategy || 'conservative');
    setTempStrategy(settings.trading_strategy || 'conservative');
    setStrategyChanged(false);
    setMaxPositions(settings.max_positions || 5);
    setRiskPerTrade(settings.risk_per_trade || 2);
    
    const newVirtualAccount = {
      balance: settings.virtual_balance || 100000,
      totalPnL: virtualAccount.totalPnL,
      dailyPnL: virtualAccount.dailyPnL,
      winRate: virtualAccount.winRate,
      totalTrades: virtualAccount.totalTrades,
      activePositions: virtualAccount.activePositions
    };
    setVirtualAccount(newVirtualAccount);
    setTempBalance((settings.virtual_balance || 100000).toString());
  }, [settings]);

  // 确认策略更改
  const confirmStrategyChange = async () => {
    const success = await updateSettings({ trading_strategy: tempStrategy });
    if (success) {
      setSelectedStrategy(tempStrategy);
      setStrategyChanged(false);
      toast({
        title: "策略更新成功",
        description: `已切换到${strategies.find(s => s.type === tempStrategy)?.name}策略`,
      });
    }
  };

  // 取消策略更改
  const cancelStrategyChange = () => {
    setTempStrategy(selectedStrategy);
    setStrategyChanged(false);
  };

  // 处理策略选择
  const handleStrategySelect = (strategyType: 'conservative' | 'aggressive') => {
    setTempStrategy(strategyType);
    setStrategyChanged(strategyType !== selectedStrategy);
  };
  useEffect(() => {
    const handleMonitoringChange = (event: CustomEvent) => {
      setIsSuperBrainActive(event.detail.isMonitoring);
      if (!event.detail.isMonitoring && isEnabled) {
        setIsEnabled(false);
        localStorage.setItem('autoTraderEnabled', JSON.stringify(false));
        toast({
          title: "AI自动交易已停止",
          description: "最强大脑监测已关闭，AI自动交易同步停止",
        });
      }
    };

    window.addEventListener('superBrainMonitoringChanged', handleMonitoringChange as EventListener);
    
    return () => {
      window.removeEventListener('superBrainMonitoringChanged', handleMonitoringChange as EventListener);
    };
  }, [isEnabled]);

  // 监听最强大脑交易信号
  useEffect(() => {
    // 处理最强大脑信号
    const handleSuperBrainSignal = (event: CustomEvent) => {
      if (!isEnabled) return;
      
      const signal = event.detail as SuperBrainSignal;
      const strategy = strategies.find(s => s.type === selectedStrategy);
      
      // 添加详细的调试日志
      console.log('收到最强大脑信号:', {
        symbol: signal.symbol,
        action: signal.action,
        confidence: signal.confidence,
        entry: signal.entry,
        strategy: selectedStrategy,
        minRequired: strategy?.minConfidence
      });
      
      // 记录收到信号
      setTradingHistory(prev => [
        `📡 收到${signal.symbol}信号：${signal.action === 'buy' ? '买入' : '卖出'}，胜率${signal.confidence}%`,
        ...prev.slice(0, 19)
      ]);

      if (!strategy || signal.confidence < strategy.minConfidence) {
        setTradingHistory(prev => [
          `⚠️ ${signal.symbol} 信号胜率${signal.confidence}%低于${strategy?.name}策略要求${strategy?.minConfidence}%，已忽略`,
          `💡 提示：切换到激进型策略(70%门槛)可执行此信号`,
          ...prev.slice(0, 18)
        ]);
        
        // 给用户策略提示
        toast({
          title: "信号被忽略",
          description: `${signal.symbol}胜率${signal.confidence}%低于${strategy?.name}要求。切换到激进型策略可执行`,
          variant: "destructive"
        });
        return;
      }

      // 检查持仓限制
      if (positions.length >= maxPositions) {
        setTradingHistory(prev => [
          `⚠️ ${signal.symbol} 已达最大持仓数${maxPositions}，跳过交易`,
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

      // 执行自动交易
      executeAutomaticTrade(signal);
    };

    window.addEventListener('superBrainTradingSignal', handleSuperBrainSignal as EventListener);
    
    return () => {
      window.removeEventListener('superBrainTradingSignal', handleSuperBrainSignal as EventListener);
    };
  }, [isEnabled, selectedStrategy, maxPositions, positions]);

  // 执行自动交易
  const executeAutomaticTrade = useCallback(async (signal: SuperBrainSignal) => {
    console.log('执行自动交易:', signal);
    
    const tradeSize = (virtualAccount.balance * riskPerTrade) / 100;
    const positionSize = tradeSize / signal.entry;
    
    const newPosition: Position = {
      id: Date.now().toString(),
      symbol: signal.symbol,
      type: signal.action === 'buy' ? 'long' : 'short',
      entryPrice: signal.entry,
      currentPrice: signal.entry,
      size: positionSize,
      pnl: 0,
      pnlPercent: 0,
      confidence: signal.confidence,
      strategy: selectedStrategy,
      openTime: new Date(),
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit
    };

    // 更新持仓
    setPositions(prev => [...prev, newPosition]);
    
    // 更新虚拟账户
    const newTotalPnL = virtualAccount.totalPnL;
    const newDailyPnL = virtualAccount.dailyPnL; // 暂时保持不变，等交易结果再更新
    const newTotalTrades = virtualAccount.totalTrades + 1;
    const newWinRate = virtualAccount.winRate; // 暫時保持不變
    
    const updatedAccount = {
      ...virtualAccount,
      balance: virtualAccount.balance - tradeSize,
      totalTrades: newTotalTrades,
      activePositions: virtualAccount.activePositions + 1,
      totalPnL: newTotalPnL,
      dailyPnL: newDailyPnL,
      winRate: newWinRate
    };
    setVirtualAccount(updatedAccount);
    await updateSettings({ virtual_balance: updatedAccount.balance });

    // 添加交易历史
    const strategyName = strategies.find(s => s.type === selectedStrategy)?.name;
    setTradingHistory(prev => [
      `✅ 自动执行：${signal.symbol} ${signal.action === 'buy' ? '买入' : '卖出'} $${signal.entry.toLocaleString()}`,
      `📊 ${strategyName}策略 | 胜率${signal.confidence}% | 仓位${positionSize.toFixed(4)}`,
      `🎯 止损$${signal.stopLoss.toLocaleString()} | 止盈$${signal.takeProfit.toLocaleString()}`,
      ...prev.slice(0, 17)
    ]);

    // 保存到数据库（如果用户已认证）
    if (isAuthenticated) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('virtual_trades').insert({
            user_id: user.id,
            symbol: newPosition.symbol,
            action: signal.action,
            entry_price: newPosition.entryPrice,
            stop_loss: newPosition.stopLoss,
            take_profit: newPosition.takeProfit,
            position_size: newPosition.size,
            confidence: newPosition.confidence,
            strategy: newPosition.strategy,
            reasoning: signal.reasoning,
            status: 'open'
          });
        }
      } catch (error) {
        console.error('Failed to save trade to database:', error);
      }
    }

    toast({
      title: "🚀 自动交易执行成功",
      description: `${signal.symbol} ${signal.action === 'buy' ? '买入' : '卖出'} | 胜率${signal.confidence}%`,
    });
  }, [virtualAccount, riskPerTrade, selectedStrategy, strategies, updateSettings, isAuthenticated, toast]);

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
    
    // 更新数据库设置
    const success = await updateSettings({ 
      auto_trading_enabled: newState 
    });
    
    if (!success) {
      return;
    }

    setIsEnabled(newState);
    
    // 如果是启动后台监控，调用后台服务
    if (newState && isAuthenticated) {
      await startBackgroundMonitoring();
    }
    
    // 发送状态变化事件
    window.dispatchEvent(new CustomEvent('autoTraderStatusChanged', {
      detail: { isActive: newState }
    }));

    toast({
      title: newState ? "AI自动交易已启动" : "AI自动交易已停止",
      description: newState 
        ? `${strategies.find(s => s.type === selectedStrategy)?.name}策略已激活，${isAuthenticated ? '后台监控已启动' : '本地监控模式'}`
        : "自动交易功能已关闭",
    });

    if (newState) {
      setTradingHistory(prev => [
        `🤖 AI自动交易启动 - ${strategies.find(s => s.type === selectedStrategy)?.name}策略`,
        ...prev.slice(0, 19)
      ]);
    }
  };

  // 设置虚拟账户余额
  const updateVirtualBalance = async (newBalance: number) => {
    const updatedAccount = { ...virtualAccount, balance: newBalance };
    setVirtualAccount(updatedAccount);
    setTempBalance(newBalance.toString());
    
    // 更新数据库设置
    await updateSettings({ virtual_balance: newBalance });
  };

  // 确认更新余额
  const confirmBalanceUpdate = () => {
    const newBalance = Number(tempBalance);
    if (isNaN(newBalance) || newBalance < 1000) {
      toast({
        title: "❌ 余额设置失败",
        description: "请输入有效的余额金额（最低1000 USDT）",
        variant: "destructive"
      });
      setTempBalance(virtualAccount.balance.toString());
      return;
    }
    
    updateVirtualBalance(newBalance);
    toast({
      title: "✅ 余额更新成功",
      description: `账户余额已设置为 ${newBalance.toLocaleString()} USDT`,
    });
  };

  // 平仓操作
  const closePosition = (position: Position) => {
    const pnl = position.type === 'long' 
      ? (position.currentPrice - position.entryPrice) * position.size
      : (position.entryPrice - position.currentPrice) * position.size;
    
    // 更新虚拟账户
    setVirtualAccount(prev => ({
      ...prev,
      balance: prev.balance + (position.entryPrice * position.size) + pnl,
      totalPnL: prev.totalPnL + pnl,
      dailyPnL: prev.dailyPnL + pnl,
      activePositions: prev.activePositions - 1,
      winRate: prev.totalTrades > 0 ? ((prev.totalTrades * prev.winRate / 100 + (pnl > 0 ? 1 : 0)) / prev.totalTrades * 100) : (pnl > 0 ? 100 : 0)
    }));

    // 移除持仓
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

  // 定期更新持仓价格（模拟）
  useEffect(() => {
    if (positions.length === 0) return;

    const interval = setInterval(() => {
      setPositions(prev => prev.map(position => {
        const priceChange = (Math.random() - 0.5) * 0.02; // ±1%随机变化
        const newPrice = position.currentPrice * (1 + priceChange);
        const pnl = position.type === 'long' 
          ? (newPrice - position.entryPrice) * position.size
          : (position.entryPrice - newPrice) * position.size;
        const pnlPercent = (pnl / (position.entryPrice * position.size)) * 100;

        return {
          ...position,
          currentPrice: newPrice,
          pnl: pnl,
          pnlPercent: pnlPercent
        };
      }));
    }, 5000); // 每5秒更新一次

    return () => clearInterval(interval);
  }, [positions.length]);

  return (
    <div className="space-y-6">
      {/* 头部控制面板 */}
      <Card className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 border-emerald-600/30">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI自动赚钱</h2>
                <p className="text-emerald-300/70">智能自动交易系统</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* 最强大脑状态指示 */}
              <div className="flex items-center gap-2">
                <Brain className={`w-4 h-4 ${isSuperBrainActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className={`text-sm ${isSuperBrainActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                  最强大脑: {isSuperBrainActive ? '已激活' : '未激活'}
                </span>
              </div>

              {/* 启动/停止按钮 */}
              <Button
                onClick={toggleAutoTrader}
                disabled={!isSuperBrainActive}
                className={`px-6 py-2 ${
                  isEnabled 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isEnabled ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    停止自动交易
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    启动自动交易
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 状态提示 */}
          {!isSuperBrainActive && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300">
                  请先开启"最强大脑自动检测"功能，AI自动交易依赖于大脑检测的交易信号
                </span>
              </div>
            </div>
          )}

          {isEnabled && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300">
                  AI自动交易已激活，正在使用{strategies.find(s => s.type === selectedStrategy)?.name}策略等待交易信号
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：虚拟账户 & 策略配置 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 虚拟账户 */}
          <Card className="bg-slate-900/95 border-slate-700/50">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">虚拟账户</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-slate-300 text-sm">账户余额 (USDT)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={tempBalance}
                      onChange={(e) => setTempBalance(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                      min="1000"
                      max="10000000"
                      step="1000"
                      placeholder="输入余额金额"
                    />
                    <Button
                      size="sm"
                      onClick={confirmBalanceUpdate}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={tempBalance === virtualAccount.balance.toString()}
                    >
                      确认
                    </Button>
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setTempBalance("100000");
                        updateVirtualBalance(100000);
                      }}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      重置
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/60 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">总盈亏</div>
                    <div className={`text-lg font-mono font-bold ${
                      virtualAccount.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {virtualAccount.totalPnL >= 0 ? '+' : ''}${virtualAccount.totalPnL.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">今日盈亏</div>
                    <div className={`text-lg font-mono font-bold ${
                      virtualAccount.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {virtualAccount.dailyPnL >= 0 ? '+' : ''}${virtualAccount.dailyPnL.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-sm font-mono font-bold text-blue-400">
                      {virtualAccount.winRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-400">胜率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-mono font-bold text-purple-400">
                      {virtualAccount.totalTrades}
                    </div>
                    <div className="text-xs text-slate-400">总交易</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-mono font-bold text-orange-400">
                      {virtualAccount.activePositions}
                    </div>
                    <div className="text-xs text-slate-400">持仓数</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 交易策略配置 */}
          <Card className="bg-slate-900/95 border-slate-700/50">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">交易策略</h3>
              </div>

              <div className="space-y-4">
                {strategies.map((strategy) => (
                  <div
                    key={strategy.type}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      tempStrategy === strategy.type
                        ? 'border-emerald-500/50 bg-emerald-500/10'
                        : 'border-slate-600 bg-slate-800/40 hover:border-slate-500'
                    }`}
                    onClick={() => handleStrategySelect(strategy.type)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${strategy.color}`}>
                        {strategy.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{strategy.name}</span>
                          <Badge variant="outline" className="text-xs">
                            ≥{strategy.minConfidence}%
                          </Badge>
                          {selectedStrategy === strategy.type && !strategyChanged && (
                            <Badge className="text-xs bg-green-600 text-white">当前</Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {strategy.description}
                        </div>
                      </div>
                      {tempStrategy === strategy.type && (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                  </div>
                ))}

                {/* 策略确认按钮 */}
                {strategyChanged && (
                  <div className="flex gap-2 pt-2 border-t border-slate-700">
                    <Button 
                      onClick={confirmStrategyChange}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      确定策略
                    </Button>
                    <Button 
                      onClick={cancelStrategyChange}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      取消更改
                    </Button>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-700">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-slate-300 text-sm">最大持仓数</Label>
                      <Input
                        type="number"
                        value={maxPositions}
                        onChange={(e) => setMaxPositions(Number(e.target.value))}
                        className="bg-slate-800 border-slate-600 text-white mt-1"
                        min="1"
                        max="10"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 text-sm">单笔风险 (%)</Label>
                      <Input
                        type="number"
                        value={riskPerTrade}
                        onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                        className="bg-slate-800 border-slate-600 text-white mt-1"
                        min="0.5"
                        max="10"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 实时交易历史 */}
          <Card className="bg-slate-900/95 border-slate-700/50">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">交易动态</h3>
              </div>

              <ScrollArea className="h-60">
                <div className="space-y-2">
                  {tradingHistory.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">等待交易信号...</p>
                    </div>
                  ) : (
                    tradingHistory.map((activity, index) => (
                      <div key={index} className="text-xs text-slate-300 p-2 bg-slate-800/40 rounded">
                        {activity}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </div>

        {/* 右侧：持仓管理 & 交易历史 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 交易统计面板 */}
          <TradingStatistics 
            virtualAccount={virtualAccount}
            positions={positions}
            tradingHistory={tradingHistory}
            isEnabled={isEnabled}
          />

          {/* 持仓管理 */}
          <Card className="bg-slate-900/95 border-slate-700/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">持仓管理</h3>
                </div>
                <Badge variant="outline" className="text-slate-300">
                  {positions.length}/{maxPositions} 持仓
                </Badge>
              </div>

              <ScrollArea className="h-96">
                {positions.length === 0 ? (
                  <div className="text-center text-slate-400 py-16">
                    <CircleDollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">暂无持仓</p>
                    <p className="text-sm">AI自动交易激活后将自动建仓</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {positions.map((position) => (
                      <div
                        key={position.id}
                        className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-white">
                              {position.symbol}
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                position.type === 'long' 
                                  ? "bg-green-500/10 text-green-400 border-green-500/30" 
                                  : "bg-red-500/10 text-red-400 border-red-500/30"
                              )}
                            >
                              {position.type === 'long' ? '做多' : '做空'}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                              {position.confidence}%
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {strategies.find(s => s.type === position.strategy)?.name}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className={`text-lg font-mono font-bold ${
                              position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => closePosition(position)}
                              className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                              平仓
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">开仓价:</span>
                            <div className="text-white font-mono">
                              ${position.entryPrice.toFixed(4)}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400">当前价:</span>
                            <div className="text-white font-mono">
                              ${position.currentPrice.toFixed(4)}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400">仓位:</span>
                            <div className="text-white font-mono">
                              {position.size.toFixed(6)}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400">盈亏比:</span>
                            <div className={`font-mono ${
                              position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mt-3 pt-3 border-t border-slate-700/50">
                          <div>
                            <span className="text-slate-400">止损:</span>
                            <span className="text-red-400 font-mono ml-2">
                              ${position.stopLoss.toFixed(4)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">止盈:</span>
                            <span className="text-green-400 font-mono ml-2">
                              ${position.takeProfit.toFixed(4)}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-400 mt-2">
                          开仓时间: {position.openTime.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};