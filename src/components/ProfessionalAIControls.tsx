import { useState, useEffect } from "react";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, CircleDollarSign, Brain, Activity, ArrowLeft, Shield, BotIcon, BarChart3 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { AutoTrader } from "./AutoTrader";
import { CryptoData, NewsArticle } from "@/types/api";
import { OptimizedPortfolioCards } from "./OptimizedPortfolioCards";
import { useWalletData } from "@/hooks/useWalletData";

interface ProfessionalAIControlsProps {
  cryptoData?: CryptoData[];
  newsData?: NewsArticle[];
  onOpenAIControlCenter?: () => void;
  isSuperBrainMonitoring?: boolean;
}

export const ProfessionalAIControls = ({ cryptoData = [], newsData = [], onOpenAIControlCenter, isSuperBrainMonitoring = false }: ProfessionalAIControlsProps) => {
  const { t } = useLanguage();
  const { getPortfolioData } = useWalletData();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Get portfolio data for the cards
  const portfolioData = getPortfolioData();
  
  // 从localStorage读取初始状态
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

  // 监听状态变化
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

  // 初始化时发送状态事件，确保其他组件同步
  React.useEffect(() => {
    if (isMonitoring) {
      const event = new CustomEvent('superBrainMonitoringChanged', {
        detail: { isMonitoring: true }
      });
      window.dispatchEvent(event);
    }
    
    if (isAutoTraderActive) {
      const event = new CustomEvent('autoTraderStatusChanged', {
        detail: { isActive: true }
      });
      window.dispatchEvent(event);
    }
  }, []);

  // 如果有活跃的区域，显示对应的组件
  if (activeSection === 'autotrader') {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setActiveSection(null)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回{t('ai.control_center')}
        </Button>
        <AutoTrader />
      </div>
    );
  }

  // 默认显示控制面板
  return (
    <div className="space-y-6">
      {/* Professional Trading Dashboard Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI Virtual Portfolio Card */}
        <Card className="bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/40 border-purple-500/30 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-purple-300">AI虚拟投资组合</h3>
                <p className="text-xs text-muted-foreground">总价值</p>
              </div>
              <Badge variant="outline" className="ml-auto bg-purple-500/10 text-purple-400 border-purple-500/30">
                1
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-100 font-mono">$100,000.00</div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-purple-300">模拟交易</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Daily P&L Card */}
        <Card className="bg-gradient-to-br from-emerald-900/40 via-green-800/30 to-emerald-900/40 border-emerald-500/30 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center border border-emerald-500/30">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-emerald-300">日盈亏</h3>
                <p className="text-xs text-muted-foreground">盈写金额</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse ml-auto"></div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-100 font-mono">+$1,247.89</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-emerald-300 text-sm font-medium">+1.25%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Trades Card */}
        <Card className="bg-gradient-to-br from-amber-900/40 via-yellow-800/30 to-amber-900/40 border-amber-500/30 backdrop-blur-sm hover:border-amber-400/50 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center border border-amber-500/30">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-amber-300">活跃交易</h3>
                <p className="text-xs text-muted-foreground">当前持仓</p>
              </div>
              <Badge variant="outline" className="ml-auto bg-amber-500/10 text-amber-400 border-amber-500/30">
                P
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-amber-100 font-mono">12</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-amber-300 text-sm">正在交易</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Control Center Section */}
      <Card className="bg-gradient-to-br from-slate-900/60 via-blue-950/50 to-slate-900/60 border-slate-700/50 backdrop-blur-xl">
        <div className="p-6">
          {/* Header with Status Badges */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30">
                <Brain className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground font-orbitron">AI控制中心</h3>
                <p className="text-sm text-muted-foreground">专业分析交易工具</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1">
                实时市场数据
              </Badge>
              {isMonitoring && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse px-3 py-1">
                  <Shield className="w-3 h-3 mr-1" />
                  {t('ai.supreme_brain_active')}
                </Badge>
              )}
              {isAutoTraderActive && (
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 animate-pulse px-3 py-1">
                  <BotIcon className="w-3 h-3 mr-1" />
                  {t('ai.auto_trader_active')}
                </Badge>
              )}
            </div>
          </div>

          {/* Control Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* AI Control Center Panel */}
            <Card 
              className="p-6 bg-gradient-to-br from-amber-900/20 via-yellow-800/15 to-amber-900/20 border-amber-500/20 hover:border-amber-400/40 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 group"
              onClick={onOpenAIControlCenter}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-amber-100 font-inter mb-1">AI控制中心</h4>
                    <p className="text-sm text-amber-300/80">配置和管理您的AI交易助手</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30 group-hover:border-amber-400/50 transition-colors duration-300">
                  <Brain className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </Card>

            {/* AI Auto Trading Panel */}
            <Card 
              className="p-6 bg-gradient-to-br from-emerald-900/20 via-green-800/15 to-emerald-900/20 border-emerald-500/20 hover:border-emerald-400/40 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 group"
              onClick={() => setActiveSection('autotrader')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CircleDollarSign className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-100 font-inter mb-1">AI自动赚钱</h4>
                    <p className="text-sm text-emerald-300/80">智能自动交易系统</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-400/50 transition-colors duration-300">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Professional Stats Dashboard */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-700/50">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-emerald-400 font-mono">94.2%</div>
              <div className="text-sm text-emerald-300/80">AI精准度</div>
              <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{width: '94.2%'}}></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-400 font-mono">47</div>
              <div className="text-sm text-blue-300/80">活跃信号</div>
              <div className="flex justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-400 font-mono">+12.4%</div>
              <div className="text-sm text-purple-300/80">月收益率</div>
              <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                <div className="bg-purple-400 h-1.5 rounded-full" style={{width: '62%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};