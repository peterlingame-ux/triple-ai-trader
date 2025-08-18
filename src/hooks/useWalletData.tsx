import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AutoTraderData {
  virtualBalance: number;
  totalPnL: number;
  dailyPnL: number;
  activeTrades: number;
  winRate: number;
  monthlyPnL: number;
}

interface AutoTraderContextType {
  autoTraderData: AutoTraderData;
  updateAutoTraderData: (data: Partial<AutoTraderData>) => void;
  getPortfolioData: () => {
    totalValue: number;
    dailyChange: number;
    activeTrades: number;
    source: 'autotrader';
  };
}

const AutoTraderContext = createContext<AutoTraderContextType | undefined>(undefined);

export const AutoTraderProvider = ({ children }: { children: ReactNode }) => {
  const [autoTraderData, setAutoTraderData] = useState<AutoTraderData>({
    virtualBalance: 100000,
    totalPnL: 0,
    dailyPnL: 0,
    activeTrades: 0,
    winRate: 87.5,
    monthlyPnL: 0
  });

  // 监听AI交易执行事件来更新数据
  useEffect(() => {
    const handleAutoTradeExecuted = (event: CustomEvent) => {
      const tradeData = event.detail;
      console.log('AutoTraderProvider received trade execution:', tradeData);
      
      // 更新自动交易数据
      setAutoTraderData(prev => ({
        ...prev,
        totalPnL: prev.totalPnL + (tradeData.profit || 0),
        dailyPnL: prev.dailyPnL + (tradeData.profit || 0),
        activeTrades: prev.activeTrades + 1,
      }));
    };

    // 监听持仓更新事件
    const handlePositionUpdate = (event: CustomEvent) => {
      console.log('Position updated:', event.detail);
    };

    window.addEventListener('autoTradeExecuted', handleAutoTradeExecuted as EventListener);
    window.addEventListener('positionUpdated', handlePositionUpdate as EventListener);

    return () => {
      window.removeEventListener('autoTradeExecuted', handleAutoTradeExecuted as EventListener);
      window.removeEventListener('positionUpdated', handlePositionUpdate as EventListener);
    };
  }, []);

  // 定期模拟价格变动更新虚拟盈亏
  useEffect(() => {
    if (autoTraderData.activeTrades > 0) {
      const interval = setInterval(() => {
        setAutoTraderData(prev => {
          const priceChange = (Math.random() - 0.5) * 50; // -25 to +25
          return {
            ...prev,
            totalPnL: prev.totalPnL + priceChange,
            dailyPnL: prev.dailyPnL + priceChange * 0.1,
          };
        });
      }, 8000); // 每8秒更新一次

      return () => clearInterval(interval);
    }
  }, [autoTraderData.activeTrades]);

  const updateAutoTraderData = (data: Partial<AutoTraderData>) => {
    setAutoTraderData(prev => ({ ...prev, ...data }));
  };

  const getPortfolioData = () => {
    return {
      totalValue: autoTraderData.virtualBalance + autoTraderData.totalPnL,
      dailyChange: autoTraderData.dailyPnL,
      activeTrades: autoTraderData.activeTrades,
      source: 'autotrader' as const
    };
  };

  return (
    <AutoTraderContext.Provider value={{
      autoTraderData,
      updateAutoTraderData,
      getPortfolioData
    }}>
      {children}
    </AutoTraderContext.Provider>
  );
};

export const useAutoTraderData = () => {
  const context = useContext(AutoTraderContext);
  if (context === undefined) {
    throw new Error('useAutoTraderData must be used within an AutoTraderProvider');
  }
  return context;
};

// Keep the old hook name for compatibility
export const useWalletData = useAutoTraderData;