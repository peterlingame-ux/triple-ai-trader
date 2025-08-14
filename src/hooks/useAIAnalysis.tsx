import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// AI模型配置接口
interface AIModelConfig {
  provider: 'openai' | 'claude' | 'perplexity' | 'grok' | 'custom';
  model: string;
  apiKey: string;
  apiUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

// 三个AI功能的配置
interface AIAnalysisConfig {
  priceChart: AIModelConfig;
  technicalAnalysis: AIModelConfig;
  newsSentiment: AIModelConfig;
}

// 默认配置
const DEFAULT_CONFIG: AIAnalysisConfig = {
  priceChart: {
    provider: 'openai',
    model: 'gpt-4.1-2025-04-14',
    apiKey: '',
    temperature: 0.3,
    maxTokens: 1000
  },
  technicalAnalysis: {
    provider: 'claude',
    model: 'claude-sonnet-4-20250514',
    apiKey: '',
    temperature: 0.2,
    maxTokens: 1500
  },
  newsSentiment: {
    provider: 'grok',
    model: 'grok-2-beta',
    apiKey: '',
    temperature: 0.1,
    maxTokens: 800
  }
};

// 价格图表分析请求接口
interface PriceChartAnalysisRequest {
  symbol: string;
  timeframe: string;
  priceData: {
    current: number;
    high24h: number;
    low24h: number;
    volume24h: number;
    change24h: number;
  };
  technicalData: {
    rsi: number;
    ma20: number;
    ma50: number;
    support: number;
    resistance: number;
  };
}

// 技术分析请求接口
interface TechnicalAnalysisRequest {
  symbol: string;
  indicators: {
    rsi: number;
    macd: number;
    kdj: number;
    bollinger: {
      upper: number;
      middle: number;
      lower: number;
    };
    movingAverages: {
      ma5: number;
      ma10: number;
      ma20: number;
      ma50: number;
      ma200: number;
    };
    supportResistance: {
      support1: number;
      support2: number;
      resistance1: number;
      resistance2: number;
    };
  };
  marketData: {
    price: number;
    volume: number;
    marketCap: number;
    dominance: number;
  };
}

// 新闻情感分析请求接口
interface NewsSentimentRequest {
  news: Array<{
    title: string;
    description: string;
    source: string;
    publishedAt: string;
  }>;
  symbol: string;
  timeframe: string;
}

export const useAIAnalysis = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<AIAnalysisConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState({
    priceChart: false,
    technicalAnalysis: false,
    newsSentiment: false
  });

  // 通用AI API调用函数
  const callAIAPI = async (
    configKey: keyof AIAnalysisConfig,
    prompt: string,
    context: any
  ): Promise<string> => {
    const modelConfig = config[configKey];
    
    if (!modelConfig.apiKey) {
      throw new Error(`请先配置${configKey}的API密钥`);
    }

    let response: Response;
    let requestBody: any;

    try {
      switch (modelConfig.provider) {
        case 'openai':
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${modelConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelConfig.model,
              messages: [
                {
                  role: 'system',
                  content: prompt
                },
                {
                  role: 'user',
                  content: JSON.stringify(context)
                }
              ],
              temperature: modelConfig.temperature,
              max_tokens: modelConfig.maxTokens
            }),
          });
          break;

