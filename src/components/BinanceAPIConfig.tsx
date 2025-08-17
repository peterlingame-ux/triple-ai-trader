import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, CheckCircle, Shield, Settings, XCircle } from "lucide-react";
import { SecureAPIConfig } from './SecureAPIConfig';
import { BinanceExchangeLogo } from './BinanceExchangeLogo';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function BinanceAPIConfig() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // 添加调试日志
  console.log('BinanceAPIConfig render:', { isAuthenticated, isExpanded, isConfigured, connectionStatus });

  useEffect(() => {
    if (isAuthenticated) {
      checkConfiguration();
    }
  }, [isAuthenticated]);

  const checkConfiguration = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-api-config', {
        body: { service: 'binance_api_config' }
      });

      if (!error && data?.configured) {
        setIsConfigured(true);
        // Auto test connection to get status
        testConnection();
      }
    } catch (error) {
      console.error('Error checking configuration:', error);
    }
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const { data, error } = await supabase.functions.invoke('test-api-connection', {
        body: { service: 'binance_api_config' }
      });

      if (!error) {
        setConnectionStatus(data.success ? 'success' : 'error');
      }
    } catch (error) {
      console.error('Test connection error:', error);
      setConnectionStatus('error');
    }
  };

  const getStatusBadge = () => {
    // 未登录状态
    if (!isAuthenticated) {
      return (
        <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs px-3 py-1">
          需要登录
        </Badge>
      );
    }

    if (!isConfigured) {
      return (
        <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs px-3 py-1">
          未配置
        </Badge>
      );
    }
    
    switch (connectionStatus) {
      case 'testing':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs px-3 py-1 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-spin mr-2" />
            检测中...
          </Badge>
        );
      case 'success':
        return (
          <Badge variant="default" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/40 text-xs px-3 py-1 shadow-lg shadow-green-500/20">
            <CheckCircle className="w-3 h-3 mr-2" />
            登录成功
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/40 text-xs px-3 py-1">
            <XCircle className="w-3 h-3 mr-2" />
            连接失败
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-xs px-3 py-1">
            <Shield className="w-3 h-3 mr-2" />
            已配置
          </Badge>
        );
    }
  };

  // Collapsed view - Professional Binance Design
  if (!isExpanded) {
    return (
      <Card 
        className={`
          bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 
          border-slate-600/50 backdrop-blur-xl cursor-pointer transition-all duration-500 
          hover:shadow-2xl hover:shadow-yellow-500/10
          ${connectionStatus === 'success' ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20' : 'hover:border-yellow-500/30'}
        `}
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Binance Logo with Professional Styling */}
              <div className={`
                relative p-3 rounded-xl border transition-all duration-500
                ${connectionStatus === 'success' 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/40 shadow-lg shadow-yellow-500/30' 
                  : 'bg-gradient-to-br from-slate-700/30 to-slate-600/30 border-slate-600/50'
                }
              `}>
                <BinanceExchangeLogo 
                  size={48} 
                  showGlow={connectionStatus === 'success'} 
                  className="flex-shrink-0"
                />
                {connectionStatus === 'success' && (
                  <>
                    {/* Glow rings for success state */}
                    <div className="absolute inset-0 rounded-xl bg-yellow-400/10 animate-pulse" />
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 blur-sm -z-10" />
                    <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-md -z-20" />
                  </>
                )}
              </div>
              
              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground font-orbitron tracking-wide">
                    Binance API 配置
                  </h3>
                  {connectionStatus === 'success' && isAuthenticated && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-green-400/60 animate-pulse" style={{animationDelay: '0.5s'}} />
                      <div className="w-2 h-2 rounded-full bg-green-400/30 animate-pulse" style={{animationDelay: '1s'}} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge()}
                  <span className="text-xs text-muted-foreground">
                    {isAuthenticated ? "配置您的 Binance API 以获取实时交易数据" : "请先登录以配置 API"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`
                  h-10 w-10 p-0 rounded-lg transition-all duration-300
                  ${connectionStatus === 'success' && isAuthenticated
                    ? 'hover:bg-yellow-500/20 hover:border-yellow-500/50' 
                    : 'hover:bg-slate-700/50'
                  }
                `}
                disabled={!isAuthenticated}
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`
                  h-10 w-10 p-0 rounded-lg transition-all duration-300
                  ${connectionStatus === 'success' && isAuthenticated
                    ? 'hover:bg-yellow-500/20 hover:border-yellow-500/50' 
                    : 'hover:bg-slate-700/50'
                  }
                `}
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Expanded view - Professional Design
  return (
    <div className="space-y-4">
      {/* Professional Header when expanded */}
      <Card 
        className={`
          bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 
          border-slate-600/50 backdrop-blur-xl cursor-pointer transition-all duration-500
          ${connectionStatus === 'success' ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20' : 'hover:border-yellow-500/30'}
        `}
        onClick={() => setIsExpanded(false)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`
                relative p-3 rounded-xl border transition-all duration-500
                ${connectionStatus === 'success' 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/40' 
                  : 'bg-gradient-to-br from-slate-700/30 to-slate-600/30 border-slate-600/50'
                }
              `}>
                <BinanceExchangeLogo 
                  size={48} 
                  showGlow={connectionStatus === 'success'} 
                  className="flex-shrink-0"
                />
                {connectionStatus === 'success' && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-yellow-400/10 animate-pulse" />
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 blur-sm -z-10" />
                  </>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground font-orbitron tracking-wide">
                    Binance API 配置
                  </h3>
                  {connectionStatus === 'success' && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-green-400/60 animate-pulse" style={{animationDelay: '0.5s'}} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge()}
                  <span className="text-xs text-muted-foreground">点击收起配置面板</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`
                h-10 w-10 p-0 rounded-lg transition-all duration-300
                ${connectionStatus === 'success' 
                  ? 'hover:bg-yellow-500/20 hover:border-yellow-500/50' 
                  : 'hover:bg-slate-700/50'
                }
              `}
            >
              <ChevronUp className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Configuration Panel */}
      <div className="relative">
        {connectionStatus === 'success' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg blur-sm -z-10" />
        )}
        <SecureAPIConfig
          title={t('binance.api_config')}
          description={t('binance.config_description')}
          apiKeyLabel="API Key"
          secretKeyLabel="Secret Key"
          hasSecretKey={true}
          onConfigChange={(configured) => {
            setIsConfigured(configured);
            if (configured) {
              testConnection();
            } else {
              setConnectionStatus('idle');
            }
          }}
        />
      </div>
    </div>
  );
}