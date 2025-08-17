import { TradingDashboard } from "@/components/TradingDashboard";
import { AutoTradingSystem } from "@/components/AutoTradingSystem";
import { BinanceMarketData } from "@/components/BinanceMarketData";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, User, LogIn, Brain, TrendingUp, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { signOut, user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('auth.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI加密货币自动交易平台
          </h1>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {user?.email}
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('auth.logout')}
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('auth.login_register')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="auto-trading" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border-slate-700">
            <TabsTrigger value="auto-trading" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI自动交易
            </TabsTrigger>
            <TabsTrigger value="market-data" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              市场行情
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              交易面板
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="auto-trading" className="space-y-6">
            <AutoTradingSystem />
          </TabsContent>
          
          <TabsContent value="market-data" className="space-y-6">
            <BinanceMarketData />
          </TabsContent>
          
          <TabsContent value="dashboard" className="space-y-6">
            <TradingDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
