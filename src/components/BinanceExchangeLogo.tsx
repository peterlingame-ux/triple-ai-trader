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
      
      {/* 柔和发光效果，与背景融合 */}
      {showGlow && (
        <>
          {/* 主发光环 - 更柔和 */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/15 to-amber-400/15 blur-md animate-pulse -z-10" />
          
          {/* 扩散发光 */}
          <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-yellow-400/8 to-amber-400/8 blur-lg animate-pulse -z-20" 
               style={{animationDelay: '0.5s'}} />
          
          {/* 外层辉光 */}
          <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-yellow-400/4 to-amber-400/4 blur-xl animate-pulse -z-30" 
               style={{animationDelay: '1s'}} />
          
          {/* 成功指示点 */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50 z-20" />
        </>
      )}
    </div>
  );
};