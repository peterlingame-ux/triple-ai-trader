import { TradingStrategy } from "@/types/trading";

// AI顾问常量
export const AI_ADVISORS = [
  {
    name: "Elon Musk",
    avatar: "/lovable-uploads/7d9761f6-da66-4be0-b4f6-482682564e52.png",
    backgroundColor: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800",
    accentColor: "text-blue-300",
  },
  {
    name: "Warren Buffett", 
    avatar: "/lovable-uploads/4d4ba882-5d48-4828-b81b-a2b60ad7c68b.png",
    backgroundColor: "bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-800",
    accentColor: "text-amber-300",
  },
  {
    name: "Bill Gates",
    avatar: "/lovable-uploads/a11e3b1a-1c1c-403b-910c-bd42820384c4.png", 
    backgroundColor: "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800",
    accentColor: "text-emerald-300",
  },
  {
    name: "Vitalik Buterin",
    avatar: "/lovable-uploads/5616db28-ef44-4766-b461-7f9a97023859.png",
    backgroundColor: "bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-800", 
    accentColor: "text-violet-300",
  },
  {
    name: "Justin Sun",
    avatar: "/lovable-uploads/95952d3d-a183-488d-9fc8-4b12a9e06365.png",
    backgroundColor: "bg-gradient-to-br from-rose-900 via-pink-900 to-red-800",
    accentColor: "text-rose-300", 
  },
  {
    name: "Donald Trump",
    avatar: "/lovable-uploads/7d4748c1-c1ec-4468-891e-445541a5a42c.png",
    backgroundColor: "bg-gradient-to-br from-yellow-900 via-orange-900 to-amber-800",
    accentColor: "text-yellow-300",
  }
] as const;

// 交易策略常量 - 不包含图标，在组件中动态渲染
export const TRADING_STRATEGIES = [
  {
    type: 'conservative' as const,
    name: '稳健型',
    description: '胜率大于85%才进行交易，追求稳定收益',
    minConfidence: 85,
    iconName: 'Shield', // 存储图标名称而不是组件
    color: 'text-blue-400'
  },
  {
    type: 'aggressive' as const,
    name: '激进型', 
    description: '胜率达到70%就进行交易，追求更多机会',
    minConfidence: 70,
    iconName: 'Zap', // 存储图标名称而不是组件
    color: 'text-orange-400'
  }
];

// 默认监控币种
export const DEFAULT_MONITORING_SYMBOLS = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL'] as const;

// API分析类型
export const ANALYSIS_TYPES = ['price', 'technical', 'news', 'sentiment', 'volume', 'macro'] as const;

// 交易配置常量
export const TRADING_CONFIG = {
  DEFAULT_BALANCE: 1000,
  MIN_BALANCE: 1000,
  RISK_PERCENTAGE: 2, // 2%风险
  DETECTION_INTERVAL: 60000, // 60秒
  REAL_TIME_INTERVAL: 30000, // 30秒
  MAX_HISTORY_ITEMS: 20,
  MAX_ALERTS: 10,
} as const;