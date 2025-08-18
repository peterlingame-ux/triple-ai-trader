import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData, HistogramData } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

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

interface KlineChartData {
  symbol: string;
  interval: string;
  klines: KlineData[];
  technicalIndicators: TechnicalIndicators;
  lastUpdate: number;
}

interface BinanceKlineChartProps {
  symbol: string;
  className?: string;
}

const intervals = [
  { value: '1m', label: '1分钟' },
  { value: '5m', label: '5分钟' },
  { value: '15m', label: '15分钟' },
  { value: '30m', label: '30分钟' },
  { value: '1h', label: '1小时' },
  { value: '4h', label: '4小时' },
  { value: '1d', label: '1天' },
  { value: '1w', label: '1周' },
];

export const BinanceKlineChart = ({ symbol, className }: BinanceKlineChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const ma5SeriesRef = useRef<any>(null);
  const ma20SeriesRef = useRef<any>(null);
  
  const [data, setData] = useState<KlineChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState('1h');
  const { toast } = useToast();

  const fetchKlineData = async (interval: string) => {
    try {
      setLoading(true);
      setError(null);

      // 获取币安API配置
      const { data: configData, error: configError } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'get',
          service: 'binance_api_config' 
        }
      });

      if (configError) {
        throw new Error('无法获取API配置');
      }

      const config = configData?.config || {};

      // 获取K线数据
      const { data: klineData, error: klineError } = await supabase.functions.invoke('binance-klines', {
        body: {
          symbol: symbol.toUpperCase(),
          interval: interval,
          limit: 500,
          apiKey: config.apiKey,
          secretKey: config.secretKey,
          testnet: config.testnet || false
        }
      });

      if (klineError) {
        throw new Error(klineError.message || '获取K线数据失败');
      }

      setData(klineData);
      updateChart(klineData);
    } catch (err) {
      console.error('获取K线数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
      toast({
        title: "获取K线数据失败",
        description: err instanceof Error ? err.message : '请检查网络连接',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const initChart = () => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: 'transparent' },
        textColor: '#888',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#485563',
      },
      timeScale: {
        borderColor: '#485563',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // K线图 - 使用正确的方法名
    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#00ff88',
      downColor: '#ff4976',
      borderVisible: false,
      wickUpColor: '#00ff88',
      wickDownColor: '#ff4976',
    });

    // 成交量
    const volumeSeries = (chart as any).addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });

    // MA5线
    const ma5Series = (chart as any).addLineSeries({
      color: '#ffeb3b',
      lineWidth: 1,
      title: 'MA5',
    });

    // MA20线
    const ma20Series = (chart as any).addLineSeries({
      color: '#ff9800',
      lineWidth: 1,
      title: 'MA20',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;
    ma5SeriesRef.current = ma5Series;
    ma20SeriesRef.current = ma20Series;

    // 处理窗口大小变化
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  };

  const updateChart = (chartData: KlineChartData) => {
    if (!chartRef.current || !candlestickSeriesRef.current || !volumeSeriesRef.current) return;

    try {
      // 转换K线数据
      const candlestickData = chartData.klines.map(kline => ({
        time: kline.time,
        open: kline.open,
        high: kline.high,
        low: kline.low,
        close: kline.close,
      }));

      // 转换成交量数据
      const volumeData = chartData.klines.map(kline => ({
        time: kline.time,
        value: kline.volume,
        color: kline.close >= kline.open ? '#00ff8840' : '#ff497640',
      }));

      // 计算移动平均线数据
      const ma5Data = [];
      const ma20Data = [];
      
      for (let i = 4; i < chartData.klines.length; i++) {
        const ma5 = chartData.klines.slice(i - 4, i + 1).reduce((sum, k) => sum + k.close, 0) / 5;
        ma5Data.push({
          time: chartData.klines[i].time,
          value: ma5,
        });
      }

      for (let i = 19; i < chartData.klines.length; i++) {
        const ma20 = chartData.klines.slice(i - 19, i + 1).reduce((sum, k) => sum + k.close, 0) / 20;
        ma20Data.push({
          time: chartData.klines[i].time,
          value: ma20,
        });
      }

      // 更新图表数据
      candlestickSeriesRef.current.setData(candlestickData);
      volumeSeriesRef.current.setData(volumeData);
      
      if (ma5SeriesRef.current && ma5Data.length > 0) {
        ma5SeriesRef.current.setData(ma5Data);
      }
      
      if (ma20SeriesRef.current && ma20Data.length > 0) {
        ma20SeriesRef.current.setData(ma20Data);
      }

      // 自适应视图
      chartRef.current.timeScale().fitContent();
    } catch (error) {
      console.error('更新图表数据失败:', error);
    }
  };

  useEffect(() => {
    initChart();
    fetchKlineData(selectedInterval);

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol]);

  useEffect(() => {
    if (data) {
      fetchKlineData(selectedInterval);
    }
  }, [selectedInterval]);

  // 自动刷新
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchKlineData(selectedInterval);
      }
    }, 30000); // 30秒刷新一次

    return () => clearInterval(interval);
  }, [selectedInterval, loading]);

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* 控制面板 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">实时K线图 ({symbol})</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedInterval} onValueChange={setSelectedInterval}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {intervals.map((interval) => (
                    <SelectItem key={interval.value} value={interval.value}>
                      {interval.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchKlineData(selectedInterval)}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          {data && (
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-primary/10">
                当前: ${data.klines[data.klines.length - 1]?.close.toFixed(4)}
              </Badge>
              <Badge variant={data.technicalIndicators.rsi > 70 ? "destructive" : data.technicalIndicators.rsi < 30 ? "default" : "secondary"}>
                RSI: {data.technicalIndicators.rsi.toFixed(2)}
              </Badge>
              <Badge variant="outline" className="bg-yellow-500/20">
                MA5: ${data.technicalIndicators.ma5.toFixed(4)}
              </Badge>
              <Badge variant="outline" className="bg-orange-500/20">
                MA20: ${data.technicalIndicators.ma20.toFixed(4)}
              </Badge>
              <Badge variant={data.technicalIndicators.macd > 0 ? "default" : "destructive"}>
                MACD: {data.technicalIndicators.macd.toFixed(4)}
              </Badge>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* K线图 */}
      <Card>
        <CardContent className="p-0">
          {loading && (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">正在加载币安K线数据...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => fetchKlineData(selectedInterval)} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重新加载
                </Button>
              </div>
            </div>
          )}
          
          <div 
            ref={chartContainerRef}
            className={`w-full ${loading || error ? 'hidden' : ''}`}
            style={{ height: '400px' }}
          />
        </CardContent>
      </Card>

      {/* 技术指标详情 */}
      {data && (
        <Tabs defaultValue="indicators" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="indicators">移动平均线</TabsTrigger>
            <TabsTrigger value="oscillators">振荡指标</TabsTrigger>
            <TabsTrigger value="bollinger">布林带分析</TabsTrigger>
          </TabsList>
          
          <TabsContent value="indicators">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  📈 移动平均线分析
                  <Badge variant="outline" className="text-xs">实时更新</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <p className="text-sm text-muted-foreground">MA5</p>
                    <p className="font-mono font-bold text-yellow-600 text-lg">
                      ${data.technicalIndicators.ma5.toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">短期趋势</p>
                  </div>
                  <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <p className="text-sm text-muted-foreground">MA10</p>
                    <p className="font-mono font-bold text-orange-600 text-lg">
                      ${data.technicalIndicators.ma10.toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">中短期趋势</p>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-sm text-muted-foreground">MA20</p>
                    <p className="font-mono font-bold text-red-600 text-lg">
                      ${data.technicalIndicators.ma20.toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">中期趋势</p>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-sm text-muted-foreground">MA50</p>
                    <p className="font-mono font-bold text-purple-600 text-lg">
                      ${data.technicalIndicators.ma50.toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">长期趋势</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="oscillators">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  📊 技术振荡指标
                  <Badge variant="outline" className="text-xs">实时分析</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      🎯 RSI 相对强弱指标 (14)
                    </h4>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 bg-muted rounded-full h-3 relative">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            data.technicalIndicators.rsi > 70 ? 'bg-red-500' : 
                            data.technicalIndicators.rsi < 30 ? 'bg-green-500' : 
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${Math.min(data.technicalIndicators.rsi, 100)}%` }}
                        />
                        {/* 超买超卖标记 */}
                        <div className="absolute top-0 left-[30%] w-px h-3 bg-green-600"></div>
                        <div className="absolute top-0 left-[70%] w-px h-3 bg-red-600"></div>
                      </div>
                      <span className="font-mono text-lg font-bold min-w-12">
                        {data.technicalIndicators.rsi.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>超卖 (&lt;30)</span>
                      <span>中性 (30-70)</span>
                      <span>超买 (&gt;70)</span>
                    </div>
                    <div className="mt-3">
                      <Badge 
                        variant={
                          data.technicalIndicators.rsi > 70 ? "destructive" : 
                          data.technicalIndicators.rsi < 30 ? "default" : 
                          "secondary"
                        }
                        className="w-full justify-center"
                      >
                        {data.technicalIndicators.rsi > 70 ? '⚠️ 超买信号' : 
                         data.technicalIndicators.rsi < 30 ? '✅ 超卖信号' : 
                         '➖ 中性区间'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      📈 KDJ 随机指标
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-medium">K值:</span>
                        <span className="font-mono font-bold text-lg">{data.technicalIndicators.kdj_k.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-600 font-medium">D值:</span>
                        <span className="font-mono font-bold text-lg">{data.technicalIndicators.kdj_d.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-600 font-medium">J值:</span>
                        <span className="font-mono font-bold text-lg">{data.technicalIndicators.kdj_j.toFixed(2)}</span>
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <Badge 
                          variant={
                            (data.technicalIndicators.kdj_k > 80 && data.technicalIndicators.kdj_d > 80) ? "destructive" :
                            (data.technicalIndicators.kdj_k < 20 && data.technicalIndicators.kdj_d < 20) ? "default" :
                            "secondary"
                          }
                          className="w-full justify-center"
                        >
                          {(data.technicalIndicators.kdj_k > 80 && data.technicalIndicators.kdj_d > 80) ? '⚠️ KDJ超买' :
                           (data.technicalIndicators.kdj_k < 20 && data.technicalIndicators.kdj_d < 20) ? '✅ KDJ超卖' :
                           '➖ KDJ中性'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bollinger">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  📏 布林带通道分析 (20, 2)
                  <Badge variant="outline" className="text-xs">币安同步</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <span className="text-red-600 font-medium block">上轨 (阻力)</span>
                      <span className="font-mono text-red-600 font-bold text-lg">
                        ${data.technicalIndicators.bollingerUpper.toFixed(4)}
                      </span>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <span className="text-blue-600 font-medium block">中轨 (MA20)</span>
                      <span className="font-mono text-blue-600 font-bold text-lg">
                        ${data.technicalIndicators.bollingerMiddle.toFixed(4)}
                      </span>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <span className="text-green-600 font-medium block">下轨 (支撑)</span>
                      <span className="font-mono text-green-600 font-bold text-lg">
                        ${data.technicalIndicators.bollingerLower.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-muted-foreground font-medium">当前价格位置分析:</span>
                      <span className="font-mono text-lg font-bold">
                        ${data.klines[data.klines.length - 1]?.close.toFixed(4)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <Badge 
                        variant={
                          data.klines[data.klines.length - 1]?.close > data.technicalIndicators.bollingerUpper ? "destructive" :
                          data.klines[data.klines.length - 1]?.close < data.technicalIndicators.bollingerLower ? "default" :
                          "secondary"
                        }
                        className="w-full justify-center py-2 text-base"
                      >
                        {data.klines[data.klines.length - 1]?.close > data.technicalIndicators.bollingerUpper ? "🔥 突破上轨 - 强烈看涨" :
                         data.klines[data.klines.length - 1]?.close < data.technicalIndicators.bollingerLower ? "❄️ 突破下轨 - 强烈看跌" :
                         "📊 通道内运行 - 震荡行情"}
                      </Badge>
                      
                      <div className="text-sm text-muted-foreground text-center p-3 bg-muted/50 rounded">
                        <p className="mb-1">
                          <strong>布林带宽度:</strong> {((data.technicalIndicators.bollingerUpper - data.technicalIndicators.bollingerLower) / data.technicalIndicators.bollingerMiddle * 100).toFixed(2)}%
                        </p>
                        <p>
                          宽度越大表示波动性越高，宽度收窄通常预示着即将发生较大波动
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};