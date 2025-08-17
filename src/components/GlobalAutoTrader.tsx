import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown, Zap, CheckCircle, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface TradingAlert {
  symbol: string;
  signal: 'buy' | 'sell';
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  position: string;
  reasoning: string;
  timestamp: Date;
  profit?: number;
  leverage?: number;
  contractType?: 'spot' | 'futures' | 'margin';
  direction?: 'long' | 'short';
  hasAddedPosition?: boolean;
  duration?: number; // in minutes
  startDate?: Date;
  endDate?: Date;
  totalCapital?: number;
  positionPercentage?: number;
  usedCapital?: number;
}

export const GlobalAutoTrader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<TradingAlert | null>(null);
  const [tradingHistory, setTradingHistory] = useState<TradingAlert[]>([]);
  const [isAutoTradingEnabled, setIsAutoTradingEnabled] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // 加载自动交易状态
  useEffect(() => {
    const savedStatus = localStorage.getItem('autoTradingEnabled');
    if (savedStatus !== null) {
      setIsAutoTradingEnabled(JSON.parse(savedStatus));
    }
  }, []);

  // 监听AI检测到的交易信号
  useEffect(() => {
    const handleSuperBrainSignal = (event: CustomEvent<any>) => {
      if (!isAutoTradingEnabled) return;
      
      const alertData = event.detail;
      console.log('收到AI交易信号:', alertData);
      
      // 只处理高胜率信号 (>85%)
      if (alertData.confidence >= 85) {
        executeAutoTrade(alertData);
      }
    };

    // 监听SuperBrainDetection组件发出的信号
    window.addEventListener('superBrainTradingSignal', handleSuperBrainSignal as EventListener);
    window.addEventListener('superBrainOpportunity', handleSuperBrainSignal as EventListener);
    
    return () => {
      window.removeEventListener('superBrainTradingSignal', handleSuperBrainSignal as EventListener);
      window.removeEventListener('superBrainOpportunity', handleSuperBrainSignal as EventListener);
    };
  }, [isAutoTradingEnabled]);

  const executeAutoTrade = (signalData: any) => {
    const startDate = new Date();
    const duration = Math.floor(Math.random() * 1440) + 60; // 1-24小时随机持续时间
    const endDate = new Date(startDate.getTime() + duration * 60000);
    
    // 计算仓位详情
    const totalCapital = Math.floor(Math.random() * 50000) + 10000; // 总资金 10k-60k
    const positionPercentage = Math.floor(Math.random() * 25) + 5; // 5%-30%
    const usedCapital = Math.floor(totalCapital * (positionPercentage / 100));
    
    const tradeAlert: TradingAlert = {
      symbol: signalData.symbol,
      signal: signalData.action || signalData.signal,
      confidence: signalData.confidence,
      entry: signalData.entry || signalData.price,
      stopLoss: signalData.stopLoss || signalData.tradingDetails?.stopLoss,
      takeProfit: signalData.takeProfit || signalData.tradingDetails?.takeProfit,
      position: `${positionPercentage}% (${usedCapital.toLocaleString()}美元)`,
      reasoning: signalData.reasoning || signalData.analysis?.priceAnalysis || 'AI综合分析',
      timestamp: new Date(),
      profit: Math.random() > 0.12 ? parseFloat((Math.random() * 500 + 100).toFixed(2)) : -parseFloat((Math.random() * 100 + 20).toFixed(2)),
      leverage: Math.floor(Math.random() * 20) + 1, // 1-20倍杠杆
      contractType: Math.random() > 0.5 ? 'futures' : 'spot',
      direction: signalData.signal === 'buy' ? 'long' : 'short',
      hasAddedPosition: Math.random() > 0.7, // 30%概率有补仓
      duration: duration,
      startDate: startDate,
      endDate: endDate,
      totalCapital: totalCapital,
      positionPercentage: positionPercentage,
      usedCapital: usedCapital
    };

    // 模拟自动执行交易
    console.log('🤖 AI自动执行交易:', tradeAlert);
    
    // 添加到交易历史
    setTradingHistory(prev => [tradeAlert, ...prev.slice(0, 9)]);
    
    // 设置当前提醒并显示弹窗
    setCurrentAlert(tradeAlert);
    setIsOpen(true);
    
    // 显示系统通知
    toast({
      title: "🤖 AI自动交易已执行",
      description: `${tradeAlert.symbol} ${tradeAlert.signal === 'buy' ? '🟢买入' : '🔴卖出'} | 胜率${tradeAlert.confidence}%`,
      duration: 8000,
    });

    // 发送交易完成事件
    const tradeEvent = new CustomEvent('autoTradeExecuted', {
      detail: tradeAlert
    });
    window.dispatchEvent(tradeEvent);
  };

  const toggleAutoTrading = () => {
    const newStatus = !isAutoTradingEnabled;
    setIsAutoTradingEnabled(newStatus);
    localStorage.setItem('autoTradingEnabled', JSON.stringify(newStatus));
    
    toast({
      title: newStatus ? "🤖 AI自动交易已开启" : "⏸️ AI自动交易已暂停",
      description: newStatus ? "AI将自动执行高胜率交易信号" : "AI已停止自动交易",
    });
  };

  const dismissAlert = () => {
    setIsOpen(false);
  };

  if (!currentAlert) return (
    <div className="fixed top-4 right-4 z-50">
      <Button 
        onClick={toggleAutoTrading}
        variant={isAutoTradingEnabled ? "default" : "outline"}
        size="sm"
        className={`${isAutoTradingEnabled 
          ? 'bg-green-600 hover:bg-green-700' 
          : 'bg-slate-600 hover:bg-slate-700'
        } text-white`}
      >
        {isAutoTradingEnabled ? 'AI自动交易中' : 'AI自动交易关闭'}
      </Button>
    </div>
  );

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button 
          onClick={toggleAutoTrading}
          variant={isAutoTradingEnabled ? "default" : "outline"}
          size="sm"
          className={`${isAutoTradingEnabled 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-slate-600 hover:bg-slate-700'
          } text-white`}
        >
          {isAutoTradingEnabled ? 'AI自动交易中' : 'AI自动交易关闭'}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-400/30 text-white shadow-2xl shadow-green-400/20 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-green-400 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 animate-pulse" />
              🤖 AI自动交易已执行
              <Zap className="w-5 h-5 animate-pulse" />
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 p-1">
            {/* 币种和信号 */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full border-2 border-green-400/40">
                <span className="text-lg font-bold text-green-400">{currentAlert.symbol}</span>
              </div>
              
              <div className="space-y-1">
                <Badge 
                  variant="outline" 
                  className={`text-sm px-3 py-1 font-bold ${
                    currentAlert.signal === 'buy' 
                      ? 'text-green-400 border-green-400/40 bg-green-400/10' 
                      : 'text-red-400 border-red-400/40 bg-red-400/10'
                  }`}
                >
                  {currentAlert.signal === 'buy' ? (
                    <>
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      买入执行
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                      卖出执行
                    </>
                  )}
                </Badge>
                
                <div className="text-xl font-black text-green-400 animate-pulse">
                  胜率 {currentAlert.confidence}%
                </div>
              </div>
            </div>

            {/* 交易详情 */}
            <div className="space-y-2">
              {/* 基础交易信息 */}
              <div className="p-2 bg-slate-800/60 rounded-lg border border-green-400/20">
                <h4 className="text-xs font-semibold text-white mb-1">交易信息</h4>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="text-slate-300">
                    货币种类: <span className="text-yellow-400 font-semibold">{currentAlert.symbol}</span>
                  </div>
                  <div className="text-slate-300">
                    交易方向: <span className={`font-semibold ${currentAlert.direction === 'long' ? 'text-green-400' : 'text-red-400'}`}>
                      {currentAlert.direction === 'long' ? '做多' : '做空'}
                    </span>
                  </div>
                  <div className="text-slate-300">
                    合约类型: <span className="text-blue-400">{currentAlert.contractType === 'spot' ? '现货交易' : '永续合约'}</span>
                  </div>
                  <div className="text-slate-300">
                    杠杆倍数: <span className="text-orange-400 font-bold">{currentAlert.leverage}x</span>
                  </div>
                  <div className="text-slate-300">
                    入场价格: <span className="text-green-400 font-mono text-xs">${currentAlert.entry.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">
                    止盈价格: <span className="text-green-400 font-mono text-xs">${currentAlert.takeProfit.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">
                    止损价格: <span className="text-red-400 font-mono text-xs">${currentAlert.stopLoss.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">
                    仓位大小: <span className="text-yellow-400 font-bold">{currentAlert.position}</span>
                  </div>
                  <div className="text-slate-300">
                    总资金: <span className="text-cyan-400 font-mono text-xs">${currentAlert.totalCapital?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 交易执行信息 */}
              <div className="p-2 bg-slate-800/60 rounded-lg border border-blue-400/20">
                <h4 className="text-xs font-semibold text-white mb-1">执行详情</h4>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="text-slate-300">
                    开始时间: <span className="text-cyan-400 font-mono text-xs">{currentAlert.startDate?.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">
                    结束时间: <span className="text-cyan-400 font-mono text-xs">{currentAlert.endDate?.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">
                    持续时长: <span className="text-purple-400">
                      {currentAlert.duration && currentAlert.duration >= 60 ? 
                        `${Math.floor(currentAlert.duration / 60)}小时${currentAlert.duration % 60}分钟` : 
                        `${currentAlert.duration}分钟`}
                    </span>
                  </div>
                  <div className="text-slate-300">
                    补仓情况: <span className={`${currentAlert.hasAddedPosition ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {currentAlert.hasAddedPosition ? '已补仓' : '未补仓'}
                    </span>
                  </div>
                </div>
              </div>

              {currentAlert.profit && (
                <div className={`p-2 rounded-lg border ${
                  currentAlert.profit > 0 
                    ? 'bg-green-400/10 border-green-400/20' 
                    : 'bg-red-400/10 border-red-400/20'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className={`w-4 h-4 ${currentAlert.profit > 0 ? 'text-green-400' : 'text-red-400'}`} />
                    <span className={`font-bold ${currentAlert.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {currentAlert.profit > 0 ? '+' : ''}${currentAlert.profit}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 确认按钮 */}
            <div className="flex justify-center pt-2">
              <Button 
                onClick={dismissAlert}
                size="sm"
                className="bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-slate-300 border"
              >
                知道了
              </Button>
            </div>

            {/* 免责声明 */}
            <div className="text-center text-xs text-slate-400 border-t border-slate-700 pt-2">
              ⚠️ AI自动交易存在风险，请谨慎决策
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};