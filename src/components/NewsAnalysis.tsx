import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, TrendingUp, TrendingDown, Clock, Globe, Zap, Brain } from "lucide-react";

interface NewsItem {
  title: string;
  description: string;
  source: { name: string };
  publishedAt: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  time?: string;
}

interface NewsAnalysisProps {
  news: NewsItem[];
}

export const NewsAnalysis = ({ news }: NewsAnalysisProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'bearish': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return TrendingUp;
      case 'bearish': return TrendingDown;
      default: return Globe;
    }
  };

  // 分析新闻情绪分布
  const sentimentStats = news.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const marketSentiment = () => {
    const bullish = sentimentStats.bullish || 0;
    const bearish = sentimentStats.bearish || 0;
    if (bullish > bearish) return { trend: '看涨', color: 'text-green-400', percentage: Math.round((bullish / news.length) * 100) };
    if (bearish > bullish) return { trend: '看跌', color: 'text-red-400', percentage: Math.round((bearish / news.length) * 100) };
    return { trend: '中性', color: 'text-yellow-400', percentage: 50 };
  };

  const sentiment = marketSentiment();

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 border-indigo-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-indigo-400" />
            市场新闻分析
          </CardTitle>
          <Badge className={`${sentiment.color} border-current/30`}>
            市场情绪: {sentiment.trend} {sentiment.percentage}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="latest" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="latest" className="text-xs">最新资讯</TabsTrigger>
            <TabsTrigger value="sentiment" className="text-xs">情绪分析</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">AI解读</TabsTrigger>
          </TabsList>
          
          <TabsContent value="latest" className="space-y-3 mt-4">
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {news.slice(0, 6).map((item, index) => {
                const SentimentIcon = getSentimentIcon(item.sentiment);
                return (
                  <div key={index} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-full ${getSentimentColor(item.sentiment)}`}>
                        <SentimentIcon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${getImpactColor(item.impact)} text-xs`}>
                            {item.impact.toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {item.time || '刚刚'}
                          </div>
                        </div>
                        <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-indigo-400">{item.source.name}</span>
                          <Badge className={`${getSentimentColor(item.sentiment)} text-xs`}>
                            {item.sentiment === 'bullish' ? '利好' : item.sentiment === 'bearish' ? '利空' : '中性'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="sentiment" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-400">{sentimentStats.bullish || 0}</p>
                <p className="text-xs text-green-400/70">看涨新闻</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                <TrendingDown className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-red-400">{sentimentStats.bearish || 0}</p>
                <p className="text-xs text-red-400/70">看跌新闻</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
                <Globe className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-yellow-400">{sentimentStats.neutral || 0}</p>
                <p className="text-xs text-yellow-400/70">中性新闻</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
              <h3 className="font-semibold text-indigo-400 mb-2">市场情绪摘要</h3>
              <p className="text-sm text-foreground">
                当前市场新闻整体偏向<span className={`font-bold ${sentiment.color}`}>{sentiment.trend}</span>，
                情绪强度为{sentiment.percentage}%。建议关注高影响力新闻的后续发展。
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4 mt-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-purple-400">AI市场解读</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-sm font-medium text-foreground mb-1">🔍 关键信息提取</p>
                  <p className="text-xs text-muted-foreground">
                    基于最新新闻分析，发现3个关键市场驱动因素：机构采用增加、监管政策明朗、技术突破进展
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-sm font-medium text-foreground mb-1">📊 影响评估</p>
                  <p className="text-xs text-muted-foreground">
                    高影响新闻占比{Math.round(((news.filter(n => n.impact === 'high').length) / news.length) * 100)}%，
                    预计对短期价格波动产生显著影响
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50">
                  <p className="text-sm font-medium text-foreground mb-1">🎯 交易建议</p>
                  <p className="text-xs text-muted-foreground">
                    建议密切关注市场反应，结合技术分析确定最佳入场时机
                  </p>
                </div>
              </div>
              <Button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Zap className="w-4 h-4 mr-2" />
                获取详细AI新闻解读
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};