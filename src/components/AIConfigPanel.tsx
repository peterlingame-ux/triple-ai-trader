import React, { useState } from 'react';
import { SecureAPIConfig } from './SecureAPIConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  BarChart3, 
  Newspaper, 
  Brain, 
  Activity, 
  LineChart,
  Settings,
  Zap,
  Target,
  Database,
  ChevronRight,
  Bot
} from 'lucide-react';

export function AIConfigPanel() {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const cryptoOptions = [
    { value: 'BTC', label: 'Bitcoin', price: '$67,432', change: '+2.45%', volume: '28.5B' },
    { value: 'ETH', label: 'Ethereum', price: '$3,892', change: '+1.87%', volume: '15.2B' },
    { value: 'USDT', label: 'Tether', price: '$1.00', change: '+0.02%', volume: '45.8B' },
    { value: 'BNB', label: 'BNB', price: '$634', change: '+3.21%', volume: '2.1B' },
    { value: 'SOL', label: 'Solana', price: '$198', change: '+5.67%', volume: '3.8B' },
  ];

  const aiModels = [
    {
      id: 'news',
      title: '新闻情感分析',
      subtitle: 'News Sentiment Analysis',
      description: '基于实时新闻和社交媒体情感分析',
      icon: Newspaper,
      gradient: 'from-blue-500 to-cyan-500',
      api: 'OpenAI GPT-4',
      features: ['实时新闻抓取', '情感分析', '影响力评估', '风险预警']
    },
    {
      id: 'technical',
      title: '技术指标分析',
      subtitle: 'Technical Analysis',
      description: '深度技术指标和图表形态识别',
      icon: BarChart3,
      gradient: 'from-green-500 to-emerald-500',
      api: 'Claude Sonnet',
      features: ['K线形态识别', '技术指标计算', '阻力支撑分析', '趋势预测']
    },
    {
      id: 'bigdata',
      title: '链上数据分析',
      subtitle: 'On-Chain Analysis',
      description: '区块链数据和资金流向分析',
      icon: Database,
      gradient: 'from-purple-500 to-violet-500',
      api: 'Perplexity AI',
      features: ['链上资金流', '巨鲸动态', '持仓分布', '网络活跃度']
    }
  ];

  const technicalIndicators = [
    { name: 'RSI(14)', value: '68.5', status: 'neutral', color: 'text-yellow-500' },
    { name: 'MACD', value: '+0.045', status: 'bullish', color: 'text-green-500' },
    { name: 'MA(20)', value: '$66,890', status: 'bullish', color: 'text-green-500' },
    { name: 'Bollinger', value: '上轨', status: 'neutral', color: 'text-yellow-500' },
    { name: 'Volume', value: '2.8B', status: 'high', color: 'text-blue-500' },
    { name: 'Fear&Greed', value: '72', status: 'greed', color: 'text-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white">
              <Bot className="h-8 w-8" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                Supreme Brain
              </h1>
              <p className="text-lg text-muted-foreground">高级AI交易分析系统</p>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            融合三重AI智能分析，为您提供最专业的加密货币投资决策支持
          </p>
        </div>

        {/* API Configuration Section */}
        <Card className="mb-12 border-0 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">AI接口配置中心</CardTitle>
                <p className="text-muted-foreground mt-1">配置您的AI分析接口，开启智能交易之旅</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-semibold text-blue-700 dark:text-blue-400">新闻分析引擎</span>
                </div>
                <SecureAPIConfig
                  title="OpenAI API"
                  description="用于新闻情感分析和市场情绪评估"
                  apiKeyLabel="API Key"
                  hasSecretKey={false}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="font-semibold text-green-700 dark:text-green-400">技术分析引擎</span>
                </div>
                <SecureAPIConfig
                  title="Claude API"
                  description="用于技术指标分析和图表形态识别"
                  apiKeyLabel="API Key"
                  hasSecretKey={false}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="font-semibold text-purple-700 dark:text-purple-400">数据分析引擎</span>
                </div>
                <SecureAPIConfig
                  title="Perplexity API"
                  description="用于链上数据分析和资金流向追踪"
                  apiKeyLabel="API Key"
                  hasSecretKey={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Panel - Market & Chart */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Crypto Selection */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>市场概览</CardTitle>
                      <p className="text-sm text-muted-foreground">选择要分析的数字货币</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="px-4 py-2">
                    实时数据
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {cryptoOptions.map((crypto) => (
                    <Card
                      key={crypto.value}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedCrypto === crypto.value 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:shadow-md bg-white dark:bg-slate-800'
                      }`}
                      onClick={() => setSelectedCrypto(crypto.value)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="font-bold text-lg">{crypto.value}</div>
                          <div className="text-sm text-muted-foreground">{crypto.label}</div>
                          <div className="font-semibold">{crypto.price}</div>
                          <Badge 
                            variant={crypto.change.startsWith('+') ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {crypto.change}
                          </Badge>
                          <div className="text-xs text-muted-foreground">Vol: {crypto.volume}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chart Section */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LineChart className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>{selectedCrypto} 实时图表</CardTitle>
                      <p className="text-sm text-muted-foreground">专业K线图表与技术指标</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">1H</Button>
                    <Button variant="outline" size="sm">4H</Button>
                    <Button variant="default" size="sm">1D</Button>
                    <Button variant="outline" size="sm">1W</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <div className="text-center space-y-4">
                    <LineChart className="h-16 w-16 mx-auto text-slate-400" />
                    <div>
                      <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">
                        TradingView 专业图表
                      </p>
                      <p className="text-sm text-muted-foreground">
                        支持多种时间周期、技术指标和绘图工具
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Indicators */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>技术指标总览</CardTitle>
                    <p className="text-sm text-muted-foreground">实时计算的关键技术指标</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {technicalIndicators.map((indicator) => (
                    <div 
                      key={indicator.name} 
                      className="text-center p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                    >
                      <div className="text-xs text-muted-foreground font-medium mb-1">
                        {indicator.name}
                      </div>
                      <div className={`font-bold text-lg ${indicator.color}`}>
                        {indicator.value}
                      </div>
                      <Badge 
                        variant="outline"
                        className={`text-xs mt-2 ${
                          indicator.status === 'bullish' ? 'border-green-500 text-green-600' :
                          indicator.status === 'bearish' ? 'border-red-500 text-red-600' :
                          'border-yellow-500 text-yellow-600'
                        }`}
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
          <div className="xl:col-span-4 space-y-6">
            
            {/* AI Analysis Models */}
            {aiModels.map((model) => {
              const Icon = model.icon;
              const isActive = activeAnalysis === model.id;
              
              return (
                <Card 
                  key={model.id}
                  className={`border-0 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                    isActive 
                      ? 'ring-2 ring-primary bg-white dark:bg-slate-900' 
                      : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900'
                  }`}
                  onClick={() => setActiveAnalysis(isActive ? null : model.id)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${model.gradient} text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{model.title}</h3>
                            <p className="text-sm text-muted-foreground">{model.subtitle}</p>
                          </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${isActive ? 'rotate-90' : ''}`} />
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {model.description}
                      </p>

                      {/* API Badge */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          {model.api}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant={isActive ? "default" : "outline"}
                          className="px-6"
                        >
                          {isActive ? '分析中...' : '开始分析'}
                        </Button>
                      </div>

                      {/* Expanded Features */}
                      {isActive && (
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              核心功能
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {model.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                  {feature}
                                </div>
                              ))}
                            </div>
                            
                            {/* Analysis Result Placeholder */}
                            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div className="text-center text-sm text-muted-foreground">
                                <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                                AI分析结果将在此显示
                                <div className="mt-2 text-xs">
                                  包含详细分析报告和建议
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  市场扫描
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  风险评估
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  导出报告
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}