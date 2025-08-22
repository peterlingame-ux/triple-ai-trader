import React, { useState, useEffect, memo, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, CheckCircle, Shield, Settings, XCircle } from "lucide-react";
import { SecureAPIConfig } from './SecureAPIConfig';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// OKX Logo Component
const OKXLogo = ({ size = 48, showGlow = false, className = "" }) => (
  <div className={`relative ${className}`}>
    <div 
      className={`
        w-${Math.floor(size/4)} h-${Math.floor(size/4)} rounded-lg flex items-center justify-center font-bold text-white
        ${showGlow ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50' : 'bg-gradient-to-br from-slate-600 to-slate-700'}
      `}
      style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size/3}px` }}
    >
      OKX
    </div>
    {showGlow && (
      <>
        <div className="absolute inset-0 rounded-lg bg-blue-400/20 animate-pulse" />
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/30 to-blue-600/30 blur-sm -z-10" />
      </>
    )}
  </div>
);

export const OKXAPIConfig = memo(() => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const checkConfiguration = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'check',
          service: 'okx' 
        }
      });

      if (!error && data?.configured) {
        setIsConfigured(true);
        testConnection();
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error checking OKX configuration:', error);
      }
    }
  }, []);

  const testConnection = useCallback(async () => {
    setConnectionStatus('testing');
    try {
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'test',
          service: 'okx' 
        }
      });

      if (!error) {
        setConnectionStatus(data.success ? 'success' : 'error');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('OKX test connection error:', error);
      }
      setConnectionStatus('error');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      checkConfiguration();
    }
  }, [isAuthenticated, checkConfiguration]);

  const getStatusBadge = () => {
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
            连接成功
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
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs px-3 py-1">
            <Shield className="w-3 h-3 mr-2" />
            已配置
          </Badge>
        );
    }
  };

  // Collapsed view
  if (!isExpanded) {
    return (
      <Card 
        className={`
          bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 
          border-slate-600/50 backdrop-blur-xl cursor-pointer transition-all duration-500 
          hover:shadow-2xl hover:shadow-blue-500/10
          ${connectionStatus === 'success' ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' : 'hover:border-blue-500/30'}
        `}
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`
                relative p-3 rounded-xl border transition-all duration-500
                ${connectionStatus === 'success' 
                  ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/40 shadow-lg shadow-blue-500/30' 
                  : 'bg-gradient-to-br from-slate-700/30 to-slate-600/30 border-slate-600/50'
                }
              `}>
                <OKXLogo 
                  size={48} 
                  showGlow={connectionStatus === 'success'} 
                  className="flex-shrink-0"
                />
                {connectionStatus === 'success' && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-blue-400/10 animate-pulse" />
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 blur-sm -z-10" />
                    <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 blur-md -z-20" />
                  </>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground font-orbitron tracking-wide">
                    OKX API 配置
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
                    {isAuthenticated ? "配置您的 OKX API 以获取实时交易数据" : "请先登录以配置 API"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`
                  h-10 w-10 p-0 rounded-lg transition-all duration-300
                  ${connectionStatus === 'success' && isAuthenticated
                    ? 'hover:bg-blue-500/20 hover:border-blue-500/50' 
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
                    ? 'hover:bg-blue-500/20 hover:border-blue-500/50' 
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

  // Expanded view
  return (
    <div className="space-y-4">
      <Card 
        className={`
          bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 
          border-slate-600/50 backdrop-blur-xl cursor-pointer transition-all duration-500
          ${connectionStatus === 'success' ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' : 'hover:border-blue-500/30'}
        `}
        onClick={() => setIsExpanded(false)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`
                relative p-3 rounded-xl border transition-all duration-500
                ${connectionStatus === 'success' 
                  ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/40' 
                  : 'bg-gradient-to-br from-slate-700/30 to-slate-600/30 border-slate-600/50'
                }
              `}>
                <OKXLogo 
                  size={48} 
                  showGlow={connectionStatus === 'success'} 
                  className="flex-shrink-0"
                />
                {connectionStatus === 'success' && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-blue-400/10 animate-pulse" />
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 blur-sm -z-10" />
                  </>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground font-orbitron tracking-wide">
                    OKX API 配置
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
                  ? 'hover:bg-blue-500/20 hover:border-blue-500/50' 
                  : 'hover:bg-slate-700/50'
                }
              `}
            >
              <ChevronUp className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        {connectionStatus === 'success' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg blur-sm -z-10" />
        )}
        <SecureAPIConfig
          title="OKX API 配置"
          description="配置您的 OKX API 密钥以获取实时市场数据和交易信息"
          apiKeyLabel="API Key"
          secretKeyLabel="Secret Key"
          hasSecretKey={true}
          service="okx"
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
});

OKXAPIConfig.displayName = "OKXAPIConfig";