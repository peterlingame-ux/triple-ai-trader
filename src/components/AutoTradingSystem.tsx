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

interface Position {
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

export const AutoTradingSystem = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [totalBalance, setTotalBalance] = useState(100000);
  const [totalPnL, setTotalPnL] = useState(0);
  const [aiAnalysisCount, setAiAnalysisCount] = useState(0);
  
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

  // 模拟持仓数据
  const mockPositions: Position[] = [
    {
      symbol: "ETHUSDT",
      side: "LONG",
      size: 23,
      entryPrice: 4675.36,
      markPrice: 4550.44,
      unrealizedPnl: -2873.16,
      unrealizedPnlPercent: -53.43,
      margin: 5233,
      marginRatio: 1432.6,
      liquidationPrice: 6516.89,
      leverage: 20
    },
    {
      symbol: "BTCUSDT", 
      side: "SHORT",
      size: 0.5,
      entryPrice: 98500,
      markPrice: 97200,
      unrealizedPnl: 650,
      unrealizedPnlPercent: 1.32,
      margin: 2450,
      marginRatio: 98.5,
      liquidationPrice: 105000,
      leverage: 20
    }
  ];

  useEffect(() => {
    if (isRunning) {
      setPositions(mockPositions);
      // 启动AI分析定时器
      const interval = setInterval(() => {
        performAIAnalysis();
      }, 30000); // 每30秒分析一次

      return () => clearInterval(interval);
    } else {
      setPositions([]);
    }
  }, [isRunning]);

  const performAIAnalysis = async () => {
    try {
      console.log('执行AI市场分析...');
      setAiAnalysisCount(prev => prev + 1);
      
      // 这里调用超级大脑分析
      const response = await fetch('/api/super-brain-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbols: ['BTCUSDT', 'ETHUSDT', 'ADAUSDT'],
          analysisType: 'full_market_scan',
          confidenceThreshold: config.aiConfidenceThreshold
        })
      });

      if (response.ok) {
        const analysis = await response.json();
        console.log('AI分析结果:', analysis);
        
        // 基于AI分析结果执行交易
        executeTradesBasedOnAI(analysis);
      }
    } catch (error) {
      console.error('AI分析失败:', error);
    }
  };

  const executeTradesBasedOnAI = (analysis: any) => {
    // 基于AI分析结果执行自动交易逻辑
    console.log('基于AI分析执行交易决策');
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
              ${totalBalance.toLocaleString()}
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
              {((calculateTotalPnL() / totalBalance) * 100).toFixed(2)}%
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
              {positions.map((position, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-bold text-white">{position.symbol}</h4>
                      <Badge className={`${position.side === 'LONG' ? 'bg-green-600' : 'bg-red-600'}`}>
                        {position.leverage}x {position.side === 'LONG' ? '多' : '空'}
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
                        {position.unrealizedPnl >= 0 ? '+' : ''}{position.unrealizedPnl.toFixed(2)}
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
                      <div className="text-lg font-bold text-white">{position.size}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-400 mb-1">保证金 (USDT)</div>
                      <div className="text-lg font-bold text-white">{position.margin.toLocaleString()}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-400 mb-1">开仓均价</div>
                      <div className="text-lg font-bold text-white">{position.entryPrice.toFixed(2)}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-400 mb-1">标记价格</div>
                      <div className="text-lg font-bold text-white">{position.markPrice.toFixed(2)}</div>
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
                        {position.liquidationPrice.toFixed(2)}
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
    </div>
  );
};