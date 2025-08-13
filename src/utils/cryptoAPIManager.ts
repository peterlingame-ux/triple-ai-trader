/**
 * 加密货币API管理器
 * 用于管理和切换不同的加密货币数据源
 */

export type APIProvider = 'coingecko' | 'binance' | 'coinmarketcap' | 'mock';

export interface APIConfig {
  provider: APIProvider;
  apiKey?: string;
  baseUrl?: string;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

export interface CryptoAPIResponse {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

// API配置预设
export const API_CONFIGS: Record<APIProvider, APIConfig> = {
  coingecko: {
    provider: 'coingecko',
    baseUrl: 'https://api.coingecko.com/api/v3',
    rateLimits: {
      requestsPerMinute: 10,
      requestsPerHour: 1000
    }
  },
  binance: {
    provider: 'binance',
    baseUrl: 'https://api.binance.com/api/v3',
    rateLimits: {
      requestsPerMinute: 1200,
      requestsPerHour: 6000
    }
  },
  coinmarketcap: {
    provider: 'coinmarketcap',
    baseUrl: 'https://pro-api.coinmarketcap.com/v1',
    rateLimits: {
      requestsPerMinute: 30,
      requestsPerHour: 1000
    }
  },
  mock: {
    provider: 'mock',
    baseUrl: '',
    rateLimits: {
      requestsPerMinute: 1000,
      requestsPerHour: 10000
    }
  }
};

export class CryptoAPIManager {
  private config: APIConfig;
  private requestCount: {
    minute: number;
    hour: number;
    lastMinuteReset: number;
    lastHourReset: number;
  };

  constructor(provider: APIProvider = 'mock', apiKey?: string) {
    this.config = {
      ...API_CONFIGS[provider],
      apiKey
    };
    
    this.requestCount = {
      minute: 0,
      hour: 0,
      lastMinuteReset: Math.floor(Date.now() / 60000),
      lastHourReset: Math.floor(Date.now() / 3600000)
    };
  }

  // 切换API提供商
  setProvider(provider: APIProvider, apiKey?: string) {
    this.config = {
      ...API_CONFIGS[provider],
      apiKey
    };
    
    console.log(`已切换到 ${provider} API提供商`);
  }

  // 检查请求限制
  private checkRateLimit(): boolean {
    const currentMinute = Math.floor(Date.now() / 60000);
    const currentHour = Math.floor(Date.now() / 3600000);

    // 重置分钟计数器
    if (currentMinute !== this.requestCount.lastMinuteReset) {
      this.requestCount.minute = 0;
      this.requestCount.lastMinuteReset = currentMinute;
    }

    // 重置小时计数器
    if (currentHour !== this.requestCount.lastHourReset) {
      this.requestCount.hour = 0;
      this.requestCount.lastHourReset = currentHour;
    }

    // 检查限制
    if (this.requestCount.minute >= this.config.rateLimits.requestsPerMinute) {
      console.warn('达到每分钟请求限制');
      return false;
    }

    if (this.requestCount.hour >= this.config.rateLimits.requestsPerHour) {
      console.warn('达到每小时请求限制');
      return false;
    }

    return true;
  }

  // 增加请求计数
  private incrementRequestCount() {
    this.requestCount.minute++;
    this.requestCount.hour++;
  }

  // 获取加密货币数据
  async fetchCryptoData(symbols: string[]): Promise<CryptoAPIResponse[]> {
    if (!this.checkRateLimit()) {
      throw new Error('请求频率超限，请稍后再试');
    }

    this.incrementRequestCount();

    switch (this.config.provider) {
      case 'coingecko':
        return this.fetchFromCoinGecko(symbols);
      case 'binance':
        return this.fetchFromBinance(symbols);
      case 'coinmarketcap':
        return this.fetchFromCoinMarketCap(symbols);
      case 'mock':
      default:
        return this.generateMockData(symbols);
    }
  }

  // CoinGecko API实现
  private async fetchFromCoinGecko(symbols: string[]): Promise<CryptoAPIResponse[]> {
    const ids = symbols.join(',').toLowerCase();
    const url = `${this.config.baseUrl}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
    
    const headers: Record<string, string> = {};
    if (this.config.apiKey) {
      headers['x-cg-demo-api-key'] = this.config.apiKey;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API错误: ${response.status}`);
    }

    const data = await response.json();
    
