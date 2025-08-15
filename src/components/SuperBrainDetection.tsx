import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Brain, TrendingUp, TrendingDown, AlertTriangle, Play, Pause, Settings, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { CryptoData, OpportunityAlert } from "@/types/api";

// AI advisors data
const aiAdvisors = [
  {
    name: "Elon Musk",
    avatar: "/lovable-uploads/7d9761f6-da66-4be0-b4f6-482682564e52.png",
    backgroundColor: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800",
    accentColor: "text-blue-300",
  },
  {
    name: "Warren Buffett", 
    avatar: "/lovable-uploads/4d4ba882-5d48-4828-b81b-a2b60ad7c68b.png",
    backgroundColor: "bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-800",
    accentColor: "text-amber-300",
  },
  {
    name: "Bill Gates",
    avatar: "/lovable-uploads/a11e3b1a-1c1c-403b-910c-bd42820384c4.png", 
    backgroundColor: "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800",
    accentColor: "text-emerald-300",
  },
  {
    name: "Vitalik Buterin",
    avatar: "/lovable-uploads/5616db28-ef44-4766-b461-7f9a97023859.png",
    backgroundColor: "bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-800", 
    accentColor: "text-violet-300",
  },
  {
    name: "Justin Sun",
    avatar: "/lovable-uploads/95952d3d-a183-488d-9fc8-4b12a9e06365.png",
    backgroundColor: "bg-gradient-to-br from-rose-900 via-pink-900 to-red-800",
    accentColor: "text-rose-300", 
  },
  {
    name: "Donald Trump",
    avatar: "/lovable-uploads/7d4748c1-c1ec-4468-891e-445541a5a42c.png",
    backgroundColor: "bg-gradient-to-br from-yellow-900 via-orange-900 to-amber-800",
    accentColor: "text-yellow-300",
  }
];

interface SuperBrainDetectionProps {
  cryptoData?: CryptoData[];
  advisorStates?: Record<string, boolean>;
}

