// 统一的交易相关类型定义
export interface VirtualAccount {
  balance: number;
  totalPnL: number;
  dailyPnL: number;
  winRate: number;
  totalTrades: number;
  activePositions: number;
}

export interface TradingStrategy {
  type: 'conservative' | 'aggressive';
  name: string;
  description: string;
  minConfidence: number;
  iconName: string; // 改为存储图标名称
  color: string;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  confidence: number;
  strategy: 'conservative' | 'aggressive';
  openTime: Date;
  stopLoss: number;
  takeProfit: number;
}

export interface SuperBrainSignal {
  symbol: string;
  action: 'buy' | 'sell';
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  reasoning: string;
  timestamp: Date;
}

export interface TradingAlert {
  id: string;
  symbol: string;
  type: 'comprehensive_analysis';
  confidence: number;
  signal: 'buy' | 'sell';
  price: number;
  analysis: {
    priceAnalysis: string;
    technicalAnalysis: string;
    sentimentAnalysis: string;
  };
  alerts: string[];
  timestamp: Date;
  tradingDetails?: {
    entry: number;
    stopLoss: number;
    takeProfit: number;
    position: string;
    reasoning: string;
    firstTakeProfit: number;
    secondTakeProfit: number;
    positionRatio: number;
    stopLossRequired: boolean;
    safetyFactor: number;
    riskLevel: 'low' | 'medium' | 'high';
    leverage: string;
    liquidationSafety: number;
    canAddPosition: boolean;
    addPositionRange: {
      min: number;
      max: number;
    } | null;
  };
}