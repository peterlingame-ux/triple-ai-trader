import React from 'react';
import { Position } from '@/types/trading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Shield, Zap } from 'lucide-react';
import { formatLeverage, formatMarginMode, formatContractType } from '@/utils/tradingCalculations';

interface PositionDetailsCardProps {
  position: Position;
}

export const PositionDetailsCard: React.FC<PositionDetailsCardProps> = ({ position }) => {
  const formatCurrency = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const formatPercent = (value: number, decimals: number = 2) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getPositionIcon = () => {
    return position.type === 'long' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getStrategyIcon = () => {
    return position.strategy === 'conservative' ? <Shield className="h-4 w-4" /> : <Zap className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {getPositionIcon()}
            {position.symbol} {formatContractType(position.contractType)}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={position.type === 'long' ? 'default' : 'destructive'}>
              {position.type === 'long' ? '多' : '空'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getStrategyIcon()}
              {position.strategy === 'conservative' ? '稳健' : '激进'}
            </Badge>
            <Badge variant="secondary">
              {formatLeverage(position.leverage)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 盈亏概览 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">收益额 (USDT)</p>
            <p className={`text-xl font-bold ${getPnlColor(position.pnl)}`}>
              {formatCurrency(position.pnl)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">收益率</p>
            <p className={`text-xl font-bold ${getPnlColor(position.pnlPercent)}`}>
              {formatPercent(position.pnlPercent)}
            </p>
          </div>
        </div>

        <Separator />

        {/* 持仓信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">持仓量 ({position.symbol.replace('USDT', '')})</p>
            <p className="font-semibold">{formatCurrency(position.positionAmount, 4)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">保证金 (USDT)</p>
            <p className="font-semibold">{formatCurrency(position.margin)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">维持保证金率</p>
            <p className="font-semibold">{formatPercent(position.maintenanceMarginRate)}</p>
          </div>
        </div>

        <Separator />

        {/* 价格信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">开仓均价</p>
            <p className="font-semibold">{formatCurrency(position.entryPrice, 2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">标记价格</p>
            <p className="font-semibold">{formatCurrency(position.markPrice, 2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">预估强平价</p>
            <p className="font-semibold text-orange-500">{formatCurrency(position.liquidationPrice, 2)}</p>
          </div>
        </div>

        <Separator />

        {/* 风控信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">止盈价格</p>
            <p className="font-semibold text-green-600">{formatCurrency(position.takeProfit, 2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">止损价格</p>
            <p className="font-semibold text-red-600">{formatCurrency(position.stopLoss, 2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">仓位模式</p>
            <p className="font-semibold">{formatMarginMode(position.marginMode)}</p>
          </div>
        </div>

        <Separator />

        {/* 费用信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">交易手续费</p>
            <p className="font-semibold">{formatCurrency(position.fees)} USDT</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">资金费率</p>
            <p className="font-semibold">{formatCurrency(position.fundingFee)} USDT</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">信号置信度</p>
            <p className="font-semibold">{position.confidence}%</p>
          </div>
        </div>

        {/* 时间信息 */}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          开仓时间: {position.openTime.toLocaleString('zh-CN')}
        </div>
      </CardContent>
    </Card>
  );
};