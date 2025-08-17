import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, CircleDollarSign, Brain, Activity, ArrowLeft, Shield, BotIcon, BarChart3, Target, XCircle, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
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
  margin: number;
  maintenance_margin_rate: number;
  mark_price: number;
  liquidation_price?: number;
  contract_type: string;
  position_value: number;
  unrealized_pnl: number;
  fees: number;
  funding_fee: number;
  first_take_profit?: number;
  second_take_profit?: number;
  position_ratio: number;
  stop_loss_required: boolean;
  safety_factor: number;
  risk_level: string;
  signal_strength: number;
  market_condition?: string;
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
    if (!isAuthenticated || !user) {
      console.log('用户未登录，无法创建持仓');
      return;
    }

    console.log('准备创建持仓:', signalData);

    // 计算详细交易数据
    const entryPrice = Number(signalData.entry || signalData.price) || 0;
    const positionSize = 1000; // 默认仓位大小
    const leverage = signalData.leverage || 1;
    const margin = (positionSize * entryPrice) / leverage; // 保证金 = 持仓价值 / 杠杆
    const positionValue = positionSize * entryPrice; // 持仓价值
    const markPrice = entryPrice * (1 + (Math.random() - 0.5) * 0.001); // 模拟标记价格
    
    // 计算维持保证金率 (通常是0.5%-2%)
    const maintenanceMarginRate = Math.random() * 1.5 + 0.5;
    
    // 计算预估强平价
    let liquidationPrice;
    if (signalData.action === 'long' || signalData.type === 'buy') {
      liquidationPrice = entryPrice * (1 - (1 / leverage) * 0.9); // 多头强平价
    } else {
      liquidationPrice = entryPrice * (1 + (1 / leverage) * 0.9); // 空头强平价
    }

    // 计算止盈点和建议参数
    const priceRange = Math.abs(Number(signalData.takeProfit || entryPrice * 1.05) - entryPrice);
    const firstTakeProfit = signalData.takeProfit ? Number(signalData.takeProfit) : 
      (signalData.action === 'long' || signalData.type === 'buy') ? 
        entryPrice + priceRange * 0.6 : entryPrice - priceRange * 0.6;
    
    const secondTakeProfit = signalData.takeProfit ? Number(signalData.takeProfit) * 1.2 : 
      (signalData.action === 'long' || signalData.type === 'buy') ? 
        entryPrice + priceRange * 1.2 : entryPrice - priceRange * 1.2;

    // 根据胜率计算建议仓位比例和安全系数
    const confidence = Number(signalData.confidence) || 0;
    let positionRatio = 5; // 默认5%
    let safetyFactor = 5; // 默认安全系数5
    let riskLevel = 'medium';

    if (confidence >= 90) {
      positionRatio = 20; // 高胜率，建议20%
      safetyFactor = 8;
      riskLevel = 'low';
    } else if (confidence >= 80) {
      positionRatio = 15; // 中高胜率，建议15%
      safetyFactor = 7;
      riskLevel = 'low';
    } else if (confidence >= 70) {
      positionRatio = 10; // 中等胜率，建议10%
      safetyFactor = 6;
      riskLevel = 'medium';
    } else {
      positionRatio = 5; // 低胜率，建议5%
      safetyFactor = 4;
      riskLevel = 'high';
    }

    const positionData = {
      user_id: user.id,
      symbol: signalData.symbol,
      type: (signalData.action || signalData.signal) as 'buy' | 'sell' | 'long' | 'short',
      status: 'open' as const,
      entry_price: entryPrice,
      current_price: entryPrice,
      stop_loss: Number(signalData.stopLoss) || null,
      take_profit: Number(signalData.takeProfit) || null,
      position_size: positionSize,
      leverage: leverage,
      pnl: Number(signalData.profit) || 0,
      pnl_percent: 0,
      confidence: confidence,
      strategy: 'AI_AUTO',
      trading_type: signalData.tradingType || 'spot',
      ai_reasoning: signalData.reasoning,
      margin: margin,
      maintenance_margin_rate: maintenanceMarginRate,
      mark_price: markPrice,
      liquidation_price: liquidationPrice,
      contract_type: signalData.symbol?.includes('USDT') ? 'perpetual' : 'spot',
      position_value: positionValue,
      unrealized_pnl: Number(signalData.profit) || 0,
      fees: positionValue * 0.001, // 0.1% 手续费
      funding_fee: 0,
      first_take_profit: firstTakeProfit,
      second_take_profit: secondTakeProfit,
      position_ratio: positionRatio,
      stop_loss_required: confidence < 85, // 胜率低于85%建议必须止损
      safety_factor: safetyFactor,
      risk_level: riskLevel,
      signal_strength: confidence,
      market_condition: confidence >= 80 ? '强势趋势' : confidence >= 60 ? '震荡趋势' : '弱势趋势',
    };

    console.log('持仓数据:', positionData);

    try {
      const { data, error } = await supabase
        .from('positions')
        .insert([positionData])
        .select()
        .single();

      if (error) {
        console.error('创建持仓失败:', error);
        toast({
          title: "❌ 创建持仓失败",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('持仓创建成功:', data);

      // 添加到本地状态，确保类型安全
      const typedPosition: Position = {
        ...data,
        type: data.type as 'buy' | 'sell' | 'long' | 'short',
        status: data.status as 'open' | 'closed' | 'pending'
      };
      setPositions(prev => [typedPosition, ...prev]);
      
      // 触发事件通知其他组件
      const updateEvent = new CustomEvent('positionCreated', {
        detail: typedPosition
      });
      window.dispatchEvent(updateEvent);
      
      toast({
        title: "🤖 AI自动开仓成功",
        description: `${data.symbol} ${data.type === 'buy' || data.type === 'long' ? '多头' : '空头'}持仓已建立，预计盈亏: ${signalData.profit ? '$' + signalData.profit.toFixed(2) : '计算中...'}`,
      });
    } catch (error) {
      console.error('创建持仓异常:', error);
      toast({
        title: "❌ 系统异常",
        description: "持仓创建失败，请稍后重试",
        variant: "destructive",
      });
    }
  };

  // 更新持仓价格和盈亏
  const updatePositionPnL = async (position: Position) => {
    const priceChange = (Math.random() - 0.5) * 0.02; // -1% to +1%
    const newPrice = position.current_price * (1 + priceChange);
    const newMarkPrice = newPrice * (1 + (Math.random() - 0.5) * 0.001);
    
    let pnl = 0;
    let unrealizedPnl = 0;
    
    if (position.type === 'buy' || position.type === 'long') {
      pnl = (newPrice - position.entry_price) * (position.position_size / position.entry_price);
      unrealizedPnl = (newMarkPrice - position.entry_price) * (position.position_size / position.entry_price);
    } else {
      pnl = (position.entry_price - newPrice) * (position.position_size / position.entry_price);
      unrealizedPnl = (position.entry_price - newMarkPrice) * (position.position_size / position.entry_price);
    }
    
    const pnlPercent = (pnl / position.position_size) * 100;
    
    // 更新维持保证金率
    const newMaintenanceMarginRate = position.maintenance_margin_rate + (Math.random() - 0.5) * 0.1;

    try {
      const { error } = await supabase
        .from('positions')
        .update({
          current_price: newPrice,
          mark_price: newMarkPrice,
          pnl: pnl,
          pnl_percent: pnlPercent,
          unrealized_pnl: unrealizedPnl,
          maintenance_margin_rate: Math.max(0, newMaintenanceMarginRate),
          position_value: position.position_size * newPrice
        })
        .eq('id', position.id);

      if (error) {
        console.error('Error updating position:', error);
        return;
      }

      // 更新本地状态
      setPositions(prev => prev.map(p => 
        p.id === position.id 
          ? { 
              ...p, 
              current_price: newPrice, 
              mark_price: newMarkPrice,
              pnl, 
              pnl_percent: pnlPercent,
              unrealized_pnl: unrealizedPnl,
              maintenance_margin_rate: Math.max(0, newMaintenanceMarginRate),
              position_value: position.position_size * newPrice
            }
          : p
      ));

      // 触发事件通知其他组件数据已更新
      const updateEvent = new CustomEvent('positionUpdated', {
        detail: { id: position.id, pnl, pnl_percent: pnlPercent }
      });
      window.dispatchEvent(updateEvent);
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
      console.log('🎯 收到自动交易执行信号:', tradeData);
      if (tradeData && tradeData.symbol && tradeData.confidence) {
        createPosition(tradeData);
      } else {
        console.log('⚠️ 交易信号数据不完整，跳过创建持仓');
      }
    };

    const handleSuperBrainSignal = (event: CustomEvent) => {
      const signalData = event.detail;
      console.log('🧠 收到超级大脑信号:', signalData);
      
      // 处理高胜率信号并确保数据完整
      if (signalData && signalData.confidence >= 85 && signalData.symbol && signalData.entry) {
        console.log('✅ 高胜率信号符合条件，创建持仓');
        createPosition(signalData);
      } else {
        console.log('⚠️ 超级大脑信号不符合条件或数据不完整，跳过');
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

  // 初始化数据和实时订阅
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    fetchPositions();

    // 设置实时订阅
    const channel = supabase
      .channel('positions_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'positions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New position inserted:', payload);
          const newPosition: Position = payload.new as Position;
          setPositions(prev => [newPosition, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'positions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Position updated:', payload);
          const updatedPosition: Position = payload.new as Position;
          setPositions(prev => prev.map(p => 
            p.id === updatedPosition.id ? updatedPosition : p
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'positions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Position deleted:', payload);
          setPositions(prev => prev.filter(p => p.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
                    <div key={position.id} className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50">
                      {/* 顶部标题和操作 */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-white">{position.symbol}</span>
                          <Badge className="bg-green-600 text-white px-2 py-1">
                            {position.contract_type === 'perpetual' ? '永续' : '现货'}
                          </Badge>
                          <Badge 
                            variant={position.type === 'buy' || position.type === 'long' ? 'default' : 'secondary'}
                            className={`${position.type === 'buy' || position.type === 'long' ? 'bg-green-600' : 'bg-red-600'} text-white`}
                          >
                            {position.type === 'buy' || position.type === 'long' ? '多' : '空'}
                          </Badge>
                          <Badge variant="outline" className="text-amber-400 border-amber-400">
                            {position.leverage}x
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

                      {/* 盈亏统计 */}
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <div className="text-sm text-slate-400 mb-1">收益额 (USDT)</div>
                          <div className={`text-2xl font-bold ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400 mb-1">收益率</div>
                          <div className={`text-2xl font-bold ${position.pnl_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.pnl_percent >= 0 ? '+' : ''}{position.pnl_percent.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      {/* 详细数据网格 */}
                      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-slate-400 mb-1">持仓量 ({position.symbol.replace('USDT', '')})</div>
                          <div className="text-white font-mono text-lg">{(position.position_size / position.entry_price).toFixed(0)}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">保证金 (USDT)</div>
                          <div className="text-white font-mono text-lg">{position.margin.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">维持保证金率</div>
                          <div className="text-white font-mono text-lg">{position.maintenance_margin_rate.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">开仓均价</div>
                          <div className="text-white font-mono">${position.entry_price.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">标记价格</div>
                          <div className="text-white font-mono">${(position.mark_price || position.current_price).toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 mb-1">预估强平价</div>
                          <div className="text-white font-mono">
                            {position.liquidation_price ? `$${position.liquidation_price.toFixed(2)}` : '--'}
                          </div>
                        </div>
                      </div>

                      {/* 交易建议详情 */}
                      <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-400">AI交易建议</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              position.risk_level === 'low' ? 'text-green-400 border-green-400' :
                              position.risk_level === 'medium' ? 'text-yellow-400 border-yellow-400' :
                              'text-red-400 border-red-400'
                            }`}
                          >
                            {position.risk_level === 'low' ? '低风险' : 
                             position.risk_level === 'medium' ? '中风险' : '高风险'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">建议仓位:</span>
                              <span className="text-yellow-400 font-medium">{position.position_ratio}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">安全系数:</span>
                              <div className="flex items-center gap-1">
                                <span className="text-white font-mono">{position.safety_factor}/10</span>
                                <div className="flex">
                                  {[...Array(10)].map((_, i) => (
                                    <div 
                                      key={i} 
                                      className={`w-1 h-2 ${i < position.safety_factor ? 'bg-green-400' : 'bg-slate-600'} mr-0.5`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">信号强度:</span>
                              <span className="text-blue-400 font-medium">{position.signal_strength}%</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">第一止盈:</span>
                              <span className="text-green-400 font-mono">
                                ${position.first_take_profit ? position.first_take_profit.toFixed(2) : '--'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">第二止盈:</span>
                              <span className="text-green-400 font-mono">
                                ${position.second_take_profit ? position.second_take_profit.toFixed(2) : '--'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">必须止损:</span>
                              <div className="flex items-center gap-1">
                                {position.stop_loss_required ? (
                                  <>
                                    <AlertTriangle className="w-3 h-3 text-red-400" />
                                    <span className="text-red-400 text-xs">是</span>
                                  </>
                                ) : (
                                  <span className="text-green-400 text-xs">否</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {position.market_condition && (
                          <div className="mt-3 pt-3 border-t border-slate-600/30">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3 text-slate-400" />
                              <span className="text-xs text-slate-400">市场状况:</span>
                              <span className="text-xs text-slate-300">{position.market_condition}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 附加信息 */}
                      <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">未实现盈亏:</span>
                          <span className={`font-mono ${(position.unrealized_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {(position.unrealized_pnl || 0) >= 0 ? '+' : ''}${(position.unrealized_pnl || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">手续费:</span>
                          <span className="text-slate-300 font-mono">${(position.fees || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">胜率预测:</span>
                          <span className="text-yellow-400 font-medium">{position.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">持仓价值:</span>
                          <span className="text-slate-300 font-mono">${(position.position_value || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {position.ai_reasoning && (
                        <div className="mt-4 p-3 bg-slate-700/30 rounded-lg text-xs text-slate-300">
                          <strong className="text-blue-400">AI分析:</strong> {position.ai_reasoning}
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