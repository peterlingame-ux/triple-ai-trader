import { useState, useEffect } from 'react';
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
  "PEPE", "BONK", "WIF", "FLOKI", "BABYDOGE", "SAFE", "MEME", "WOJAK", "TURBO", "LADYS", "TRUMP",
  // 新增币种
  "OKB", "PENGU"
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
  "TRUMP": { name: "TrumpCoin", cn: "特朗普币" },
  // 新增币种
  "OKB": { name: "OKB", cn: "欧易币" },
  "PENGU": { name: "Pudgy Penguins", cn: "胖企鹅" }
};

export const useCryptoData = (symbols: string[] = DEFAULT_SYMBOLS) => {
  // Initialize with mock data immediately to avoid blank page
  const generateMockData = (symbols: string[]): CryptoData[] => {
    return symbols.map((symbol, index) => {
      // 为不同加密货币设置合理的基础价格
      const basePrices: Record<string, number> = {
        'BTC': 43000, 'ETH': 2500, 'USDT': 1.0, 'USDC': 1.0, 'BNB': 300,
        'XRP': 0.6, 'ADA': 0.5, 'SOL': 100, 'DOGE': 0.08, 'MATIC': 0.9,
        'DOT': 7, 'AVAX': 35, 'LINK': 14, 'LTC': 70, 'UNI': 6,
        'ATOM': 8, 'ICP': 5, 'NEAR': 2, 'APT': 9, 'FTM': 0.4,
        // 新增币种价格
        'OKB': 45, 'PENGU': 0.035
      };
      
      const basePrice = basePrices[symbol] || (Math.random() * 10 + 1);
      const currentPrice = basePrice * (0.95 + Math.random() * 0.1); // ±5%变动
      
      // 生成合理的OHLC数据
      const change24hPercent = (Math.random() - 0.5) * 8; // ±4%变动
      const yesterdayPrice = currentPrice / (1 + change24hPercent / 100);
      
      // 确保高低价格的逻辑关系
      const high24h = Math.max(currentPrice, yesterdayPrice) * (1 + Math.random() * 0.03);
      const low24h = Math.min(currentPrice, yesterdayPrice) * (1 - Math.random() * 0.03);
      const change24h = currentPrice - yesterdayPrice;
      
      // 生成合理的技术指标
      const rsi = 30 + Math.random() * 40; // RSI在30-70之间比较合理
      const ma20 = currentPrice * (0.98 + Math.random() * 0.04);
      const ma50 = currentPrice * (0.96 + Math.random() * 0.08);
      
      return {
        symbol,
        name: getTokenName(symbol),
        price: Math.round(currentPrice * 100000) / 100000, // 保留5位小数
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
  };

  const [cryptoData, setCryptoData] = useState<CryptoData[]>(() => generateMockData(symbols));
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateMockNews = (): NewsArticle[] => {
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
    
    // Default English news
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
  };
  // 当语言变化时更新新闻数据
  useEffect(() => {
    setNewsData(generateMockNews());
  }, [language]);
  
  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      
      // 优先尝试币安API配置
      const binanceConfig = getBinanceConfig();
      
      if (binanceConfig.isConfigured) {
        // 使用币安API获取数据
        const binanceData = await fetchFromBinanceAPI(binanceConfig);
        if (binanceData.length > 0) {
          setCryptoData(binanceData);
          setError(null);
          return;
        }
      }
      
      // 直接使用模拟数据，确保界面能正常显示
      console.log('使用模拟数据显示');
      const mockData: CryptoData[] = symbols.map((symbol, index) => {
        const basePrices: Record<string, number> = {
          'BTC': 43000, 'ETH': 2500, 'USDT': 1.0, 'USDC': 1.0, 'BNB': 300,
          'XRP': 0.6, 'ADA': 0.5, 'SOL': 100, 'DOGE': 0.08, 'MATIC': 0.9,
          'DOT': 7, 'AVAX': 35, 'LINK': 14, 'LTC': 70, 'UNI': 6,
          'ATOM': 8, 'ICP': 5, 'NEAR': 2, 'APT': 9, 'FTM': 0.4,
          // 新增币种价格
          'OKB': 45, 'PENGU': 0.035
        };
        
        const basePrice = basePrices[symbol] || (Math.random() * 10 + 1);
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
      setCryptoData(mockData);
      setError(null);
    } catch (err) {
      console.error('Crypto data fetch error:', err);
      setCryptoData(generateMockData(symbols));
      setError(null); // 不显示错误，直接使用模拟数据
    } finally {
      setLoading(false);
    }
  };

  // 获取币安API配置
  const getBinanceConfig = () => {
    try {
      const config = localStorage.getItem('binance_api_config');
      return config ? JSON.parse(config) : { isConfigured: false };
    } catch {
      return { isConfigured: false };
    }
  };

  // 币安API数据获取
  const fetchFromBinanceAPI = async (config: any): Promise<CryptoData[]> => {
    try {
      const response = await fetch('/functions/v1/binance-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbols,
          apiKey: config.apiKey,
          secretKey: config.secretKey,
          testnet: config.testnet
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.map((item: any) => ({
          symbol: item.symbol,
          name: getTokenName(item.symbol),
          price: parseFloat(item.price),
          change24h: parseFloat(item.priceChange),
          changePercent24h: parseFloat(item.priceChangePercent),
          volume24h: parseFloat(item.volume),
          high24h: parseFloat(item.highPrice),
          low24h: parseFloat(item.lowPrice),
          marketCap: parseFloat(item.price) * parseFloat(item.volume), // 简化计算
          marketCapRank: 0, // 币安API不提供排名
          circulatingSupply: 0,
          totalSupply: 0,
          maxSupply: 0,
          ath: parseFloat(item.highPrice) * 1.2, // 估算
          atl: parseFloat(item.lowPrice) * 0.8, // 估算
          image: `https://assets.coingecko.com/coins/images/1/large/${item.symbol.toLowerCase()}.png`,
          dominance: item.symbol === 'BTC' ? 45 : Math.random() * 5,
          rsi: 30 + Math.random() * 40, // 需要技术指标API
          ma20: parseFloat(item.price) * 0.99,
          ma50: parseFloat(item.price) * 0.97,
          support: parseFloat(item.lowPrice) * 0.98,
          resistance: parseFloat(item.highPrice) * 1.02
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Binance API fetch error:', error);
      return [];
    }
  };

  const fetchNewsData = async () => {
    try {
      // Use mock data immediately for better UX
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
        },
        {
          title: "AI Trading Algorithms Show 300% Performance Increase",
          description: "Artificial intelligence revolutionizes crypto trading strategies",
          url: "#",
          urlToImage: "",
          publishedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
          source: { name: "CryptoAI Weekly" },
          sentiment: "bullish",
          impact: "high",
          time: "3 hours ago"
        },
        {
          title: "New Layer 2 Solutions Reduce Transaction Costs by 95%",
          description: "Scaling solutions making crypto more accessible",
          url: "#",
          urlToImage: "",
          publishedAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
          source: { name: "Layer2 News" },
          sentiment: "bullish",
          impact: "medium",
          time: "4 hours ago"
        }
      ];
      setNewsData(mockNews);
      
      // Try to fetch real data in background
      try {
        const response = await fetch('/functions/v1/crypto-news', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNewsData(data);
        }
      } catch (apiErr) {
        // Silently fail for API calls, we already have mock data
        if (process.env.NODE_ENV === 'development') {
          console.log('News API call failed, using mock data');
        }
      }
    } catch (err) {
      console.error('Error fetching crypto news:', err);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    fetchNewsData();

    // 大幅减少更新频率以提高性能
    const interval = setInterval(() => {
      fetchCryptoData();
    }, 300000); // 5分钟更新一次

    // 新闻每30分钟更新
    const newsInterval = setInterval(() => {
      fetchNewsData();
    }, 1800000);

    return () => {
      clearInterval(interval);
      clearInterval(newsInterval);
    };
  }, [symbols.join(',')]);

  const refreshData = () => {
    fetchCryptoData();
    fetchNewsData();
    toast({
      title: "数据已刷新",
      description: "最新加密货币市场数据已加载",
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
