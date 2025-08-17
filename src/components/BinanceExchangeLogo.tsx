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
      {/* 真实的Binance官方Logo */}
      <img
        src="/lovable-uploads/38caa01f-8296-4f15-af91-60ab8b06ebfa.png"
        alt="Binance Exchange"
        width={size}
        height={size}
        className={`
          object-contain transition-all duration-500 relative z-10 rounded-lg
          ${showGlow ? 'brightness-110 drop-shadow-[0_0_20px_rgba(240,185,11,0.8)]' : ''}
        `}
      />
      
      {/* Enhanced Glow Effects for Success State */}
      {showGlow && (
        <>
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 to-amber-400/30 blur-md animate-pulse -z-10" />
          
          {/* Middle glow */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-400/20 blur-lg animate-pulse -z-20" 
               style={{animationDelay: '0.5s'}} />
          
          {/* Outer glow */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-yellow-400/10 to-amber-400/10 blur-xl animate-pulse -z-30" 
               style={{animationDelay: '1s'}} />
          
          {/* Rotating ring effect */}
          <div className="absolute inset-0 rounded-full border border-yellow-400/40 animate-spin -z-5" 
               style={{animationDuration: '3s'}} />
          
          {/* Pulsing dot indicators */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50 z-20" />
        </>
      )}
    </div>
  );
};