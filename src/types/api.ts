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
  provider: 'openai' | 'claude' | 'perplexity';
  model: string;
  apiKey: string;
  enabled: boolean;
  temperature?: number;
  maxTokens?: number;
}