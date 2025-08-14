import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

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
  source: { name: string };
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  time?: string;
}

// Top crypto symbols for better performance
const TOP_SYMBOLS = [
  "BTC", "ETH", "USDT", "BNB", "XRP", "USDC", "STETH", "ADA", "SOL", "DOGE",
  "TRX", "TON", "AVAX", "DOT", "MATIC", "SHIB", "LTC", "BCH", "LINK", "XLM",
  "UNI", "ATOM", "ETC", "HBAR", "FIL", "ICP", "CRO", "APT", "NEAR", "VET",
  "GRT", "ALGO", "QNT", "MANA", "SAND", "AAVE", "MKR", "LRC", "ENJ", "BAT",
  "PEPE", "BONK", "WIF", "FLOKI", "BABYDOGE", "OKB", "PENGU"
];

// Crypto name mapping for better maintainability
const CRYPTO_NAMES = {
  "BTC": { name: "Bitcoin", cn: "比特币" },
  "ETH": { name: "Ethereum", cn: "以太坊" },
  "USDT": { name: "Tether", cn: "泰达币" },
  "BNB": { name: "Binance Coin", cn: "币安币" },
  "XRP": { name: "Ripple", cn: "瑞波币" },
  "USDC": { name: "USD Coin", cn: "美元币" },
  "STETH": { name: "Staked Ether", cn: "质押以太坊" },
  "ADA": { name: "Cardano", cn: "卡尔达诺" },
  "SOL": { name: "Solana", cn: "索拉纳" },
  "DOGE": { name: "Dogecoin", cn: "狗狗币" },
  "TRX": { name: "TRON", cn: "波场" },
  "TON": { name: "Toncoin", cn: "Ton币" },
  "AVAX": { name: "Avalanche", cn: "雪崩协议" },
  "DOT": { name: "Polkadot", cn: "波卡" },
  "MATIC": { name: "Polygon", cn: "马蹄链" },
  "SHIB": { name: "Shiba Inu", cn: "柴犬币" },
  "LTC": { name: "Litecoin", cn: "莱特币" },
  "BCH": { name: "Bitcoin Cash", cn: "比特币现金" },
  "LINK": { name: "Chainlink", cn: "链环" },
  "XLM": { name: "Stellar", cn: "恒星币" },
  "UNI": { name: "Uniswap", cn: "Uniswap" },
  "ATOM": { name: "Cosmos", cn: "宇宙币" },
  "ETC": { name: "Ethereum Classic", cn: "以太经典" },
  "HBAR": { name: "Hedera", cn: "哈希图" },
  "FIL": { name: "Filecoin", cn: "文件币" },
  "ICP": { name: "Internet Computer", cn: "互联网计算机" },
  "CRO": { name: "Cronos", cn: "Cronos" },
  "APT": { name: "Aptos", cn: "Aptos" },
  "NEAR": { name: "NEAR Protocol", cn: "NEAR协议" },
  "VET": { name: "VeChain", cn: "唯链" },
  "GRT": { name: "The Graph", cn: "图协议" },
  "ALGO": { name: "Algorand", cn: "算法币" },
  "QNT": { name: "Quant", cn: "量子链" },
  "MANA": { name: "Decentraland", cn: "虚拟世界" },
  "SAND": { name: "The Sandbox", cn: "沙盒" },
  "AAVE": { name: "Aave", cn: "Aave" },
  "MKR": { name: "Maker", cn: "制造者" },
  "LRC": { name: "Loopring", cn: "路印协议" },
  "ENJ": { name: "Enjin Coin", cn: "恩金币" },
  "BAT": { name: "Basic Attention Token", cn: "注意力币" },
  "PEPE": { name: "Pepe", cn: "佩佩币" },
  "BONK": { name: "Bonk", cn: "Bonk" },
  "WIF": { name: "dogwifhat", cn: "戴帽狗" },
  "FLOKI": { name: "FLOKI", cn: "弗洛基" },
  "BABYDOGE": { name: "Baby Doge Coin", cn: "小狗币" },
  "OKB": { name: "OKB", cn: "欧易币" },
  "PENGU": { name: "Pudgy Penguins", cn: "胖企鹅" }
} as const;

// Base prices for realistic mock data
const BASE_PRICES: Record<string, number> = {
  'BTC': 43000, 'ETH': 2500, 'USDT': 1.0, 'USDC': 1.0, 'BNB': 300,
  'XRP': 0.6, 'ADA': 0.5, 'SOL': 100, 'DOGE': 0.08, 'MATIC': 0.9,
  'DOT': 7, 'AVAX': 35, 'LINK': 14, 'LTC': 70, 'UNI': 6,
  'ATOM': 8, 'ICP': 5, 'NEAR': 2, 'APT': 9, 'OKB': 45, 'PENGU': 0.035
};

