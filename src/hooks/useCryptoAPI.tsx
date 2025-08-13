import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// API配置接口
interface CryptoAPIConfig {
  provider: 'coingecko' | 'binance' | 'coinmarketcap' | 'mock';
  apiKey?: string;
  baseUrl?: string;
  endpoints?: {
    prices?: string;
    historical?: string;
    news?: string;
  };
  rateLimits?: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

// 加密货币数据接口
export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  marketCap: number;
  marketCapRank: number;
  circulatingSupply: number;
  totalSupply?: number;
  maxSupply?: number;
  ath: number;
  atl: number;
  image: string;
  dominance?: number;
  lastUpdated: string;
  // 技术指标
  rsi?: number;
  ma20?: number;
  ma50?: number;
  support?: number;
  resistance?: number;
}

// 历史数据接口
export interface HistoricalData {
  timestamp: number;
  price: number;
  volume: number;
}

// 新闻数据接口
export interface NewsData {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  impact?: 'high' | 'medium' | 'low';
}

// 默认配置
const DEFAULT_CONFIG: CryptoAPIConfig = {
  provider: 'mock',
  baseUrl: 'https://api.coingecko.com/api/v3',
  endpoints: {
    prices: '/simple/price',
    historical: '/coins/{id}/market_chart',
    news: '/news'
  },
  rateLimits: {
    requestsPerMinute: 10,
    requestsPerHour: 500
  }
};

