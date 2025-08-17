import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CryptoCard } from "./CryptoCard";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WalletConnector } from "./WalletConnector";

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
import { BarChart3, Brain, RefreshCw } from "lucide-react";
import { AIControlCenter } from "./AIControlCenter";

// Removed duplicate mock data - using centralized data from useCryptoData hook


export const TradingDashboard = memo(() => {
  const { t } = useLanguage();
  const { cryptoData, newsData, loading, error, refreshData } = useCryptoData();
  const { getPortfolioData, isWalletConnected } = useWalletData();
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

  // Get portfolio data from either wallet or auto-trader
  const portfolioData = useMemo(() => getPortfolioData(), [getPortfolioData]);
  const { totalValue, dailyChange, activeTrades, source } = portfolioData;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-orbitron tracking-wide">Meta BrainX</h1>
            <p className="text-sm text-slate-400">{t('app.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              {t('status.live')}
            </Badge>
            <UserProfile />
            <WalletConnector />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Portfolio Overview Cards - Compact Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* AI虚拟投资组合 */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-purple-300">AI虚拟投资组合</p>
                  <p className="text-xs text-purple-400">总价值</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">1</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-xs text-purple-300">模拟交易</span>
              </div>
            </div>
          </Card>

          {/* 日盈亏 */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/5 border-emerald-500/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Brain className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-emerald-300">日盈亏</p>
                  <p className="text-xs text-emerald-400">盈亏金额</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-emerald-400">+${Math.abs(dailyChange).toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-xs text-emerald-300">+{((Math.abs(dailyChange) / totalValue) * 100).toFixed(2)}%</span>
              </div>
            </div>
          </Card>

          {/* 活跃交易 */}
          <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-600/5 border-amber-500/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-amber-300">活跃交易</p>
                  <p className="text-xs text-amber-400">当前持仓</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-300">P</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{activeTrades}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-amber-300">正在交易</span>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Control Center Section - More Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* AI控制中心 */}
          <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-600/5 border-amber-500/20 p-6 cursor-pointer hover:border-amber-500/40 transition-all duration-300" 
                onClick={() => setShowAIControlCenter(true)}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <Brain className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI控制中心</h3>
                  <p className="text-sm text-amber-300">配置和管理您的AI交易助手</p>
                </div>
              </div>
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Brain className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </Card>

          {/* AI自动赚钱 */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/5 border-emerald-500/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <RefreshCw className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI自动赚钱</h3>
                  <p className="text-sm text-emerald-300">智能自动交易系统</p>
                </div>
              </div>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Metrics - Compact Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">94.2%</div>
            <div className="text-sm text-slate-400 mb-2">AI精准度</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{width: '94.2%'}}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">47</div>
            <div className="text-sm text-slate-400 mb-2">活跃信号</div>
            <div className="flex justify-center">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400/60 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400/30 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">+12.4%</div>
            <div className="text-sm text-slate-400 mb-2">月收益率</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{width: '62%'}}></div>
            </div>
          </div>
        </div>

        {/* 币安API配置 - More Compact */}
        <BinanceAPIConfig />

        {/* Crypto Market Section - Simplified */}
        <Card className="bg-slate-900/50 border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {t('market.overview')}
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
            </h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={refreshData}
                size="sm"
                className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/30"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {t('button.refresh')}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAllCrypto(!showAllCrypto)}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-600/30"
              >
                {showAllCrypto ? t('button.collapse') : t('button.all_categories')}
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
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
            maxVisible={6}
          />
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {t('search.showing')} {showAllCrypto ? filteredCryptoData.length : Math.min(6, filteredCryptoData.length)} {t('search.of')} {filteredCryptoData.length} {t('search.currencies')}
            </div>
            {filteredCryptoData.length > 6 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllCrypto(!showAllCrypto)}
                className="text-primary hover:text-primary/80"
              >
                {showAllCrypto ? t('button.collapse') : `${t('button.view_all')} ${filteredCryptoData.length}`}
              </Button>
            )}
          </div>

          {filteredCryptoData.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t('search.not_found')} "{searchQuery}" {t('search.try_other')}
              </p>
            </div>
          )}
        </Card>

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
      </div>
    </div>
  );
});

TradingDashboard.displayName = "TradingDashboard";