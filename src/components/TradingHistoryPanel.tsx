import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  TrendingUp, TrendingDown, Clock, DollarSign, 
  Filter, Search, ChevronLeft, Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PositionDetailsCard } from "./PositionDetailsCard";
import { Position as TradingPosition } from "@/types/trading";
import { useLanguage } from "@/hooks/useLanguage";

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
  margin?: number;
  maintenance_margin_rate?: number;
  mark_price?: number;
  liquidation_price?: number;
  margin_mode?: string;
  contract_type?: string;
  take_profit?: number;
  stop_loss?: number;
  fees?: number;
  funding_fee?: number;
  // 数据库可能返回的其他字段
  [key: string]: any;
}

interface TradingHistoryPanelProps {
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export const TradingHistoryPanel = ({ dateRange }: TradingHistoryPanelProps) => {
  const { t } = useLanguage();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');

  useEffect(() => {
    fetchPositions();
  }, [dateRange, filterStatus]);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      
      // 获取当前用户
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      let query = supabase
        .from('positions')
        .select('*')
        .eq('user_id', user.id)  // 添加用户过滤
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

  // 转换数据库Position为Trading Position以供详情显示
  const convertToTradingPosition = (dbPosition: Position): TradingPosition => {
    return {
      id: dbPosition.id,
      symbol: dbPosition.symbol,
      type: dbPosition.type as 'long' | 'short',
      entryPrice: dbPosition.entry_price,
      currentPrice: dbPosition.current_price || dbPosition.mark_price || 0,
      size: dbPosition.position_size,
      pnl: dbPosition.pnl,
      pnlPercent: dbPosition.pnl_percent,
      confidence: dbPosition.confidence,
      strategy: 'conservative', // 默认策略，可以后续从数据库读取
      openTime: new Date(dbPosition.opened_at),
      stopLoss: dbPosition.stop_loss || 0,
      takeProfit: dbPosition.take_profit || 0,
      contractType: (dbPosition.contract_type as 'spot' | 'perpetual' | 'futures') || 'perpetual',
      leverage: dbPosition.leverage,
      positionAmount: dbPosition.position_size / dbPosition.entry_price,
      margin: dbPosition.margin || 0,
      maintenanceMarginRate: dbPosition.maintenance_margin_rate || 1.0,
      markPrice: dbPosition.mark_price || dbPosition.current_price || 0,
      liquidationPrice: dbPosition.liquidation_price || 0,
      marginMode: (dbPosition.margin_mode as 'isolated' | 'cross') || 'cross',
      unrealizedPnl: dbPosition.pnl,
      fees: dbPosition.fees || 0,
      fundingFee: dbPosition.funding_fee || 0,
    };
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
              <h3 className="text-lg font-semibold text-white">{t('trading.records')}</h3>
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
            <div className="text-xs text-slate-400 mb-1">{t('stats.profitable_trades')}</div>
            <div className="text-lg font-mono font-bold text-blue-400">
              {stats.winTrades}
            </div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">{t('stats.total_pnl')}</div>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 px-2">
                              <Eye className="h-3 w-3 mr-1" />
                              详情
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>持仓详情 - {position.symbol}</DialogTitle>
                            </DialogHeader>
                            <PositionDetailsCard position={convertToTradingPosition(position)} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">开仓价:</span>
                        <span className="text-white ml-1 font-mono">
                          ${position.entry_price?.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">标记价:</span>
                        <span className="text-white ml-1 font-mono">
                          ${(position.mark_price || position.current_price)?.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">保证金:</span>
                        <span className="text-white ml-1 font-mono">
                          ${(position.margin || 0).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">杠杆:</span>
                        <span className="text-white ml-1 font-mono">
                          {position.leverage}x
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">仓位量:</span>
                        <span className="text-white ml-1 font-mono">
                          {position.position_size?.toFixed(4)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">强平价:</span>
                        <span className="text-orange-400 ml-1 font-mono">
                          ${(position.liquidation_price || 0).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">维持保证金率:</span>
                        <span className="text-white ml-1 font-mono">
                          {(position.maintenance_margin_rate || 0).toFixed(2)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">信心度:</span>
                        <span className="text-white ml-1 font-mono">
                          {position.confidence}%
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