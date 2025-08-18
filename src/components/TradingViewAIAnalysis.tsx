import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Brain, Send, Loader2, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { useToast } from './ui/use-toast';
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
}

const TradingViewAIAnalysis: React.FC<TradingViewAIAnalysisProps> = ({ 
  activeTab,
  className = ""
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const { toast } = useToast();

  const predefinedQuestions = [
    "分析当前市场趋势和投资机会",
    "评估加密货币市场的风险水平",
    "基于技术分析给出交易建议", 
    "解读最新的市场新闻对价格的影响",
    "分析热力图中的异常表现币种"
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
      const { data, error } = await supabase.functions.invoke('ai-market-analysis', {
        body: { 
          question: queryText,
          context: `用户正在查看TradingView综合面板，当前活跃标签: ${activeTab || '未知'}`
        }
      });

      if (error) throw error;

      setAnalysisResult(data.analysis);
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: queryText },
        { role: 'ai', content: data.analysis.summary }
      ]);
      
      setQuestion('');
      toast({
        title: "分析完成",
        description: "AI已成功分析市场数据"
      });
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        title: "分析失败", 
        description: "AI分析服务暂时不可用，请稍后再试",
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
      {/* AI Chat Interface */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Brain className="w-5 h-5 text-primary" />
            AI市场分析师
          </CardTitle>
          <CardDescription>
            基于TradingView数据提供智能市场分析和投资建议
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Predefined Questions */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">快速分析</h4>
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
            <h4 className="text-sm font-medium text-muted-foreground">自定义分析</h4>
            <div className="flex gap-2">
              <Textarea
                placeholder="请输入您想要分析的问题，例如：分析BTC的技术指标趋势..."
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
                AI分析摘要
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