import { memo } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { CryptoStaticIcon } from "./Static3DIconShowcase";
import { formatPrice, formatVolume, formatMarketCap } from "@/utils/cryptoDataUtils";

interface CompactCryptoCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  image?: string;
  volume?: number;
  marketCap?: number;
}

export const CompactCryptoCard = memo<CompactCryptoCardProps>(({ 
  symbol, 
  name, 
  price, 
  change, 
  changePercent, 
  volume, 
  marketCap 
}) => {
  const { t } = useLanguage();
  const isPositive = change >= 0;
  
  return (
    <Card className="p-3 bg-card/50 backdrop-blur-sm border-border/30 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 rounded-lg group">
      {/* Header - Icon, Symbol & Price */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <CryptoStaticIcon 
              symbol={symbol} 
              name={name} 
              size={32}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </div>
          <div>
            <h3 className="text-foreground font-semibold text-sm font-mono tracking-wider">{symbol}</h3>
            <p className="text-muted-foreground text-[10px] font-medium truncate max-w-16">{name}</p>
          </div>
        </div>
        
        {/* Price */}
        <div className="text-right">
          <p className="text-foreground font-bold text-sm font-mono">
            ${formatPrice(price)}
          </p>
          <div className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? 'text-success' : 'text-destructive'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
          </div>
        </div>
      </div>
      
      {/* Change Amount */}
      <div className="mb-2">
        <p className={`text-xs font-mono ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}${Math.abs(change).toFixed(2)}
        </p>
      </div>
      
      {/* Compact Market Data */}
      <div className="pt-2 border-t border-border/30">
        <div className="flex justify-between items-center text-[10px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-1">Vol</p>
            <p className="text-foreground font-mono font-medium">
              ${formatVolume(volume)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-1">MCap</p>
            <p className="text-foreground font-mono font-medium">
              ${formatMarketCap(marketCap)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
});

CompactCryptoCard.displayName = "CompactCryptoCard";