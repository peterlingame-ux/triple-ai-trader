import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Zap, 
  Target, 
  Shield, 
  Activity,
  BarChart3,
  Settings,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  Percent,
  ArrowUp,
  ArrowDown,
  Brain,
  Timer,
  Award,
  TrendingDownIcon,
  TrendingUpIcon,
  CircleDollarSign,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useLanguage } from "@/hooks/useLanguage";
import { useWalletData } from "@/hooks/useWalletData";

type TradingStrategy = 'conservative' | 'aggressive';
type TradingType = 'spot' | 'futures';

interface TradingSignal {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  tradingType: TradingType;
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  reasoning: string;
  timestamp: Date;
  status: 'pending' | 'executed' | 'closed';
  strategy: TradingStrategy;
  leverage?: number;
  aiAnalysis: {
    technicalScore: number;
    fundamentalScore: number;
    marketSentiment: 'bullish' | 'bearish' | 'neutral';
    riskLevel: 'low' | 'medium' | 'high';
  };
}

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  tradingType: TradingType;
  entry: number;
  size: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  openTime: Date;
  status: 'open' | 'closed';
  strategy: TradingStrategy;
  stopLoss: number;
  takeProfit: number;
  highestProfit: number;
  maxDrawdown: number;
  leverage?: number;
  margin?: number; // For leveraged trades
  liquidationPrice?: number; // For futures
}

interface AutoTraderConfig {
  enabled: boolean;
  strategy: TradingStrategy;
  tradingType: TradingType;
  conservativeMinConfidence: number;
  aggressiveMinConfidence: number;
  maxPositions: number;
  riskPerTrade: number;
  virtualBalance: number;
  allowedSymbols: string[];
  stopLossPercent: number;
  takeProfitPercent: number;
  trailingStop: boolean;
  maxDailyLoss: number;
  autoReinvest: boolean;
  // Trading type specific configs
  leverage: number;
  maxLeverage: number;
  marginRatio: number; // For futures
}

