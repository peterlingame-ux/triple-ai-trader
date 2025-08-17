import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, TrendingDown, Settings } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface Position {
  id: string;
  symbol: string;
  type: "多" | "空";
  leverage: string;
  marginType: "全仓" | "逐仓";
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
  maintainMarginRate: number;
  liquidationPrice: number;
  asset: string;
}

export const ProfessionalPositionManager = () => {
  const { t } = useLanguage();
  const [positions, setPositions] = useState<Position[]>([]);
  const [totalValue] = useState(100000.00);
  const [dailyPnl] = useState(0.00);
  const [dailyPnlPercent] = useState(0.00);
  const [activeTrades] = useState(0);

  // Mock position data - 模拟持仓数据
  useEffect(() => {
    const mockPositions: Position[] = [
      {
        id: "1",
        symbol: "ETHUSDT",
        type: "多",
        leverage: "20x",
        marginType: "全仓",
        size: 23,
        entryPrice: 4675.36,
        markPrice: 4550.44,
        pnl: -2873.16,
        pnlPercent: -53.43,
        margin: 5233,
        maintainMarginRate: 1432.6,
        liquidationPrice: 6516.89,
        asset: "ETH"
      }
    ];
    // setPositions(mockPositions); // 暂时注释掉，显示空持仓状态
  }, []);

  return (
    <div className="space-y-6">
      {/* 交易动态 - Trading Dynamics */}
      <Card className="bg-slate-900/90 border-slate-700/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h2 className="text-xl font-bold text-white">交易动态</h2>
          </div>
          
          {/* 等待交易信号状态 */}
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-16 w-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">等待交易信号...</p>
            <div className="mt-4 text-sm text-slate-500">
              使用模拟数据 (API接口预留中)
            </div>
          </div>
        </div>
      </Card>

      {/* 资产概览 - Asset Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI虚拟投资组合 */}
        <Card className="bg-slate-800/90 border-slate-700/50 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-sm text-slate-400 mb-2">AI虚拟投资组合</h3>
            <div className="text-3xl font-bold text-white mb-1">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-slate-400">总价值</div>
          </div>
        </Card>

        {/* 日盈亏 */}
        <Card className="bg-slate-800/90 border-slate-700/50 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-sm text-slate-400 mb-2">日盈亏</h3>
            <div className={`text-3xl font-bold mb-1 ${dailyPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {dailyPnl >= 0 ? '+' : ''}${dailyPnl.toFixed(2)}
            </div>
            <div className={`text-sm ${dailyPnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {dailyPnlPercent >= 0 ? '+' : ''}{dailyPnlPercent.toFixed(2)}%
            </div>
          </div>
        </Card>

        {/* 活跃交易 */}
        <Card className="bg-slate-800/90 border-slate-700/50 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-sm text-slate-400 mb-2">活跃交易</h3>
            <div className="text-3xl font-bold text-white mb-1">{activeTrades}</div>
            <div className="text-sm text-slate-400">当前持仓</div>
          </div>
        </Card>
      </div>

      {/* 持仓管理 - Position Management */}
      <Card className="bg-slate-900/90 border-slate-700/50 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">持仓管理</h2>
            </div>
            <div className="text-sm text-slate-400">
              {positions.length} 持仓
            </div>
          </div>

          {positions.length === 0 ? (
            /* 空持仓状态 */
            <div className="text-center py-12">
              <div className="text-slate-500 mb-2">暂无持仓</div>
              <div className="text-sm text-slate-600">数据更新</div>
              <div className="text-sm text-slate-600">使用模拟数据 (API接口预留中)</div>
            </div>
          ) : (
            /* 持仓列表 */
            <div className="space-y-4">
              {positions.map((position) => (
                <Card key={position.id} className="bg-slate-800/50 border-slate-700/30">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{position.symbol} 永续</h3>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={position.type === "多" ? "default" : "destructive"}
                            className={position.type === "多" ? "bg-green-600/20 text-green-400 border-green-600/30" : "bg-red-600/20 text-red-400 border-red-600/30"}
                          >
                            {position.type}
                          </Badge>
                          <Badge variant="outline" className="text-slate-300 border-slate-600">
                            {position.marginType}
                          </Badge>
                          <Badge variant="outline" className="text-slate-300 border-slate-600">
                            {position.leverage}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-400">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400 mb-1">收益额 (USDT)</div>
                        <div className={`font-bold text-lg ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-slate-400 mb-1">收益率</div>
                        <div className={`font-bold text-lg ${position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                        </div>
                      </div>

                      <div>
                        <div className="text-slate-400 mb-1">持仓量 ({position.asset})</div>
                        <div className="text-white font-bold">{position.size}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 mb-1">保证金 (USDT)</div>
                        <div className="text-white font-bold">{position.margin.toLocaleString()}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 mb-1">维持保证金率</div>
                        <div className="text-white font-bold">{position.maintainMarginRate.toFixed(1)}%</div>
                      </div>

                      <div className="md:col-span-1">
                        <div className="text-slate-400 mb-1">开仓均价</div>
                        <div className="text-white font-bold">{position.entryPrice.toFixed(2)}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 mb-1">标记价格</div>
                        <div className="text-white font-bold">{position.markPrice.toFixed(2)}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 mb-1">预估强平价</div>
                        <div className="text-white font-bold">{position.liquidationPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};