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
      {/* 专业交易综合控制面板 */}
      <Card className="bg-gradient-to-br from-slate-900/60 via-blue-950/50 to-slate-900/60 border-slate-700/50 backdrop-blur-xl">
        <div className="p-8">
          {/* 顶部状态栏 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* AI虚拟投资组合 */}
            <div className="bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-purple-300">AI虚拟投资组合</h3>
                  <p className="text-xs text-muted-foreground">总价值</p>
                </div>
                <Badge variant="outline" className="ml-auto bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
                  1
                </Badge>
              </div>
              <div className="text-2xl font-bold text-purple-100 font-mono">
                ${portfolioData.totalValue.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-purple-300">模拟交易</span>
              </div>
            </div>

            {/* 日盈亏 */}
            <div className="bg-gradient-to-br from-emerald-900/30 via-green-800/20 to-emerald-900/30 border border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-600/20 flex items-center justify-center border border-emerald-500/30">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-emerald-300">日盈亏</h3>
                  <p className="text-xs text-muted-foreground">盈亏金额</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse ml-auto"></div>
              </div>
              <div className="text-2xl font-bold text-emerald-100 font-mono">
                {portfolioData.dailyChange >= 0 ? '+' : ''}${Math.abs(portfolioData.dailyChange).toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${portfolioData.dailyChange >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                <span className={`text-sm font-medium ${portfolioData.dailyChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {portfolioData.dailyChange >= 0 ? '+' : ''}{((portfolioData.dailyChange / 100000) * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* 活跃交易 */}
            <div className="bg-gradient-to-br from-amber-900/30 via-yellow-800/20 to-amber-900/30 border border-amber-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center border border-amber-500/30">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-amber-300">活跃交易</h3>
                  <p className="text-xs text-muted-foreground">当前持仓</p>
                </div>
                <Badge variant="outline" className="ml-auto bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                  P
                </Badge>
              </div>
              <div className="text-2xl font-bold text-amber-100 font-mono">{portfolioData.activeTrades}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${portfolioData.activeTrades > 0 ? 'bg-amber-400' : 'bg-slate-400'}`}></div>
                <span className={`text-sm ${portfolioData.activeTrades > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                  {portfolioData.activeTrades > 0 ? '正在交易' : '无交易'}
                </span>
              </div>
            </div>
          </div>

          {/* 控制面板按钮 */}
          <div className="bg-gradient-to-r from-slate-800/40 via-slate-700/30 to-slate-800/40 border border-slate-600/30 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* AI控制中心 */}
              <div 
                className="bg-gradient-to-br from-amber-900/30 via-yellow-800/20 to-amber-900/30 border border-amber-500/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/10 group"
                onClick={onOpenAIControlCenter}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-amber-100 font-inter mb-1">AI控制中心</h4>
                    <p className="text-sm text-amber-300/80">配置和管理您的AI交易助手</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                    <Brain className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* AI自动赚钱 */}
              <div 
                className="bg-gradient-to-br from-emerald-900/30 via-green-800/20 to-emerald-900/30 border border-emerald-500/30 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/10 group"
                onClick={() => setActiveSection('autotrader')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CircleDollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-emerald-100 font-inter mb-1">AI自动赚钱</h4>
                    <p className="text-sm text-emerald-300/80">智能自动交易系统</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部统计面板 */}
          <div className="grid grid-cols-3 gap-8 pt-6 border-t border-slate-700/50">
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-emerald-400 font-mono">94.2%</div>
              <div className="text-sm text-emerald-300/80 font-medium">AI精准度</div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-2 rounded-full transition-all duration-700" style={{width: '94.2%'}}></div>
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-blue-400 font-mono">47</div>
              <div className="text-sm text-blue-300/80 font-medium">活跃信号</div>
              <div className="flex justify-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400/60 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 rounded-full bg-blue-400/30 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-purple-400 font-mono">+12.4%</div>
              <div className="text-sm text-purple-300/80 font-medium">月收益率</div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-700" style={{width: '62%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};