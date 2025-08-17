import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Activity,
  DollarSign,
  Calendar as CalendarIcon,
  Clock,
  PieChart,
  Wallet
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

interface Position {
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

interface VirtualAccount {
  balance: number;
  totalPnL: number;
  dailyPnL: number;
  winRate: number;
  totalTrades: number;
  activePositions: number;
}

interface TradingStatisticsProps {
  virtualAccount: VirtualAccount;
  positions: Position[];
  tradingHistory: string[];
  isEnabled: boolean;
}

export const TradingStatistics = ({ virtualAccount, positions, tradingHistory, isEnabled }: TradingStatisticsProps) => {
  const { t } = useLanguage();
  console.log('=== TradingStatistics 组件渲染 ===');
  console.log('TradingStatistics - 接收到的 virtualAccount prop:', virtualAccount);
  
  const [timeRange, setTimeRange] = useState("1month");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 监听props变化
  useEffect(() => {
    console.log('TradingStatistics - props更新，virtualAccount.balance:', virtualAccount.balance);
  }, [virtualAccount.balance]);

  // 计算统计数据 - 每次组件渲染时都会调用
  const calculateStats = () => {
    // 详细调试日志
    console.log('=== TradingStatistics calculateStats 开始 ===');
    console.log('TradingStatistics - props.virtualAccount:', virtualAccount);
    console.log('TradingStatistics - virtualAccount.balance:', virtualAccount.balance);
    console.log('TradingStatistics - positions:', positions);
    
    // AI虚拟投资组合价值 = 账户余额 + 当前持仓的浮动盈亏
    const currentPositionsPnL = positions.reduce((sum, pos) => {
      console.log('Position PnL:', pos.symbol, pos.pnl);
      return sum + pos.pnl;
    }, 0);
    
    console.log('TradingStatistics - currentPositionsPnL:', currentPositionsPnL);
    
    // 直接使用传入的账户余额作为总价值
    const totalValue = virtualAccount.balance;
    console.log('TradingStatistics - calculated totalValue:', totalValue);
    
    // 计算收益率
    const totalReturn = virtualAccount.totalPnL !== 0 ? 
      (virtualAccount.totalPnL / virtualAccount.balance) * 100 : 0;
    
    // 计算盈利交易数
    const profitableTrades = tradingHistory.filter(h => h.includes('✅')).length;
    const totalExecutedTrades = tradingHistory.filter(h => h.includes('自动执行')).length;
    
    // 计算AI精准度（基于持仓的平均置信度）
    const avgConfidence = positions.length > 0 
      ? positions.reduce((sum, pos) => sum + pos.confidence, 0) / positions.length 
      : 0;

    const result = {
      totalValue: virtualAccount.balance, // 直接使用账户余额
      totalReturn,
      profitableTrades,
      totalExecutedTrades,
      avgConfidence,
      activeSignals: positions.length,
      currentPositionsPnL
    };
    
    console.log('TradingStatistics - calculateStats 结果:', result);
    console.log('=== TradingStatistics calculateStats 结束 ===');
    
    return result;
  };

  const stats = calculateStats();

  // 预设时间范围
  const timeRanges = [
    { value: "1day", label: "1天" },
    { value: "3days", label: "3天" },
    { value: "1week", label: "1周" },
    { value: "1month", label: "1个月" },
    { value: "3months", label: "3个月" },
    { value: "custom", label: "自定义" }
  ];

  return (
    <div className="space-y-6">
      {/* 投资组合概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-slate-300">{t('portfolio.ai_virtual')}</h3>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-400">
              {t('portfolio.total_value')} {stats.currentPositionsPnL !== 0 && (
                <span className={`ml-1 ${stats.currentPositionsPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ({stats.currentPositionsPnL >= 0 ? '+' : ''}${stats.currentPositionsPnL.toFixed(2)} 持仓浮盈)
                </span>
              )}
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-slate-300">{t('portfolio.daily_pnl')}</h3>
            </div>
            <div className={`text-2xl font-bold mb-1 ${virtualAccount.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {virtualAccount.dailyPnL >= 0 ? '+' : ''}${virtualAccount.dailyPnL.toFixed(2)}
            </div>
            <div className={`text-xs ${virtualAccount.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {virtualAccount.dailyPnL >= 0 ? '+' : ''}{((virtualAccount.dailyPnL / virtualAccount.balance) * 100).toFixed(2)}%
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-slate-300">{t('portfolio.active_trades')}</h3>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {virtualAccount.activePositions}
            </div>
            <div className="text-xs text-slate-400">{t('portfolio.current_holdings')}</div>
          </div>
        </Card>
      </div>
    </div>
  );
};