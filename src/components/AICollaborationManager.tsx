import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
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
  FileText
} from 'lucide-react';

// 六个AI接口的配置
interface AIAgentConfig {
  id: string;
  name: string;
  provider: 'openai' | 'claude' | 'perplexity' | 'grok' | 'gemini' | 'custom';
  model: string;
  apiKey: string;
  apiUrl?: string;
  specialization: string;
  enabled: boolean;
  temperature?: number;
  maxTokens?: number;
  systemPrompt: string;
}

// 协作模板
interface CollaborationTemplate {
  id: string;
  name: string;
  description: string;
  agents: string[]; // 使用的AI代理ID
  workflow: string;
  outputFormat: string;
}

// 默认AI代理配置
const DEFAULT_AGENTS: AIAgentConfig[] = [
  {
    id: 'coordinator',
    name: '总协调员 (GPT-4)',
    provider: 'openai',
    model: 'gpt-4.1-2025-04-14',
    specialization: '综合分析决策，协调各AI结果，最终输出',
    apiKey: '',
    enabled: true,
    temperature: 0.3,
    maxTokens: 2000,
    systemPrompt: '你是AI协作系统的总协调员，负责整合各专业AI的分析结果，做出最终决策和建议。'
  },
  {
    id: 'technical_analyst',
    name: '技术分析师 (Claude)',
    provider: 'claude',
    model: 'claude-sonnet-4-20250514',
    specialization: '技术指标分析，图表形态识别，交易信号',
    apiKey: '',
    enabled: true,
    temperature: 0.2,
    maxTokens: 1500,
    systemPrompt: '你是专业的技术分析师，专注于各类技术指标和图表形态分析。'
  },
  {
    id: 'news_researcher',
    name: '新闻研究员 (Perplexity)',
    provider: 'perplexity',
    model: 'llama-3.1-sonar-large-128k-online',
    specialization: '实时新闻搜索，市场动态分析，基本面研究',
    apiKey: '',
    enabled: true,
    temperature: 0.1,
    maxTokens: 1200,
    systemPrompt: '你是专业的新闻研究员，专注于搜集和分析最新的市场新闻和基本面信息。'
  },
  {
    id: 'sentiment_analyst',
    name: '情绪分析师 (Grok)',
    provider: 'grok',
    model: 'grok-2-latest',
    specialization: '社交媒体情绪，市场恐慌指数，散户情绪',
    apiKey: '',
    enabled: true,
    temperature: 0.4,
    maxTokens: 1000,
    systemPrompt: '你是市场情绪分析师，专注于分析社交媒体和市场情绪数据。'
  },
  {
    id: 'chart_analyst',
    name: '图表分析师 (Gemini)',
    provider: 'gemini',
    model: 'gemini-2.0-flash-exp',
    specialization: '多模态分析，图像识别，K线形态分析',
    apiKey: '',
    enabled: true,
    temperature: 0.3,
    maxTokens: 1500,
    systemPrompt: '你是图表分析师，擅长识别和分析各种K线形态和图表模式。'
  },
  {
    id: 'custom_specialist',
    name: '自定义专家',
    provider: 'custom',
    model: 'custom-model',
    specialization: '用户自定义专业分析领域',
    apiKey: '',
    apiUrl: '',
    enabled: false,
    temperature: 0.5,
    maxTokens: 1000,
    systemPrompt: '你是用户自定义的专业分析师。'
  }
];

