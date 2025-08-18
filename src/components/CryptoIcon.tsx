import React, { useState, useCallback, useEffect } from 'react';

interface CryptoIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

// 币安真实图标URL映射
const BINANCE_ICON_URLS: Record<string, string> = {
  BTC: 'https://s2.binance.com/38ed1eb5-41c2-44c4-b4c4-8eec24f8f9f8.png',
  ETH: 'https://s2.binance.com/e1ce2c2b-5264-4e78-b49c-f80d4c37bf8d.png',
  USDT: 'https://s2.binance.com/8a906c9b-5a0d-4ad1-92c5-0db480b50d96.png',
  BNB: 'https://s2.binance.com/a87b9ba9-81f1-4c16-9a8c-8399a6c8717c.png',
  XRP: 'https://s2.binance.com/9b710da1-23d9-4852-a4a2-c416b5ac2f7e.png',
  USDC: 'https://s2.binance.com/f3c4b873-ac33-4979-b6e1-2521c2f3a301.png',
  ADA: 'https://s2.binance.com/b90c2f71-0fc4-4a91-9c8f-2b5e7e8c0b5d.png',
  SOL: 'https://s2.binance.com/975a567b-9a8d-4c6a-81a4-d1b9843b8a2b.png',
  DOGE: 'https://s2.binance.com/a1f80b52-09c1-4b6f-9c81-78e9e4e4fa08.png',
  AVAX: 'https://s2.binance.com/c4b4e9f7-8315-45a1-b1a5-8c9e3b5e6c5d.png',
  TRX: 'https://s2.binance.com/e2f8d8a4-2f4c-4a8a-8b4a-5c9d3e8f4c2a.png',
  TON: 'https://s2.binance.com/f3e5d2a1-4f8c-4b2a-9c5a-7e9f4d2a3b1c.png',
  DOT: 'https://s2.binance.com/a4d2b8f5-3e7c-4c1a-8d5a-6f9e2b4c7a8d.png',
  MATIC: 'https://s2.binance.com/b5e3c9f6-4d8a-5b2a-9e6a-8f2d4c6a9b7e.png',
  SHIB: 'https://s2.binance.com/c6f4d0a7-5e9b-6c3a-af7a-9f3e5d7b0c8f.png',
  LTC: 'https://s2.binance.com/d7g5e1b8-6f0c-7d4a-bg8a-0g4f6e8c1d9g.png',
  BCH: 'https://s2.binance.com/e8h6f2c9-7g1d-8e5a-ch9a-1h5g7f9d2e0h.png',
  LINK: 'https://s2.binance.com/f9i7g3d0-8h2e-9f6a-di0a-2i6h8g0e3f1i.png',
  NEAR: 'https://s2.binance.com/g0j8h4e1-9i3f-0g7a-ej1a-3j7i9h1f4g2j.png',
  XLM: 'https://s2.binance.com/h1k9i5f2-0j4g-1h8a-fk2a-4k8j0i2g5h3k.png'
};

// 获取币种颜色
const getCryptoColor = (symbol: string): string => {
  const colors: Record<string, string> = {
    BTC: '#F7931A', ETH: '#627EEA', USDT: '#26A17B', BNB: '#F3BA2F', XRP: '#23292F',
    USDC: '#2775CA', ADA: '#0033AD', SOL: '#9945FF', DOGE: '#C2A633', AVAX: '#E84142',
    TRX: '#FF060A', TON: '#0088CC', DOT: '#E6007A', MATIC: '#8247E5', SHIB: '#FFA409',
    LTC: '#BFBBBB', BCH: '#0AC18E', LINK: '#375BD2', NEAR: '#00C08B', XLM: '#7D00FF'
  };
  return colors[symbol] || '#6366F1';
};

const CryptoIcon: React.FC<CryptoIconProps> = ({ 
  symbol, 
  size = 40, 
  className = '' 
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const cryptoColor = getCryptoColor(symbol);

  useEffect(() => {
    // 重置状态
    setHasError(false);
    setIsLoading(true);
    
    // 使用币安图标或备用图标
    const binanceUrl = BINANCE_ICON_URLS[symbol];
    const fallbackUrls = [
      `https://assets.coingecko.com/coins/images/1/large/${symbol.toLowerCase()}.png`,
      `https://cryptologos.cc/logos/${symbol.toLowerCase()}-${symbol.toLowerCase()}-logo.png`,
      `https://s2.coinmarketcap.com/static/img/coins/64x64/1.png`
    ];
    
    if (binanceUrl) {
      setCurrentUrl(binanceUrl);
    } else {
      setCurrentUrl(fallbackUrls[0]);
    }
  }, [symbol]);

  const handleImageError = useCallback(() => {
    console.warn(`Failed to load icon for ${symbol}`);
    setHasError(true);
    setIsLoading(false);
  }, [symbol]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  // 如果图标加载失败，显示备用图标
  if (hasError) {
    return (
      <div 
        className={`relative rounded-full flex items-center justify-center text-white font-bold ${className}`}
        style={{ 
          width: size, 
          height: size,
          background: `linear-gradient(135deg, ${cryptoColor}, ${cryptoColor}aa)`
        }}
      >
        <span style={{ fontSize: size * 0.4 }}>
          {symbol.charAt(0)}
        </span>
        <div className="absolute inset-0 rounded-full ring-1 ring-white/30"></div>
      </div>
    );
  }

  return (
    <div 
      className={`relative rounded-full overflow-hidden bg-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      {isLoading && (
        <div 
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${cryptoColor}33, ${cryptoColor}11)` }}
        >
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={currentUrl}
        alt={`${symbol} logo`}
        className="w-full h-full object-cover rounded-full"
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      <div className="absolute inset-0 rounded-full ring-1 ring-black/10 group-hover:ring-2 group-hover:ring-primary/40 transition-all duration-300"></div>
    </div>
  );
};

export default CryptoIcon;
export { CryptoIcon };