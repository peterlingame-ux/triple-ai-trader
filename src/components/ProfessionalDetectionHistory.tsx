import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Brain } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { OpportunityAlert } from "@/types/api";
import { CryptoStaticIcon } from "./Static3DIconShowcase";
import { CRYPTO_NAMES } from "@/constants/crypto";

interface ProfessionalDetectionHistoryProps {
  alerts: OpportunityAlert[];
  isMonitoring: boolean;
  onClearHistory: () => void;
}

export const ProfessionalDetectionHistory = memo<ProfessionalDetectionHistoryProps>(({ 
  alerts, 
  isMonitoring, 
  onClearHistory 
}) => {
  const { t } = useLanguage();

  return (
    <Card className="bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-200 font-mono">检测历史</h3>
            <Badge variant="outline" className="text-slate-400 border-slate-600/50 bg-slate-800/50 font-mono">
              {alerts.length} 条记录
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 font-mono text-xs"
          >
            清除历史
          </Button>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 font-mono text-sm">
              {isMonitoring ? '监控中，暂无信号记录' : '启动监控开始检测'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            {alerts.map((alert, index) => (
              <div key={alert.id} className="bg-slate-800/30 border border-slate-700/30 rounded-sm">
                {/* Alert Header */}
                <div className="p-3 border-b border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 flex items-center justify-center">
                        <CryptoStaticIcon 
                          symbol={alert.symbol} 
                          name={CRYPTO_NAMES[alert.symbol]?.name || alert.symbol}
                          size={28}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-200 font-mono font-medium text-sm">
                            {alert.symbol}
                          </span>
                          <span className="text-slate-500 font-mono text-xs">
                            {CRYPTO_NAMES[alert.symbol]?.name || 'Cryptocurrency'}
                          </span>
                        </div>
                        <div className="text-slate-500 font-mono text-xs">
                          {alert.timestamp.toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit', 
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`font-mono text-xs border-0 ${
                          alert.signal === 'buy' 
                            ? 'text-emerald-400 bg-emerald-400/10' 
                            : 'text-red-400 bg-red-400/10'
                        }`}
                      >
                        {alert.signal === 'buy' ? (
                          <>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            ai.sell_signal
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 mr-1" />
                            ai.sell_signal
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="text-slate-300 border-slate-600/50 bg-slate-700/30 font-mono text-xs">
                        胜率 {alert.confidence}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Trading Summary */}
                <div className="p-3 bg-slate-900/50">
                  <div className="grid grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <div className="text-slate-500 mb-1">价格分析:</div>
                      <div className="text-slate-300">{alert.symbol}: {alert.signal === 'buy' ? '买多' : '买空'}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">ai.technical_indicators:</div>
                      <div className="text-slate-300">
                        入场: ${alert.tradingDetails?.entry?.toLocaleString()} | 止损: ${alert.tradingDetails?.stopLoss?.toLocaleString()} | 止盈: ${alert.tradingDetails?.takeProfit?.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">综合分析:</div>
                      <div className="text-slate-300">仓位: {alert.tradingDetails?.position} | 胜率: {alert.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">补仓区间:</div>
                      <div className="text-blue-400">
                        {!alert.tradingDetails?.stopLossRequired && alert.tradingDetails?.addPositionRange ? 
                          `$${alert.tradingDetails.addPositionRange.min?.toLocaleString()} - $${alert.tradingDetails.addPositionRange.max?.toLocaleString()}` :
                          '必须止损，不建议补仓'
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Trading Information */}
                {alert.tradingDetails && (
                  <div className="p-3 border-t border-slate-700/30">
                    <div className="mb-2">
                      <span className="text-slate-400 font-mono text-xs">📋 交易建议详情</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                      {/* Left Column */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">本次交易类型</span>
                          <span className="text-slate-300">永续合约</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">交易方向</span>
                          <span className={alert.signal === 'buy' ? 'text-emerald-400' : 'text-red-400'}>
                            {alert.signal === 'buy' ? '做多' : '做空'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">建议杠杆倍数</span>
                          <span className="text-blue-400">{alert.tradingDetails.leverage || '10x'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">建议仓位比例</span>
                          <span className="text-blue-400">{alert.tradingDetails.positionRatio || 10}% 总仓位</span>
                        </div>
                      </div>

                      {/* Middle Column */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">入场价格建议区间</span>
                          <span className="text-slate-300">
                            ${(alert.tradingDetails.entry * 0.998).toFixed(0)} - ${(alert.tradingDetails.entry * 1.002).toFixed(0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">止损价位</span>
                          <span className="text-red-400">${alert.tradingDetails.stopLoss?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">第一止盈点</span>
                          <span className="text-emerald-400">
                            ${alert.tradingDetails.firstTakeProfit?.toLocaleString() || alert.tradingDetails.takeProfit?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">第二止盈点</span>
                          <span className="text-emerald-400">
                            ${alert.tradingDetails.secondTakeProfit?.toLocaleString() || (alert.tradingDetails.takeProfit * 1.05).toFixed(0)}
                          </span>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">交易胜率分析</span>
                          <span className="text-emerald-400">{alert.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">是否必须止损</span>
                          <span className={alert.tradingDetails.stopLossRequired ? 'text-red-400' : 'text-emerald-400'}>
                            {alert.tradingDetails.stopLossRequired ? '必须严格止损' : '可灵活处理'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">安全系数等级</span>
                          <span className={
                            (alert.tradingDetails.safetyFactor || 5) >= 8 ? 'text-emerald-400' : 
                            (alert.tradingDetails.safetyFactor || 5) >= 6 ? 'text-slate-400' : 'text-red-400'
                          }>
                            {alert.tradingDetails.safetyFactor || 5}/10 {
                              (alert.tradingDetails.safetyFactor || 5) >= 8 ? '(高安全)' : 
                              (alert.tradingDetails.safetyFactor || 5) >= 6 ? '(中等安全)' : '(注意风险)'
                            }
                          </span>
                        </div>
                      </div>

                      {/* Additional Column - 只有在不必须止损时才显示补仓信息 */}
                      <div className="space-y-2">
                        {!alert.tradingDetails.stopLossRequired && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-500">是否可以补仓</span>
                              <span className="text-emerald-400">可以补仓</span>
                            </div>
                            {alert.tradingDetails.addPositionRange && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">补仓价格区间</span>
                                <span className="text-blue-400">
                                  ${alert.tradingDetails.addPositionRange.min?.toLocaleString()} - ${alert.tradingDetails.addPositionRange.max?.toLocaleString()}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
});

ProfessionalDetectionHistory.displayName = "ProfessionalDetectionHistory";