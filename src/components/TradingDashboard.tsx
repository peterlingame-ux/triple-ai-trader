import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CryptoCard } from "./CryptoCard";
import { AIAdvisor } from "./AIAdvisor";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import { BarChart3, Brain, DollarSign, TrendingUp, Zap } from "lucide-react";

// Mock data for crypto prices
const mockCryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: 43250, change: 1245.50, changePercent: 2.97 },
  { symbol: "ETH", name: "Ethereum", price: 2567, change: -45.30, changePercent: -1.73 },
  { symbol: "ADA", name: "Cardano", price: 0.485, change: 0.023, changePercent: 4.98 },
  { symbol: "SOL", name: "Solana", price: 98.75, change: 3.42, changePercent: 3.59 },
  { symbol: "DOT", name: "Polkadot", price: 7.23, change: -0.18, changePercent: -2.43 },
  { symbol: "MATIC", name: "Polygon", price: 0.89, change: 0.065, changePercent: 7.88 },
];

// Mock AI advisors data
const aiAdvisors = [
  {
    name: "Elon Musk",
    specialty: "Visionary Tech & Market Disruption",
    confidence: 94,
    recommendation: "BUY DOGE, BTC",
    reasoning: "Mars missions need funding, and crypto is the future of interplanetary commerce. Dogecoin to the moon! Tesla will accept more crypto payments. The simulation theory suggests all investments are digital anyway.",
    avatar: "/lovable-uploads/9cc92493-5e50-470d-9543-d2fe07d350f6.png",
    isSpecial: true
  },
  {
    name: "Warren Buffett",
    specialty: "Value Investing & Long-term Wealth Building",
    confidence: 88,
    recommendation: "HOLD BTC, BUY ETH",
    reasoning: "My investment philosophy centers on buying wonderful businesses at fair prices and holding them forever. In crypto, I see Bitcoin as digital gold with scarcity value, while Ethereum represents the infrastructure of the digital economy. Remember: 'Time in the market beats timing the market.' Focus on intrinsic value, not market volatility. The best investment is in yourself and technologies that create lasting value.",
    avatar: "/lovable-uploads/ed9162db-2b3e-40ac-8c54-4c00f966b7a7.png",
    isSpecial: true
  },
  {
    name: "比尔盖茨",
    specialty: "Technology Innovation & Philanthropic Investment",
    confidence: 92,
    recommendation: "BUY ETH, HOLD MATIC",
    reasoning: "As someone who has witnessed the evolution of technology from personal computers to the internet, I believe blockchain represents the next fundamental shift. Ethereum's smart contract platform mirrors what we built with Windows - a foundation for others to innovate upon. My investment philosophy focuses on technologies that can solve humanity's greatest challenges. Cryptocurrency and blockchain can democratize financial services globally, especially in developing nations. However, we must ensure these technologies serve the greater good, not just speculation.",
    avatar: "/lovable-uploads/11d23e11-5de1-45f8-9894-919cd96033d1.png",
    isSpecial: true
  }
];

export const TradingDashboard = () => {
  const { t } = useLanguage();
  const [totalPortfolio, setTotalPortfolio] = useState(125678.42);
  const [dailyChange, setDailyChange] = useState(3456.78);
  const [activeTrades, setActiveTrades] = useState(12);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalPortfolio(prev => prev + (Math.random() - 0.5) * 100);
      setDailyChange(prev => prev + (Math.random() - 0.5) * 50);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-8 rounded-lg bg-cover bg-center bg-no-repeat relative overflow-hidden"
          style={{
            backgroundImage: `url('/lovable-uploads/4cd6a022-c475-4af7-a9c1-681f2a8c06b1.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {t('app.title')}
            </h1>
            <p className="text-white/90 drop-shadow-md">
              {t('app.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <LanguageSwitcher />
            <Badge variant="outline" className="px-3 py-1 bg-success/10 text-success border-success/30">
              <Zap className="w-3 h-3 mr-1" />
              {t('status.live')}
            </Badge>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-crypto border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('portfolio.total')}</p>
                <p className="text-2xl font-bold text-accent">
                  ${totalPortfolio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                <p className="text-sm text-muted-foreground">{t('portfolio.change')}</p>
                <p className="text-2xl font-bold text-success">
                  +${dailyChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                <p className="text-sm text-muted-foreground">{t('portfolio.trades')}</p>
                <p className="text-2xl font-bold text-foreground">{activeTrades}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Crypto Cards Grid */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            {t('market.overview')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCryptoData.map((crypto) => (
              <CryptoCard
                key={crypto.symbol}
                symbol={crypto.symbol}
                name={crypto.name}
                price={crypto.price}
                change={crypto.change}
                changePercent={crypto.changePercent}
              />
            ))}
          </div>
        </div>

        {/* AI Advisors Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6" />
            {t('ai.advisors')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {aiAdvisors.map((advisor, index) => (
              <AIAdvisor
                key={index}
                name={advisor.name}
                specialty={advisor.specialty}
                confidence={advisor.confidence}
                recommendation={advisor.recommendation}
                reasoning={advisor.reasoning}
                avatar={advisor.avatar}
                isSpecial={advisor.isSpecial}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-gradient-gold border-border">
          <h3 className="text-xl font-bold text-accent-foreground mb-4">{t('actions.title')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="bg-background/10 border-accent-foreground/20">
              {t('actions.execute')}
            </Button>
            <Button variant="outline" className="bg-background/10 border-accent-foreground/20">
              {t('actions.analysis')}
            </Button>
            <Button variant="outline" className="bg-background/10 border-accent-foreground/20">
              {t('actions.risk')}
            </Button>
            <Button variant="outline" className="bg-background/10 border-accent-foreground/20">
              {t('actions.alerts')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};