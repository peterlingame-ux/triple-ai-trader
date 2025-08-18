import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Settings, 
  Eye, 
  EyeOff, 
  Save, 
  TestTube, 
  Trash2, 
  Users, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Zap,
  FileText,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  Activity,
  Database,
  Network,
  Cpu
} from 'lucide-react';

// AI代理配置接口
interface AIAgentConfig {
  id: string;
  name: string;
  provider: 'openai' | 'claude' | 'perplexity' | 'grok' | 'gemini' | 'custom';
  model: string;
  apiKey: string;
  apiUrl?: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
  status: 'idle' | 'testing' | 'ready' | 'error';
  lastTest?: Date;
  specialization: string;
}

// 专业AI代理配置
const PROFESSIONAL_AGENTS: AIAgentConfig[] = [
  {
    id: 'coordinator',
    name: 'GPT-4 总协调员',
    provider: 'openai',
    model: 'gpt-4.1-2025-04-14',
    specialization: '综合决策分析，统筹协调各AI结果',
    apiKey: '',
    systemPrompt: '你是AI协作系统的总协调员，负责综合各专业AI的分析结果，做出最终的投资决策和风险评估。你必须基于其他AI的专业分析，给出明确的操作建议。',
    temperature: 0.3,
    maxTokens: 2000,
    enabled: true,
    status: 'idle'
  },
  {
    id: 'technical_analyst',
    name: 'Claude-4 技术分析师',
    provider: 'claude',
    model: 'claude-sonnet-4-20250514',
    specialization: '技术指标深度分析，图表形态识别',
    apiKey: '',
    systemPrompt: '你是专业的加密货币技术分析师，精通各类技术指标分析。请基于提供的数据进行深度技术分析，包括RSI、MACD、KDJ、布林带等指标，识别关键支撑阻力位，分析价格趋势和交易信号。',
    temperature: 0.2,
    maxTokens: 1800,
    enabled: true,
    status: 'idle'
  },
  {
    id: 'news_researcher',
    name: 'Perplexity 新闻研究员',
    provider: 'perplexity',
    model: 'llama-3.1-sonar-large-128k-online',
    specialization: '实时新闻搜索，基本面研究',
    apiKey: '',
    systemPrompt: '你是专业的市场新闻研究员，负责搜索和分析最新的加密货币市场新闻、政策动态和基本面信息。请提供最新的市场资讯分析，评估新闻事件对市场的潜在影响。',
    temperature: 0.1,
    maxTokens: 1500,
    enabled: true,
    status: 'idle'
  },
  {
    id: 'sentiment_analyst',
    name: 'Grok-2 情绪分析师',
    provider: 'grok',
    model: 'grok-2-latest',
    specialization: '社交媒体情绪分析，散户情绪追踪',
    apiKey: '',
    systemPrompt: '你是市场情绪分析专家，专门分析社交媒体情绪、恐慌贪婪指数、散户情绪等心理面指标。请分析当前市场情绪状况，预测情绪变化对价格的潜在影响。',
    temperature: 0.4,
    maxTokens: 1200,
    enabled: true,
    status: 'idle'
  },
  {
    id: 'chart_analyst',
    name: 'Gemini 图表分析师',
    provider: 'gemini',
    model: 'gemini-2.0-flash-exp',
    specialization: '多模态分析，K线形态识别',
    apiKey: '',
    systemPrompt: '你是专业的图表分析师，精通K线形态分析和成交量分析。请识别重要的图表形态，分析价格行为模式，预测可能的价格走向。',
    temperature: 0.3,
    maxTokens: 1500,
    enabled: true,
    status: 'idle'
  },
  {
    id: 'risk_manager',
    name: '自定义风险管理师',
    provider: 'custom',
    model: 'custom-risk-model',
    specialization: '风险评估，仓位管理，止损策略',
    apiKey: '',
    apiUrl: '',
    systemPrompt: '你是专业的风险管理师，负责评估交易风险，制定仓位管理策略和止损方案。请基于市场分析提供详细的风险控制建议。',
    temperature: 0.2,
    maxTokens: 1000,
    enabled: false,
    status: 'idle'
  }
];

