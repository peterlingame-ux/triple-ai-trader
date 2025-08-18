import { memo } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { formatPrice, formatVolume, formatMarketCap } from "@/utils/cryptoDataUtils";
import { CryptoIcon } from "./CryptoIcon";

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
      {/* Header - 3D Icon, Symbol & Price */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 relative">
            <CryptoIcon symbol={symbol} size={32} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground font-semibold text-sm font-mono tracking-wider">{symbol}</h3>
              {/* 币安实时数据指示器 */}
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-green-400 font-medium tracking-wide">BINANCE</span>
              </div>
            </div>
            <p className="text-muted-foreground text-[10px] font-medium truncate">{name}</p>
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
      
      {/* Compact Market Data - 显示币安实时数据 */}
      <div className="pt-2 border-t border-border/30">
        <div className="flex justify-between items-center text-[10px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-1">{t('crypto.vol')} 24h</p>
            <p className="text-foreground font-mono font-medium">
              ${formatVolume(volume)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-1">{t('crypto.mcap')}</p>
            <p className="text-foreground font-mono font-medium">
              ${formatMarketCap(marketCap)}
            </p>
          </div>
        </div>
        {/* 实时数据状态提示 */}
        <div className="flex items-center justify-center gap-1 mt-2 pt-1 border-t border-border/20">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-[9px] text-green-400/80 font-medium tracking-widest">REAL-TIME DATA</span>
        </div>
      </div>
    </Card>
  );
});

CompactCryptoCard.displayName = "CompactCryptoCard";