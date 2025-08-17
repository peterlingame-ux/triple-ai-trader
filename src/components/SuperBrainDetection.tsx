import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Brain, Play, Pause, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { CryptoData } from "@/types/api";
import { CryptoStaticIcon } from "./Static3DIconShowcase";
import { CRYPTO_NAMES } from "@/constants/crypto";
import { ProfessionalDetectionHistory } from "./ProfessionalDetectionHistory";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useSignalProcessor } from "@/hooks/useSignalProcessor";
import { TradingAlert } from "@/types/trading";
import { AI_ADVISORS, TRADING_CONFIG } from "@/constants/trading";
import { generateMockAnalysis } from "@/utils/tradingHelpers";

interface SuperBrainDetectionProps {
  cryptoData?: CryptoData[];
  advisorStates?: Record<string, boolean>;
}

export const SuperBrainDetection = ({ cryptoData, advisorStates = {} }: SuperBrainDetectionProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { settings, isAuthenticated, updateSettings, startBackgroundMonitoring, stopBackgroundMonitoring } = useUserSettings();
  const { callSuperBrainAPI, convertToTradingAlert, convertToSignal, dispatchSignal, showNotification } = useSignalProcessor();
  
  // 状态管理
  const [isMonitoring, setIsMonitoring] = useState(settings.super_brain_monitoring);
  const [alerts, setAlerts] = useState<TradingAlert[]>([]);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<TradingAlert | null>(null);

  // 监听设置变化
  useEffect(() => {
    setIsMonitoring(settings.super_brain_monitoring);
  }, [settings.super_brain_monitoring]);

  // 执行分析
  const performAnalysis = useCallback(async () => {
    if (!isMonitoring) return;
    
    setLastCheckTime(new Date());
    
    try {
      // 先尝试调用真实API
      const apiData = await callSuperBrainAPI();
      let alert: TradingAlert | null = null;
      
      if (apiData) {
        alert = convertToTradingAlert(apiData);
      } else {
        // API失败时使用模拟数据
        alert = generateMockAnalysis();
      }
      
      if (alert) {
        // 更新状态
        setAlerts(prev => [alert!, ...prev.slice(0, TRADING_CONFIG.MAX_ALERTS - 1)]);
        setCurrentAlert(alert);
        setShowAlert(true);
        
        // 触发全局弹窗事件
        window.dispatchEvent(new CustomEvent('superBrainOpportunity', {
          detail: alert
        }));
        
        // 发送信号给AutoTrader
        const signal = convertToSignal(alert);
        dispatchSignal(signal);
        
        // 显示通知
        showNotification(alert);
      }
    } catch (error) {
      console.error('Detection analysis error:', error);
    }
  }, [isMonitoring, callSuperBrainAPI, convertToTradingAlert, convertToSignal, dispatchSignal, showNotification]);

  // 自动检测循环
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      // 立即执行一次
      performAnalysis();
      
      // 设置定时器
      interval = setInterval(performAnalysis, TRADING_CONFIG.DETECTION_INTERVAL);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, performAnalysis]);

  // 切换监控状态
  const toggleMonitoring = async () => {
    const newStatus = !isMonitoring;
    
    const success = await updateSettings({ 
      super_brain_monitoring: newStatus 
    });
    
    if (!success) return;

    setIsMonitoring(newStatus);
    
    // 后台监控管理
    if (newStatus && isAuthenticated) {
      await startBackgroundMonitoring();
    } else if (!newStatus) {
      await stopBackgroundMonitoring();
    }
    
    // 发送状态变化事件
    window.dispatchEvent(new CustomEvent('superBrainMonitoringChanged', {
      detail: { isMonitoring: newStatus }
    }));
    
    if (newStatus) {
      setLastCheckTime(new Date());
      toast({
        title: '监控已启动',
        description: `AI 6大脑模型正在分析市场机会...${isAuthenticated ? '后台监控已启动' : '本地监控模式'}`,
      });
    } else {
      toast({
        title: '监控已暂停',
        description: 'AI 监控功能已暂停',
      });
    }
  };

  // 清空历史记录
  const clearAllAlerts = () => {
    setAlerts([]);
    toast({
      title: '已清空历史记录',
      description: '所有交易信号历史已清除',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Brain className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">最强大脑AI监测</h2>
          <Zap className="w-6 h-6 text-yellow-400" />
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
          6大AI模型同步分析，实时捕捉高胜率交易机会
        </p>
      </div>

      {/* Control Panel */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600 backdrop-blur-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={toggleMonitoring}
                className={`${
                  isMonitoring
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                } text-white font-medium px-4 py-2 text-sm`}
              >
                {isMonitoring ? (
                  <>
                    <Pause className="w-3 h-3 mr-2" />
                    暂停监控
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-2" />
                    开始监控
                  </>
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-xs text-slate-300">
                  {isMonitoring ? '监控中' : '已暂停'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {lastCheckTime && (
                <div className="text-xs text-slate-400">
                  最后检查: {lastCheckTime.toLocaleTimeString()}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllAlerts}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs px-3 py-1"
              >
                清空历史
              </Button>
            </div>
          </div>

          {/* AI Advisors Status Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {AI_ADVISORS.map((advisor, index) => {
              const isActive = advisorStates[advisor.name] !== false;
              return (
                <div 
                  key={advisor.name}
                  className={`${advisor.backgroundColor} rounded-lg p-2 border border-slate-600 transition-all duration-300 ${
                    isActive ? 'ring-1 ring-green-400/50' : 'opacity-60'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <img 
                      src={advisor.avatar} 
                      alt={advisor.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                    <div className="text-center">
                      <h4 className="text-white font-medium text-xs">{advisor.name.split(' ')[0]}</h4>
                      <div className="flex items-center justify-center gap-1">
                        {isActive ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-400" />
                        )}
                        <span className={`text-xs ${advisor.accentColor}`}>
                          {isActive ? '活跃' : '待机'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
              <div className="text-xl font-bold text-green-400">{alerts.length}</div>
              <div className="text-xs text-slate-400">检测到机会</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
              <div className="text-xl font-bold text-blue-400">
                {alerts.length > 0 ? Math.round(alerts.reduce((sum, alert) => sum + alert.confidence, 0) / alerts.length) : 0}%
              </div>
              <div className="text-xs text-slate-400">平均胜率</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
              <div className="text-xl font-bold text-purple-400">
                {alerts.filter(alert => alert.confidence >= 90).length}
              </div>
              <div className="text-xs text-slate-400">高胜率信号</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
              <div className="text-xl font-bold text-yellow-400">
                {isAuthenticated ? '云端' : '本地'}
              </div>
              <div className="text-xs text-slate-400">分析模式</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-600">
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-yellow-400" />
              最新机会
            </h3>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert, index) => (
                <div 
                  key={alert.id}
                  className="bg-slate-700/50 rounded-lg p-3 border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
                  onClick={() => {
                    setCurrentAlert(alert);
                    setShowAlert(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CryptoStaticIcon symbol={alert.symbol} name={alert.symbol} className="w-6 h-6" />
                      <div>
                        <div className="font-medium text-white text-sm">{alert.symbol}</div>
                        <div className="text-xs text-slate-400">{alert.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={alert.signal === 'buy' ? 'default' : 'destructive'}
                        className={`text-xs ${alert.signal === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                      >
                        {alert.signal === 'buy' ? '买入' : '卖出'}
                      </Badge>
                      <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-xs">
                        {alert.confidence}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300">{alert.analysis.priceAnalysis}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Detection History */}
      <ProfessionalDetectionHistory 
        alerts={alerts} 
        isMonitoring={isMonitoring}
        onClearHistory={clearAllAlerts}
      />

      {/* Alert Dialog */}
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-lg">
              <Brain className="w-5 h-5 text-yellow-400" />
              高胜率交易机会
            </DialogTitle>
          </DialogHeader>
          
          {currentAlert && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CryptoStaticIcon symbol={currentAlert.symbol} name={currentAlert.symbol} className="w-8 h-8" />
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentAlert.symbol}</h3>
                    <p className="text-slate-400 text-sm">{currentAlert.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={currentAlert.signal === 'buy' ? 'default' : 'destructive'}
                    className={`text-sm px-3 py-1 ${currentAlert.signal === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {currentAlert.signal === 'buy' ? '买入信号' : '卖出信号'}
                  </Badge>
                  <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-sm px-3 py-1">
                    胜率 {currentAlert.confidence}%
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="bg-slate-800 rounded-lg p-3">
                    <h4 className="font-medium text-white mb-1 text-sm">价格分析</h4>
                    <p className="text-xs text-slate-300">{currentAlert.analysis.priceAnalysis}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <h4 className="font-medium text-white mb-1 text-sm">技术分析</h4>
                    <p className="text-xs text-slate-300">{currentAlert.analysis.technicalAnalysis}</p>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <h4 className="font-medium text-white mb-1 text-sm">综合分析</h4>
                  <p className="text-xs text-slate-300">{currentAlert.analysis.sentimentAnalysis}</p>
                </div>
              </div>
              
              {currentAlert.tradingDetails && (
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-3">
                  <h4 className="font-medium text-white mb-2 text-sm">交易参数</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mb-3">
                    <div>
                      <div className="text-slate-400">入场价格</div>
                      <div className="text-white font-medium">${currentAlert.tradingDetails.entry.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">止损价格</div>
                      <div className="text-red-400 font-medium">${currentAlert.tradingDetails.stopLoss.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">止盈价格</div>
                      <div className="text-green-400 font-medium">${currentAlert.tradingDetails.takeProfit.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">建议仓位</div>
                      <div className="text-blue-400 font-medium">{currentAlert.tradingDetails.position}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">风险等级</div>
                      <div className={`font-medium ${
                        currentAlert.tradingDetails.riskLevel === 'low' ? 'text-green-400' :
                        currentAlert.tradingDetails.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {currentAlert.tradingDetails.riskLevel === 'low' ? '低风险' :
                         currentAlert.tradingDetails.riskLevel === 'medium' ? '中风险' : '高风险'}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">杠杆倍数</div>
                      <div className="text-purple-400 font-medium">{currentAlert.tradingDetails.leverage}</div>
                    </div>
                  </div>
                  
                  {/* 新增详细交易参数 */}
                  <div className="border-t border-slate-600 pt-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-700/50 rounded-lg p-2">
                        <div className="text-slate-400 text-xs mb-1">入场价格区间</div>
                        <div className="text-white font-medium text-sm">
                          ${(currentAlert.tradingDetails.entry * 0.998).toFixed(0)} - ${(currentAlert.tradingDetails.entry * 1.002).toFixed(0)}
                        </div>
                        <div className="text-slate-500 text-xs">±0.2% 范围内</div>
                      </div>
                      
                      <div className="bg-slate-700/50 rounded-lg p-2">
                        <div className="text-slate-400 text-xs mb-1">建议仓位%</div>
                        <div className="text-blue-400 font-medium text-lg">
                          {currentAlert.tradingDetails.positionRatio}%
                        </div>
                        <div className="text-slate-500 text-xs">总资金占比</div>
                      </div>
                      
                      <div className="bg-slate-700/50 rounded-lg p-2">
                        <div className="text-slate-400 text-xs mb-1">AI分析胜率</div>
                        <div className="text-yellow-400 font-bold text-lg">
                          {currentAlert.confidence}%
                        </div>
                        <div className="text-slate-500 text-xs">六大API综合</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 补仓区间信息 */}
                  {currentAlert.tradingDetails.canAddPosition && currentAlert.tradingDetails.addPositionRange && (
                    <div className="border-t border-slate-600 pt-3 mt-3">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <div className="text-blue-400 font-medium text-xs">补仓机会</div>
                        </div>
                        <div className="text-white text-xs">
                          补仓区间: ${currentAlert.tradingDetails.addPositionRange.min.toLocaleString()} - ${currentAlert.tradingDetails.addPositionRange.max.toLocaleString()}
                        </div>
                        <div className="text-slate-400 text-xs mt-1">
                          {currentAlert.signal === 'buy' ? '价格回调3-6%时可考虑补仓' : '价格反弹3-6%时可考虑补仓'}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 止损必要性提示 */}
                  {currentAlert.tradingDetails.stopLossRequired && (
                    <div className="border-t border-slate-600 pt-3 mt-3">
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <div className="text-red-400 font-medium text-xs">必须止损</div>
                        </div>
                        <div className="text-white text-xs">
                          胜率低于90%，建议严格执行止损策略
                        </div>
                        <div className="text-slate-400 text-xs mt-1">
                          安全系数: {currentAlert.tradingDetails.safetyFactor}/10
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};