import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface PortfolioData {
  totalValue: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  activeTrades: number;
  monthlyPnL: number;
  winRate: number;
}

export const usePortfolioData = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    totalValue: 100000.00,
    dailyPnL: 0,
    dailyPnLPercent: 0,
    activeTrades: 0,
    monthlyPnL: 0,
    winRate: 0,
  });

  const { user, isAuthenticated } = useAuth();

  // 计算投资组合数据
  const calculatePortfolioData = async () => {
    if (!isAuthenticated || !user) return;

    try {
      // 获取所有持仓数据
      const { data: positions, error } = await supabase
        .from('positions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching positions:', error);
        return;
      }

      if (!positions || positions.length === 0) {
        setPortfolioData(prev => ({
          ...prev,
          dailyPnL: 0,
          dailyPnLPercent: 0,
          activeTrades: 0,
        }));
        return;
      }

      // 计算活跃交易数量
      const activePositions = positions.filter(p => p.status === 'open');
      const activeTrades = activePositions.length;

      // 计算总盈亏
      const totalPnL = positions.reduce((sum, p) => sum + (p.pnl || 0), 0);
      
      // 计算今日盈亏 (模拟：取最近24小时的持仓盈亏)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayPositions = positions.filter(p => {
        const positionDate = new Date(p.created_at);
        return positionDate >= today;
      });
      
      const dailyPnL = todayPositions.reduce((sum, p) => sum + (p.pnl || 0), 0);
      const dailyPnLPercent = (dailyPnL / 100000) * 100; // 基于初始资金10万计算百分比

      // 计算月度盈亏
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthlyPositions = positions.filter(p => {
        const positionDate = new Date(p.created_at);
        return positionDate >= monthStart;
      });
      
      const monthlyPnL = monthlyPositions.reduce((sum, p) => sum + (p.pnl || 0), 0);

      // 计算胜率
      const closedPositions = positions.filter(p => p.status === 'closed');
      const winningTrades = closedPositions.filter(p => (p.pnl || 0) > 0);
      const winRate = closedPositions.length > 0 ? (winningTrades.length / closedPositions.length) * 100 : 0;

      // 计算总价值 (基础资金 + 总盈亏)
      const totalValue = 100000 + totalPnL;

      setPortfolioData({
        totalValue,
        dailyPnL,
        dailyPnLPercent,
        activeTrades,
        monthlyPnL,
        winRate,
      });

    } catch (error) {
      console.error('Error calculating portfolio data:', error);
    }
  };

  // 监听AI交易事件更新数据
  useEffect(() => {
    const handleAutoTradeExecuted = () => {
      calculatePortfolioData();
    };

    const handlePositionUpdate = () => {
      calculatePortfolioData();
    };

    window.addEventListener('autoTradeExecuted', handleAutoTradeExecuted);
    window.addEventListener('positionUpdated', handlePositionUpdate);

    return () => {
      window.removeEventListener('autoTradeExecuted', handleAutoTradeExecuted);
      window.removeEventListener('positionUpdated', handlePositionUpdate);
    };
  }, [isAuthenticated, user]);

  // 实时订阅持仓变化
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    calculatePortfolioData();

    const channel = supabase
      .channel('portfolio_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'positions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          calculatePortfolioData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user]);

  // 定期更新数据 (每30秒)
  useEffect(() => {
    const interval = setInterval(() => {
      calculatePortfolioData();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  return portfolioData;
};