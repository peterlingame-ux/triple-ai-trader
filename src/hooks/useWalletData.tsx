import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface WalletData {
  isConnected: boolean;
  address: string;
  balance: number;
  dailyChange: number;
  activeTrades: number;
  portfolio: {
    totalValue: number;
    holdings: Array<{
      symbol: string;
      amount: number;
      value: number;
      change24h: number;
    }>;
  };
}

interface AutoTraderData {
  virtualBalance: number;
  totalPnL: number;
  dailyPnL: number;
  activeTrades: number;
  winRate: number;
  monthlyPnL: number;
}

interface WalletContextType {
  walletData: WalletData;
  autoTraderData: AutoTraderData;
  isWalletConnected: boolean;
  setWalletConnected: (connected: boolean, address?: string) => void;
  updateAutoTraderData: (data: Partial<AutoTraderData>) => void;
  getPortfolioData: () => {
    totalValue: number;
    dailyChange: number;
    activeTrades: number;
    source: 'wallet' | 'autotrader';
  };
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletData, setWalletData] = useState<WalletData>({
    isConnected: false,
    address: '',
    balance: 0,
    dailyChange: 0,
    activeTrades: 0,
    portfolio: {
      totalValue: 0,
      holdings: []
    }
  });

  const [autoTraderData, setAutoTraderData] = useState<AutoTraderData>({
    virtualBalance: 100000,
    totalPnL: 0,
    dailyPnL: 1247.89,
    activeTrades: 12,
    winRate: 87.5,
    monthlyPnL: 15847.32
  });

  // Simulate real wallet data when connected
  useEffect(() => {
    if (walletData.isConnected) {
      const updateWalletData = () => {
        // Simulate real portfolio data
        const holdings = [
          { symbol: 'BTC', amount: 0.8, value: 34600, change24h: 1245.50 },
          { symbol: 'ETH', amount: 12.5, value: 32087.5, change24h: -566.25 },
          { symbol: 'SOL', amount: 150, value: 14812.5, change24h: 513 },
          { symbol: 'ADA', amount: 5000, value: 2425, change24h: 115 },
        ];

        const totalValue = holdings.reduce((sum, holding) => sum + holding.value, 0);
        const dailyChange = holdings.reduce((sum, holding) => sum + holding.change24h, 0);

        setWalletData(prev => ({
          ...prev,
          balance: totalValue,
          dailyChange: dailyChange,
          activeTrades: Math.floor(Math.random() * 8) + 5, // 5-12 active trades
          portfolio: {
            totalValue,
            holdings
          }
        }));
      };

      // Update immediately and then every 30 seconds
      updateWalletData();
      const interval = setInterval(updateWalletData, 30000);
      return () => clearInterval(interval);
    }
  }, [walletData.isConnected]);

  // Simulate real-time updates for wallet when connected
  useEffect(() => {
    if (walletData.isConnected) {
      const interval = setInterval(() => {
        setWalletData(prev => ({
          ...prev,
          balance: prev.balance + (Math.random() - 0.5) * 200,
          dailyChange: prev.dailyChange + (Math.random() - 0.5) * 50
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [walletData.isConnected]);

  const setWalletConnected = (connected: boolean, address?: string) => {
    setWalletData(prev => ({
      ...prev,
      isConnected: connected,
      address: address || '',
      balance: connected ? 83925.23 : 0, // Initial portfolio value when connected
      dailyChange: connected ? 1307.45 : 0,
      activeTrades: connected ? 8 : 0
    }));
  };

  const updateAutoTraderData = (data: Partial<AutoTraderData>) => {
    setAutoTraderData(prev => ({ ...prev, ...data }));
  };

  const getPortfolioData = () => {
    if (walletData.isConnected) {
      return {
        totalValue: walletData.balance,
        dailyChange: walletData.dailyChange,
        activeTrades: walletData.activeTrades,
        source: 'wallet' as const
      };
    } else {
      return {
        totalValue: autoTraderData.virtualBalance + autoTraderData.totalPnL,
        dailyChange: autoTraderData.dailyPnL,
        activeTrades: autoTraderData.activeTrades,
        source: 'autotrader' as const
      };
    }
  };

  return (
    <WalletContext.Provider value={{
      walletData,
      autoTraderData,
      isWalletConnected: walletData.isConnected,
      setWalletConnected,
      updateAutoTraderData,
      getPortfolioData
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletData = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletData must be used within a WalletProvider');
  }
  return context;
};