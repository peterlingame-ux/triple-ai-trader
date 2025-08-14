import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData } from "@/hooks/useCryptoData";
import { BarChart3, Brain, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

// Simple crypto card component to avoid import issues
const SimpleCryptoCard = ({ symbol, name, price, change, changePercent }: {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold">{symbol.slice(0, 2)}</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{symbol}</h3>
            <p className="text-sm text-muted-foreground">{name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">
            ${price.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <Badge 
              variant={isPositive ? "default" : "destructive"}
              className={isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
            >
              {isPositive ? "+" : ""}{changePercent.toFixed(2)}%
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const TradingDashboard = () => {
  const { t } = useLanguage();
  const { cryptoData, loading, refreshData } = useCryptoData();
  const [showAllCrypto, setShowAllCrypto] = useState(false);

  return (
    <div className="min-h-screen relative p-6 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent text-lg font-bold">₿</span>
        </div>
        <div className="absolute top-32 right-20 w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
          <span className="text-accent text-sm font-bold">Ξ</span>
        </div>
        <div className="absolute bottom-1/3 right-10 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent text-lg font-bold">$</span>
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 font-orbitron tracking-wide">
              Meta BrainX AI Trader
            </h1>
            <p className="text-xl text-gray-300 font-inter">
              Advanced AI-Powered Cryptocurrency Trading Platform
            </p>
          </div>

          {/* Crypto Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
                <BarChart3 className="w-6 h-6" />
                Market Overview
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
                  Refresh
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllCrypto(!showAllCrypto)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6"
                >
                  {showAllCrypto ? "Top 6" : "View All"}
                  <BarChart3 className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showAllCrypto ? cryptoData : cryptoData.slice(0, 6)).map((crypto) => (
                <SimpleCryptoCard
                  key={crypto.symbol}
                  symbol={crypto.symbol}
                  name={crypto.name}
                  price={crypto.price}
                  change={crypto.change24h}
                  changePercent={crypto.changePercent24h}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};