import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CryptoCard } from "./CryptoCard";
import { AIAdvisor } from "./AIAdvisor";
import { ElonProfile } from "./ElonProfile";
import { WarrenProfile } from "./WarrenProfile";
import { BillProfile } from "./BillProfile";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WalletConnector } from "./WalletConnector";
import { AICommunicator } from "./AICommunicator";
import { useLanguage } from "@/hooks/useLanguage";
import { BarChart3, Brain, DollarSign, TrendingUp, Zap } from "lucide-react";

// Mock data for crypto prices - expanded dataset
const mockCryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: 43250, change: 1245.50, changePercent: 2.97 },
  { symbol: "ETH", name: "Ethereum", price: 2567, change: -45.30, changePercent: -1.73 },
  { symbol: "ADA", name: "Cardano", price: 0.485, change: 0.023, changePercent: 4.98 },
  { symbol: "SOL", name: "Solana", price: 98.75, change: 3.42, changePercent: 3.59 },
  { symbol: "DOT", name: "Polkadot", price: 7.23, change: -0.18, changePercent: -2.43 },
  { symbol: "MATIC", name: "Polygon", price: 0.89, change: 0.065, changePercent: 7.88 },
];

const allCryptoData = [
  ...mockCryptoData,
  { symbol: "BNB", name: "Binance Coin", price: 315.67, change: 12.45, changePercent: 4.12 },
  { symbol: "XRP", name: "Ripple", price: 0.634, change: -0.021, changePercent: -3.20 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.078, change: 0.004, changePercent: 5.41 },
  { symbol: "AVAX", name: "Avalanche", price: 36.78, change: 1.89, changePercent: 5.42 },
  { symbol: "LINK", name: "Chainlink", price: 14.23, change: -0.67, changePercent: -4.50 },
  { symbol: "UNI", name: "Uniswap", price: 6.45, change: 0.34, changePercent: 5.57 },
  { symbol: "LTC", name: "Litecoin", price: 73.45, change: -2.12, changePercent: -2.81 },
  { symbol: "ATOM", name: "Cosmos", price: 8.67, change: 0.45, changePercent: 5.48 },
  { symbol: "ICP", name: "Internet Computer", price: 5.23, change: -0.23, changePercent: -4.21 },
  { symbol: "NEAR", name: "NEAR Protocol", price: 2.34, change: 0.12, changePercent: 5.41 },
  { symbol: "APT", name: "Aptos", price: 8.90, change: 0.67, changePercent: 8.13 },
  { symbol: "FTM", name: "Fantom", price: 0.445, change: 0.023, changePercent: 5.46 },
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
    name: "Bill Gates",
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
  const [showAllCrypto, setShowAllCrypto] = useState(false);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 mb-2 tracking-wide">
              {t('app.title')}
            </h1>
            <p className="text-amber-200/80 font-inter font-medium text-lg tracking-wide">
              {t('app.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <WalletConnector />
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
                  <p className="text-sm text-muted-foreground font-inter">{t('portfolio.total')}</p>
                  <p className="text-2xl font-bold text-accent font-mono tracking-wider">
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
                  <p className="text-sm text-muted-foreground font-inter">{t('portfolio.change')}</p>
                  <p className="text-2xl font-bold text-success font-mono tracking-wider">
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
                  <p className="text-sm text-muted-foreground font-inter">{t('portfolio.trades')}</p>
                  <p className="text-2xl font-bold text-foreground font-mono tracking-wider">{activeTrades}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Crypto Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
              <BarChart3 className="w-6 h-6" />
              {t('market.overview')}
            </h2>
            <Button 
              variant="outline" 
              onClick={() => setShowAllCrypto(!showAllCrypto)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6"
            >
              {showAllCrypto ? "Show Top 6" : "All Categories"}
              <BarChart3 className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(showAllCrypto ? allCryptoData : mockCryptoData).map((crypto) => (
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
              <Brain className="w-6 h-6" />
              {t('ai.advisors')}
            </h2>
            <AICommunicator />
          </div>
          <div className="space-y-6">
            {aiAdvisors.map((advisor, index) => (
              <div key={index}>
                {advisor.name === 'Elon Musk' && (
                  <ElonProfile
                    name={advisor.name}
                    specialty={advisor.specialty}
                    confidence={advisor.confidence}
                    recommendation={advisor.recommendation}
                    reasoning={advisor.reasoning}
                    avatar={advisor.avatar}
                    isSpecial={advisor.isSpecial}
                  />
                )}
                {advisor.name === 'Warren Buffett' && (
                  <WarrenProfile
                    name={advisor.name}
                    specialty={advisor.specialty}
                    confidence={advisor.confidence}
                    recommendation={advisor.recommendation}
                    reasoning={advisor.reasoning}
                    avatar={advisor.avatar}
                    isSpecial={advisor.isSpecial}
                  />
                )}
                {advisor.name === 'Bill Gates' && (
                  <BillProfile
                    name={advisor.name}
                    specialty={advisor.specialty}
                    confidence={advisor.confidence}
                    recommendation={advisor.recommendation}
                    reasoning={advisor.reasoning}
                    avatar={advisor.avatar}
                    isSpecial={advisor.isSpecial}
                  />
                )}
              </div>
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