import { memo } from "react";
import { CryptoCard } from "./CryptoCard";

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
}

export const OptimizedCryptoGrid = memo<OptimizedCryptoGridProps>(({ 
  cryptoData, 
  showAll, 
  maxVisible = 6 
}) => {
  const displayData = showAll ? cryptoData : cryptoData.slice(0, maxVisible);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayData.map((crypto) => (
        <CryptoCard
          key={crypto.symbol}
          symbol={crypto.symbol}
          name={crypto.name}
          price={crypto.price}
          change={crypto.change24h}
          changePercent={crypto.changePercent24h}
          image={crypto.image}
          volume={crypto.volume24h}
          marketCap={crypto.marketCap}
        />
      ))}
    </div>
  );
});

OptimizedCryptoGrid.displayName = "OptimizedCryptoGrid";