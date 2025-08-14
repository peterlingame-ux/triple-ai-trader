import React from 'react';
import { Card } from '@/components/ui/card';

// Import all generated 3D static icons
import BTCIcon from '@/assets/crypto-3d-icons/BTC-3d-icon.png';
import ETHIcon from '@/assets/crypto-3d-icons/ETH-3d-icon.png';
import USDTIcon from '@/assets/crypto-3d-icons/USDT-3d-icon.png';
import BNBIcon from '@/assets/crypto-3d-icons/BNB-3d-icon.png';
import XRPIcon from '@/assets/crypto-3d-icons/XRP-3d-icon.png';
import USDCIcon from '@/assets/crypto-3d-icons/USDC-3d-icon.png';
import STETHIcon from '@/assets/crypto-3d-icons/STETH-3d-icon.png';
import ADAIcon from '@/assets/crypto-3d-icons/ADA-3d-icon.png';
import SOLIcon from '@/assets/crypto-3d-icons/SOL-3d-icon.png';
import DOGEIcon from '@/assets/crypto-3d-icons/DOGE-3d-icon.png';
import TRXIcon from '@/assets/crypto-3d-icons/TRX-3d-icon.png';
import TONIcon from '@/assets/crypto-3d-icons/TON-3d-icon.png';
import AVAXIcon from '@/assets/crypto-3d-icons/AVAX-3d-icon.png';
import DOTIcon from '@/assets/crypto-3d-icons/DOT-3d-icon.png';
import MATICIcon from '@/assets/crypto-3d-icons/MATIC-3d-icon.png';
import SHIBIcon from '@/assets/crypto-3d-icons/SHIB-3d-icon.png';
import LTCIcon from '@/assets/crypto-3d-icons/LTC-3d-icon.png';
import BCHIcon from '@/assets/crypto-3d-icons/BCH-3d-icon.png';
import LINKIcon from '@/assets/crypto-3d-icons/LINK-3d-icon.png';
import XLMIcon from '@/assets/crypto-3d-icons/XLM-3d-icon.png';
import UNIIcon from '@/assets/crypto-3d-icons/UNI-3d-icon.png';
import ATOMIcon from '@/assets/crypto-3d-icons/ATOM-3d-icon.png';
import ETCIcon from '@/assets/crypto-3d-icons/ETC-3d-icon.png';
import HBARIcon from '@/assets/crypto-3d-icons/HBAR-3d-icon.png';
import FILIcon from '@/assets/crypto-3d-icons/FIL-3d-icon.png';
import ICPIcon from '@/assets/crypto-3d-icons/ICP-3d-icon.png';
import CROIcon from '@/assets/crypto-3d-icons/CRO-3d-icon.png';
import APTIcon from '@/assets/crypto-3d-icons/APT-3d-icon.png';
import NEARIcon from '@/assets/crypto-3d-icons/NEAR-3d-icon.png';
import VETIcon from '@/assets/crypto-3d-icons/VET-3d-icon.png';
import GRTIcon from '@/assets/crypto-3d-icons/GRT-3d-icon.png';
import ALGOIcon from '@/assets/crypto-3d-icons/ALGO-3d-icon.png';
import QNTIcon from '@/assets/crypto-3d-icons/QNT-3d-icon.png';
import MANAIcon from '@/assets/crypto-3d-icons/MANA-3d-icon.png';
import SANDIcon from '@/assets/crypto-3d-icons/SAND-3d-icon.png';
import AAVEIcon from '@/assets/crypto-3d-icons/AAVE-3d-icon.png';
import MKRIcon from '@/assets/crypto-3d-icons/MKR-3d-icon.png';
import LRCIcon from '@/assets/crypto-3d-icons/LRC-3d-icon.png';
import ENJIcon from '@/assets/crypto-3d-icons/ENJ-3d-icon.png';
import BATIcon from '@/assets/crypto-3d-icons/BAT-3d-icon.png';
import ZECIcon from '@/assets/crypto-3d-icons/ZEC-3d-icon.png';
import COMPIcon from '@/assets/crypto-3d-icons/COMP-3d-icon.png';
import YFIIcon from '@/assets/crypto-3d-icons/YFI-3d-icon.png';
import SNXIcon from '@/assets/crypto-3d-icons/SNX-3d-icon.png';
import ONEINCHIcon from '@/assets/crypto-3d-icons/1INCH-3d-icon.png';
import SUSHIIcon from '@/assets/crypto-3d-icons/SUSHI-3d-icon.png';
import FTMIcon from '@/assets/crypto-3d-icons/FTM-3d-icon.png';
import FLOWIcon from '@/assets/crypto-3d-icons/FLOW-3d-icon.png';
import EGLDIcon from '@/assets/crypto-3d-icons/EGLD-3d-icon.png';
import ONEIcon from '@/assets/crypto-3d-icons/ONE-3d-icon.png';
import THETAIcon from '@/assets/crypto-3d-icons/THETA-3d-icon.png';
import CRVIcon from '@/assets/crypto-3d-icons/CRV-3d-icon.png';
import BALIcon from '@/assets/crypto-3d-icons/BAL-3d-icon.png';
import RVNIcon from '@/assets/crypto-3d-icons/RVN-3d-icon.png';
import ZILIcon from '@/assets/crypto-3d-icons/ZIL-3d-icon.png';
import PEPEIcon from '@/assets/crypto-3d-icons/PEPE-3d-icon.png';
import BONKIcon from '@/assets/crypto-3d-icons/BONK-3d-icon.png';
import WIFIcon from '@/assets/crypto-3d-icons/WIF-3d-icon.png';
import FLOKIIcon from '@/assets/crypto-3d-icons/FLOKI-3d-icon.png';
import BABYDOGEIcon from '@/assets/crypto-3d-icons/BABYDOGE-3d-icon.png';
import OKBIcon from '@/assets/crypto-3d-icons/OKB-3d-icon.png';
import PENGUIcon from '@/assets/crypto-3d-icons/PENGU-3d-icon.png';
import TURBOIcon from '@/assets/crypto-3d-icons/TURBO-3d-icon.png';
import TRUMPIcon from '@/assets/crypto-3d-icons/TRUMP-3d-icon.png';
import XMRIcon from '@/assets/crypto-3d-icons/XMR-3d-icon.png';
import LUNCIcon from '@/assets/crypto-3d-icons/LUNC-3d-icon.png';
import USTCIcon from '@/assets/crypto-3d-icons/USTC-3d-icon.png';
import DAIIcon from '@/assets/crypto-3d-icons/DAI-3d-icon.png';
import CAKEIcon from '@/assets/crypto-3d-icons/CAKE-3d-icon.png';

