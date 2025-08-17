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
  // 新增交易参数
  contractType: 'spot' | 'perpetual' | 'futures'; // 合约类型
  leverage: number; // 杠杆倍数 (如 20x)
  positionAmount: number; // 持仓量 (币的数量)
  margin: number; // 保证金 (USDT)
  maintenanceMarginRate: number; // 维持保证金率 (%)
  markPrice: number; // 标记价格
  liquidationPrice: number; // 预估强平价
  marginMode: 'isolated' | 'cross'; // 仓位模式 (逐仓/全仓)
  unrealizedPnl: number; // 未实现盈亏
  fees: number; // 交易手续费
  fundingFee: number; // 资金费率
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