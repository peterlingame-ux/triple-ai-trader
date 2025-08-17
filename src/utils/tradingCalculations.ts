// 交易计算工具函数

/**
 * 计算强平价格
 * @param entryPrice 入场价格
 * @param positionType 持仓类型
 * @param leverage 杠杆倍数
 * @param maintenanceMarginRate 维持保证金率 (默认1%)
 */
export function calculateLiquidationPrice(
  entryPrice: number, 
  positionType: 'long' | 'short',
  leverage: number,
  maintenanceMarginRate: number = 0.01
): number {
  if (positionType === 'long') {
    // 多仓强平价 = 入场价 * (1 - 1/杠杆 + 维持保证金率)
    return entryPrice * (1 - 1/leverage + maintenanceMarginRate);
  } else {
    // 空仓强平价 = 入场价 * (1 + 1/杠杆 - 维持保证金率)
    return entryPrice * (1 + 1/leverage - maintenanceMarginRate);
  }
}

/**
 * 计算维持保证金率
 * @param markPrice 标记价格
 * @param entryPrice 入场价格
 * @param positionType 持仓类型
 * @param leverage 杠杆倍数
 */
export function calculateMaintenanceMarginRate(
  markPrice: number,
  entryPrice: number,
  positionType: 'long' | 'short',
  leverage: number
): number {
  const unrealizedPnlRate = positionType === 'long' 
    ? (markPrice - entryPrice) / entryPrice
    : (entryPrice - markPrice) / entryPrice;
  
  return (1 / leverage - unrealizedPnlRate) * 100;
}

/**
 * 计算未实现盈亏
 * @param entryPrice 入场价格
 * @param markPrice 标记价格
 * @param positionAmount 持仓量
 * @param positionType 持仓类型
 */
export function calculateUnrealizedPnl(
  entryPrice: number,
  markPrice: number,
  positionAmount: number,
  positionType: 'long' | 'short'
): number {
  if (positionType === 'long') {
    return (markPrice - entryPrice) * positionAmount;
  } else {
    return (entryPrice - markPrice) * positionAmount;
  }
}

/**
 * 格式化杠杆显示
 * @param leverage 杠杆倍数
 */
export function formatLeverage(leverage: number): string {
  return `${leverage}x`;
}

/**
 * 格式化保证金模式显示
 * @param marginMode 保证金模式
 */
export function formatMarginMode(marginMode: 'isolated' | 'cross'): string {
  return marginMode === 'isolated' ? '逐仓' : '全仓';
}

/**
 * 格式化合约类型显示
 * @param contractType 合约类型
 */
export function formatContractType(contractType: 'spot' | 'perpetual' | 'futures'): string {
  switch (contractType) {
    case 'spot': return '现货';
    case 'perpetual': return '永续';
    case 'futures': return '期货';
    default: return contractType;
  }
}