import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfessionalAPIManager } from './ProfessionalAPIManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  TrendingUp, TrendingDown, Target, Shield, Zap, 
  Brain, BarChart3, Globe, Database, LineChart, 
  AlertTriangle, CheckCircle2, XCircle, Clock,
  ArrowUp, ArrowDown, Minus, Settings
} from 'lucide-react';

interface TradingRecommendation {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  entryPriceRange: { min: number; max: number };
  stopLoss: number;
  takeProfit: number;
  leverage: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  winRate: number;
  reasoning: string;
  analysisDetails: {
    binanceAnalysis: string;
    openaiAnalysis: string;
    grokAnalysis: string;
    deepseekAnalysis: string;
    cryptocompareAnalysis: string;
    coinglassAnalysis: string;
    fingptAnalysis: string;
  };
  consensusScore: number;
  marketCondition: string;
}

const POPULAR_SYMBOLS = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'DOGE', 'XRP', 'AVAX', 'DOT', 'LINK'];

const API_INFO = [
  { key: 'binanceAnalysis', name: 'Binance', icon: TrendingUp, color: 'text-yellow-600' },
  { key: 'openaiAnalysis', name: 'OpenAI', icon: Brain, color: 'text-green-600' },
  { key: 'grokAnalysis', name: 'Grok', icon: AlertTriangle, color: 'text-blue-600' },
  { key: 'deepseekAnalysis', name: 'DeepSeek', icon: Database, color: 'text-purple-600' },
  { key: 'cryptocompareAnalysis', name: 'CryptoCompare', icon: BarChart3, color: 'text-orange-600' },
  { key: 'coinglassAnalysis', name: 'CoinGlass', icon: LineChart, color: 'text-red-600' },
  { key: 'fingptAnalysis', name: 'FinGPT', icon: Globe, color: 'text-indigo-600' }
];