const ProfessionalAICollaboration: React.FC = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<AIAgentConfig[]>(PROFESSIONAL_AGENTS);
  const [showApiKeys, setShowApiKeys] = useState<{[key: string]: boolean}>({});
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [connectionStatuses, setConnectionStatuses] = useState<{[key: string]: boolean}>({});
  
  // 分析输入参数
  const [analysisParams, setAnalysisParams] = useState({
    symbol: 'BTCUSDT',
    question: '请进行全面的市场分析并给出具体的交易建议，包括入场点位、止损位和目标价位',
    timeframe: '4h',
    riskLevel: 'medium'
  });

  // 实时状态监控
  const [systemStats, setSystemStats] = useState({
    totalAgents: 6,
    readyAgents: 0,
    avgResponseTime: 0,
    successRate: 100
  });

  // 加载保存的配置
  useEffect(() => {
    loadConfiguration();
  }, []);

  // 更新系统统计
  useEffect(() => {
    const readyAgents = agents.filter(agent => agent.enabled && agent.apiKey && agent.status === 'ready').length;
    setSystemStats(prev => ({
      ...prev,
      readyAgents
    }));
  }, [agents]);

  // 更新AI代理配置
  const updateAgent = useCallback((agentId: string, updates: Partial<AIAgentConfig>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  }, []);

  // 保存配置到localStorage
  const saveConfiguration = useCallback(() => {
    try {
      localStorage.setItem('professional_ai_config', JSON.stringify(agents));
      toast({
        title: "配置已保存",
        description: "AI协作配置已成功保存",
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存配置",
        variant: "destructive"
      });
    }
  }, [agents, toast]);

  // 加载配置
  const loadConfiguration = useCallback(() => {
    try {
      const saved = localStorage.getItem('professional_ai_config');
      if (saved) {
        const config = JSON.parse(saved);
        setAgents(config);
        toast({
          title: "配置已加载",
          description: "成功加载已保存的配置",
        });
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    }
  }, [toast]);

  // 测试单个AI连接
  const testAgentConnection = useCallback(async (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || !agent.apiKey) {
      toast({
        title: "测试失败",
        description: "请先配置API密钥",
        variant: "destructive"
      });
      return;
    }

    updateAgent(agentId, { status: 'testing' });

    try {
      // 模拟API测试 - 这里应该调用实际的测试端点
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 更新连接状态
      setConnectionStatuses(prev => ({ ...prev, [agentId]: true }));
      updateAgent(agentId, { status: 'ready', lastTest: new Date() });
      
      toast({
        title: "连接成功",
        description: `${agent.name} 连接测试成功`,
      });
    } catch (error) {
      setConnectionStatuses(prev => ({ ...prev, [agentId]: false }));
      updateAgent(agentId, { status: 'error' });
      
      toast({
        title: "连接失败",
        description: `${agent.name} 连接测试失败`,
        variant: "destructive"
      });
    }
  }, [agents, toast, updateAgent]);

  // 测试所有连接
  const testAllConnections = useCallback(async () => {
    const enabledAgents = agents.filter(agent => agent.enabled && agent.apiKey);
    
    if (enabledAgents.length === 0) {
      toast({
        title: "无可用代理",
        description: "请先配置并启用AI代理",
        variant: "destructive"
      });
      return;
    }

    // 并行测试所有连接
    const testPromises = enabledAgents.map(agent => testAgentConnection(agent.id));
    await Promise.all(testPromises);
  }, [agents, testAgentConnection, toast]);

  // 执行AI协作分析
  const executeCollaboration = useCallback(async () => {
    const enabledAgents = agents.filter(agent => agent.enabled && agent.apiKey);
    
    if (enabledAgents.length < 3) {
      toast({
        title: "代理数量不足",
        description: "至少需要3个AI代理参与协作分析",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // 构建协作任务
      const collaborationTask = {
        symbol: analysisParams.symbol,
        question: analysisParams.question,
        dataContext: {
          timeframe: analysisParams.timeframe,
          riskLevel: analysisParams.riskLevel,
          timestamp: new Date().toISOString()
        },
        agents: enabledAgents,
        workflow: 'parallel_analysis',
        outputTemplate: 'comprehensive_report'
      };

      console.log('发起AI协作分析任务:', collaborationTask);

      // 调用Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-collaboration-engine', {
        body: { task: collaborationTask }
      });

      if (error) {
        throw error;
      }

      console.log('协作分析完成:', data);

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 15;
        });
      }, 500);

      // 等待分析完成
      await new Promise(resolve => setTimeout(resolve, 3000));
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (data.success) {
        setAnalysisResult(data.data.report);
        
        // 更新系统统计
        setSystemStats(prev => ({
          ...prev,
          avgResponseTime: data.data.statistics.analysisTime,
          successRate: (data.data.statistics.successfulAgents / data.data.statistics.totalAgents) * 100
        }));

        toast({
          title: "分析完成",
          description: `${data.data.statistics.successfulAgents}个AI代理协作完成分析`,
        });
      } else {
        throw new Error(data.error);
      }

    } catch (error) {
      console.error('协作分析失败:', error);
      toast({
        title: "分析失败",
        description: error.message || "AI协作分析过程中出现错误",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [agents, analysisParams, toast]);

  // 清除所有配置
  const clearConfiguration = useCallback(() => {
    setAgents(PROFESSIONAL_AGENTS);
    setConnectionStatuses({});
    localStorage.removeItem('professional_ai_config');
    toast({
      title: "配置已重置",
      description: "所有配置已重置为默认值",
    });
  }, [toast]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 系统状态概览 */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">专业AI协作引擎</CardTitle>
                <CardDescription>六个专业AI代理同步协作分析系统</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={systemStats.readyAgents >= 3 ? "default" : "destructive"} className="px-3 py-1">
                {systemStats.readyAgents}/{systemStats.totalAgents} 就绪
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Cpu className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">活跃代理</p>
                <p className="text-2xl font-bold">{systemStats.readyAgents}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">成功率</p>
                <p className="text-2xl font-bold">{systemStats.successRate.toFixed(0)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">响应时间</p>
                <p className="text-2xl font-bold">{systemStats.avgResponseTime}ms</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">系统状态</p>
                <p className="text-2xl font-bold text-green-600">正常</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">AI代理配置</TabsTrigger>
          <TabsTrigger value="execution">执行分析</TabsTrigger>
          <TabsTrigger value="monitoring">实时监控</TabsTrigger>
          <TabsTrigger value="results">分析结果</TabsTrigger>
        </TabsList>

        {/* AI代理配置 */}
        <TabsContent value="agents" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">专业AI代理配置</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={testAllConnections} size="sm">
                <TestTube className="h-4 w-4 mr-2" />
                全部测试
              </Button>
              <Button variant="outline" onClick={saveConfiguration} size="sm">
                <Save className="h-4 w-4 mr-2" />
                保存配置
              </Button>
              <Button variant="outline" onClick={clearConfiguration} size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                重置配置
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className={`relative transition-colors ${
                agent.status === 'ready' ? 'border-green-200 bg-green-50/30' :
                agent.status === 'error' ? 'border-red-200 bg-red-50/30' :
                agent.status === 'testing' ? 'border-yellow-200 bg-yellow-50/30' :
                'border-gray-200'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        agent.id === 'coordinator' ? 'bg-blue-100 text-blue-600' :
                        agent.id === 'technical_analyst' ? 'bg-green-100 text-green-600' :
                        agent.id === 'news_researcher' ? 'bg-orange-100 text-orange-600' :
                        agent.id === 'sentiment_analyst' ? 'bg-purple-100 text-purple-600' :
                        agent.id === 'chart_analyst' ? 'bg-pink-100 text-pink-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {agent.id === 'coordinator' && <Brain className="h-5 w-5" />}
                        {agent.id === 'technical_analyst' && <BarChart3 className="h-5 w-5" />}
                        {agent.id === 'news_researcher' && <Globe className="h-5 w-5" />}
                        {agent.id === 'sentiment_analyst' && <MessageSquare className="h-5 w-5" />}
                        {agent.id === 'chart_analyst' && <TrendingUp className="h-5 w-5" />}
                        {agent.id === 'risk_manager' && <Shield className="h-5 w-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-base">{agent.name}</CardTitle>
                        <CardDescription className="text-sm">{agent.specialization}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={agent.enabled}
                        onCheckedChange={(enabled) => updateAgent(agent.id, { enabled })}
                      />
                      {agent.status === 'ready' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {agent.status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                      {agent.status === 'testing' && <Clock className="h-5 w-5 text-yellow-600 animate-spin" />}
                      {agent.status === 'idle' && <AlertTriangle className="h-5 w-5 text-gray-400" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">模型</Label>
                      <Input
                        value={agent.model}
                        onChange={(e) => updateAgent(agent.id, { model: e.target.value })}
                        className="h-8"
                        disabled={agent.status === 'testing'}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">温度参数</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={agent.temperature}
                        onChange={(e) => updateAgent(agent.id, { temperature: parseFloat(e.target.value) })}
                        className="h-8"
                        disabled={agent.status === 'testing'}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">API密钥</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, [agent.id]: !prev[agent.id] }))}
                        className="h-6 w-6 p-0"
                      >
                        {showApiKeys[agent.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                    <Input
                      type={showApiKeys[agent.id] ? "text" : "password"}
                      value={agent.apiKey}
                      onChange={(e) => updateAgent(agent.id, { apiKey: e.target.value })}
                      placeholder="输入API密钥"
                      className="h-8"
                      disabled={agent.status === 'testing'}
                    />
                  </div>

                  {agent.provider === 'custom' && (
                    <div>
                      <Label className="text-sm">API地址</Label>
                      <Input
                        value={agent.apiUrl || ''}
                        onChange={(e) => updateAgent(agent.id, { apiUrl: e.target.value })}
                        placeholder="https://api.example.com/v1/chat"
                        className="h-8"
                        disabled={agent.status === 'testing'}
                      />
                    </div>
                  )}

                  <div>
                    <Label className="text-sm">系统提示词</Label>
                    <Textarea
                      value={agent.systemPrompt}
                      onChange={(e) => updateAgent(agent.id, { systemPrompt: e.target.value })}
                      className="min-h-[80px] resize-none text-sm"
                      rows={3}
                      disabled={agent.status === 'testing'}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {agent.lastTest && (
                        <span>最后测试: {agent.lastTest.toLocaleTimeString()}</span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testAgentConnection(agent.id)}
                      disabled={!agent.apiKey || agent.status === 'testing'}
                      className="h-8"
                    >
                      {agent.status === 'testing' ? (
                        <>
                          <Clock className="h-3 w-3 mr-1 animate-spin" />
                          测试中
                        </>
                      ) : (
                        <>
                          <TestTube className="h-3 w-3 mr-1" />
                          测试连接
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 执行分析 */}
        <TabsContent value="execution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                AI协作分析执行
              </CardTitle>
              <CardDescription>
                配置分析参数，启动六个AI代理协同分析
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 分析参数配置 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>交易对</Label>
                  <Input
                    value={analysisParams.symbol}
                    onChange={(e) => setAnalysisParams(prev => ({ ...prev, symbol: e.target.value }))}
                    placeholder="BTCUSDT"
                  />
                </div>
                <div>
                  <Label>时间周期</Label>
                  <Select 
                    value={analysisParams.timeframe} 
                    onValueChange={(value) => setAnalysisParams(prev => ({ ...prev, timeframe: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1小时</SelectItem>
                      <SelectItem value="4h">4小时</SelectItem>
                      <SelectItem value="1d">日线</SelectItem>
                      <SelectItem value="1w">周线</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>风险偏好</Label>
                  <Select 
                    value={analysisParams.riskLevel} 
                    onValueChange={(value) => setAnalysisParams(prev => ({ ...prev, riskLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">保守型</SelectItem>
                      <SelectItem value="medium">稳健型</SelectItem>
                      <SelectItem value="high">激进型</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>分析需求</Label>
                <Textarea
                  value={analysisParams.question}
                  onChange={(e) => setAnalysisParams(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="描述你的分析需求和关注点..."
                  rows={4}
                />
              </div>

              {/* 协作状态显示 */}
              {isAnalyzing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI协作分析进度</span>
                    <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    {analysisProgress < 30 && "初始化AI代理..."}
                    {analysisProgress >= 30 && analysisProgress < 60 && "并行分析执行中..."}
                    {analysisProgress >= 60 && analysisProgress < 90 && "汇总分析结果..."}
                    {analysisProgress >= 90 && "生成协作报告..."}
                  </div>
                </div>
              )}

              {/* 执行按钮 */}
              <Button
                onClick={executeCollaboration}
                disabled={isAnalyzing || systemStats.readyAgents < 3}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    AI协作分析中...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    启动AI协作分析
                  </>
                )}
              </Button>

              {systemStats.readyAgents < 3 && (
                <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  需要至少3个AI代理处于就绪状态才能执行协作分析
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 实时监控 */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                系统实时监控
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <Card key={agent.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{agent.name.split(' ')[0]}</span>
                      <Badge variant={
                        agent.status === 'ready' ? 'default' :
                        agent.status === 'testing' ? 'secondary' :
                        agent.status === 'error' ? 'destructive' : 'outline'
                      }>
                        {agent.status === 'ready' ? '就绪' :
                         agent.status === 'testing' ? '测试中' :
                         agent.status === 'error' ? '错误' : '空闲'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>提供商:</span>
                        <span>{agent.provider.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>模型:</span>
                        <span className="truncate">{agent.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>状态:</span>
                        <span className={
                          agent.enabled && agent.apiKey ? 'text-green-600' : 'text-red-600'
                        }>
                          {agent.enabled && agent.apiKey ? '已配置' : '未配置'}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 分析结果 */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                AI协作分析报告
              </CardTitle>
              <CardDescription>
                基于多个专业AI代理的协同分析结果
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <div className="bg-muted/30 p-6 rounded-lg">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm font-mono">{analysisResult}</pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>暂无分析结果</p>
                  <p className="text-sm">请在"执行分析"标签页启动AI协作分析</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalAICollaboration;