import { memo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Wallet, Bot } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useWalletData } from "@/hooks/useWalletData";

export const OptimizedPortfolioStats = memo(() => {
  const { t } = useLanguage();
  const { getPortfolioData } = useWalletData();
  
  const portfolioData = getPortfolioData();
  const { totalValue, dailyChange, activeTrades, source } = portfolioData;

  // Format currency values
  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Value Card */}
      <Card className="p-4 bg-gradient-crypto border-border hover:shadow-crypto transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            {source === 'wallet' ? (
              <Wallet className="w-5 h-5 text-accent" />
            ) : (
              <Bot className="w-5 h-5 text-accent" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-muted-foreground font-inter">
                {source === 'wallet' ? t('wallet.real') : t('wallet.virtual')}
              </p>
              {source === 'autotrader' && (
                <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                  AI
                </Badge>
              )}
            </div>
            <p className="text-xl font-bold text-accent font-mono tracking-wider">
              ${formatCurrency(totalValue)}
            </p>
          </div>
        </div>
      </Card>

      {/* Daily Change Card */}
      <Card className="p-4 bg-gradient-crypto border-border hover:shadow-crypto transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            dailyChange >= 0 ? 'bg-success/20' : 'bg-destructive/20'
          }`}>
            <TrendingUp className={`w-5 h-5 ${
              dailyChange >= 0 ? 'text-success' : 'text-destructive'
            }`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-muted-foreground font-inter">{t('portfolio.change')}</p>
              {source === 'wallet' && (
                <Badge variant="outline" className="text-xs bg-success/20 text-success border-success/30">
                  实时
                </Badge>
              )}
            </div>
            <p className={`text-xl font-bold font-mono tracking-wider ${
              dailyChange >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {dailyChange >= 0 ? '+' : ''}${formatCurrency(dailyChange)}
            </p>
          </div>
        </div>
      </Card>

      {/* Active Trades Card */}
      <Card className="p-4 bg-gradient-crypto border-border hover:shadow-crypto transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-inter mb-1">
              {source === 'wallet' ? '持仓交易' : t('portfolio.trades')}
            </p>
            <p className="text-xl font-bold text-foreground font-mono tracking-wider">
              {activeTrades}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
});

OptimizedPortfolioStats.displayName = 'OptimizedPortfolioStats';