interface CryptoStaticIconProps {
  symbol: string;
  name: string;
  size?: number;
  className?: string;
}

const crypto3DIconMap: Record<string, string> = {
  BTC: BTCIcon,
  ETH: ETHIcon,
  USDT: USDTIcon,
  BNB: BNBIcon,
  XRP: XRPIcon,
  USDC: USDCIcon,
  STETH: STETHIcon,
  ADA: ADAIcon,
  SOL: SOLIcon,
  DOGE: DOGEIcon,
  TRX: TRXIcon,
  TON: TONIcon,
  AVAX: AVAXIcon,
  DOT: DOTIcon,
  MATIC: MATICIcon,
  SHIB: SHIBIcon,
  LTC: LTCIcon,
  BCH: BCHIcon,
  LINK: LINKIcon,
  XLM: XLMIcon,
  UNI: UNIIcon,
  ATOM: ATOMIcon,
  ETC: ETCIcon,
  HBAR: HBARIcon,
  FIL: FILIcon,
  ICP: ICPIcon,
  CRO: CROIcon,
  APT: APTIcon,
  NEAR: NEARIcon,
  VET: VETIcon,
  GRT: GRTIcon,
  ALGO: ALGOIcon,
  QNT: QNTIcon,
  MANA: MANAIcon,
  SAND: SANDIcon,
  AAVE: AAVEIcon,
  MKR: MKRIcon,
  LRC: LRCIcon,
  ENJ: ENJIcon,
  BAT: BATIcon,
  ZEC: ZECIcon,
  COMP: COMPIcon,
  YFI: YFIIcon,
  SNX: SNXIcon,
  '1INCH': ONEINCHIcon,
  SUSHI: SUSHIIcon,
  FTM: FTMIcon,
  FLOW: FLOWIcon,
  EGLD: EGLDIcon,
  ONE: ONEIcon,
  THETA: THETAIcon,
  CRV: CRVIcon,
  BAL: BALIcon,
  RVN: RVNIcon,
  ZIL: ZILIcon,
  PEPE: PEPEIcon,
  BONK: BONKIcon,
  WIF: WIFIcon,
  FLOKI: FLOKIIcon,
  BABYDOGE: BABYDOGEIcon,
  OKB: OKBIcon,
  PENGU: PENGUIcon,
  TURBO: TURBOIcon,
  TRUMP: TRUMPIcon,
  XMR: XMRIcon,
  LUNC: LUNCIcon,
  USTC: USTCIcon,
  DAI: DAIIcon,
  CAKE: CAKEIcon,
};

