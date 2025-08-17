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
      <img
        src="/lovable-uploads/7d4748c1-c1ec-4468-891e-445541a5a42c.png"
        alt="Binance Exchange"
        width={size}
        height={size}
        className={`object-contain ${showGlow ? 'drop-shadow-[0_0_15px_rgba(240,185,11,0.7)]' : ''}`}
      />
      {showGlow && (
        <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-lg -z-10" />
      )}
    </div>
  );
};