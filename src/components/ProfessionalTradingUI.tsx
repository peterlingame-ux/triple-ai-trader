import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Star,
  Activity,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useCryptoData, filterCryptoData } from '@/hooks/useCryptoData';
import { useNavigate } from 'react-router-dom';
import { BinanceAPIConfig } from './BinanceAPIConfig';

interface CryptoRowProps {
  crypto: any;
  index: number;
  onRowClick: (symbol: string) => void;
}

const CryptoRow = ({ crypto, index, onRowClick }: CryptoRowProps) => {
  const isPositive = crypto.changePercent24h >= 0;
  
  return (
    <tr 
      className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-all duration-200 group trading-table-row"
      onClick={() => onRowClick(crypto.symbol)}
    >
      <td className="px-4 py-3 text-muted-foreground text-sm font-mono">
        #{index + 1}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">
              {crypto.symbol.slice(0, 2)}
            </span>
          </div>
          <div>
            <div className="font-bold text-sm group-hover:text-primary transition-colors">
              {crypto.symbol}
            </div>
            <div className="text-xs text-muted-foreground">{crypto.name}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-right">
        <div className="font-bold text-lg">${crypto.price.toFixed(6)}</div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className={`flex items-center justify-end gap-1 px-2 py-1 rounded ${
          isPositive 
            ? 'text-green-500 bg-green-500/10' 
            : 'text-red-500 bg-red-500/10'
        }`}>
          {isPositive ? 
            <TrendingUp className="w-4 h-4" /> : 
            <TrendingDown className="w-4 h-4" />
          }
          <span className="font-mono font-bold">
            {isPositive ? '+' : ''}{crypto.changePercent24h.toFixed(2)}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-right text-sm">
        <div className="text-muted-foreground">
          ${crypto.volume24h > 1000000 
            ? `${(crypto.volume24h / 1000000).toFixed(1)}M`
            : crypto.volume24h.toLocaleString()
          }
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-right text-sm">
        <div className="text-muted-foreground">
          ${crypto.marketCap > 1000000000 
            ? `${(crypto.marketCap / 1000000000).toFixed(1)}B`
            : crypto.marketCap > 1000000
            ? `${(crypto.marketCap / 1000000).toFixed(1)}M` 
            : crypto.marketCap?.toLocaleString() || 'N/A'
          }
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            // 添加到收藏逻辑
          }}
        >
          <Star className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
};

export const ProfessionalTradingUI = () => {
  const navigate = useNavigate();
  const { cryptoData, loading, error, refreshData, isRealTimeEnabled } = useCryptoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('spot');

  // 筛选和排序数据
  const filteredData = useMemo(() => {
    let filtered = filterCryptoData(cryptoData, searchQuery);
    
    // 按市值排序
    return filtered.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));
  }, [cryptoData, searchQuery]);

  // 计算市场统计
  const marketStats = useMemo(() => {
    const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + (crypto.marketCap || 0), 0);
    const gainers = cryptoData.filter(crypto => crypto.changePercent24h > 0).length;
    const losers = cryptoData.filter(crypto => crypto.changePercent24h < 0).length;
    const avgChange = cryptoData.reduce((sum, crypto) => sum + crypto.changePercent24h, 0) / cryptoData.length;
    
    return { totalMarketCap, gainers, losers, avgChange };
  }, [cryptoData]);

  const handleRowClick = (symbol: string) => {
    navigate(`/crypto/${symbol}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部状态栏 */}
      <div className="border-b bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${isRealTimeEnabled ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium">
                  {isRealTimeEnabled ? '实时数据' : '演示数据'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">{marketStats.gainers}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-red-500">{marketStats.losers}</span>
                </div>
                <div className="text-muted-foreground">
                  市值: ${marketStats.totalMarketCap.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BinanceAPIConfig />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                刷新
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* 市场概览卡片 - 更专业的设计 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">总市值</p>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    ${(marketStats.totalMarketCap / 1e12).toFixed(2)}T
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    全球加密货币市场
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">市场趋势</p>
                  <p className={`text-2xl font-bold font-mono ${
                    marketStats.avgChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {marketStats.avgChange >= 0 ? '+' : ''}{marketStats.avgChange.toFixed(2)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    24小时平均涨幅
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  marketStats.avgChange >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  <BarChart3 className={`w-6 h-6 ${
                    marketStats.avgChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">上涨货币</p>
                  <p className="text-2xl font-bold font-mono text-green-500">
                    {marketStats.gainers}
                  </p>
                  <p className="text-xs text-green-500 mt-1">
                    占比 {((marketStats.gainers / cryptoData.length) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">下跌货币</p>
                  <p className="text-2xl font-bold font-mono text-red-500">
                    {marketStats.losers}
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    占比 {((marketStats.losers / cryptoData.length) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10">
                  <TrendingDown className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主交易界面 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="spot">现货</TabsTrigger>
              <TabsTrigger value="futures">合约</TabsTrigger>
              <TabsTrigger value="options">期权</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="搜索货币..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          <TabsContent value="spot">
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-3">
                    <span className="text-foreground">现货交易市场</span>
                    {isRealTimeEnabled && (
                      <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30 animate-pulse">
                        <Activity className="w-3 h-3 mr-1" />
                        实时数据
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {filteredData.length} 个币种
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>数据更新: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="h-96 flex items-center justify-center bg-muted/20">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">加载实时数据中...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="h-96 flex items-center justify-center text-destructive bg-destructive/5">
                    <div className="text-center">
                      <p className="mb-4">{error}</p>
                      <Button variant="outline" onClick={refreshData}>
                        重新连接
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden custom-scrollbar">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-4 text-left text-sm font-semibold text-muted-foreground">#</th>
                          <th className="px-4 py-4 text-left text-sm font-semibold text-muted-foreground">币种</th>
                          <th className="px-4 py-4 text-right text-sm font-semibold text-muted-foreground">价格 (USDT)</th>
                          <th className="px-4 py-4 text-right text-sm font-semibold text-muted-foreground">24h 涨跌</th>
                          <th className="px-4 py-4 text-right text-sm font-semibold text-muted-foreground">成交量</th>
                          <th className="px-4 py-4 text-right text-sm font-semibold text-muted-foreground">市值</th>
                          <th className="px-4 py-4 text-center text-sm font-semibold text-muted-foreground">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card/30">
                        {filteredData.map((crypto, index) => (
                          <CryptoRow
                            key={crypto.symbol}
                            crypto={crypto}
                            index={index}
                            onRowClick={handleRowClick}
                          />
                        ))}
                      </tbody>
                    </table>
                    
                    {filteredData.length === 0 && (
                      <div className="h-32 flex items-center justify-center text-muted-foreground bg-muted/10">
                        <div className="text-center">
                          <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p>未找到匹配的加密货币</p>
                          <p className="text-xs mt-1">请尝试其他搜索词</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="futures">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">合约交易</h3>
                <p className="text-muted-foreground">合约交易功能正在开发中...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="options">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">期权交易</h3>
                <p className="text-muted-foreground">期权交易功能正在开发中...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};