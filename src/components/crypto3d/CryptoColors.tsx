// Crypto 3D Colors Configuration
export const cryptoColors: Record<string, { primary: string; secondary: string; accent?: string }> = {
  // Major coins
  BTC: { primary: '#f7931a', secondary: '#ffffff', accent: '#ffcd3c' },
  ETH: { primary: '#627eea', secondary: '#ffffff', accent: '#8fa9ff' },
  USDT: { primary: '#26a17b', secondary: '#ffffff', accent: '#52c788' },
  USDC: { primary: '#2775ca', secondary: '#ffffff', accent: '#4da6ff' },
  BNB: { primary: '#f3ba2f', secondary: '#000000', accent: '#ffd700' },
  XRP: { primary: '#23292f', secondary: '#ffffff', accent: '#00d4aa' },
  ADA: { primary: '#0033ad', secondary: '#ffffff', accent: '#3468dc' },
  SOL: { primary: '#9945ff', secondary: '#ffffff', accent: '#bb73ff' },
  DOGE: { primary: '#c2a633', secondary: '#000000', accent: '#f4d03f' },
  DOT: { primary: '#e6007a', secondary: '#ffffff', accent: '#ff4da6' },
  MATIC: { primary: '#8247e5', secondary: '#ffffff', accent: '#a066ff' },
  SHIB: { primary: '#ffa409', secondary: '#000000', accent: '#ffcc66' },
  AVAX: { primary: '#e84142', secondary: '#ffffff', accent: '#ff6b6b' },
  LTC: { primary: '#bfbbbb', secondary: '#345d9d', accent: '#cccccc' },
  LINK: { primary: '#375bd2', secondary: '#ffffff', accent: '#5577ff' },
  UNI: { primary: '#ff007a', secondary: '#ffffff', accent: '#ff4da6' },
  ATOM: { primary: '#2e3148', secondary: '#ffffff', accent: '#6f7390' },
  TRX: { primary: '#ff060a', secondary: '#ffffff', accent: '#ff4d50' },
  BCH: { primary: '#8dc351', secondary: '#ffffff', accent: '#b8e986' },
  FIL: { primary: '#0090ff', secondary: '#ffffff', accent: '#4da6ff' },
  ICP: { primary: '#29abe2', secondary: '#ffffff', accent: '#66ccff' },
  NEAR: { primary: '#000000', secondary: '#ffffff', accent: '#333333' },
  
  // Stablecoins
  STETH: { primary: '#00d4aa', secondary: '#ffffff', accent: '#33ffcc' },
  
  // Layer 1s
  TON: { primary: '#0088cc', secondary: '#ffffff', accent: '#33aaff' },
  ETC: { primary: '#329239', secondary: '#ffffff', accent: '#5cb85c' },
  HBAR: { primary: '#000000', secondary: '#ffffff', accent: '#333333' },
  
  // DeFi tokens
  GRT: { primary: '#6f4cff', secondary: '#ffffff', accent: '#9980ff' },
  ALGO: { primary: '#000000', secondary: '#ffffff', accent: '#333333' },
  QNT: { primary: '#6a67ce', secondary: '#ffffff', accent: '#9999ff' },
  MANA: { primary: '#ff2d55', secondary: '#ffffff', accent: '#ff6b85' },
  SAND: { primary: '#00d4ff', secondary: '#ffffff', accent: '#66e6ff' },
  AAVE: { primary: '#b6509e', secondary: '#ffffff', accent: '#d980cc' },
  MKR: { primary: '#1aab9b', secondary: '#ffffff', accent: '#4dcccc' },
  COMP: { primary: '#00d395', secondary: '#ffffff', accent: '#33ffaa' },
  YFI: { primary: '#006ae3', secondary: '#ffffff', accent: '#4d9fff' },
  SNX: { primary: '#5fcdf9', secondary: '#000000', accent: '#99e6ff' },
  CRV: { primary: '#ff0000', secondary: '#ffffff', accent: '#ff6666' },
  UMA: { primary: '#ff6ec7', secondary: '#ffffff', accent: '#ff99d6' },
  BAL: { primary: '#1e1e1e', secondary: '#ffffff', accent: '#666666' },
  SUSHI: { primary: '#fa52a0', secondary: '#ffffff', accent: '#ff85cc' },
  
  // Meme coins
  PEPE: { primary: '#4CAF50', secondary: '#000000', accent: '#81C784' },
  WIF: { primary: '#8B4513', secondary: '#ffffff', accent: '#D2691E' },
  BONK: { primary: '#FF6B35', secondary: '#ffffff', accent: '#FF8C66' },
  FLOKI: { primary: '#FF6B6B', secondary: '#ffffff', accent: '#FF9999' },
  BABYDOGE: { primary: '#FFD700', secondary: '#000000', accent: '#FFEE33' },
  SAFE: { primary: '#42C8F5', secondary: '#ffffff', accent: '#7AD8FF' },
  MEME: { primary: '#FF6B35', secondary: '#ffffff', accent: '#FF8C66' },
  WOJAK: { primary: '#87CEEB', secondary: '#000000', accent: '#B8E0FF' },
  TURBO: { primary: '#FFD700', secondary: '#000000', accent: '#FFEE33' },
  LADYS: { primary: '#FF69B4', secondary: '#ffffff', accent: '#FF99CC' },
  TRUMP: { primary: '#FF0000', secondary: '#ffffff', accent: '#FF6666' },
  
  // Exchange tokens
  OKB: { primary: '#3075ff', secondary: '#ffffff', accent: '#66b3ff' },
  PENGU: { primary: '#000000', secondary: '#ffffff', accent: '#ff6b35' },
  
  // Other tokens
  XLM: { primary: '#14b6e7', secondary: '#ffffff', accent: '#4dccff' },
  VET: { primary: '#15bdff', secondary: '#ffffff', accent: '#66ccff' },
  APT: { primary: '#00d4aa', secondary: '#ffffff', accent: '#33ffcc' },
  FTM: { primary: '#1969ff', secondary: '#ffffff', accent: '#6699ff' },
  FLOW: { primary: '#00ef8b', secondary: '#ffffff', accent: '#4dffaa' },
  EGLD: { primary: '#1b46c2', secondary: '#ffffff', accent: '#4d7aff' },
  ONE: { primary: '#00aee9', secondary: '#ffffff', accent: '#4dccff' },
  HIVE: { primary: '#e31337', secondary: '#ffffff', accent: '#ff4d6b' },
  THETA: { primary: '#2ab8e6', secondary: '#ffffff', accent: '#66ccff' },
  TFUEL: { primary: '#8a2be2', secondary: '#ffffff', accent: '#b366ff' },
  KAVA: { primary: '#ff5722', secondary: '#ffffff', accent: '#ff8a66' },
  BAND: { primary: '#516aff', secondary: '#ffffff', accent: '#8599ff' },
  
  // Default fallback
  DEFAULT: { primary: '#6b7280', secondary: '#ffffff', accent: '#9ca3af' }
};

export const getCryptoColors = (symbol: string) => {
  return cryptoColors[symbol.toUpperCase()] || cryptoColors.DEFAULT;
};
