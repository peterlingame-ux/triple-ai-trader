import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface SimpleTradingChartProps {
  symbol: string;
  className?: string;
}

export const SimpleTradingChart: React.FC<SimpleTradingChartProps> = ({ 
  symbol, 
  className = '' 
}) => {
  // 模拟价格数据
  const mockPrice = 43364.25;
  const mockChange = -104.69;
  const mockChangePercent = -2.34;
  
  // 模拟K线数据点
  const mockKlinePoints = Array.from({ length: 50 }, (_, i) => {
    const basePrice = mockPrice + Math.sin(i * 0.2) * 500;
    const variation = (Math.random() - 0.5) * 200;
    return basePrice + variation;
  });

  const maxPrice = Math.max(...mockKlinePoints);
  const minPrice = Math.min(...mockKlinePoints);
  const priceRange = maxPrice - minPrice;

  return (
    <Card className={`bg-slate-900 border-slate-700 ${className}`}>
      <div className="p-4">
        {/* 头部信息 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white">
              {symbol}/USDT K线图表
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono font-bold text-white">
                ${mockPrice.toFixed(2)}
              </span>
              <div className={`flex items-center gap-1 ${mockChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {mockChangePercent >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-mono">
                  {mockChangePercent >= 0 ? '+' : ''}{mockChange.toFixed(2)} 
                  ({mockChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 简化的图表区域 */}
        <div className="w-full h-96 bg-slate-800/50 rounded-lg border border-slate-700/50 relative overflow-hidden">
          {/* 模拟K线图 */}
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* 背景网格 */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* 价格线 */}
            <polyline
              points={mockKlinePoints.map((price, index) => {
                const x = (index / (mockKlinePoints.length - 1)) * 100;
                const y = ((maxPrice - price) / priceRange) * 80 + 10;
                return `${x}%,${y}%`;
              }).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* 价格点 */}
            {mockKlinePoints.slice(-10).map((price, index) => {
              const x = ((mockKlinePoints.length - 10 + index) / (mockKlinePoints.length - 1)) * 100;
              const y = ((maxPrice - price) / priceRange) * 80 + 10;
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill="#10b981"
                  className="animate-pulse"
                />
              );
            })}
          </svg>

          {/* 覆盖层信息 */}
          <div className="absolute top-4 left-4 bg-slate-900/80 rounded px-3 py-2">
            <div className="text-xs text-slate-400 space-y-1">
              <div>开: <span className="text-white">$43,744.00</span></div>
              <div>高: <span className="text-green-400">$44,532.81</span></div>
              <div>低: <span className="text-red-400">$42,222.47</span></div>
              <div>收: <span className="text-white">$43,364.25</span></div>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-slate-900/80 rounded px-3 py-2">
            <div className="text-xs text-slate-400">
              <div className="text-green-400">● 实时模拟数据</div>
            </div>
          </div>
        </div>

        {/* 技术指标 */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">RSI(14)</div>
            <div className="text-lg font-mono font-bold text-yellow-400">
              65.42
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">MACD</div>
            <div className="text-sm font-mono text-green-400">
              +0.68%
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">MA20</div>
            <div className="text-sm font-mono text-blue-400">
              $43,245.80
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">成交量</div>
            <div className="text-sm font-mono text-purple-400">
              312.8K
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};