export const SuperBrainDetection = ({ cryptoData, advisorStates = {} }: SuperBrainDetectionProps) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<OpportunityAlert[]>([]);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<OpportunityAlert | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Mock API call - 预留接口
  const performSuperBrainAnalysis = async () => {
    try {
      // TODO: 这里预留真实的API调用接口
      // const response = await fetch('/functions/v1/super-brain-analysis', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     symbols: ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL'],
      //     analysisTypes: ['price', 'technical', 'news']
      //   })
      // });
      
      // 模拟API响应
      const mockAnalysis = await simulateAIAnalysis();
      return mockAnalysis;
    } catch (error) {
      console.error('Super Brain Analysis Error:', error);
      return null;
    }
  };

  // 模拟AI分析 - 实际实现时替换为真实API调用
  const simulateAIAnalysis = async (): Promise<OpportunityAlert | null> => {
    // 模拟随机生成高胜率机会
    const symbols = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const confidence = Math.random() * 100;
    
    // 只有当胜率超过90%时才返回机会
    if (confidence >= 90) {
      return {
        id: Date.now().toString(),
        symbol: randomSymbol,
        type: 'price_chart',
        confidence: Math.round(confidence),
        signal: Math.random() > 0.5 ? 'buy' : 'sell',
        price: Math.random() * 50000 + 10000,
        analysis: {
          priceAnalysis: `基于GPT-4分析，${randomSymbol}价格图表显示强劲的${Math.random() > 0.5 ? '上升' : '下降'}趋势信号。`,
          technicalAnalysis: `Claude AI技术指标分析显示RSI、MACD等多个指标同时发出${Math.random() > 0.5 ? '买入' : '卖出'}信号。`,
          sentimentAnalysis: `Perplexity实时新闻分析显示市场情绪${Math.random() > 0.5 ? '积极' : '消极'}，有利于当前交易决策。`
        },
        alerts: [],
        timestamp: new Date()
      };
    }
    
    return null;
  };

  // 自动检测循环
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(async () => {
        setLastCheckTime(new Date());
        const alert = await performSuperBrainAnalysis();
        
        if (alert) {
          setAlerts(prev => [alert, ...prev.slice(0, 9)]); // 保持最多10条记录
          setCurrentAlert(alert);
          setShowAlert(true);
          
          // 显示系统通知
          toast({
            title: `🧠 最强大脑检测到高胜率机会！`,
            description: `${alert.symbol} ${alert.signal === 'buy' ? '买入' : '卖出'}信号，胜率${alert.confidence}%`,
            duration: 15000, // 15秒提醒
          });
        }
      }, 30000); // 每30秒检测一次
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, toast]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      setLastCheckTime(new Date());
      toast({
        title: "最强大脑检测已启动",
        description: "系统将每30秒自动分析市场机会",
      });
    } else {
      toast({
        title: "最强大脑检测已暂停",
        description: "停止自动分析",
      });
    }
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    toast({
      title: "已清除所有提醒",
      description: "历史提醒记录已清空",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">{t('ai.supreme_brain_detection')}</h2>
          <Zap className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {t('ai.six_models_analysis')}
        </p>
      </div>

      {/* Control Panel */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleMonitoring}
                className={`${
                  isMonitoring
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                } text-white font-medium px-6 py-2`}
              >
                {isMonitoring ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    暂停监控
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    开始监控
                  </>
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-slate-300">
                  {isMonitoring ? '监控中...' : '已暂停'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {lastCheckTime && (
                <div className="text-sm text-slate-400">
                  最后检测: {lastCheckTime.toLocaleTimeString()}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllAlerts}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                清除历史
              </Button>
            </div>
          </div>

          {/* AI Advisors Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {aiAdvisors.map((advisor, index) => {
              const isActive = advisorStates[advisor.name] !== false; // 默认为激活状态
              return (
                <div 
                  key={advisor.name} 
                  className={`text-center p-4 rounded-lg border transition-all duration-300 ${
                    isActive 
                      ? advisor.backgroundColor + ' border-white/20' 
                      : 'bg-gray-600/30 border-gray-600/30 grayscale'
                  }`}
                >
                  <div className="relative mb-3">
                    <div className={`w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden ${
                      isActive ? '' : 'opacity-50'
                    }`}>
                      <img 
                        src={advisor.avatar} 
                        alt={advisor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                      isActive ? 'bg-green-400' : 'bg-gray-500'
                    } border-2 border-white shadow-lg`}>
                      {isActive ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <XCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className={`text-sm font-medium mb-1 ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}>
                    {advisor.name}
                  </div>
                  <Badge variant="outline" className={`text-xs ${
                    isActive 
                      ? advisor.accentColor + ' border-current/20' 
                      : 'text-gray-500 border-gray-500/20'
                  }`}>
                    {isActive ? t('activation.activated') : t('activation.deactivated')}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Alerts History */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">检测历史</h3>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/20">
              {alerts.length} 条记录
            </Badge>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">
                {isMonitoring ? '正在监控中，等待高胜率机会...' : '尚无检测记录，请启动监控'}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <Card key={alert.id} className="bg-slate-700/30 border-slate-600/30">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-white bg-slate-600/50">
                          {alert.symbol}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`${
                            alert.signal === 'buy' 
                              ? 'text-green-400 border-green-400/20' 
                              : 'text-red-400 border-red-400/20'
                          }`}
                        >
                          {alert.signal === 'buy' ? (
                            <>
                              <TrendingUp className="w-3 h-3 mr-1" />
                              买入信号
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3 h-3 mr-1" />
                              卖出信号
                            </>
                          )}
                        </Badge>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400/20">
                          胜率 {alert.confidence}%
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">
                        {alert.timestamp.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-sm text-slate-300 space-y-1">
                      <div><span className="text-blue-400">价格分析:</span> {alert.analysis.priceAnalysis}</div>
                      <div><span className="text-purple-400">技术分析:</span> {alert.analysis.technicalAnalysis}</div>
                      <div><span className="text-green-400">新闻分析:</span> {alert.analysis.sentimentAnalysis}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Alert Dialog */}
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-400">
              <Brain className="w-6 h-6" />
              🧠 最强大脑检测提醒
            </DialogTitle>
          </DialogHeader>
          
          {currentAlert && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {currentAlert.symbol}
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-lg px-4 py-2 ${
                    currentAlert.signal === 'buy' 
                      ? 'text-green-400 border-green-400/20' 
                      : 'text-red-400 border-red-400/20'
                  }`}
                >
                  {currentAlert.signal === 'buy' ? '买入信号' : '卖出信号'}
                </Badge>
                <div className="text-3xl font-bold text-yellow-400 mt-2">
                  胜率 {currentAlert.confidence}%
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-slate-700/50 rounded">
                  <div className="text-blue-400 font-medium mb-1">价格分析 (GPT-4)</div>
                  <div className="text-slate-300">{currentAlert.analysis.priceAnalysis}</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded">
                  <div className="text-purple-400 font-medium mb-1">技术分析 (Claude)</div>
                  <div className="text-slate-300">{currentAlert.analysis.technicalAnalysis}</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded">
                  <div className="text-green-400 font-medium mb-1">新闻分析 (Perplexity)</div>
                  <div className="text-slate-300">{currentAlert.analysis.sentimentAnalysis}</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowAlert(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-500"
                >
                  知道了
                </Button>
                <Button 
                  onClick={() => {
                    setShowAlert(false);
                    toast({
                      title: "API接口已预留",
                      description: "请在后台配置真实的交易API",
                    });
                  }}
                  className={`flex-1 ${
                    currentAlert.signal === 'buy'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  立即交易
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};