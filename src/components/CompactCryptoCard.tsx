import { memo, useState, useEffect, useRef } from "react";
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [previousPrice, setPreviousPrice] = useState(price);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'same'>('same');
  
  // 检测价格变化并触发动画
  useEffect(() => {
    if (price !== previousPrice) {
      if (price > previousPrice) {
        setPriceDirection('up');
      } else if (price < previousPrice) {
        setPriceDirection('down');
      }
      
      setIsUpdating(true);
      setPreviousPrice(price);
      
      // 1秒后停止闪烁效果
      const timer = setTimeout(() => {
        setIsUpdating(false);
        setPriceDirection('same');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [price, previousPrice]);
  
  // 动态样式类
  const cardAnimationClass = isUpdating 
    ? `animate-pulse ${priceDirection === 'up' ? 'ring-2 ring-green-500/50 bg-green-500/10' : 
        priceDirection === 'down' ? 'ring-2 ring-red-500/50 bg-red-500/10' : ''}`
    : '';
  
  const priceAnimationClass = isUpdating
    ? `transition-all duration-500 ${priceDirection === 'up' ? 'text-green-400 font-bold scale-105' : 
        priceDirection === 'down' ? 'text-red-400 font-bold scale-105' : ''}`
    : 'transition-all duration-300';
  
  return (
    <Card className={`p-3 bg-card/50 backdrop-blur-sm border-border/30 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 rounded-lg group relative ${cardAnimationClass}`}>
      {/* 数据更新指示器 */}
      {isUpdating && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping"></div>
      )}
      
      {/* Header - 3D Icon, Symbol & Price */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <CryptoIcon symbol={symbol} size={32} />
          </div>
          <div>
            <h3 className="text-foreground font-semibold text-sm font-mono tracking-wider">{symbol}</h3>
            <p className="text-muted-foreground text-[10px] font-medium truncate">{name}</p>
          </div>
        </div>
        
        {/* Price */}
        <div className="text-right">
          <p className={`text-foreground font-bold text-sm font-mono ${priceAnimationClass}`}>
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
            <p className="text-muted-foreground mb-1">{t('crypto.vol')}</p>
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
      </div>
    </Card>
  );
});

CompactCryptoCard.displayName = "CompactCryptoCard";