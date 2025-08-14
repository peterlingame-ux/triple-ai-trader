import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
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
import usdt3dLogo from "@/assets/usdt-3d-logo.png";
import usdc3dLogo from "@/assets/usdc-3d-logo.png";
import steth3dLogo from "@/assets/steth-3d-logo.png";
import tron3dLogo from "@/assets/tron-3d-logo.png";
import ton3dLogo from "@/assets/ton-3d-logo.png";
import bch3dLogo from "@/assets/bch-3d-logo.png";
import etc3dLogo from "@/assets/etc-3d-logo.png";
import hbar3dLogo from "@/assets/hbar-3d-logo.png";
import grt3dLogo from "@/assets/grt-3d-logo.png";
import qnt3dLogo from "@/assets/qnt-3d-logo.png";
import aave3dLogo from "@/assets/aave-3d-logo.png";
import mkr3dLogo from "@/assets/mkr-3d-logo.png";
import comp3dLogo from "@/assets/comp-3d-logo.png";
import yfi3dLogo from "@/assets/yfi-3d-logo.png";
import snx3dLogo from "@/assets/snx-3d-logo.png";
import oneinch3dLogo from "@/assets/1inch-3d-logo.png";
import ren3dLogo from "@/assets/ren-3d-logo.png";
import knc3dLogo from "@/assets/knc-3d-logo.png";
import crv3dLogo from "@/assets/crv-3d-logo.png";
import uma3dLogo from "@/assets/uma-3d-logo.png";
import bal3dLogo from "@/assets/bal-3d-logo.png";
import sushi3dLogo from "@/assets/sushi-3d-logo.png";
import flow3dLogo from "@/assets/flow-3d-logo.png";
import egld3dLogo from "@/assets/egld-3d-logo.png";
import one3dLogo from "@/assets/one-3d-logo.png";
import hive3dLogo from "@/assets/hive-3d-logo.png";
import theta3dLogo from "@/assets/theta-3d-logo.png";
import tfuel3dLogo from "@/assets/tfuel-3d-logo.png";
import kava3dLogo from "@/assets/kava-3d-logo.png";
import band3dLogo from "@/assets/band-3d-logo.png";
import rvn3dLogo from "@/assets/rvn-3d-logo.png";
import zil3dLogo from "@/assets/zil-3d-logo.png";
import icx3dLogo from "@/assets/icx-3d-logo.png";
import ont3dLogo from "@/assets/ont-3d-logo.png";
import qtum3dLogo from "@/assets/qtum-3d-logo.png";
import waves3dLogo from "@/assets/waves-3d-logo.png";
import sc3dLogo from "@/assets/sc-3d-logo.png";
import dgb3dLogo from "@/assets/dgb-3d-logo.png";
import lsk3dLogo from "@/assets/lsk-3d-logo.png";
import ark3dLogo from "@/assets/ark-3d-logo.png";
import nano3dLogo from "@/assets/nano-3d-logo.png";
import iost3dLogo from "@/assets/iost-3d-logo.png";
import zen3dLogo from "@/assets/zen-3d-logo.png";
import maid3dLogo from "@/assets/maid-3d-logo.png";
import rep3dLogo from "@/assets/rep-3d-logo.png";
import kmd3dLogo from "@/assets/kmd-3d-logo.png";
import dcr3dLogo from "@/assets/dcr-3d-logo.png";
import strat3dLogo from "@/assets/strat-3d-logo.png";
import nxt3dLogo from "@/assets/nxt-3d-logo.png";
import sys3dLogo from "@/assets/sys-3d-logo.png";
import bonk3dLogo from "@/assets/bonk-3d-logo.png";
import wif3dLogo from "@/assets/wif-3d-logo.png";
import floki3dLogo from "@/assets/floki-3d-logo.png";
import babydoge3dLogo from "@/assets/babydoge-3d-logo.png";
import safe3dLogo from "@/assets/safe-3d-logo.png";
import meme3dLogo from "@/assets/meme-3d-logo.png";
import wojak3dLogo from "@/assets/wojak-3d-logo.png";
import turbo3dLogo from "@/assets/turbo-3d-logo.png";
import ladys3dLogo from "@/assets/ladys-3d-logo.png";
// 3D Components
import { OKB3DLogo } from "@/components/OKB3DLogo";
import { PENGU3DLogo } from "@/components/PENGU3DLogo";
import { Crypto3DIcon } from "@/components/Crypto3DIcon";

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
  const { t } = useLanguage();
  const isPositive = change >= 0;
  
  const getCrypto3DIcon = (symbol: string) => {
    const logoMap: { [key: string]: string } = {
      'BTC': bitcoin3dLogo,
      'ETH': ethereum3dLogo,
      'USDT': usdt3dLogo,
      'BNB': binance3dLogo,
      'XRP': ripple3dLogo,
      'USDC': usdc3dLogo,
      'STETH': steth3dLogo,
      'ADA': cardano3dLogo,
      'SOL': solana3dLogo,
      'DOGE': dogecoin3dLogo,
      'TRX': tron3dLogo,
      'TON': ton3dLogo,
      'AVAX': avalanche3dLogo,
      'DOT': polkadot3dLogo,
      'MATIC': polygon3dLogo,
      'SHIB': shiba3dLogo,
      'LTC': litecoin3dLogo,
      'BCH': bch3dLogo,
      'LINK': chainlink3dLogo,
      'XLM': stellar3dLogo,
      'UNI': uniswap3dLogo,
      'ATOM': cosmos3dLogo,
      'ETC': etc3dLogo,
      'HBAR': hbar3dLogo,
      'FIL': filecoin3dLogo,
      'ICP': icp3dLogo,
      'CRO': cronos3dLogo,
      'APT': aptos3dLogo,
      'NEAR': near3dLogo,
      'VET': vechain3dLogo,
      'GRT': grt3dLogo,
      'ALGO': algorand3dLogo,
      'QNT': qnt3dLogo,
      'MANA': mana3dLogo,
      'SAND': sandbox3dLogo,
      'AAVE': aave3dLogo,
      'MKR': mkr3dLogo,
      'LRC': loopring3dLogo,
      'ENJ': enjin3dLogo,
      'BAT': bat3dLogo,
      'ZEC': zcash3dLogo,
      'COMP': comp3dLogo,
      'YFI': yfi3dLogo,
      'SNX': snx3dLogo,
      '1INCH': oneinch3dLogo,
      'REN': ren3dLogo,
      'KNC': knc3dLogo,
      'CRV': crv3dLogo,
      'UMA': uma3dLogo,
      'BAL': bal3dLogo,
      'SUSHI': sushi3dLogo,
      'FTM': fantom3dLogo,
      'FLOW': flow3dLogo,
      'EGLD': egld3dLogo,
      'ONE': one3dLogo,
      'HIVE': hive3dLogo,
      'THETA': theta3dLogo,
      'TFUEL': tfuel3dLogo,
      'KAVA': kava3dLogo,
      'BAND': band3dLogo,
      'RVN': rvn3dLogo,
      'ZIL': zil3dLogo,
      'ICX': icx3dLogo,
      'ONT': ont3dLogo,
      'QTUM': qtum3dLogo,
      'WAVES': waves3dLogo,
      'SC': sc3dLogo,
      'DGB': dgb3dLogo,
      'LSK': lsk3dLogo,
      'ARK': ark3dLogo,
      'NANO': nano3dLogo,
      'IOST': iost3dLogo,
      'ZEN': zen3dLogo,
      'MAID': maid3dLogo,
      'REP': rep3dLogo,
      'KMD': kmd3dLogo,
      'DCR': dcr3dLogo,
      'STRAT': strat3dLogo,
      'NXT': nxt3dLogo,
      'SYS': sys3dLogo,
      'PEPE': pepe3dLogo,
      'BONK': bonk3dLogo,
      'WIF': wif3dLogo,
      'FLOKI': floki3dLogo,
      'BABYDOGE': babydoge3dLogo,
      'SAFE': safe3dLogo,
      'MEME': meme3dLogo,
      'WOJAK': wojak3dLogo,
      'TURBO': turbo3dLogo,
      'LADYS': ladys3dLogo,
      'TRUMP': trump3dLogo
    };
    return logoMap[symbol] || null;
  };

  const crypto3DLogo = getCrypto3DIcon(symbol);
  
  return (
    <Card className="p-6 bg-gradient-crypto border-border hover:shadow-crypto transition-all duration-300 rounded-xl">
      <div className="flex items-center justify-between">
        {/* Left side - Icon and Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center">
            {/* Special 3D Icons for OKB and PENGU */}
            {symbol === 'OKB' ? (
              <OKB3DLogo size={64} />
            ) : symbol === 'PENGU' ? (
              <PENGU3DLogo size={64} />
            ) : crypto3DLogo ? (
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
            ) : (
              // Use generic 3D icon for any other currencies
              <Crypto3DIcon symbol={symbol} size={64} />
            )}
            <div className="fallback-icon w-16 h-16 flex items-center justify-center" style={{ display: 'none' }}>
              <Coins className="w-16 h-16 text-accent" />
            </div>
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
          ${price.toLocaleString(undefined, { minimumFractionDigits: price < 1 ? 3 : 0, maximumFractionDigits: price < 1 ? 3 : 0 })}
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
              ${volume ? (volume / 1e9).toFixed(2) + 'B' : '2.5B'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">{t('crypto.marketCap')}</p>
            <p className="text-foreground font-mono font-medium">
              ${marketCap ? (marketCap / 1e9).toFixed(1) + 'B' : '45.2B'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">{t('crypto.circulatingSupply')}</p>
            <p className="text-foreground font-mono text-xs">
              {symbol === 'BTC' ? '19.7M BTC' : 
               symbol === 'ETH' ? '120.4M ETH' : 
               symbol === 'ADA' ? '35.0B ADA' :
               '1.2B ' + symbol}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">{t('crypto.marketRank')}</p>
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