    return symbols.map(symbol => ({
      symbol: symbol.toUpperCase(),
      name: symbol,
      price: data[symbol.toLowerCase()]?.usd || 0,
      change24h: data[symbol.toLowerCase()]?.usd_24h_change || 0,
      changePercent24h: data[symbol.toLowerCase()]?.usd_24h_change || 0,
      volume24h: data[symbol.toLowerCase()]?.usd_24h_vol || 0,
      marketCap: data[symbol.toLowerCase()]?.usd_market_cap || 0,
      lastUpdated: new Date().toISOString()
    }));
  }

  // Binance API实现
  private async fetchFromBinance(symbols: string[]): Promise<CryptoAPIResponse[]> {
    const url = `${this.config.baseUrl}/ticker/24hr`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Binance API错误: ${response.status}`);
    }

    const allTickers = await response.json();
    
    return symbols.map(symbol => {
      const ticker = allTickers.find((t: any) => t.symbol === `${symbol.toUpperCase()}USDT`);
      
      return {
        symbol: symbol.toUpperCase(),
        name: symbol,
        price: parseFloat(ticker?.lastPrice || '0'),
        change24h: parseFloat(ticker?.priceChange || '0'),
        changePercent24h: parseFloat(ticker?.priceChangePercent || '0'),
        volume24h: parseFloat(ticker?.volume || '0'),
        marketCap: 0, // Binance不直接提供市值数据
        lastUpdated: new Date().toISOString()
      };
    });
  }

  // CoinMarketCap API实现
  private async fetchFromCoinMarketCap(symbols: string[]): Promise<CryptoAPIResponse[]> {
    if (!this.config.apiKey) {
      throw new Error('CoinMarketCap需要API密钥');
    }

    const symbolStr = symbols.join(',').toUpperCase();
    const url = `${this.config.baseUrl}/cryptocurrency/quotes/latest?symbol=${symbolStr}`;
    
    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': this.config.apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`CoinMarketCap API错误: ${response.status}`);
    }

    const data = await response.json();
    
    return symbols.map(symbol => {
      const coinData = data.data[symbol.toUpperCase()];
      const quote = coinData?.quote?.USD;
      
      return {
        symbol: symbol.toUpperCase(),
        name: coinData?.name || symbol,
        price: quote?.price || 0,
        change24h: quote?.percent_change_24h || 0,
        changePercent24h: quote?.percent_change_24h || 0,
        volume24h: quote?.volume_24h || 0,
        marketCap: quote?.market_cap || 0,
        lastUpdated: quote?.last_updated || new Date().toISOString()
      };
    });
  }

  // 生成模拟数据
  private generateMockData(symbols: string[]): CryptoAPIResponse[] {
    return symbols.map(symbol => ({
      symbol: symbol.toUpperCase(),
      name: symbol,
      price: Math.random() * 1000 + 100,
      change24h: (Math.random() - 0.5) * 100,
      changePercent24h: (Math.random() - 0.5) * 10,
      volume24h: Math.random() * 1000000000,
      marketCap: Math.random() * 100000000000,
      lastUpdated: new Date().toISOString()
    }));
  }

  // 获取当前配置信息
  getConfig(): APIConfig {
    return { ...this.config };
  }

  // 获取请求统计信息
  getRequestStats() {
    return {
      minuteRequests: this.requestCount.minute,
      hourRequests: this.requestCount.hour,
      minuteLimit: this.config.rateLimits.requestsPerMinute,
      hourLimit: this.config.rateLimits.requestsPerHour
    };
  }

  // 测试API连接
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.fetchCryptoData(['BTC']);
      return {
        success: true,
        message: `${this.config.provider} API连接成功`
      };
    } catch (error) {
      return {
        success: false,
        message: `API连接失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
}

// 默认API管理器实例
export const defaultAPIManager = new CryptoAPIManager('mock');

// 快捷函数：获取加密货币数据
export const getCryptoData = async (symbols: string[], provider: APIProvider = 'mock', apiKey?: string): Promise<CryptoAPIResponse[]> => {
  const manager = new CryptoAPIManager(provider, apiKey);
  return manager.fetchCryptoData(symbols);
};

// 快捷函数：测试API连接
export const testAPIConnection = async (provider: APIProvider, apiKey?: string): Promise<{ success: boolean; message: string }> => {
  const manager = new CryptoAPIManager(provider, apiKey);
  return manager.testConnection();
};