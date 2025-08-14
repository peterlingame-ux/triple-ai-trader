import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  BTC3DLogo, 
  ETH3DLogo, 
  BNB3DLogo, 
  DOGE3DLogo, 
  SOL3DLogo, 
  ADA3DLogo, 
  OKB3DLogo, 
  PENGU3DLogo, 
  Crypto3DIcon 
} from '@/components/crypto3d';

export const Crypto3DShowcase: React.FC = () => {
  const showcaseCoins = [
    { symbol: 'OKB', name: 'OKB', price: '$45.20', change: '+2.34%', isPositive: true },
    { symbol: 'PENGU', name: 'Pudgy Penguins', price: '$0.035', change: '+12.75%', isPositive: true },
    { symbol: 'BTC', name: 'Bitcoin', price: '$43,127', change: '-1.23%', isPositive: false },
    { symbol: 'ETH', name: 'Ethereum', price: '$2,560', change: '+3.45%', isPositive: true },
    { symbol: 'BNB', name: 'Binance Coin', price: '$291', change: '+0.89%', isPositive: true },
    { symbol: 'DOGE', name: 'Dogecoin', price: '$0.08', change: '+5.67%', isPositive: true },
  ];

  const renderCrypto3D = (symbol: string) => {
    switch (symbol) {
      case 'BTC':
        return <BTC3DLogo size={80} />;
      case 'ETH':
        return <ETH3DLogo size={80} />;
      case 'BNB':
        return <BNB3DLogo size={80} />;
      case 'DOGE':
        return <DOGE3DLogo size={80} />;
      case 'SOL':
        return <SOL3DLogo size={80} />;
      case 'ADA':
        return <ADA3DLogo size={80} />;
      case 'OKB':
        return <OKB3DLogo size={80} />;
      case 'PENGU':
        return <PENGU3DLogo size={80} />;
      default:
        return <Crypto3DIcon symbol={symbol} size={80} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          全新3D加密货币图标展示
        </h1>
        <p className="text-muted-foreground text-lg">
          体验真实的3D图标效果，包含全新的OKB和PENGU币种
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {showcaseCoins.map((coin) => (
          <Card key={coin.symbol} className="p-6 bg-gradient-crypto border-border hover:shadow-crypto transition-all duration-300 rounded-xl">
            <div className="flex flex-col items-center space-y-4">
              {/* 3D Icon */}
              <div className="w-20 h-20 flex items-center justify-center">
                {renderCrypto3D(coin.symbol)}
              </div>
              
              {/* Coin Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground font-orbitron">
                  {coin.symbol}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {coin.name}
                </p>
                <p className="text-lg font-mono font-bold text-foreground">
                  {coin.price}
                </p>
                <p className={`text-sm font-medium ${
                  coin.isPositive ? 'text-success' : 'text-destructive'
                }`}>
                  {coin.change}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12">
              <OKB3DLogo size={48} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-400">OKB 3D图标</h3>
              <p className="text-sm text-muted-foreground">欧易币专用3D图标</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 八角形设计，体现OKX品牌特色</li>
            <li>• 金属质感与发光效果</li>
            <li>• 流畅的旋转动画</li>
            <li>• 蓝色渐变配色方案</li>
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-black/20 border-orange-500/30">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12">
              <PENGU3DLogo size={48} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-400">PENGU 3D图标</h3>
              <p className="text-sm text-muted-foreground">胖企鹅专用3D图标</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• 可爱的企鹅造型设计</li>
            <li>• 黑白配色与橙色细节</li>
            <li>• 轻柔的上下浮动动画</li>
            <li>• 冰雪底座效果</li>
          </ul>
        </Card>
      </div>

      {/* Technical Features */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
        <h3 className="text-2xl font-bold text-purple-400 mb-4">技术特性</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-2">React Three Fiber</h4>
            <p className="text-sm text-muted-foreground">
              基于Three.js的React 3D渲染引擎，提供高性能的3D图形效果
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">实时动画</h4>
            <p className="text-sm text-muted-foreground">
              流畅的旋转、缩放和浮动动画，增强视觉体验
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">自适应设计</h4>
            <p className="text-sm text-muted-foreground">
              支持不同尺寸和主题，完美适配各种界面需求
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Crypto3DShowcase;