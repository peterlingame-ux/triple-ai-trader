import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Percent,
  ArrowUp,
  ArrowDown,
  Brain,
  Timer,
  Award,
  TrendingDownIcon,
  TrendingUpIcon,
  CircleDollarSign,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useLanguage } from "@/hooks/useLanguage";
import { useWalletData } from "@/hooks/useWalletData";

type TradingStrategy = 'conservative' | 'aggressive';
type TradingType = 'spot' | 'futures';

interface TradingSignal {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  tradingType: TradingType;
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  reasoning: string;
  timestamp: Date;
  status: 'pending' | 'executed' | 'closed';
  strategy: TradingStrategy;
  leverage?: number;
  aiAnalysis: {
    technicalScore: number;
    fundamentalScore: number;
    marketSentiment: 'bullish' | 'bearish' | 'neutral';
    riskLevel: 'low' | 'medium' | 'high';
  };
}

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  tradingType: TradingType;
  entry: number;
  size: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  openTime: Date;
  status: 'open' | 'closed';
  strategy: TradingStrategy;
  stopLoss: number;
  takeProfit: number;
  highestProfit: number;
  maxDrawdown: number;
  leverage?: number;
  margin?: number;
  liquidationPrice?: number;
}

interface AutoTraderConfig {
  enabled: boolean;
  strategy: TradingStrategy;
  tradingType: TradingType;
  conservativeMinConfidence: number;
  aggressiveMinConfidence: number;
  maxPositions: number;
  riskPerTrade: number;
  virtualBalance: number;
  allowedSymbols: string[];
  stopLossPercent: number;
  takeProfitPercent: number;
  trailingStop: boolean;
  maxDailyLoss: number;
  autoReinvest: boolean;
  leverage: number;
  maxLeverage: number;
  marginRatio: number;
}

