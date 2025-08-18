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
            <h3 className="text-lg font-medium text-slate-200 font-mono">{t('ai.detection_history')}</h3>
            <Badge variant="outline" className="text-slate-400 border-slate-600/50 bg-slate-800/50 font-mono">
              {alerts.length} {t('ai.records')}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 font-mono text-xs"
          >
            {t('ai.clear_history')}
          </Button>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 font-mono text-sm">
              {isMonitoring ? t('ai.no_records_monitoring') : t('ai.no_records_start')}
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
                            {t('ai.buy_signal')}
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 mr-1" />
                            {t('ai.sell_signal')}
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="text-slate-300 border-slate-600/50 bg-slate-700/30 font-mono text-xs">
                        {t('ai.win_rate')} {alert.confidence}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Trading Summary */}
                <div className="p-3 bg-slate-900/50">
                  <div className="grid grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <div className="text-slate-500 mb-1">{t('ai.price_analysis')}:</div>
                      <div className="text-slate-300">{alert.symbol}: {alert.signal === 'buy' ? t('ai.long_position') : t('ai.short_position')}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">{t('ai.technical_indicators')}:</div>
                      <div className="text-slate-300">
                        {t('ai.entry')}: ${alert.tradingDetails?.entry?.toLocaleString()} | {t('ai.stop_loss')}: ${alert.tradingDetails?.stopLoss?.toLocaleString()} | {t('ai.take_profit')}: ${alert.tradingDetails?.takeProfit?.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">{t('ai.comprehensive_analysis')}:</div>
                      <div className="text-slate-300">{t('ai.position')}: {alert.tradingDetails?.position} | {t('ai.win_rate')}: {alert.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">{t('ai.add_position_range')}:</div>
                      <div className="text-blue-400">
                        {!alert.tradingDetails?.stopLossRequired && alert.tradingDetails?.addPositionRange ? 
                          `$${alert.tradingDetails.addPositionRange.min?.toLocaleString()} - $${alert.tradingDetails.addPositionRange.max?.toLocaleString()}` :
                          t('ai.must_stop_loss_no_add')
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Trading Information */}
                {alert.tradingDetails && (
                  <div className="p-3 border-t border-slate-700/30">
                    <div className="mb-2">
                      <span className="text-slate-400 font-mono text-xs">📋 {t('ai.trading_recommendation_details')}</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                      {/* Left Column */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.trade_type')}</span>
                          <span className="text-slate-300">{t('ai.perpetual_contract')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.trade_direction')}</span>
                          <span className={alert.signal === 'buy' ? 'text-emerald-400' : 'text-red-400'}>
                            {alert.signal === 'buy' ? t('ai.long') : t('ai.short')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.suggested_leverage_multiple')}</span>
                          <span className="text-blue-400">{alert.tradingDetails.leverage || '10x'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.suggested_position_ratio')}</span>
                          <span className="text-blue-400">{alert.tradingDetails.positionRatio || 10}% {t('ai.total_position')}</span>
                        </div>
                      </div>

                      {/* Middle Column */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.entry_price_suggested_range')}</span>
                          <span className="text-slate-300">
                            ${(alert.tradingDetails.entry * 0.998).toFixed(0)} - ${(alert.tradingDetails.entry * 1.002).toFixed(0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.stop_loss_level')}</span>
                          <span className="text-red-400">${alert.tradingDetails.stopLoss?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.first_take_profit_point')}</span>
                          <span className="text-emerald-400">
                            ${alert.tradingDetails.firstTakeProfit?.toLocaleString() || alert.tradingDetails.takeProfit?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.second_take_profit_point')}</span>
                          <span className="text-emerald-400">
                            ${alert.tradingDetails.secondTakeProfit?.toLocaleString() || (alert.tradingDetails.takeProfit * 1.05).toFixed(0)}
                          </span>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.trading_win_rate_analysis')}</span>
                          <span className="text-emerald-400">{alert.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.must_set_stop_loss_question')}</span>
                          <span className={alert.tradingDetails.stopLossRequired ? 'text-red-400' : 'text-emerald-400'}>
                            {alert.tradingDetails.stopLossRequired ? t('ai.must_strict_stop_loss') : t('ai.flexible_handling')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('ai.safety_factor_level')}</span>
                          <span className={
                            (alert.tradingDetails.safetyFactor || 5) >= 8 ? 'text-emerald-400' : 
                            (alert.tradingDetails.safetyFactor || 5) >= 6 ? 'text-slate-400' : 'text-red-400'
                          }>
                            {alert.tradingDetails.safetyFactor || 5}/10 {
                              (alert.tradingDetails.safetyFactor || 5) >= 8 ? `(${t('ai.high_safety')})` : 
                              (alert.tradingDetails.safetyFactor || 5) >= 6 ? `(${t('ai.medium_safety')})` : `(${t('ai.risk_warning')})`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Additional Column - 只有在不必须止损时才显示补仓信息 */}
                      <div className="space-y-2">
                        {!alert.tradingDetails.stopLossRequired && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-500">{t('ai.can_add_position_question')}</span>
                              <span className="text-emerald-400">{t('ai.can_add_position_yes')}</span>
                            </div>
                            {alert.tradingDetails.addPositionRange && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">{t('ai.add_position_price_range')}</span>
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