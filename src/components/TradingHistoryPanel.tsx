import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, History, ArrowUp, ArrowDown, Clock, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  closed_at: string | null;
  trading_type: string;
}

interface TradingHistoryPanelProps {
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onClose: () => void;
}

export const TradingHistoryPanel = ({ dateRange, onClose }: TradingHistoryPanelProps) => {
  const { user } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'profit' | 'loss'>('all');

  useEffect(() => {
    fetchTradingHistory();
  }, [user, dateRange]);

  const fetchTradingHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('positions')
        .select('*')
        .eq('user_id', user.id)
        .order('opened_at', { ascending: false });

      // Apply date range filter if provided
      if (dateRange?.from) {
        query = query.gte('opened_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('opened_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching trading history:', error);
        return;
      }

      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching trading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPositions = positions.filter(position => {
    if (filter === 'profit') return position.pnl > 0;
    if (filter === 'loss') return position.pnl < 0;
    return true;
  });

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const winCount = positions.filter(pos => pos.pnl > 0).length;
  const lossCount = positions.filter(pos => pos.pnl < 0).length;
  const winRate = positions.length > 0 ? (winCount / positions.length) * 100 : 0;

  if (!user) {
    return (
      <Card className="bg-slate-900/95 border-slate-700/50 shadow-2xl">
        <div className="p-6 text-center">
          <History className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">交易记录</h3>
          <p className="text-slate-400 text-sm">请先登录查看您的交易历史记录</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/95 border-slate-700/50 shadow-2xl">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-200">交易记录</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            关闭
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">总交易</div>
            <div className="text-lg font-mono font-bold text-white">{positions.length}</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">胜率</div>
            <div className="text-lg font-mono font-bold text-green-400">{winRate.toFixed(1)}%</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">盈利/亏损</div>
            <div className="text-sm font-mono text-slate-300">{winCount}/{lossCount}</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">总盈亏</div>
            <div className={`text-lg font-mono font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className={cn(
              "text-xs",
              filter === 'all' 
                ? "bg-slate-700 text-white hover:bg-slate-600" 
                : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            )}
          >
            全部 ({positions.length})
          </Button>
          <Button
            variant={filter === 'profit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('profit')}
            className={cn(
              "text-xs",
              filter === 'profit' 
                ? "bg-green-700 text-white hover:bg-green-600" 
                : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            )}
          >
            盈利 ({winCount})
          </Button>
          <Button
            variant={filter === 'loss' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('loss')}
            className={cn(
              "text-xs",
              filter === 'loss' 
                ? "bg-red-700 text-white hover:bg-red-600" 
                : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            )}
          >
            亏损 ({lossCount})
          </Button>
        </div>

        {/* Trading History List */}
        <ScrollArea className="h-80">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-400">加载中...</div>
            </div>
          ) : filteredPositions.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-400 text-center">
                <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <div>暂无交易记录</div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPositions.map((position) => (
                <div
                  key={position.id}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30 px-2 py-0.5"
                      >
                        {position.symbol}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs px-2 py-0.5",
                          position.type === 'long' 
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        )}
                      >
                        {position.type === 'long' ? '做多' : '做空'}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs px-2 py-0.5",
                          position.status === 'closed' 
                            ? "bg-slate-500/10 text-slate-400 border-slate-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        )}
                      >
                        {position.status === 'closed' ? '已平仓' : '持仓中'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {position.pnl >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span className={`text-sm font-mono font-bold ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                      </span>
                      <span className={`text-xs ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ({position.pnl_percent >= 0 ? '+' : ''}{position.pnl_percent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-slate-400 mb-1">入场价格</div>
                      <div className="text-slate-200 font-mono">${position.entry_price.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">当前价格</div>
                      <div className="text-slate-200 font-mono">${position.current_price.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">持仓大小</div>
                      <div className="text-slate-200 font-mono">{position.position_size.toFixed(4)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-700/50">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>开仓: {format(new Date(position.opened_at), 'MM/dd HH:mm')}</span>
                      {position.closed_at && (
                        <>
                          <span className="mx-1">•</span>
                          <span>平仓: {format(new Date(position.closed_at), 'MM/dd HH:mm')}</span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {position.trading_type || 'spot'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </Card>
  );
};