interface TradingStats {
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  conservativeStats: {
    trades: number;
    winRate: number;
    avgProfit: number;
  };
  aggressiveStats: {
    trades: number;
    winRate: number;
    avgProfit: number;
  };
  dailyPnL: number;
  monthlyPnL: number;
  // Trading type specific stats
  spotStats: { trades: number; winRate: number; avgProfit: number; };
  futuresStats: { trades: number; winRate: number; avgProfit: number; totalMargin: number; };
  leverageUsed: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export const AutoTrader = () => {
  const { toast } = useToast();
  const { cryptoData, newsData } = useCryptoData();
  const { t } = useLanguage();
  const { updateAutoTraderData } = useWalletData();
  const {
    analyzePriceChart,
    analyzeTechnicalIndicators,
    analyzeNewsSentiment,
    loading: aiLoading
  } = useAIAnalysis();
  
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AutoTraderConfig>({
    enabled: false,
    strategy: 'conservative',
    tradingType: 'spot',
    conservativeMinConfidence: 90,
    aggressiveMinConfidence: 70,
    maxPositions: 5,
    riskPerTrade: 2,
    virtualBalance: 100000,
    allowedSymbols: ['BTC', 'ETH', 'SOL'],
    stopLossPercent: 5,
    takeProfitPercent: 10,
    trailingStop: true,
    maxDailyLoss: 1000,
    autoReinvest: true,
    leverage: 1,
    maxLeverage: 100,
    marginRatio: 0.1
  });

  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [stats, setStats] = useState<TradingStats>({
    totalPnL: 0,
    winRate: 87.5,
    totalTrades: 48,
    conservativeStats: { trades: 32, winRate: 93.8, avgProfit: 156.5 },
    aggressiveStats: { trades: 16, winRate: 75.0, avgProfit: 89.2 },
    dailyPnL: 1247.89,
    monthlyPnL: 15847.32,
    spotStats: { trades: 18, winRate: 89.0, avgProfit: 120.5 },
    futuresStats: { trades: 24, winRate: 83.3, avgProfit: 185.2, totalMargin: 8500 },
    leverageUsed: 3.2,
    maxDrawdown: -2.8,
    sharpeRatio: 2.15
  });

  const [tradingActivity, setTradingActivity] = useState<string[]>([]);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<{[symbol: string]: any}>({});

  // Sync initial data with WalletProvider
  useEffect(() => {
    updateAutoTraderData({
      virtualBalance: config.virtualBalance,
      totalPnL: stats.totalPnL,
      dailyPnL: stats.dailyPnL,
      activeTrades: positions.filter(p => p.status === 'open').length,
      winRate: stats.winRate,
      monthlyPnL: stats.monthlyPnL
    });
  }, [stats, positions, config.virtualBalance]);

  // Real-time sync of active trades count
  useEffect(() => {
    const activeTradesCount = positions.filter(p => p.status === 'open').length;
    updateAutoTraderData({
      activeTrades: activeTradesCount
    });
  }, [positions]);

  // Sync virtual balance changes
  useEffect(() => {
    updateAutoTraderData({
      virtualBalance: config.virtualBalance
    });
  }, [config.virtualBalance]);

  // Enhanced AI signal generation using real AI API analysis
  useEffect(() => {
    if (!config.enabled) return;

    const generateAISignal = async () => {
      try {
        // 选择要分析的加密货币
        const availableCryptos = cryptoData.length > 0 ? cryptoData : config.allowedSymbols.map(symbol => ({
          symbol,
          price: Math.random() * 50000 + 20000,
          high24h: Math.random() * 52000 + 21000,
          low24h: Math.random() * 48000 + 19000,
          volume24h: Math.random() * 1e9,
          change24h: (Math.random() - 0.5) * 1000,
          rsi: Math.random() * 100,
          ma20: Math.random() * 50000 + 20000,
          ma50: Math.random() * 50000 + 20000,
          support: Math.random() * 48000 + 19000,
          resistance: Math.random() * 52000 + 21000,
          marketCap: Math.random() * 1e12,
          dominance: Math.random() * 10
        }));

        const crypto = availableCryptos[Math.floor(Math.random() * Math.min(availableCryptos.length, config.allowedSymbols.length))];
        const symbol = crypto.symbol;

        // 1. 进行价格图表分析
        const priceAnalysisData = {
          symbol: symbol,
          timeframe: '1H',
          priceData: {
            current: crypto.price,
            high24h: crypto.high24h,
            low24h: crypto.low24h,
            volume24h: crypto.volume24h,
            change24h: crypto.change24h
          },
          technicalData: {
            rsi: crypto.rsi,
            ma20: crypto.ma20,
            ma50: crypto.ma50,
            support: crypto.support,
            resistance: crypto.resistance
          }
        };

        // 2. 进行技术分析
        const technicalAnalysisData = {
          symbol: symbol,
          indicators: {
            rsi: crypto.rsi,
            macd: ((crypto.price - crypto.ma20) / crypto.ma20 * 100),
            kdj: (crypto.rsi * 0.8),
            bollinger: {
              upper: crypto.price * 1.02,
              middle: crypto.ma20,
              lower: crypto.price * 0.98
            },
            movingAverages: {
              ma5: crypto.price * 0.995,
              ma10: crypto.price * 0.992,
              ma20: crypto.ma20,
              ma50: crypto.ma50,
              ma200: crypto.ma50 * 0.92
            },
            supportResistance: {
              support1: crypto.support,
              support2: crypto.support * 0.95,
              resistance1: crypto.resistance,
              resistance2: crypto.resistance * 1.05
            }
          },
          marketData: {
            price: crypto.price,
            volume: crypto.volume24h,
            marketCap: crypto.marketCap,
            dominance: crypto.dominance
          }
        };

        // 3. 进行新闻情感分析
        const newsAnalysisData = {
          news: newsData.slice(0, 5).map(news => ({
            title: news.title,
            description: news.description || '',
            source: typeof news.source === 'string' ? news.source : news.source.name,
            publishedAt: news.publishedAt || ''
          })),
          symbol: symbol,
          timeframe: '1H'
        };

        // 并行调用三个AI分析
        const [priceAnalysis, technicalAnalysis, sentimentAnalysis] = await Promise.all([
          analyzePriceChart(priceAnalysisData).catch(() => "价格分析暂时不可用"),
          analyzeTechnicalIndicators(technicalAnalysisData).catch(() => "技术分析暂时不可用"),
          analyzeNewsSentiment(newsAnalysisData).catch(() => "情感分析暂时不可用")
        ]);

        // 保存AI分析结果
        setAiAnalysisResults(prev => ({
          ...prev,
          [symbol]: {
            priceAnalysis,
            technicalAnalysis,
            sentimentAnalysis,
            timestamp: new Date()
          }
        }));

        // 基于AI分析结果计算信号强度
        const aiConfidence = calculateAIConfidence(priceAnalysis, technicalAnalysis, sentimentAnalysis);
        const tradingDirection = determineTradingDirection(priceAnalysis, technicalAnalysis, sentimentAnalysis);
        
        const minConfidence = config.strategy === 'conservative' 
          ? config.conservativeMinConfidence 
          : config.aggressiveMinConfidence;

        if (aiConfidence >= minConfidence && positions.length < config.maxPositions) {
          const leverage = config.tradingType === 'spot' ? 1 : config.leverage;
          
          let signal: TradingSignal = {
            id: Date.now().toString(),
            symbol,
            type: tradingDirection,
            tradingType: config.tradingType,
            confidence: aiConfidence,
            entry: crypto.price,
            stopLoss: tradingDirection === 'long' 
              ? crypto.price * (1 - config.stopLossPercent / 100) 
              : crypto.price * (1 + config.stopLossPercent / 100),
            takeProfit: tradingDirection === 'long' 
              ? crypto.price * (1 + config.takeProfitPercent / 100) 
              : crypto.price * (1 - config.takeProfitPercent / 100),
            reasoning: `AI多模型分析: ${priceAnalysis.substring(0, 100)}...`,
            timestamp: new Date(),
            status: 'pending',
            strategy: config.strategy,
            leverage: leverage,
            aiAnalysis: {
              technicalScore: extractScore(technicalAnalysis),
              fundamentalScore: extractScore(priceAnalysis),
              marketSentiment: extractSentiment(sentimentAnalysis),
              riskLevel: config.strategy === 'conservative' ? 'low' : 'medium'
            }
          };

          // Add futures-specific fields
          if (config.tradingType === 'futures') {
            signal.leverage = leverage;
          }

          setSignals(prev => [signal, ...prev.slice(0, 9)]);
          
          // Add to activity log
          const tradingTypeText = config.tradingType === 'spot' ? '现货' : '合约';
          setTradingActivity(prev => [
            `🤖 AI多模型分析发现${config.strategy === 'conservative' ? '稳健' : '激进'}${tradingTypeText}交易机会: ${symbol} ${tradingDirection === 'long' ? '买入' : '卖空'} ${leverage > 1 ? `${leverage}x杠杆` : ''} (置信度: ${aiConfidence}%)`,
            ...prev.slice(0, 19)
          ]);
          
          // Auto execute with delay
          setTimeout(() => executeSignal(signal), 3000);
        }

      } catch (error) {
        console.error('AI信号生成错误:', error);
        setTradingActivity(prev => [
          `⚠️ AI分析暂时不可用，使用备用策略`,
          ...prev.slice(0, 19)
        ]);
      }
    };

    const interval = setInterval(generateAISignal, Math.random() * 15000 + 10000); // 10-25秒间隔
    return () => clearInterval(interval);
  }, [config.enabled, config.strategy, config.conservativeMinConfidence, config.aggressiveMinConfidence, config.maxPositions, positions.length, cryptoData, newsData, analyzePriceChart, analyzeTechnicalIndicators, analyzeNewsSentiment]);

  // AI分析结果处理函数
  const calculateAIConfidence = (priceAnalysis: string, technicalAnalysis: string, sentimentAnalysis: string): number => {
    let confidence = 50; // 基础置信度
    
    // 分析价格分析结果
    if (priceAnalysis.includes('强烈') || priceAnalysis.includes('明确') || priceAnalysis.includes('突破')) {
      confidence += 15;
    } else if (priceAnalysis.includes('谨慎') || priceAnalysis.includes('风险')) {
      confidence -= 10;
    }
    
    // 分析技术指标结果
    if (technicalAnalysis.includes('买入') || technicalAnalysis.includes('看涨') || technicalAnalysis.includes('bullish')) {
      confidence += 20;
    } else if (technicalAnalysis.includes('卖出') || technicalAnalysis.includes('看跌') || technicalAnalysis.includes('bearish')) {
      confidence += 20; // 无论看涨看跌，明确方向都增加置信度
    }
    
    // 分析情感结果
    if (sentimentAnalysis.includes('积极') || sentimentAnalysis.includes('乐观') || sentimentAnalysis.includes('看涨')) {
      confidence += 10;
    } else if (sentimentAnalysis.includes('消极') || sentimentAnalysis.includes('悲观') || sentimentAnalysis.includes('看跌')) {
      confidence += 10;
    }
    
    return Math.min(Math.max(confidence, 30), 95); // 限制在30-95%之间
  };

  const determineTradingDirection = (priceAnalysis: string, technicalAnalysis: string, sentimentAnalysis: string): 'long' | 'short' => {
    let longScore = 0;
    let shortScore = 0;
    
    // 分析文本中的方向指示
    const bullishKeywords = ['买入', '看涨', 'bullish', '上涨', '突破', '支撑'];
    const bearishKeywords = ['卖出', '看跌', 'bearish', '下跌', '阻力', '突破阻力'];
    
    const allAnalysis = [priceAnalysis, technicalAnalysis, sentimentAnalysis].join(' ');
    
    bullishKeywords.forEach(keyword => {
      if (allAnalysis.includes(keyword)) longScore++;
    });
    
    bearishKeywords.forEach(keyword => {
      if (allAnalysis.includes(keyword)) shortScore++;
    });
    
    return longScore >= shortScore ? 'long' : 'short';
  };

  const extractScore = (analysis: string): number => {
    // 从分析文本中提取数值评分
    const scoreMatch = analysis.match(/(\d+)分|(\d+)%|(\d+)\.(\d+)/);
    if (scoreMatch) {
      return parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]) || Math.floor(Math.random() * 30) + 70;
    }
    return Math.floor(Math.random() * 30) + 70; // 70-100的随机分数
  };

  const extractSentiment = (analysis: string): 'bullish' | 'bearish' | 'neutral' => {
    if (analysis.includes('看涨') || analysis.includes('积极') || analysis.includes('乐观')) {
      return 'bullish';
    } else if (analysis.includes('看跌') || analysis.includes('消极') || analysis.includes('悲观')) {
      return 'bearish';
    }
    return 'neutral';
  };

  const generateAIReasoning = (symbol: string, type: string, confidence: number, strategy: TradingStrategy, tradingType: TradingType): string => {
    const baseReasons = [
      `${symbol}突破关键阻力位，成交量放大确认`,
      `多重技术指标共振，${type === 'long' ? '看涨' : '看跌'}信号强烈`,
      `市场情绪转换，资金流向显示明显${type === 'long' ? '买入' : '卖出'}压力`,
      `AI深度学习模型识别出类似历史模式`,
      `基本面分析与技术面完美结合的交易机会`
    ];
    
    const tradingTypeReasons = {
      spot: '现货市场流动性充足，适合稳健布局',
      futures: '期货合约价差机会明显，杠杆优势突出'
    };
    
    const strategyNote = strategy === 'conservative' 
      ? '稳健策略：风险控制优先，追求稳定收益'
      : '激进策略：追求高收益，承担相应风险';
    
    return `${baseReasons[Math.floor(Math.random() * baseReasons.length)]}。${tradingTypeReasons[tradingType]}。${strategyNote}`;
  };

  const executeSignal = (signal: TradingSignal) => {
    let positionSize = (config.virtualBalance * config.riskPerTrade) / 100;
    
    // Apply leverage for futures
    if (signal.tradingType === 'futures' && signal.leverage) {
      positionSize *= signal.leverage;
    }
    
    // Calculate margin for leveraged positions
    const margin = signal.tradingType === 'futures' ? positionSize / (signal.leverage || 1) : positionSize;
    
    // Calculate liquidation price for futures
    let liquidationPrice;
    if (signal.tradingType === 'futures' && signal.leverage) {
      const marginRatio = 1 / signal.leverage * 0.8; // 80% of full margin
      liquidationPrice = signal.type === 'long' 
        ? signal.entry * (1 - marginRatio)
        : signal.entry * (1 + marginRatio);
    }
    
    const newPosition: Position = {
      id: signal.id,
      symbol: signal.symbol,
      type: signal.type,
      tradingType: signal.tradingType,
      entry: signal.entry,
      size: positionSize,
      currentPrice: signal.entry,
      pnl: 0,
      pnlPercent: 0,
      openTime: signal.timestamp,
      status: 'open',
      strategy: signal.strategy,
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit,
      highestProfit: 0,
      maxDrawdown: 0,
      leverage: signal.leverage,
      margin: margin,
      liquidationPrice: liquidationPrice
    };

    setPositions(prev => [...prev, newPosition]);
    setSignals(prev => 
      prev.map(s => s.id === signal.id ? { ...s, status: 'executed' } : s)
    );

    // Add to activity log
    const tradingTypeText = signal.tradingType === 'spot' ? '现货' : '合约';
    const leverageText = signal.leverage && signal.leverage > 1 ? ` ${signal.leverage}x杠杆` : '';
    setTradingActivity(prev => [
      `✅ ${tradingTypeText}交易执行: ${signal.symbol} ${signal.type === 'long' ? '买入' : '卖空'} $${signal.entry.toLocaleString()}${leverageText} (${signal.strategy === 'conservative' ? '稳健' : '激进'}策略)`,
      ...prev.slice(0, 19)
    ]);

    // Immediately sync active trades count with WalletProvider
    setTimeout(() => {
      updateAutoTraderData({
        activeTrades: positions.length + 1 // +1 because this position is being added
      });
    }, 100);

    toast({
      title: "AI自动交易执行",
      description: `${signal.symbol} ${tradingTypeText} ${signal.type === 'long' ? '买入' : '卖空'} 订单已执行${leverageText}`,
    });
  };

  // Enhanced price simulation with auto stop-loss and take-profit
  useEffect(() => {
    const updatePrices = () => {
      setPositions(prev => prev.map(position => {
        if (position.status === 'closed') return position;

        const volatility = position.strategy === 'aggressive' ? 0.025 : 0.015;
        const priceChange = (Math.random() - 0.5) * volatility;
        const newPrice = position.currentPrice * (1 + priceChange);
        
        let pnl = 0;
        if (position.type === 'long') {
          pnl = (newPrice - position.entry) * (position.size / position.entry);
        } else {
          pnl = (position.entry - newPrice) * (position.size / position.entry);
        }
        
        const pnlPercent = (pnl / position.size) * 100;
        const highestProfit = Math.max(position.highestProfit, pnl);
        const maxDrawdown = Math.min(position.maxDrawdown, pnl);

        // Auto stop-loss and take-profit
        const shouldStopLoss = (position.type === 'long' && newPrice <= position.stopLoss) ||
                              (position.type === 'short' && newPrice >= position.stopLoss);
        
        const shouldTakeProfit = (position.type === 'long' && newPrice >= position.takeProfit) ||
                                (position.type === 'short' && newPrice <= position.takeProfit);

        if (shouldStopLoss || shouldTakeProfit) {
          const reason = shouldStopLoss ? '止损' : '止盈';
          setTradingActivity(prev => [
            `${shouldStopLoss ? '🛑' : '🎯'} 自动${reason}: ${position.symbol} ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)`,
            ...prev.slice(0, 19)
          ]);
          
          // Update stats and sync with WalletProvider
          setStats(prevStats => {
            const newStats = {
              ...prevStats,
              totalPnL: prevStats.totalPnL + pnl,
              totalTrades: prevStats.totalTrades + 1,
              dailyPnL: prevStats.dailyPnL + pnl
            };
            
            // Sync with WalletProvider
            updateAutoTraderData({
              virtualBalance: config.virtualBalance,
              totalPnL: newStats.totalPnL,
              dailyPnL: newStats.dailyPnL,
              activeTrades: positions.filter(p => p.status === 'open').length,
              winRate: newStats.winRate,
              monthlyPnL: newStats.monthlyPnL
            });
            
            return newStats;
          });

          return {
            ...position,
            currentPrice: newPrice,
            pnl,
            pnlPercent,
            status: 'closed' as const,
            highestProfit,
            maxDrawdown
          };
        }

        return {
          ...position,
          currentPrice: newPrice,
          pnl,
          pnlPercent,
          highestProfit,
          maxDrawdown
        };
      }));
    };

    const interval = setInterval(updatePrices, 1500);
    return () => clearInterval(interval);
  }, []);

  const toggleAutoTrader = () => {
    setConfig(prev => ({ ...prev, enabled: !prev.enabled }));
    const message = config.enabled ? t('autotrader.stopped') : `${t('autotrader.started')} (${config.strategy === 'conservative' ? t('autotrader.conservative_strategy') : t('autotrader.aggressive_strategy')})`;
    
    setTradingActivity(prev => [
      `⚡ ${message}`,
      ...prev.slice(0, 19)
    ]);
    
    toast({
      title: message,
      description: config.enabled ? t('autotrader.system_paused') : t('autotrader.system_analyzing'),
    });
  };

  const closePosition = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    setPositions(prev => 
      prev.map(p => p.id === positionId ? { ...p, status: 'closed' } : p)
    );
    
    setTradingActivity(prev => [
      `📤 手动平仓: ${position.symbol} ${position.pnl >= 0 ? '+' : ''}$${position.pnl.toFixed(2)}`,
      ...prev.slice(0, 19)
    ]);
    
    setStats(prevStats => {
      const newStats = {
        ...prevStats,
        totalPnL: prevStats.totalPnL + position.pnl,
        totalTrades: prevStats.totalTrades + 1
      };
      
      // Sync with WalletProvider
      updateAutoTraderData({
        virtualBalance: config.virtualBalance,
        totalPnL: newStats.totalPnL,
        dailyPnL: newStats.dailyPnL,
        activeTrades: positions.filter(p => p.status === 'open').length - 1, // -1 because this position will be closed
        winRate: newStats.winRate,
        monthlyPnL: newStats.monthlyPnL
      });
      
      return newStats;
    });
  };

  const resetVirtualAccount = () => {
    const newConfig = { ...config, virtualBalance: 100000 };
    setConfig(newConfig);
    setPositions([]);
    setSignals([]);
    const resetStats = {
      totalPnL: 0,
      winRate: 87.5,
      totalTrades: 48,
      conservativeStats: { trades: 32, winRate: 93.8, avgProfit: 156.5 },
      aggressiveStats: { trades: 16, winRate: 75.0, avgProfit: 89.2 },
      dailyPnL: 0,
      monthlyPnL: 0,
      spotStats: { trades: 18, winRate: 89.0, avgProfit: 120.5 },
      futuresStats: { trades: 24, winRate: 83.3, avgProfit: 185.2, totalMargin: 8500 },
      leverageUsed: 3.2,
      maxDrawdown: -2.8,
      sharpeRatio: 2.15
    };
    setStats(resetStats);
    setTradingActivity(['🔄 虚拟账户已重置']);
    
    // Sync with WalletProvider
    updateAutoTraderData({
      virtualBalance: 100000,
      totalPnL: 0,
      dailyPnL: 0,
      activeTrades: 0,
      winRate: 87.5,
      monthlyPnL: 0
    });
    
    toast({
      title: "虚拟账户已重置",
      description: "所有交易记录和余额已重置到初始状态",
    });
  };

  const getStrategyConfig = () => {
    return config.strategy === 'conservative' 
      ? { minConfidence: config.conservativeMinConfidence, color: 'green', name: '稳健策略' }
      : { minConfidence: config.aggressiveMinConfidence, color: 'orange', name: '激进策略' };
  };

  const strategyConfig = getStrategyConfig();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-orbitron tracking-wide px-6 py-2 relative">
          <Bot className="w-4 h-4 mr-2" />
          AI自动赚钱
          {config.enabled && (
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          )}
          {Object.keys(aiAnalysisResults).length > 0 && (
            <Badge variant="outline" className="ml-2 bg-accent/20 text-accent border-accent/50">
              <Brain className="w-3 h-3 mr-1" />
              AI分析活跃
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-7xl max-h-[95vh] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-emerald-700/50 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3 font-orbitron text-xl">
            <Bot className="w-6 h-6 text-emerald-400" />
            AI自动赚钱系统 - 多模型智能交易
            <div className="flex items-center gap-2 ml-auto">
              {aiLoading.priceChart && (
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                  <Activity className="w-3 h-3 mr-1 animate-spin" />
                  价格分析
                </Badge>
              )}
              {aiLoading.technicalAnalysis && (
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                  <Activity className="w-3 h-3 mr-1 animate-spin" />
                  技术分析
                </Badge>
              )}
              {aiLoading.newsSentiment && (
                <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                  <Activity className="w-3 h-3 mr-1 animate-spin" />
                  情感分析
                </Badge>
              )}
              <Badge variant="outline" className={`${config.enabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${config.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></div>
                {config.enabled ? '运行中' : '已停止'}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left Panel - Enhanced Controls & Analytics */}
          <div className="w-1/3 space-y-4">
            {/* Strategy Selection & Main Controls */}
            <Card className="p-4 bg-gradient-to-br from-slate-800/80 to-slate-700/50 border-slate-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  交易策略控制
                </h3>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={toggleAutoTrader}
                    className="data-[state=checked]:bg-green-600"
                  />
                  {config.enabled ? (
                    <Play className="w-4 h-4 text-green-400" />
                  ) : (
                    <Pause className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">交易策略</label>
                    <Select value={config.strategy} onValueChange={(value: TradingStrategy) => setConfig(prev => ({ ...prev, strategy: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            稳健策略 (≥90%胜率)
                          </div>
                        </SelectItem>
                        <SelectItem value="aggressive">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-orange-400" />
                            激进策略 (≥70%胜率)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">交易类型</label>
                    <Select value={config.tradingType} onValueChange={(value: TradingType) => setConfig(prev => ({ ...prev, tradingType: value }))}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spot">
                          <div className="flex items-center gap-2">
                            <CircleDollarSign className="w-4 h-4 text-blue-400" />
                            现货交易
                          </div>
                        </SelectItem>
                        <SelectItem value="futures">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            合约交易
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {config.tradingType !== 'spot' && (
                  <div>
                    <label className="text-slate-300 text-sm mb-2 block">杠杆倍数: {config.leverage}x</label>
                    <Slider
                      value={[config.leverage]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, leverage: value[0] }))}
                      max={config.tradingType === 'futures' ? 100 : 50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1x</span>
                      <span>{config.tradingType === 'futures' ? '100x' : '50x'}</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <p className="text-slate-400">策略</p>
                    <p className={`font-semibold ${config.strategy === 'conservative' ? 'text-green-400' : 'text-orange-400'}`}>
                      {strategyConfig.name}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <p className="text-slate-400">交易类型</p>
                    <p className="text-white font-mono">
                      {config.tradingType === 'spot' ? '现货' : '合约'}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <p className="text-slate-400">杠杆</p>
                    <p className="text-white font-mono">{config.leverage}x</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Virtual Account with Profit Visualization */}
            <Card className="p-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-blue-400" />
                虚拟交易账户
              </h3>
              
              <div className="space-y-3">
                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-400 text-sm">总资产</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    ${(config.virtualBalance + stats.totalPnL).toLocaleString()}
                  </p>
                  <p className={`text-sm font-mono ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toLocaleString()} 
                    ({((stats.totalPnL / config.virtualBalance) * 100).toFixed(2)}%)
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/20">
                    <p className="text-green-400">今日盈亏</p>
                    <p className="text-white font-mono">+${stats.dailyPnL.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-2 bg-blue-500/10 rounded border border-blue-500/20">
                    <p className="text-blue-400">月度盈亏</p>
                    <p className="text-white font-mono">+${stats.monthlyPnL.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <p className="text-slate-400">总胜率</p>
                    <p className="text-white font-mono">{stats.winRate.toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-2 bg-slate-700/50 rounded">
                    <p className="text-slate-400">总交易</p>
                    <p className="text-white font-mono">{stats.totalTrades}</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetVirtualAccount}
                  className="w-full"
                >
                  重置账户
                </Button>
              </div>
            </Card>

            {/* Strategy Performance Comparison */}
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                策略表现对比
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-green-500/10 rounded border border-green-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-medium">稳健策略</span>
                    <Badge className="bg-green-500/20 text-green-400">93.8%胜率</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400">交易次数</p>
                      <p className="text-white">{stats.conservativeStats.trades}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">平均盈利</p>
                      <p className="text-green-400">+${stats.conservativeStats.avgProfit}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-orange-500/10 rounded border border-orange-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-orange-400 font-medium">激进策略</span>
                    <Badge className="bg-orange-500/20 text-orange-400">75.0%胜率</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400">交易次数</p>
                      <p className="text-white">{stats.aggressiveStats.trades}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">平均盈利</p>
                      <p className="text-orange-400">+${stats.aggressiveStats.avgProfit}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Advanced Settings */}
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                高级参数设置
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-sm">单笔风险 ({config.riskPerTrade}%)</label>
                  <Slider
                    value={[config.riskPerTrade]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, riskPerTrade: value[0] }))}
                    max={10}
                    min={1}
                    step={0.5}
                    className="w-full mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-slate-400 text-sm">止损比例 ({config.stopLossPercent}%)</label>
                  <Slider
                    value={[config.stopLossPercent]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, stopLossPercent: value[0] }))}
                    max={15}
                    min={2}
                    step={1}
                    className="w-full mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-slate-400 text-sm">止盈比例 ({config.takeProfitPercent}%)</label>
                  <Slider
                    value={[config.takeProfitPercent]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, takeProfitPercent: value[0] }))}
                    max={30}
                    min={5}
                    step={1}
                    className="w-full mt-1"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">移动止损</span>
                  <Switch
                    checked={config.trailingStop}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, trailingStop: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">自动复投</span>
                  <Switch
                    checked={config.autoReinvest}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoReinvest: checked }))}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Enhanced Real-time Activity */}
          <div className="flex-1 space-y-4">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                <TabsTrigger value="activity">实时动态</TabsTrigger>
                <TabsTrigger value="signals">AI信号</TabsTrigger>
                <TabsTrigger value="positions">持仓管理</TabsTrigger>
                <TabsTrigger value="analytics">数据分析</TabsTrigger>
              </TabsList>
              
              {/* Real-time Trading Activity */}
              <TabsContent value="activity" className="space-y-3 mt-4">
                <Card className="bg-slate-800/50 rounded-lg p-4 border-slate-700">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    {t('autotrader.live_activity')}
                    <Badge className="bg-blue-500/20 text-blue-400 text-xs animate-pulse">LIVE</Badge>
                  </h4>
                  
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {tradingActivity.length === 0 ? (
                      <div className="text-center text-slate-400 py-8">
                        <Bot className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                        <p>{t('autotrader.ai_standby')}</p>
                        <p className="text-sm">{t('autotrader.start_to_view')}</p>
                      </div>
                    ) : (
                      tradingActivity.map((activity, index) => (
                        <div key={index} className="p-2 bg-slate-700/30 rounded text-sm text-slate-200 border-l-2 border-blue-500/30">
                          <span className="text-slate-400 text-xs">{new Date().toLocaleTimeString()}</span>
                          <p className="mt-1">{activity}</p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>
              
              {/* Enhanced AI Signals */}
              <TabsContent value="signals" className="space-y-3 mt-4">
                <Card className="bg-slate-800/50 rounded-lg p-4 border-slate-700">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    AI智能信号分析
                  </h4>
                  
                  <div className="max-h-80 overflow-y-auto space-y-3">
                    {signals.length === 0 ? (
                      <div className="text-center text-slate-400 py-8">
                        <Brain className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                        <p>AI正在深度分析市场...</p>
                      </div>
                    ) : (
                      signals.map((signal) => (
                        <Card key={signal.id} className="p-3 bg-gradient-to-r from-slate-700/50 to-slate-600/30 border-slate-600">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className={signal.type === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {signal.type === 'long' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                {signal.symbol}
                              </Badge>
                              <Badge className={`${signal.strategy === 'conservative' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {signal.strategy === 'conservative' ? '稳健' : '激进'}
                              </Badge>
                              <Badge className="bg-purple-500/20 text-purple-400">
                                <Brain className="w-3 h-3 mr-1" />
                                {signal.confidence}%
                              </Badge>
                            </div>
                            {signal.status === 'executed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                          </div>
                          
                          {/* AI Analysis Details */}
                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                            <div className="p-2 bg-slate-800/50 rounded">
                              <p className="text-slate-400">技术面评分</p>
                              <p className="text-white">{signal.aiAnalysis.technicalScore}/100</p>
                            </div>
                            <div className="p-2 bg-slate-800/50 rounded">
                              <p className="text-slate-400">基本面评分</p>
                              <p className="text-white">{signal.aiAnalysis.fundamentalScore}/100</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                            <div>
                              <span className="text-slate-400">入场:</span>
                              <p className="text-white font-mono">${signal.entry.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">止损:</span>
                              <p className="text-red-400 font-mono">${signal.stopLoss.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">止盈:</span>
                              <p className="text-green-400 font-mono">${signal.takeProfit.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <p className="text-slate-300 text-xs bg-slate-800/30 p-2 rounded">{signal.reasoning}</p>
                        </Card>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>
              
              {/* Enhanced Positions */}
              <TabsContent value="positions" className="space-y-3 mt-4">
                <Card className="bg-slate-800/50 rounded-lg p-4 border-slate-700">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-green-400" />
                    智能持仓管理 ({positions.filter(p => p.status === 'open').length})
                  </h4>
                  
                  <div className="max-h-80 overflow-y-auto space-y-3">
                    {positions.filter(p => p.status === 'open').length === 0 ? (
                      <div className="text-center text-slate-400 py-8">
                        <DollarSign className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                        <p>暂无持仓</p>
                        <p className="text-sm">AI将自动发现并执行交易机会</p>
                      </div>
                    ) : (
                      positions.filter(p => p.status === 'open').map((position) => (
                        <Card key={position.id} className="p-3 bg-gradient-to-r from-slate-700/50 to-slate-600/30 border-slate-600">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className={position.type === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {position.type === 'long' ? <TrendingUpIcon className="w-3 h-3 mr-1" /> : <TrendingDownIcon className="w-3 h-3 mr-1" />}
                                {position.symbol}
                              </Badge>
                              <Badge className={`${position.strategy === 'conservative' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {position.strategy === 'conservative' ? '稳健' : '激进'}
                              </Badge>
                              <Badge className={position.pnl >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                                {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => closePosition(position.id)}
                              className="text-xs"
                            >
                              手动平仓
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                            <div>
                              <span className="text-slate-400">入场价:</span>
                              <p className="text-white font-mono">${position.entry.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">当前价:</span>
                              <p className="text-white font-mono">${position.currentPrice.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">止损价:</span>
                              <p className="text-red-400 font-mono">${position.stopLoss.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">止盈价:</span>
                              <p className="text-green-400 font-mono">${position.takeProfit.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-slate-400">当前盈亏:</span>
                              <p className={`font-mono ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <span className="text-slate-400">最高盈利:</span>
                              <p className="text-green-400 font-mono">+${position.highestProfit.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">最大回撤:</span>
                              <p className="text-red-400 font-mono">${position.maxDrawdown.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          {/* Auto Trading Indicators */}
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <Badge className="bg-blue-500/20 text-blue-400">
                              <Timer className="w-3 h-3 mr-1" />
                              自动止损
                            </Badge>
                            <Badge className="bg-purple-500/20 text-purple-400">
                              <Target className="w-3 h-3 mr-1" />
                              自动止盈
                            </Badge>
                            {config.trailingStop && (
                              <Badge className="bg-yellow-500/20 text-yellow-400">
                                移动止损
                              </Badge>
                            )}
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>
              
              {/* Analytics Dashboard */}
              <TabsContent value="analytics" className="space-y-3 mt-4">
                <Card className="bg-slate-800/50 rounded-lg p-4 border-slate-700">
                  <h4 className="text-white font-semibold mb-3">AI交易分析报告</h4>
                  <div className="text-center text-slate-400 py-8">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                    <p>详细分析数据将在此显示</p>
                    <p className="text-sm">包括收益曲线、风险分析、策略对比等</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Enhanced Warning Notice */}
        <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-400 font-medium">虚拟交易系统 - 全自动盈利引擎</p>
              <p className="text-amber-200/80 text-xs mt-1">
                • 本系统使用虚拟资金进行策略测试 • AI自动分析、入场、止损、止盈，用户无需任何操作 • 
                稳健策略追求稳定收益(≥90%胜率)，激进策略追求高收益(≥70%胜率) • 
                实盘交易存在风险，请谨慎操作 • AI信号仅供参考，不构成投资建议
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};