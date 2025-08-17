import React from 'react';
import binance3DLogo from '../assets/binance-3d-logo.png';

interface BinanceExchangeLogoProps {
  size?: number;
  className?: string;
  isConfigured?: boolean;
}

export const BinanceExchangeLogo: React.FC<BinanceExchangeLogoProps> = ({
  size = 32,
  className = "",
  isConfigured = false
}) => {
  return (
    <div 
      className={`relative rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 p-1 ${className}`}
      style={{ width: size + 4, height: size + 4 }}
    >
      <div 
        className={`relative rounded-full overflow-hidden bg-white/10 backdrop-blur-sm ${
          isConfigured ? 'ring-2 ring-primary/50 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : ''
        }`}
        style={{ width: size, height: size }}
      >
        <img
          src={binance3DLogo}
          alt="Binance Exchange"
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
        />
        {/* 光环效果 */}
        <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-2 group-hover:ring-primary/40 transition-all duration-300"></div>
      </div>
      {isConfigured && (
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
      )}
    </div>
  );
};

export default BinanceExchangeLogo;