// Utility function to get token name
const getTokenName = (symbol: string): string => {
  return CRYPTO_NAMES[symbol as keyof typeof CRYPTO_NAMES]?.name || symbol;
};

// Optimized data generation
const generateCryptoData = (symbols: string[]): CryptoData[] => {
  return symbols.map((symbol, index) => {
    const basePrice = BASE_PRICES[symbol] || (Math.random() * 10 + 1);
    const currentPrice = basePrice * (0.95 + Math.random() * 0.1);
    const change24hPercent = (Math.random() - 0.5) * 8;
    const yesterdayPrice = currentPrice / (1 + change24hPercent / 100);
    const high24h = Math.max(currentPrice, yesterdayPrice) * (1 + Math.random() * 0.03);
    const low24h = Math.min(currentPrice, yesterdayPrice) * (1 - Math.random() * 0.03);
    const change24h = currentPrice - yesterdayPrice;
    const rsi = 30 + Math.random() * 40;

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
      ma20: Math.round(currentPrice * (0.98 + Math.random() * 0.04) * 100000) / 100000,
      ma50: Math.round(currentPrice * (0.96 + Math.random() * 0.08) * 100000) / 100000,
      support: Math.round(low24h * 0.98 * 100000) / 100000,
      resistance: Math.round(high24h * 1.02 * 100000) / 100000
    };
  });
};

export const useOptimizedCrypto = (symbols: string[] = TOP_SYMBOLS) => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(() => generateCryptoData(symbols));
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const { toast } = useToast();

  // Memoized news generation
  const generateNews = useMemo(() => {
    if (language === 'zh') {
      return [
        {
          title: "比特币ETF日交易量创纪录达32亿美元",
          description: "机构采用达到新高度",
          url: "#",
          urlToImage: "",
          publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          source: { name: "CoinDesk Pro" },
          sentiment: "bullish" as const,
          impact: "high" as const,
          time: "30 min ago"
        },
        {
          title: "以太坊上海升级成功部署",
          description: "网络改进显示积极成果",
          url: "#",
          urlToImage: "",
          publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          source: { name: "The Block" },
          sentiment: "bullish" as const,
          impact: "high" as const,
          time: "1 hour ago"
        },
        {
          title: "主要交易所报告DeFi交易量增长200%",
          description: "去中心化金融继续快速增长",
          url: "#",
          urlToImage: "",
          publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
          source: { name: "DeFiPulse" },
          sentiment: "bullish" as const,
          impact: "medium" as const,
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
        sentiment: "bullish" as const,
        impact: "high" as const,
        time: "30 min ago"
      },
      {
        title: "Ethereum Shanghai Upgrade Successfully Deployed",
        description: "Network improvements show positive results",
        url: "#",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        source: { name: "The Block" },
        sentiment: "bullish" as const,
        impact: "high" as const,
        time: "1 hour ago"
      },
      {
        title: "Major Exchange Reports 200% Increase in DeFi Volume",
        description: "Decentralized finance continues rapid growth",
        url: "#",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        source: { name: "DeFiPulse" },
        sentiment: "bullish" as const,
        impact: "medium" as const,
        time: "2 hours ago"
      }
    ];
  }, [language]);

  // Update news when language changes
  useEffect(() => {
    setNewsData(generateNews);
  }, [generateNews]);

  // Optimized refresh function
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate API call with fallback to mock data
      const response = await fetch('/functions/v1/crypto-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols }),
      });

      if (response.ok) {
        const apiData = await response.json();
        setCryptoData(apiData);
        setError(null);
        toast({
          title: "数据已更新",
          description: "加密货币价格数据已刷新",
        });
      } else {
        throw new Error(`API响应错误: ${response.status}`);
      }
    } catch (err) {
      console.log('使用模拟数据，API接口预留供后期接入真实数据');
      setCryptoData(generateCryptoData(symbols));
      setError('使用模拟数据模式');
    } finally {
      setLoading(false);
    }
  }, [symbols, toast]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        setCryptoData(generateCryptoData(symbols));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, symbols]);

  return {
    cryptoData,
    newsData,
    loading,
    error,
    refreshData
  };
};

// Filter function for crypto search
export const filterCryptoData = (data: CryptoData[], query: string) => {
  if (!query) return data;
  
  const searchQuery = query.toLowerCase();
  return data.filter(crypto => 
    crypto.symbol.toLowerCase().includes(searchQuery) ||
    crypto.name.toLowerCase().includes(searchQuery)
  );
};