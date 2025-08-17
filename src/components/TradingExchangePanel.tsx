import { useState, useEffect } from "react";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowUp, ArrowDown, Activity, Power, PowerOff, 
  Calendar, BarChart3, Settings, Zap, Brain 
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { AutoTrader } from "./AutoTrader";
import { CryptoData, NewsArticle } from "@/types/api";
import { useWalletData } from "@/hooks/useWalletData";
import { useTimeBasedStats } from "@/hooks/useTimeBasedStats";

interface TradingExchangePanelProps {
  cryptoData?: CryptoData[];
  newsData?: NewsArticle[];
  onOpenAIControlCenter?: () => void;
  isSuperBrainMonitoring?: boolean;
}

export const TradingExchangePanel = ({ 
  cryptoData = [], 
  newsData = [], 
  onOpenAIControlCenter, 
  isSuperBrainMonitoring = false 
}: TradingExchangePanelProps) => {
  const { t } = useLanguage();
  const { getPortfolioData } = useWalletData();
  const { stats, timeRanges, selectedTimeRange, setSelectedTimeRange, isLoading } = useTimeBasedStats();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Get portfolio data
  const portfolioData = getPortfolioData();
  
  // States for AI controls
  const [isMonitoring, setIsMonitoring] = useState(() => {
    const saved = localStorage.getItem('superBrainMonitoring');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [isAutoTraderActive, setIsAutoTraderActive] = useState(() => {
    const saved = localStorage.getItem('autoTraderConfig');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        return config.enabled || false;
      } catch {
        return false;
      }
    }
    return false;
  });

  // Listen for state changes
  React.useEffect(() => {
    const handleMonitoringChange = (event: CustomEvent) => {
      setIsMonitoring(event.detail.isMonitoring);
    };

    const handleAutoTraderChange = (event: CustomEvent) => {
      setIsAutoTraderActive(event.detail.isActive);
    };

    window.addEventListener('superBrainMonitoringChanged', handleMonitoringChange as EventListener);
    window.addEventListener('autoTraderStatusChanged', handleAutoTraderChange as EventListener);
    
    return () => {
      window.removeEventListener('superBrainMonitoringChanged', handleMonitoringChange as EventListener);
      window.removeEventListener('autoTraderStatusChanged', handleAutoTraderChange as EventListener);
    };
  }, []);

  // Toggle handlers
  const toggleMonitoring = () => {
    const newStatus = !isMonitoring;
    setIsMonitoring(newStatus);
    localStorage.setItem('superBrainMonitoring', JSON.stringify(newStatus));
    
    const event = new CustomEvent('superBrainMonitoringChanged', {
      detail: { isMonitoring: newStatus }
    });
    window.dispatchEvent(event);
  };

  const toggleAutoTrader = () => {
    setActiveSection('autotrader');
  };

  // Show AutoTrader component if selected
  if (activeSection === 'autotrader') {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setActiveSection(null)}
          className="mb-4 bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          ← 返回交易面板
        </Button>
        <AutoTrader />
      </div>
    );
  }

  const changePercentage = portfolioData.totalValue > 0 ? 
    ((portfolioData.dailyChange / portfolioData.totalValue) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Professional Trading Exchange Style Panel */}
      <Card className="bg-slate-900/95 border-slate-700/50 shadow-2xl">
        <div className="p-4">
          {/* Top Status Bar */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Portfolio Summary */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wide">AI虚拟投资组合</span>
                <Badge variant="outline" className="text-xs bg-violet-500/10 text-violet-400 border-violet-500/30 px-2 py-0.5">
                  1
                </Badge>
              </div>
              <div className="text-lg font-mono font-bold text-white">
                ${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-slate-500 mt-1">总价值</div>
            </div>

            {/* P&L */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wide">日盈亏</span>
                <div className={`w-2 h-2 rounded-full ${portfolioData.dailyChange >= 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
              </div>
              <div className={`text-lg font-mono font-bold ${portfolioData.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioData.dailyChange >= 0 ? '+' : ''}${Math.abs(portfolioData.dailyChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-xs mt-1 ${portfolioData.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioData.dailyChange >= 0 ? '+' : ''}{changePercentage.toFixed(2)}%
              </div>
            </div>

            {/* Active Positions */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wide">活跃交易</span>
                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30 px-2 py-0.5">
                  P
                </Badge>
              </div>
              <div className="text-lg font-mono font-bold text-white">
                {portfolioData.activeTrades}
              </div>
              <div className="text-xs text-slate-500 mt-1">当前持仓</div>
            </div>
          </div>

          {/* Control Buttons Row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* AI Control Center */}
            <button
              onClick={onOpenAIControlCenter}
              className="bg-gradient-to-r from-amber-900/40 to-amber-800/40 border border-amber-600/30 rounded-lg p-4 text-left transition-all duration-200 hover:border-amber-500/50 hover:bg-gradient-to-r hover:from-amber-800/50 hover:to-amber-700/50 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                  <Brain className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-amber-100">AI控制中心</div>
                  <div className="text-xs text-amber-300/70">配置和管理您的AI交易助手</div>
                </div>
                <div className="ml-auto">
                  <Settings className="w-4 h-4 text-amber-400/60 group-hover:text-amber-400" />
                </div>
              </div>
            </button>

            {/* AI Auto Trading */}
            <button
              onClick={toggleAutoTrader}
              className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 border border-emerald-600/30 rounded-lg p-4 text-left transition-all duration-200 hover:border-emerald-500/50 hover:bg-gradient-to-r hover:from-emerald-800/50 hover:to-emerald-700/50 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-100">AI自动赚钱</div>
                  <div className="text-xs text-emerald-300/70">智能自动交易系统</div>
                </div>
                <div className="ml-auto">
                  <ArrowUp className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-400" />
                </div>
              </div>
            </button>
          </div>

          {/* Statistics Section */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
            {/* Time Selector */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wide">数据统计时间段:</span>
              </div>
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-24 h-7 bg-slate-700/50 border-slate-600 text-slate-300 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value} className="text-slate-300 focus:bg-slate-700 text-xs">
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-green-400 mb-1">
                  {isLoading ? '--.--%' : `${stats.aiAccuracy.toFixed(1)}%`}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">AI精准度</div>
                <div className="w-full bg-slate-700/50 rounded-sm h-1 mb-2">
                  <div 
                    className="bg-green-400 h-1 rounded-sm transition-all duration-500" 
                    style={{width: `${Math.min(stats.aiAccuracy, 100)}%`}}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {stats.winningTrades}/{stats.totalTrades} 盈利交易
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-blue-400 mb-1">
                  {isLoading ? '--' : stats.activeSignals}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">活跃信号</div>
                <div className="flex justify-center gap-1 mb-2">
                  <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
                  <div className="w-1 h-1 rounded-full bg-blue-400/60 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1 h-1 rounded-full bg-blue-400/30 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  当前持仓数量
                </div>
              </div>

              <div className="text-center">
                <div className={`text-2xl font-mono font-bold mb-1 ${stats.monthlyReturn >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                  {isLoading ? '--.--%' : `${stats.monthlyReturn >= 0 ? '+' : ''}${stats.monthlyReturn.toFixed(1)}%`}
                </div>
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">期间收益率</div>
                <div className="w-full bg-slate-700/50 rounded-sm h-1 mb-2">
                  <div 
                    className={`h-1 rounded-sm transition-all duration-500 ${
                      stats.monthlyReturn >= 0 ? 'bg-purple-400' : 'bg-red-400'
                    }`}
                    style={{width: `${Math.min(Math.abs(stats.monthlyReturn) * 2, 100)}%`}}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  {stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)} 总盈亏
                </div>
              </div>
            </div>

            {/* Time Range Display */}
            <div className="flex items-center justify-center gap-2 pt-3 mt-3 border-t border-slate-700/50">
              <BarChart3 className="w-3 h-3 text-slate-500" />
              <span className="text-xs text-slate-500 font-mono">
                数据统计时间: {stats.startDate.toLocaleDateString('zh-CN')} - {stats.endDate.toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};