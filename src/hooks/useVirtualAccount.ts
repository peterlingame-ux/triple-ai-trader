import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/hooks/useUserSettings";
import { VirtualAccount, Position, SuperBrainSignal } from "@/types/trading";
import { TRADING_CONFIG } from "@/constants/trading";
import { supabase } from "@/integrations/supabase/client";

// 统一的虚拟账户管理
export const useVirtualAccount = () => {
  const { toast } = useToast();
  const { settings, updateSettings, isAuthenticated } = useUserSettings();
  
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount>(() => ({
    balance: settings.virtual_balance || TRADING_CONFIG.DEFAULT_BALANCE,
    totalPnL: 0,
    dailyPnL: 0,
    winRate: 0,
    totalTrades: 0,
    activePositions: 0  
  }));

  const [positions, setPositions] = useState<Position[]>([]);

  // 更新虚拟账户余额
  const updateBalance = useCallback(async (newBalance: number) => {
    if (newBalance < TRADING_CONFIG.MIN_BALANCE) {
      toast({
        title: "❌ 余额设置失败",
        description: `请输入有效的余额金额（最低${TRADING_CONFIG.MIN_BALANCE} USDT）`,
        variant: "destructive"
      });
      return false;
    }
    
    const success = await updateSettings({ virtual_balance: newBalance });
    
    if (success) {
      setVirtualAccount(prev => ({
        ...prev,
        balance: newBalance
      }));
      
      toast({
        title: "✅ 余额更新成功",
        description: `虚拟账户余额已设置为 ${newBalance.toLocaleString()} USDT`,
      });
      return true;
    }
    
    return false;
  }, [updateSettings, toast]);

  // 执行交易
  const executeTrade = useCallback(async (signal: SuperBrainSignal, strategy: 'conservative' | 'aggressive') => {
    const tradeSize = (virtualAccount.balance * TRADING_CONFIG.RISK_PERCENTAGE) / 100;
    const positionSize = tradeSize / signal.entry;
    
    const newPosition: Position = {
      id: Date.now().toString(),
      symbol: signal.symbol,
      type: signal.action === 'buy' ? 'long' : 'short',
      entryPrice: signal.entry,
      currentPrice: signal.entry,
      size: positionSize,
      pnl: 0,
      pnlPercent: 0,
      confidence: signal.confidence,
      strategy,
      openTime: new Date(),
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit
    };

    // 更新持仓
    setPositions(prev => [...prev, newPosition]);
    
    // 更新虚拟账户
    const updatedAccount = {
      ...virtualAccount,
      balance: virtualAccount.balance - tradeSize,
      totalTrades: virtualAccount.totalTrades + 1,
      activePositions: virtualAccount.activePositions + 1,
    };
    
    setVirtualAccount(updatedAccount);
    await updateSettings({ virtual_balance: updatedAccount.balance });

    // 保存到数据库（如果用户已认证）
    if (isAuthenticated) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('virtual_trades').insert({
            user_id: user.id,
            symbol: newPosition.symbol,
            action: signal.action,
            entry_price: newPosition.entryPrice,
            stop_loss: newPosition.stopLoss,
            take_profit: newPosition.takeProfit,
            position_size: newPosition.size,
            confidence: newPosition.confidence,
            strategy: newPosition.strategy,
            reasoning: signal.reasoning,
            status: 'open'
          });
        }
      } catch (error) {
        console.error('Failed to save trade to database:', error);
      }
    }

    toast({
      title: "🚀 自动交易执行成功",
      description: `${signal.symbol} ${signal.action === 'buy' ? '买入' : '卖出'} | 胜率${signal.confidence}%`,
    });

    return newPosition;
  }, [virtualAccount, updateSettings, isAuthenticated, toast]);

  // 关闭持仓
  const closePosition = useCallback(async (positionId: string, exitPrice: number) => {
    setPositions(prev => {
      const updatedPositions = prev.filter(p => p.id !== positionId);
      const closedPosition = prev.find(p => p.id === positionId);
      
      if (closedPosition) {
        const pnl = closedPosition.type === 'long' 
          ? (exitPrice - closedPosition.entryPrice) * closedPosition.size
          : (closedPosition.entryPrice - exitPrice) * closedPosition.size;
        
        setVirtualAccount(currentAccount => ({
          ...currentAccount,
          balance: currentAccount.balance + (closedPosition.size * closedPosition.entryPrice) + pnl,
          totalPnL: currentAccount.totalPnL + pnl,
          dailyPnL: currentAccount.dailyPnL + pnl,
          activePositions: currentAccount.activePositions - 1,
          winRate: pnl > 0 
            ? ((currentAccount.winRate * (currentAccount.totalTrades - 1)) + 1) / currentAccount.totalTrades
            : (currentAccount.winRate * (currentAccount.totalTrades - 1)) / currentAccount.totalTrades
        }));
      }
      
      return updatedPositions;
    });
  }, []);

  return {
    virtualAccount,
    positions,
    updateBalance,
    executeTrade,
    closePosition,
    setVirtualAccount
  };
};