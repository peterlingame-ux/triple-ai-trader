// Centralized API types and interfaces

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

export interface NewsArticle {
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

export interface APIResponse<T> {
  data: T;
  error?: string;
  status: 'success' | 'error';
}

export interface BinanceConfig {
  apiKey: string;
  secretKey: string;
  testnet: boolean;
  isConfigured: boolean;
}

export interface AIModelConfig {
  provider: 'openai' | 'claude' | 'perplexity' | 'grok' | 'vitalik' | 'justin' | 'trump';
  model: string;
  apiKey: string;
  enabled: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface OpportunityAlert {
  id: string;
  symbol: string;
  type: 'price_chart' | 'technical_analysis' | 'news_sentiment' | 'blockchain' | 'defi' | 'policy' | 'comprehensive_analysis';
  confidence: number;
  signal: 'buy' | 'sell' | 'hold';
  price: number;
  timestamp: Date;
  analysis: {
    priceAnalysis?: string;
    technicalAnalysis?: string;
    sentimentAnalysis?: string;
    blockchainAnalysis?: string;
    defiAnalysis?: string;
    policyAnalysis?: string;
  };
  alerts: string[];
  tradingDetails?: {
    entry: number;
    stopLoss: number;
    takeProfit: number;
    position: string;
    reasoning: string;
    firstTakeProfit?: number;     // 第一止盈点
    secondTakeProfit?: number;    // 第二止盈点
    positionRatio?: number;       // 建议仓位比例(%)
    stopLossRequired?: boolean;   // 是否建议必须止损
    safetyFactor?: number;        // 安全系数(1-10)
    riskLevel?: 'low' | 'medium' | 'high'; // 风险等级
    leverage?: string;            // 建议杠杆倍数
    liquidationSafety?: number;   // 爆仓安全系数
    canAddPosition?: boolean;     // 是否可以补仓
    addPositionRange?: {          // 补仓价格区间 (只有在不必须止损时才有值)
      min: number;
      max: number;
    } | null;
  };
}

export interface TradingSignal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  price: number;
  confidence: number;
  timestamp: Date;
  source: string;
  reasoning: string;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: Date;
}

export interface TradingStats {
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  largestWin: number;
  largestLoss: number;
  avgWin: number;
  avgLoss: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitFactor: number;
}