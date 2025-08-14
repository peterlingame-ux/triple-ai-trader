import { memo } from "react";
import { CompactCryptoCard } from "./CompactCryptoCard";

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

interface ProfessionalCryptoGridProps {
  cryptoData: CryptoData[];
  showAll: boolean;
  maxVisible?: number;
}

export const ProfessionalCryptoGrid = memo<ProfessionalCryptoGridProps>(({ 
  cryptoData, 
  showAll, 
  maxVisible = 8 
}) => {
  const displayData = showAll ? cryptoData : cryptoData.slice(0, maxVisible);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3">
      {displayData.map((crypto) => (
        <CompactCryptoCard
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

ProfessionalCryptoGrid.displayName = "ProfessionalCryptoGrid";