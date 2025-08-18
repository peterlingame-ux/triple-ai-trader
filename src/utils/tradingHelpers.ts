import { SuperBrainSignal, TradingAlert } from "@/types/trading";

// 模拟AI分析数据生成
export const generateMockAnalysis = (): TradingAlert | null => {
  const symbols = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL'];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  
  // 85%概率触发
  if (Math.random() < 0.85) {
    const basePrice = Math.random() * 50000 + 30000;
    const isLong = Math.random() > 0.5;
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%胜率
    
    const stopLoss = Math.round(basePrice * (isLong ? 0.95 : 1.05));
    const firstTakeProfit = Math.round(basePrice * (isLong ? 1.08 : 0.92));
    const secondTakeProfit = Math.round(basePrice * (isLong ? 1.15 : 0.85));
    
    // 根据胜率计算参数
    let positionRatio = 10;
    let safetyFactor = 5;
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    
    if (confidence >= 95) {
      positionRatio = 25;
      safetyFactor = 9;
      riskLevel = 'low';
    } else if (confidence >= 90) {
      positionRatio = 20;
      safetyFactor = 8;
      riskLevel = 'low';
    } else if (confidence >= 85) {
      positionRatio = 15;
      safetyFactor = 7;
      riskLevel = 'medium';
    } else {
      positionRatio = 8;
      safetyFactor = 5;
      riskLevel = 'high';
    }
    
    const stopLossRequired = confidence < 90;
    
    return {
      id: Date.now().toString(),
      symbol: randomSymbol,
      type: 'comprehensive_analysis',
      confidence: confidence,
      signal: isLong ? 'buy' : 'sell',
      price: basePrice,
      analysis: {
        priceAnalysis: `📊 6AI Comprehensive Technical Analysis: ${randomSymbol} price breaks through key ${isLong ? 'resistance' : 'support'} level $${basePrice.toFixed(0)}, MACD golden cross confirms trend`,
        technicalAnalysis: `🎯 Technical Indicators Summary: RSI(${isLong ? '70+' : '30-'}), Bollinger Bands ${isLong ? 'Upper Band Breakout' : 'Lower Band Support'}, Volume Amplification ${Math.floor(Math.random() * 200 + 150)}%`,
        sentimentAnalysis: `🧠 AI Supreme Brain Comprehensive Conclusion: Based on 6 analysis models, current ${randomSymbol} shows ${confidence}% win rate ${isLong ? 'bullish' : 'bearish'} signal, recommend immediate action`
      },
      alerts: [],
      timestamp: new Date(),
      tradingDetails: {
        entry: Math.round(basePrice),
        stopLoss: stopLoss,
        takeProfit: Math.round(basePrice * (isLong ? 1.12 : 0.88)),
        position: confidence >= 95 ? 'Heavy' : confidence >= 90 ? 'Medium' : 'Light',
        reasoning: `Supreme Brain 6 AI Models Comprehensive Analysis: Price chart, technical indicators, news sentiment, market sentiment, volume, and macro environment all point to ${isLong ? 'bullish' : 'bearish'} opportunity, high win rate trading signal confirmed.`,
        firstTakeProfit: firstTakeProfit,
        secondTakeProfit: secondTakeProfit,
        positionRatio: positionRatio,
        stopLossRequired: stopLossRequired,
        safetyFactor: safetyFactor,
        riskLevel: riskLevel,
        leverage: confidence >= 95 ? '20x' : confidence >= 90 ? '15x' : '10x',
        liquidationSafety: confidence >= 95 ? 5 : confidence >= 90 ? 4 : 3,
        canAddPosition: !stopLossRequired,
        addPositionRange: !stopLossRequired ? {
          min: Math.round(basePrice * (isLong ? 0.97 : 1.03)),
          max: Math.round(basePrice * (isLong ? 0.94 : 1.06))
        } : null
      }
    };
  }
  
  return null;
};

// 验证信号有效性
export const validateSignal = (signal: SuperBrainSignal): boolean => {
  return !!(
    signal.symbol &&
    signal.action &&
    signal.confidence > 0 &&
    signal.entry > 0 &&
    signal.stopLoss > 0 &&
    signal.takeProfit > 0
  );
};

// 计算风险收益比
export const calculateRiskReward = (entry: number, stopLoss: number, takeProfit: number, action: 'buy' | 'sell'): number => {
  if (action === 'buy') {
    const risk = entry - stopLoss;
    const reward = takeProfit - entry;
    return reward / risk;
  } else {
    const risk = stopLoss - entry;
    const reward = entry - takeProfit;
    return reward / risk;
  }
};

// 格式化历史记录
export const formatTradingHistory = (type: string, symbol: string, action: string, details: any): string[] => {
  const timestamp = new Date().toLocaleTimeString();
  
  switch (type) {
    case 'signal_received':
      return [`📡 [${timestamp}] 收到${symbol}信号：${action === 'buy' ? '买入' : '卖出'}，胜率${details.confidence}%`];
    
    case 'signal_ignored':
      return [
        `⚠️ [${timestamp}] ${symbol} 信号胜率${details.confidence}%低于${details.strategyName}策略要求${details.minConfidence}%，已忽略`,
        `💡 提示：切换到激进型策略(70%门槛)可执行此信号`
      ];
    
    case 'trade_executed':
      return [
        `✅ [${timestamp}] 自动执行：${symbol} ${action === 'buy' ? '买入' : '卖出'} $${details.entry.toLocaleString()}`,
        `📊 ${details.strategyName}策略 | 胜率${details.confidence}% | 仓位${details.positionSize.toFixed(4)}`,
        `🎯 止损$${details.stopLoss.toLocaleString()} | 止盈$${details.takeProfit.toLocaleString()}`
      ];
    
    case 'duplicate_position':
      return [`💰 [${timestamp}] ${symbol} 已有持仓，跳过重复交易`];
    
    case 'trader_started':
      return [`🤖 [${timestamp}] AI自动交易启动 - ${details.strategyName}策略`];
    
    default:
      return [`📝 [${timestamp}] ${type}: ${symbol}`];
  }
};