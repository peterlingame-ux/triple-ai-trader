import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play, Square, TrendingUp, TrendingDown, Activity, BarChart3, Settings, DollarSign, ArrowLeft } from "lucide-react";

interface TradingSignal {
  symbol: string;
  action: 'buy' | 'sell';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  position: string;
  confidence: number;
  reasoning: string;
}

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
  liquidationPrice: number;
  timestamp: number;
}

interface TradingParams {
  initialCapital: number;
  riskPerTrade: number;
  maxPositions: number;
  leverageMultiplier: number;
  minConfidence: number;
  stopLossPercent: number;
  takeProfitPercent: number;
}

interface AITradingExchangeProps {
  onBack?: () => void;
}

export const AITradingExchange = ({ onBack }: AITradingExchangeProps) => {
  const [isTrading, setIsTrading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [tradingHistory, setTradingHistory] = useState<any[]>([]);
  const [currentBalance, setCurrentBalance] = useState(10000);
  const [totalPnL, setTotalPnL] = useState(0);
  const [params, setParams] = useState<TradingParams>({
    initialCapital: 10000,
    riskPerTrade: 2,
    maxPositions: 5,
    leverageMultiplier: 10,
    minConfidence: 85,
    stopLossPercent: 4,
    takeProfitPercent: 8
  });

  const symbols = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT'];

  useEffect(() => {
    let analysisInterval: NodeJS.Timeout;
    
    if (isTrading) {
      analysisInterval = setInterval(async () => {
        await performAIAnalysis();
      }, 30000); // 30 seconds
    }

    return () => {
      if (analysisInterval) clearInterval(analysisInterval);
    };
  }, [isTrading]);

  const performAIAnalysis = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('super-brain-analysis', {
        body: { 
          symbols: symbols,
          analysisTypes: ['technical', 'sentiment', 'volume']
        }
      });

      if (error) throw error;
      
      console.log('AI分析结果:', data);
      
      // 如果信号置信度高且满足条件，自动执行交易
      if (data && data.confidence >= params.minConfidence && positions.length < params.maxPositions) {
        await executeAutoTrade(data);
      }
    } catch (error) {
      console.error('AI分析错误:', error);
    }
  };

  const executeAutoTrade = async (signal: TradingSignal) => {
    const positionSize = (currentBalance * params.riskPerTrade / 100) * params.leverageMultiplier;
    const margin = positionSize / params.leverageMultiplier;
    
    const newPosition: Position = {
      id: Date.now().toString(),
      symbol: signal.symbol,
      type: signal.action === 'buy' ? 'long' : 'short',
      size: positionSize / signal.entry,
      entryPrice: signal.entry,
      currentPrice: signal.entry,
      pnl: 0,
      pnlPercent: 0,
      margin: margin,
      liquidationPrice: signal.action === 'buy' 
        ? signal.entry * (1 - 0.9 / params.leverageMultiplier)
        : signal.entry * (1 + 0.9 / params.leverageMultiplier),
      timestamp: Date.now()
    };

    setPositions(prev => [...prev, newPosition]);
    setCurrentBalance(prev => prev - margin);
    
    const tradeRecord = {
      ...signal,
      positionId: newPosition.id,
      timestamp: Date.now(),
      status: 'opened'
    };
    
    setTradingHistory(prev => [tradeRecord, ...prev]);
    
    toast.success(`自动开仓：${signal.symbol} ${signal.action.toUpperCase()} - 置信度: ${signal.confidence}%`);
  };

  const startTrading = () => {
    setIsTrading(true);
    toast.success("AI自动交易已启动");
  };

  const stopTrading = () => {
    setIsTrading(false);
    toast.info("AI自动交易已停止");
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* 顶部控制面板 */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  返回
                </Button>
              )}
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                AI自动交易系统
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isTrading ? "default" : "secondary"} className="px-3 py-1">
                {isTrading ? "运行中" : "已停止"}
              </Badge>
              {!isTrading ? (
                <Button onClick={startTrading} size="sm" className="gap-2">
                  <Play className="h-4 w-4" />
                  启动交易
                </Button>
              ) : (
                <Button onClick={stopTrading} variant="destructive" size="sm" className="gap-2">
                  <Square className="h-4 w-4" />
                  停止交易
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">账户余额 (USDT)</p>
              <p className="text-2xl font-bold">{formatNumber(currentBalance)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">总盈亏 (USDT)</p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalPnL >= 0 ? '+' : ''}{formatNumber(totalPnL)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">持仓数量</p>
              <p className="text-2xl font-bold">{positions.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">胜率</p>
              <p className="text-2xl font-bold text-primary">
                {tradingHistory.length > 0 ? formatNumber((tradingHistory.filter(t => t.pnl > 0).length / tradingHistory.length) * 100, 1) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* 持仓管理 */}
        <div className="col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                持仓管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>暂无持仓</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div key={position.id} className="border border-border rounded-lg p-4 bg-card/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{position.symbol}USDT 永续</h3>
                          <Badge variant={position.type === 'long' ? 'default' : 'destructive'}>
                            {position.type === 'long' ? '多' : '空'}
                          </Badge>
                          <Badge variant="outline">全仓</Badge>
                          <Badge variant="outline">{params.leverageMultiplier}x</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">平仓</Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">收益额 (USDT)</p>
                          <p className={`font-semibold text-lg ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {position.pnl >= 0 ? '+' : ''}{formatNumber(position.pnl)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">收益率</p>
                          <p className={`font-semibold text-lg ${position.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {position.pnlPercent >= 0 ? '+' : ''}{formatNumber(position.pnlPercent, 2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">持仓量 ({position.symbol})</p>
                          <p className="font-semibold">{formatNumber(position.size, 4)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">保证金 (USDT)</p>
                          <p className="font-semibold">{formatNumber(position.margin)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">维持保证金率</p>
                          <p className="font-semibold">{formatNumber(((position.margin / (position.size * position.currentPrice)) * 100), 2)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">开仓均价</p>
                          <p className="font-semibold">{formatNumber(position.entryPrice)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">标记价格</p>
                          <p className="font-semibold">{formatNumber(position.currentPrice)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">预估强平价</p>
                          <p className="font-semibold text-orange-500">{formatNumber(position.liquidationPrice)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 参数设置 */}
        <div className="col-span-4">
          <Tabs defaultValue="params" className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="params">交易参数</TabsTrigger>
              <TabsTrigger value="history">交易历史</TabsTrigger>
            </TabsList>
            
            <TabsContent value="params" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    参数配置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>初始资金 (USDT)</Label>
                    <Input
                      type="number"
                      value={params.initialCapital}
                      onChange={(e) => setParams(prev => ({...prev, initialCapital: Number(e.target.value)}))}
                    />
                  </div>
                  
                  <div>
                    <Label>单笔风险 (%)</Label>
                    <Input
                      type="number"
                      value={params.riskPerTrade}
                      onChange={(e) => setParams(prev => ({...prev, riskPerTrade: Number(e.target.value)}))}
                    />
                  </div>

                  <div>
                    <Label>最大持仓数</Label>
                    <Input
                      type="number"
                      value={params.maxPositions}
                      onChange={(e) => setParams(prev => ({...prev, maxPositions: Number(e.target.value)}))}
                    />
                  </div>

                  <div>
                    <Label>杠杆倍数</Label>
                    <Input
                      type="number"
                      value={params.leverageMultiplier}
                      onChange={(e) => setParams(prev => ({...prev, leverageMultiplier: Number(e.target.value)}))}
                    />
                  </div>

                  <div>
                    <Label>最小置信度 (%)</Label>
                    <Input
                      type="number"
                      value={params.minConfidence}
                      onChange={(e) => setParams(prev => ({...prev, minConfidence: Number(e.target.value)}))}
                    />
                  </div>

                  <div>
                    <Label>止损比例 (%)</Label>
                    <Input
                      type="number"
                      value={params.stopLossPercent}
                      onChange={(e) => setParams(prev => ({...prev, stopLossPercent: Number(e.target.value)}))}
                    />
                  </div>

                  <div>
                    <Label>止盈比例 (%)</Label>
                    <Input
                      type="number"
                      value={params.takeProfitPercent}
                      onChange={(e) => setParams(prev => ({...prev, takeProfitPercent: Number(e.target.value)}))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">交易记录</CardTitle>
                </CardHeader>
                <CardContent>
                  {tradingHistory.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">暂无交易记录</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {tradingHistory.slice(0, 20).map((trade, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded border border-border/50">
                          <div className="flex items-center gap-2">
                            <Badge variant={trade.action === 'buy' ? 'default' : 'destructive'} className="text-xs">
                              {trade.action.toUpperCase()}
                            </Badge>
                            <span className="text-sm font-medium">{trade.symbol}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatNumber(trade.entry)}</p>
                            <p className="text-xs text-muted-foreground">{trade.confidence}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};