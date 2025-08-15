import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Brain, TrendingUp, TrendingDown, AlertTriangle, Play, Pause, Settings, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CryptoData, OpportunityAlert } from "@/types/api";

interface SuperBrainDetectionProps {
  cryptoData?: CryptoData[];
  activatedAdvisors?: string[];
}

export const SuperBrainDetection = ({ cryptoData, activatedAdvisors = [] }: SuperBrainDetectionProps) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<OpportunityAlert[]>([]);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<OpportunityAlert | null>(null);
  const { toast } = useToast();
  
  // AI advisors data
  const aiAdvisorsData = [
    {
      name: "Elon Musk",
      specialty: "远见科技与市场颠覆",
      avatar: "/lovable-uploads/7d9761f6-da66-4be0-b4f6-482682564e52.png",
      backgroundColor: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800",
      borderColor: "border-blue-500/30",
      accentColor: "text-blue-300",
      investmentStyle: "颠覆性创新",
      historicalReturn: "+340%",
      netWorth: "$219.2 Billion"
    },
    {
      name: "Warren Buffett",
      specialty: "价值投资与长期财富建设",
      avatar: "/lovable-uploads/4d4ba882-5d48-4828-b81b-a2b60ad7c68b.png",
      backgroundColor: "bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-800",
      borderColor: "border-amber-500/30",
      accentColor: "text-amber-300",
      investmentStyle: "价值投资",
      historicalReturn: "+20.1%",
      netWorth: "$118.3 Billion"
    },
    {
      name: "Bill Gates",
      specialty: "科技创新与慈善投资",
      avatar: "/lovable-uploads/a11e3b1a-1c1c-403b-910c-bd42820384c4.png",
      backgroundColor: "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800",
      borderColor: "border-emerald-500/30",
      accentColor: "text-emerald-300",
      investmentStyle: "科技创新",
      historicalReturn: "+28.5%",
      netWorth: "$128.6 Billion"
    },
    {
      name: "Vitalik Buterin",
      specialty: "区块链与去中心化",
      avatar: "/lovable-uploads/5616db28-ef44-4766-b461-7f9a97023859.png",
      backgroundColor: "bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-800",
      borderColor: "border-violet-500/30",
      accentColor: "text-violet-300",
      investmentStyle: "去中心化未来",
      historicalReturn: "+1,200%",
      netWorth: "$400 Million"
    },
    {
      name: "Justin Sun",
      specialty: "TRON生态与营销",
      avatar: "/lovable-uploads/95952d3d-a183-488d-9fc8-4b12a9e06365.png",
      backgroundColor: "bg-gradient-to-br from-rose-900 via-pink-900 to-red-800",
      borderColor: "border-rose-500/30",
      accentColor: "text-rose-300",
      investmentStyle: "营销驱动增长",
      historicalReturn: "+890%",
      netWorth: "$1.1 Billion"
    },
    {
      name: "Donald Trump",
      specialty: "房地产与品牌投资",
      avatar: "/lovable-uploads/7d4748c1-c1ec-4468-891e-445541a5a42c.png",
      backgroundColor: "bg-gradient-to-br from-yellow-900 via-orange-900 to-amber-800",
      borderColor: "border-yellow-500/30",
      accentColor: "text-yellow-300",
      investmentStyle: "品牌价值驱动",
      historicalReturn: "+156%",
      netWorth: "$2.6 Billion"
    }
  ];

  const getActivatedAdvisorCards = () => {
    return aiAdvisorsData.filter(advisor => activatedAdvisors.includes(advisor.name));
  };

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
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10" />
            SUPREME BRAIN
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            六个顶级AI模型协同分析，只在胜率达到90%以上时提醒您最佳交易时机
          </p>
        </div>

        {/* Activated Advisors Display */}
        {activatedAdvisors.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">已激活的AI顾问</h2>
              <Badge variant="outline" className="text-green-400 border-green-400/20">
                {activatedAdvisors.length} 位激活中
              </Badge>
            </div>
            
            {/* Activated Advisors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {getActivatedAdvisorCards().map((advisor, index) => (
                <Card key={index} className={`${advisor.backgroundColor} ${advisor.borderColor} border relative overflow-hidden`}>
                  {/* Activation Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50 px-2 py-1 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      激活中
                    </Badge>
                  </div>

                  <div className="p-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 mx-auto mb-3">
                      <img 
                        src={advisor.avatar} 
                        alt={advisor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name and Specialty */}
                    <div className="text-center mb-3">
                      <h3 className="text-white font-bold text-sm mb-1">{advisor.name}</h3>
                      <p className={`text-xs ${advisor.accentColor}`}>{advisor.specialty}</p>
                    </div>

                    {/* Investment Info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">投资风格</span>
                        <span className="text-white">{advisor.investmentStyle}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">历史回报</span>
                        <span className={`font-medium ${advisor.historicalReturn.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {advisor.historicalReturn}
                        </span>
                      </div>
                    </div>

                    {/* Net Worth */}
                    <div className="mt-3 p-2 bg-white/5 rounded border border-white/10">
                      <div className="text-center">
                        <div className="text-xs text-slate-400">个人净资产</div>
                        <div className={`text-sm font-bold ${advisor.accentColor}`}>
                          {advisor.netWorth}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

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

          {/* AI Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <CheckCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-sm text-white font-medium">价格图表分析</div>
              <div className="text-xs text-blue-400">GPT-4o分析价格趋势</div>
              <Badge variant="outline" className="mt-2 text-blue-400 border-blue-400/20">API已预留</Badge>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <CheckCircle className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-sm text-white font-medium">技术指标分析</div>
              <div className="text-xs text-purple-400">Claude-3.5分析技术指标</div>
              <Badge variant="outline" className="mt-2 text-purple-400 border-purple-400/20">API已预留</Badge>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-sm text-white font-medium">市场情绪分析</div>
              <div className="text-xs text-green-400">Perplexity分析新闻情绪</div>
              <Badge variant="outline" className="mt-2 text-green-400 border-green-400/20">API已预留</Badge>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <CheckCircle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-sm text-white font-medium">区块链分析</div>
              <div className="text-xs text-amber-400">Vitalik分析区块链数据</div>
              <Badge variant="outline" className="mt-2 text-amber-400 border-amber-400/20">API已预留</Badge>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <CheckCircle className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-sm text-white font-medium">DeFi分析</div>
              <div className="text-xs text-cyan-400">Justin分析DeFi协议</div>
              <Badge variant="outline" className="mt-2 text-cyan-400 border-cyan-400/20">API已预留</Badge>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <CheckCircle className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-sm text-white font-medium">政策分析</div>
              <div className="text-xs text-orange-400">Trump分析政策影响</div>
              <Badge variant="outline" className="mt-2 text-orange-400 border-orange-400/20">API已预留</Badge>
            </div>
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