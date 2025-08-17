import React from 'react';

interface BinanceExchangeLogoProps {
  className?: string;
  size?: number;
  showGlow?: boolean;
}

export const BinanceExchangeLogo: React.FC<BinanceExchangeLogoProps> = ({
  className = "",
  size = 48,
  showGlow = false
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* 融入背景的Binance Logo */}
      <img
        src="/lovable-uploads/04ff343e-7ffb-4344-9e28-a3200e35eeba.png"
        alt="Binance Exchange"
        width={size}
        height={size}
        className={`
          object-contain transition-all duration-500 relative z-10
          mix-blend-mode-multiply opacity-90
          ${showGlow ? 'brightness-110 drop-shadow-[0_0_20px_rgba(240,185,11,0.8)]' : ''}
        `}
        style={{
          filter: showGlow 
            ? 'drop-shadow(0 0 15px rgba(240,185,11,0.7)) drop-shadow(0 0 30px rgba(240,185,11,0.4))' 
            : 'none'
        }}
      />
      
      {/* 去除所有边框和背景，纯净发光 */}
      {showGlow && (
        <>
          {/* 最小化发光效果 */}
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 blur-sm rounded-xl animate-pulse -z-10" />
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/5 to-amber-400/5 blur-md rounded-xl animate-pulse -z-20" 
               style={{animationDelay: '0.5s'}} />
          
          {/* 成功指示点 */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50 z-20" />
        </>
      )}
    </div>
  );
};