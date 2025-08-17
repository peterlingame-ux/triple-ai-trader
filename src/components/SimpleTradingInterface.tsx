import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, BarChart3 } from "lucide-react";

interface TradingSignal {
  symbol: string;
  type: 'buy' | 'sell';
  winRate: number;
  confidence: number;
  price: number;
  stopLoss: number;
  takeProfit: number;
  leverage: number;
  position: string;
  riskLevel: number;
  safetyScore: number;
}

export const SimpleTradingInterface = () => {
  const [currentSignal, setCurrentSignal] = useState<TradingSignal>({
    symbol: 'BTC',
    type: 'sell',
    winRate: 88,
    confidence: 88,
    price: 118264,
    stopLoss: 122994,
    takeProfit: 106438,
    leverage: 10,
    position: '永续合约',
    riskLevel: 5,
    safetyScore: 10
  });

  const [analysisData, setAnalysisData] = useState({
    priceAnalysis: '卖空',
    technicalIndicators: {
      entry: 118264,
      stopLoss: 122994,
      takeProfit: 106438
    },
    aiAnalysis: {
      position: '轻仓',
      winRate: 88
    }
  });

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* 主要交易信号 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">
                {currentSignal.symbol}
              </div>
              <Badge 
                variant="outline" 
                className={`${currentSignal.type === 'sell' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}
              >
                {currentSignal.type === 'sell' ? '卖出信号' : '买入信号'}
              </Badge>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-foreground mb-2">
              胜率 {currentSignal.winRate}%
            </div>
          </div>
        </div>
      </Card>

      {/* 价格分析 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-foreground">价格分析 (6A综合)</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-foreground">{currentSignal.symbol}: {analysisData.priceAnalysis}</span>
          </div>
        </div>
      </Card>

      {/* 技术指标 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-foreground">技术指标 (多维度)</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-muted-foreground mb-1">入场</div>
              <div className="text-sm font-mono text-green-400">
                ${analysisData.technicalIndicators.entry.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">止损</div>
              <div className="text-sm font-mono text-red-400">
                ${analysisData.technicalIndicators.stopLoss.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">止盈</div>
              <div className="text-sm font-mono text-green-400">
                ${analysisData.technicalIndicators.takeProfit.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 综合结论 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-medium text-foreground">综合结论 (AI大脑)</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-foreground">
              仓位: {analysisData.aiAnalysis.position} | 胜率: {analysisData.aiAnalysis.winRate}%
            </span>
          </div>
        </div>
      </Card>

      {/* 交易信息 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-foreground">交易信息</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">货币种类:</div>
              <div className="text-sm text-foreground">{currentSignal.symbol}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">交易方向:</div>
              <div className="text-sm text-red-400">永续合约做空</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">合约类型:</div>
              <div className="text-sm text-foreground">永续合约</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">杠杆倍数:</div>
              <div className="text-sm text-amber-400">{currentSignal.leverage}x</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">爆仓点安全等级:</span>
              <span className="text-xs text-foreground">安全</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < currentSignal.riskLevel ? 'bg-green-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 具体交易建议 */}
      <Card className="bg-slate-900/50 border-slate-700">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-amber-400 rounded-sm"></div>
            <span className="text-sm font-medium text-foreground">具体交易建议</span>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">入场价格</div>
              <div className="text-lg font-mono text-green-400">
                ${currentSignal.price.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-2">第一止盈</div>
              <div className="text-sm text-foreground">$--</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">止损价格</div>
              <div className="text-lg font-mono text-red-400">
                ${currentSignal.stopLoss.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-2">第二止盈</div>
              <div className="text-sm text-foreground">$--</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-xs text-muted-foreground mb-1">建议仓位:</div>
              <div className="text-xl font-bold text-amber-400">10%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">安全系数:</div>
              <div className="flex items-center gap-1">
                <span className="text-foreground">{currentSignal.safetyScore}/10</span>
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full ${
                      i < currentSignal.safetyScore ? 'bg-green-400' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="text-xs text-muted-foreground">必须止损:</div>
            <div className="text-xs text-muted-foreground">风险等级:</div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-slate-800 border-slate-600 text-foreground hover:bg-slate-700">
              知道了
            </Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              立即交易
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};