export const useCryptoAPI = (initialConfig: Partial<CryptoAPIConfig> = {}) => {
  const [config, setConfig] = useState<CryptoAPIConfig>({
    ...DEFAULT_CONFIG,
    ...initialConfig
  });
  
  const [loading, setLoading] = useState({
    prices: false,
    historical: false,
    news: false
  });
  
  const [error, setError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState({
    remaining: 0,
    resetTime: 0
  });
  
  const { toast } = useToast();

  // 请求计数器（用于本地限速）
  const [requestCount, setRequestCount] = useState({
    minute: 0,
    hour: 0,
    lastMinute: Math.floor(Date.now() / 60000),
    lastHour: Math.floor(Date.now() / 3600000)
  });

  // 检查请求限制
  const checkRateLimit = (): boolean => {
    const currentMinute = Math.floor(Date.now() / 60000);
    const currentHour = Math.floor(Date.now() / 3600000);
    
    // 重置计数器
    if (currentMinute !== requestCount.lastMinute) {
      setRequestCount(prev => ({
        ...prev,
        minute: 0,
        lastMinute: currentMinute
      }));
    }
    
    if (currentHour !== requestCount.lastHour) {
      setRequestCount(prev => ({
        ...prev,
        hour: 0,
        lastHour: currentHour
      }));
    }
    
    // 检查限制
    if (requestCount.minute >= config.rateLimits!.requestsPerMinute) {
      toast({
        title: "请求频率限制",
        description: "已达到每分钟请求限制，请稍后再试",
        variant: "destructive"
      });
      return false;
    }
    
    if (requestCount.hour >= config.rateLimits!.requestsPerHour) {
      toast({
        title: "请求频率限制",
        description: "已达到每小时请求限制，请稍后再试",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  // 通用API请求函数
  const makeAPIRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    if (!checkRateLimit()) {
      throw new Error('Rate limit exceeded');
    }

    // 增加请求计数
    setRequestCount(prev => ({
      ...prev,
      minute: prev.minute + 1,
      hour: prev.hour + 1
    }));

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    };

    // 添加API密钥（如果有）
    if (config.apiKey) {
      if (config.provider === 'coinmarketcap') {
        headers['X-CMC_PRO_API_KEY'] = config.apiKey;
      } else if (config.provider === 'coingecko') {
        headers['x-cg-demo-api-key'] = config.apiKey;
      }
    }

    const response = await fetch(`${config.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    // 更新限速信息
    const remaining = response.headers.get('x-ratelimit-remaining');
    const resetTime = response.headers.get('x-ratelimit-reset');
    
    if (remaining && resetTime) {
      setRateLimitInfo({
        remaining: parseInt(remaining),
        resetTime: parseInt(resetTime)
      });
    }

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  // 获取加密货币价格数据
  const fetchCryptoPrices = async (symbols: string[]): Promise<CryptoData[]> => {
    if (config.provider === 'mock') {
      return generateMockData(symbols);
    }

    setLoading(prev => ({ ...prev, prices: true }));
    setError(null);

    try {
      let data: CryptoData[] = [];

      switch (config.provider) {
        case 'coingecko':
          data = await fetchFromCoinGecko(symbols);
          break;
        case 'binance':
          data = await fetchFromBinance(symbols);
          break;
        case 'coinmarketcap':
          data = await fetchFromCoinMarketCap(symbols);
          break;
        default:
          data = generateMockData(symbols);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "API请求失败",
        description: `使用模拟数据: ${errorMessage}`,
        variant: "destructive"
      });
      
      // 返回模拟数据作为备用
      return generateMockData(symbols);
    } finally {
      setLoading(prev => ({ ...prev, prices: false }));
    }
  };

  // CoinGecko API实现
  const fetchFromCoinGecko = async (symbols: string[]): Promise<CryptoData[]> => {
    const ids = symbols.join(',').toLowerCase();
    const endpoint = `/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true&include_last_updated_at=true`;
    
    const data = await makeAPIRequest(endpoint);
    
    return symbols.map((symbol, index) => ({
      symbol: symbol.toUpperCase(),
      name: symbol,
      price: data[symbol.toLowerCase()]?.usd || 0,
      change24h: data[symbol.toLowerCase()]?.usd_24h_change || 0,
      changePercent24h: data[symbol.toLowerCase()]?.usd_24h_change || 0,
      volume24h: data[symbol.toLowerCase()]?.usd_24h_vol || 0,
      high24h: data[symbol.toLowerCase()]?.usd * 1.05 || 0,
      low24h: data[symbol.toLowerCase()]?.usd * 0.95 || 0,
      marketCap: data[symbol.toLowerCase()]?.usd_market_cap || 0,
      marketCapRank: index + 1,
      circulatingSupply: 0,
      ath: data[symbol.toLowerCase()]?.usd * 1.5 || 0,
      atl: data[symbol.toLowerCase()]?.usd * 0.1 || 0,
      image: `https://assets.coingecko.com/coins/images/${index + 1}/large/${symbol.toLowerCase()}.png`,
      lastUpdated: new Date(data[symbol.toLowerCase()]?.last_updated_at * 1000 || Date.now()).toISOString()
    }));
  };

  // Binance API实现
  const fetchFromBinance = async (symbols: string[]): Promise<CryptoData[]> => {
    const baseUrl = 'https://api.binance.com/api/v3';
    const ticker24hr = await fetch(`${baseUrl}/ticker/24hr`).then(res => res.json());
    
    return symbols.map((symbol, index) => {
      const binanceSymbol = `${symbol}USDT`;
      const tickerData = ticker24hr.find((t: any) => t.symbol === binanceSymbol);
      
      return {
        symbol: symbol.toUpperCase(),
        name: symbol,
        price: parseFloat(tickerData?.lastPrice || '0'),
        change24h: parseFloat(tickerData?.priceChange || '0'),
        changePercent24h: parseFloat(tickerData?.priceChangePercent || '0'),
        volume24h: parseFloat(tickerData?.volume || '0'),
        high24h: parseFloat(tickerData?.highPrice || '0'),
        low24h: parseFloat(tickerData?.lowPrice || '0'),
        marketCap: 0,
        marketCapRank: index + 1,
        circulatingSupply: 0,
        ath: parseFloat(tickerData?.lastPrice || '0') * 1.5,
        atl: parseFloat(tickerData?.lastPrice || '0') * 0.1,
        image: `https://assets.coingecko.com/coins/images/${index + 1}/large/${symbol.toLowerCase()}.png`,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  // CoinMarketCap API实现
  const fetchFromCoinMarketCap = async (symbols: string[]): Promise<CryptoData[]> => {
    const symbolStr = symbols.join(',').toUpperCase();
    const endpoint = `/v1/cryptocurrency/quotes/latest?symbol=${symbolStr}`;
    
    const data = await makeAPIRequest(endpoint);
    
    return symbols.map((symbol, index) => {
      const coinData = data.data[symbol.toUpperCase()];
      const quote = coinData?.quote?.USD;
      
      return {
        symbol: symbol.toUpperCase(),
        name: coinData?.name || symbol,
        price: quote?.price || 0,
        change24h: quote?.percent_change_24h || 0,
        changePercent24h: quote?.percent_change_24h || 0,
        volume24h: quote?.volume_24h || 0,
        high24h: quote?.price * 1.05 || 0,
        low24h: quote?.price * 0.95 || 0,
        marketCap: quote?.market_cap || 0,
        marketCapRank: coinData?.cmc_rank || index + 1,
        circulatingSupply: coinData?.circulating_supply || 0,
        totalSupply: coinData?.total_supply,
        maxSupply: coinData?.max_supply,
        ath: quote?.price * 1.5 || 0,
        atl: quote?.price * 0.1 || 0,
        image: `https://assets.coingecko.com/coins/images/${index + 1}/large/${symbol.toLowerCase()}.png`,
        lastUpdated: quote?.last_updated || new Date().toISOString()
      };
    });
  };

  // 生成模拟数据
  const generateMockData = (symbols: string[]): CryptoData[] => {
    return symbols.map((symbol, index) => ({
      symbol: symbol.toUpperCase(),
      name: symbol,
      price: Math.random() * 1000 + 100,
      change24h: (Math.random() - 0.5) * 100,
      changePercent24h: (Math.random() - 0.5) * 10,
      volume24h: Math.random() * 1000000000,
      high24h: Math.random() * 1100 + 100,
      low24h: Math.random() * 900 + 50,
      marketCap: Math.random() * 100000000000,
      marketCapRank: index + 1,
      circulatingSupply: Math.random() * 1000000000,
      totalSupply: Math.random() * 1000000000,
      maxSupply: Math.random() * 1000000000,
      ath: Math.random() * 2000 + 200,
      atl: Math.random() * 10,
      image: `https://assets.coingecko.com/coins/images/${index + 1}/large/${symbol.toLowerCase()}.png`,
      lastUpdated: new Date().toISOString(),
      rsi: Math.random() * 100,
      ma20: Math.random() * 1000 + 100,
      ma50: Math.random() * 1000 + 100,
      support: Math.random() * 900 + 50,
      resistance: Math.random() * 1100 + 100
    }));
  };

  // 获取历史数据
  const fetchHistoricalData = async (symbol: string, days: number = 30): Promise<HistoricalData[]> => {
    if (config.provider === 'mock') {
      return generateMockHistoricalData(days);
    }

    setLoading(prev => ({ ...prev, historical: true }));
    
    try {
      // 实现历史数据获取逻辑
      const endpoint = config.endpoints?.historical?.replace('{id}', symbol.toLowerCase()) + `?vs_currency=usd&days=${days}`;
      const data = await makeAPIRequest(endpoint || '');
      
      return data.prices.map(([timestamp, price]: [number, number], index: number) => ({
        timestamp,
        price,
        volume: data.total_volumes?.[index]?.[1] || 0
      }));
    } catch (err) {
      console.error('获取历史数据失败:', err);
      return generateMockHistoricalData(days);
    } finally {
      setLoading(prev => ({ ...prev, historical: false }));
    }
  };

  // 生成模拟历史数据
  const generateMockHistoricalData = (days: number): HistoricalData[] => {
    const data: HistoricalData[] = [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    for (let i = days; i >= 0; i--) {
      data.push({
        timestamp: now - (i * dayMs),
        price: Math.random() * 1000 + 100,
        volume: Math.random() * 1000000
      });
    }
    
    return data;
  };

  // 获取新闻数据
  const fetchNews = async (query: string = 'cryptocurrency'): Promise<NewsData[]> => {
    setLoading(prev => ({ ...prev, news: true }));
    
    try {
      // 这里可以接入真实的新闻API
      return generateMockNews();
    } catch (err) {
      console.error('获取新闻失败:', err);
      return generateMockNews();
    } finally {
      setLoading(prev => ({ ...prev, news: false }));
    }
  };

  // 生成模拟新闻数据
  const generateMockNews = (): NewsData[] => {
    return [
      {
        title: "Bitcoin ETF Trading Volume Hits Record $3.2B Daily",
        description: "Institutional adoption reaches new heights as major funds increase crypto allocations",
        url: "#",
        imageUrl: "",
        publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        source: "CoinDesk Pro",
        sentiment: "bullish",
        impact: "high"
      },
      {
        title: "Ethereum Shanghai Upgrade Successfully Deployed",
        description: "Network improvements show positive results in transaction efficiency",
        url: "#",
        imageUrl: "",
        publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        source: "The Block",
        sentiment: "bullish",
        impact: "high"
      },
      {
        title: "Major Exchange Reports 200% Increase in DeFi Volume",
        description: "Decentralized finance continues rapid growth trajectory",
        url: "#",
        imageUrl: "",
        publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        source: "DeFiPulse",
        sentiment: "bullish",
        impact: "medium"
      }
    ];
  };

  // 更新配置
  const updateConfig = (newConfig: Partial<CryptoAPIConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
    
    toast({
      title: "API配置已更新",
      description: `已切换到 ${newConfig.provider || config.provider} 数据源`,
    });
  };

  // 测试API连接
  const testConnection = async (): Promise<boolean> => {
    try {
      await fetchCryptoPrices(['BTC']);
      toast({
        title: "连接成功",
        description: "API连接测试通过",
      });
      return true;
    } catch (err) {
      toast({
        title: "连接失败",
        description: "API连接测试失败，请检查配置",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    // 数据获取函数
    fetchCryptoPrices,
    fetchHistoricalData,
    fetchNews,
    
    // 配置管理
    config,
    updateConfig,
    testConnection,
    
    // 状态
    loading,
    error,
    rateLimitInfo,
    
    // 工具函数
    generateMockData,
    generateMockHistoricalData,
    generateMockNews
  };
};