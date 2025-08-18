import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Brain, Send, Loader2, TrendingUp, AlertTriangle, Target, Zap, Database, LineChart, Upload, Image, X, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SuperBrainDataSourcesGrid from './SuperBrainDataSourcesGrid';

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
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string, image?: string}>>([]);
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({
    binance: false,
    tradingview: false,
    news: false,
    technical: false,
    sentiment: false,
    blockchain: false
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const consultationCategories = [
    {
      title: "技术分析咨询",
      icon: TrendingUp,
      description: "K线图分析、支撑阻力位、图表形态识别",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    },
    {
      title: "市场风险评估", 
      icon: AlertTriangle,
      description: "实时风险监控、投资机会识别、风险管理",
      color: "bg-red-500/10 text-red-400 border-red-500/30"
    },
    {
      title: "交易策略建议",
      icon: Target,
      description: "入场时机、止盈止损、仓位管理策略",
      color: "bg-green-500/10 text-green-400 border-green-500/30"
    },
    {
      title: "价格走势预测",
      icon: LineChart,
      description: "基于多数据源的价格趋势分析和预测",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/30"
    },
    {
      title: "链上数据解读",
      icon: Database,
      description: "巨鲸动向、资金流向、链上指标分析",
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
    },
    {
      title: "市场情绪监测",
      icon: Brain,
      description: "恐慌指数、社交情绪、新闻影响分析",
      color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
    }
  ];

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "文件格式错误",
        description: "请上传图片文件（PNG、JPG、JPEG等）",
        variant: "destructive"
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleAnalysis = async (questionText?: string, categoryTitle?: string) => {
    const queryText = questionText || question;
    if (!queryText.trim() && !uploadedImage) {
      toast({
        title: "请输入问题或上传图片",
        description: "请输入您的咨询问题或上传截图进行分析",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let finalQuestion = queryText;
      if (categoryTitle && !queryText) {
        finalQuestion = `我想咨询关于${categoryTitle}的问题，请基于当前市场数据给我专业建议。`;
      }
      if (uploadedImage && !queryText) {
        finalQuestion = "请分析这张图片中的技术指标和市场信号，给出专业的交易建议。";
      }

      const { data, error } = await supabase.functions.invoke('super-brain-analysis', {
        body: { 
          question: finalQuestion,
          context: `用户咨询类型: ${categoryTitle || '综合咨询'}，当前活跃标签: ${activeTab || '未知'}${uploadedImage ? '，用户上传了图片进行分析' : ''}`,
          enableAllApis: true,
          dataSources: ['binance', 'tradingview', 'news', 'technical', 'sentiment', 'blockchain'],
          hasImage: !!uploadedImage
        }
      });

      if (error) throw error;

      setAnalysisResult(data.analysis);
      setApiStatus(data.apiStatus || {});
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: finalQuestion, image: uploadedImage || undefined },
        { role: 'ai', content: data.analysis.summary }
      ]);
      
      setQuestion('');
      setUploadedImage(null);
      toast({
        title: "SUPER BRAINX 咨询完成",
        description: `已通过${data.analysis.dataSource?.length || 0}个数据源完成专业分析`
      });
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        title: "咨询分析失败", 
        description: "SUPER BRAINX服务暂时不可用，请稍后再试",
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
      {/* Six Data Source Characters Grid */}
      <SuperBrainDataSourcesGrid 
        apiStatus={apiStatus}
        className="mb-6"
      />

      {/* AI Consultation Interface */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MessageCircle className="w-5 h-5 text-primary" />
            SUPER BRAINX 专业投资咨询
          </CardTitle>
          <CardDescription>
            基于六大真实API数据源，提供专业的加密货币投资咨询服务
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consultation Categories */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">专业咨询服务</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {consultationCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleAnalysis("", category.title)}
                    disabled={loading}
                    className={`p-4 h-auto flex-col items-start text-left space-y-2 ${category.color}`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <IconComponent className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium text-sm">{category.title}</span>
                    </div>
                    <p className="text-xs opacity-70 leading-relaxed">
                      {category.description}
                    </p>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Screenshot Upload Area */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">上传截图咨询</h4>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              
              {uploadedImage ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={uploadedImage}
                      alt="上传的截图"
                      className="max-w-full max-h-32 rounded-lg border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImage(null);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    截图已上传，您可以直接发送或添加问题描述
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">上传交易截图或K线图</p>
                    <p className="text-xs text-muted-foreground">
                      支持 PNG、JPG、JPEG 格式，拖拽或点击选择文件
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Custom Question Input */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">详细咨询描述</h4>
            <div className="flex gap-2">
              <Textarea
                placeholder="请详细描述您的问题，例如：当前BTC走势如何？有哪些支撑阻力位？或直接上传截图让我帮您分析..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 min-h-[100px]"
                disabled={loading}
              />
              <Button 
                onClick={() => handleAnalysis()}
                disabled={loading || (!question.trim() && !uploadedImage)}
                className="self-end bg-primary hover:bg-primary/90"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    咨询
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              💡 提示：您可以上传K线图截图、交易界面或任何需要分析的图表，我将提供专业的技术分析建议
            </p>
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
                      {msg.image && (
                        <div className="mb-2">
                          <img
                            src={msg.image}
                            alt="用户上传的图片"
                            className="max-w-full max-h-32 rounded border"
                          />
                        </div>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      {msg.role === 'user' && (
                        <div className="flex items-center gap-1 mt-1 opacity-70">
                          <MessageCircle className="w-3 h-3" />
                          <span className="text-xs">咨询</span>
                        </div>
                      )}
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-1 mt-2 opacity-70">
                          <Brain className="w-3 h-3" />
                          <span className="text-xs">SUPER BRAINX 专业分析</span>
                        </div>
                      )}
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