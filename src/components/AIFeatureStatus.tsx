import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, CheckCircle, Clock, TrendingUp, Settings } from "lucide-react";

interface AIFeatureStatusProps {
  className?: string;
}

export const AIFeatureStatus = ({ className = "" }: AIFeatureStatusProps) => {
  const [isAutoTradingEnabled, setIsAutoTradingEnabled] = useState(false);
  const [isSuperBrainEnabled, setIsSuperBrainEnabled] = useState(false);
  const [lastSignalTime, setLastSignalTime] = useState<Date | null>(null);
  const [lastTradeTime, setLastTradeTime] = useState<Date | null>(null);

  useEffect(() => {
    // 读取初始状态
    const autoTradingStatus = localStorage.getItem('autoTradingEnabled');
    const superBrainStatus = localStorage.getItem('superBrainMonitoring');
    
    if (autoTradingStatus) {
      setIsAutoTradingEnabled(JSON.parse(autoTradingStatus));
    }
    if (superBrainStatus) {
      setIsSuperBrainEnabled(JSON.parse(superBrainStatus));
    }

    // 监听AI自动交易状态变化
    const handleAutoTradingChange = () => {
      const status = localStorage.getItem('autoTradingEnabled');
      if (status) {
        setIsAutoTradingEnabled(JSON.parse(status));
      }
    };

    // 监听超级大脑状态变化
    const handleSuperBrainChange = (event: CustomEvent) => {
      setIsSuperBrainEnabled(event.detail.isMonitoring);
    };

    // 监听交易信号
    const handleTradingSignal = () => {
      setLastSignalTime(new Date());
    };

    // 监听交易执行
    const handleTradeExecuted = () => {
      setLastTradeTime(new Date());
    };

    // 监听localStorage变化
    window.addEventListener('storage', handleAutoTradingChange);
    
    // 监听自定义事件
    window.addEventListener('superBrainMonitoringChanged', handleSuperBrainChange as EventListener);
    window.addEventListener('superBrainTradingSignal', handleTradingSignal as EventListener);
    window.addEventListener('autoTradeExecuted', handleTradeExecuted as EventListener);

    return () => {
      window.removeEventListener('storage', handleAutoTradingChange);
      window.removeEventListener('superBrainMonitoringChanged', handleSuperBrainChange as EventListener);
      window.removeEventListener('superBrainTradingSignal', handleTradingSignal as EventListener);
      window.removeEventListener('autoTradeExecuted', handleTradeExecuted as EventListener);
    };
  }, []);

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "暂无记录";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* AI控制中心状态 */}
      <Card className="bg-gradient-to-br from-amber-900/20 via-yellow-900/20 to-orange-800/20 border-amber-500/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                <Brain className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI控制中心</h3>
                <p className="text-sm text-amber-200/70">配置和管理您的AI交易助手</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
              <Settings className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          {isSuperBrainEnabled && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">最强大脑检测功能已开启</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-amber-200/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>最近信号: {formatTimeAgo(lastSignalTime)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-amber-500/10 rounded p-2 border border-amber-500/20">
                  <div className="text-xs text-amber-200/60">AI模型</div>
                  <div className="text-sm font-bold text-amber-400">6个</div>
                </div>
                <div className="bg-amber-500/10 rounded p-2 border border-amber-500/20">
                  <div className="text-xs text-amber-200/60">检测频率</div>
                  <div className="text-sm font-bold text-amber-400">60秒</div>
                </div>
                <div className="bg-amber-500/10 rounded p-2 border border-amber-500/20">
                  <div className="text-xs text-amber-200/60">准确率</div>
                  <div className="text-sm font-bold text-amber-400">92%+</div>
                </div>
              </div>
            </div>
          )}

          {!isSuperBrainEnabled && (
            <div className="text-center py-4">
              <div className="text-amber-200/50 text-sm mb-2">AI控制中心未激活</div>
              <Badge variant="outline" className="text-amber-400/60 border-amber-400/20">
                等待启动
              </Badge>
            </div>
          )}
        </div>
      </Card>

      {/* AI自动赚钱状态 */}
      <Card className="bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-800/20 border-emerald-500/30 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI自动赚钱</h3>
                <p className="text-sm text-emerald-200/70">智能自动交易系统</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {isAutoTradingEnabled && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">AI自动交易功能已开启</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-emerald-200/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>最近交易: {formatTimeAgo(lastTradeTime)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-500/10 rounded p-2 border border-emerald-500/20">
                  <div className="text-xs text-emerald-200/60">触发条件</div>
                  <div className="text-sm font-bold text-emerald-400">85%+</div>
                </div>
                <div className="bg-emerald-500/10 rounded p-2 border border-emerald-500/20">
                  <div className="text-xs text-emerald-200/60">执行模式</div>
                  <div className="text-sm font-bold text-emerald-400">自动</div>
                </div>
                <div className="bg-emerald-500/10 rounded p-2 border border-emerald-500/20">
                  <div className="text-xs text-emerald-200/60">风控等级</div>
                  <div className="text-sm font-bold text-emerald-400">智能</div>
                </div>
              </div>
            </div>
          )}

          {!isAutoTradingEnabled && (
            <div className="text-center py-4">
              <div className="text-emerald-200/50 text-sm mb-2">AI自动交易功能未开启</div>
              <Badge variant="outline" className="text-emerald-400/60 border-emerald-400/20">
                等待激活
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};