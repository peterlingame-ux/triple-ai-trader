import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  Brain, 
  Database, 
  BarChart3, 
  Zap, 
  DollarSign, 
  Activity,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface APIConfig {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  purpose: string;
  isConfigured: boolean;
  isEnabled: boolean;
  apiKey?: string;
  secretKey?: string;
}

interface TradingAnalysisResult {
  symbol: string;
  entryPrice: {
    min: number;
    max: number;
  };
  takeProfit: number;
  stopLoss: number;
  leverage: number;
  winRate: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  analysis: string;
  timestamp: string;
}

interface ProfessionalTradingConfigProps {
  onAnalysisComplete?: (result: TradingAnalysisResult) => void;
}

export const ProfessionalTradingConfig: React.FC<ProfessionalTradingConfigProps> = ({ 
  onAnalysisComplete 
}) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [targetProfit, setTargetProfit] = useState(400);
  const [totalFunds, setTotalFunds] = useState(10000);

  const [apiConfigs, setApiConfigs] = useState<Record<string, APIConfig>>({
    binance: {
      name: 'Binance API',
      icon: DollarSign,
      color: 'text-yellow-500',
      description: '币安交易所接口',
      purpose: '获取实时价格、K线数据、订单簿深度',
      isConfigured: false,
      isEnabled: false
    },
    openai: {
      name: 'OpenAI API', 
      icon: Brain,
      color: 'text-green-500',
      description: 'GPT模型接口',
      purpose: '技术分析、市场情绪分析',
      isConfigured: false,
      isEnabled: false
    },
    grok: {
      name: 'Grok API',
      icon: Zap,
      color: 'text-blue-500', 
      description: 'xAI Grok模型接口',
      purpose: '实时新闻分析、社交媒体情绪',
      isConfigured: false,
      isEnabled: false
    },
    deepseek: {
      name: 'DeepSeek API',
      icon: Activity,
      color: 'text-purple-500',
      description: 'DeepSeek模型接口', 
      purpose: '深度量化分析、策略优化',
      isConfigured: false,
      isEnabled: false
    },
    cryptocompare: {
      name: 'CryptoCompare API',
      icon: BarChart3,
      color: 'text-orange-500',
      description: '加密货币数据接口',
      purpose: '历史数据、市场指标、新闻聚合',
      isConfigured: false,
      isEnabled: false
    },
    coinglass: {
      name: 'CoinGlass API', 
      icon: TrendingUp,
      color: 'text-cyan-500',
      description: '链上数据分析接口',
      purpose: '合约数据、资金费率、持仓分析',
      isConfigured: false,
      isEnabled: false
    },
    fingpt: {
      name: 'FinGPT API',
      icon: Database,
      color: 'text-red-500', 
      description: '金融大语言模型接口',
      purpose: '专业金融分析、风险评估',
      isConfigured: false,
      isEnabled: false
    }
  });

  const cryptoOptions = [
    'BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'DOT', 'MATIC', 'AVAX'
  ];

  // 检查所有API配置状态
  useEffect(() => {
    if (isAuthenticated) {
      checkAllApiConfigs();
    }
  }, [isAuthenticated]);

  const checkAllApiConfigs = async () => {
    const apiKeys = Object.keys(apiConfigs);
    const results = await Promise.allSettled(
      apiKeys.map(async (apiKey) => {
        try {
          const { data } = await supabase.functions.invoke('api-config-manager', {
            body: { 
              action: 'check',
              service: apiKey === 'cryptocompare' ? 'cryptocompare' : 
                      apiKey === 'coinglass' ? 'coinglass' :
                      apiKey === 'fingpt' ? 'fingpt' :
                      apiKey === 'deepseek' ? 'deepseek' :
                      apiKey === 'grok' ? 'grok' :
                      apiKey === 'openai' ? 'openai' : 
                      apiKey === 'binance' ? 'binance_api_config' : apiKey
            }
          });
          return { apiKey, isConfigured: data?.configured || false };
        } catch (error) {
          return { apiKey, isConfigured: false };
        }
      })
    );

    setApiConfigs(prev => {
      const updated = { ...prev };
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { apiKey, isConfigured } = result.value;
          updated[apiKey] = { ...updated[apiKey], isConfigured };
        }
      });
      return updated;
    });
  };

  const handleApiKeySave = async (apiType: string, apiKey: string, secretKey?: string) => {
    try {
      const serviceMap: Record<string, string> = {
        binance: 'binance_api_config',
        openai: 'openai', 
        grok: 'grok',
        deepseek: 'deepseek',
        cryptocompare: 'cryptocompare',
        coinglass: 'coinglass',
        fingpt: 'fingpt'
      };

      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: {
          action: 'save',
          service: serviceMap[apiType] || apiType,
          apiKey,
          ...(secretKey && { secretKey })
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Configuration failed');
      }

      setApiConfigs(prev => ({
        ...prev,
        [apiType]: { ...prev[apiType], isConfigured: true, apiKey }
      }));

      toast({
        title: '配置成功',
        description: `${apiConfigs[apiType].name} 配置已保存`,
      });

      // 重新检查配置状态
      checkAllApiConfigs();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '配置失败',
        description: error.message || '保存配置时出错',
      });
    }
  };

  const toggleApiEnabled = (apiType: string) => {
    setApiConfigs(prev => ({
      ...prev,
      [apiType]: { 
        ...prev[apiType], 
        isEnabled: !prev[apiType].isEnabled 
      }
    }));
  };

  const performComprehensiveAnalysis = async () => {
    const enabledApis = Object.entries(apiConfigs)
      .filter(([_, config]) => config.isEnabled && config.isConfigured);

    if (enabledApis.length < 3) {
      toast({
        variant: 'destructive',
        title: '配置不足',
        description: '至少需要配置3个API才能进行综合分析',
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('professional-trading-analysis', {
        body: {
          symbol: selectedCrypto,
          enabledApis: enabledApis.map(([type, _]) => type),
          targetProfit,
          totalFunds,
          analysisType: 'comprehensive'
        }
      });

      if (error || !data?.success) {
        throw new Error(data?.error || 'Analysis failed');
      }

      const result: TradingAnalysisResult = data.result;
      onAnalysisComplete?.(result);

      toast({
        title: '分析完成',
        description: `${selectedCrypto} 综合分析已完成，胜率: ${result.winRate}%`,
      });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '分析失败',
        description: error.message || '分析过程中出错',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEnabledCount = () => {
    return Object.values(apiConfigs).filter(config => config.isEnabled && config.isConfigured).length;
  };

  const getConfiguredCount = () => {
    return Object.values(apiConfigs).filter(config => config.isConfigured).length;
  };

  return (
    <div className="space-y-6">
      {/* 头部状态面板 */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-400" />
            专业合约交易配置中心
          </CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{getConfiguredCount()}/7</div>
              <div className="text-sm text-slate-400">已配置API</div>
            </div>
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{getEnabledCount()}/7</div>
              <div className="text-sm text-slate-400">已启用API</div>
            </div>
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">¥{targetProfit}</div>
              <div className="text-sm text-slate-400">日盈利目标</div>
            </div>
            <div className="text-center p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">¥{totalFunds}</div>
              <div className="text-sm text-slate-400">总资金</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
          <TabsTrigger value="config" className="text-white data-[state=active]:bg-slate-700">
            API配置管理
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-white data-[state=active]:bg-slate-700">
            交易分析面板
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          {/* API配置卡片 */}
          <div className="grid gap-4">
            {Object.entries(apiConfigs).map(([type, config]) => {
              const IconComponent = config.icon;
              return (
                <Card key={type} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-6 h-6 ${config.color}`} />
                        <div>
                          <CardTitle className="text-lg text-white">{config.name}</CardTitle>
                          <p className="text-sm text-slate-400">{config.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {config.isConfigured ? (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            已配置
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            待配置
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant={config.isEnabled ? "default" : "outline"}
                          onClick={() => toggleApiEnabled(type)}
                          disabled={!config.isConfigured}
                          className={config.isEnabled ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {config.isEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-slate-300 bg-slate-700/30 p-3 rounded">
                      <strong>用途：</strong> {config.purpose}
                    </div>
                    
                    <APIKeyInput
                      apiType={type}
                      config={config}
                      onSave={handleApiKeySave}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {/* 交易参数配置 */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                交易参数设置
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-300">选择货币</Label>
                <select 
                  value={selectedCrypto}
                  onChange={(e) => setSelectedCrypto(e.target.value)}
                  className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md p-2"
                >
                  {cryptoOptions.map(crypto => (
                    <option key={crypto} value={crypto}>{crypto}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-slate-300">日盈利目标 (元)</Label>
                <Input
                  type="number"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(Number(e.target.value))}
                  className="mt-1 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">总资金 (元)</Label>
                <Input
                  type="number"
                  value={totalFunds}
                  onChange={(e) => setTotalFunds(Number(e.target.value))}
                  className="mt-1 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* 分析按钮 */}
          <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Button
                onClick={performComprehensiveAnalysis}
                disabled={isAnalyzing || getEnabledCount() < 3}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-lg"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    正在分析...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    启动7重AI综合分析
                  </div>
                )}
              </Button>
              <p className="text-slate-400 mt-2">
                {getEnabledCount() < 3 
                  ? `需要至少3个API才能开始分析 (当前: ${getEnabledCount()}/7)`
                  : `当前已启用 ${getEnabledCount()}/7 个API接口`
                }
              </p>
            </CardContent>
          </Card>

          {/* 风险提示 */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-slate-300">
              <strong>交易策略：</strong> 宁愿不做单，做单就要赚钱。严格执行止盈止损，日盈利目标达成后立即停止交易。
              合约交易有高风险，请谨慎操作。
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// API密钥输入组件
const APIKeyInput: React.FC<{
  apiType: string;
  config: APIConfig;
  onSave: (apiType: string, apiKey: string, secretKey?: string) => void;
}> = ({ apiType, config, onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isExpanded, setIsExpanded] = useState(!config.isConfigured);

  const needsSecretKey = apiType === 'binance';

  const handleSave = () => {
    if (!apiKey.trim()) return;
    onSave(apiType, apiKey, needsSecretKey ? secretKey : undefined);
    setApiKey('');
    setSecretKey('');
    setIsExpanded(false);
  };

  if (config.isConfigured && !isExpanded) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded">
        <span className="text-green-400">✓ API密钥已配置</span>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setIsExpanded(true)}
          className="text-slate-300"
        >
          重新配置
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-slate-300">API Key</Label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="输入API密钥"
          className="mt-1 bg-slate-700 border-slate-600 text-white"
        />
      </div>
      
      {needsSecretKey && (
        <div>
          <Label className="text-slate-300">Secret Key</Label>
          <Input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="输入Secret密钥"
            className="mt-1 bg-slate-700 border-slate-600 text-white"
          />
        </div>
      )}
      
      <div className="flex gap-2">
        <Button 
          onClick={handleSave}
          disabled={!apiKey.trim() || (needsSecretKey && !secretKey.trim())}
          className="bg-blue-600 hover:bg-blue-700"
        >
          保存配置
        </Button>
        {config.isConfigured && (
          <Button 
            variant="outline"
            onClick={() => setIsExpanded(false)}
            className="text-slate-300"
          >
            取消
          </Button>
        )}
      </div>
    </div>
  );
};