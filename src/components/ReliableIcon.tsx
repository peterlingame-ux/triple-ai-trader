import React, { useState, useCallback } from 'react';

interface ReliableIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

// 专门为每个币种优化的图标URL
const getSpecificIconUrls = (symbol: string) => {
  const normalizedSymbol = symbol.toUpperCase();
  
  // 特定币种的最佳图标源
  const specificUrls: Record<string, string[]> = {
    BTC: [
      'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
      'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'
    ],
    ETH: [
      'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
    ],
    USDT: [
      'https://cryptologos.cc/logos/tether-usdt-logo.png',
      'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png'
    ],
    BNB: [
      'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
      'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
    ],
    // ... 更多币种可以继续添加
  };

  // 如果有特定配置，使用特定的；否则使用通用的
  if (specificUrls[normalizedSymbol]) {
    return specificUrls[normalizedSymbol];
  }

  // 通用的图标获取策略
  return [
    `https://assets.coingecko.com/coins/images/1/large/${symbol.toLowerCase()}.png`,
    `https://cryptologos.cc/logos/${symbol.toLowerCase()}-${symbol.toLowerCase()}-logo.png`,
    `https://s2.coinmarketcap.com/static/img/coins/64x64/1.png`,
  ];
};

// 币种特定的颜色方案
const getCryptoColors = (symbol: string) => {
  const colors: Record<string, string> = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    USDT: '#26A17B',
    USDC: '#2775CA',
    BNB: '#F3BA2F',
    XRP: '#23292F',
    ADA: '#0033AD',
    SOL: '#9945FF',
    DOGE: '#C2A633',
    DOT: '#E6007A',
    MATIC: '#8247E5',
    LINK: '#375BD2',
    UNI: '#FF007A',
    LTC: '#BFBBBB',
    BCH: '#8DC351',
    AVAX: '#E84142',
    ATOM: '#2E3148',
    SHIB: '#FFA409',
    TRX: '#FF061E',
    default: '#6B7280'
  };
  return colors[symbol] || colors.default;
};

export const ReliableIcon: React.FC<ReliableIconProps> = ({
  symbol,
  size = 32,
  className = ""
}) => {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const iconUrls = getSpecificIconUrls(symbol);
  const cryptoColor = getCryptoColors(symbol);

  const handleImageError = useCallback(() => {
    if (currentUrlIndex < iconUrls.length - 1) {
      setCurrentUrlIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  }, [currentUrlIndex, iconUrls.length]);

  const handleImageLoad = useCallback(() => {
    setHasError(false);
  }, []);

  // 如果所有图标都失败，显示美观的默认图标
  if (hasError) {
    return (
      <div 
        className={`relative rounded-full overflow-hidden flex items-center justify-center font-bold text-white ${className}`}
        style={{ 
          width: size, 
          height: size,
          background: `linear-gradient(135deg, ${cryptoColor}, ${cryptoColor}dd)`
        }}
      >
        <span style={{ fontSize: size * 0.4 }}>
          {symbol.charAt(0)}
        </span>
        {/* 光环效果 */}
        <div className="absolute inset-0 rounded-full ring-1 ring-white/30"></div>
      </div>
    );
  }

  return (
    <div 
      className={`relative rounded-full overflow-hidden bg-white/5 backdrop-blur-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={iconUrls[currentUrlIndex]}
        alt={`${symbol} logo`}
        className="w-full h-full object-cover rounded-full"
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      />
      {/* 光环效果 */}
      <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-2 group-hover:ring-primary/40 transition-all duration-300"></div>
    </div>
  );
};

export default ReliableIcon;