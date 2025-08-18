import { TradingDashboard } from "@/components/TradingDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User, LogIn, Brain, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { SuperBrainXSidebar } from "@/components/SuperBrainXSidebar";

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
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen bg-background w-full flex">
        <SidebarInset className="flex-1">
          <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 w-full">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Crypto Trading Platform
                </h1>
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="h-8 w-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all" />
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <Brain className="w-4 h-4 text-purple-400" />
                    <span>SUPER BRAINX</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
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
          <TradingDashboard />
        </SidebarInset>
        <SuperBrainXSidebar />
      </div>
    </SidebarProvider>
  );
};

export default Index;
