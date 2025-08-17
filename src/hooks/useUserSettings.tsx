import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserSettings {
  id?: string;
  user_id?: string;
  super_brain_monitoring: boolean;
  auto_trading_enabled: boolean;
  trading_strategy: 'conservative' | 'aggressive';
  max_positions: number;
  risk_per_trade: number;
  virtual_balance: number;
  monitoring_symbols: string[];
  created_at?: string;
  updated_at?: string;
}

const defaultSettings: UserSettings = {
  super_brain_monitoring: false,
  auto_trading_enabled: false,
  trading_strategy: 'conservative',
  max_positions: 5,
  risk_per_trade: 2.0,
  virtual_balance: 100000,
  monitoring_symbols: ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL']
};

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // 检查用户认证状态
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (user) {
        await loadUserSettings(user.id);
      } else {
        // 如果没有认证，使用本地存储的设置
        loadLocalSettings();
      }
      setIsLoading(false);
    };
    
    checkAuth();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user;
      setIsAuthenticated(!!user);
      
      if (user) {
        loadUserSettings(user.id);
      } else {
        loadLocalSettings();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 从数据库加载用户设置
  const loadUserSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading user settings:', error);
        return;
      }

      if (data) {
        setSettings({
          ...data,
          trading_strategy: data.trading_strategy as 'conservative' | 'aggressive'
        });
      } else {
        // 如果没有设置记录，创建默认设置
        await createUserSettings(userId);
      }
    } catch (error) {
      console.error('Error in loadUserSettings:', error);
      loadLocalSettings(); // 回退到本地存储
    }
  };

  // 创建用户设置记录
  const createUserSettings = async (userId: string) => {
    try {
      const newSettings = { ...defaultSettings, user_id: userId };
      const { data, error } = await supabase
        .from('user_settings')
        .insert(newSettings)
        .select()
        .single();

      if (error) {
        console.error('Error creating user settings:', error);
        return;
      }

      if (data) {
        setSettings({
          ...data,
          trading_strategy: data.trading_strategy as 'conservative' | 'aggressive'
        });
      }
    } catch (error) {
      console.error('Error in createUserSettings:', error);
    }
  };

  // 从本地存储加载设置（未认证用户）
  const loadLocalSettings = () => {
    try {
      const superBrainMonitoring = localStorage.getItem('superBrainMonitoring');
      const autoTraderEnabled = localStorage.getItem('autoTraderEnabled');
      const virtualAccount = localStorage.getItem('virtualAccount');

      const localSettings: UserSettings = {
        ...defaultSettings,
        super_brain_monitoring: superBrainMonitoring ? JSON.parse(superBrainMonitoring) : false,
        auto_trading_enabled: autoTraderEnabled ? JSON.parse(autoTraderEnabled) : false,
        virtual_balance: virtualAccount ? JSON.parse(virtualAccount).balance || 100000 : 100000
      };

      setSettings(localSettings);
    } catch (error) {
      console.error('Error loading local settings:', error);
      setSettings(defaultSettings);
    }
  };

  // 更新设置
  const updateSettings = async (updates: Partial<UserSettings>) => {
    console.log('useUserSettings - updateSettings called with:', updates);
    console.log('useUserSettings - current settings:', settings);
    console.log('useUserSettings - isAuthenticated:', isAuthenticated);
    
    try {
      const newSettings = { ...settings, ...updates };
      console.log('useUserSettings - newSettings:', newSettings);

      if (isAuthenticated) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('useUserSettings - updating database for user:', user.id);
          const { error } = await supabase
            .from('user_settings')
            .update(updates)
            .eq('user_id', user.id);

          if (error) {
            console.error('Error updating user settings:', error);
            toast({
              title: "❌ 设置更新失败",
              description: "无法保存设置到服务器",
              variant: "destructive"
            });
            return false;
          }
          console.log('useUserSettings - database update successful');
        }
      } else {
        console.log('useUserSettings - saving to localStorage');
        // 保存到本地存储
        if ('super_brain_monitoring' in updates) {
          localStorage.setItem('superBrainMonitoring', JSON.stringify(updates.super_brain_monitoring));
        }
        if ('auto_trading_enabled' in updates) {
          localStorage.setItem('autoTraderEnabled', JSON.stringify(updates.auto_trading_enabled));
        }
        if ('virtual_balance' in updates) {
          const virtualAccount = JSON.parse(localStorage.getItem('virtualAccount') || '{}');
          virtualAccount.balance = updates.virtual_balance;
          localStorage.setItem('virtualAccount', JSON.stringify(virtualAccount));
          console.log('useUserSettings - saved to localStorage:', virtualAccount);
        }
      }

      console.log('useUserSettings - setting new settings state:', newSettings);
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };

  // 启动后台监控
  const startBackgroundMonitoring = async () => {
    if (!isAuthenticated) {
      toast({
        title: "❌ 需要登录",
        description: "后台监控功能需要用户登录才能使用",
        variant: "destructive"
      });
      return false;
    }

    try {
      // 立即执行一次后台监控
      const { data, error } = await supabase.functions.invoke('background-monitor');
      
      if (error) {
        console.error('Error starting background monitor:', error);
        return false;
      }

      console.log('Background monitor started:', data);
      
      // 启动定期监控 - 每5分钟检查一次
      const intervalId = setInterval(async () => {
        try {
          console.log('🔄 执行定期后台监控检查...');
          const { data: monitorData, error: monitorError } = await supabase.functions.invoke('background-monitor');
          
          if (monitorError) {
            console.error('定期监控检查出错:', monitorError);
          } else {
            console.log('✅ 定期监控检查完成:', monitorData);
          }
        } catch (err) {
          console.error('定期监控异常:', err);
        }
      }, 5 * 60 * 1000); // 5分钟

      // 存储interval ID以便后续清理
      (window as any).superBrainMonitorInterval = intervalId;
      
      toast({
        title: "🧠 后台监控已启动",
        description: "AI将每5分钟自动检测交易机会并执行自动下单",
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error('Error in startBackgroundMonitoring:', error);
      return false;
    }
  };

  // 停止后台监控
  const stopBackgroundMonitoring = async () => {
    if ((window as any).superBrainMonitorInterval) {
      clearInterval((window as any).superBrainMonitorInterval);
      (window as any).superBrainMonitorInterval = null;
      console.log('🛑 后台监控已停止');
      
      toast({
        title: "🛑 后台监控已停止",
        description: "AI自动交易监控已关闭",
        variant: "default"
      });
    }
  };

  return {
    settings,
    isLoading,
    isAuthenticated,
    updateSettings,
    startBackgroundMonitoring,
    stopBackgroundMonitoring,
    refreshSettings: () => {
      if (isAuthenticated) {
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) loadUserSettings(user.id);
        });
      } else {
        loadLocalSettings();
      }
    }
  };
};