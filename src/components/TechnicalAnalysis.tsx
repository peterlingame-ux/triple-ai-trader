import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, Target, BarChart3, Zap } from "lucide-react";

interface TechnicalAnalysisProps {
  symbol: string;
  price: number;
  data: {
    rsi: number;
    ma20: number;
    ma50: number;
    support: number;
    resistance: number;
    high24h: number;
    low24h: number;
    ath: number;
    atl: number;
  };
}

export const TechnicalAnalysis = ({ symbol, price, data }: TechnicalAnalysisProps) => {
  const getRSISignal = (rsi: number) => {
    if (rsi > 70) return { signal: "超买", color: "text-red-400", bgColor: "bg-red-500/20" };
    if (rsi < 30) return { signal: "超卖", color: "text-green-400", bgColor: "bg-green-500/20" };
    return { signal: "中性", color: "text-yellow-400", bgColor: "bg-yellow-500/20" };
  };

  const getMASignal = () => {
    if (price > data.ma20 && data.ma20 > data.ma50) return { signal: "强烈看涨", color: "text-green-400", icon: TrendingUp };
    if (price < data.ma20 && data.ma20 < data.ma50) return { signal: "强烈看跌", color: "text-red-400", icon: TrendingDown };
    return { signal: "震荡", color: "text-yellow-400", icon: Activity };
  };

  const rsiSignal = getRSISignal(data.rsi);
  const maSignal = getMASignal();

  const technicalIndicators = [
    { name: "RSI(14)", value: data.rsi.toFixed(2), signal: rsiSignal.signal, color: rsiSignal.color },
    { name: "MA20", value: `$${data.ma20.toLocaleString()}`, signal: "趋势指标", color: "text-blue-400" },
    { name: "MA50", value: `$${data.ma50.toLocaleString()}`, signal: "长期趋势", color: "text-purple-400" },
    { name: "支撑位", value: `$${data.support.toLocaleString()}`, signal: "关键位置", color: "text-green-400" },
    { name: "阻力位", value: `$${data.resistance.toLocaleString()}`, signal: "突破目标", color: "text-red-400" },
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-blue-900/30 border-blue-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            技术分析 - {symbol}
          </CardTitle>
          <Badge className={`${maSignal.color} border-current/30`}>
            <maSignal.icon className="w-3 h-3 mr-1" />
            {maSignal.signal}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="indicators" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="indicators" className="text-xs">技术指标</TabsTrigger>
            <TabsTrigger value="levels" className="text-xs">关键位置</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">AI分析</TabsTrigger>
          </TabsList>
          
          <TabsContent value="indicators" className="space-y-3 mt-4">
            {technicalIndicators.slice(0, 2).map((indicator, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{indicator.name}</p>
                  <p className="text-xs text-muted-foreground">{indicator.signal}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${indicator.color}`}>{indicator.value}</p>
                  {indicator.name === "RSI(14)" && (
                    <Badge className={`${rsiSignal.bgColor} ${rsiSignal.color} border-current/30 text-xs`}>
                      {rsiSignal.signal}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="levels" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <p className="text-sm font-medium text-green-400">支撑位</p>
                </div>
                <p className="text-xl font-bold text-green-400">${data.support.toLocaleString()}</p>
                <p className="text-xs text-green-400/70">当前距离: {((1 - data.support/price) * 100).toFixed(1)}%</p>
              </div>
              
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-red-400" />
                  <p className="text-sm font-medium text-red-400">阻力位</p>
                </div>
                <p className="text-xl font-bold text-red-400">${data.resistance.toLocaleString()}</p>
                <p className="text-xs text-red-400/70">突破空间: {((data.resistance/price - 1) * 100).toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className="text-sm text-muted-foreground">24H最高</p>
                <p className="text-lg font-bold text-foreground">${data.high24h.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <p className="text-sm text-muted-foreground">24H最低</p>
                <p className="text-lg font-bold text-foreground">${data.low24h.toLocaleString()}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-3 mt-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-blue-400">AI技术分析报告</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-foreground">
                  • RSI指标显示{rsiSignal.signal}状态，当前值为{data.rsi.toFixed(1)}
                </p>
                <p className="text-foreground">
                  • 价格{price > data.ma20 ? '高于' : '低于'}MA20均线，{maSignal.signal}趋势
                </p>
                <p className="text-foreground">
                  • 关键支撑位${data.support.toLocaleString()}，阻力位${data.resistance.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-xs mt-3">
                  *以上分析仅供参考，投资有风险，决策需谨慎
                </p>
              </div>
              <Button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                获取详细AI分析报告
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};