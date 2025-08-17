import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, DollarSign, Brain, Signal } from "lucide-react";
import { DateRange } from "react-day-picker";
import { CustomDateRangePicker } from "./CustomDateRangePicker";

interface TradingStats {
  aiAccuracy: number;
  activeSignals: number;
  periodReturn: number;
  profitableTrades: number;
  totalTrades: number;
  totalProfit: number;
  avgWinRate: number;
  bestTrade: number;
  worstTrade: number;
}

export const TradingAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    return { from: oneMonthAgo, to: today };
  });

  const [stats, setStats] = useState<TradingStats>({
    aiAccuracy: 0,
    activeSignals: 0,
    periodReturn: 0,
    profitableTrades: 0,
    totalTrades: 0,
    totalProfit: 0,
    avgWinRate: 0,
    bestTrade: 0,
    worstTrade: 0,
  });

  // 模拟根据日期范围获取数据
  const fetchStatsForDateRange = (range: DateRange | undefined) => {
    if (!range?.from || !range.to) return;

    const daysDiff = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
    
    // 根据时间范围模拟不同的数据
    const baseMultiplier = Math.max(1, daysDiff / 30); // 基于月份的倍数
    
    setStats({
      aiAccuracy: Math.min(99, Math.floor(85 + Math.random() * 10)),
      activeSignals: Math.floor(Math.random() * 15 * baseMultiplier),
      periodReturn: parseFloat((Math.random() * 50 * baseMultiplier - 10).toFixed(1)),
      profitableTrades: Math.floor(Math.random() * 20 * baseMultiplier),
      totalTrades: Math.floor(Math.random() * 30 * baseMultiplier + 5),
      totalProfit: parseFloat((Math.random() * 5000 * baseMultiplier - 1000).toFixed(2)),
      avgWinRate: Math.floor(70 + Math.random() * 25),
      bestTrade: parseFloat((Math.random() * 1000 + 200).toFixed(2)),
      worstTrade: -parseFloat((Math.random() * 500 + 50).toFixed(2)),
    });
  };

  useEffect(() => {
    fetchStatsForDateRange(dateRange);
  }, [dateRange]);

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}$${Math.abs(amount).toLocaleString()}`;
  };

  const formatPercentage = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="p-6">
        {/* 自定义时间选择器 */}
        <div className="mb-6">
          <CustomDateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange}
          />
        </div>

        {/* 主要统计指标 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* AI精准度 */}
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {stats.aiAccuracy.toFixed(1)}%
            </div>
            <div className="text-slate-400 text-sm mb-2">AI精准度</div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400 transition-all duration-500"
                style={{ width: `${stats.aiAccuracy}%` }}
              />
            </div>
          </div>

          {/* 活跃信号 */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {stats.activeSignals}
            </div>
            <div className="text-slate-400 text-sm mb-2">活跃信号</div>
            <div className="text-xs text-slate-500">当前持仓数量</div>
          </div>

          {/* 期间收益率 */}
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              stats.periodReturn >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercentage(stats.periodReturn)}
            </div>
            <div className="text-slate-400 text-sm mb-2">期间收益率</div>
            <div className="flex items-center justify-center">
              {stats.periodReturn >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* 详细统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 盈利交易 */}
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-sm text-slate-300">盈利交易</span>
            </div>
            <div className="text-xl font-bold text-green-400">
              {stats.profitableTrades}/{stats.totalTrades}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              胜率 {stats.totalTrades > 0 ? Math.round((stats.profitableTrades / stats.totalTrades) * 100) : 0}%
            </div>
          </div>

          {/* 总盈亏 */}
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm text-slate-300">总盈亏</span>
            </div>
            <div className={`text-xl font-bold ${
              stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(stats.totalProfit)}
            </div>
            <div className="text-xs text-slate-500 mt-1">累计收益</div>
          </div>

          {/* 最佳交易 */}
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-sm text-slate-300">最佳交易</span>
            </div>
            <div className="text-xl font-bold text-green-400">
              {formatCurrency(stats.bestTrade)}
            </div>
            <div className="text-xs text-slate-500 mt-1">单笔最高</div>
          </div>

          {/* 最差交易 */}
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-sm text-slate-300">最差交易</span>
            </div>
            <div className="text-xl font-bold text-red-400">
              {formatCurrency(stats.worstTrade)}
            </div>
            <div className="text-xs text-slate-500 mt-1">单笔最低</div>
          </div>
        </div>

        {/* 时间范围显示 */}
        {dateRange?.from && dateRange.to && (
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
              <Signal className="w-4 h-4" />
              <span>
                数据统计时间: {dateRange.from.toLocaleDateString('zh-CN')} - {dateRange.to.toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};