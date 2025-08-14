import { memo, useMemo } from "react";
import { CryptoCard } from "./CryptoCard";
import { Skeleton } from "@/components/ui/skeleton";

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  image?: string;
  volume24h?: number;
  marketCap?: number;
}

interface OptimizedCryptoGridProps {
  cryptoData: CryptoData[];
  showAll: boolean;
  maxVisible?: number;
  loading?: boolean;
}

const CryptoGridSkeleton = memo(({ count }: { count: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-48 rounded-xl" />
    ))}
  </div>
));

CryptoGridSkeleton.displayName = "CryptoGridSkeleton";

export const OptimizedCryptoGrid = memo<OptimizedCryptoGridProps>(({ 
  cryptoData, 
  showAll, 
  maxVisible = 6,
  loading = false
}) => {
  // Memoize display data calculation
  const displayData = useMemo(() => 
    showAll ? cryptoData : cryptoData.slice(0, maxVisible),
    [cryptoData, showAll, maxVisible]
  );

  if (loading && cryptoData.length === 0) {
    return <CryptoGridSkeleton count={maxVisible} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 will-change-transform">
      {displayData.map((crypto, index) => (
        <div 
          key={crypto.symbol}
          className="animate-fade-in gpu-accelerated"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CryptoCard
            symbol={crypto.symbol}
            name={crypto.name}
            price={crypto.price}
            change={crypto.change24h}
            changePercent={crypto.changePercent24h}
            image={crypto.image}
            volume={crypto.volume24h}
            marketCap={crypto.marketCap}
          />
        </div>
      ))}
    </div>
  );
});

OptimizedCryptoGrid.displayName = "OptimizedCryptoGrid";