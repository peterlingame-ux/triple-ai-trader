import { ProfessionalTradingUI } from "@/components/ProfessionalTradingUI";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User, LogIn, Settings } from "lucide-react";
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
      {/* 专业交易界面顶部导航 */}
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                CryptoPro
              </h1>
              <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <span>专业加密货币交易平台</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                <span>实时数据同步币安</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{user?.email?.split('@')[0]}</div>
                      <div className="text-xs text-muted-foreground">专业交易员</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    退出
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                    <LogIn className="h-4 w-4 mr-2" />
                    登录 / 注册
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <ProfessionalTradingUI />
    </div>
  );
};

export default Index;
