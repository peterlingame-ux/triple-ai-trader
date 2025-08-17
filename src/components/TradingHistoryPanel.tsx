import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, TrendingDown, Clock, DollarSign, 
  Filter, Search, ChevronLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Position {
  id: string;
  symbol: string;
  type: string;
  status: string;
  entry_price: number;
  current_price: number;
  position_size: number;
  pnl: number;
  pnl_percent: number;
  opened_at: string;
  closed_at?: string;
  confidence: number;
  leverage: number;
}

interface TradingHistoryPanelProps {
  onBack: () => void;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export const TradingHistoryPanel = ({ onBack, dateRange }: TradingHistoryPanelProps) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');

  useEffect(() => {
    fetchPositions();
  }, [dateRange, filterStatus]);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('positions')
        .select('*')
        .order('opened_at', { ascending: false });

      // Apply date range filter
      if (dateRange?.from) {
        query = query.gte('opened_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('opened_at', dateRange.to.toISOString());
      }

      // Apply status filter
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching positions:', error);
        return;
      }

      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalStats = () => {
    const totalPnL = positions.reduce((sum, pos) => sum + (pos.pnl || 0), 0);
    const totalTrades = positions.length;
    const winTrades = positions.filter(pos => (pos.pnl || 0) > 0).length;
    const winRate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;

    return { totalPnL, totalTrades, winTrades, winRate };
  };

  const stats = getTotalStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'closed': return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <Card className="bg-slate-900/95 border-slate-700/50 shadow-2xl">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">交易记录</h3>
              <p className="text-xs text-slate-400">历史交易详细记录</p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
              className="text-xs h-7"
            >
              全部
            </Button>
            <Button
              variant={filterStatus === 'open' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('open')}
              className="text-xs h-7"
            >
              持仓中
            </Button>
            <Button
              variant={filterStatus === 'closed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('closed')}
              className="text-xs h-7"
            >
              已平仓
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">总交易数</div>
            <div className="text-lg font-mono font-bold text-white">
              {stats.totalTrades}
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">胜率</div>
            <div className="text-lg font-mono font-bold text-green-400">
              {stats.winRate.toFixed(1)}%
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">盈利交易</div>
            <div className="text-lg font-mono font-bold text-blue-400">
              {stats.winTrades}
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">总盈亏</div>
            <div className={`text-lg font-mono font-bold ${getPnLColor(stats.totalPnL)}`}>
              {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Trading History */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg">
          <div className="p-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">交易历史明细</span>
            </div>
          </div>

          <ScrollArea className="h-80">
            {loading ? (
              <div className="p-4 text-center text-slate-400">
                加载中...
              </div>
            ) : positions.length === 0 ? (
              <div className="p-4 text-center text-slate-400">
                暂无交易记录
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {positions.map((position) => (
                  <div
                    key={position.id}
                    className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs px-2 py-1", getStatusColor(position.status))}
                        >
                          {position.status === 'open' ? '持仓中' : '已平仓'}
                        </Badge>
                        <div className="text-sm font-semibold text-white">
                          {position.symbol}
                        </div>
                        <div className="text-xs text-slate-400 uppercase">
                          {position.type}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-mono font-bold ${getPnLColor(position.pnl || 0)}`}>
                          {(position.pnl || 0) >= 0 ? '+' : ''}${(position.pnl || 0).toFixed(2)}
                        </div>
                        <div className={`text-xs ${getPnLColor(position.pnl_percent || 0)}`}>
                          ({(position.pnl_percent || 0) >= 0 ? '+' : ''}{(position.pnl_percent || 0).toFixed(2)}%)
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">开仓价:</span>
                        <span className="text-white ml-1 font-mono">
                          ${position.entry_price?.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">当前价:</span>
                        <span className="text-white ml-1 font-mono">
                          ${position.current_price?.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">仓位:</span>
                        <span className="text-white ml-1 font-mono">
                          {position.position_size?.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">杠杆:</span>
                        <span className="text-white ml-1 font-mono">
                          {position.leverage}x
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">信心度:</span>
                        <span className="text-white ml-1 font-mono">
                          {position.confidence}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">开仓时间:</span>
                        <span className="text-white ml-1 font-mono">
                          {format(new Date(position.opened_at), 'MM/dd HH:mm')}
                        </span>
                      </div>
                    </div>

                    {position.closed_at && (
                      <div className="mt-2 pt-2 border-t border-slate-600/50">
                        <div className="text-xs">
                          <span className="text-slate-400">平仓时间:</span>
                          <span className="text-white ml-1 font-mono">
                            {format(new Date(position.closed_at), 'MM/dd HH:mm')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};