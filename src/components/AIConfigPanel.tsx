import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Brain, BarChart3, Activity, Globe, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIModelConfig {
  provider: 'openai' | 'claude' | 'perplexity' | 'custom';
  model: string;
  apiKey: string;
  apiUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIConfigPanelProps {
  config: {
    priceChart: AIModelConfig;
    technicalAnalysis: AIModelConfig;
    newsSentiment: AIModelConfig;
  };
  onUpdateConfig: (configKey: string, modelConfig: Partial<AIModelConfig>) => void;
}

const providerModels = {
  openai: [
    'gpt-4.1-2025-04-14',
    'o3-2025-04-16',
    'o4-mini-2025-04-16',
    'gpt-4.1-mini-2025-04-14'
  ],
  claude: [
    'claude-opus-4-20250514',
    'claude-sonnet-4-20250514',
    'claude-3-5-haiku-20241022',
    'claude-3-7-sonnet-20250219'
  ],
  perplexity: [
    'llama-3.1-sonar-small-128k-online',
    'llama-3.1-sonar-large-128k-online',
    'llama-3.1-sonar-huge-128k-online'
  ],
  custom: ['自定义模型']
};

const configDescriptions = {
  priceChart: {
    title: "价格图表分析AI",
    description: "专门用于分析价格走势、技术形态和交易机会",
    icon: BarChart3,
    color: "text-blue-400"
  },
  technicalAnalysis: {
    title: "技术指标分析AI", 
    description: "深度分析RSI、MACD、布林带等技术指标",
    icon: Activity,
    color: "text-green-400"
  },
  newsSentiment: {
    title: "新闻情感分析AI",
    description: "分析新闻事件对市场情感的影响",
    icon: Globe,
    color: "text-purple-400"
  }
};

export const AIConfigPanel = ({ config, onUpdateConfig }: AIConfigPanelProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState({
    priceChart: false,
    technicalAnalysis: false,
    newsSentiment: false
  });

  const handleConfigChange = (
    configKey: keyof typeof config,
    field: keyof AIModelConfig,
    value: any
  ) => {
    onUpdateConfig(configKey, { [field]: value });
  };

  const handleSaveConfig = () => {
    // 保存配置到本地存储
    localStorage.setItem('aiAnalysisConfig', JSON.stringify(config));
    toast({
      title: "配置已保存",
      description: "AI分析配置已成功保存到本地",
    });
    setIsOpen(false);
  };

  const toggleApiKeyVisibility = (configKey: keyof typeof config) => {
    setShowApiKeys(prev => ({
      ...prev,
      [configKey]: !prev[configKey]
    }));
  };

  const renderConfigCard = (configKey: keyof typeof config) => {
    const desc = configDescriptions[configKey];
    const IconComponent = desc.icon;
    const modelConfig = config[configKey];

    return (
      <Card className="bg-gradient-crypto border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <IconComponent className={`w-6 h-6 ${desc.color}`} />
          <div>
            <h3 className="text-lg font-semibold text-foreground">{desc.title}</h3>
            <p className="text-sm text-muted-foreground">{desc.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* AI提供商选择 */}
          <div>
            <Label className="text-sm font-medium text-foreground">AI提供商</Label>
            <Select 
              value={modelConfig.provider} 
              onValueChange={(value) => handleConfigChange(configKey, 'provider', value)}
            >
              <SelectTrigger className="mt-1 bg-muted/20 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-4等)</SelectItem>
                <SelectItem value="claude">Anthropic (Claude)</SelectItem>
                <SelectItem value="perplexity">Perplexity AI</SelectItem>
                <SelectItem value="custom">自定义API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 模型选择 */}
          <div>
            <Label className="text-sm font-medium text-foreground">模型</Label>
            <Select 
              value={modelConfig.model} 
              onValueChange={(value) => handleConfigChange(configKey, 'model', value)}
            >
              <SelectTrigger className="mt-1 bg-muted/20 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providerModels[modelConfig.provider].map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* API密钥 */}
          <div>
            <Label className="text-sm font-medium text-foreground">API密钥</Label>
            <div className="relative mt-1">
              <Input
                type={showApiKeys[configKey] ? "text" : "password"}
                value={modelConfig.apiKey}
                onChange={(e) => handleConfigChange(configKey, 'apiKey', e.target.value)}
                placeholder="输入API密钥..."
                className="bg-muted/20 border-border pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => toggleApiKeyVisibility(configKey)}
              >
                {showApiKeys[configKey] ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 自定义API URL */}
          {modelConfig.provider === 'custom' && (
            <div>
              <Label className="text-sm font-medium text-foreground">自定义API地址</Label>
              <Input
                value={modelConfig.apiUrl || ''}
                onChange={(e) => handleConfigChange(configKey, 'apiUrl', e.target.value)}
                placeholder="https://api.example.com/v1/chat"
                className="mt-1 bg-muted/20 border-border"
              />
            </div>
          )}

          {/* 高级参数 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-foreground">Temperature</Label>
              <Input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={modelConfig.temperature || 0.3}
                onChange={(e) => handleConfigChange(configKey, 'temperature', parseFloat(e.target.value))}
                className="mt-1 bg-muted/20 border-border"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Max Tokens</Label>
              <Input
                type="number"
                min="100"
                max="4000"
                step="100"
                value={modelConfig.maxTokens || 1000}
                onChange={(e) => handleConfigChange(configKey, 'maxTokens', parseInt(e.target.value))}
                className="mt-1 bg-muted/20 border-border"
              />
            </div>
          </div>

          {/* 状态指示器 */}
          <div className="flex items-center gap-2 pt-2">
            <div className={`w-2 h-2 rounded-full ${
              modelConfig.apiKey ? 'bg-success' : 'bg-destructive'
            }`}></div>
            <span className="text-xs text-muted-foreground">
              {modelConfig.apiKey ? '已配置' : '未配置API密钥'}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-muted/20 border-border hover:bg-accent/20"
        >
          <Settings className="w-4 h-4 mr-2" />
          AI配置
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3 font-orbitron text-xl">
            <Brain className="w-6 h-6 text-accent" />
            AI分析模型配置
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/20">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="priceChart">价格分析</TabsTrigger>
              <TabsTrigger value="technicalAnalysis">技术分析</TabsTrigger>
              <TabsTrigger value="newsSentiment">新闻情感</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card className="bg-gradient-crypto border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">AI模型配置概览</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(configDescriptions).map(([key, desc]) => {
                    const IconComponent = desc.icon;
                    const modelConfig = config[key as keyof typeof config];
                    return (
                      <div key={key} className="p-4 bg-muted/10 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className={`w-5 h-5 ${desc.color}`} />
                          <span className="font-medium text-foreground">{desc.title}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">提供商: {modelConfig.provider}</p>
                          <p className="text-muted-foreground">模型: {modelConfig.model}</p>
                          <p className={`${modelConfig.apiKey ? 'text-success' : 'text-destructive'}`}>
                            状态: {modelConfig.apiKey ? '已配置' : '未配置'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="priceChart" className="mt-4">
              {renderConfigCard('priceChart')}
            </TabsContent>

            <TabsContent value="technicalAnalysis" className="mt-4">
              {renderConfigCard('technicalAnalysis')}
            </TabsContent>

            <TabsContent value="newsSentiment" className="mt-4">
              {renderConfigCard('newsSentiment')}
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="bg-muted/20 border-border"
          >
            取消
          </Button>
          <Button 
            onClick={handleSaveConfig}
            className="bg-accent hover:bg-accent/80"
          >
            <Save className="w-4 h-4 mr-2" />
            保存配置
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};