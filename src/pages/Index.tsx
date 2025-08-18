import { TradingDashboard } from "@/components/TradingDashboard";
import SuperBrainXSidebar from "@/components/SuperBrainXSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User, LogIn, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";

const Index = () => {
  const { signOut, user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const [showSuperBrain, setShowSuperBrain] = useState(false);


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
            Crypto Trading Platform
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuperBrain(!showSuperBrain)}
              className="flex items-center gap-2 hover:bg-primary/10 text-primary"
              title="切换 SUPER BRAINX 面板 (Ctrl/Cmd+B)"
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">SUPER BRAINX</span>
            </Button>
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
      <TradingDashboard />
      <SuperBrainXSidebar 
        isExpanded={showSuperBrain}
        onToggle={() => setShowSuperBrain(!showSuperBrain)}
      />
    </div>
  );
};

export default Index;
