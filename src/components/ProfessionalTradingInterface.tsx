import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  BarChart3, 
  Newspaper, 
  Activity,
  Eye,
  Send,
  Zap,
  Target,
  Shield,
  Lightbulb
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData } from "@/hooks/useCryptoData";

export const ProfessionalTradingInterface = () => {
  const { t } = useLanguage();
  const { cryptoData, newsData } = useCryptoData();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [activeTimeframe, setActiveTimeframe] = useState('1D');

  const selectedCryptoData = cryptoData.find(crypto => crypto.symbol === selectedCrypto);

  const timeframes = ['1H', '1D', '1W', '1M', '3M', '1Y'];

  const technicalIndicators = [
    { name: 'RSI(14)', value: '65.42', color: 'text-orange-400', trend: 'overbought' },
    { name: 'MA20', value: `$${selectedCryptoData?.ma20.toFixed(2) || '42,856.79'}`, color: 'text-blue-400' },
    { name: 'MA50', value: `$${selectedCryptoData?.ma50.toFixed(2) || '39,724.15'}`, color: 'text-purple-400' },
    { name: 'Support', value: `$${selectedCryptoData?.support.toFixed(2) || '41,200.00'}`, color: 'text-green-400' },
    { name: '阻力位', value: `$${selectedCryptoData?.resistance.toFixed(2) || '45,800.00'}`, color: 'text-red-400' },
    { name: '24小时最高', value: `$${selectedCryptoData?.high24h.toFixed(2) || '43,927.85'}`, color: 'text-green-300' },
    { name: '24小时最低', value: `$${selectedCryptoData?.low24h.toFixed(2) || '41,156.23'}`, color: 'text-red-300' },
    { name: '历史最高', value: `$${selectedCryptoData?.ath.toFixed(2) || '69,000.00'}`, color: 'text-yellow-400' }
  ];

  const marketMetrics = [
    { 
      name: '市值', 
      value: `$${selectedCryptoData?.marketCap ? (selectedCryptoData.marketCap / 1e9).toFixed(1) + 'B' : '832.4B'}`,
      change: '+2.34%'
    },
    { 
      name: '24小时交易量', 
      value: `$${selectedCryptoData?.volume24h ? (selectedCryptoData.volume24h / 1e9).toFixed(1) + 'B' : '18.7B'}`,
      change: '+15.67%'
    },
    { 
      name: '市场占有率', 
      value: `${selectedCryptoData?.dominance?.toFixed(2) || '48.12'}%`,
      change: '-0.45%'
    },
    { 
      name: '流通供应量', 
      value: selectedCrypto === 'BTC' ? '19.7M BTC' : selectedCrypto === 'ETH' ? '120.4M ETH' : '21M',
      change: '固定'
    }
  ];

  const topCryptos = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'AVAX'];

  const handleAnalysisSubmit = () => {
    if (analysisQuery.trim()) {
      // Here we would integrate with AI analysis
      if (process.env.NODE_ENV === 'development') {
        console.log('Analyzing:', analysisQuery);
      }
      setAnalysisQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-foreground">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-blue-900/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-accent" />
                <h1 className="text-2xl font-orbitron font-bold text-accent">
                  SUPREME BRAIN
                </h1>
              </div>
              <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50">
                Advanced Trading Analytics
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                <Activity className="w-3 h-3 mr-1" />
                Live Market
              </Badge>
              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Crypto Selection & AI Assistant */}
          <div className="col-span-3 space-y-6">
            {/* Crypto Selection */}
            <Card className="p-4 bg-gradient-crypto border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Asset Selection
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {topCryptos.map((crypto) => (
                  <Button
                    key={crypto}
                    variant={selectedCrypto === crypto ? "default" : "outline"}
                    className={`${
                      selectedCrypto === crypto 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-muted/20 border-border hover:bg-accent/20'
                    }`}
                    onClick={() => setSelectedCrypto(crypto)}
                  >
                    {crypto}
                  </Button>
                ))}
              </div>
            </Card>

            {/* AI Analysis Input */}
            <Card className="p-4 bg-gradient-crypto border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Analysis
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {t('ai.ask_analysis')}
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder={t('ai.ask_placeholder')}
                  value={analysisQuery}
                  onChange={(e) => setAnalysisQuery(e.target.value)}
                  className="bg-input border-border"
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalysisSubmit()}
                />
                <Button 
                  size="sm" 
                  onClick={handleAnalysisSubmit}
                  className="bg-accent hover:bg-accent/80"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Quick Insights */}
            <Card className="p-4 bg-gradient-crypto border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Quick Insights
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Strong Support at ${selectedCryptoData?.support.toFixed(0) || '41,200'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Bullish MA Crossover Signal</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-orange-400" />
                  <span>High Volume Activity</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            {/* Price Header */}
            <Card className="p-6 mb-6 bg-gradient-crypto border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-foreground">
                        {selectedCrypto}
                      </h2>
                      <span className="text-xl text-muted-foreground">
                        {selectedCryptoData?.name || 'Bitcoin'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-mono font-bold text-foreground">
                        ${selectedCryptoData?.price.toLocaleString() || '43,127'}
                      </span>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                        (selectedCryptoData?.changePercent24h || -4.77) >= 0 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {(selectedCryptoData?.changePercent24h || -4.77) >= 0 ? 
                          <TrendingUp className="w-4 h-4" /> : 
                          <TrendingDown className="w-4 h-4" />
                        }
                        <span className="font-medium">
                          {(selectedCryptoData?.changePercent24h || -4.77).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="chart" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-muted/20">
                <TabsTrigger value="chart" className="data-[state=active]:bg-accent">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Price Chart
                </TabsTrigger>
                <TabsTrigger value="technical" className="data-[state=active]:bg-accent">
                  <Activity className="w-4 h-4 mr-2" />
                  Technical Indicators
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-accent">
                  <Newspaper className="w-4 h-4 mr-2" />
                  News Analysis
                </TabsTrigger>
              </TabsList>

              {/* Chart Tab */}
              <TabsContent value="chart" className="space-y-6">
                <Card className="p-6 bg-gradient-crypto border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Price Chart</h3>
                    <div className="flex gap-2">
                      {timeframes.map((tf) => (
                        <Button
                          key={tf}
                          variant={activeTimeframe === tf ? "default" : "outline"}
                          size="sm"
                          className={`${
                            activeTimeframe === tf 
                              ? 'bg-accent text-accent-foreground' 
                              : 'bg-muted/20 border-border'
                          }`}
                          onClick={() => setActiveTimeframe(tf)}
                        >
                          {tf}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-96 flex items-center justify-center bg-slate-800/30 rounded-lg border border-border/50">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Interactive Chart ({activeTimeframe})
                      </h3>
                      <p className="text-muted-foreground">
                        Candlestick data for {selectedCrypto}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Market Metrics */}
                <div className="grid grid-cols-4 gap-4">
                  {marketMetrics.map((metric, index) => (
                    <Card key={index} className="p-4 bg-gradient-crypto border-border">
                      <div className="text-center">
                        <h4 className="text-sm text-muted-foreground mb-1">{metric.name}</h4>
                        <p className="text-lg font-semibold text-foreground">{metric.value}</p>
                        <p className={`text-xs ${
                          metric.change.startsWith('+') ? 'text-green-400' : 
                          metric.change.startsWith('-') ? 'text-red-400' : 'text-muted-foreground'
                        }`}>
                          {metric.change}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Technical Indicators Tab */}
              <TabsContent value="technical" className="space-y-6">
                <Card className="p-6 bg-gradient-crypto border-border">
                  <h3 className="text-xl font-semibold mb-6">Technical Indicators</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {technicalIndicators.map((indicator, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/10 rounded-lg">
                        <span className="text-muted-foreground">{indicator.name}</span>
                        <span className={`font-mono font-semibold ${indicator.color}`}>
                          {indicator.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-crypto border-border">
                  <h3 className="text-xl font-semibold mb-4">{t('ai.technical_analysis')}</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="font-semibold text-green-400">Bullish Signal</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Moving averages suggest upward momentum with strong support levels.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-orange-400" />
                        <span className="font-semibold text-orange-400">RSI Warning</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        RSI indicates overbought conditions. Consider taking profits.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* News Analysis Tab */}
              <TabsContent value="news" className="space-y-6">
                <Card className="p-6 bg-gradient-crypto border-border">
                  <h3 className="text-xl font-semibold mb-6">AI News Analysis</h3>
                  <div className="space-y-4">
                    {newsData.slice(0, 5).map((article, index) => (
                      <div key={index} className="p-4 bg-muted/10 rounded-lg border border-border/50">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${article.sentiment === 'bullish' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                                    article.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                                    'bg-blue-500/20 text-blue-400 border-blue-500/30'}
                                `}
                              >
                                {article.sentiment?.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                                {article.impact?.toUpperCase()} IMPACT
                              </Badge>
                              <span className="text-xs text-muted-foreground">{article.time}</span>
                            </div>
                            <h4 className="font-semibold text-foreground mb-2">{article.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{article.description}</p>
                            <p className="text-xs text-muted-foreground">Source: {article.source.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};