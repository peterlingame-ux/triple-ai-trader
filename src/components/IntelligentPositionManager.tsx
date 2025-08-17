import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, TrendingUp, TrendingDown, DollarSign, Brain, Target, Zap, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Position {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'long' | 'short';
  status: 'open' | 'closed' | 'pending';
  entry_price: number;
  current_price: number;
  stop_loss?: number;
  take_profit?: number;
  position_size: number;
  leverage: number;
  pnl: number;
  pnl_percent: number;
  confidence: number;
  strategy: string;
  trading_type: string;
  ai_reasoning?: string;
  opened_at: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export const IntelligentPositionManager = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [activeTab, setActiveTab] = useState("realtime");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  // 获取用户持仓数据
  const fetchPositions = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching positions:', error);
        return;
      }

      // 确保类型安全的转换
      const typedPositions: Position[] = (data || []).map(item => ({
        ...item,
        type: item.type as 'buy' | 'sell' | 'long' | 'short',
        status: item.status as 'open' | 'closed' | 'pending'
      }));

      setPositions(typedPositions);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 创建新持仓
  const createPosition = async (signalData: any) => {
    if (!isAuthenticated || !user) return;

    const positionData = {
      user_id: user.id,
      symbol: signalData.symbol,
      type: (signalData.action || signalData.signal) as 'buy' | 'sell' | 'long' | 'short',
      status: 'open' as const,
      entry_price: signalData.entry || signalData.price,
      current_price: signalData.entry || signalData.price,
      stop_loss: signalData.stopLoss,
      take_profit: signalData.takeProfit,
      position_size: 1000, // 默认仓位大小
      leverage: 1,
      pnl: 0,
      pnl_percent: 0,
      confidence: signalData.confidence,
      strategy: 'AI_AUTO',
      trading_type: 'spot',
      ai_reasoning: signalData.reasoning,
    };

    try {
      const { data, error } = await supabase
        .from('positions')
        .insert([positionData])
        .select()
        .single();

      if (error) {
        console.error('Error creating position:', error);
        return;
      }

      // 添加到本地状态，确保类型安全
      const typedPosition: Position = {
        ...data,
        type: data.type as 'buy' | 'sell' | 'long' | 'short',
        status: data.status as 'open' | 'closed' | 'pending'
      };
      setPositions(prev => [typedPosition, ...prev]);
      
      toast({
        title: "🤖 AI自动开仓",
        description: `${data.symbol} ${data.type === 'buy' || data.type === 'long' ? '多头' : '空头'}持仓已建立`,
      });
    } catch (error) {
      console.error('Error creating position:', error);
    }
  };

  // 更新持仓价格和盈亏
  const updatePositionPnL = async (position: Position) => {
    const priceChange = (Math.random() - 0.5) * 0.02; // -1% to +1%
    const newPrice = position.current_price * (1 + priceChange);
    
    let pnl = 0;
    if (position.type === 'buy' || position.type === 'long') {
      pnl = (newPrice - position.entry_price) * (position.position_size / position.entry_price);
    } else {
      pnl = (position.entry_price - newPrice) * (position.position_size / position.entry_price);
    }
    
    const pnlPercent = (pnl / position.position_size) * 100;

    try {
      const { error } = await supabase
        .from('positions')
        .update({
          current_price: newPrice,
          pnl: pnl,
          pnl_percent: pnlPercent
        })
        .eq('id', position.id);

      if (error) {
        console.error('Error updating position:', error);
        return;
      }

      // 更新本地状态
      setPositions(prev => prev.map(p => 
        p.id === position.id 
          ? { ...p, current_price: newPrice, pnl, pnl_percent: pnlPercent }
          : p
      ));
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  // 关闭持仓
  const closePosition = async (positionId: string) => {
    try {
      const { error } = await supabase
        .from('positions')
        .update({
          status: 'closed',
          closed_at: new Date().toISOString()
        })
        .eq('id', positionId);

      if (error) {
        console.error('Error closing position:', error);
        return;
      }

      setPositions(prev => prev.map(p => 
        p.id === positionId 
          ? { ...p, status: 'closed' as const, closed_at: new Date().toISOString() }
          : p
      ));

      toast({
        title: "持仓已关闭",
        description: "持仓已成功关闭",
      });
    } catch (error) {
      console.error('Error closing position:', error);
    }
  };

  // 监听AI交易信号
  useEffect(() => {
    const handleAutoTradeExecuted = (event: CustomEvent) => {
      const tradeData = event.detail;
      console.log('收到自动交易执行信号:', tradeData);
      createPosition(tradeData);
    };

    const handleSuperBrainSignal = (event: CustomEvent) => {
      const signalData = event.detail;
      console.log('收到超级大脑信号:', signalData);
      
      // 只处理高胜率信号
      if (signalData.confidence >= 85) {
        createPosition(signalData);
      }
    };

    window.addEventListener('autoTradeExecuted', handleAutoTradeExecuted as EventListener);
    window.addEventListener('superBrainTradingSignal', handleSuperBrainSignal as EventListener);
    window.addEventListener('superBrainOpportunity', handleSuperBrainSignal as EventListener);
    
    return () => {
      window.removeEventListener('autoTradeExecuted', handleAutoTradeExecuted as EventListener);
      window.removeEventListener('superBrainTradingSignal', handleSuperBrainSignal as EventListener);
      window.removeEventListener('superBrainOpportunity', handleSuperBrainSignal as EventListener);
    };
  }, [isAuthenticated, user]);

  // 初始化数据
  useEffect(() => {
    fetchPositions();
  }, [isAuthenticated, user]);

  // 定期更新持仓盈亏
  useEffect(() => {
    const interval = setInterval(() => {
      const openPositions = positions.filter(p => p.status === 'open');
      openPositions.forEach(position => {
        updatePositionPnL(position);
      });
    }, 5000); // 每5秒更新一次

    return () => clearInterval(interval);
  }, [positions]);

  const openPositions = positions.filter(p => p.status === 'open');
  const closedPositions = positions.filter(p => p.status === 'closed');
  const totalPnL = openPositions.reduce((sum, p) => sum + p.pnl, 0);

  if (!isAuthenticated) {
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-center text-slate-400">
            请先登录以查看持仓管理
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="realtime" className="text-slate-300">
            <Activity className="w-4 h-4 mr-2" />
            实时动态
          </TabsTrigger>
          <TabsTrigger value="signals" className="text-slate-300">
            <Brain className="w-4 h-4 mr-2" />
            AI信号
          </TabsTrigger>
          <TabsTrigger value="positions" className="text-slate-300">
            <Target className="w-4 h-4 mr-2" />
            持仓管理
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-slate-300">
            <TrendingUp className="w-4 h-4 mr-2" />
            数据分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Activity className="w-5 h-5" />
                实时交易动态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {openPositions.length > 0 ? (
                  openPositions.slice(0, 5).map((position) => (
                    <div key={position.id} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${position.pnl >= 0 ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                        <span className="text-white font-medium">{position.symbol}</span>
                        <Badge variant={position.type === 'buy' || position.type === 'long' ? 'default' : 'secondary'}>
                          {position.type === 'buy' || position.type === 'long' ? '多头' : '空头'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-400">
                          {position.pnl_percent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-400 mb-2">暂无持仓</h3>
                    <p className="text-slate-500">AI将自动发现并执行交易机会</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Brain className="w-5 h-5" />
                AI信号监听中
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Zap className="w-12 h-12 mx-auto text-yellow-400 mb-4 animate-pulse" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">AI大脑正在分析</h3>
                <p className="text-slate-500">监听最强大脑信号，自动执行高胜率交易</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Target className="w-5 h-5" />
                智能持仓管理 ({openPositions.length})
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-slate-400">
                  总盈亏: <span className={`font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {openPositions.length > 0 ? (
                  openPositions.map((position) => (
                    <div key={position.id} className="p-4 bg-slate-800/40 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-white">{position.symbol}</span>
                          <Badge 
                            variant={position.type === 'buy' || position.type === 'long' ? 'default' : 'secondary'}
                            className={position.type === 'buy' || position.type === 'long' ? 'bg-green-600' : 'bg-red-600'}
                          >
                            {position.type === 'buy' || position.type === 'long' ? '多头' : '空头'}
                          </Badge>
                          <Badge variant="outline" className="text-yellow-400">
                            胜率{position.confidence}%
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => closePosition(position.id)}
                          className="text-red-400 border-red-400 hover:bg-red-400/10"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          平仓
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400">入场价</div>
                          <div className="text-white font-mono">${position.entry_price.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">当前价</div>
                          <div className="text-white font-mono">${position.current_price.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">盈亏</div>
                          <div className={`font-bold ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400">收益率</div>
                          <div className={`font-bold ${position.pnl_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.pnl_percent >= 0 ? '+' : ''}{position.pnl_percent.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {position.ai_reasoning && (
                        <div className="mt-3 p-2 bg-slate-700/30 rounded text-xs text-slate-300">
                          <strong>AI分析:</strong> {position.ai_reasoning}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-400 mb-2">暂无持仓</h3>
                    <p className="text-slate-500">AI将自动发现并执行交易机会</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <TrendingUp className="w-5 h-5" />
                AI交易分析报告
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">详细分析数据将在此显示</h3>
                <p className="text-slate-500">包括收益曲线、风险分析、策略对比等</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};