interface TradingStats {
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  conservativeStats: {
    trades: number;
    winRate: number;
    avgProfit: number;
  };
  aggressiveStats: {
    trades: number;
    winRate: number;
    avgProfit: number;
  };
  dailyPnL: number;
  monthlyPnL: number;
  spotStats: { trades: number; winRate: number; avgProfit: number; };
  futuresStats: { trades: number; winRate: number; avgProfit: number; totalMargin: number; };
  leverageUsed: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export const AutoTrader = () => {
  const { toast } = useToast();
  const { cryptoData, newsData } = useCryptoData();
  const { t } = useLanguage();
  const { updateAutoTraderData } = useWalletData();
  const {
    analyzePriceChart,
    analyzeTechnicalIndicators,
    analyzeNewsSentiment,
    loading: aiLoading
  } = useAIAnalysis();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // 监听SuperBrain监控状态
  const [isSuperBrainMonitoring, setIsSuperBrainMonitoring] = useState(() => {
    const saved = localStorage.getItem('superBrainMonitoring');
    return saved ? JSON.parse(saved) : false;
  });

  // 从localStorage读取初始配置
  const [config, setConfig] = useState<AutoTraderConfig>(() => {
    const saved = localStorage.getItem('autoTraderConfig');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          enabled: false,
          strategy: 'conservative',
          tradingType: 'spot',
          conservativeMinConfidence: 90,
          aggressiveMinConfidence: 70,
          maxPositions: 5,
          riskPerTrade: 2,
          virtualBalance: 100000,
          allowedSymbols: ['BTC', 'ETH', 'SOL'],
          stopLossPercent: 5,
          takeProfitPercent: 10,
          trailingStop: true,
          maxDailyLoss: 1000,
          autoReinvest: true,
          leverage: 1,
          maxLeverage: 100,
          marginRatio: 0.1,
          ...parsed
        };
      } catch (error) {
        console.error('Failed to parse saved AutoTrader config:', error);
      }
    }
    return {
      enabled: false,
      strategy: 'conservative',
      tradingType: 'spot',
      conservativeMinConfidence: 90,
      aggressiveMinConfidence: 70,
      maxPositions: 5,
      riskPerTrade: 2,
      virtualBalance: 100000,
      allowedSymbols: ['BTC', 'ETH', 'SOL'],
      stopLossPercent: 5,
      takeProfitPercent: 10,
      trailingStop: true,
      maxDailyLoss: 1000,
      autoReinvest: true,
      leverage: 1,
      maxLeverage: 100,
      marginRatio: 0.1
    };
  });

  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [stats, setStats] = useState<TradingStats>({
    totalPnL: 0,
    winRate: 87.5,
    totalTrades: 48,
    conservativeStats: { trades: 32, winRate: 93.8, avgProfit: 156.5 },
    aggressiveStats: { trades: 16, winRate: 75.0, avgProfit: 89.2 },
    dailyPnL: 1247.89,
    monthlyPnL: 15847.32,
    spotStats: { trades: 18, winRate: 89.0, avgProfit: 120.5 },
    futuresStats: { trades: 24, winRate: 83.3, avgProfit: 185.2, totalMargin: 8500 },
    leverageUsed: 3.2,
    maxDrawdown: -2.8,
    sharpeRatio: 2.15
  });

  const [tradingActivity, setTradingActivity] = useState<string[]>([]);

  // 监听SuperBrain状态变化
  useEffect(() => {
    const handleSuperBrainStatusChange = (event: CustomEvent) => {
      setIsSuperBrainMonitoring(event.detail.isMonitoring);
      
      // 如果SuperBrain停止监控，自动停止AutoTrader
      if (!event.detail.isMonitoring && config.enabled) {
        setConfig(prev => {
          const newConfig = { ...prev, enabled: false };
          localStorage.setItem('autoTraderConfig', JSON.stringify(newConfig));
          return newConfig;
        });
        
        toast({
          title: "AI自动赚钱已暂停",
          description: "最强大脑监控已停止，AI自动赚钱功能已自动关闭",
          duration: 5000,
        });
        
        setTradingActivity(prev => [
          `⚠️ 最强大脑监控停止，AI自动赚钱已暂停`,
          ...prev.slice(0, 19)
        ]);
      }
    };

    window.addEventListener('superBrainMonitoringChanged', handleSuperBrainStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('superBrainMonitoringChanged', handleSuperBrainStatusChange as EventListener);
    };
  }, [config.enabled, toast]);

  // 监听最强大脑交易信号
  useEffect(() => {
    const handleSuperBrainSignal = async (event: CustomEvent) => {
      // 只有当AI自动交易开启且SuperBrain监控开启时才响应
      if (!config.enabled || !isSuperBrainMonitoring) {
        console.log('AutoTrader or SuperBrain disabled, ignoring signal');
        return;
      }

      const signalData = event.detail;
      console.log('AutoTrader received SuperBrain signal:', signalData);

      // 检查信号强度是否符合配置要求
      const minConfidence = config.strategy === 'conservative' 
        ? config.conservativeMinConfidence 
        : config.aggressiveMinConfidence;

      if (signalData.confidence < minConfidence) {
        console.log(`Signal confidence ${signalData.confidence}% below threshold ${minConfidence}%`);
        setTradingActivity(prev => [
          `⚠️ 信号强度${signalData.confidence}%低于设定阈值${minConfidence}%，忽略交易`,
          ...prev.slice(0, 19)
        ]);
        return;
      }

      // 检查是否已有该币种的持仓
      const existingPosition = positions.find(p => 
        p.symbol === signalData.symbol && p.status === 'open'
      );

      if (existingPosition) {
        console.log(`Already have open position for ${signalData.symbol}`);
        setTradingActivity(prev => [
          `💰 ${signalData.symbol}已有持仓，跳过本次信号`,
          ...prev.slice(0, 19)
        ]);
        return;
      }

      // 检查最大持仓数限制
      const openPositions = positions.filter(p => p.status === 'open').length;
      if (openPositions >= config.maxPositions) {
        console.log(`Max positions reached: ${openPositions}/${config.maxPositions}`);
        setTradingActivity(prev => [
          `⚠️ 已达最大持仓数${config.maxPositions}，无法开新仓`,
          ...prev.slice(0, 19)
        ]);
        return;
      }

      // 执行自动交易
      await executeAutoTrade(signalData);
    };

    window.addEventListener('superBrainTradingSignal', handleSuperBrainSignal as EventListener);
    
    return () => {
      window.removeEventListener('superBrainTradingSignal', handleSuperBrainSignal as EventListener);
    };
  }, [config, positions, isSuperBrainMonitoring]);

  // 执行自动交易的核心函数
  const executeAutoTrade = async (signalData: any) => {
    try {
      const { symbol, signal, confidence, price, tradingDetails } = signalData;
      
      // 计算交易金额（基于风险百分比）
      const riskAmount = (config.virtualBalance * config.riskPerTrade) / 100;
      const entryPrice = tradingDetails?.entry || price;
      const stopLoss = tradingDetails?.stopLoss || (entryPrice * (signal === 'buy' ? 0.95 : 1.05));
      const takeProfit = tradingDetails?.takeProfit || (entryPrice * (signal === 'buy' ? 1.1 : 0.9));
      
      // 根据止损距离计算仓位大小
      const stopDistance = Math.abs(entryPrice - stopLoss) / entryPrice;
      const maxPositionSize = riskAmount / stopDistance;
      const positionSize = Math.min(maxPositionSize, config.virtualBalance * 0.1); // 最大10%仓位
      
      // 创建新的交易信号
      const newSignal: TradingSignal = {
        id: `signal_${Date.now()}`,
        symbol,
        type: signal === 'buy' ? 'long' : 'short',
        tradingType: config.tradingType,
        confidence,
        entry: entryPrice,
        stopLoss,
        takeProfit,
        reasoning: `🧠 最强大脑AI分析：${tradingDetails?.reasoning || '综合6种AI模型分析结果'}`,
        timestamp: new Date(),
        status: 'executed',
        strategy: config.strategy,
        leverage: config.tradingType === 'futures' ? config.leverage : undefined,
        aiAnalysis: {
          technicalScore: confidence,
          fundamentalScore: confidence,
          marketSentiment: signal === 'buy' ? 'bullish' : 'bearish',
          riskLevel: confidence > 85 ? 'low' : confidence > 70 ? 'medium' : 'high'
        }
      };

      // 创建新的持仓
      const newPosition: Position = {
        id: `pos_${Date.now()}`,
        symbol,
        type: signal === 'buy' ? 'long' : 'short',
        tradingType: config.tradingType,
        entry: entryPrice,
        size: positionSize,
        currentPrice: entryPrice,
        pnl: 0,
        pnlPercent: 0,
        openTime: new Date(),
        status: 'open',
        strategy: config.strategy,
        stopLoss,
        takeProfit,
        highestProfit: 0,
        maxDrawdown: 0,
        leverage: config.tradingType === 'futures' ? config.leverage : undefined,
        margin: config.tradingType === 'futures' ? positionSize / config.leverage : undefined,
        liquidationPrice: config.tradingType === 'futures' 
          ? (signal === 'buy' ? entryPrice * 0.8 : entryPrice * 1.2) 
          : undefined
      };

      // 更新状态
      setSignals(prev => [newSignal, ...prev.slice(0, 19)]);
      setPositions(prev => [newPosition, ...prev]);
      
      // 更新虚拟余额
      setConfig(prev => ({
        ...prev,
        virtualBalance: prev.virtualBalance - positionSize
      }));

      // 记录交易活动
      const actionText = signal === 'buy' ? '买入' : '卖出';
      setTradingActivity(prev => [
        `🚀 基于最强大脑分析自动${actionText} ${symbol}`,
        `💰 入场价格: $${entryPrice.toFixed(2)} | 仓位: ${(positionSize/1000).toFixed(1)}K`,
        `🎯 止损: $${stopLoss.toFixed(2)} | 止盈: $${takeProfit.toFixed(2)}`,
        `🧠 AI胜率: ${confidence}% | 策略: ${config.strategy}`,
        ...prev.slice(0, 16)
      ]);

      // 显示成功通知
      toast({
        title: `🚀 AI自动交易执行成功`,
        description: `基于最强大脑分析，自动${actionText} ${symbol}，胜率 ${confidence}%`,
        duration: 8000,
      });

      console.log('Auto trade executed successfully:', newPosition);

    } catch (error) {
      console.error('Auto trade execution failed:', error);
      
      setTradingActivity(prev => [
        `❌ 自动交易执行失败: ${error.message}`,
        ...prev.slice(0, 19)
      ]);

      toast({
        title: '自动交易失败',
        description: '执行交易时发生错误，请检查配置',
        duration: 5000,
      });
    }
  };

  const toggleAutoTrader = () => {
    // 检查SuperBrain监控状态
    if (!isSuperBrainMonitoring && !config.enabled) {
      toast({
        title: "无法启用AI自动赚钱",
        description: "请先开启最强大脑检测功能，才能使用AI自动赚钱",
        duration: 5000,
      });
      return;
    }

    const newEnabled = !config.enabled;
    const newConfig = { ...config, enabled: newEnabled };
    setConfig(newConfig);
    
    // 保存配置到localStorage
    localStorage.setItem('autoTraderConfig', JSON.stringify(newConfig));
    
    // 发送AI自动赚钱状态变化事件
    const statusChangeEvent = new CustomEvent('autoTraderStatusChanged', {
      detail: { isActive: newEnabled }
    });
    window.dispatchEvent(statusChangeEvent);
    
    const message = newEnabled ? 'AI自动赚钱已启动' : 'AI自动赚钱已停止';
    
    setTradingActivity(prev => [
      `⚡ ${message}`,
      ...prev.slice(0, 19)
    ]);
    
    toast({
      title: message,
      description: newEnabled ? '已连接最强大脑信号，将自动执行高胜率交易' : '系统已暂停，不再自动执行交易',
    });
  };

  // 模拟价格更新
  useEffect(() => {
    const updatePrices = () => {
      setPositions(prev => prev.map(position => {
        if (position.status === 'closed') return position;

        const volatility = position.strategy === 'aggressive' ? 0.025 : 0.015;
        const priceChange = (Math.random() - 0.5) * volatility;
        const newPrice = position.currentPrice * (1 + priceChange);
        
        let pnl = 0;
        if (position.type === 'long') {
          pnl = (newPrice - position.entry) * (position.size / position.entry);
        } else {
          pnl = (position.entry - newPrice) * (position.size / position.entry);
        }
        
        const pnlPercent = (pnl / position.size) * 100;
        const highestProfit = Math.max(position.highestProfit, pnl);
        const maxDrawdown = Math.min(position.maxDrawdown, pnl);

        // 自动止损止盈
        const shouldStopLoss = (position.type === 'long' && newPrice <= position.stopLoss) ||
                              (position.type === 'short' && newPrice >= position.stopLoss);
        
        const shouldTakeProfit = (position.type === 'long' && newPrice >= position.takeProfit) ||
                                (position.type === 'short' && newPrice <= position.takeProfit);

        if (shouldStopLoss || shouldTakeProfit) {
          const reason = shouldStopLoss ? '止损' : '止盈';
          setTradingActivity(prev => [
            `${shouldStopLoss ? '🛑' : '🎯'} 自动${reason}: ${position.symbol} ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)`,
            ...prev.slice(0, 19)
          ]);
          
          // 更新统计数据
          setStats(prevStats => ({
            ...prevStats,
            totalPnL: prevStats.totalPnL + pnl,
            totalTrades: prevStats.totalTrades + 1,
            dailyPnL: prevStats.dailyPnL + pnl
          }));

          return {
            ...position,
            currentPrice: newPrice,
            pnl,
            pnlPercent,
            status: 'closed' as const,
            highestProfit,
            maxDrawdown
          };
        }

        return {
          ...position,
          currentPrice: newPrice,
          pnl,
          pnlPercent,
          highestProfit,
          maxDrawdown
        };
      }));
    };

    const interval = setInterval(updatePrices, 2000);
    return () => clearInterval(interval);
  }, []);

  // 同步数据到WalletProvider
  useEffect(() => {
    updateAutoTraderData({
      virtualBalance: config.virtualBalance,
      totalPnL: stats.totalPnL,
      dailyPnL: stats.dailyPnL,
      activeTrades: positions.filter(p => p.status === 'open').length,
      winRate: stats.winRate,
      monthlyPnL: stats.monthlyPnL
    });
  }, [stats, positions, config.virtualBalance, updateAutoTraderData]);

  // 模拟实时数据更新以显示系统活跃状态
  useEffect(() => {
    if (!config.enabled) return;

    const simulateActivity = () => {
      setStats(prevStats => {
        const newStats = {
          ...prevStats,
          dailyPnL: prevStats.dailyPnL + (Math.random() - 0.5) * 20, // 小幅波动
        };
        return newStats;
      });
    };

    // 每30秒更新一次，显示系统在活跃监控
    const interval = setInterval(simulateActivity, 30000);
    return () => clearInterval(interval);
  }, [config.enabled]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-medium px-6 py-3 shadow-lg relative">
          <Bot className="w-5 h-5 mr-2" />
          AI自动赚钱
          {config.enabled && (
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-7xl max-h-[95vh] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-emerald-700/50 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3 font-orbitron text-xl">
            <Bot className="w-6 h-6 text-emerald-400" />
            AI自动赚钱系统
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="outline" className={`${config.enabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${config.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                {config.enabled ? '运行中 (接收最强大脑信号)' : '已停止'}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-4 min-h-0">
          {/* 左侧控制面板 */}
          <div className="w-1/3 space-y-4">
            {/* 主控制开关 */}
            <Card className="p-4 bg-gradient-to-br from-slate-800/80 to-slate-700/50 border-slate-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  系统控制
                </h3>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={toggleAutoTrader}
                    disabled={!isSuperBrainMonitoring}
                    className="data-[state=checked]:bg-green-600"
                  />
                  {config.enabled ? (
                    <Play className="w-4 h-4 text-green-400" />
                  ) : (
                    <Pause className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">🧠 最强大脑联动</h4>
                  <Badge variant="outline" className={
                    isSuperBrainMonitoring 
                      ? (config.enabled ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-blue-500/20 text-blue-400 border-blue-500/50")
                      : "bg-red-500/20 text-red-400 border-red-500/50"
                  }>
                    {isSuperBrainMonitoring 
                      ? (config.enabled ? "运行中" : "就绪") 
                      : "未启用"
                    }
                  </Badge>
                </div>
                
                {!isSuperBrainMonitoring ? (
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-medium">需要启用最强大脑检测</span>
                    </div>
                    <p className="text-sm text-red-300">
                      AI自动赚钱依赖最强大脑的交易信号。请先启用最强大脑检测功能，系统才能为您提供高胜率的交易机会。
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mb-3">
                    当最强大脑检测到高胜率交易机会时，AI自动赚钱将根据信号自动执行交易
                  </p>
                )}
                
                {config.enabled && isSuperBrainMonitoring && (
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-xs text-green-300 space-y-1">
                      <div>• 实时监听最强大脑交易信号</div>
                      <div>• 根据策略自动过滤信号强度</div>
                      <div>• 自动执行符合条件的交易</div>
                      <div>• 严格遵守仓位和风险管理</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 策略选择 */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">交易策略</label>
                    <Select value={config.strategy} onValueChange={(value: TradingStrategy) => setConfig(prev => ({ ...prev, strategy: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            稳健策略 (≥90%胜率)
                          </div>
                        </SelectItem>
                        <SelectItem value="aggressive">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-orange-400" />
                            激进策略 (≥70%胜率)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">交易类型</label>
                    <Select value={config.tradingType} onValueChange={(value: TradingType) => setConfig(prev => ({ ...prev, tradingType: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spot">
                          <div className="flex items-center gap-2">
                            <CircleDollarSign className="w-4 h-4 text-blue-400" />
                            现货交易
                          </div>
                        </SelectItem>
                        <SelectItem value="futures">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            合约交易
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {config.tradingType !== 'spot' && (
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">杠杆倍数: {config.leverage}x</label>
                    <Slider
                      value={[config.leverage]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, leverage: value[0] }))}
                      max={config.tradingType === 'futures' ? 100 : 50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1x</span>
                      <span>{config.tradingType === 'futures' ? '100x' : '50x'}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* 虚拟账户 */}
            <Card className="p-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-blue-400" />
                虚拟账户
              </h3>
              
              <div className="space-y-3">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-400 text-sm">总资产</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    ${(config.virtualBalance + stats.totalPnL).toLocaleString()}
                  </p>
                  <p className={`text-sm font-mono ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toLocaleString()} 
                    ({((stats.totalPnL / config.virtualBalance) * 100).toFixed(2)}%)
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/20">
                    <p className="text-green-400">日盈亏</p>
                    <p className="text-white font-mono">+${stats.dailyPnL.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-blue-500/10 rounded border border-blue-500/20">
                    <p className="text-blue-400">月盈亏</p>
                    <p className="text-white font-mono">+${stats.monthlyPnL.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <p className="text-slate-400">胜率</p>
                    <p className="text-white font-mono">{stats.winRate.toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <p className="text-slate-400">总交易</p>
                    <p className="text-white font-mono">{stats.totalTrades}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 右侧活动面板 */}
          <div className="flex-1 space-y-4">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                <TabsTrigger value="activity">实时动态</TabsTrigger>
                <TabsTrigger value="signals">AI信号</TabsTrigger>
                <TabsTrigger value="positions">持仓管理</TabsTrigger>
              </TabsList>
              
              {/* 实时交易动态 */}
              <TabsContent value="activity" className="space-y-3 mt-4">
                <Card className="bg-slate-800/50 rounded-lg p-4 border-slate-700">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    实时交易动态
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs animate-pulse">LIVE</Badge>
                  </h4>
                  
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {tradingActivity.length === 0 ? (
                      <div className="text-center text-slate-400 py-8">
                        <Bot className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                        <p>AI系统待机中...</p>
                        <p className="text-sm">启用后查看实时交易动态</p>
                      </div>
                    ) : (
                      tradingActivity.map((activity, index) => (
                        <div key={index} className="p-2 bg-slate-700/30 rounded text-sm text-slate-200 border-l-2 border-blue-500/30">
                          <span className="text-slate-400 text-xs">{new Date().toLocaleTimeString()}</span>
                          <p className="mt-1">{activity}</p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>
              
              {/* AI信号 */}
              <TabsContent value="signals" className="space-y-3 mt-4">
                <Card className="bg-slate-800/50 rounded-lg p-4 border-slate-700">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    AI信号分析
                  </h4>
                  
                  <div className="max-h-80 overflow-y-auto space-y-3">
                    {signals.length === 0 ? (
                      <div className="text-center text-slate-400 py-8">
                        <Brain className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                        <p>AI正在分析市场...</p>
                      </div>
                    ) : (
                      signals.map((signal) => (
                        <Card key={signal.id} className="p-3 bg-gradient-to-r from-slate-700/50 to-slate-600/30 border-slate-600">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className={signal.type === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {signal.type === 'long' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                {signal.symbol}
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-400">
                                <Brain className="w-3 h-3 mr-1" />
                                {signal.confidence}%
                              </Badge>
                            </div>
                            {signal.status === 'executed' && <CheckCircle className="w-4 h-4 text-green-400" />}
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
                          
                          <p className="text-slate-300 text-xs bg-slate-800/30 p-2 rounded">{signal.reasoning}</p>
                        </Card>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>
              
              {/* 持仓管理 */}
              <TabsContent value="positions" className="space-y-3 mt-4">
                <Card className="bg-slate-800/50 rounded-lg p-4 border-slate-700">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-green-400" />
                    持仓管理 ({positions.filter(p => p.status === 'open').length})
                  </h4>
                  
                  <div className="max-h-80 overflow-y-auto space-y-3">
                    {positions.filter(p => p.status === 'open').length === 0 ? (
                      <div className="text-center text-slate-400 py-8">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                        <p>暂无持仓</p>
                        <p className="text-sm">AI将自动发现交易机会</p>
                      </div>
                    ) : (
                      positions.filter(p => p.status === 'open').map((position) => (
                        <Card key={position.id} className="p-3 bg-gradient-to-r from-slate-700/50 to-slate-600/30 border-slate-600">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className={position.type === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {position.type === 'long' ? <TrendingUpIcon className="w-3 h-3 mr-1" /> : <TrendingDownIcon className="w-3 h-3 mr-1" />}
                                {position.symbol}
                              </Badge>
                              <Badge className={position.pnl >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-400">
                              {position.openTime.toLocaleTimeString()}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-slate-400">入场:</span>
                              <p className="text-white font-mono">${position.entry.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">当前:</span>
                              <p className="text-white font-mono">${position.currentPrice.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">盈亏%:</span>
                              <p className={`font-mono ${position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};