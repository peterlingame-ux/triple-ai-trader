// Utility functions for crypto data processing
export const formatPrice = (price: number): string => {
  return price.toLocaleString(undefined, { 
    minimumFractionDigits: price < 1 ? 3 : 0, 
    maximumFractionDigits: price < 1 ? 3 : 0 
  });
};

export const formatVolume = (volume?: number): string => {
  if (!volume) return '2.5B';
  return (volume / 1e9).toFixed(2) + 'B';
};

export const formatMarketCap = (marketCap?: number): string => {
  if (!marketCap) return '45.2B';
  return (marketCap / 1e9).toFixed(1) + 'B';
};

export const getCirculatingSupply = (symbol: string): string => {
  const supplies: Record<string, string> = {
    'BTC': '19.7M BTC',
    'ETH': '120.4M ETH',
    'ADA': '35.0B ADA',
  };
  return supplies[symbol] || `1.2B ${symbol}`;
};

export const getMarketRank = (symbol: string): string => {
  const ranks: Record<string, string> = {
    'BTC': '1',
    'ETH': '2',
    'BNB': '4',
    'XRP': '5',
  };
  return ranks[symbol] || String(Math.floor(Math.random() * 50) + 6);
};