const ProfessionalTradingInterface: React.FC = () => {
  const [symbol, setSymbol] = useState('BTC');
  const [targetAmount, setTargetAmount] = useState(10000);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<TradingRecommendation | null>(null);
  const [dailyTarget, setDailyTarget] = useState(400);
  const [currentBalance, setCurrentBalance] = useState(10000);
  const [dailyPnL, setDailyPnL] = useState(0);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setRecommendation(null);

    try {
      const { data, error } = await supabase.functions.invoke('professional-trading-analysis', {
        body: {
          symbol,
          targetAmount,
          riskTolerance
        }
      });

      if (error) throw error;

      if (data.success) {
        setRecommendation(data.recommendation);
        toast.success(`${symbol} 分析完成！`);
      } else {
        toast.error('分析失败，请检查API配置');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy': return <ArrowUp className="w-4 h-4" />;
      case 'sell': return <ArrowDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-green-600 bg-green-50 border-green-200';
      case 'sell': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">当前资金</p>
                <p className="text-2xl font-bold text-primary">¥{currentBalance.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">日收益目标</p>
                <p className="text-2xl font-bold text-green-600">¥{dailyTarget}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日盈亏</p>
                <p className={`text-2xl font-bold ${dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ¥{dailyPnL > 0 ? '+' : ''}{dailyPnL.toLocaleString()}
                </p>
              </div>
              {dailyPnL >= 0 ? 
                <TrendingUp className="w-8 h-8 text-green-600" /> :
                <TrendingDown className="w-8 h-8 text-red-600" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">达成进度</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.max(0, Math.round((dailyPnL / dailyTarget) * 100))}%
                </p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <Progress 
              value={Math.max(0, Math.min(100, (dailyPnL / dailyTarget) * 100))} 
              className="mt-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* 分析参数设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>专业分析参数</span>
          </CardTitle>
          <CardDescription>
            设置交易参数，开始7个API的综合深度分析
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">数字货币</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_SYMBOLS.map((sym) => (
                    <SelectItem key={sym} value={sym}>{sym}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">投资金额 (USDT)</Label>
              <Input
                id="amount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                placeholder="10000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk">风险承受能力</Label>
              <Select value={riskTolerance} onValueChange={(value: 'low' | 'medium' | 'high') => setRiskTolerance(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">保守型</SelectItem>
                  <SelectItem value="medium">均衡型</SelectItem>
                  <SelectItem value="high">激进型</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    开始分析
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 分析结果 */}
      {recommendation && (
        <div className="space-y-6">
          {/* 综合建议 */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>{recommendation.symbol} 交易建议</span>
                </span>
                <Badge className={getActionColor(recommendation.action)}>
                  {getActionIcon(recommendation.action)}
                  <span className="ml-2">
                    {recommendation.action === 'buy' ? '买入' : 
                     recommendation.action === 'sell' ? '卖出' : '观望'}
                  </span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">入场价格区间</Label>
                  <div className="text-lg font-bold text-foreground">
                    ${recommendation.entryPriceRange.min.toFixed(2)} - ${recommendation.entryPriceRange.max.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">止损价位</Label>
                  <div className="text-lg font-bold text-red-600">
                    ${recommendation.stopLoss.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">止盈价位</Label>
                  <div className="text-lg font-bold text-green-600">
                    ${recommendation.takeProfit.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">建议杠杆</Label>
                  <div className="text-lg font-bold text-blue-600">
                    {recommendation.leverage}x
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">置信度</Label>
                  <div className={`text-lg font-bold ${getConfidenceColor(recommendation.confidence)}`}>
                    {recommendation.confidence}%
                  </div>
                  <Progress value={recommendation.confidence} className="h-2" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">胜率预估</Label>
                  <div className="text-lg font-bold text-green-600">
                    {recommendation.winRate}%
                  </div>
                  <Progress value={recommendation.winRate} className="h-2" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">综合分析理由</Label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recommendation.reasoning}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge className={getRiskColor(recommendation.riskLevel)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {recommendation.riskLevel === 'low' ? '低风险' : 
                     recommendation.riskLevel === 'high' ? '高风险' : '中等风险'}
                  </Badge>
                  <Badge variant="outline">
                    {recommendation.marketCondition}
                  </Badge>
                  <Badge variant="outline">
                    共识度 {recommendation.consensusScore.toFixed(1)}%
                  </Badge>
                </div>

                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  执行交易
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 7个API详细分析 */}
          <Card>
            <CardHeader>
              <CardTitle>7个API详细分析报告</CardTitle>
              <CardDescription>各专业平台的独立分析结果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {API_INFO.map((api) => {
                  const IconComponent = api.icon;
                  const analysis = recommendation.analysisDetails[api.key as keyof typeof recommendation.analysisDetails];
                  
                  return (
                    <Card key={api.key} className="border border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <IconComponent className={`w-4 h-4 ${api.color}`} />
                          <span>{api.name}</span>
                          {analysis.includes('未配置') || analysis.includes('失败') ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {analysis}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 使用指南 */}
      {!recommendation && !isAnalyzing && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center space-y-4">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">专业交易分析系统</h3>
              <p className="text-muted-foreground">
                集成7个专业API，提供高胜率的交易建议。宁愿不做单，做单就要赚钱。
              </p>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• 每日目标：{dailyTarget}元 (达成即停)</p>
              <p>• 严格止损，不恋战</p>
              <p>• 综合7个专业数据源分析</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const ProfessionalTradingDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">专业数字货币操盘系统</h1>
          <p className="text-muted-foreground mt-2">
            7个专业API深度分析 • 高胜率短线交易 • 宁愿不做单，做单就要赚钱
          </p>
        </div>

        <Tabs defaultValue="trading" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trading" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>智能分析</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>API配置</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trading">
            <ProfessionalTradingInterface />
          </TabsContent>

          <TabsContent value="config">
            <ProfessionalAPIManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};