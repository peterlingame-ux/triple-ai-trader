import { useMemo } from 'react';
import { useCryptoData } from './useCryptoData';
import { memoize } from '@/utils/performance';

interface OptimizedCryptoHook {
  cryptoData: ReturnType<typeof useCryptoData>['cryptoData'];
  newsData: ReturnType<typeof useCryptoData>['newsData'];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  topCryptos: ReturnType<typeof useCryptoData>['cryptoData'];
  trendingCryptos: ReturnType<typeof useCryptoData>['cryptoData'];
  totalMarketCap: number;
  avgChangePercent: number;
}

// Memoized calculation functions for better performance
const calculateMarketCap = memoize((cryptoData: any[]) => 
  cryptoData.reduce((total, crypto) => total + (crypto.marketCap || 0), 0)
);

const calculateAvgChange = memoize((cryptoData: any[]) => {
  if (cryptoData.length === 0) return 0;
  const total = cryptoData.reduce((sum, crypto) => sum + (crypto.changePercent24h || 0), 0);
  return total / cryptoData.length;
});

const sortByMarketCap = memoize((cryptoData: any[]) => 
  [...cryptoData].sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0)).slice(0, 10)
);

const sortByTrending = memoize((cryptoData: any[]) => 
  [...cryptoData]
    .sort((a, b) => Math.abs(b.changePercent24h || 0) - Math.abs(a.changePercent24h || 0))
    .slice(0, 5)
);

export const useOptimizedCrypto = (symbols?: string[]): OptimizedCryptoHook => {
  const { cryptoData, newsData, loading, error, refreshData } = useCryptoData(symbols);

  // Memoize expensive calculations
  const topCryptos = useMemo(() => sortByMarketCap(cryptoData), [cryptoData]);
  const trendingCryptos = useMemo(() => sortByTrending(cryptoData), [cryptoData]);
  const totalMarketCap = useMemo(() => calculateMarketCap(cryptoData), [cryptoData]);
  const avgChangePercent = useMemo(() => calculateAvgChange(cryptoData), [cryptoData]);

  return {
    cryptoData,
    newsData,
    loading,
    error,
    refreshData,
    topCryptos,
    trendingCryptos,
    totalMarketCap,
    avgChangePercent,
  };
};