import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  DollarSign, 
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Wallet,
  ArrowUp,
  ArrowDown,
  CircleDollarSign,
  Edit,
  Shield,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useVirtualAccount } from "@/hooks/useVirtualAccount";
import { useSignalProcessor } from "@/hooks/useSignalProcessor";
import { TradingStatistics } from "./TradingStatistics";
import { SuperBrainSignal } from "@/types/trading";
import { TRADING_STRATEGIES, TRADING_CONFIG } from "@/constants/trading";
import { formatTradingHistory, validateSignal } from "@/utils/tradingHelpers";
import { signalBridge } from "@/utils/signalBridge";

export const AutoTrader = () => {
  const { toast } = useToast();
  const { settings, isAuthenticated, updateSettings, startBackgroundMonitoring } = useUserSettings();
  const { virtualAccount, positions, updateBalance, executeTrade } = useVirtualAccount();
  const { callSuperBrainAPI, convertToSignal } = useSignalProcessor();
  
  // 状态管理
  const [isSuperBrainActive, setIsSuperBrainActive] = useState(settings.super_brain_monitoring);
  const [isEnabled, setIsEnabled] = useState(settings.auto_trading_enabled);
  const [selectedStrategy, setSelectedStrategy] = useState<'conservative' | 'aggressive'>(settings.trading_strategy || 'conservative');
  const [tempStrategy, setTempStrategy] = useState<'conservative' | 'aggressive'>(settings.trading_strategy || 'conservative');
  const [strategyChanged, setStrategyChanged] = useState(false);
  const [tempBalance, setTempBalance] = useState<string>(virtualAccount.balance.toString());
  const [tradingHistory, setTradingHistory] = useState<string[]>([]);
  const [pendingSignals, setPendingSignals] = useState<SuperBrainSignal[]>([]);

  // 监听设置变化
  useEffect(() => {
    setIsSuperBrainActive(settings.super_brain_monitoring);
    setIsEnabled(settings.auto_trading_enabled);
    setSelectedStrategy(settings.trading_strategy || 'conservative');
    setTempStrategy(settings.trading_strategy || 'conservative');
    setStrategyChanged(false);
    
    if (settings.virtual_balance !== undefined && settings.virtual_balance !== virtualAccount.balance) {
      setTempBalance(settings.virtual_balance.toString());
    }
  }, [settings, virtualAccount.balance]);

  // 监听最强大脑监控状态变化
  useEffect(() => {
    const handleMonitoringChange = (event: CustomEvent) => {
      setIsSuperBrainActive(event.detail.isMonitoring);
      if (!event.detail.isMonitoring && isEnabled) {
        setIsEnabled(false);
        updateSettings({ auto_trading_enabled: false });
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
  }, [isEnabled, updateSettings, toast]);

  // 执行交易并记录历史
  const executeTradeWithSignal = useCallback(async (signal: SuperBrainSignal, strategy: 'conservative' | 'aggressive') => {
    console.log('🔥 executeTradeWithSignal 开始:', { signal, strategy });
    
    try {
      console.log('🔥 调用 executeTrade...');
      const position = await executeTrade(signal, strategy);
      console.log('🔥 executeTrade 返回结果:', position);
      
      if (position) {
        console.log('✅ 交易执行成功，创建历史记录');
        const strategyData = TRADING_STRATEGIES.find(s => s.type === strategy);
        const executedHistory = formatTradingHistory('trade_executed', signal.symbol, signal.action, {
          entry: signal.entry,
          confidence: signal.confidence,
          strategyName: strategyData?.name,
          positionSize: position.size,
          stopLoss: signal.stopLoss,
          takeProfit: signal.takeProfit
        });
        
        setTradingHistory(prev => [...executedHistory, ...prev.slice(0, TRADING_CONFIG.MAX_HISTORY_ITEMS - executedHistory.length)]);
        
        toast({
          title: "交易执行成功!",
          description: `${signal.symbol} ${signal.action === 'buy' ? '买入' : '卖出'}订单已执行`,
        });
      } else {
        console.log('❌ executeTrade 返回空值');
      }
    } catch (error) {
      console.error('💥 executeTradeWithSignal 执行失败:', error);
      toast({
        title: "交易执行失败",
        description: "请检查账户余额和网络连接",
        variant: "destructive"
      });
    }
  }, [executeTrade, toast, setTradingHistory]);

  // 统一的信号处理函数
  const handleSignal = useCallback((signal: SuperBrainSignal) => {
    console.log('🔥 AutoTrader - handleSignal 开始，信号:', signal);
    
    try {
      // 步骤1: 检查设置
      const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      const currentIsEnabled = currentSettings.auto_trading_enabled || false;
      const currentStrategy = currentSettings.trading_strategy || 'conservative';
      
      console.log('🔥 步骤1 - 当前设置:', { currentIsEnabled, currentStrategy });
      
      if (!currentIsEnabled) {
        console.log('❌ 停止：AI自动交易未启动');
        return;
      }

      // 步骤2: 验证信号
      console.log('🔥 步骤2 - 验证信号...');
      if (!validateSignal(signal)) {
        console.log('❌ 停止：信号验证失败');
        return;
      }
      console.log('✅ 信号验证通过');
      
      // 步骤3: 检查策略
      const strategy = TRADING_STRATEGIES.find(s => s.type === currentStrategy);
      console.log('🔥 步骤3 - 策略检查:', { 
        strategy: strategy?.name, 
        required: strategy?.minConfidence, 
        actual: signal.confidence 
      });
      
      if (!strategy || signal.confidence < strategy.minConfidence) {
        console.log('❌ 停止：胜率不足，需要', strategy?.minConfidence, '实际', signal.confidence);
        return;
      }
      console.log('✅ 策略检查通过');

      // 步骤4: 检查重复持仓
      console.log('🔥 步骤4 - 检查重复持仓，当前持仓:', positions);
      if (positions.some(p => p.symbol === signal.symbol)) {
        console.log('❌ 停止：重复持仓');
        return;
      }
      console.log('✅ 无重复持仓');

      // 步骤5: 执行交易
      console.log('🔥 步骤5 - 开始执行交易...');
      executeTradeWithSignal(signal, currentStrategy);
      console.log('🔥 executeTradeWithSignal 调用完成');
      
    } catch (error) {
      console.error('💥 handleSignal 错误:', error);
    }
  }, [positions, executeTradeWithSignal]);

  // 注册信号处理器到桥接器
  useEffect(() => {
    console.log('🔌 AutoTrader 注册信号处理器');
    signalBridge.registerHandler(handleSignal);
    
    return () => {
      console.log('🔌 AutoTrader 移除信号处理器');
      signalBridge.unregisterHandler(handleSignal);
    };
  }, [handleSignal]);

  // 监听SuperBrain信号 - 稳定的事件监听器
  useEffect(() => {
    console.log('AutoTrader - 设置superBrainSignal事件监听器');
    
    const handleSuperBrainSignal = (event: CustomEvent) => {
      console.log('AutoTrader - 收到superBrainSignal事件:', event.detail);
      
      // 确保事件详情有效
      if (!event.detail) {
        console.log('AutoTrader - 信号详情为空，忽略');
        return;
      }
      
      // 立即处理信号，不依赖状态
      const signal = event.detail as SuperBrainSignal;
      console.log('AutoTrader - 开始处理信号:', signal);
      
      // 获取最新的设置状态
      const currentSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      const currentIsEnabled = currentSettings.auto_trading_enabled || false;
      
      console.log('AutoTrader - 当前自动交易状态:', currentIsEnabled);
      
      if (!currentIsEnabled) {
        console.log('AI自动交易未启动，忽略信号:', signal);
        return;
      }
      
      // 调用处理函数
      handleSignal(signal);
    };

    // 立即设置监听器
    window.addEventListener('superBrainSignal', handleSuperBrainSignal as EventListener);
    
    // 检查是否有待处理的信号
    console.log('AutoTrader - 监听器已设置，等待信号...');
    
    return () => {
      console.log('AutoTrader - 清理superBrainSignal事件监听器');
      window.removeEventListener('superBrainSignal', handleSuperBrainSignal as EventListener);
    };
  }, [handleSignal]); // 依赖handleSignal确保逻辑更新

  // 实时信号检查
  useEffect(() => {
    let realTimeInterval: NodeJS.Timeout;
    
    if (isAuthenticated && isEnabled && isSuperBrainActive) {
      console.log('AutoTrader - 启动实时信号检查');
      
      const handleRealTimeSignal = async () => {
        try {
          const data = await callSuperBrainAPI();
          if (data) {
            const signal: SuperBrainSignal = {
              symbol: data.symbol,
              action: data.action,
              confidence: data.confidence,
              entry: data.entry,
              stopLoss: data.stopLoss,
              takeProfit: data.takeProfit,
              reasoning: data.reasoning,
              timestamp: new Date()
            };
            
            window.dispatchEvent(new CustomEvent('superBrainSignal', { detail: signal }));
          }
        } catch (error) {
          console.error('获取实时信号失败:', error);
        }
      };
      
      realTimeInterval = setInterval(handleRealTimeSignal, TRADING_CONFIG.REAL_TIME_INTERVAL);
      handleRealTimeSignal();
    }
    
    return () => {
      if (realTimeInterval) {
        console.log('AutoTrader - 清理实时信号检查');
        clearInterval(realTimeInterval);
      }
    };
  }, [isAuthenticated, isEnabled, isSuperBrainActive, callSuperBrainAPI]);

  // 策略管理
  const handleStrategySelect = (strategyType: 'conservative' | 'aggressive') => {
    setTempStrategy(strategyType);
    setStrategyChanged(strategyType !== selectedStrategy);
  };

  const confirmStrategyChange = async () => {
    const success = await updateSettings({ trading_strategy: tempStrategy });
    if (success) {
      setSelectedStrategy(tempStrategy);
      setStrategyChanged(false);
      toast({
        title: "策略更新成功",
        description: `已切换到${TRADING_STRATEGIES.find(s => s.type === tempStrategy)?.name}策略`,
      });
    }
  };

  const cancelStrategyChange = () => {
    setTempStrategy(selectedStrategy);
    setStrategyChanged(false);
  };

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
    
    if (!success) return;

    setIsEnabled(newState);
    
    if (newState && isAuthenticated) {
      await startBackgroundMonitoring();
    }
    
    window.dispatchEvent(new CustomEvent('autoTraderStatusChanged', {
      detail: { isActive: newState }
    }));

    const strategyData = TRADING_STRATEGIES.find(s => s.type === selectedStrategy);
    toast({
      title: newState ? "AI自动交易已启动" : "AI自动交易已停止",
      description: newState 
        ? `${strategyData?.name}策略已激活，${isAuthenticated ? '后台监控已启动' : '本地监控模式'}`
        : "自动交易功能已关闭",
    });

    if (newState) {
      const startedHistory = formatTradingHistory('trader_started', '', '', {
        strategyName: strategyData?.name
      });
      setTradingHistory(prev => [...startedHistory, ...prev.slice(0, TRADING_CONFIG.MAX_HISTORY_ITEMS - startedHistory.length)]);
    }
  };

  // 余额管理
  const confirmBalanceUpdate = () => {
    const newBalance = Number(tempBalance);
    
    if (isNaN(newBalance) || newBalance < TRADING_CONFIG.MIN_BALANCE) {
      toast({
        title: "❌ 余额设置失败",
        description: `请输入有效的余额金额（最低${TRADING_CONFIG.MIN_BALANCE} USDT）`,
        variant: "destructive"
      });
      setTempBalance(virtualAccount.balance.toString());
      return;
    }
    
    updateBalance(newBalance);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Bot className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">AI自动赚钱</h2>
          <DollarSign className="w-8 h-8 text-green-400" />
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          智能识别最强大脑信号，自动执行高胜率交易策略
        </p>
      </div>

      <Tabs defaultValue="control" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="control" className="text-white">控制面板</TabsTrigger>
          <TabsTrigger value="account" className="text-white">账户管理</TabsTrigger>
          <TabsTrigger value="positions" className="text-white">持仓管理</TabsTrigger>
          <TabsTrigger value="history" className="text-white">交易历史</TabsTrigger>
        </TabsList>

        {/* 控制面板 */}
        <TabsContent value="control">
          <Card className="bg-slate-800/50 border-slate-600">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 左侧控制区 */}
                <div className="space-y-6">
                   {/* 主开关 */}
                   <div className="bg-slate-700/50 rounded-lg p-6">
                     <div className="flex items-center justify-between mb-4">
                       <div>
                         <h3 className="text-xl font-bold text-white mb-2">AI自动交易</h3>
                         <p className="text-slate-400 text-sm">
                           基于最强大脑信号自动执行交易策略
                         </p>
                       </div>
                       <div className="flex items-center gap-4">
                         <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                         <Switch
                           checked={isEnabled}
                           onCheckedChange={toggleAutoTrader}
                           disabled={!isSuperBrainActive}
                         />
                       </div>
                     </div>
                     
                     {/* 依赖提示 - 始终显示 */}
                     <div className={`rounded-lg p-4 border-2 ${
                       isSuperBrainActive 
                         ? 'bg-green-900/20 border-green-500/30' 
                         : 'bg-amber-900/20 border-amber-500/30'
                     }`}>
                       <div className="flex items-center gap-2 mb-3">
                         {isSuperBrainActive ? (
                           <>
                             <CheckCircle className="w-5 h-5 text-green-400" />
                             <span className="font-medium text-green-400">最强大脑监测已启用</span>
                           </>
                         ) : (
                           <>
                             <AlertTriangle className="w-5 h-5 text-amber-400" />
                             <span className="font-medium text-amber-400">需要启用最强大脑监测</span>
                           </>
                         )}
                       </div>
                       
                       <p className={`text-sm mb-3 ${
                         isSuperBrainActive ? 'text-green-300' : 'text-amber-300'
                       }`}>
                         {isSuperBrainActive 
                           ? '正在接收交易信号，AI自动交易可以正常工作'
                           : 'AI自动交易需要最强大脑检测提供交易信号，请先启用最强大脑监测功能获取市场分析数据'
                         }
                       </p>
                       
                       {!isSuperBrainActive && (
                         <Button 
                           size="sm" 
                           className="bg-amber-600 hover:bg-amber-700 text-black font-medium"
                           onClick={() => {
                             // 滚动到页面顶部的最强大脑部分
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                              toast({
                                title: "请向上滚动",
                                description: `在页面上方找到"最强大脑AI监测"功能并点击"开始监控"`,
                              });
                           }}
                         >
                           <Brain className="w-4 h-4 mr-2" />
                           找到最强大脑监测功能
                         </Button>
                       )}
                     </div>
                   </div>

                   {/* 策略选择 */}
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">交易策略</h3>
                    <div className="space-y-3">
                      {TRADING_STRATEGIES.map((strategy) => {
                        const IconComponent = strategy.iconName === 'Shield' ? Shield : Zap;
                        return (
                        <div 
                          key={strategy.type}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            tempStrategy === strategy.type 
                              ? 'border-blue-500 bg-blue-500/10' 
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                          onClick={() => handleStrategySelect(strategy.type)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={strategy.color}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{strategy.name}</h4>
                              <p className="text-sm text-slate-400">{strategy.description}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                最低胜率要求: {strategy.minConfidence}%
                              </p>
                            </div>
                            {tempStrategy === strategy.type && (
                              <CheckCircle className="w-5 h-5 text-blue-400" />
                            )}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                    
                    {strategyChanged && (
                      <div className="flex gap-2 mt-4">
                        <Button onClick={confirmStrategyChange} size="sm" className="bg-blue-600 hover:bg-blue-700">
                          确认更改
                        </Button>
                        <Button onClick={cancelStrategyChange} variant="outline" size="sm">
                          取消
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 右侧状态显示 */}
                <div className="space-y-6">
                  {/* 账户概览 */}
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-green-400" />
                      虚拟账户
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-green-400">
                          ${virtualAccount.balance.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">可用余额</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${virtualAccount.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {virtualAccount.totalPnL >= 0 ? '+' : ''}${virtualAccount.totalPnL.toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-400">总盈亏</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">
                          {virtualAccount.totalTrades}
                        </div>
                        <div className="text-sm text-slate-400">总交易数</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">
                          {(virtualAccount.winRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-400">胜率</div>
                      </div>
                    </div>
                  </div>

                  {/* 当前持仓 */}
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-yellow-400" />
                      当前持仓 ({positions.length})
                    </h3>
                    {positions.length > 0 ? (
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {positions.slice(0, 3).map((position) => (
                          <div key={position.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                            <div>
                              <div className="font-medium text-white">{position.symbol}</div>
                              <div className="text-sm text-slate-400">
                                {position.type === 'long' ? '做多' : '做空'} | ${position.entryPrice.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                              </div>
                              <div className={`text-sm ${position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 py-4">
                        暂无持仓
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 账户管理 */}
        <TabsContent value="account">
          <Card className="bg-slate-800/50 border-slate-600">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">虚拟账户设置</h3>
              
              <div className="space-y-6">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <Label htmlFor="balance" className="text-white">账户余额 (USDT)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      id="balance"
                      type="number"
                      value={tempBalance}
                      onChange={(e) => setTempBalance(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                      min={TRADING_CONFIG.MIN_BALANCE}
                    />
                    <Button 
                      onClick={confirmBalanceUpdate}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      更新
                    </Button>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    最低余额: {TRADING_CONFIG.MIN_BALANCE} USDT
                  </p>
                </div>

                <TradingStatistics 
                  virtualAccount={virtualAccount}
                  positions={positions}
                  tradingHistory={tradingHistory}
                  isEnabled={isEnabled}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* 持仓管理 */}
        <TabsContent value="positions">
          <Card className="bg-slate-800/50 border-slate-600">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">持仓管理</h3>
              
              {positions.length > 0 ? (
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div key={position.id} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-white text-lg">{position.symbol}</div>
                          <Badge 
                            variant={position.type === 'long' ? 'default' : 'destructive'}
                            className={position.type === 'long' ? 'bg-green-600' : 'bg-red-600'}
                          >
                            {position.type === 'long' ? '做多' : '做空'}
                          </Badge>
                          <Badge variant="outline" className="border-blue-400 text-blue-400">
                            {position.confidence}%
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                          </div>
                          <div className={`text-sm ${position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400">入场价格</div>
                          <div className="text-white font-medium">${position.entryPrice.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">当前价格</div>
                          <div className="text-white font-medium">${position.currentPrice.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">止损价格</div>
                          <div className="text-red-400 font-medium">${position.stopLoss.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">止盈价格</div>
                          <div className="text-green-400 font-medium">${position.takeProfit.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-600">
                        <div className="text-sm text-slate-400">
                          开仓时间: {position.openTime.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">
                          仓位大小: {position.size.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12">
                  <CircleDollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>暂无持仓</p>
                  <p className="text-sm">启动AI自动交易后，这里将显示自动开仓的交易</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* 交易历史 */}
        <TabsContent value="history">
          <Card className="bg-slate-800/50 border-slate-600">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">交易历史</h3>
              
              <ScrollArea className="h-96">
                {tradingHistory.length > 0 ? (
                  <div className="space-y-2">
                    {tradingHistory.map((entry, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-slate-700/30 rounded-lg text-sm text-slate-300 font-mono"
                      >
                        {entry}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-12">
                    <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>暂无交易历史</p>
                    <p className="text-sm">启动AI自动交易后，交易记录将在这里显示</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};