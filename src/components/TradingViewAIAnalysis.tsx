import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Brain, Send, Loader2, TrendingUp, AlertTriangle, Target, Zap, Database, LineChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TradingViewAIAnalysisProps {
  activeTab?: string;
  className?: string;
}

interface AIAnalysisResult {
  summary: string;
  insights: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  dataSource: string[];
  lastUpdated: string;
}

const TradingViewAIAnalysis: React.FC<TradingViewAIAnalysisProps> = ({ 
  activeTab,
  className = ""
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({
    binance: false,
    tradingview: false,
    news: false,
    technical: false,
    sentiment: false,
    blockchain: false
  });
  const { toast } = useToast();

  const predefinedQuestions = [
    "基于六大API数据源分析当前市场综合趋势",
    "实时评估加密货币市场风险和机会", 
    "结合技术分析和新闻情感给出交易建议",
    "分析热力图异常表现并预测价格走势",
    "基于链上数据和交易量分析市场情绪",
    "综合多数据源检测市场操纵风险"
  ];

  const handleAnalysis = async (questionText?: string) => {
    const queryText = questionText || question;
    if (!queryText.trim()) {
      toast({
        title: "请输入问题",
        description: "请输入您想要分析的问题或选择预设问题",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('super-brain-analysis', {
        body: { 
          question: queryText,
          context: `用户正在查看SUPER BRAINX综合面板，当前活跃标签: ${activeTab || '未知'}`,
          enableAllApis: true,
          dataSources: ['binance', 'tradingview', 'news', 'technical', 'sentiment', 'blockchain']
        }
      });

      if (error) throw error;

      setAnalysisResult(data.analysis);
      setApiStatus(data.apiStatus || {});
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: queryText },
        { role: 'ai', content: data.analysis.summary }
      ]);
      
      setQuestion('');
      toast({
        title: "超级大脑分析完成",
        description: `已通过${data.analysis.dataSource?.length || 0}个API数据源完成综合分析`
      });
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        title: "超级大脑分析失败", 
        description: "多API数据源分析服务暂时不可用，请稍后再试",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* API Status Dashboard */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Database className="w-5 h-5 text-primary" />
            SUPER BRAINX 六大数据源状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries({
              binance: 'Binance 实时数据',
              tradingview: 'TradingView 技术分析', 
              news: '新闻情感分析',
              technical: '技术指标引擎',
              sentiment: '市场情绪监测',
              blockchain: '链上数据分析'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus[key] ? 'bg-green-400' : 'bg-gray-500'
                }`} />
                <span className="text-xs text-foreground">{label}</span>
                {apiStatus[key] && <Zap className="w-3 h-3 text-green-400" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Interface */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Brain className="w-5 h-5 text-primary" />
            SUPER BRAINX 超级大脑分析师
          </CardTitle>
          <CardDescription>
            基于六大真实API数据源提供智能市场综合分析和投资建议
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Predefined Questions */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">超级大脑快速分析</h4>
            <div className="flex flex-wrap gap-2">
              {predefinedQuestions.map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalysis(q)}
                  disabled={loading}
                  className="text-xs"
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Custom Question Input */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">多数据源综合分析</h4>
            <div className="flex gap-2">
              <Textarea
                placeholder="请输入您想要分析的问题，SUPER BRAINX将基于六大API数据源进行综合分析..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 min-h-[80px]"
                disabled={loading}
              />
              <Button 
                onClick={() => handleAnalysis()}
                disabled={loading || !question.trim()}
                className="self-end"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Brain className="w-4 h-4 text-primary" />
              超级大脑分析摘要
              {analysisResult?.dataSource && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {analysisResult.dataSource.length}个数据源
                </Badge>
              )}
            </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <p className="text-sm text-foreground leading-relaxed">
                  {analysisResult.summary}
                </p>
              </ScrollArea>
              <div className="mt-4 flex items-center gap-4">
                <Badge className={getRiskBadgeColor(analysisResult.riskLevel)}>
                  风险: {analysisResult.riskLevel === 'low' ? '低' : analysisResult.riskLevel === 'medium' ? '中' : '高'}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Target className="w-4 h-4" />
                  置信度: {analysisResult.confidence}%
                </div>
                {analysisResult.lastUpdated && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <LineChart className="w-4 h-4" />
                    更新: {new Date(analysisResult.lastUpdated).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                关键洞察
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <ul className="space-y-2">
                  {analysisResult.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-foreground">{insight}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="w-4 h-4 text-primary" />
                交易建议
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-sm text-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">对话历史</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground border border-border/30'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TradingViewAIAnalysis;