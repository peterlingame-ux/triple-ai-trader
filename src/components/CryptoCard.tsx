import { memo } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { CryptoStaticIcon } from "./Static3DIconShowcase";
import { formatPrice, formatVolume, formatMarketCap, getCirculatingSupply, getMarketRank } from "@/utils/cryptoDataUtils";

interface CryptoCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  image?: string;
  volume?: number;
  marketCap?: number;
}

export const CryptoCard = memo<CryptoCardProps>(({ symbol, name, price, change, changePercent, image, volume, marketCap }) => {
  const { t } = useLanguage();
  const isPositive = change >= 0;
  
  return (
    <Card className="p-3 sm:p-6 bg-gradient-crypto border-border hover:shadow-crypto transition-all duration-300 rounded-xl">
      <div className="flex items-center justify-between">
        {/* Left side - Icon and Info */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
            <CryptoStaticIcon 
              symbol={symbol} 
              name={name} 
              size={window.innerWidth < 640 ? 48 : 64}
              className="hover:scale-110 transition-transform duration-200"
            />
          </div>
          <div>
            <h3 className="text-foreground font-bold text-base sm:text-lg font-orbitron tracking-wide">{symbol}</h3>
            <p className="text-muted-foreground text-xs sm:text-sm font-inter">{name}</p>
          </div>
        </div>
        
        {/* Right side - Percentage Badge */}
        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 ${
          isPositive 
            ? 'bg-success/20 text-success border border-success/30' 
            : 'bg-destructive/20 text-destructive border border-destructive/30'
        }`}>
          {isPositive ? <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2 h-2 sm:w-3 sm:h-3" />}
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </div>
      </div>
      
      {/* Price Section */}
      <div className="mt-3 sm:mt-4 space-y-1">
        <p className="text-xl sm:text-2xl font-bold text-foreground font-mono tracking-wider">
          ${formatPrice(price)}
        </p>
        <p className={`text-xs sm:text-sm font-medium font-mono ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}${Math.abs(change).toFixed(2)}
        </p>
      </div>
      
      {/* Enhanced market data */}
      <div className="pt-2 sm:pt-3 border-t border-border/50 mt-3 sm:mt-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs">
          <div>
            <p className="text-muted-foreground mb-1 text-xs">{t('crypto.volume24h')}</p>
            <p className="text-foreground font-mono font-medium text-xs">
              ${formatVolume(volume)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-xs">{t('crypto.marketCap')}</p>
            <p className="text-foreground font-mono font-medium text-xs">
              ${formatMarketCap(marketCap)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-xs">{t('crypto.circulatingSupply')}</p>
            <p className="text-foreground font-mono text-xs">
              {getCirculatingSupply(symbol)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-xs">{t('crypto.marketRank')}</p>
            <p className="text-foreground font-mono font-medium text-xs">
              #{getMarketRank(symbol)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
});

CryptoCard.displayName = "CryptoCard";