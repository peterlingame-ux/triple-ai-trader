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

// 扩展的加密货币符号列表 - 包含top 100
const DEFAULT_SYMBOLS = [
  // Top 10
  "BTC", "ETH", "USDT", "BNB", "XRP", "USDC", "STETH", "ADA", "SOL", "DOGE",
  // Top 11-30
  "TRX", "TON", "AVAX", "DOT", "MATIC", "SHIB", "LTC", "BCH", "LINK", "XLM",
  "UNI", "ATOM", "ETC", "HBAR", "FIL", "ICP", "CRO", "APT", "NEAR", "VET",
  // Top 31-60
  "GRT", "ALGO", "QNT", "MANA", "SAND", "AAVE", "MKR", "LRC", "ENJ", "BAT",
  "ZEC", "COMP", "YFI", "SNX", "1INCH", "REN", "KNC", "CRV", "UMA", "BAL",
  // Top 61-100
  "SUSHI", "FTM", "FLOW", "EGLD", "ONE", "HIVE", "THETA", "TFUEL", "KAVA", "BAND",
  "RVN", "ZIL", "ICX", "ONT", "QTUM", "WAVES", "SC", "DGB", "LSK", "ARK",
  "NANO", "IOST", "ZEN", "MAID", "REP", "KMD", "DCR", "STRAT", "NXT", "SYS",
  // 新兴和热门币种
  "PEPE", "BONK", "WIF", "FLOKI", "BABYDOGE", "SAFE", "MEME", "WOJAK", "TURBO", "LADYS", "TRUMP"
];

// 加密货币名称映射（中英文）
const CRYPTO_NAMES = {
  // Top 10
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
  // Top 11-30
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
  // 其他币种...
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
  "ZEC": { name: "Zcash", cn: "零币" },
  "COMP": { name: "Compound", cn: "复合币" },
  "YFI": { name: "yearn.finance", cn: "渴望金融" },
  "SNX": { name: "Synthetix", cn: "合成资产" },
  "1INCH": { name: "1inch", cn: "1inch" },
  "REN": { name: "Ren", cn: "任币" },
  "KNC": { name: "Kyber Network", cn: "凯伯网络" },
  "CRV": { name: "Curve DAO Token", cn: "曲线" },
  "UMA": { name: "UMA", cn: "通用市场准入" },
  "BAL": { name: "Balancer", cn: "平衡器" },
  "SUSHI": { name: "SushiSwap", cn: "寿司" },
  "FTM": { name: "Fantom", cn: "幻影币" },
  "FLOW": { name: "Flow", cn: "Flow" },
  "EGLD": { name: "MultiversX", cn: "多元宇宙" },
  "ONE": { name: "Harmony", cn: "和谐币" },
  "HIVE": { name: "Hive", cn: "蜂巢币" },
  "THETA": { name: "Theta Network", cn: "Theta网络" },
  "TFUEL": { name: "Theta Fuel", cn: "Theta燃料" },
  "KAVA": { name: "Kava", cn: "Kava" },
  "BAND": { name: "Band Protocol", cn: "Band协议" },
  "RVN": { name: "Ravencoin", cn: "渡鸦币" },
  "ZIL": { name: "Zilliqa", cn: "Zilliqa" },
  "ICX": { name: "ICON", cn: "图标" },
  "ONT": { name: "Ontology", cn: "本体" },
  "QTUM": { name: "Qtum", cn: "量子链" },
  "WAVES": { name: "Waves", cn: "波浪币" },
  "SC": { name: "Siacoin", cn: "云储币" },
  "DGB": { name: "DigiByte", cn: "极特币" },
  "LSK": { name: "Lisk", cn: "应用链" },
  "ARK": { name: "Ark", cn: "方舟币" },
  "NANO": { name: "Nano", cn: "纳诺币" },
  "IOST": { name: "IOST", cn: "IOST" },
  "ZEN": { name: "Horizen", cn: "ZEN" },
  "MAID": { name: "MaidSafeCoin", cn: "安全网络币" },
  "REP": { name: "Augur", cn: "预测市场" },
  "KMD": { name: "Komodo", cn: "科莫多币" },
  "DCR": { name: "Decred", cn: "德信币" },
  "STRAT": { name: "Stratis", cn: "斯特拉迪斯" },
  "NXT": { name: "NXT", cn: "未来币" },
  "SYS": { name: "Syscoin", cn: "系统币" },
  // Meme coins
  "PEPE": { name: "Pepe", cn: "佩佩币" },
  "BONK": { name: "Bonk", cn: "Bonk" },
  "WIF": { name: "dogwifhat", cn: "戴帽狗" },
  "FLOKI": { name: "FLOKI", cn: "弗洛基" },
  "BABYDOGE": { name: "Baby Doge Coin", cn: "小狗币" },
  "SAFE": { name: "SafeMoon", cn: "安全月球" },
  "MEME": { name: "Memecoin", cn: "模因币" },
  "WOJAK": { name: "Wojak", cn: "沃伊扎克" },
  "TURBO": { name: "Turbo", cn: "涡轮币" },
  "LADYS": { name: "Milady", cn: "女士币" },
  "TRUMP": { name: "TrumpCoin", cn: "特朗普币" }
};

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

// 搜索过滤函数
export const filterCryptoData = (data: CryptoData[], searchQuery: string): CryptoData[] => {
  if (!searchQuery.trim()) return data;
  
  const query = searchQuery.toLowerCase();
  
  return data.filter(crypto => {
    const symbol = crypto.symbol.toLowerCase();
    const name = getTokenName(crypto.symbol).toLowerCase();
    const chineseName = getTokenChineseName(crypto.symbol).toLowerCase();
    
    return symbol.includes(query) || 
           name.includes(query) || 
           chineseName.includes(query);
  });
};

// 获取所有支持的加密货币列表
export const getAllSupportedCryptos = (): Array<{symbol: string, name: string, chineseName: string}> => {
  return DEFAULT_SYMBOLS.map(symbol => ({
    symbol,
    name: getTokenName(symbol),
    chineseName: getTokenChineseName(symbol)
  }));
};
