import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertTriangle,
  Bot,
  Zap,
  Database,
  Newspaper,
  BarChart3,
  Brain,
  Settings,
  TestTube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface APIConfig {
  id: string;
  name: string;
  provider: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  description: string;
  usedFor: string[];
  endpoint?: string;
  modelExample: string;
  isConfigured: boolean;
  isConnected: boolean;
  lastTested?: string;
  maskedKey?: string;
}

export function AIAPIConfigManager() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [configs, setConfigs] = useState<APIConfig[]>([
    {
      id: 'openai',
      name: 'OpenAI API',
      provider: 'OpenAI',
      icon: Bot,
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      description: 'GPT系列模型，用于价格分析和策略生成',
      usedFor: ['价格图表分析', '交易策略生成', '风险评估'],
      endpoint: 'https://api.openai.com/v1',
      modelExample: 'gpt-4.1-2025-04-14',
      isConfigured: false,
      isConnected: false
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      provider: 'Anthropic',
      icon: Brain,
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-violet-500',
      description: 'Claude系列模型，用于技术分析和复杂推理',
      usedFor: ['技术指标分析', '图表形态识别', '深度分析'],
      endpoint: 'https://api.anthropic.com/v1',
      modelExample: 'claude-sonnet-4-20250514',
      isConfigured: false,
      isConnected: false
    },
    {
      id: 'perplexity',
      name: 'Perplexity AI',
      provider: 'Perplexity',
      icon: Database,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      description: '实时搜索AI，用于新闻和链上数据分析',
      usedFor: ['新闻情感分析', '实时资讯', '市场情报'],
      endpoint: 'https://api.perplexity.ai',
      modelExample: 'llama-3.1-sonar-large-128k-online',
      isConfigured: false,
      isConnected: false
    },
    {
      id: 'grok',
      name: 'Grok (X.AI)',
      provider: 'X.AI',
      icon: Zap,
      color: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
      description: 'Grok模型，用于实时社交媒体情感分析',
      usedFor: ['社交媒体分析', '市场情绪', '趋势预测'],
      endpoint: 'https://api.x.ai/v1',
      modelExample: 'grok-2-beta',
      isConfigured: false,
      isConnected: false
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      provider: 'Google',
      icon: BarChart3,
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-blue-500',
      description: 'Gemini模型，用于多模态分析和预测',
      usedFor: ['图表分析', '多维度预测', '量化策略'],
      endpoint: 'https://generativelanguage.googleapis.com/v1',
      modelExample: 'gemini-2.0-flash-exp',
      isConfigured: false,
      isConnected: false
    },
    {
      id: 'custom',
      name: 'Custom API',
      provider: 'Custom',
      icon: Settings,
      color: 'text-gray-600',
      gradient: 'from-gray-500 to-slate-500',
      description: '自定义API接口，支持本地或私有模型',
      usedFor: ['自定义模型', '本地部署', '专有算法'],
      endpoint: '自定义配置',
      modelExample: 'custom-model',
      isConfigured: false,
      isConnected: false
    }
  ]);

  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      checkAllConfigurations();
    }
  }, [isAuthenticated]);

  const checkAllConfigurations = async () => {
    setLoading(true);
    try {
      const updatedConfigs = [...configs];
      
      for (let i = 0; i < updatedConfigs.length; i++) {
        const config = updatedConfigs[i];
        try {
          const { data, error } = await supabase.functions.invoke('api-config-manager', {
            body: { 
              action: 'check',
              service: `${config.id}_api_config`
            }
          });

          if (!error && data?.configured) {
            updatedConfigs[i] = {
              ...config,
              isConfigured: true,
              maskedKey: data.maskedKey || '••••••••',
              lastTested: data.lastTested
            };
          }
        } catch (error) {
          console.error(`检查${config.name}配置失败:`, error);
        }
      }
      
      setConfigs(updatedConfigs);
      
      toast({
        title: "配置检查完成",
        description: `已检查${updatedConfigs.filter(c => c.isConfigured).length}/${updatedConfigs.length}个AI接口`,
      });
    } catch (error) {
      console.error('检查配置失败:', error);
      toast({
        title: "检查失败",
        description: "无法检查API配置状态",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAPIConfig = async (configId: string) => {
    if (!apiKey.trim()) {
      toast({
        title: "缺少API密钥",
        description: "请输入有效的API密钥",
        variant: "destructive"
      });
      return;
    }

    try {
      const requestBody: any = {
        action: 'save',
        service: `${configId}_api_config`,
        apiKey: apiKey.trim()
      };

      if (configId === 'custom' && customEndpoint.trim()) {
        requestBody.customEndpoint = customEndpoint.trim();
      }

      const { error } = await supabase.functions.invoke('api-config-manager', {
        body: requestBody
      });

      if (error) {
        throw error;
      }

      // 更新配置状态
      setConfigs(prev => prev.map(config => 
        config.id === configId 
          ? { ...config, isConfigured: true, maskedKey: maskApiKey(apiKey) }
          : config
      ));

      setEditingConfig(null);
      setApiKey('');
      setCustomEndpoint('');
      setShowApiKey(false);

      toast({
        title: "配置保存成功",
        description: `${configs.find(c => c.id === configId)?.name} API已配置`,
      });

      // 自动测试连接
      testConnection(configId);
    } catch (error: any) {
      console.error('保存配置失败:', error);
      toast({
        title: "保存失败",
        description: error.message || "无法保存API配置",
        variant: "destructive"
      });
    }
  };

  const testConnection = async (configId: string) => {
    setTestingConnection(configId);
    try {
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'test',
          service: `${configId}_api_config`
        }
      });

      if (error) {
        throw error;
      }

      // 更新连接状态
      setConfigs(prev => prev.map(config => 
        config.id === configId 
          ? { 
              ...config, 
              isConnected: data.success,
              lastTested: new Date().toLocaleString('zh-CN')
            }
          : config
      ));

      toast({
        title: data.success ? "连接成功" : "连接失败",
        description: data.message,
        variant: data.success ? "default" : "destructive"
      });
    } catch (error: any) {
      console.error('测试连接失败:', error);
      toast({
        title: "测试失败",
        description: error.message || "无法测试API连接",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(null);
    }
  };

  const clearConfig = async (configId: string) => {
    try {
      const { error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'clear',
          service: `${configId}_api_config`
        }
      });

      if (error) {
        throw error;
      }

      setConfigs(prev => prev.map(config => 
        config.id === configId 
          ? { ...config, isConfigured: false, isConnected: false, maskedKey: undefined, lastTested: undefined }
          : config
      ));

      toast({
        title: "配置已清除",
        description: `${configs.find(c => c.id === configId)?.name} API配置已删除`,
      });
    } catch (error: any) {
      toast({
        title: "清除失败",
        description: error.message || "无法清除API配置",
        variant: "destructive"
      });
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
  };

  const getStatusBadge = (config: APIConfig) => {
    if (testingConnection === config.id) {
      return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />测试中</Badge>;
    }
    if (!config.isConfigured) {
      return <Badge variant="outline">未配置</Badge>;
    }
    if (config.isConnected) {
      return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />已连接</Badge>;
    }
    return <Badge variant="secondary"><Shield className="w-3 h-3 mr-1" />已配置</Badge>;
  };

  const configuredCount = configs.filter(c => c.isConfigured).length;
  const connectedCount = configs.filter(c => c.isConnected).length;

  if (!isAuthenticated) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI API 配置管理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              请先登录以管理AI API配置
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="max-w-6xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          检查API配置状态中...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 总体状态卡片 */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Bot className="h-8 w-8 text-primary" />
                AI API 配置管理中心
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                管理您的6个AI接口配置，确保交易系统正常运行
              </p>
            </div>
            <Button onClick={checkAllConfigurations} variant="outline" className="gap-2">
              <TestTube className="h-4 w-4" />
              重新检查
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-primary">{configuredCount}/6</div>
              <div className="text-sm text-muted-foreground">已配置接口</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{connectedCount}/6</div>
              <div className="text-sm text-muted-foreground">连接正常</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{Math.round(connectedCount/6*100)}%</div>
              <div className="text-sm text-muted-foreground">系统可用性</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API配置列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {configs.map((config) => {
          const Icon = config.icon;
          const isEditing = editingConfig === config.id;
          
          return (
            <Card key={config.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${config.gradient} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{config.provider}</p>
                    </div>
                  </div>
                  {getStatusBadge(config)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{config.description}</p>
                
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">主要用途:</div>
                  <div className="flex flex-wrap gap-1">
                    {config.usedFor.map((use, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                {config.isConfigured && !isEditing && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">API密钥:</span>
                      <span className="font-mono">{config.maskedKey}</span>
                    </div>
                    {config.lastTested && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">最后测试:</span>
                        <span className="text-xs">{config.lastTested}</span>
                      </div>
                    )}
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="space-y-2">
                      <Label>API密钥</Label>
                      <div className="relative">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="输入API密钥"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {config.id === 'custom' && (
                      <div className="space-y-2">
                        <Label>自定义端点</Label>
                        <Input
                          value={customEndpoint}
                          onChange={(e) => setCustomEndpoint(e.target.value)}
                          placeholder="https://your-api-endpoint.com"
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={() => saveAPIConfig(config.id)} className="flex-1">
                        保存配置
                      </Button>
                      <Button 
                        onClick={() => {
                          setEditingConfig(null);
                          setApiKey('');
                          setCustomEndpoint('');
                          setShowApiKey(false);
                        }} 
                        variant="outline"
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {!config.isConfigured ? (
                    <Button 
                      onClick={() => setEditingConfig(config.id)} 
                      className="flex-1"
                      variant="outline"
                    >
                      配置API
                    </Button>
                  ) : !isEditing ? (
                    <>
                      <Button 
                        onClick={() => testConnection(config.id)} 
                        variant="outline"
                        disabled={testingConnection === config.id}
                        className="flex-1"
                      >
                        {testingConnection === config.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <TestTube className="w-4 h-4" />
                        )}
                        测试连接
                      </Button>
                      <Button 
                        onClick={() => setEditingConfig(config.id)} 
                        variant="ghost"
                        size="sm"
                      >
                        编辑
                      </Button>
                      <Button 
                        onClick={() => clearConfig(config.id)} 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        清除
                      </Button>
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 使用说明 */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">✅ 已准备好的功能</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• API密钥安全存储</li>
                <li>• 连接状态实时监控</li>
                <li>• 支持6种主流AI提供商</li>
                <li>• 自动连接测试</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔧 注意事项</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 需要先获取各API的密钥</li>
                <li>• 建议测试连接确保可用</li>
                <li>• 密钥会安全加密存储</li>
                <li>• 支持随时更新配置</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}