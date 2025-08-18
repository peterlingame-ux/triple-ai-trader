// Centralized crypto constants

// 币安热门榜单 - 按市值排序的主要交易对
export const DEFAULT_SYMBOLS = [
  // Top 10 - 市值最大
  "BTC", "ETH", "USDT", "BNB", "XRP", "USDC", "ADA", "SOL", "DOGE", "AVAX",
  // Top 11-30 - 主流币种
  "TRX", "TON", "DOT", "MATIC", "SHIB", "LTC", "BCH", "LINK", "NEAR", "XLM",
  "UNI", "ATOM", "ETC", "HBAR", "FIL", "ICP", "CRO", "APT", "VET", "STX",
  // Top 31-50 - 热门DeFi和Layer2
  "ARB", "OP", "GRT", "ALGO", "QNT", "MANA", "SAND", "AAVE", "MKR", "COMP",
  "LRC", "ENJ", "BAT", "ZEC", "YFI", "SNX", "1INCH", "CRV", "UMA", "BAL",
  // Top 51-80 - 新兴和热门项目
  "SUSHI", "FTM", "FLOW", "EGLD", "ONE", "THETA", "KAVA", "BAND", "RVN", "ZIL",
  "JASMY", "IMX", "INJ", "SEI", "SUI", "JUP", "WLD", "FET", "RNDR", "RUNE",
  // Meme币和新兴热门
  "PEPE", "BONK", "WIF", "FLOKI", "SHIB", "BABYDOGE", "PENGU", "TURBO", "BRETT",
  // 稳定币和其他重要币种
  "FDUSD", "TUSD", "DAI", "USDC", "BUSD", "STETH", "RETH", "WETH", "WBTC",
  // 交易所币和平台币
  "OKB", "KCS", "HT", "LEO", "CRO", "MCO", "BGB", "GT"
];

