import { useMemo } from 'react';
import { useCryptoData } from './useCryptoData';

interface OptimizedCryptoHook {
  cryptoData: ReturnType<typeof useCryptoData>['cryptoData'];
  newsData: ReturnType<typeof useCryptoData>['newsData'];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  topCryptos: ReturnType<typeof useCryptoData>['cryptoData'];
  trendingCryptos: ReturnType<typeof useCryptoData>['cryptoData'];
}

export const useOptimizedCrypto = (symbols?: string[]): OptimizedCryptoHook => {
  const { cryptoData, newsData, loading, error, refreshData } = useCryptoData(symbols);

  // Memoize expensive calculations
  const topCryptos = useMemo(() => 
    cryptoData
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 10),
    [cryptoData]
  );

  const trendingCryptos = useMemo(() => 
    cryptoData
      .sort((a, b) => Math.abs(b.changePercent24h) - Math.abs(a.changePercent24h))
      .slice(0, 5),
    [cryptoData]
  );

  return {
    cryptoData,
    newsData,
    loading,
    error,
    refreshData,
    topCryptos,
    trendingCryptos,
  };
};