        case 'claude':
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${modelConfig.apiKey}`,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: modelConfig.model,
              messages: [
                {
                  role: 'user',
                  content: `${prompt}\n\nData: ${JSON.stringify(context)}`
                }
              ],
              temperature: modelConfig.temperature,
              max_tokens: modelConfig.maxTokens
            }),
          });
          break;

        case 'perplexity':
          response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${modelConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelConfig.model,
              messages: [
                {
                  role: 'system',
                  content: prompt
                },
                {
                  role: 'user',
                  content: JSON.stringify(context)
                }
              ],
              temperature: modelConfig.temperature,
              max_tokens: modelConfig.maxTokens,
              search_recency_filter: 'month',
              return_images: false
            }),
          });
          break;

        case 'grok':
          response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${modelConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelConfig.model,
              messages: [
                {
                  role: 'system',
                  content: prompt
                },
                {
                  role: 'user',
                  content: JSON.stringify(context)
                }
              ],
              temperature: modelConfig.temperature,
              max_tokens: modelConfig.maxTokens
            }),
          });
          break;

        case 'custom':
          if (!modelConfig.apiUrl) {
            throw new Error('自定义API需要提供apiUrl');
          }
          response = await fetch(modelConfig.apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${modelConfig.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelConfig.model,
              prompt: prompt,
              context: context,
              temperature: modelConfig.temperature,
              max_tokens: modelConfig.maxTokens
            }),
          });
          break;

        default:
          throw new Error(`不支持的AI提供商: ${modelConfig.provider}`);
      }

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // 根据不同提供商解析响应
      switch (modelConfig.provider) {
        case 'openai':
        case 'perplexity':
        case 'grok':
          return data.choices[0].message.content;
        case 'claude':
          return data.content[0].text;
        case 'custom':
          return data.response || data.content || data.text;
        default:
          return data.response || data.content || data.text;
      }

    } catch (error) {
      console.error(`${configKey} AI API调用错误:`, error);
      throw error;
    }
  };

  // 1. 价格图表AI分析
  const analyzePriceChart = useCallback(async (data: PriceChartAnalysisRequest): Promise<string> => {
    setLoading(prev => ({ ...prev, priceChart: true }));
    
    try {
      const prompt = `你是一个专业的加密货币价格图表分析师。基于提供的数据，分析${data.symbol}在${data.timeframe}时间框架下的价格走势和交易机会。

请提供：
1. 当前价格趋势分析
2. 关键支撑阻力位分析
3. 技术形态识别
4. 短期价格预测
5. 具体的交易建议（买入/卖出/持有）

请用中文回答，保持专业和准确。`;

      const result = await callAIAPI('priceChart', prompt, data);
      
      toast({
        title: "价格图表分析完成",
        description: "AI已完成价格走势分析",
      });
      
      return result;
    } catch (error) {
      toast({
        title: "价格分析失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, priceChart: false }));
    }
  }, [config, toast]);

  // 2. 技术分析AI
  const analyzeTechnicalIndicators = useCallback(async (data: TechnicalAnalysisRequest): Promise<string> => {
    setLoading(prev => ({ ...prev, technicalAnalysis: true }));
    
    try {
      const prompt = `你是一个专业的技术分析专家。基于提供的技术指标数据，对${data.symbol}进行深度技术分析。

请分析：
1. RSI、MACD、KDJ等动量指标的信号
2. 移动平均线的排列和趋势
3. 布林带的位置和意义
4. 支撑阻力位的有效性
5. 综合技术面评级（强烈买入/买入/中性/卖出/强烈卖出）
6. 风险提示和建议止损位

请提供专业的技术分析报告，用中文回答。`;

      const result = await callAIAPI('technicalAnalysis', prompt, data);
      
      toast({
        title: "技术分析完成",
        description: "AI已完成技术指标分析",
      });
      
      return result;
    } catch (error) {
      toast({
        title: "技术分析失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, technicalAnalysis: false }));
    }
  }, [config, toast]);

  // 3. 新闻情感分析AI
  const analyzeNewsSentiment = useCallback(async (data: NewsSentimentRequest): Promise<string> => {
    setLoading(prev => ({ ...prev, newsSentiment: true }));
    
    try {
      const prompt = `你是一个专业的加密货币新闻情感分析师。基于提供的新闻数据，分析对${data.symbol}的市场情感影响。

请分析：
1. 新闻的整体情感倾向（极度看涨/看涨/中性/看跌/极度看跌）
2. 重要新闻事件的影响权重
3. 市场关注度和热点分析
4. 潜在的市场反应预测
5. 建议的交易策略调整
6. 风险事件提醒

请提供详细的情感分析报告，用中文回答。`;

      const result = await callAIAPI('newsSentiment', prompt, data);
      
      toast({
        title: "新闻情感分析完成",
        description: "AI已完成新闻情感分析",
      });
      
      return result;
    } catch (error) {
      toast({
        title: "新闻分析失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, newsSentiment: false }));
    }
  }, [config, toast]);

  // 更新AI配置
  const updateConfig = useCallback((newConfig: Partial<AIAnalysisConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // 更新单个AI模型配置
  const updateModelConfig = useCallback((
    configKey: keyof AIAnalysisConfig, 
    modelConfig: Partial<AIModelConfig>
  ) => {
    setConfig(prev => ({
      ...prev,
      [configKey]: { ...prev[configKey], ...modelConfig }
    }));
  }, []);

  return {
    // AI分析功能
    analyzePriceChart,
    analyzeTechnicalIndicators,
    analyzeNewsSentiment,
    
    // 配置管理
    config,
    updateConfig,
    updateModelConfig,
    
    // 加载状态
    loading,
    
    // 工具函数
    callAIAPI
  };
};