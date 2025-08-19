import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Key, TrendingUp, Brain, BarChart3, Globe, Database, LineChart, AlertTriangle } from 'lucide-react';

interface APIConfig {
  service: string;
  apiKey?: string;
  secretKey?: string;
  endpoint?: string;
  status: 'connected' | 'error' | 'not_configured';
}

const API_SERVICES = [
  {
    key: 'binance_api',
    name: 'Binance API',
    description: '现货&合约交易数据，实时价格行情',
    icon: TrendingUp,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'text', required: true },
      { name: 'secretKey', label: 'Secret Key', type: 'password', required: true }
    ]
  },
  {
    key: 'openai_api',
    name: 'OpenAI API',
    description: '智能分析，市场趋势预测',
    icon: Brain,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true }
    ]
  },
  {
    key: 'grok_api',
    name: 'Grok API',
    description: '实时新闻分析，社交情绪监控',
    icon: AlertTriangle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true }
    ]
  },
  {
    key: 'deepseek_api',
    name: 'DeepSeek API',
    description: '深度学习模型，技术指标分析',
    icon: Database,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true }
    ]
  },
  {
    key: 'cryptocompare_api',
    name: 'CryptoCompare API',
    description: '历史数据，市场统计分析',
    icon: BarChart3,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'text', required: true }
    ]
  },
  {
    key: 'coinglass_api',
    name: 'CoinGlass API',
    description: '期货数据，资金费率分析',
    icon: LineChart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'text', required: true }
    ]
  },
  {
    key: 'fingpt_api',
    name: 'FinGPT API',
    description: '金融大模型，综合策略分析',
    icon: Globe,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true }
    ]
  }
];

export const ProfessionalAPIManager: React.FC = () => {
  const [configs, setConfigs] = useState<Record<string, APIConfig>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [editingService, setEditingService] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAllConfigs();
  }, []);

  const loadAllConfigs = async () => {
    const configPromises = API_SERVICES.map(async (service) => {
      try {
        const { data } = await supabase.functions.invoke('api-config-manager', {
          body: { action: 'get', service: service.key }
        });
        
        return {
          [service.key]: {
            service: service.key,
            ...data.config,
            status: data.success ? 'connected' : 'not_configured'
          }
        };
      } catch (error) {
        return {
          [service.key]: {
            service: service.key,
            apiKey: '',
            status: 'not_configured'
          }
        };
      }
    });

    const results = await Promise.all(configPromises);
    const allConfigs = results.reduce((acc, config) => ({ ...acc, ...config }), {});
    setConfigs(allConfigs);
  };

  const handleSave = async (serviceKey: string) => {
    if (!formData.apiKey?.trim()) {
      toast.error('API Key不能为空');
      return;
    }

    setLoading({ ...loading, [serviceKey]: true });

    try {
      const { data } = await supabase.functions.invoke('api-config-manager', {
        body: {
          action: 'save',
          service: serviceKey,
          config: formData
        }
      });

      if (data.success) {
        toast.success(`${serviceKey.toUpperCase()} 配置保存成功`);
        setConfigs({
          ...configs,
          [serviceKey]: {
            ...formData,
            service: serviceKey,
            status: 'connected'
          }
        });
        setEditingService(null);
        setFormData({});
      } else {
        toast.error('配置保存失败');
      }
    } catch (error) {
      console.error('保存配置错误:', error);
      toast.error('配置保存失败');
    } finally {
      setLoading({ ...loading, [serviceKey]: false });
    }
  };

  const handleTest = async (serviceKey: string) => {
    setLoading({ ...loading, [`${serviceKey}_test`]: true });

    try {
      const { data } = await supabase.functions.invoke('api-config-manager', {
        body: {
          action: 'test',
          service: serviceKey
        }
      });

      if (data.success) {
        toast.success(`${serviceKey.toUpperCase()} 连接测试成功`);
        setConfigs({
          ...configs,
          [serviceKey]: {
            ...configs[serviceKey],
            status: 'connected'
          }
        });
      } else {
        toast.error(`${serviceKey.toUpperCase()} 连接测试失败: ${data.message}`);
        setConfigs({
          ...configs,
          [serviceKey]: {
            ...configs[serviceKey],
            status: 'error'
          }
        });
      }
    } catch (error) {
      console.error('测试连接错误:', error);
      toast.error('连接测试失败');
    } finally {
      setLoading({ ...loading, [`${serviceKey}_test`]: false });
    }
  };

  const startEditing = (serviceKey: string) => {
    const config = configs[serviceKey] || { service: serviceKey, status: 'not_configured' as const };
    setFormData({
      apiKey: config.apiKey || '',
      secretKey: config.secretKey || '',
      endpoint: config.endpoint || ''
    });
    setEditingService(serviceKey);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            已连接
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            连接错误
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
            <Key className="w-3 h-3 mr-1" />
            未配置
          </Badge>
        );
    }
  };

  const connectedCount = Object.values(configs).filter(config => config.status === 'connected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">专业API配置中心</h2>
          <p className="text-muted-foreground mt-1">
            配置7个专业API，构建高胜率交易分析系统
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{connectedCount}/7</div>
          <div className="text-sm text-muted-foreground">API已配置</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {API_SERVICES.map((service) => {
          const IconComponent = service.icon;
          const config = configs[service.key] || { service: service.key, status: 'not_configured' as const };
          const isEditing = editingService === service.key;

          return (
            <Card key={service.key} className={`${service.borderColor} transition-all hover:shadow-lg`}>
              <CardHeader className={`${service.bgColor} border-b ${service.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-white`}>
                      <IconComponent className={`w-5 h-5 ${service.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(config.status)}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">API状态</div>
                        <div className="text-sm text-muted-foreground">
                          {config.apiKey ? `已配置 (${config.apiKey.slice(0, 8)}...)` : '未配置'}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(service.key)}
                        >
                          {config.apiKey ? '编辑' : '配置'}
                        </Button>
                        {config.apiKey && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTest(service.key)}
                            disabled={loading[`${service.key}_test`]}
                          >
                            {loading[`${service.key}_test`] ? '测试中...' : '测试'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {service.fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label htmlFor={`${service.key}_${field.name}`}>
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                          id={`${service.key}_${field.name}`}
                          type={field.type}
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            [field.name]: e.target.value
                          })}
                          placeholder={`请输入${field.label}`}
                        />
                      </div>
                    ))}

                    <div className="flex space-x-2 pt-2">
                      <Button
                        onClick={() => handleSave(service.key)}
                        disabled={loading[service.key]}
                        className="flex-1"
                      >
                        {loading[service.key] ? '保存中...' : '保存配置'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingService(null);
                          setFormData({});
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {connectedCount >= 3 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-semibold text-green-800">
                  系统就绪！已配置{connectedCount}个API
                </div>
                <div className="text-sm text-green-600">
                  可以开始进行专业的多维度数字货币分析，建议配置完所有7个API以获得最佳分析效果。
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};