export const CRYPTO_NAMES: Record<string, { name: string; cn: string }> = {
  // Top 10
  "BTC": { name: "Bitcoin", cn: "比特币" },
  "ETH": { name: "Ethereum", cn: "以太坊" },
  "USDT": { name: "Tether", cn: "泰达币" },
  "BNB": { name: "Binance Coin", cn: "币安币" },
  "XRP": { name: "Ripple", cn: "瑞波币" },
  "USDC": { name: "USD Coin", cn: "美元币" },
  "ADA": { name: "Cardano", cn: "卡尔达诺" },
  "SOL": { name: "Solana", cn: "索拉纳" },
  "DOGE": { name: "Dogecoin", cn: "狗狗币" },
  "AVAX": { name: "Avalanche", cn: "雪崩协议" },
  // Top 11-30
  "TRX": { name: "TRON", cn: "波场" },
  "TON": { name: "Toncoin", cn: "Ton币" },
  "DOT": { name: "Polkadot", cn: "波卡" },
  "MATIC": { name: "Polygon", cn: "马蹄链" },
  "SHIB": { name: "Shiba Inu", cn: "柴犬币" },
  "LTC": { name: "Litecoin", cn: "莱特币" },
  "BCH": { name: "Bitcoin Cash", cn: "比特币现金" },
  "LINK": { name: "Chainlink", cn: "链环" },
  "NEAR": { name: "NEAR Protocol", cn: "NEAR协议" },
  "XLM": { name: "Stellar", cn: "恒星币" },
  "UNI": { name: "Uniswap", cn: "Uniswap" },
  "ATOM": { name: "Cosmos", cn: "宇宙币" },
  "ETC": { name: "Ethereum Classic", cn: "以太经典" },
  "HBAR": { name: "Hedera", cn: "哈希图" },
  "FIL": { name: "Filecoin", cn: "文件币" },
  "ICP": { name: "Internet Computer", cn: "互联网计算机" },
  "CRO": { name: "Cronos", cn: "Cronos" },
  "APT": { name: "Aptos", cn: "Aptos" },
  "VET": { name: "VeChain", cn: "唯链" },
  "STX": { name: "Stacks", cn: "堆栈" },
  // Layer2 and DeFi
  "ARB": { name: "Arbitrum", cn: "Arbitrum" },
  "OP": { name: "Optimism", cn: "Optimism" },
  "GRT": { name: "The Graph", cn: "图协议" },
  "ALGO": { name: "Algorand", cn: "算法币" },
  "QNT": { name: "Quant", cn: "量子链" },
  "MANA": { name: "Decentraland", cn: "虚拟世界" },
  "SAND": { name: "The Sandbox", cn: "沙盒" },
  "AAVE": { name: "Aave", cn: "Aave" },
  "MKR": { name: "Maker", cn: "制造者" },
  "COMP": { name: "Compound", cn: "复合币" },
  "LRC": { name: "Loopring", cn: "路印协议" },
  "ENJ": { name: "Enjin Coin", cn: "恩金币" },
  "BAT": { name: "Basic Attention Token", cn: "注意力币" },
  "ZEC": { name: "Zcash", cn: "零币" },
  "YFI": { name: "yearn.finance", cn: "渴望金融" },
  "SNX": { name: "Synthetix", cn: "合成资产" },
  "1INCH": { name: "1inch", cn: "1inch" },
  "CRV": { name: "Curve DAO Token", cn: "曲线" },
  "UMA": { name: "UMA", cn: "通用市场准入" },
  "BAL": { name: "Balancer", cn: "平衡器" },
  "SUSHI": { name: "SushiSwap", cn: "寿司" },
  "FTM": { name: "Fantom", cn: "幻影币" },
  "FLOW": { name: "Flow", cn: "Flow" },
  "EGLD": { name: "MultiversX", cn: "多元宇宙" },
  "ONE": { name: "Harmony", cn: "和谐币" },
  "THETA": { name: "Theta Network", cn: "Theta网络" },
  "KAVA": { name: "Kava", cn: "Kava" },
  "BAND": { name: "Band Protocol", cn: "Band协议" },
  "RVN": { name: "Ravencoin", cn: "渡鸦币" },
  "ZIL": { name: "Zilliqa", cn: "Zilliqa" },
  // 新兴热门项目
  "JASMY": { name: "JasmyCoin", cn: "茉莉币" },
  "IMX": { name: "Immutable X", cn: "Immutable X" },
  "INJ": { name: "Injective", cn: "Injective" },
  "SEI": { name: "Sei", cn: "Sei" },
  "SUI": { name: "Sui", cn: "Sui" },
  "JUP": { name: "Jupiter", cn: "木星币" },
  "WLD": { name: "Worldcoin", cn: "世界币" },
  "FET": { name: "Fetch.ai", cn: "Fetch.ai" },
  "RNDR": { name: "Render Token", cn: "渲染币" },
  "RUNE": { name: "THORChain", cn: "雷神链" },
  // Meme币
  "PEPE": { name: "Pepe", cn: "佩佩币" },
  "BONK": { name: "Bonk", cn: "Bonk" },
  "WIF": { name: "dogwifhat", cn: "戴帽狗" },
  "FLOKI": { name: "FLOKI", cn: "弗洛基" },
  "BABYDOGE": { name: "Baby Doge Coin", cn: "小狗币" },
  "PENGU": { name: "Pudgy Penguins", cn: "胖企鹅" },
  "TURBO": { name: "Turbo", cn: "涡轮币" },
  "BRETT": { name: "Brett", cn: "布雷特" },
  // 稳定币
  "FDUSD": { name: "First Digital USD", cn: "第一数字美元" },
  "TUSD": { name: "TrueUSD", cn: "真实美元" },
  "DAI": { name: "Dai Stablecoin", cn: "Dai稳定币" },
  "BUSD": { name: "Binance USD", cn: "币安美元" },
  "STETH": { name: "Staked Ether", cn: "质押以太坊" },
  "RETH": { name: "Rocket Pool ETH", cn: "火箭池以太坊" },
  "WETH": { name: "Wrapped Ether", cn: "包装以太坊" },
  "WBTC": { name: "Wrapped Bitcoin", cn: "包装比特币" },
  // 交易所币
  "OKB": { name: "OKB", cn: "欧易币" },
  "KCS": { name: "KuCoin Shares", cn: "库币" },
  "HT": { name: "Huobi Token", cn: "火币" },
  "LEO": { name: "UNUS SED LEO", cn: "LEO币" },
  "MCO": { name: "Monaco", cn: "摩纳哥币" },
  "BGB": { name: "Bitget Token", cn: "Bitget币" },
  "GT": { name: "GateToken", cn: "芝麻开门币" }
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