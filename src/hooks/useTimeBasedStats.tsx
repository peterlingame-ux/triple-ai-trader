import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface TimeBasedStats {
  aiAccuracy: number;
  activeSignals: number;
  monthlyReturn: number;
  totalTrades: number;
  winningTrades: number;
  totalPnL: number;
  startDate: Date;
  endDate: Date;
}

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

export const useTimeBasedStats = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M');
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // 时间范围选项
  const timeRanges: TimeRange[] = [
    { label: '7天', value: '7D', days: 7 },
    { label: '1个月', value: '1M', days: 30 },
    { label: '3个月', value: '3M', days: 90 },
    { label: '6个月', value: '6M', days: 180 },
    { label: '1年', value: '1Y', days: 365 },
  ];

  // 获取当前时间范围
  const currentTimeRange = useMemo(() => {
    return timeRanges.find(range => range.value === selectedTimeRange) || timeRanges[1];
  }, [selectedTimeRange]);

  // 计算时间范围的开始和结束日期
  const dateRange = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - currentTimeRange.days);
    
    return { startDate, endDate };
  }, [currentTimeRange]);

  // 获取持仓数据
  const fetchPositions = async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', dateRange.startDate.toISOString())
        .lte('created_at', dateRange.endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('获取持仓数据失败:', error);
        return;
      }

      setPositions(data || []);
    } catch (error) {
      console.error('获取持仓数据异常:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 计算统计数据
  const stats: TimeBasedStats = useMemo(() => {
    if (!positions.length) {
      return {
        aiAccuracy: 0,
        activeSignals: 0,
        monthlyReturn: 0,
        totalTrades: 0,
        winningTrades: 0,
        totalPnL: 0,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };
    }

    const totalTrades = positions.length;
    const closedPositions = positions.filter(p => p.status === 'closed');
    const openPositions = positions.filter(p => p.status === 'open');
    const winningTrades = positions.filter(p => (p.pnl || 0) > 0).length;
    
    // AI精准度 = 盈利交易 / 总交易
    const aiAccuracy = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    // 活跃信号 = 当前开仓数量
    const activeSignals = openPositions.length;
    
    // 总盈亏
    const totalPnL = positions.reduce((sum, p) => sum + (p.pnl || 0), 0);
    
    // 月收益率计算（基于10万初始资金）
    const initialCapital = 100000;
    const monthlyReturn = (totalPnL / initialCapital) * 100;

    return {
      aiAccuracy: Math.round(aiAccuracy * 10) / 10, // 保留一位小数
      activeSignals,
      monthlyReturn: Math.round(monthlyReturn * 10) / 10,
      totalTrades,
      winningTrades,
      totalPnL,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    };
  }, [positions, dateRange]);

  // 当时间范围或用户状态改变时重新获取数据
  useEffect(() => {
    fetchPositions();
  }, [selectedTimeRange, isAuthenticated, user, dateRange.startDate, dateRange.endDate]);

  // 实时订阅数据变化
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const channel = supabase
      .channel('time_based_stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'positions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchPositions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user, dateRange]);

  return {
    stats,
    timeRanges,
    selectedTimeRange,
    setSelectedTimeRange,
    isLoading,
    positions,
  };
};