// 预设协作模板
const COLLABORATION_TEMPLATES: CollaborationTemplate[] = [
  {
    id: 'comprehensive_analysis',
    name: '全面分析模板',
    description: '动用所有AI代理进行全方位分析',
    agents: ['news_researcher', 'technical_analyst', 'sentiment_analyst', 'chart_analyst', 'coordinator'],
    workflow: '1.新闻研究→2.技术分析→3.情绪分析→4.图表分析→5.综合决策',
    outputFormat: `## 📊 全面投资分析报告

### 🔍 基本面分析 (新闻研究员)
{news_analysis}

### 📈 技术面分析 (技术分析师)  
{technical_analysis}

### 😊 市场情绪分析 (情绪分析师)
{sentiment_analysis}

### 📋 图表形态分析 (图表分析师)
{chart_analysis}

### 🎯 综合投资建议 (总协调员)
**投资评级**: {rating}
**目标价位**: {target_price}
**止损建议**: {stop_loss}
**风险等级**: {risk_level}
**操作建议**: {action_recommendation}

---
*分析时间: {timestamp}*`
  },
  {
    id: 'quick_decision',
    name: '快速决策模板',
    description: '技术分析+情绪分析的快速决策',
    agents: ['technical_analyst', 'sentiment_analyst', 'coordinator'],
    workflow: '1.技术分析→2.情绪分析→3.快速决策',
    outputFormat: `## ⚡ 快速交易决策

### 📊 技术信号
{technical_analysis}

### 💭 市场情绪
{sentiment_analysis}

### 🎯 交易建议
**操作**: {action}
**入场价**: {entry_price}  
**止损价**: {stop_loss}
**获利目标**: {take_profit}
**风险度**: {risk_score}/10

---
*决策时间: {timestamp}*`
  },
  {
    id: 'news_impact',
    name: '新闻影响评估',
    description: '重点分析新闻事件对市场的影响',
    agents: ['news_researcher', 'sentiment_analyst', 'coordinator'],
    workflow: '1.新闻搜集→2.情绪影响→3.综合评估',
    outputFormat: `## 📰 新闻影响分析报告

### 📋 重要新闻
{news_analysis}

### 📊 情绪反应
{sentiment_analysis}

### ⚠️ 影响评估
**影响程度**: {impact_level}
**预期反应**: {expected_reaction}
**交易建议**: {trading_advice}
**注意事项**: {warnings}

---
*分析时间: {timestamp}*`
  }
];