export const CryptoStaticIcon: React.FC<CryptoStaticIconProps> = ({ 
  symbol, 
  name, 
  size = 64, 
  className = "" 
}) => {
  const iconSrc = crypto3DIconMap[symbol.toUpperCase()];
  
  if (!iconSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold text-xs">{symbol.substring(0, 3)}</span>
      </div>
    );
  }

  return (
    <img
      src={iconSrc}
      alt={`${name} (${symbol}) 3D icon`}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  );
};

export const Static3DIconShowcase: React.FC = () => {
  const showcaseTokens = [
    // Major cryptocurrencies
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'BNB', name: 'Binance Coin' },
    { symbol: 'XRP', name: 'Ripple' },
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'STETH', name: 'Staked Ether' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'DOGE', name: 'Dogecoin' },
    
    // Layer 1 blockchains
    { symbol: 'TRX', name: 'TRON' },
    { symbol: 'TON', name: 'Toncoin' },
    { symbol: 'AVAX', name: 'Avalanche' },
    { symbol: 'DOT', name: 'Polkadot' },
    { symbol: 'MATIC', name: 'Polygon' },
    { symbol: 'ATOM', name: 'Cosmos' },
    { symbol: 'NEAR', name: 'NEAR Protocol' },
    { symbol: 'FTM', name: 'Fantom' },
    
    // DeFi tokens
    { symbol: 'UNI', name: 'Uniswap' },
    { symbol: 'AAVE', name: 'Aave' },
    { symbol: 'MKR', name: 'Maker' },
    { symbol: 'COMP', name: 'Compound' },
    { symbol: 'YFI', name: 'Yearn Finance' },
    { symbol: 'SNX', name: 'Synthetix' },
    { symbol: 'CRV', name: 'Curve DAO' },
    { symbol: 'SUSHI', name: 'SushiSwap' },
    
    // Meme coins
    { symbol: 'SHIB', name: 'Shiba Inu' },
    { symbol: 'PEPE', name: 'Pepe' },
    { symbol: 'BONK', name: 'Bonk' },
    { symbol: 'WIF', name: 'dogwifhat' },
    { symbol: 'FLOKI', name: 'FLOKI' },
    { symbol: 'BABYDOGE', name: 'Baby Doge Coin' },
    
    // Exchange tokens & New tokens
    { symbol: 'OKB', name: 'OKB' },
    { symbol: 'PENGU', name: 'Pudgy Penguins' },
    { symbol: 'TURBO', name: 'Turbo' },
    { symbol: 'TRUMP', name: 'TrumpCoin' },
    
    // Privacy & Stablecoins
    { symbol: 'XMR', name: 'Monero' },
    { symbol: 'DAI', name: 'DAI' },
    { symbol: 'LUNC', name: 'Terra Luna Classic' },
    { symbol: 'USTC', name: 'TerraClassicUSD' },
    { symbol: 'CAKE', name: 'PancakeSwap' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          真实3D立体静态大图标展示
        </h1>
        <p className="text-muted-foreground text-lg">
          高质量3D渲染的加密货币静态图标，每个都有独特的设计和材质效果
        </p>
      </div>

      {/* Large showcase grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
        {showcaseTokens.map((token) => (
          <Card key={token.symbol} className="p-4 bg-gradient-crypto border-border hover:shadow-crypto transition-all duration-300 text-center">
            <div className="flex flex-col items-center space-y-3">
              <CryptoStaticIcon 
                symbol={token.symbol} 
                name={token.name} 
                size={80} 
                className="hover:scale-110 transition-transform duration-200"
              />
              <div>
                <h3 className="font-bold text-foreground text-sm">{token.symbol}</h3>
                <p className="text-xs text-muted-foreground">{token.name}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
          <h3 className="text-xl font-bold text-blue-400 mb-4">高质量3D渲染</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 真实的3D立体效果</li>
            <li>• 高分辨率512x512像素</li>
            <li>• 精细的材质和光照</li>
            <li>• 专业级视觉效果</li>
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
          <h3 className="text-xl font-bold text-purple-400 mb-4">独特设计风格</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 每个币种独特造型</li>
            <li>• 反映品牌特色元素</li>
            <li>• 现代科技美学</li>
            <li>• 金属质感设计</li>
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30">
          <h3 className="text-xl font-bold text-green-400 mb-4">完整支持</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 支持93种加密货币</li>
            <li>• 包含所有主流币种</li>
            <li>• DeFi和Meme币专项</li>
            <li>• 可扩展架构设计</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Static3DIconShowcase;