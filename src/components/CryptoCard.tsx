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
    <Card className="p-6 bg-gradient-crypto border-border hover:shadow-crypto transition-all duration-300 rounded-xl">
      <div className="flex items-center justify-between">
        {/* Left side - Icon and Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center">
            <CryptoStaticIcon 
              symbol={symbol} 
              name={name} 
              size={64} 
              className="hover:scale-110 transition-transform duration-200"
            />
          </div>
          <div>
            <h3 className="text-foreground font-bold text-lg font-orbitron tracking-wide">{symbol}</h3>
            <p className="text-muted-foreground text-sm font-inter">{name}</p>
          </div>
        </div>
        
        {/* Right side - Percentage Badge */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
          isPositive 
            ? 'bg-success/20 text-success border border-success/30' 
            : 'bg-destructive/20 text-destructive border border-destructive/30'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </div>
      </div>
      
      {/* Price Section */}
      <div className="mt-4 space-y-1">
        <p className="text-2xl font-bold text-foreground font-mono tracking-wider">
          ${formatPrice(price)}
        </p>
        <p className={`text-sm font-medium font-mono ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}${Math.abs(change).toFixed(2)}
        </p>
      </div>
      
      {/* Enhanced market data */}
      <div className="pt-3 border-t border-border/50 mt-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground mb-1">{t('crypto.volume24h')}</p>
            <p className="text-foreground font-mono font-medium">
              ${formatVolume(volume)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">{t('crypto.marketCap')}</p>
            <p className="text-foreground font-mono font-medium">
              ${formatMarketCap(marketCap)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">{t('crypto.circulatingSupply')}</p>
            <p className="text-foreground font-mono text-xs">
              {getCirculatingSupply(symbol)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">{t('crypto.marketRank')}</p>
            <p className="text-foreground font-mono font-medium">
              #{getMarketRank(symbol)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
});

CryptoCard.displayName = "CryptoCard";