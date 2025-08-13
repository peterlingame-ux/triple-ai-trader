import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";
import bitcoin3dLogo from "@/assets/bitcoin-3d-logo.png";
import ethereum3dLogo from "@/assets/ethereum-3d-logo.png";
import cardano3dLogo from "@/assets/cardano-3d-logo.png";
import solana3dLogo from "@/assets/solana-3d-logo.png";
import polkadot3dLogo from "@/assets/polkadot-3d-logo.png";
import polygon3dLogo from "@/assets/polygon-3d-logo.png";

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

export const CryptoCard = ({ symbol, name, price, change, changePercent, image, volume, marketCap }: CryptoCardProps) => {
  const isPositive = change >= 0;
  
  const getCrypto3DIcon = (symbol: string) => {
    const logoMap = {
      'BTC': bitcoin3dLogo,
      'ETH': ethereum3dLogo,
      'ADA': cardano3dLogo,
      'SOL': solana3dLogo,
      'DOT': polkadot3dLogo,
      'MATIC': polygon3dLogo
    };
    return logoMap[symbol] || null;
  };

  const crypto3DLogo = getCrypto3DIcon(symbol);
  
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 hover:shadow-xl transition-all duration-300 rounded-xl">
      <div className="flex items-center justify-between">
        {/* Left side - Icon and Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center">
            {crypto3DLogo ? (
              <img src={crypto3DLogo} alt={`${name} logo`} className="w-12 h-12 drop-shadow-lg" />
            ) : (
              <Coins className="w-12 h-12 text-amber-500 drop-shadow-lg" />
            )}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg font-orbitron tracking-wide">{symbol}</h3>
            <p className="text-slate-400 text-sm font-inter">{name}</p>
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
        <p className="text-2xl font-bold text-white font-mono tracking-wider">
          ${price.toLocaleString(undefined, { minimumFractionDigits: price < 1 ? 3 : 0, maximumFractionDigits: price < 1 ? 3 : 0 })}
        </p>
        <p className={`text-sm font-medium font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}${Math.abs(change).toFixed(2)}
        </p>
      </div>
      
      {/* Additional market data */}
      {(volume || marketCap) && (
        <div className="pt-2 border-t border-border/50 mt-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {volume && (
              <div>
                <p className="text-muted-foreground">24h Volume</p>
                <p className="text-foreground font-mono">${(volume / 1e9).toFixed(2)}B</p>
              </div>
            )}
            {marketCap && (
              <div>
                <p className="text-muted-foreground">Market Cap</p>
                <p className="text-foreground font-mono">${(marketCap / 1e9).toFixed(1)}B</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};