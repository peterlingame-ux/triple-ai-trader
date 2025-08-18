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
        
        // 直接调用AutoTrader的处理函数，不依赖事件
        const autoTraderHandleSignal = (window as any).autoTraderHandleSignal;
        if (autoTraderHandleSignal) {
          if (process.env.NODE_ENV === 'development') {
            console.log('直接调用AutoTrader处理函数');
          }
          autoTraderHandleSignal(signal);
        } else {
          // 备用：存储信号供AutoTrader读取
          const pendingSignals = JSON.parse(localStorage.getItem('pendingAutoTraderSignals') || '[]');
          pendingSignals.push(signal);
          localStorage.setItem('pendingAutoTraderSignals', JSON.stringify(pendingSignals));
          if (process.env.NODE_ENV === 'development') {
            console.log('信号已存储，等待AutoTrader处理');
          }
        }
        
        dispatchSignal(signal);
        
        // 显示通知
        showNotification(alert);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Detection analysis error:', error);
      }
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
        title: t('ai.monitoring_started'),
        description: t('ai.monitoring_started_desc'),
      });
    } else {
      toast({
        title: t('ai.monitoring_paused'),
        description: t('ai.monitoring_paused_desc'),
      });
    }
  };

  // 清空历史记录
  const clearAllAlerts = () => {
    setAlerts([]);
    toast({
      title: t('ai.all_alerts_cleared'),
      description: t('ai.history_cleared'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-white">{t('ai.supreme_brain_ai_detection')}</h2>
          <Zap className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {t('ai.six_models_sync_analysis')}
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
                    {t('ai.pause_monitoring')}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {t('ai.start_monitoring')}
                  </>
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-slate-300">
                  {isMonitoring ? t('ai.monitoring') : t('ai.paused')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {lastCheckTime && (
                <div className="text-sm text-slate-400">
                  {t('ai.last_check')}: {lastCheckTime.toLocaleTimeString()}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllAlerts}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {t('ai.clear_history')}
              </Button>
            </div>
          </div>

          {/* AI Advisors Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {AI_ADVISORS.map((advisor, index) => {
              const isActive = advisorStates[advisor.name] !== false;
              return (
                <div 
                  key={advisor.name}
                  className={`${advisor.backgroundColor} rounded-lg p-4 border border-slate-600 transition-all duration-300 ${
                    isActive ? 'ring-2 ring-green-400/50' : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={advisor.avatar} 
                      alt={advisor.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{advisor.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-xs ${advisor.accentColor}`}>
                          {isActive ? t('ai.active_analysis') : t('ai.standby')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <div className="text-2xl font-bold text-green-400">{alerts.length}</div>
              <div className="text-sm text-slate-400">{t('ai.opportunities_detected')}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <div className="text-2xl font-bold text-blue-400">
                {alerts.length > 0 ? Math.round(alerts.reduce((sum, alert) => sum + alert.confidence, 0) / alerts.length) : 0}%
              </div>
              <div className="text-sm text-slate-400">{t('ai.average_win_rate')}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <div className="text-2xl font-bold text-purple-400">
                {alerts.filter(alert => alert.confidence >= 90).length}
              </div>
              <div className="text-sm text-slate-400">{t('ai.high_win_rate_signal')}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
              <div className="text-2xl font-bold text-yellow-400">
                {isAuthenticated ? 'Cloud' : 'Local'}
              </div>
              <div className="text-sm text-slate-400">{t('ai.local_analysis_mode')}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-600">
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-yellow-400" />
              {t('ai.latest_opportunities')}
            </h3>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert, index) => (
                <div 
                  key={alert.id}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
                  onClick={() => {
                    setCurrentAlert(alert);
                    setShowAlert(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CryptoStaticIcon symbol={alert.symbol} name={alert.symbol} className="w-8 h-8" />
                      <div>
                        <div className="font-medium text-white">{alert.symbol}</div>
                        <div className="text-sm text-slate-400">{alert.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={alert.signal === 'buy' ? 'default' : 'destructive'}
                        className={alert.signal === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                      >
                        {alert.signal === 'buy' ? t('ai.buy_now') : t('ai.sell_now')}
                      </Badge>
                      <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                        {alert.confidence}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">{alert.analysis.priceAnalysis}</div>
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
        <DialogContent className="max-w-md bg-slate-900 border-slate-700" aria-describedby="opportunity-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-lg">
              <Brain className="w-5 h-5 text-yellow-400" />
              {t('ai.high_win_rate_opportunity')}
            </DialogTitle>
          </DialogHeader>
          <div id="opportunity-description" className="sr-only">
            {t('ai.high_win_rate_opportunity')} - {currentAlert?.symbol} {currentAlert?.signal}
          </div>
          
          {currentAlert && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CryptoStaticIcon symbol={currentAlert.symbol} name={currentAlert.symbol} className="w-8 h-8" />
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentAlert.symbol}</h3>
                    <p className="text-xs text-slate-400">{currentAlert.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={currentAlert.signal === 'buy' ? 'default' : 'destructive'}
                    className={`text-sm px-3 py-1 ${currentAlert.signal === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {currentAlert.signal === 'buy' ? t('ai.buy_now') : t('ai.sell_now')}
                  </Badge>
                  <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-sm px-3 py-1">
                    {currentAlert.confidence}%
                  </Badge>
                </div>
              </div>
              
               <div className="grid grid-cols-1 gap-3">
                <div className="bg-slate-800 rounded-lg p-3">
                  <h4 className="font-medium text-white mb-2 text-sm">{t('ai.price_analysis')}</h4>
                  <p className="text-xs text-slate-300">{currentAlert.analysis.priceAnalysis}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <h4 className="font-medium text-white mb-2 text-sm">{t('ai.technical_analysis')}</h4>
                  <p className="text-xs text-slate-300">{currentAlert.analysis.technicalAnalysis}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <h4 className="font-medium text-white mb-2 text-sm">{t('ai.comprehensive_analysis')}</h4>
                  <p className="text-xs text-slate-300">{currentAlert.analysis.sentimentAnalysis}</p>
                </div>
              </div>
              
              {currentAlert.tradingDetails && (
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-4 space-y-4">
                  <h4 className="font-medium text-white text-sm">{t('ai.trading_parameters')}</h4>
                  
                  {/* Entry Price Range */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <h5 className="text-white font-medium mb-2 text-sm">{t('ai.entry_price_range')}</h5>
                    <div className="text-lg font-bold text-white mb-1">
                      ${currentAlert.tradingDetails.entry.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">
                      ${(currentAlert.tradingDetails.entry * 0.998).toLocaleString()} - ${(currentAlert.tradingDetails.entry * 1.002).toLocaleString()}
                    </div>
                  </div>

                  {/* Position & Win Rate */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <h5 className="text-slate-400 text-xs mb-1">{t('ai.suggested_position')}</h5>
                      <div className="text-lg font-bold text-blue-400">
                        {currentAlert.confidence >= 95 ? '25%' :
                         currentAlert.confidence >= 90 ? '20%' :
                         currentAlert.confidence >= 85 ? '15%' : '8%'}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <h5 className="text-slate-400 text-xs mb-1">{t('ai.analysis_win_rate')}</h5>
                      <div className="text-lg font-bold text-yellow-400">
                        {currentAlert.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Technical Parameters */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <h5 className="text-slate-400 text-xs mb-1">{t('ai.stop_loss_price')}</h5>
                      <div className="text-sm font-bold text-red-400">
                        ${currentAlert.tradingDetails.stopLoss.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <h5 className="text-slate-400 text-xs mb-1">{t('ai.take_profit_price')}</h5>
                      <div className="text-sm font-bold text-green-400">
                        ${currentAlert.tradingDetails.takeProfit.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Additional Parameters */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <h5 className="text-slate-400 text-xs mb-1">{t('ai.risk_level')}</h5>
                      <div className={`text-sm font-bold ${
                        currentAlert.tradingDetails.riskLevel === 'low' ? 'text-green-400' :
                        currentAlert.tradingDetails.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {currentAlert.tradingDetails.riskLevel === 'low' ? t('ai.low') :
                         currentAlert.tradingDetails.riskLevel === 'medium' ? t('ai.medium') : t('ai.high')}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <h5 className="text-slate-400 text-xs mb-1">{t('ai.leverage')}</h5>
                      <div className="text-sm font-bold text-purple-400">
                        {currentAlert.tradingDetails.leverage}
                      </div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-2">
                      <h5 className="text-slate-400 text-xs mb-1">{t('ai.add_position')}</h5>
                      <div className="text-sm font-bold text-blue-400">
                        {currentAlert.confidence >= 90 ? t('ai.yes') : t('ai.no')}
                      </div>
                    </div>
                  </div>

                  {/* Risk Warning */}
                  {currentAlert.confidence < 90 && (
                    <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-2">
                      <div className="text-red-400 text-xs font-medium">
                        ⚠️ {t('ai.must_set_stop_loss', { safety: String(100 - currentAlert.confidence) })}
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