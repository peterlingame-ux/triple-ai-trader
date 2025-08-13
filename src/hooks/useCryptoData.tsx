import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  time?: string; // For backward compatibility
}

const DEFAULT_SYMBOLS = [
  'BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'MATIC', 
  'BNB', 'XRP', 'DOGE', 'AVAX', 'LINK', 'UNI', 
  'LTC', 'ATOM', 'ICP', 'NEAR', 'APT', 'FTM',
  'ALGO', 'VET', 'XLM', 'FIL', 'MANA', 'SAND',
  'CRO', 'SHIB', 'LRC', 'ENJ', 'BAT', 'ZEC'
];

export const useCryptoData = (symbols: string[] = DEFAULT_SYMBOLS) => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      
      // Fetch real-time crypto data
      const response = await fetch('/functions/v1/crypto-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }

      const data = await response.json();
      setCryptoData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError('Failed to fetch real-time crypto data');
      
      // Fallback to mock data if API fails
      const mockData: CryptoData[] = symbols.map((symbol, index) => ({
        symbol,
        name: getTokenName(symbol),
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
        dominance: Math.random() * 5,
        rsi: Math.random() * 100,
        ma20: Math.random() * 1000 + 100,
        ma50: Math.random() * 1000 + 100,
        support: Math.random() * 900 + 50,
        resistance: Math.random() * 1100 + 100
      }));
      setCryptoData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsData = async () => {
    try {
      const response = await fetch('/functions/v1/crypto-news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch crypto news');
      }

      const data = await response.json();
      setNewsData(data);
    } catch (err) {
      console.error('Error fetching crypto news:', err);
      
      // Fallback mock news data with time property
      const mockNews: NewsArticle[] = [
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
      setNewsData(mockNews);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    fetchNewsData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchCryptoData();
    }, 30000);

    // Update news every 5 minutes
    const newsInterval = setInterval(() => {
      fetchNewsData();
    }, 300000);

    return () => {
      clearInterval(interval);
      clearInterval(newsInterval);
    };
  }, [symbols.join(',')]);

  const refreshData = () => {
    fetchCryptoData();
    fetchNewsData();
    toast({
      title: "Data Refreshed",
      description: "Latest crypto market data loaded",
    });
  };

  return {
    cryptoData,
    newsData,
    loading,
    error,
    refreshData,
  };
};

function getTokenName(symbol: string): string {
  const tokenNames: { [key: string]: string } = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'ADA': 'Cardano',
    'SOL': 'Solana',
    'DOT': 'Polkadot',
    'MATIC': 'Polygon',
    'BNB': 'Binance Coin',
    'XRP': 'Ripple',
    'DOGE': 'Dogecoin',
    'AVAX': 'Avalanche',
    'LINK': 'Chainlink',
    'UNI': 'Uniswap',
    'LTC': 'Litecoin',
    'ATOM': 'Cosmos',
    'ICP': 'Internet Computer',
    'NEAR': 'NEAR Protocol',
    'APT': 'Aptos',
    'FTM': 'Fantom',
    'ALGO': 'Algorand',
    'VET': 'VeChain',
    'XLM': 'Stellar',
    'FIL': 'Filecoin',
    'MANA': 'Decentraland',
    'SAND': 'The Sandbox',
    'CRO': 'Cronos',
    'SHIB': 'Shiba Inu',
    'LRC': 'Loopring',
    'ENJ': 'Enjin Coin',
    'BAT': 'Basic Attention Token',
    'ZEC': 'Zcash'
  };
  
  return tokenNames[symbol] || symbol;
}