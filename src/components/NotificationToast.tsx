import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Bell, Zap, TrendingUp, Brain, Star } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ai' | 'market';
  icon?: React.ReactNode;
  autoHide?: boolean;
  autoHideDelay?: number;
  persistent?: boolean; // 是否持久化用户关闭状态
}

interface NotificationToastProps {
  notifications: NotificationItem[];
  onNotificationClose: (id: string, manualClose: boolean) => void;
}

const getNotificationStyles = (type: string) => {
  switch (type) {
    case 'success':
      return {
        border: 'border-green-500/30',
        bg: 'bg-green-500/10',
        icon: 'text-green-400',
        title: 'text-green-300'
      };
    case 'warning':
      return {
        border: 'border-yellow-500/30',
        bg: 'bg-yellow-500/10',
        icon: 'text-yellow-400',
        title: 'text-yellow-300'
      };
    case 'error':
      return {
        border: 'border-red-500/30',
        bg: 'bg-red-500/10',
        icon: 'text-red-400',
        title: 'text-red-300'
      };
    case 'ai':
      return {
        border: 'border-purple-500/30',
        bg: 'bg-purple-500/10',
        icon: 'text-purple-400',
        title: 'text-purple-300'
      };
    case 'market':
      return {
        border: 'border-blue-500/30',
        bg: 'bg-blue-500/10',
        icon: 'text-blue-400',
        title: 'text-blue-300'
      };
    default:
      return {
        border: 'border-slate-500/30',
        bg: 'bg-slate-500/10',
        icon: 'text-slate-400',
        title: 'text-slate-300'
      };
  }
};

const getDefaultIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <Star className="w-4 h-4" />;
    case 'warning':
      return <Bell className="w-4 h-4" />;
    case 'error':
      return <X className="w-4 h-4" />;
    case 'ai':
      return <Brain className="w-4 h-4" />;
    case 'market':
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

export const NotificationToast = ({ notifications, onNotificationClose }: NotificationToastProps) => {
  const { t, currentLanguage } = useLanguage();
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationItem[]>([]);
  const [closedNotifications, setClosedNotifications] = useState<Set<string>>(new Set());

  // 从localStorage读取已关闭的通知
  useEffect(() => {
    try {
      const stored = localStorage.getItem('closedNotifications');
      if (stored) {
        setClosedNotifications(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Failed to load closed notifications:', error);
    }
  }, []);

  // 过滤已经被用户手动关闭的通知
  useEffect(() => {
    const filtered = notifications.filter(notification => {
      if (notification.persistent) {
        return !closedNotifications.has(notification.id);
      }
      return true;
    });
    setVisibleNotifications(filtered);
  }, [notifications, closedNotifications]);

  // 自动隐藏功能
  useEffect(() => {
    visibleNotifications.forEach(notification => {
      if (notification.autoHide && notification.autoHideDelay) {
        const timer = setTimeout(() => {
          handleClose(notification.id, false); // 自动关闭，不是手动关闭
        }, notification.autoHideDelay);

        return () => clearTimeout(timer);
      }
    });
  }, [visibleNotifications]);

  const handleClose = (notificationId: string, manualClose: boolean) => {
    const notification = notifications.find(n => n.id === notificationId);
    
    if (manualClose && notification?.persistent) {
      // 用户手动关闭持久化通知，记录到localStorage
      const newClosed = new Set([...closedNotifications, notificationId]);
      setClosedNotifications(newClosed);
      localStorage.setItem('closedNotifications', JSON.stringify([...newClosed]));
    }

    // 从可见通知中移除
    setVisibleNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    // 通知父组件
    onNotificationClose(notificationId, manualClose);
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {visibleNotifications.map((notification) => {
        const styles = getNotificationStyles(notification.type);
        const icon = notification.icon || getDefaultIcon(notification.type);

        return (
          <Card
            key={notification.id}
            className={`
              ${styles.bg} ${styles.border} backdrop-blur-sm 
              animate-in slide-in-from-right-full duration-300 
              shadow-lg hover:shadow-xl transition-all
            `}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* 图标 */}
                <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
                  {icon}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className={`font-semibold text-sm ${styles.title} leading-tight`}>
                        {notification.title}
                      </h4>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>

                    {/* 关闭按钮 */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleClose(notification.id, true)}
                      className="text-slate-400 hover:text-white h-6 w-6 p-0 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* 类型标签 */}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-2 py-0 ${styles.border} ${styles.icon}`}
                    >
                      {currentLanguage === 'zh' ? 
                        (notification.type === 'ai' ? 'AI通知' : 
                         notification.type === 'market' ? '市场提醒' :
                         notification.type === 'success' ? '成功' :
                         notification.type === 'warning' ? '警告' :
                         notification.type === 'error' ? '错误' : '信息') :
                        notification.type.toUpperCase()
                      }
                    </Badge>
                    
                    {notification.autoHide && (
                      <span className="text-xs text-slate-500">
                        {Math.floor((notification.autoHideDelay || 5000) / 1000)}s后自动关闭
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// 默认通知配置
export const createNotification = (
  id: string,
  title: string,
  message: string,
  type: NotificationItem['type'] = 'info',
  options: Partial<NotificationItem> = {}
): NotificationItem => ({
  id,
  title,
  message,
  type,
  autoHide: options.autoHide ?? true,
  autoHideDelay: options.autoHideDelay ?? 5000,
  persistent: options.persistent ?? true,
  ...options
});

// 预设通知模板
export const notificationTemplates = {
  aiAnalysisReady: (cryptoSymbol: string) => createNotification(
    'ai-analysis-ready',
    'AI分析引擎就绪',
    `${cryptoSymbol} 的多维度AI分析已准备完毕，点击开始实时对话分析。`,
    'ai',
    {
      icon: <Brain className="w-4 h-4" />,
      persistent: true,
      autoHide: false
    }
  ),

  marketAlert: (cryptoSymbol: string, priceChange: number) => createNotification(
    `market-alert-${cryptoSymbol}`,
    '市场异动提醒',
    `${cryptoSymbol} 价格变动 ${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}%，建议关注市场动态。`,
    'market',
    {
      icon: <TrendingUp className="w-4 h-4" />,
      persistent: true,
      autoHideDelay: 8000
    }
  ),

  welcomeTip: () => createNotification(
    'welcome-tip',
    '欢迎使用Super BrainX',
    '您现在可以启用AI引擎进行实时加密货币分析。点击右上角AI控制中心开始配置。',
    'info',
    {
      icon: <Zap className="w-4 h-4" />,
      persistent: true,
      autoHide: false
    }
  ),

  configSuccess: () => createNotification(
    'config-success',
    'AI引擎配置成功',
    'AI分析引擎已成功配置并启用，现在可以开始实时分析了！',
    'success',
    {
      persistent: false,
      autoHideDelay: 3000
    }
  )
};