import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Bitcoin, Coins, Zap, Circle, Hexagon, Triangle } from "lucide-react";
import ethereumLogo from "@/assets/ethereum-logo.png";

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
  
  const getCryptoIcon = (symbol: string) => {
    const iconMap = {
      'BTC': Bitcoin,
      'ETH': 'ethereum', // Special case for Ethereum
      'ADA': Circle,
      'SOL': Zap,
      'DOT': Circle,
      'MATIC': Triangle
    };
    return iconMap[symbol] || Coins;
  };

  const IconComponent = getCryptoIcon(symbol);
  
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 hover:shadow-xl transition-all duration-300 rounded-xl">
      <div className="flex items-center justify-between">
        {/* Left side - Icon and Info */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            {symbol === 'ETH' ? (
              <img src={ethereumLogo} alt="Ethereum" className="w-6 h-6" />
            ) : (
              <IconComponent className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{symbol}</h3>
            <p className="text-slate-400 text-sm">{name}</p>
          </div>
        </div>
        
        {/* Right side - Percentage Badge */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
          isPositive 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </div>
      </div>
      
      {/* Price Section */}
      <div className="mt-4 space-y-1">
        <p className="text-2xl font-bold text-white">
          ${price.toLocaleString(undefined, { minimumFractionDigits: price < 1 ? 3 : 0, maximumFractionDigits: price < 1 ? 3 : 0 })}
        </p>
        <p className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}${Math.abs(change).toFixed(2)}
        </p>
      </div>
    </Card>
  );
};