import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Activity,
  DollarSign
} from "lucide-react";

interface MarketData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  high: string;
  low: string;
  openPrice: string;
}

interface BinanceMarketDataProps {
  onDataUpdate?: (data: MarketData[]) => void;
}

export const BinanceMarketData = ({ onDataUpdate }: BinanceMarketDataProps) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT'];

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/binance-market-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols })
      });

      if (response.ok) {
        const data = await response.json();
        setMarketData(data.marketData || []);
        setLastUpdate(new Date());
        onDataUpdate?.(data.marketData || []);
        console.log('币安市场数据更新:', data.marketData);
      } else {
        console.error('获取市场数据失败');
      }
    } catch (error) {
      console.error('获取市场数据错误:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 初始获取数据
    fetchMarketData();
    
    // 设置定时更新（每30秒）
    const interval = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num > 1000) return num.toFixed(2);
    if (num > 1) return num.toFixed(4);
    return num.toFixed(6);
  };

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume);
    if (num > 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num > 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  return (
    <Card className="bg-slate-900/95 border-slate-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">币安实时行情</h2>
            <Badge className="bg-yellow-600">实时</Badge>
          </div>
          
          <div className="flex items-center gap-4">
            {lastUpdate && (
              <div className="text-sm text-slate-400">
                更新: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            <Button
              onClick={fetchMarketData}
              disabled={loading}
              size="sm"
              className="bg-slate-700 hover:bg-slate-600"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {marketData.map((data) => {
            const isPositive = parseFloat(data.priceChangePercent) >= 0;
            
            return (
              <div key={data.symbol} className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{data.symbol}</h3>
                    <Badge className={`${isPositive ? 'bg-green-600' : 'bg-red-600'}`}>
                      {isPositive ? '+' : ''}{parseFloat(data.priceChangePercent).toFixed(2)}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">当前价格</div>
                    <div className="text-lg font-bold text-white">
                      ${formatPrice(data.price)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-400 mb-1">24h变化</div>
                    <div className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? '+' : ''}${parseFloat(data.priceChange).toFixed(2)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-400 mb-1">24h最高</div>
                    <div className="text-lg font-bold text-white">
                      ${formatPrice(data.high)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-slate-400 mb-1">24h最低</div>
                    <div className="text-lg font-bold text-white">
                      ${formatPrice(data.low)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">开盘价</div>
                      <div className="text-sm font-medium text-slate-300">
                        ${formatPrice(data.openPrice)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-slate-400 mb-1">24h成交量</div>
                      <div className="text-sm font-medium text-slate-300">
                        {formatVolume(data.volume)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {marketData.length === 0 && !loading && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">暂无市场数据</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
            <p className="text-slate-400">获取市场数据中...</p>
          </div>
        )}
      </div>
    </Card>
  );
};