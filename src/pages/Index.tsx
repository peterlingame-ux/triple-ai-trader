import { TradingDashboard } from "@/components/TradingDashboard";
import { NotificationToast, notificationTemplates, createNotification } from "@/components/NotificationToast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";

const Index = () => {
  const { signOut, user, isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);

  // 初始化通知
  useEffect(() => {
    if (!loading) {
      const initialNotifications = [];

      // 欢迎提醒（首次访问）
      if (!localStorage.getItem('hasVisited')) {
        initialNotifications.push(notificationTemplates.welcomeTip());
        localStorage.setItem('hasVisited', 'true');
      }

      // 如果用户已登录，显示AI分析就绪提醒
      if (isAuthenticated) {
        initialNotifications.push(notificationTemplates.aiAnalysisReady('BTC'));
        
        // 模拟市场异动提醒（演示用）
        setTimeout(() => {
          setNotifications(prev => [...prev, notificationTemplates.marketAlert('ETH', 5.67)]);
        }, 3000);
      }

      setNotifications(initialNotifications);
    }
  }, [loading, isAuthenticated]);

  // 处理通知关闭
  const handleNotificationClose = (notificationId: string, manualClose: boolean) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    if (manualClose) {
      console.log(`用户手动关闭了通知: ${notificationId}`);
    } else {
      console.log(`通知自动关闭: ${notificationId}`);
    }
  };

  // 添加新通知的方法（可以被其他组件调用）
  const addNotification = (notification: any) => {
    setNotifications(prev => [...prev, notification]);
  };


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
    <div className="min-h-screen bg-background relative">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Crypto Trading Platform
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
      
      <TradingDashboard onAddNotification={addNotification} />
      
      {/* 右下角通知组件 */}
      <NotificationToast 
        notifications={notifications}
        onNotificationClose={handleNotificationClose}
      />
    </div>
  );
};

export default Index;
