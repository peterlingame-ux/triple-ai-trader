import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CalendarDays, TrendingUp, TrendingDown, Clock, 
  DollarSign, Activity, Filter, RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Position {
  id: string;
  symbol: string;
  type: string;
  status: string;
  entry_price: number;
  current_price: number;
  position_size: number;
  leverage?: number;
  pnl: number;
  pnl_percent: number;
  confidence: number;
  opened_at: string;
  closed_at?: string;
  ai_reasoning?: string;
  contract_type?: string;
  trading_type?: string;
}

interface TradingHistoryPanelProps {
  className?: string;
}

export const TradingHistoryPanel = ({ className = "" }: TradingHistoryPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 默认最近30天
    to: new Date()
  });

  // 获取交易记录
  const fetchPositions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('positions')
        .select('*')
        .eq('user_id', user.id)
        .order('opened_at', { ascending: false });

      // 如果有日期范围，添加过滤条件
      if (dateRange.from) {
        query = query.gte('opened_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        query = query.lte('opened_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast({
        title: "获取交易记录失败",
        description: "请稍后重试或检查网络连接",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和用户变化时获取数据
  useEffect(() => {
    fetchPositions();
  }, [user]);

  // 日期范围变化时重新获取数据
  useEffect(() => {
    if (dateRange.from || dateRange.to) {
      fetchPositions();
    }
  }, [dateRange]);

  // 格式化价格
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), "MM/dd HH:mm");
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'liquidated': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // 计算统计数据
  const stats = {
    totalTrades: positions.length,
    profitableTrades: positions.filter(p => p.pnl > 0).length,
    totalPnL: positions.reduce((sum, p) => sum + p.pnl, 0),
    winRate: positions.length > 0 ? (positions.filter(p => p.pnl > 0).length / positions.length * 100) : 0
  };

  return (
    <Card className={cn("bg-slate-900/95 border-slate-700/50 shadow-2xl", className)}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">交易记录回看</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 bg-slate-700/50 border-slate-600 text-slate-300 text-xs hover:bg-slate-600/50",
                    !dateRange.from && !dateRange.to && "text-slate-400"
                  )}
                >
                  <CalendarDays className="w-3 h-3 mr-1" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MM/dd")} - {format(dateRange.to, "MM/dd")}
                      </>
                    ) : (
                      format(dateRange.from, "MM/dd")
                    )
                  ) : (
                    "选择日期"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600 z-50" align="end">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to
                  }}
                  onSelect={(range) => {
                    setDateRange({
                      from: range?.from,
                      to: range?.to
                    });
                  }}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto bg-slate-800 text-slate-300")}
                />
              </PopoverContent>
            </Popover>
            
            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPositions}
              disabled={loading}
              className="h-8 bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
            >
              <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <div className="text-lg font-mono font-bold text-white">{stats.totalTrades}</div>
            <div className="text-xs text-slate-400">总交易</div>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <div className="text-lg font-mono font-bold text-green-400">{stats.profitableTrades}</div>
            <div className="text-xs text-slate-400">盈利交易</div>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <div className={`text-lg font-mono font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalPnL >= 0 ? '+' : ''}{formatPrice(stats.totalPnL)}
            </div>
            <div className="text-xs text-slate-400">总盈亏</div>
          </div>
          <div className="bg-slate-800/60 rounded-lg p-3 text-center">
            <div className="text-lg font-mono font-bold text-blue-400">{stats.winRate.toFixed(1)}%</div>
            <div className="text-xs text-slate-400">胜率</div>
          </div>
        </div>

        {/* Trading History List */}
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                <p className="text-slate-400">加载交易记录中...</p>
              </div>
            ) : positions.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p className="text-slate-400">暂无交易记录</p>
                <p className="text-xs text-slate-500 mt-1">请调整日期范围或开始交易</p>
              </div>
            ) : (
              positions.map((position) => (
                <Card key={position.id} className="bg-slate-800/40 border-slate-700/50 p-3">
                  <div className="flex items-center justify-between">
                    {/* Left: Symbol and Type */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                        <span className="text-xs font-bold text-blue-400">{position.symbol.slice(0, 3)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{position.symbol}</span>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs px-2 py-0.5", getStatusColor(position.status))}
                          >
                            {position.status.toUpperCase()}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs px-2 py-0.5",
                              position.type.toLowerCase() === 'long' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            )}
                          >
                            {position.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(position.opened_at)}
                          </span>
                          {position.leverage && position.leverage > 1 && (
                            <span className="text-yellow-400">{position.leverage}x杠杆</span>
                          )}
                          <span className="text-blue-400">{position.confidence}%置信度</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: P&L and Details */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <div className={`flex items-center gap-1 ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {position.pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span className="text-sm font-mono font-bold">
                            {position.pnl >= 0 ? '+' : ''}{formatPrice(position.pnl)}
                          </span>
                        </div>
                        <span className={`text-xs font-mono ${position.pnl_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ({position.pnl_percent >= 0 ? '+' : ''}{position.pnl_percent.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-0.5">
                        <div>入场: {formatPrice(position.entry_price)}</div>
                        <div>当前: {formatPrice(position.current_price)}</div>
                        <div>仓位: {position.position_size.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Reasoning (if available) */}
                  {position.ai_reasoning && (
                    <div className="mt-2 pt-2 border-t border-slate-700/50">
                      <div className="text-xs text-slate-300 bg-slate-700/30 rounded p-2">
                        <span className="text-amber-400 font-medium">AI分析: </span>
                        {position.ai_reasoning}
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};