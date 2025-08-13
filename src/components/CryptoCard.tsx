
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";
import bitcoin3dLogo from "@/assets/bitcoin-3d-logo.png";
import ethereum3dLogo from "@/assets/ethereum-3d-logo.png";
import cardano3dLogo from "@/assets/cardano-3d-logo.png";
import solana3dLogo from "@/assets/solana-3d-logo.png";
import polkadot3dLogo from "@/assets/polkadot-3d-logo.png";
import polygon3dLogo from "@/assets/polygon-3d-logo.png";
import binance3dLogo from "@/assets/binance-3d-logo.png";
import ripple3dLogo from "@/assets/ripple-3d-logo.png";
import dogecoin3dLogo from "@/assets/dogecoin-3d-logo.png";
import avalanche3dLogo from "@/assets/avalanche-3d-logo.png";
import chainlink3dLogo from "@/assets/chainlink-3d-logo.png";
import uniswap3dLogo from "@/assets/uniswap-3d-logo.png";
import litecoin3dLogo from "@/assets/litecoin-3d-logo.png";
import cosmos3dLogo from "@/assets/cosmos-3d-logo.png";
import icp3dLogo from "@/assets/icp-3d-logo.png";
import near3dLogo from "@/assets/near-3d-logo.png";
import aptos3dLogo from "@/assets/aptos-3d-logo.png";
import fantom3dLogo from "@/assets/fantom-3d-logo.png";
import algorand3dLogo from "@/assets/algorand-3d-logo.png";
import vechain3dLogo from "@/assets/vechain-3d-logo.png";
import stellar3dLogo from "@/assets/stellar-3d-logo.png";
import filecoin3dLogo from "@/assets/filecoin-3d-logo.png";
import mana3dLogo from "@/assets/mana-3d-logo.png";
import sandbox3dLogo from "@/assets/sandbox-3d-logo.png";
import cronos3dLogo from "@/assets/cronos-3d-logo.png";
import shiba3dLogo from "@/assets/shiba-3d-logo.png";
import loopring3dLogo from "@/assets/loopring-3d-logo.png";
import enjin3dLogo from "@/assets/enjin-3d-logo.png";
import bat3dLogo from "@/assets/bat-3d-logo.png";
import zcash3dLogo from "@/assets/zcash-3d-logo.png";
import pepe3dLogo from "@/assets/pepe-3d-logo.png";
import trump3dLogo from "@/assets/trump-3d-logo.png";

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
    const logoMap: { [key: string]: string } = {
      'BTC': bitcoin3dLogo,
      'ETH': ethereum3dLogo,
      'ADA': cardano3dLogo,
      'SOL': solana3dLogo,
      'DOT': polkadot3dLogo,
      'MATIC': polygon3dLogo,
      'BNB': binance3dLogo,
      'XRP': ripple3dLogo,
      'DOGE': dogecoin3dLogo,
      'AVAX': avalanche3dLogo,
      'LINK': chainlink3dLogo,
      'UNI': uniswap3dLogo,
      'LTC': litecoin3dLogo,
      'ATOM': cosmos3dLogo,
      'ICP': icp3dLogo,
      'NEAR': near3dLogo,
      'APT': aptos3dLogo,
      'FTM': fantom3dLogo,
      'ALGO': algorand3dLogo,
      'VET': vechain3dLogo,
      'XLM': stellar3dLogo,
      'FIL': filecoin3dLogo,
      'MANA': mana3dLogo,
      'SAND': sandbox3dLogo,
      'CRO': cronos3dLogo,
      'SHIB': shiba3dLogo,
      'LRC': loopring3dLogo,
      'ENJ': enjin3dLogo,
      'BAT': bat3dLogo,
      'ZEC': zcash3dLogo,
      'PEPE': pepe3dLogo,
      'TRUMP': trump3dLogo
    };
    return logoMap[symbol] || null;
  };

  const crypto3DLogo = getCrypto3DIcon(symbol);
  
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 hover:shadow-xl transition-all duration-300 rounded-xl">
      <div className="flex items-center justify-between">
        {/* Left side - Icon and Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center">
            {crypto3DLogo ? (
              <img 
                src={crypto3DLogo} 
                alt={`${name} logo`} 
                className="w-16 h-16 object-contain"
                style={{ 
                  imageRendering: 'crisp-edges'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="fallback-icon w-16 h-16 flex items-center justify-center" style={{ display: crypto3DLogo ? 'none' : 'flex' }}>
              <Coins className="w-16 h-16 text-amber-500" />
            </div>
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
      
      {/* Enhanced market data */}
      <div className="pt-3 border-t border-border/50 mt-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground mb-1">24h Volume</p>
            <p className="text-foreground font-mono font-medium">
              ${volume ? (volume / 1e9).toFixed(2) + 'B' : '2.5B'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Market Cap</p>
            <p className="text-foreground font-mono font-medium">
              ${marketCap ? (marketCap / 1e9).toFixed(1) + 'B' : '45.2B'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Circulating Supply</p>
            <p className="text-foreground font-mono text-xs">
              {symbol === 'BTC' ? '19.7M BTC' : 
               symbol === 'ETH' ? '120.4M ETH' : 
               symbol === 'ADA' ? '35.0B ADA' :
               '1.2B ' + symbol}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Market Rank</p>
            <p className="text-foreground font-mono font-medium">
              #{symbol === 'BTC' ? '1' : 
                 symbol === 'ETH' ? '2' : 
                 symbol === 'BNB' ? '4' :
                 symbol === 'XRP' ? '5' :
                 Math.floor(Math.random() * 50) + 6}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
