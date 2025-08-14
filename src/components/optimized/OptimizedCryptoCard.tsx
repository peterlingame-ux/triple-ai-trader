import { memo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { CryptoStaticIcon } from "../Static3DIconShowcase";

interface CryptoCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  image?: string;
  volume?: number;
  marketCap?: number;
  rank?: number;
}

export const OptimizedCryptoCard = memo(({ 
  symbol, 
  name, 
  price, 
  change, 
  changePercent, 
  volume, 
  marketCap, 
  rank 
}: CryptoCardProps) => {
  const { t } = useLanguage();
  const isPositive = change >= 0;
  
  // Format price with appropriate decimals
  const formatPrice = (price: number) => {
    return price < 1 
      ? price.toFixed(6)
      : price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // Format volume and market cap
  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toString();
  };

  return (
    <Card className="p-4 bg-gradient-crypto border-border hover:shadow-crypto transition-all duration-300 rounded-xl group">
      <div className="flex items-center justify-between mb-4">
        {/* Left side - Icon and Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <CryptoStaticIcon 
              symbol={symbol} 
              name={name} 
              size={48} 
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </div>
          <div>
            <h3 className="text-foreground font-bold text-base font-orbitron tracking-wide">{symbol}</h3>
            <p className="text-muted-foreground text-xs font-inter">{name}</p>
            {rank && (
              <p className="text-muted-foreground text-xs">#{rank}</p>
            )}
          </div>
        </div>
        
        {/* Right side - Percentage Badge */}
        <Badge 
          variant="outline" 
          className={`px-2 py-1 text-xs font-medium flex items-center gap-1 ${
            isPositive 
              ? 'bg-success/20 text-success border-success/30' 
              : 'bg-destructive/20 text-destructive border-destructive/30'
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </Badge>
      </div>
      
      {/* Price Section */}
      <div className="space-y-2">
        <p className="text-xl font-bold text-foreground font-mono tracking-wider">
          ${formatPrice(price)}
        </p>
        <p className={`text-sm font-medium font-mono ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}${Math.abs(change).toFixed(2)}
        </p>
      </div>
      
      {/* Market data */}
      {(volume || marketCap) && (
        <div className="pt-3 border-t border-border/50 mt-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {volume && (
              <div>
                <p className="text-muted-foreground mb-1">{t('crypto.volume24h')}</p>
                <p className="text-foreground font-mono font-medium">
                  ${formatLargeNumber(volume)}
                </p>
              </div>
            )}
            {marketCap && (
              <div>
                <p className="text-muted-foreground mb-1">{t('crypto.marketCap')}</p>
                <p className="text-foreground font-mono font-medium">
                  ${formatLargeNumber(marketCap)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
});

OptimizedCryptoCard.displayName = 'OptimizedCryptoCard';