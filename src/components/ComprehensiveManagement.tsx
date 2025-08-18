import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useVirtualAccount } from "@/hooks/useVirtualAccount";
import { useUserSettings } from "@/hooks/useUserSettings";
import { 
  Settings, 
  User, 
  Wallet, 
  Target, 
  Shield, 
  Zap, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  Edit,
  TrendingUp,
  BarChart3,
  Activity,
  DollarSign
} from "lucide-react";
import { UserProfile } from "./UserProfile";
import { BinanceAPIConfig } from "./BinanceAPIConfig";
import { AIConfigPanel } from "./AIConfigPanel";
import { TradingStatistics } from "./TradingStatistics";
import { TRADING_CONFIG } from "@/constants/trading";

const TRADING_STRATEGIES = [
  {
    type: 'conservative',
    name: '稳健策略',
    description: '低风险稳定收益',
    minConfidence: 85,
    color: 'text-green-400',
    iconName: 'Shield'
  },
  {
    type: 'aggressive', 
    name: '激进策略',
    description: '高收益高风险',
    minConfidence: 75,
    color: 'text-red-400',
    iconName: 'Zap'
  }
];

interface ComprehensiveManagementProps {
  isSuperBrainActive?: boolean;
  onClose?: () => void;
}

export const ComprehensiveManagement = ({ 
  isSuperBrainActive = false,
  onClose 
}: ComprehensiveManagementProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { settings, updateSettings } = useUserSettings();
  const { 
    virtualAccount, 
    positions, 
    updateBalance,
  } = useVirtualAccount();

  // 本地状态管理
  const [tempBalance, setTempBalance] = useState(virtualAccount.balance.toString());
  const [tempStrategy, setTempStrategy] = useState<'conservative' | 'aggressive'>(settings.trading_strategy || 'conservative');
  const [strategyChanged, setStrategyChanged] = useState(false);
  const [isEnabled, setIsEnabled] = useState(settings.auto_trading_enabled || false);
  const [tradingHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setTempBalance(virtualAccount.balance.toString());
  }, [virtualAccount.balance]);

  // 同步设置
  useEffect(() => {
    setIsEnabled(settings.auto_trading_enabled || false);
    setTempStrategy(settings.trading_strategy || 'conservative');
  }, [settings]);

  const handleStrategySelect = (strategyType: string) => {
    const strategy = strategyType as 'conservative' | 'aggressive';
    setTempStrategy(strategy);
    setStrategyChanged(strategy !== (settings.trading_strategy || 'conservative'));
  };

  const confirmStrategyChange = () => {
    updateSettings({ trading_strategy: tempStrategy });
    setStrategyChanged(false);
    toast({
      title: "策略已更新",
      description: `已切换到${tempStrategy === 'conservative' ? '稳健' : '激进'}策略`,
    });
  };

  const cancelStrategyChange = () => {
    setTempStrategy(settings.trading_strategy || 'conservative');
    setStrategyChanged(false);
  };

  const toggleAutoTrader = () => {
    if (!isSuperBrainActive) {
      toast({
        title: "无法启用",
        description: "请先启用最强大脑监测",
        variant: "destructive"
      });
      return;
    }
    
    const newState = !isEnabled;
    setIsEnabled(newState);
    updateSettings({ auto_trading_enabled: newState });
    
    toast({
      title: newState ? "AI自动交易已启动" : "AI自动交易已停止",
      description: newState ? "系统正在监控交易机会" : "已停止自动交易",
    });
  };

  const confirmBalanceUpdate = () => {
    const newBalance = parseFloat(tempBalance);
    if (newBalance >= TRADING_CONFIG.MIN_BALANCE) {
      updateBalance(newBalance);
      toast({
        title: "余额已更新",
        description: `虚拟账户余额已更新为 $${newBalance.toLocaleString()}`,
      });
    } else {
      toast({
        title: "余额不足",
        description: `最低余额为 $${TRADING_CONFIG.MIN_BALANCE}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🏛️ 综合管理中心
              </h1>
              <p className="text-slate-300">
                AI自动交易控制 & 账户管理统一平台
              </p>
            </div>
            {onClose && (
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                返回主页
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              总览
            </TabsTrigger>
            <TabsTrigger value="trading" className="text-white">
              <Activity className="w-4 h-4 mr-2" />
              交易控制
            </TabsTrigger>
            <TabsTrigger value="account" className="text-white">
              <Wallet className="w-4 h-4 mr-2" />
              账户管理
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-white">
              <User className="w-4 h-4 mr-2" />
              个人资料
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white">
              <Settings className="w-4 h-4 mr-2" />
              系统设置
            </TabsTrigger>
          </TabsList>

          {/* 总览页面 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 系统状态概览 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* AI状态卡片 */}
              <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-200 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI系统状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isSuperBrainActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-lg font-bold text-white">
                      {isSuperBrainActive ? '活跃' : '待机'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    最强大脑{isSuperBrainActive ? '监控中' : '未启用'}
                  </p>
                </CardContent>
              </Card>

              {/* 自动交易状态 */}
              <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-200 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    自动交易
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-lg font-bold text-white">
                      {isEnabled ? '运行中' : '已停止'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {tempStrategy === 'conservative' ? '稳健策略' : '激进策略'}
                  </p>
                </CardContent>
              </Card>

              {/* 账户余额 */}
              <Card className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border-amber-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-200 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    账户余额
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-white">
                    ${virtualAccount.balance.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    USDT
                  </p>
                </CardContent>
              </Card>

              {/* 总盈亏 */}
              <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    总盈亏
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-lg font-bold ${virtualAccount.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {virtualAccount.totalPnL >= 0 ? '+' : ''}${virtualAccount.totalPnL.toFixed(2)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    胜率: {(virtualAccount.winRate * 100).toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 快速操作 */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  快速操作
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    className="h-auto p-4 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      toast({
                        title: t('ai.scroll_to_top'),
                        description: t('ai.find_brain_detection'),
                      });
                    }}
                  >
                    <Brain className="w-6 h-6" />
                    <span className="text-sm">启用最强大脑</span>
                  </Button>
                  
                  <Button 
                    className="h-auto p-4 flex flex-col gap-2 bg-green-600 hover:bg-green-700"
                    onClick={toggleAutoTrader}
                    disabled={!isSuperBrainActive}
                  >
                    <Zap className="w-6 h-6" />
                    <span className="text-sm">
                      {isEnabled ? '停止' : '启动'}自动交易
                    </span>
                  </Button>
                  
                  <Button 
                    className="h-auto p-4 flex flex-col gap-2 bg-amber-600 hover:bg-amber-700"
                    onClick={() => setActiveTab('account')}
                  >
                    <Wallet className="w-6 h-6" />
                    <span className="text-sm">账户设置</span>
                  </Button>
                  
                  <Button 
                    className="h-auto p-4 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="w-6 h-6" />
                    <span className="text-sm">系统配置</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 持仓概览 */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  当前持仓 ({positions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {positions.length > 0 ? (
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {positions.slice(0, 5).map((position) => (
                      <div key={position.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{position.symbol}</div>
                          <div className="text-sm text-slate-400">
                            {position.type === 'long' ? '做多' : '做空'} | ${position.entryPrice.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                          </div>
                          <div className={`text-sm ${position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <Target className="w-12 h-12 mx-auto mb-2 text-slate-500" />
                    <p>暂无持仓</p>
                    <p className="text-sm mt-1">启用AI自动交易后系统将自动建仓</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 交易控制页面 */}
          <TabsContent value="trading" className="space-y-6">
            {/* AI自动交易控制 */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI自动交易控制
                </CardTitle>
                <CardDescription className="text-slate-400">
                  基于最强大脑信号自动执行交易策略
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 主开关 */}
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">自动交易开关</h3>
                    <p className="text-sm text-slate-400">启用后系统将根据AI信号自动执行交易</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={toggleAutoTrader}
                      disabled={!isSuperBrainActive}
                    />
                  </div>
                </div>

                {/* 依赖检查 */}
                <div className={`rounded-lg p-4 border-2 ${
                  isSuperBrainActive 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-amber-900/20 border-amber-500/30'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {isSuperBrainActive ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-medium text-green-400">最强大脑监测已启用</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <span className="font-medium text-amber-400">需要启用最强大脑监测</span>
                      </>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    isSuperBrainActive ? 'text-green-300' : 'text-amber-300'
                  }`}>
                    {isSuperBrainActive 
                      ? '正在接收交易信号，AI自动交易可以正常工作'
                      : 'AI自动交易需要最强大脑检测提供交易信号，请先启用最强大脑监测功能'
                    }
                  </p>
                  
                  {!isSuperBrainActive && (
                    <Button 
                      size="sm" 
                      className="bg-amber-600 hover:bg-amber-700 text-black font-medium"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        toast({
                          title: t('ai.scroll_to_top'),
                          description: t('ai.find_brain_detection'),
                        });
                      }}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      {t('ai.find_brain_detection_short')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 策略选择 */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">交易策略配置</CardTitle>
                <CardDescription className="text-slate-400">
                  选择适合您风险偏好的交易策略
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TRADING_STRATEGIES.map((strategy) => {
                    const IconComponent = strategy.iconName === 'Shield' ? Shield : Zap;
                    return (
                    <div 
                      key={strategy.type}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        tempStrategy === strategy.type 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      onClick={() => handleStrategySelect(strategy.type)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={strategy.color}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{strategy.name}</h4>
                          <p className="text-sm text-slate-400">{strategy.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            最低胜率要求: {strategy.minConfidence}%
                          </p>
                        </div>
                        {tempStrategy === strategy.type && (
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
                
                {strategyChanged && (
                  <div className="flex gap-2 mt-4">
                    <Button onClick={confirmStrategyChange} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      确认更改
                    </Button>
                    <Button onClick={cancelStrategyChange} variant="outline" size="sm">
                      取消
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 账户管理页面 */}
          <TabsContent value="account" className="space-y-6">
            {/* 虚拟账户概览 */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  虚拟账户概览
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">
                      ${virtualAccount.balance.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">可用余额</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className={`text-2xl font-bold ${virtualAccount.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {virtualAccount.totalPnL >= 0 ? '+' : ''}${virtualAccount.totalPnL.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">总盈亏</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {virtualAccount.totalTrades}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">总交易数</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      {(virtualAccount.winRate * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-400 mt-1">胜率</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 余额管理 */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">余额管理</CardTitle>
                <CardDescription className="text-slate-400">
                  调整虚拟账户余额用于模拟交易
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="balance" className="text-white">账户余额 (USDT)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Input
                        id="balance"
                        type="number"
                        value={tempBalance}
                        onChange={(e) => setTempBalance(e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                        min={TRADING_CONFIG.MIN_BALANCE}
                      />
                      <Button 
                        onClick={confirmBalanceUpdate}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        更新
                      </Button>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      最低余额: {TRADING_CONFIG.MIN_BALANCE} USDT
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 交易统计 */}
            <TradingStatistics 
              virtualAccount={virtualAccount}
              positions={positions}
              tradingHistory={tradingHistory}
              isEnabled={isEnabled}
            />
          </TabsContent>

          {/* 个人资料页面 */}
          <TabsContent value="profile">
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  个人资料管理
                </CardTitle>
                <CardDescription className="text-slate-400">
                  管理您的个人信息和偏好设置
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfile />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 系统设置页面 */}
          <TabsContent value="settings" className="space-y-6">
            {/* API配置 */}
            <Card className="bg-slate-800/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  API配置
                </CardTitle>
                <CardDescription className="text-slate-400">
                  配置各种API密钥和连接设置
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <BinanceAPIConfig />
                <AIConfigPanel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};