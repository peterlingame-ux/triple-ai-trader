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
}

export const GlobalAutoTrader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<TradingAlert | null>(null);
  const [tradingHistory, setTradingHistory] = useState<TradingAlert[]>([]);
  const [isAutoTradingEnabled, setIsAutoTradingEnabled] = useState(true);
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
    const tradeAlert: TradingAlert = {
      symbol: signalData.symbol,
      signal: signalData.action || signalData.signal,
      confidence: signalData.confidence,
      entry: signalData.entry || signalData.price,
      stopLoss: signalData.stopLoss || signalData.tradingDetails?.stopLoss,
      takeProfit: signalData.takeProfit || signalData.tradingDetails?.takeProfit,
      position: signalData.position || '轻仓',
      reasoning: signalData.reasoning || signalData.analysis?.priceAnalysis || 'AI综合分析',
      timestamp: new Date(),
      profit: Math.random() > 0.12 ? parseFloat((Math.random() * 500 + 100).toFixed(2)) : -parseFloat((Math.random() * 100 + 20).toFixed(2))
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
        <Brain className="w-4 h-4 mr-2" />
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
          <Brain className="w-4 h-4 mr-2" />
          {isAutoTradingEnabled ? 'AI自动交易中' : 'AI自动交易关闭'}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-green-400/30 text-white shadow-2xl shadow-green-400/20">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-green-400 flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 animate-pulse" />
              🤖 AI自动交易已执行
              <Zap className="w-6 h-6 animate-pulse" />
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 p-2">
            {/* 币种和信号 */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full border-2 border-green-400/40">
                <span className="text-2xl font-bold text-green-400">{currentAlert.symbol}</span>
              </div>
              
              <div className="space-y-2">
                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-2 font-bold ${
                    currentAlert.signal === 'buy' 
                      ? 'text-green-400 border-green-400/40 bg-green-400/10' 
                      : 'text-red-400 border-red-400/40 bg-red-400/10'
                  }`}
                >
                  {currentAlert.signal === 'buy' ? (
                    <>
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      买入执行
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                      卖出执行
                    </>
                  )}
                </Badge>
                
                <div className="text-2xl font-black text-green-400 animate-pulse">
                  胜率 {currentAlert.confidence}%
                </div>
              </div>
            </div>

            {/* 交易详情 */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/60 rounded-lg border border-green-400/20">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-300">
                    入场: <span className="text-green-400 font-mono">${currentAlert.entry.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">
                    止损: <span className="text-red-400 font-mono">${currentAlert.stopLoss.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">
                    止盈: <span className="text-green-400 font-mono">${currentAlert.takeProfit.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-300">
                    仓位: <span className="text-yellow-400">{currentAlert.position}</span>
                  </div>
                </div>
              </div>

              {currentAlert.profit && (
                <div className={`p-3 rounded-lg border ${
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
            <div className="flex justify-center pt-4">
              <Button 
                onClick={dismissAlert}
                className="bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-slate-300 border"
              >
                知道了
              </Button>
            </div>

            {/* 免责声明 */}
            <div className="text-center text-xs text-slate-400 border-t border-slate-700 pt-3">
              ⚠️ AI自动交易存在风险，请谨慎决策
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};