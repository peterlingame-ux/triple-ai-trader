import React, { useState } from 'react';
import { SecureAPIConfig } from './SecureAPIConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Newspaper, Brain, Activity, LineChart } from 'lucide-react';

export function AIConfigPanel() {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const cryptoOptions = [
    { value: 'BTC', label: 'Bitcoin', price: '$67,432', change: '+2.45%' },
    { value: 'ETH', label: 'Ethereum', price: '$3,892', change: '+1.87%' },
    { value: 'USDT', label: 'Tether', price: '$1.00', change: '+0.02%' },
    { value: 'BNB', label: 'BNB', price: '$634', change: '+3.21%' },
    { value: 'XRP', label: 'Ripple', price: '$0.87', change: '+4.12%' },
  ];

  const aiAnalysisTypes = [
    {
      id: 'news',
      title: '新闻面分析',
      description: '基于最新市场新闻和公告进行情感分析',
      icon: Newspaper,
      color: 'text-blue-400',
      api: 'OpenAI GPT-4'
    },
    {
      id: 'technical',
      title: '技术面分析', 
      description: '深度技术指标分析和K线形态识别',
      icon: BarChart3,
      color: 'text-green-400',
      api: 'Claude Sonnet'
    },
    {
      id: 'bigdata',
      title: '大数据分析',
      description: '链上数据和交易量分析预测',
      icon: Brain,
      color: 'text-purple-400',
      api: 'Perplexity'
    }
  ];

  const technicalIndicators = [
    { name: 'RSI', value: '68.5', status: 'neutral' },
    { name: 'MACD', value: '+0.045', status: 'bullish' },
    { name: 'MA(20)', value: '$66,890', status: 'bullish' },
    { name: 'Bollinger', value: 'Upper', status: 'neutral' },
    { name: 'Volume', value: '2.8B', status: 'high' },
    { name: 'Fear&Greed', value: '72', status: 'greed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Supreme Brain - 高级交易分析
          </h1>
          <p className="text-lg text-muted-foreground">
            三重 AI 智能分析系统，为您提供最专业的加密货币投资决策
          </p>
        </div>

        {/* AI API Configuration */}
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              AI 接口配置中心
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SecureAPIConfig
                title="OpenAI API"
                description="新闻情感分析专用接口"
                apiKeyLabel="API Key"
                hasSecretKey={false}
              />
              <SecureAPIConfig
                title="Claude API" 
                description="技术分析专用接口"
                apiKeyLabel="API Key"
                hasSecretKey={false}
              />
              <SecureAPIConfig
                title="Perplexity API"
                description="大数据分析专用接口" 
                apiKeyLabel="API Key"
                hasSecretKey={false}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Crypto Selection & Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Crypto Selection */}
            <Card className="border border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  货币选择 & 分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 mb-6">
                  {cryptoOptions.map((crypto) => (
                    <Button
                      key={crypto.value}
                      variant={selectedCrypto === crypto.value ? "default" : "outline"}
                      onClick={() => setSelectedCrypto(crypto.value)}
                      className="flex flex-col items-start p-4 h-auto"
                    >
                      <div className="font-semibold">{crypto.label}</div>
                      <div className="text-sm opacity-80">{crypto.price}</div>
                      <Badge variant={crypto.change.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                        {crypto.change}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* K-Line Chart Placeholder */}
            <Card className="border border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  {selectedCrypto} K线图表
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-primary/5 to-purple/5 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/20">
                  <div className="text-center space-y-2">
                    <LineChart className="h-12 w-12 mx-auto text-primary/40" />
                    <p className="text-muted-foreground">实时K线图表将在此显示</p>
                    <p className="text-sm text-muted-foreground">支持多种时间周期和技术指标</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Indicators */}
            <Card className="border border-primary/20">
              <CardHeader>
                <CardTitle>技术指标概览</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {technicalIndicators.map((indicator) => (
                    <div key={indicator.name} className="text-center p-3 rounded-lg bg-card border">
                      <div className="text-sm text-muted-foreground">{indicator.name}</div>
                      <div className="font-semibold text-lg">{indicator.value}</div>
                      <Badge 
                        variant={indicator.status === 'bullish' ? 'default' : 
                                indicator.status === 'bearish' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {indicator.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - AI Analysis */}
          <div className="space-y-6">
            <Card className="border border-primary/20">
              <CardHeader>
                <CardTitle>三重AI分析系统</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiAnalysisTypes.map((analysis) => {
                  const Icon = analysis.icon;
                  return (
                    <Card 
                      key={analysis.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        activeAnalysis === analysis.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => setActiveAnalysis(analysis.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Icon className={`h-6 w-6 ${analysis.color} mt-1`} />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{analysis.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {analysis.api}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {analysis.description}
                            </p>
                            <Button 
                              size="sm" 
                              variant={activeAnalysis === analysis.id ? "default" : "outline"}
                              className="w-full"
                            >
                              开始分析
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {activeAnalysis && (
              <Card className="border border-primary/20">
                <CardHeader>
                  <CardTitle>分析结果</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-br from-primary/5 to-purple/5 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/20">
                      <p className="text-muted-foreground text-center">
                        AI分析结果将在此显示<br />
                        <span className="text-sm">支持实时更新和历史记录</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        查看详情
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        导出报告
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}