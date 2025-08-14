// Centralized crypto constants

export const DEFAULT_SYMBOLS = [
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

export const CRYPTO_NAMES: Record<string, { name: string; cn: string }> = {
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
  // Add more as needed...
  "OKB": { name: "OKB", cn: "欧易币" },
  "PENGU": { name: "Pudgy Penguins", cn: "胖企鹅" }
};

export const BASE_PRICES: Record<string, number> = {
  'BTC': 43000, 'ETH': 2500, 'USDT': 1.0, 'USDC': 1.0, 'BNB': 300,
  'XRP': 0.6, 'ADA': 0.5, 'SOL': 100, 'DOGE': 0.08, 'MATIC': 0.9,
  'DOT': 7, 'AVAX': 35, 'LINK': 14, 'LTC': 70, 'UNI': 6,
  'ATOM': 8, 'ICP': 5, 'NEAR': 2, 'APT': 9, 'FTM': 0.4,
  'OKB': 45, 'PENGU': 0.035
};

export const API_ENDPOINTS = {
  CRYPTO_DATA: '/functions/v1/crypto-data',
  CRYPTO_NEWS: '/functions/v1/crypto-news',
  BINANCE_API: '/functions/v1/binance-api',
  BINANCE_TEST: '/functions/v1/binance-test',
  AI_ANALYSIS: '/functions/v1/ai-analysis',
  SUPER_BRAIN: '/functions/v1/super-brain-analysis'
} as const;