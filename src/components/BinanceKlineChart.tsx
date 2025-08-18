import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalIndicators {
  rsi: number;
  ma5: number;
  ma10: number;
  ma20: number;
  ma50: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  kdj_k: number;
  kdj_d: number;
  kdj_j: number;
  volume: number;
}

interface BinanceKlineChartProps {
  symbol: string;
  className?: string;
}

const timeframes = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '1d', label: '1D' },
  { value: '1w', label: '1W' },
  { value: '1M', label: '1M' }
];

export const BinanceKlineChart: React.FC<BinanceKlineChartProps> = ({ 
  symbol, 
  className = '' 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicators | null>(null);
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState('1h');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const { toast } = useToast();

  // 获取币安API配置
  const getBinanceConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'get',
          service: 'binance_api_config' 
        }
      });

      if (error || !data?.success) {
        return { isConfigured: false };
      }

      return { 
        isConfigured: true,
        apiKey: data.config.apiKey,
        secretKey: data.config.secretKey,
        testnet: data.config.testnet || false
      };
    } catch (error) {
      console.error('获取币安配置失败:', error);
      return { isConfigured: false };
    }
  }, []);

  // 获取K线数据
  const fetchKlineData = useCallback(async () => {
    if (!symbol) return;
    
    setLoading(true);
    try {
      const config = await getBinanceConfig();
      
      if (!config.isConfigured) {
        toast({
          title: "API未配置",
          description: "请先配置币安API密钥",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('binance-klines', {
        body: {
          symbol,
          interval,
          limit: 500,
          apiKey: config.apiKey,
          secretKey: config.secretKey,
          testnet: config.testnet
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.klines) {
        setKlineData(data.klines);
        setTechnicalIndicators(data.technicalIndicators);
        
        // 更新当前价格信息
        const latestCandle = data.klines[data.klines.length - 1];
        const previousCandle = data.klines[data.klines.length - 2];
        
        if (latestCandle && previousCandle) {
          const change = latestCandle.close - previousCandle.close;
          const changePercent = (change / previousCandle.close) * 100;
          
          setCurrentPrice(latestCandle.close);
          setPriceChange(change);
          setPriceChangePercent(changePercent);
        }

        toast({
          title: "数据更新成功",
          description: `${symbol} K线数据已更新`
        });
      }
    } catch (error) {
      console.error('获取K线数据失败:', error);
      toast({
        title: "数据获取失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [symbol, interval, getBinanceConfig, toast]);

  // 处理时间周期变化
  const handleIntervalChange = (newInterval: string) => {
    setInterval(newInterval);
  };

  // 初始加载数据
  useEffect(() => {
    fetchKlineData();
  }, [fetchKlineData]);

  return (
    <Card className={`bg-gradient-to-br from-slate-900/90 to-blue-900/30 border-slate-700 backdrop-blur-sm ${className}`}>
      <div className="p-4">
        {/* 头部信息 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-white">
              {symbol}/USDT 专业K线图表
            </h3>
            {currentPrice > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-bold text-white">
                  ${currentPrice.toFixed(5)}
                </span>
                <div className={`flex items-center gap-1 ${priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChangePercent >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-mono">
                    {priceChangePercent >= 0 ? '+' : ''}{priceChange.toFixed(5)} 
                    ({priceChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchKlineData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="border-green-600 text-green-400 hover:bg-green-600/20"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              刷新数据
            </Button>
          </div>
        </div>

        {/* 时间周期按钮 */}
        <div className="flex items-center gap-1 mb-4 flex-wrap">
          {timeframes.map((tf) => (
            <Button
              key={tf.value}
              size="sm"
              variant={interval === tf.value ? "default" : "outline"}
              onClick={() => handleIntervalChange(tf.value)}
              className={`text-xs px-3 py-1 h-7 ${
                interval === tf.value 
                  ? 'bg-amber-500 text-black hover:bg-amber-600' 
                  : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tf.label}
            </Button>
          ))}
        </div>

        {/* K线数据显示 */}
        {klineData.length > 0 && (
          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="grid grid-cols-5 gap-4 text-sm">
              <div>
                <span className="text-slate-400">开盘价: </span>
                <span className="text-white font-mono">${klineData[klineData.length - 1]?.open.toFixed(5)}</span>
              </div>
              <div>
                <span className="text-slate-400">最高价: </span>
                <span className="text-green-400 font-mono">${klineData[klineData.length - 1]?.high.toFixed(5)}</span>
              </div>
              <div>
                <span className="text-slate-400">最低价: </span>
                <span className="text-red-400 font-mono">${klineData[klineData.length - 1]?.low.toFixed(5)}</span>
              </div>
              <div>
                <span className="text-slate-400">收盘价: </span>
                <span className="text-white font-mono">${klineData[klineData.length - 1]?.close.toFixed(5)}</span>
              </div>
              <div>
                <span className="text-slate-400">成交量: </span>
                <span className="text-blue-400 font-mono">{(klineData[klineData.length - 1]?.volume || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 图表容器 - 使用简化的可视化 */}
        <div className="w-full h-96 bg-slate-800/30 rounded-lg border border-slate-700 flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-amber-400" />
              <div className="text-slate-300">加载K线数据中...</div>
            </div>
          ) : klineData.length > 0 ? (
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <div className="text-lg font-semibold text-white mb-2">
                {symbol}/USDT 专业K线图表 ({interval})
              </div>
              <div className="text-slate-300 mb-4">
                共 {klineData.length} 根K线数据
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-green-400">
                  最新价格: ${klineData[klineData.length - 1]?.close.toFixed(5)}
                </div>
                <div className="text-blue-400">
                  最高: ${Math.max(...klineData.map(k => k.high)).toFixed(5)}
                </div>
                <div className="text-red-400">
                  最低: ${Math.min(...klineData.map(k => k.low)).toFixed(5)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <div className="text-slate-400">暂无K线数据</div>
            </div>
          )}
        </div>

        {/* 技术指标面板 */}
        {technicalIndicators && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">RSI(14)</div>
              <div className={`text-lg font-mono font-bold ${
                technicalIndicators.rsi > 70 ? 'text-red-400' : 
                technicalIndicators.rsi < 30 ? 'text-green-400' : 'text-amber-400'
              }`}>
                {technicalIndicators.rsi.toFixed(2)}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">MACD</div>
              <div className={`text-sm font-mono ${
                technicalIndicators.macdHistogram > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {technicalIndicators.macd.toFixed(4)}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">MA20</div>
              <div className="text-sm font-mono text-blue-400">
                ${technicalIndicators.ma20.toFixed(5)}
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">成交量</div>
              <div className="text-sm font-mono text-purple-400">
                {(technicalIndicators.volume / 1000).toFixed(2)}K
              </div>
            </div>
          </div>
        )}

        {/* 实时数据标识 */}
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            币安实时K线数据
          </Badge>
          
          {klineData.length > 0 && (
            <div className="text-xs text-slate-400">
              最后更新: {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};