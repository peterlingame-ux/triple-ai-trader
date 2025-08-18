import { memo, useState, useEffect, useCallback } from "react";
import { CompactCryptoCard } from "./CompactCryptoCard";
import { useOptimizedCryptoRender } from "@/hooks/useOptimizedPerformance";

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
  onOpenTrading?: (symbol: string) => void;
}

export const ProfessionalCryptoGrid = memo<ProfessionalCryptoGridProps>(({ 
  cryptoData, 
  showAll, 
  maxVisible = 6,
  onOpenTrading
}) => {
  const [displayData, setDisplayData] = useState<CryptoData[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const { shouldRender } = useOptimizedCryptoRender(cryptoData, showAll ? cryptoData.length : maxVisible);

  const updateDisplayData = useCallback((newData: CryptoData[]) => {
    if (shouldRender) {
      setDisplayData(newData);
    }
  }, [shouldRender]);

  useEffect(() => {
    if (showAll !== undefined) {
      setIsAnimating(true);
      
      // 添加短暂延迟来实现平滑过渡
      const timer = setTimeout(() => {
        const newData = showAll ? cryptoData : cryptoData.slice(0, maxVisible);
        updateDisplayData(newData);
        setIsAnimating(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [cryptoData, showAll, maxVisible, updateDisplayData]);

  // 初始化数据
  useEffect(() => {
    if (!showAll && cryptoData.length > 0) {
      updateDisplayData(cryptoData.slice(0, maxVisible));
    } else if (showAll) {
      updateDisplayData(cryptoData);
    }
  }, [cryptoData, showAll, maxVisible, updateDisplayData]);

  return (
    <div className="relative">
      <div 
        className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3 transition-all duration-300 ${
          isAnimating ? 'opacity-70 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        {displayData.map((crypto, index) => (
          <div 
            key={crypto.symbol}
            className="animate-fade-in"
            style={{ 
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both'
            }}
          >
            <CompactCryptoCard
              symbol={crypto.symbol}
              name={crypto.name}
              price={crypto.price}
              change={crypto.change24h}
              changePercent={crypto.changePercent24h}
              image={crypto.image}
              volume={crypto.volume24h}
              marketCap={crypto.marketCap}
              onOpenTrading={onOpenTrading}
            />
          </div>
        ))}
      </div>
      
      {/* 加载动画遮罩 */}
      {isAnimating && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
});

ProfessionalCryptoGrid.displayName = "ProfessionalCryptoGrid";