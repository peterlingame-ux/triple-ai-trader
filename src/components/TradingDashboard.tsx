import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";

import { UpcomingAdvisors } from "./UpcomingAdvisors";
import { AIAdvisorsGrid } from "./AIAdvisorsGrid";
import { UserProfile } from "./UserProfile";
import { ProfessionalTradingPanel } from "./ProfessionalTradingPanel";

import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useWalletData } from "@/hooks/useWalletData";
import { BinanceAPIConfig } from "./BinanceAPIConfig";
import TradingViewDashboard from "./TradingViewDashboard";
import { BarChart3, Brain, ChevronUp, ChevronDown } from "lucide-react";
import { AIControlCenter } from "./AIControlCenter";

// Removed duplicate mock data - using centralized data from useCryptoData hook


export const TradingDashboard = memo(() => {
  const { t } = useLanguage();
  const { cryptoData, newsData } = useCryptoData();
  const { getPortfolioData } = useWalletData();
  const [showAIControlCenter, setShowAIControlCenter] = useState(false);
  const [advisorStates, setAdvisorStates] = useState<Record<string, boolean>>({});
  const [showTradingPanel, setShowTradingPanel] = useState(false);
  const [selectedTradingSymbol, setSelectedTradingSymbol] = useState<string>("");
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Listen for AI Control Center open events
  const handleOpenAIControlCenter = useCallback(() => {
    if (!showAIControlCenter) {
      setShowAIControlCenter(true);
    }
  }, [showAIControlCenter]);

  useEffect(() => {
    window.addEventListener('openAIControlCenter', handleOpenAIControlCenter);
    return () => {
      window.removeEventListener('openAIControlCenter', handleOpenAIControlCenter);
    };
  }, [handleOpenAIControlCenter]);

  // Get portfolio data from auto-trader
  const portfolioData = useMemo(() => getPortfolioData(), [getPortfolioData]);

  const handleCloseTradingPanel = useCallback(() => {
    console.log('关闭交易面板');
    setShowTradingPanel(false);
    // 延迟清除选中的symbol，避免闪烁
    setTimeout(() => {
      setSelectedTradingSymbol("");
    }, 300);
  }, []);

  return (
    <div className="min-h-screen relative p-3 sm:p-6 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 overflow-hidden">
      {/* Simplified background elements for better mobile performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 sm:opacity-30">
        <div className="absolute top-6 sm:top-10 left-6 sm:left-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent text-sm sm:text-lg font-bold">₿</span>
        </div>
        <div className="absolute top-20 sm:top-32 right-12 sm:right-20 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-accent/15 flex items-center justify-center">
          <span className="text-accent text-xs sm:text-sm font-bold">Ξ</span>
        </div>
        <div className="absolute bottom-1/3 right-6 sm:right-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent text-base sm:text-lg font-bold">$</span>
        </div>
      </div>
      
      {/* Main content with backdrop blur */}
      <div className="relative z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {/* Professional Header Design - Mobile Optimized */}
        <div className="relative">
          {/* Background with enhanced glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-950/80 to-slate-900/90 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/5 shadow-2xl"></div>
          
          {/* Content */}
          <div className="relative px-4 sm:px-10 py-4 sm:py-8">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              {/* Left Section - Brand */}
              <div className="flex items-center gap-4 sm:gap-8">
                <div className="space-y-1 sm:space-y-2">
                  <h1 className="text-3xl sm:text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 tracking-tight">
                    Super BrainX
                  </h1>
                  <p className="text-sm sm:text-lg text-slate-300 font-inter font-medium tracking-wide">
                    {t('app.subtitle')}
                  </p>
                </div>
              </div>
              
              {/* Center Section - Status Indicator - Mobile: Full Width */}
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <div className="relative">
                  <Badge variant="outline" className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-400 border-green-500/20 backdrop-blur-sm hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-300">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full mr-2 sm:mr-3 animate-pulse shadow-lg shadow-green-400/50"></div>
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    {t('status.live')}
                  </Badge>
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-md -z-10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Right Section - User Controls - Professional Cards Layout */}
              <div className="flex items-center gap-3">
                <UserProfile />
                
                <LanguageSwitcher />
              </div>
            </div>
          </div>
          
          {/* Subtle bottom accent */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-sm"></div>
        </div>

        {/* AI Opportunity Alert - Temporarily disabled due to API issues */}
        {/* <AIOpportunityAlert /> */}

        {/* Portfolio Overview moved to AI Control Center */}

        {/* 币安API配置 */}
        <BinanceAPIConfig />

        {/* 主要分析面板 - SUPER BRAINX 综合分析中心 */}
        <div className="mb-8">
          <TradingViewDashboard 
            isCollapsed={isPanelCollapsed}
            onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
          />
        </div>

        {/* AI Control Center Modal */}
        <AIControlCenter 
          open={showAIControlCenter} 
          onOpenChange={setShowAIControlCenter}
          advisorStates={advisorStates}
          portfolioData={portfolioData}
        />

        {/* AI Advisors Section - Three Column Grid */}
        <div className="mb-6">
          <AIAdvisorsGrid 
            cryptoData={cryptoData} 
            newsData={newsData} 
            onActivationChange={setAdvisorStates}
          />
        </div>

        {/* Upcoming Advisors Section */}
        <UpcomingAdvisors />

        {/* Professional Trading Panel Modal */}
        {showTradingPanel && selectedTradingSymbol && (
          <div className="fixed inset-0 z-50">
            <ProfessionalTradingPanel
              selectedCrypto={selectedTradingSymbol}
              onCryptoChange={setSelectedTradingSymbol}
              onClose={handleCloseTradingPanel}
              aiConfigs={{
                openai: { enabled: true, apiKey: "", model: "gpt-4" },
                claude: { enabled: true, apiKey: "", model: "claude-3" },
                grok: { enabled: true, apiKey: "", model: "grok-1" },
                vitalik: { enabled: true, apiKey: "", model: "vitalik-ai" },
                justin: { enabled: true, apiKey: "", model: "justin-ai" },
                trump: { enabled: true, apiKey: "", model: "trump-ai" }
              }}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
});

TradingDashboard.displayName = "TradingDashboard";