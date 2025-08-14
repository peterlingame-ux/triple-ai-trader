import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Wallet, Bot, Sparkles, Activity, CircleDollarSign } from "lucide-react";
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
  
  const changePercentage = totalValue > 0 ? ((dailyChange / totalValue) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {/* Portfolio Value Card */}
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl shadow-2xl hover:shadow-[0_20px_70px_-10px_rgba(45,100,160,0.3)] transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border border-accent/20 shadow-lg">
                  {source === 'wallet' ? (
                    <Wallet className="w-6 h-6 text-accent drop-shadow-sm" />
                  ) : (
                    <Bot className="w-6 h-6 text-accent drop-shadow-sm" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-accent-foreground" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    {source === 'wallet' ? '真实钱包' : 'AI虚拟投资组合'}
                  </h3>
                  {source === 'autotrader' && (
                    <Badge className="text-xs bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-500/30 px-2 py-0.5">
                      AI
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70">总价值</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-3xl font-bold text-accent font-mono tracking-tight">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-3 h-3 text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground/60">
                {source === 'wallet' ? '实时同步' : '模拟交易'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Daily Change Card */}
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl shadow-2xl hover:shadow-[0_20px_70px_-10px_rgba(34,197,94,0.3)] transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-emerald-500/5" />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
                  dailyChange >= 0 
                    ? 'bg-gradient-to-br from-success/20 to-emerald-500/10 border-success/20' 
                    : 'bg-gradient-to-br from-destructive/20 to-red-500/10 border-destructive/20'
                }`}>
                  <TrendingUp className={`w-6 h-6 drop-shadow-sm ${
                    dailyChange >= 0 ? 'text-success' : 'text-destructive'
                  }`} />
                </div>
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                  dailyChange >= 0 ? 'bg-success' : 'bg-destructive'
                }`}>
                  <Activity className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-muted-foreground">24小时变化</h3>
                  {source === 'wallet' && (
                    <Badge className="text-xs bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-300 border-green-500/30 px-2 py-0.5">
                      实时
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70">盈亏金额</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className={`text-3xl font-bold font-mono tracking-tight ${
              dailyChange >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {dailyChange >= 0 ? '+' : ''}${Math.abs(dailyChange).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                dailyChange >= 0 ? 'bg-success' : 'bg-destructive'
              }`} />
              <p className={`text-xs font-medium ${
                dailyChange >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                {dailyChange >= 0 ? '+' : ''}{changePercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Trades Card */}
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl shadow-2xl hover:shadow-[0_20px_70px_-10px_rgba(139,92,246,0.3)] transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/10 flex items-center justify-center border border-primary/20 shadow-lg">
                  <BarChart3 className="w-6 h-6 text-primary drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">{activeTrades}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-muted-foreground">活跃交易</h3>
                </div>
                <p className="text-xs text-muted-foreground/70">当前持仓</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-3xl font-bold text-primary font-mono tracking-tight">
              {activeTrades}
            </p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                activeTrades > 0 ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'
              }`} />
              <p className="text-xs text-muted-foreground/60">
                {activeTrades > 0 ? '正在交易' : '暂无交易'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
});

OptimizedPortfolioCards.displayName = "OptimizedPortfolioCards";