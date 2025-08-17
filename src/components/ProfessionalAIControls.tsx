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
    <div className="space-y-8">
      {/* Portfolio Overview Section - Professional Trading Style */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-foreground tracking-wide">投资组合概览</h2>
          <div className="flex-1 border-b border-border/30"></div>
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
            实时市场数据
          </Badge>
        </div>
        <OptimizedPortfolioCards portfolioData={portfolioData} />
      </div>

      {/* AI Control Center - Professional Trading Style */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground tracking-wide">AI控制中心</h3>
            <span className="text-sm text-muted-foreground">专业分析交易工具</span>
          </div>
          <div className="flex items-center gap-2">
            {isMonitoring && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse text-xs">
                <Shield className="w-3 h-3 mr-1" />
                最强大脑活跃
              </Badge>
            )}
            {isAutoTraderActive && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse text-xs">
                <BotIcon className="w-3 h-3 mr-1" />
                AI自动赚钱
              </Badge>
            )}
          </div>
        </div>

        {/* Professional Control Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Control Center Panel */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 border border-yellow-500/20 hover:border-yellow-400/40 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20"
            onClick={onOpenAIControlCenter}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-1">AI控制中心</h4>
                    <p className="text-sm text-muted-foreground">配置和管理您的AI交易助手</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors duration-300">
                  <Brain className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">状态</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                    <Activity className="w-3 h-3 mr-1" />
                    运行中
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Auto Trading Panel */}
          <Card 
            className="group relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 border border-green-500/20 hover:border-green-400/40 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20"
            onClick={() => setActiveSection('autotrader')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CircleDollarSign className="w-7 h-7 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-1">AI自动赚钱</h4>
                    <p className="text-sm text-muted-foreground">智能自动交易系统</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-colors duration-300">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">系统状态</span>
                  <Badge variant="outline" className={`text-xs ${isAutoTraderActive ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                    {isAutoTraderActive ? '已启用' : '未启用'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Professional Stats Dashboard */}
        <Card className="bg-gradient-to-r from-slate-900/60 via-slate-800/40 to-slate-900/60 border border-border/30 backdrop-blur-sm">
          <div className="p-6">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-400 font-mono">94.2%</div>
                <div className="text-sm text-muted-foreground font-medium">AI精准度</div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-400 font-mono">47</div>
                <div className="text-sm text-muted-foreground font-medium">活跃信号</div>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-400 font-mono">+12.4%</div>
                <div className="text-sm text-muted-foreground font-medium">月收益率</div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[62%] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};