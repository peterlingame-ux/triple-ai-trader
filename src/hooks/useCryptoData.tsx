import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { DEFAULT_SYMBOLS, CRYPTO_NAMES } from '@/constants/crypto';

interface CryptoData {
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
  totalSupply: number;
  maxSupply: number;
  ath: number;
  atl: number;
  image: string;
  dominance: number;
  rsi: number;
  ma20: number;
  ma50: number;
  support: number;
  resistance: number;
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  time?: string;
}

export const useCryptoData = (symbols: string[] = DEFAULT_SYMBOLS) => {
  // Memoize symbols to prevent unnecessary re-renders
  const memoizedSymbols = useMemo(() => symbols, [symbols.join(',')]);
  
  // Initialize with mock data immediately to avoid blank page
  const generateMockData = useCallback((symbols: string[]): CryptoData[] => {
    return symbols.map((symbol, index) => {
      // 为不同加密货币设置合理的基础价格
      const basePrices: Record<string, number> = {
        'BTC': 115000, 'ETH': 4200, 'USDT': 1.0, 'USDC': 1.0, 'BNB': 838,
        'XRP': 3.2, 'ADA': 1.1, 'SOL': 200, 'DOGE': 0.32, 'AVAX': 55,
        'DOT': 8.5, 'MATIC': 0.95, 'LINK': 25, 'LTC': 120, 'UNI': 15,
        'ATOM': 12, 'ICP': 15, 'NEAR': 6.8, 'APT': 14, 'FTM': 0.85,
        'OKB': 60, 'PENGU': 0.035, 'PEPE': 0.000018, 'BONK': 0.000045
      };
      
      const basePrice = basePrices[symbol] || (Math.random() * 10 + 1);
      const currentPrice = basePrice * (0.95 + Math.random() * 0.1);
      
      const change24hPercent = (Math.random() - 0.5) * 8;
      const yesterdayPrice = currentPrice / (1 + change24hPercent / 100);
      
      const high24h = Math.max(currentPrice, yesterdayPrice) * (1 + Math.random() * 0.03);
      const low24h = Math.min(currentPrice, yesterdayPrice) * (1 - Math.random() * 0.03);
      const change24h = currentPrice - yesterdayPrice;
      
      const rsi = 30 + Math.random() * 40;
      const ma20 = currentPrice * (0.98 + Math.random() * 0.04);
      const ma50 = currentPrice * (0.96 + Math.random() * 0.08);
      
      return {
        symbol,
        name: getTokenName(symbol),
        price: Math.round(currentPrice * 100000) / 100000,
        change24h: Math.round(change24h * 100) / 100,
        changePercent24h: Math.round(change24hPercent * 100) / 100,
        volume24h: Math.round(Math.random() * 1000000000),
        high24h: Math.round(high24h * 100000) / 100000,
        low24h: Math.round(low24h * 100000) / 100000,
        marketCap: Math.round(currentPrice * (Math.random() * 100000000 + 10000000)),
        marketCapRank: index + 1,
        circulatingSupply: Math.round(Math.random() * 1000000000),
        totalSupply: Math.round(Math.random() * 1000000000),
        maxSupply: Math.round(Math.random() * 1000000000),
        ath: Math.round(currentPrice * (1.5 + Math.random() * 2) * 100000) / 100000,
        atl: Math.round(currentPrice * (0.1 + Math.random() * 0.3) * 100000) / 100000,
        image: `https://assets.coingecko.com/coins/images/${index + 1}/large/${symbol.toLowerCase()}.png`,
        dominance: Math.round((symbol === 'BTC' ? 40 + Math.random() * 10 : Math.random() * 5) * 100) / 100,
        rsi: Math.round(rsi * 100) / 100,
        ma20: Math.round(ma20 * 100000) / 100000,
        ma50: Math.round(ma50 * 100000) / 100000,
        support: Math.round(low24h * 0.98 * 100000) / 100000,
        resistance: Math.round(high24h * 1.02 * 100000) / 100000
      };
    });
  }, []);

  const [cryptoData, setCryptoData] = useState<CryptoData[]>(() => generateMockData(memoizedSymbols));
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  const generateMockNews = useCallback((): NewsArticle[] => {
    if (language === 'zh') {
      return [
        {
          title: "比特币ETF日交易量创纪录达32亿美元",
          description: "机构采用达到新高度",
          url: "#",
          urlToImage: "",
          publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          source: { name: "CoinDesk Pro" },
          sentiment: "bullish",
          impact: "high",
          time: "30 min ago"
        },
        {
          title: "以太坊上海升级成功部署",
          description: "网络改进显示积极成果",
          url: "#",
          urlToImage: "",
          publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          source: { name: "The Block" },
          sentiment: "bullish",
          impact: "high",
          time: "1 hour ago"
        },
        {
          title: "主要交易所报告DeFi交易量增长200%",
          description: "去中心化金融继续快速增长",
          url: "#",
          urlToImage: "",
          publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
          source: { name: "DeFiPulse" },
          sentiment: "bullish",
          impact: "medium",
          time: "2 hours ago"
        }
      ];
    }
    
    return [
      {
        title: "Bitcoin ETF Trading Volume Hits Record $3.2B Daily",
        description: "Institutional adoption reaches new heights",
        url: "#",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        source: { name: "CoinDesk Pro" },
        sentiment: "bullish",
        impact: "high",
        time: "30 min ago"
      },
      {
        title: "Ethereum Shanghai Upgrade Successfully Deployed",
        description: "Network improvements show positive results",
        url: "#",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        source: { name: "The Block" },
        sentiment: "bullish",
        impact: "high",
        time: "1 hour ago"
      },
      {
        title: "Major Exchange Reports 200% Increase in DeFi Volume",
        description: "Decentralized finance continues rapid growth",
        url: "#",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        source: { name: "DeFiPulse" },
        sentiment: "bullish",
        impact: "medium",
        time: "2 hours ago"
      }
    ];
  }, [language]);
  
  // 获取币安API配置
  const getBinanceConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'get',
          service: 'binance_api_config' 
        }
      });

      if (error) {
        return { isConfigured: false };
      }

      return { 
        isConfigured: data?.success || false,
        apiKey: data?.config?.apiKey,
        secretKey: data?.config?.secretKey,
        testnet: data?.config?.testnet || false
      };
    } catch (error) {
      console.error('获取币安配置失败:', error);
      return { isConfigured: false };
    }
  }, []);

  const fetchFromBinanceAPI = useCallback(async (config: any): Promise<CryptoData[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('binance-api', {
        body: {
          symbols: memoizedSymbols,
          apiKey: config.apiKey,
          secretKey: config.secretKey,
          testnet: config.testnet || false
        }
      });

      if (error) {
        throw new Error(`Binance API error: ${error.message}`);
      }

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format from Binance API');
      }

      const convertedData: CryptoData[] = data.map((item: any, index: number) => {
        const symbol = item.symbol;
        const price = parseFloat(item.price) || 0;
        const priceChange = parseFloat(item.priceChange) || 0;
        const priceChangePercent = parseFloat(item.priceChangePercent) || 0;
        const high24h = parseFloat(item.highPrice) || 0;
        const low24h = parseFloat(item.lowPrice) || 0;
        const volume24h = parseFloat(item.volume) || 0;
        
        const rsi = 50 + (priceChangePercent * 2);
        const ma20 = price * (1 - priceChangePercent / 200);
        const ma50 = price * (1 - priceChangePercent / 400);
        
        return {
          symbol,
          name: getTokenName(symbol),
          price: Math.round(price * 100000) / 100000,
          change24h: Math.round(priceChange * 100) / 100,
          changePercent24h: Math.round(priceChangePercent * 100) / 100,
          volume24h: Math.round(volume24h),
          high24h: Math.round(high24h * 100000) / 100000,
          low24h: Math.round(low24h * 100000) / 100000,
          marketCap: Math.round(price * (Math.random() * 100000000 + 10000000)),
          marketCapRank: index + 1,
          circulatingSupply: Math.round(Math.random() * 1000000000),
          totalSupply: Math.round(Math.random() * 1000000000),
          maxSupply: Math.round(Math.random() * 1000000000),
          ath: Math.round(price * (1.5 + Math.random() * 2) * 100000) / 100000,
          atl: Math.round(price * (0.1 + Math.random() * 0.3) * 100000) / 100000,
          image: `https://assets.coingecko.com/coins/images/${index + 1}/large/${symbol.toLowerCase()}.png`,
          dominance: Math.round((symbol === 'BTC' ? 40 + Math.random() * 10 : Math.random() * 5) * 100) / 100,
          rsi: Math.round(Math.max(0, Math.min(100, rsi)) * 100) / 100,
          ma20: Math.round(ma20 * 100000) / 100000,
          ma50: Math.round(ma50 * 100000) / 100000,
          support: Math.round(low24h * 0.98 * 100000) / 100000,
          resistance: Math.round(high24h * 1.02 * 100000) / 100000
        };
      });

      return convertedData;
    } catch (error) {
      console.error('币安API调用失败:', error);
      throw error;
    }
  }, [memoizedSymbols]);
  
  const fetchCryptoData = useCallback(async (showToast = true) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('检查币安API配置...');
      const binanceConfig = await getBinanceConfig();
      console.log('币安配置结果:', binanceConfig);
      
      if (binanceConfig.isConfigured) {
        try {
          console.log('使用币安API获取数据...');
          const binanceData = await fetchFromBinanceAPI(binanceConfig);
          if (binanceData.length > 0) {
            console.log('币安API数据获取成功，条数:', binanceData.length);
            setCryptoData(binanceData);
            setIsRealTimeEnabled(true);
            if (showToast) {
              toast({
                title: "实时数据已连接",
                description: `使用币安API获取 ${binanceData.length} 种货币实时数据`,
              });
            }
            return;
          }
        } catch (binanceError) {
          console.error('币安API调用失败:', binanceError);
          setIsRealTimeEnabled(false);
          console.log('回退到模拟数据');
        }
      } else {
        console.log('币安API未配置，使用模拟数据');
        setIsRealTimeEnabled(false);
      }
      
      const mockData = generateMockData(memoizedSymbols);
      setCryptoData(mockData);
      
    } catch (error) {
      console.error('获取加密货币数据失败:', error);
      setError('Failed to fetch crypto data');
      setIsRealTimeEnabled(false);
      
      const mockData = generateMockData(memoizedSymbols);
      setCryptoData(mockData);
      
      if (showToast) {
        toast({
          title: "连接失败",
          description: "使用演示数据",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [memoizedSymbols, getBinanceConfig, fetchFromBinanceAPI, generateMockData, toast]);
  
  // Initial data fetch
  useEffect(() => {
    fetchCryptoData(true);
  }, [memoizedSymbols]);
  
  // 自动刷新实时数据
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRealTimeEnabled) {
      // 每5秒自动刷新数据，让变化更明显
      interval = setInterval(() => {
        fetchCryptoData(false);
      }, 5000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRealTimeEnabled, fetchCryptoData]);
  
  // Language change effect
  useEffect(() => {
    setNewsData(generateMockNews());
  }, [generateMockNews]);

  const refreshData = useCallback(() => {
    fetchCryptoData(true);
  }, [fetchCryptoData]);

  return {
    cryptoData,
    newsData,
    loading,
    error,
    refreshData,
    isRealTimeEnabled
  };
};

// 获取代币全名的辅助函数
export const getTokenName = (symbol: string): string => {
  const tokenInfo = CRYPTO_NAMES[symbol as keyof typeof CRYPTO_NAMES];
  return tokenInfo?.name || symbol;
};

// 获取代币中文名的辅助函数
export const getTokenChineseName = (symbol: string): string => {
  const tokenInfo = CRYPTO_NAMES[symbol as keyof typeof CRYPTO_NAMES];
  return tokenInfo?.cn || symbol;
};

// 过滤加密货币数据的辅助函数
export const filterCryptoData = (data: CryptoData[], searchQuery: string): CryptoData[] => {
  if (!searchQuery.trim()) return data;
  
  const query = searchQuery.toLowerCase().trim();
  return data.filter(crypto => 
    crypto.symbol.toLowerCase().includes(query) ||
    crypto.name.toLowerCase().includes(query) ||
    getTokenChineseName(crypto.symbol).toLowerCase().includes(query)
  );
};

// 获取所有支持的加密货币
export const getAllSupportedCryptos = () => {
  return DEFAULT_SYMBOLS.map(symbol => ({
    symbol,
    name: getTokenName(symbol),
    chineseName: getTokenChineseName(symbol)
  }));
};