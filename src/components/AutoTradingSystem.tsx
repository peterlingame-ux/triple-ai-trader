import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  Play, 
  Pause, 
  Settings,
  Brain,
  DollarSign,
  Target,
  AlertTriangle,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Position {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  margin: number;
  marginRatio: number;
  liquidationPrice: number;
  leverage: number;
  confidence: number;
  openTime: Date;
}

interface TradingConfig {
  initialCapital: number;
  maxPositions: number;
  riskPerTrade: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  aiConfidenceThreshold: number;
  enableLongPositions: boolean;
  enableShortPositions: boolean;
}

interface VirtualAccount {
  balance: number;
  totalPnL: number;
  dailyPnL: number;
  winRate: number;
  totalTrades: number;
  activePositions: number;
}

export const AutoTradingSystem = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount>({
    balance: 100000,
    totalPnL: 0,
    dailyPnL: 0,
    winRate: 0,
    totalTrades: 0,
    activePositions: 0
  });
  const [aiAnalysisCount, setAiAnalysisCount] = useState(0);
  const [tradingHistory, setTradingHistory] = useState<string[]>([]);
  
  const [config, setConfig] = useState<TradingConfig>({
    initialCapital: 100000,
    maxPositions: 5,
    riskPerTrade: 2,
    stopLossPercent: 5,
    takeProfitPercent: 10,
    aiConfidenceThreshold: 75,
    enableLongPositions: true,
    enableShortPositions: true
  });

  useEffect(() => {
    if (isRunning) {
      // 重置账户到初始状态
      setVirtualAccount(prev => ({
        ...prev,
        balance: config.initialCapital,
        totalPnL: 0,
        dailyPnL: 0,
        activePositions: 0
      }));
      
      // 启动AI分析定时器
      const interval = setInterval(() => {
        performAIAnalysis();
      }, 30000); // 每30秒分析一次

      // 立即执行一次分析
      performAIAnalysis();

      return () => clearInterval(interval);
    } else {
      // 清空持仓
      setPositions([]);
      setVirtualAccount(prev => ({ ...prev, activePositions: 0 }));
    }
  }, [isRunning, config.initialCapital]);

  const performAIAnalysis = async () => {
    try {
      console.log('执行AI市场分析...');
      setAiAnalysisCount(prev => prev + 1);
      
      // 调用超级大脑分析
      const { data, error } = await supabase.functions.invoke('super-brain-analysis', {
        body: {
          symbols: ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'MATIC'],
          analysisType: 'full_market_scan',
          confidenceThreshold: config.aiConfidenceThreshold
        }
      });

      if (error) {
        console.error('AI分析API错误:', error);
        toast({
          title: "AI分析失败",
          description: `错误: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      if (data && data.success) {
        console.log('AI分析成功:', data);
        
        // 基于AI分析结果执行交易
        await executeTradesBasedOnAI(data);

        toast({
          title: "AI分析完成",
          description: `发现 ${data.trading_signals?.length || 0} 个高置信度交易信号`,
        });
      }
    } catch (error) {
      console.error('AI分析失败:', error);
      toast({
        title: "AI分析错误",
        description: "网络连接或系统错误",
        variant: "destructive"
      });
    }
  };

  const executeTradesBasedOnAI = async (analysisData: any) => {
    if (!analysisData.trading_signals || analysisData.trading_signals.length === 0) {
      console.log('没有高置信度交易信号');
      return;
    }

    console.log('开始执行AI交易信号:', analysisData.trading_signals);

    for (const signal of analysisData.trading_signals) {
      // 检查是否超过最大持仓数
      if (positions.length >= config.maxPositions) {
        console.log('已达最大持仓数，跳过交易');
        break;
      }

      // 检查交易方向是否启用
      const isLong = signal.signal === 'BUY';
      if ((isLong && !config.enableLongPositions) || (!isLong && !config.enableShortPositions)) {
        console.log(`${signal.signal}方向未启用，跳过 ${signal.symbol}`);
        continue;
      }

      // 计算持仓大小
      const riskAmount = virtualAccount.balance * (config.riskPerTrade / 100);
      const leverage = 20; // 固定20倍杠杆
      const positionSize = riskAmount * leverage / signal.entry_price;

      // 创建新持仓
      const newPosition: Position = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        symbol: signal.symbol,
        side: isLong ? 'LONG' : 'SHORT',
        size: positionSize,
        entryPrice: signal.entry_price,
        markPrice: signal.entry_price,
        unrealizedPnl: 0,
        unrealizedPnlPercent: 0,
        margin: riskAmount,
        marginRatio: 0,
        liquidationPrice: isLong ? signal.entry_price * 0.8 : signal.entry_price * 1.2,
        leverage: leverage,
        confidence: signal.confidence,
        openTime: new Date()
      };

      // 添加持仓
      setPositions(prev => [...prev, newPosition]);

      // 更新虚拟账户
      setVirtualAccount(prev => ({
        ...prev,
        balance: prev.balance - riskAmount, // 减去保证金
        totalTrades: prev.totalTrades + 1,
        activePositions: prev.activePositions + 1
      }));

      // 添加交易历史
      const historyEntry = `${new Date().toLocaleTimeString()} - AI自动执行${signal.signal} ${signal.symbol} @ $${signal.entry_price.toFixed(2)} (置信度: ${signal.confidence}%) ✅`;
      setTradingHistory(prev => [historyEntry, ...prev.slice(0, 49)]); // 保留最近50条

      console.log(`创建持仓: ${signal.symbol} ${signal.signal} @ ${signal.entry_price}`);

      toast({
        title: `AI自动开仓`,
        description: `${signal.symbol} ${isLong ? '做多' : '做空'} @ $${signal.entry_price.toFixed(2)}`,
      });
    }
  };

  const toggleTrading = () => {
    setIsRunning(!isRunning);
    toast({
      title: isRunning ? "AI自动交易已停止" : "AI自动交易已启动",
      description: isRunning ? "所有自动交易活动已暂停" : "开始监控市场并执行自动交易",
    });
  };

  const calculateTotalPnL = () => {
    return positions.reduce((total, pos) => total + pos.unrealizedPnl, 0);
  };

  // 模拟价格波动更新持仓盈亏
  useEffect(() => {
    if (positions.length === 0) return;

    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => {
        // 模拟价格变动 (-0.5% 到 +0.5%)
        const priceChange = (Math.random() - 0.5) * 0.01;
        const newMarkPrice = pos.markPrice * (1 + priceChange);
        
        // 计算盈亏
        const priceDiff = newMarkPrice - pos.entryPrice;
        const unrealizedPnl = pos.side === 'LONG' 
          ? priceDiff * pos.size
          : -priceDiff * pos.size;
        
        const unrealizedPnlPercent = (unrealizedPnl / pos.margin) * 100;

        return {
          ...pos,
          markPrice: newMarkPrice,
          unrealizedPnl,
          unrealizedPnlPercent,
          marginRatio: Math.abs(unrealizedPnlPercent) > 80 ? 150 : Math.abs(unrealizedPnlPercent) * 2
        };
      }));
    }, 5000); // 每5秒更新一次价格

    return () => clearInterval(interval);
  }, [positions.length]);

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <Card className="bg-slate-900/95 border-slate-700/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">AI自动交易系统</h2>
              <Badge className={`${isRunning ? 'bg-green-600' : 'bg-slate-600'}`}>
                {isRunning ? '运行中' : '已停止'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-400">AI分析次数</div>
                <div className="text-lg font-bold text-blue-400">{aiAnalysisCount}</div>
              </div>
              
              <Button
                onClick={toggleTrading}
                className={`${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isRunning ? (
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
            </div>
          </div>

          {/* 交易配置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">初始虚拟本金</label>
              <Input
                type="number"
                value={config.initialCapital}
                onChange={(e) => setConfig(prev => ({...prev, initialCapital: Number(e.target.value)}))}
                className="bg-slate-800 border-slate-600 text-white"
                disabled={isRunning}
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-2 block">最大持仓数</label>
              <Input
                type="number"
                value={config.maxPositions}
                onChange={(e) => setConfig(prev => ({...prev, maxPositions: Number(e.target.value)}))}
                className="bg-slate-800 border-slate-600 text-white"
                disabled={isRunning}
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-2 block">单笔风险 (%)</label>
              <Input
                type="number"
                value={config.riskPerTrade}
                onChange={(e) => setConfig(prev => ({...prev, riskPerTrade: Number(e.target.value)}))}
                className="bg-slate-800 border-slate-600 text-white"
                disabled={isRunning}
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-2 block">AI置信度阈值 (%)</label>
              <Input
                type="number"
                value={config.aiConfidenceThreshold}
                onChange={(e) => setConfig(prev => ({...prev, aiConfidenceThreshold: Number(e.target.value)}))}
                className="bg-slate-800 border-slate-600 text-white"
                disabled={isRunning}
              />
            </div>
          </div>

          {/* 交易开关 */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch 
                checked={config.enableLongPositions}
                onCheckedChange={(checked) => setConfig(prev => ({...prev, enableLongPositions: checked}))}
                disabled={isRunning}
              />
              <span className="text-sm text-slate-300">启用多单</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch 
                checked={config.enableShortPositions}
                onCheckedChange={(checked) => setConfig(prev => ({...prev, enableShortPositions: checked}))}
                disabled={isRunning}
              />
              <span className="text-sm text-slate-300">启用空单</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 账户概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-medium text-slate-300">账户余额</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              ${virtualAccount.balance.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">USDT</div>
          </div>
        </Card>

        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-medium text-slate-300">未实现盈亏</h3>
            </div>
            <div className={`text-2xl font-bold ${calculateTotalPnL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {calculateTotalPnL() >= 0 ? '+' : ''}${calculateTotalPnL().toFixed(2)}
            </div>
            <div className={`text-xs ${calculateTotalPnL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {((calculateTotalPnL() / virtualAccount.balance) * 100).toFixed(2)}%
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-medium text-slate-300">持仓数量</h3>
            </div>
            <div className="text-2xl font-bold text-white">
              {positions.length}
            </div>
            <div className="text-xs text-slate-400">
              / {config.maxPositions} 最大
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-medium text-slate-300">AI状态</h3>
            </div>
            <div className="text-2xl font-bold text-orange-400">
              {isRunning ? '分析中' : '待机'}
            </div>
            <div className="text-xs text-slate-400">
              超级大脑检测
            </div>
          </div>
        </Card>
      </div>

      {/* 持仓详情 */}
      {positions.length > 0 && (
        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              当前持仓
            </h3>
            
            <div className="space-y-4">
              {positions.map((position) => (
                <div key={position.id} className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-white">{position.symbol}</h4>
                      <Badge className={`${position.side === 'LONG' ? 'bg-green-600' : 'bg-red-600'}`}>
                        {position.leverage}x {position.side === 'LONG' ? '多' : '空'}
                      </Badge>
                      <Badge className="bg-purple-600 text-xs">
                        AI {position.confidence}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {position.side === 'LONG' ? (
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">收益额 (USDT)</div>
                      <div className={`text-lg font-bold ${position.unrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.unrealizedPnl >= 0 ? '+' : ''}${position.unrealizedPnl.toFixed(2)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-400 mb-1">收益率</div>
                      <div className={`text-lg font-bold ${position.unrealizedPnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.unrealizedPnlPercent >= 0 ? '+' : ''}{position.unrealizedPnlPercent.toFixed(2)}%
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-400 mb-1">持仓量 ({position.symbol.replace('USDT', '')})</div>
                      <div className="text-lg font-bold text-white">{position.size.toFixed(4)}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-400 mb-1">保证金 (USDT)</div>
                      <div className="text-lg font-bold text-white">{position.margin.toLocaleString()}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-400 mb-1">开仓均价</div>
                      <div className="text-lg font-bold text-white">${position.entryPrice.toFixed(2)}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-400 mb-1">标记价格</div>
                      <div className="text-lg font-bold text-white">${position.markPrice.toFixed(2)}</div>
                    </div>
                  </div>

                  <Separator className="my-3 bg-slate-700" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">维持保证金率</div>
                      <div className="text-sm font-medium text-yellow-400">{position.marginRatio.toFixed(2)}%</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-400 mb-1">预估强平价</div>
                      <div className="text-sm font-medium text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        ${position.liquidationPrice.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                        调整
                      </Button>
                      <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                        平仓
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 无持仓时的提示 */}
      {positions.length === 0 && isRunning && (
        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-8 text-center">
            <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">AI正在监控市场</h3>
            <p className="text-sm text-slate-500">
              超级大脑正在分析市场数据，寻找最佳交易机会...
            </p>
          </div>
        </Card>
      )}

      {/* 交易历史 */}
      {tradingHistory.length > 0 && (
        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              交易历史
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tradingHistory.map((entry, index) => (
                <div key={index} className="text-sm text-slate-300 bg-slate-800/30 p-2 rounded">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};