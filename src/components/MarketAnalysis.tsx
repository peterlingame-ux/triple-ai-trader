import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Activity, Brain, Zap, Target } from "lucide-react";

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  dominance: number;
}

interface MarketAnalysisProps {
  cryptoData: CryptoData[];
}

export const MarketAnalysis = ({ cryptoData }: MarketAnalysisProps) => {
  // 计算市场统计数据
  const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0);
  const averageChange = cryptoData.reduce((sum, crypto) => sum + crypto.changePercent24h, 0) / cryptoData.length;
  const totalVolume = cryptoData.reduce((sum, crypto) => sum + crypto.volume24h, 0);
  
  const gainers = cryptoData.filter(crypto => crypto.changePercent24h > 0).length;
  const losers = cryptoData.filter(crypto => crypto.changePercent24h < 0).length;
  
  const topGainers = cryptoData
    .filter(crypto => crypto.changePercent24h > 0)
    .sort((a, b) => b.changePercent24h - a.changePercent24h)
    .slice(0, 5);
    
  const topLosers = cryptoData
    .filter(crypto => crypto.changePercent24h < 0)
    .sort((a, b) => a.changePercent24h - b.changePercent24h)
    .slice(0, 5);

  const marketSentiment = () => {
    if (averageChange > 2) return { mood: '极度贪婪', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: TrendingUp };
    if (averageChange > 0) return { mood: '贪婪', color: 'text-green-400', bgColor: 'bg-green-500/10', icon: TrendingUp };
    if (averageChange > -2) return { mood: '中性', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: Activity };
    if (averageChange > -5) return { mood: '恐惧', color: 'text-red-400', bgColor: 'bg-red-500/10', icon: TrendingDown };
    return { mood: '极度恐惧', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: TrendingDown };
  };

  const sentiment = marketSentiment();
  const SentimentIcon = sentiment.icon;

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-emerald-900/30 border-emerald-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            市场行情分析
          </CardTitle>
          <Badge className={`${sentiment.color} ${sentiment.bgColor} border-current/30`}>
            <SentimentIcon className="w-3 h-3 mr-1" />
            {sentiment.mood}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview" className="text-xs">市场概览</TabsTrigger>
            <TabsTrigger value="gainers" className="text-xs">涨幅榜</TabsTrigger>
            <TabsTrigger value="losers" className="text-xs">跌幅榜</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">AI预测</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <p className="text-sm font-medium text-emerald-400">总市值</p>
                </div>
                <p className="text-xl font-bold text-foreground">
                  ${(totalMarketCap / 1e9).toFixed(2)}B
                </p>
                <p className="text-xs text-muted-foreground">
                  24H变化: {averageChange >= 0 ? '+' : ''}{averageChange.toFixed(2)}%
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <p className="text-sm font-medium text-blue-400">24H交易量</p>
                </div>
                <p className="text-xl font-bold text-foreground">
                  ${(totalVolume / 1e9).toFixed(2)}B
                </p>
                <p className="text-xs text-muted-foreground">
                  活跃度: {totalVolume > 50e9 ? '高' : totalVolume > 20e9 ? '中' : '低'}
                </p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold text-emerald-400">市场参与度</h3>
                </div>
                <span className="text-sm text-muted-foreground">{gainers + losers} 币种活跃</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-400">上涨 ({gainers})</span>
                    <span className="text-green-400">{Math.round((gainers / (gainers + losers)) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(gainers / (gainers + losers)) * 100} 
                    className="h-2 bg-slate-700"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400">下跌 ({losers})</span>
                    <span className="text-red-400">{Math.round((losers / (gainers + losers)) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(losers / (gainers + losers)) * 100} 
                    className="h-2 bg-slate-700"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gainers" className="space-y-3 mt-4">
            <div className="space-y-2">
              {topGainers.map((crypto, index) => (
                <div key={crypto.symbol} className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-400">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{crypto.symbol}</p>
                      <p className="text-xs text-muted-foreground">{crypto.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">${crypto.price.toLocaleString()}</p>
                    <p className="text-sm font-bold text-green-400">+{crypto.changePercent24h.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
            {topGainers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无上涨币种</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="losers" className="space-y-3 mt-4">
            <div className="space-y-2">
              {topLosers.map((crypto, index) => (
                <div key={crypto.symbol} className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-red-400">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{crypto.symbol}</p>
                      <p className="text-xs text-muted-foreground">{crypto.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">${crypto.price.toLocaleString()}</p>
                    <p className="text-sm font-bold text-red-400">{crypto.changePercent24h.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>
            {topLosers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingDown className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无下跌币种</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4 mt-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-purple-400">AI市场预测</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">短期趋势 (24H)</p>
                    <Badge className={`${sentiment.color} ${sentiment.bgColor}`}>
                      {averageChange >= 0 ? '看涨' : '看跌'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    基于当前市场数据分析，预计短期内市场将保持{sentiment.mood}情绪，
                    建议关注主流币种的技术突破点位。
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-orange-400" />
                    <p className="text-sm font-medium text-foreground">关键监控点位</p>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• BTC: 支撑 $40,000 | 阻力 $45,000</p>
                    <p>• ETH: 支撑 $2,200 | 阻力 $2,800</p>
                    <p>• 市场情绪指数: {Math.abs(averageChange * 10).toFixed(0)}/100</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-sm font-medium text-foreground mb-2">🎯 AI交易信号</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">信号强度</span>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.abs(averageChange * 10)} className="w-20 h-2" />
                      <span className="text-xs font-bold text-foreground">
                        {Math.abs(averageChange * 10).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Zap className="w-4 h-4 mr-2" />
                获取AI深度市场分析
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};