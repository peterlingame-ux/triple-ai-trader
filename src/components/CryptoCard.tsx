import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CryptoCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  icon?: string;
}

export const CryptoCard = ({ symbol, name, price, change, changePercent }: CryptoCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="p-4 bg-card border-border hover:shadow-glow transition-all duration-300 bg-gradient-crypto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
            {symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{symbol}</h3>
            <p className="text-xs text-muted-foreground">{name}</p>
          </div>
        </div>
        <Badge variant={isPositive ? "default" : "destructive"} className="gap-1">
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {changePercent.toFixed(2)}%
        </Badge>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-accent">
          ${price.toLocaleString()}
        </p>
        <p className={`text-sm ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}${change.toFixed(2)}
        </p>
      </div>
    </Card>
  );
};