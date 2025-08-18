import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CryptoCard } from "./CryptoCard";
import { LanguageSwitcher } from "./LanguageSwitcher";


import { AutoTrader } from "./AutoTrader";
import { UpcomingAdvisors } from "./UpcomingAdvisors";
import { AIAdvisorsGrid } from "./AIAdvisorsGrid";
// import { AIOpportunityAlert } from "./AIOpportunityAlert"; // Temporarily disabled
import { UserProfile } from "./UserProfile";

import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData, filterCryptoData } from "@/hooks/useCryptoData";
import { useWalletData } from "@/hooks/useWalletData";
import { CryptoSearch } from "./CryptoSearch";
import { BinanceAPIConfig } from "./BinanceAPIConfig";
import { ProfessionalCryptoGrid } from "./ProfessionalCryptoGrid";
// Portfolio cards moved to AI Control Center
import { BarChart3, Brain } from "lucide-react";
import { AIControlCenter } from "./AIControlCenter";

// Removed duplicate mock data - using centralized data from useCryptoData hook

interface TradingDashboardProps {
  onAddNotification?: (notification: any) => void;
}

export const TradingDashboard = memo(({ onAddNotification }: TradingDashboardProps = {}) => {
  const { t } = useLanguage();
  const { cryptoData, newsData, loading, error, isRealTimeEnabled } = useCryptoData();
  const { getPortfolioData } = useWalletData();
  const [showAllCrypto, setShowAllCrypto] = useState(false); // 默认折叠状态
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIControlCenter, setShowAIControlCenter] = useState(false);
  const [advisorStates, setAdvisorStates] = useState<Record<string, boolean>>({});

  // Listen for AI Control Center open events - 优化事件监听
  const handleOpenAIControlCenter = useCallback(() => {
    if (!showAIControlCenter) { // 避免重复打开
      setShowAIControlCenter(true);
    }
  }, [showAIControlCenter]);

  useEffect(() => {
    window.addEventListener('openAIControlCenter', handleOpenAIControlCenter);
    return () => {
      window.removeEventListener('openAIControlCenter', handleOpenAIControlCenter);
    };
  }, [handleOpenAIControlCenter]);
  
  // Memoize filtered crypto data for performance
  const filteredCryptoData = useMemo(() => 
    filterCryptoData(cryptoData, searchQuery), 
    [cryptoData, searchQuery]
  );

  // Get portfolio data from auto-trader
  const portfolioData = useMemo(() => getPortfolioData(), [getPortfolioData]);
  const { totalValue, dailyChange, activeTrades, source } = portfolioData;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-2">
      <div className="max-w-full mx-auto space-y-2">
        {/* Professional Header - Compact */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-white">
                  Professional Trading
                </h1>
                <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                  实时
                </Badge>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-2">
                <UserProfile />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* AI Opportunity Alert - Temporarily disabled due to API issues */}
        {/* <AIOpportunityAlert /> */}

        {/* Portfolio Overview moved to AI Control Center */}

        {/* API配置 - 紧凑型 */}
        <BinanceAPIConfig />

        {/* 市场数据 - 专业紧凑型 */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                市场概览
              </h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAllCrypto(!showAllCrypto)}
                  className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 h-7 px-2 text-xs"
                >
                  {showAllCrypto ? '收起' : '全部'}
                </Button>
              </div>
            </div>
            
            {/* 搜索 */}
            <div className="mb-3">
              <CryptoSearch
                onSearch={handleSearch}
                onClearSearch={handleClearSearch}
                searchQuery={searchQuery}
                totalCryptos={cryptoData.length}
                filteredCount={filteredCryptoData.length}
              />
            </div>
            
            <ProfessionalCryptoGrid 
              cryptoData={filteredCryptoData} 
              showAll={showAllCrypto}
              maxVisible={8}
            />
          </div>
        </div>

        {/* AI Control Center Modal */}
        <AIControlCenter 
          open={showAIControlCenter} 
          onOpenChange={setShowAIControlCenter}
          advisorStates={advisorStates}
          portfolioData={portfolioData}
          onAddNotification={onAddNotification}
        />

        {/* AI顾问 - 专业紧凑型 */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="p-3">
            <AIAdvisorsGrid 
              cryptoData={cryptoData} 
              newsData={newsData} 
              onActivationChange={setAdvisorStates}
              onAddNotification={onAddNotification}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

TradingDashboard.displayName = "TradingDashboard";