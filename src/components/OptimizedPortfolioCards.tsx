import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Wallet, Bot } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface PortfolioData {
  totalValue: number;
  dailyChange: number;
  activeTrades: number;
  source: 'wallet' | 'autotrader';
}

interface OptimizedPortfolioCardsProps {
  portfolioData: PortfolioData;
}

export const OptimizedPortfolioCards = memo<OptimizedPortfolioCardsProps>(({ portfolioData }) => {
  const { t } = useLanguage();
  const { totalValue, dailyChange, activeTrades, source } = portfolioData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 bg-gradient-crypto border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            {source === 'wallet' ? (
              <Wallet className="w-6 h-6 text-accent" />
            ) : (
              <Bot className="w-6 h-6 text-accent" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground font-inter">
                {source === 'wallet' ? t('wallet.real') : t('wallet.virtual')}
              </p>
              {source === 'autotrader' && (
                <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {t('wallet.ai_virtual_badge')}
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-accent font-mono tracking-wider">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-crypto border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-success" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground font-inter">{t('portfolio.change')}</p>
              {source === 'wallet' && (
                <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                  实时
                </Badge>
              )}
            </div>
            <p className={`text-2xl font-bold font-mono tracking-wider ${dailyChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {dailyChange >= 0 ? '+' : ''}${dailyChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-crypto border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-inter">
              {source === 'wallet' ? '持仓交易' : t('portfolio.trades')}
            </p>
            <p className="text-2xl font-bold text-foreground font-mono tracking-wider">{activeTrades}</p>
          </div>
        </div>
      </Card>
    </div>
  );
});

OptimizedPortfolioCards.displayName = "OptimizedPortfolioCards";