const AICollaborationManager: React.FC = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<AIAgentConfig[]>(DEFAULT_AGENTS);
  const [templates, setTemplates] = useState<CollaborationTemplate[]>(COLLABORATION_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('comprehensive_analysis');
  const [showApiKeys, setShowApiKeys] = useState<{[key: string]: boolean}>({});
  const [testingAgent, setTestingAgent] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // 输入数据
  const [analysisInput, setAnalysisInput] = useState({
    symbol: 'BTCUSDT',
    question: '请分析当前市场情况并给出交易建议',
    additionalData: ''
  });

  // 更新代理配置
  const updateAgent = useCallback((agentId: string, updates: Partial<AIAgentConfig>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  }, []);

  // 保存配置到localStorage
  const saveConfiguration = useCallback(() => {
    try {
      localStorage.setItem('ai_collaboration_config', JSON.stringify({
        agents: agents,
        templates: templates
      }));
      toast({
        title: "配置已保存",
        description: "AI协作配置已成功保存到本地",
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存配置，请检查存储空间",
        variant: "destructive"
      });
    }
  }, [agents, templates, toast]);

  // 从localStorage加载配置
  const loadConfiguration = useCallback(() => {
    try {
      const saved = localStorage.getItem('ai_collaboration_config');
      if (saved) {
        const config = JSON.parse(saved);
        if (config.agents) setAgents(config.agents);
        if (config.templates) setTemplates(config.templates);
        toast({
          title: "配置已加载",
          description: "成功加载已保存的AI协作配置",
        });
      }
    } catch (error) {
      toast({
        title: "加载失败",
        description: "无法加载保存的配置",
        variant: "destructive"
      });
    }
  }, [toast]);

  // 测试单个代理连接
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

    setTestingAgent(agentId);
    try {
      // 这里可以调用实际的API测试连接
      // 暂时模拟测试
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "连接成功",
        description: `${agent.name} 连接测试成功`,
      });
    } catch (error) {
      toast({
        title: "连接失败",
        description: `${agent.name} 连接测试失败`,
        variant: "destructive"
      });
    } finally {
      setTestingAgent('');
    }
  }, [agents, toast]);

  // 执行AI协作分析
  const executeCollaboration = useCallback(async () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const activeAgents = agents.filter(agent => 
      template.agents.includes(agent.id) && agent.enabled && agent.apiKey
    );

    if (activeAgents.length === 0) {
      toast({
        title: "无法执行分析",
        description: "没有可用的AI代理，请检查配置和API密钥",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // 模拟AI协作分析过程
      const results: {[key: string]: string} = {};
      
      for (const agent of activeAgents) {
        // 这里会调用实际的AI API
        // 暂时使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        switch (agent.id) {
          case 'news_researcher':
            results.news_analysis = `基于最新新闻分析，${analysisInput.symbol}市场出现以下关键信息：
1. 监管政策利好消息
2. 机构资金流入增加  
3. 技术升级进展顺利
整体基本面偏向积极。`;
            break;
          case 'technical_analyst':
            results.technical_analysis = `技术指标显示：
• RSI(14): 52.3 - 中性区域
• MACD: 金叉形成，上涨动能增强
• 布林带: 价格触及中轨，有上攻意愿
• 支撑位: $42,800
• 阻力位: $45,200
技术面偏向看涨。`;
            break;
          case 'sentiment_analyst':
            results.sentiment_analysis = `市场情绪分析：
• 恐慌贪婪指数: 68 (偏贪婪)
• 社交媒体情绪: 62%正面，25%中性，13%负面
• 搜索热度上升15%
• 机构持仓意愿增强
整体情绪偏向乐观。`;
            break;
          case 'chart_analyst':
            results.chart_analysis = `图表形态分析：
• 日线级别: 上升楔形突破
• 4小时级别: 多头排列
• 成交量: 突破伴随放量
• 关键形态: 双底确认完成
图表形态支持上涨趋势。`;
            break;
          case 'coordinator':
            results.rating = '买入';
            results.target_price = '$47,500';
            results.stop_loss = '$41,200';
            results.risk_level = '中等';
            results.action_recommendation = '建议分批买入，控制仓位在30%以内';
            break;
        }
      }

      // 生成最终报告
      let finalReport = template.outputFormat;
      Object.keys(results).forEach(key => {
        finalReport = finalReport.replace(`{${key}}`, results[key]);
      });
      finalReport = finalReport.replace('{timestamp}', new Date().toLocaleString('zh-CN'));
      
      setAnalysisResult(finalReport);
      
      toast({
        title: "分析完成",
        description: `使用${activeAgents.length}个AI代理完成协作分析`,
      });
      
    } catch (error) {
      toast({
        title: "分析失败",
        description: "AI协作分析过程中出现错误",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [agents, templates, selectedTemplate, analysisInput, toast]);

  // 清除所有配置
  const clearAllConfiguration = useCallback(() => {
    setAgents(DEFAULT_AGENTS);
    setTemplates(COLLABORATION_TEMPLATES);
    localStorage.removeItem('ai_collaboration_config');
    toast({
      title: "配置已清除",
      description: "所有配置已重置为默认值",
    });
  }, [toast]);

  React.useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI协作分析系统</h1>
            <p className="text-muted-foreground">配置六个专业AI代理协同工作</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveConfiguration}>
            <Save className="h-4 w-4 mr-2" />
            保存配置
          </Button>
          <Button variant="outline" onClick={clearAllConfiguration}>
            <Trash2 className="h-4 w-4 mr-2" />
            重置配置
          </Button>
        </div>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">AI代理配置</TabsTrigger>
          <TabsTrigger value="templates">协作模板</TabsTrigger>
          <TabsTrigger value="analysis">执行分析</TabsTrigger>
        </TabsList>

        {/* AI代理配置 */}
        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${
                        agent.id === 'coordinator' ? 'bg-blue-100 text-blue-600' :
                        agent.id === 'technical_analyst' ? 'bg-green-100 text-green-600' :
                        agent.id === 'news_researcher' ? 'bg-orange-100 text-orange-600' :
                        agent.id === 'sentiment_analyst' ? 'bg-purple-100 text-purple-600' :
                        agent.id === 'chart_analyst' ? 'bg-pink-100 text-pink-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {agent.id === 'coordinator' && <Brain className="h-4 w-4" />}
                        {agent.id === 'technical_analyst' && <BarChart3 className="h-4 w-4" />}
                        {agent.id === 'news_researcher' && <Globe className="h-4 w-4" />}
                        {agent.id === 'sentiment_analyst' && <MessageSquare className="h-4 w-4" />}
                        {agent.id === 'chart_analyst' && <TrendingUp className="h-4 w-4" />}
                        {agent.id === 'custom_specialist' && <Zap className="h-4 w-4" />}
                      </div>
                      <CardTitle className="text-sm">{agent.name}</CardTitle>
                    </div>
                    <Switch
                      checked={agent.enabled}
                      onCheckedChange={(enabled) => updateAgent(agent.id, { enabled })}
                    />
                  </div>
                  <CardDescription className="text-xs">
                    {agent.specialization}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <Label className="text-xs">模型</Label>
                      <Input
                        value={agent.model}
                        onChange={(e) => updateAgent(agent.id, { model: e.target.value })}
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">温度</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={agent.temperature}
                        onChange={(e) => updateAgent(agent.id, { temperature: parseFloat(e.target.value) })}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs">API密钥</Label>
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
                      className="text-xs h-8"
                    />
                  </div>

                  {agent.provider === 'custom' && (
                    <div>
                      <Label className="text-xs">API地址</Label>
                      <Input
                        value={agent.apiUrl || ''}
                        onChange={(e) => updateAgent(agent.id, { apiUrl: e.target.value })}
                        placeholder="https://api.example.com/v1/chat"
                        className="text-xs h-8"
                      />
                    </div>
                  )}

                  <div>
                    <Label className="text-xs">系统提示词</Label>
                    <Textarea
                      value={agent.systemPrompt}
                      onChange={(e) => updateAgent(agent.id, { systemPrompt: e.target.value })}
                      className="text-xs min-h-[60px] resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testAgentConnection(agent.id)}
                      disabled={!agent.apiKey || testingAgent === agent.id}
                      className="flex-1 h-7 text-xs"
                    >
                      {testingAgent === agent.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1" />
                      ) : (
                        <TestTube className="h-3 w-3 mr-1" />
                      )}
                      测试连接
                    </Button>
                    <Badge variant={agent.enabled && agent.apiKey ? "default" : "secondary"} className="text-xs">
                      {agent.enabled && agent.apiKey ? "就绪" : "未配置"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 协作模板 */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className={`cursor-pointer transition-colors ${
                selectedTemplate === template.id ? 'border-primary bg-primary/5' : ''
              }`} onClick={() => setSelectedTemplate(template.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant={selectedTemplate === template.id ? "default" : "outline"}>
                      {selectedTemplate === template.id ? "已选择" : "点击选择"}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <Label className="font-medium">协作流程:</Label>
                      <p className="text-muted-foreground">{template.workflow}</p>
                    </div>
                    <div>
                      <Label className="font-medium">使用的AI代理:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.agents.map(agentId => {
                          const agent = agents.find(a => a.id === agentId);
                          return agent ? (
                            <Badge key={agentId} variant="secondary" className="text-xs">
                              {agent.name.split('(')[0].trim()}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 执行分析 */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                分析输入
              </CardTitle>
              <CardDescription>
                输入要分析的数据，系统将调用选定的AI代理进行协作分析
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>交易对</Label>
                  <Input
                    value={analysisInput.symbol}
                    onChange={(e) => setAnalysisInput(prev => ({ ...prev, symbol: e.target.value }))}
                    placeholder="BTCUSDT"
                  />
                </div>
                <div>
                  <Label>分析模板</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>分析问题</Label>
                <Textarea
                  value={analysisInput.question}
                  onChange={(e) => setAnalysisInput(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="请分析当前市场情况并给出交易建议"
                  rows={3}
                />
              </div>

              <div>
                <Label>附加数据 (可选)</Label>
                <Textarea
                  value={analysisInput.additionalData}
                  onChange={(e) => setAnalysisInput(prev => ({ ...prev, additionalData: e.target.value }))}
                  placeholder="可以输入价格数据、新闻链接或其他相关信息"
                  rows={3}
                />
              </div>

              <Button
                onClick={executeCollaboration}
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b border-white mr-2" />
                    AI代理协作分析中...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    开始AI协作分析
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 分析结果 */}
          {analysisResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  协作分析结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{analysisResult}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AICollaborationManager;