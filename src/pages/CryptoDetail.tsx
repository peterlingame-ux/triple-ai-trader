import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { CryptoStaticIcon } from '@/components/Static3DIconShowcase';
import { formatPrice, formatVolume } from '@/utils/cryptoDataUtils';
import { useToast } from '@/hooks/use-toast';
import { BinanceKlineChart } from '@/components/BinanceKlineChart';

interface CryptoDetailData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  volumeUsdt24h: number;
  openPrice: number;
  bidPrice: number;
  bidQty: number;
  askPrice: number;
  askQty: number;
  count: number;
  rsi: number;
  support: number;
  resistance: number;
  ma20: number;
  ma50: number;
  marketSentiment: 'bullish' | 'bearish';
  bids: Array<{ price: number; quantity: number }>;
  asks: Array<{ price: number; quantity: number }>;
  liquidity: {
    bidDepth: number;
    askDepth: number;
    spread: number;
    spreadPercent: number;
  };
}

const CryptoDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [data, setData] = useState<CryptoDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoDetail = async () => {
    if (!symbol) return;
    
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

      // 获取详细数据
      const { data: cryptoData, error: cryptoError } = await supabase.functions.invoke('binance-crypto-detail', {
        body: {
          symbol: symbol.toUpperCase(),
          apiKey: config.apiKey,
          secretKey: config.secretKey,
          testnet: config.testnet || false
        }
      });

      if (cryptoError) {
        throw new Error(cryptoError.message || '获取数据失败');
      }

      setData(cryptoData);
    } catch (err) {
      console.error('获取货币详情失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
      toast({
        title: "获取数据失败",
        description: "请检查网络连接或币安API配置",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoDetail();
    // 每30秒自动刷新
    const interval = setInterval(fetchCryptoDetail, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        <Card className="p-6 text-center">
          <p className="text-destructive mb-4">{error || '数据加载失败'}</p>
          <Button onClick={fetchCryptoDetail}>
            <RefreshCw className="w-4 h-4 mr-2" />
            重试
          </Button>
        </Card>
      </div>
    );
  }

  const isPositive = data.changePercent24h >= 0;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Button>
          <Button 
            variant="outline" 
            onClick={fetchCryptoDetail}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            刷新
          </Button>
        </div>

        {/* 基本信息卡片 */}
        <Card className="mb-6 bg-gradient-crypto">
          <CardHeader>
            <div className="flex items-center gap-4">
              <CryptoStaticIcon symbol={data.symbol} name={data.name} size={64} />
              <div className="flex-1">
                <CardTitle className="text-2xl font-orbitron">{data.symbol}</CardTitle>
                <p className="text-muted-foreground">{data.name}</p>
              </div>
              <Badge variant={isPositive ? "default" : "destructive"} className="px-4 py-2">
                {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {isPositive ? '+' : ''}{data.changePercent24h.toFixed(2)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-3xl font-bold font-mono text-foreground mb-2">
                  ${formatPrice(data.price)}
                </h3>
                <p className={`text-lg font-mono ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {isPositive ? '+' : ''}${Math.abs(data.change24h).toFixed(2)}
                </p>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h最高:</span>
                    <span className="font-mono">${formatPrice(data.high24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h最低:</span>
                    <span className="font-mono">${formatPrice(data.low24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">开盘价:</span>
                    <span className="font-mono">${formatPrice(data.openPrice)}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h交易量:</span>
                    <span className="font-mono">{formatVolume(data.volume24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h交易额:</span>
                    <span className="font-mono">${formatVolume(data.volumeUsdt24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h交易笔数:</span>
                    <span className="font-mono">{data.count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* K线图 */}
        <BinanceKlineChart symbol={data.symbol} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 订单簿 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                实时订单簿
                <Badge variant="outline">
                  价差: {data.liquidity.spreadPercent.toFixed(4)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-success mb-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    买盘 (Bids)
                  </h4>
                  <div className="space-y-1">
                    {data.bids.map((bid, index) => (
                      <div key={index} className="flex justify-between text-sm bg-success/5 p-1 rounded">
                        <span className="text-success font-mono font-bold">${bid.price.toFixed(4)}</span>
                        <span className="text-muted-foreground">{bid.quantity.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-destructive mb-2 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" />
                    卖盘 (Asks)
                  </h4>
                  <div className="space-y-1">
                    {data.asks.map((ask, index) => (
                      <div key={index} className="flex justify-between text-sm bg-destructive/5 p-1 rounded">
                        <span className="text-destructive font-mono font-bold">${ask.price.toFixed(4)}</span>
                        <span className="text-muted-foreground">{ask.quantity.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-success/10 rounded">
                  <span className="text-muted-foreground block">买盘深度</span>
                  <span className="font-mono font-bold text-success">{data.liquidity.bidDepth.toFixed(2)}</span>
                </div>
                <div className="text-center p-2 bg-destructive/10 rounded">
                  <span className="text-muted-foreground block">卖盘深度</span>
                  <span className="font-mono font-bold text-destructive">{data.liquidity.askDepth.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 实时交易信息 */}
          <Card>
            <CardHeader>
              <CardTitle>实时交易数据</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <label className="text-sm text-muted-foreground block">RSI (14)</label>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="font-mono text-xl font-bold">{data.rsi.toFixed(2)}</span>
                      <Badge variant={data.rsi > 70 ? "destructive" : data.rsi < 30 ? "default" : "secondary"}>
                        {data.rsi > 70 ? "超买" : data.rsi < 30 ? "超卖" : "中性"}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg border">
                    <label className="text-sm text-muted-foreground block">市场情绪</label>
                    <div className="mt-1">
                      <Badge 
                        variant={data.marketSentiment === 'bullish' ? "default" : "destructive"}
                        className="text-base px-4 py-1"
                      >
                        {data.marketSentiment === 'bullish' ? '🐂 看涨' : '🐻 看跌'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-success/10 rounded">
                    <span className="text-muted-foreground">支撑位:</span>
                    <span className="font-mono font-bold text-success">${data.support.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-destructive/10 rounded">
                    <span className="text-muted-foreground">阻力位:</span>
                    <span className="font-mono font-bold text-destructive">${data.resistance.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-muted-foreground">MA20:</span>
                    <span className="font-mono font-bold">${data.ma20.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-muted-foreground">MA50:</span>
                    <span className="font-mono font-bold">${data.ma50.toFixed(4)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">最佳报价</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-success/10 rounded">
                      <span className="text-muted-foreground">最佳买价:</span>
                      <span className="font-mono font-bold text-success">${data.bidPrice.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-destructive/10 rounded">
                      <span className="text-muted-foreground">最佳卖价:</span>
                      <span className="font-mono font-bold text-destructive">${data.askPrice.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetail;