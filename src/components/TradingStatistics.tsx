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
  const [timeRange, setTimeRange] = useState("1month");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 计算统计数据
  const calculateStats = () => {
    // AI虚拟投资组合价值 = 账户余额 + 当前持仓的浮动盈亏
    const currentPositionsPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
    const totalValue = virtualAccount.balance + currentPositionsPnL;
    
    // 使用虚拟账户的当前余额作为基准，而不是固定的100000
    const baseBalance = virtualAccount.balance; // 当前账户余额作为投资组合基础价值
    const totalReturn = virtualAccount.totalPnL !== 0 ? 
      (virtualAccount.totalPnL / baseBalance) * 100 : 0;
    
    // 计算盈利交易数
    const profitableTrades = tradingHistory.filter(h => h.includes('✅')).length;
    const totalExecutedTrades = tradingHistory.filter(h => h.includes('自动执行')).length;
    
    // 计算AI精准度（基于持仓的平均置信度）
    const avgConfidence = positions.length > 0 
      ? positions.reduce((sum, pos) => sum + pos.confidence, 0) / positions.length 
      : 0;

    return {
      totalValue: baseBalance, // 直接使用账户余额作为投资组合价值
      totalReturn,
      profitableTrades,
      totalExecutedTrades,
      avgConfidence,
      activeSignals: positions.length,
      currentPositionsPnL
    };
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
              <Wallet className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-medium text-slate-300">AI虚拟投资组合</h3>
              <Badge className="text-xs bg-purple-600">1</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-400">
              总价值 {stats.currentPositionsPnL !== 0 && (
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
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <h3 className="text-sm font-medium text-slate-300">日盈亏</h3>
            </div>
            <div className={`text-2xl font-bold mb-1 ${virtualAccount.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {virtualAccount.dailyPnL >= 0 ? '+' : ''}${virtualAccount.dailyPnL.toFixed(2)}
            </div>
            <div className={`text-xs ${virtualAccount.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {virtualAccount.dailyPnL >= 0 ? '+' : ''}{((virtualAccount.dailyPnL / 100000) * 100).toFixed(2)}%
            </div>
          </div>
        </Card>

        <Card className="bg-slate-900/95 border-slate-700/50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <h3 className="text-sm font-medium text-slate-300">活跃交易</h3>
              <Badge className="text-xs bg-yellow-600">P</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {virtualAccount.activePositions}
            </div>
            <div className="text-xs text-slate-400">当前持仓</div>
          </div>
        </Card>
      </div>

      {/* 详细统计 */}
      <Card className="bg-slate-900/95 border-slate-700/50">
        <div className="p-4">
          {/* 时间范围选择 */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">数据统计时间段:</span>
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px] bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value} className="text-white hover:bg-slate-700">
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
                  disabled={timeRange !== "custom"}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  选择日期
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setShowDatePicker(false);
                  }}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Button 
              variant="outline" 
              className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              交易记录
            </Button>
          </div>

          {/* 核心指标 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {stats.avgConfidence.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-400 mb-4">AI精准度</div>
              <div className="text-xs text-slate-500">
                {stats.profitableTrades}/{stats.totalExecutedTrades} 盈利交易
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {stats.activeSignals}
              </div>
              <div className="text-sm text-slate-400 mb-4">活跃信号</div>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-1 bg-blue-400 rounded"></div>
                <div className="w-2 h-1 bg-blue-400 rounded"></div>
                <div className="w-2 h-1 bg-slate-600 rounded"></div>
              </div>
              <div className="text-xs text-slate-500 mt-2">当前持仓数量</div>
            </div>

            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${stats.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.totalReturn >= 0 ? '+' : ''}{stats.totalReturn.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-400 mb-4">期间收益率</div>
              <div className={`text-xs ${virtualAccount.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {virtualAccount.totalPnL >= 0 ? '+' : ''}${virtualAccount.totalPnL.toFixed(2)} 总盈亏
              </div>
            </div>
          </div>

          {/* 时间统计 */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <BarChart3 className="w-4 h-4" />
              <span>数据统计时间: {format(subMonths(new Date(), 1), 'yyyy/M/d')} - {format(new Date(), 'yyyy/M/d')}</span>
            </div>
          </div>

          {/* 状态指示 */}
          {!isEnabled && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-orange-400">
                <Activity className="w-4 h-4" />
                <span className="text-sm">AI自动交易已暂停，统计数据暂停更新</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};