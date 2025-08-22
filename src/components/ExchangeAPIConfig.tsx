import React, { useState, useEffect, memo, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, CheckCircle, Shield, Settings, XCircle } from "lucide-react";
import { SecureAPIConfig } from './SecureAPIConfig';
import { BinanceExchangeLogo } from './BinanceExchangeLogo';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// OKX Logo Component
const OKXLogo = ({ size = 48, showGlow = false, className = "" }) => (
  <div className={`relative ${className}`}>
    <div 
      className={`
        rounded-lg flex items-center justify-center font-bold text-white
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

interface ExchangeConfig {
  id: string;
  name: string;
  logo: React.ReactNode;
  service: string;
  primaryColor: string;
  accentColor: string;
}

const exchanges: ExchangeConfig[] = [
  {
    id: 'binance',
    name: 'Binance',
    logo: <BinanceExchangeLogo size={48} />,
    service: 'binance_api_config',
    primaryColor: 'yellow',
    accentColor: 'amber'
  },
  {
    id: 'okx',
    name: 'OKX',
    logo: <OKXLogo size={48} />,
    service: 'okx',
    primaryColor: 'blue',
    accentColor: 'blue'
  }
];

export const ExchangeAPIConfig = memo(() => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeExchange, setActiveExchange] = useState('binance');
  const [exchangeStatus, setExchangeStatus] = useState<Record<string, {
    isConfigured: boolean;
    connectionStatus: 'idle' | 'testing' | 'success' | 'error';
  }>>({
    binance: { isConfigured: false, connectionStatus: 'idle' },
    okx: { isConfigured: false, connectionStatus: 'idle' }
  });

  const updateExchangeStatus = useCallback((exchangeId: string, updates: Partial<typeof exchangeStatus.binance>) => {
    setExchangeStatus(prev => ({
      ...prev,
      [exchangeId]: { ...prev[exchangeId], ...updates }
    }));
  }, []);

  const checkConfiguration = useCallback(async (exchangeId: string, service: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'check',
          service: service 
        }
      });

      if (!error && data?.configured) {
        updateExchangeStatus(exchangeId, { isConfigured: true });
        testConnection(exchangeId, service);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Error checking ${exchangeId} configuration:`, error);
      }
    }
  }, [updateExchangeStatus]);

  const testConnection = useCallback(async (exchangeId: string, service: string) => {
    updateExchangeStatus(exchangeId, { connectionStatus: 'testing' });
    try {
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'test',
          service: service 
        }
      });

      if (!error) {
        updateExchangeStatus(exchangeId, { 
          connectionStatus: data.success ? 'success' : 'error' 
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`${exchangeId} test connection error:`, error);
      }
      updateExchangeStatus(exchangeId, { connectionStatus: 'error' });
    }
  }, [updateExchangeStatus]);

  useEffect(() => {
    if (isAuthenticated) {
      exchanges.forEach(exchange => {
        checkConfiguration(exchange.id, exchange.service);
      });
    }
  }, [isAuthenticated, checkConfiguration]);

  const getStatusBadge = (exchangeId: string) => {
    const status = exchangeStatus[exchangeId];
    const exchange = exchanges.find(ex => ex.id === exchangeId);
    
    if (!isAuthenticated) {
      return (
        <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs px-3 py-1">
          需要登录
        </Badge>
      );
    }

    if (!status.isConfigured) {
      return (
        <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs px-3 py-1">
          未配置
        </Badge>
      );
    }
    
    switch (status.connectionStatus) {
      case 'testing':
        return (
          <Badge variant="outline" className={`bg-${exchange?.primaryColor}-500/10 text-${exchange?.primaryColor}-400 border-${exchange?.primaryColor}-500/30 text-xs px-3 py-1 animate-pulse`}>
            <div className={`w-2 h-2 rounded-full bg-${exchange?.primaryColor}-400 animate-spin mr-2`} />
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
          <Badge variant="outline" className={`bg-${exchange?.primaryColor}-500/10 text-${exchange?.primaryColor}-400 border-${exchange?.primaryColor}-500/30 text-xs px-3 py-1`}>
            <Shield className="w-3 h-3 mr-2" />
            已配置
          </Badge>
        );
    }
  };

  const getActiveExchangeConfig = () => exchanges.find(ex => ex.id === activeExchange);
  const activeConfig = getActiveExchangeConfig();
  const activeStatus = exchangeStatus[activeExchange];

  // Summary view when collapsed
  const getOverallStatus = () => {
    const configuredCount = Object.values(exchangeStatus).filter(status => status.isConfigured).length;
    const successCount = Object.values(exchangeStatus).filter(status => status.connectionStatus === 'success').length;
    
    if (successCount > 0) return 'success';
    if (configuredCount > 0) return 'configured';
    return 'unconfigured';
  };

  const overallStatus = getOverallStatus();

  // Collapsed view
  if (!isExpanded) {
    return (
      <Card 
        className={`
          bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 
          border-slate-600/50 backdrop-blur-xl cursor-pointer transition-all duration-500 
          hover:shadow-2xl
          ${overallStatus === 'success' ? 'border-green-500/50 shadow-lg shadow-green-500/20 hover:shadow-green-500/30' : 
            overallStatus === 'configured' ? 'border-blue-500/50 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30' : 
            'hover:border-blue-500/30'}
        `}
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Combined Exchange Logos */}
              <div className="flex items-center gap-2">
                {exchanges.map((exchange, index) => {
                  const status = exchangeStatus[exchange.id];
                  const isSuccess = status.connectionStatus === 'success';
                  
                  return (
                    <div 
                      key={exchange.id}
                      className={`
                        relative p-2 rounded-xl border transition-all duration-500
                        ${isSuccess 
                          ? `bg-gradient-to-br from-${exchange.primaryColor}-500/20 to-${exchange.accentColor}-500/20 border-${exchange.primaryColor}-500/40 shadow-lg shadow-${exchange.primaryColor}-500/30` 
                          : 'bg-gradient-to-br from-slate-700/30 to-slate-600/30 border-slate-600/50'
                        }
                        ${index > 0 ? '-ml-2' : ''}
                      `}
                      style={{ zIndex: exchanges.length - index }}
                    >
                      {React.cloneElement(exchange.logo as React.ReactElement, {
                        size: 32,
                        showGlow: isSuccess,
                        className: "flex-shrink-0"
                      })}
                      {isSuccess && (
                        <>
                          <div className="absolute inset-0 rounded-xl bg-green-400/10 animate-pulse" />
                          <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r from-${exchange.primaryColor}-500/20 to-${exchange.accentColor}-500/20 blur-sm -z-10`} />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground font-orbitron tracking-wide">
                    交易所 API 配置
                  </h3>
                  {overallStatus === 'success' && isAuthenticated && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-green-400/60 animate-pulse" style={{animationDelay: '0.5s'}} />
                      <div className="w-2 h-2 rounded-full bg-green-400/30 animate-pulse" style={{animationDelay: '1s'}} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {overallStatus === 'success' ? (
                    <Badge variant="default" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/40 text-xs px-3 py-1 shadow-lg shadow-green-500/20">
                      <CheckCircle className="w-3 h-3 mr-2" />
                      多交易所已连接
                    </Badge>
                  ) : overallStatus === 'configured' ? (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs px-3 py-1">
                      <Shield className="w-3 h-3 mr-2" />
                      部分已配置
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600/50 text-xs px-3 py-1">
                      {isAuthenticated ? "未配置" : "需要登录"}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {isAuthenticated ? "配置多个交易所 API 以获取最佳数据覆盖" : "请先登录以配置 API"}
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
                  ${overallStatus === 'success' && isAuthenticated
                    ? 'hover:bg-green-500/20 hover:border-green-500/50' 
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
                  ${overallStatus === 'success' && isAuthenticated
                    ? 'hover:bg-green-500/20 hover:border-green-500/50' 
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
      {/* Header when expanded */}
      <Card 
        className={`
          bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 
          border-slate-600/50 backdrop-blur-xl cursor-pointer transition-all duration-500
          ${overallStatus === 'success' ? 'border-green-500/50 shadow-lg shadow-green-500/20' : 'hover:border-green-500/30'}
        `}
        onClick={() => setIsExpanded(false)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {exchanges.map((exchange, index) => {
                  const status = exchangeStatus[exchange.id];
                  const isSuccess = status.connectionStatus === 'success';
                  
                  return (
                    <div 
                      key={exchange.id}
                      className={`
                        relative p-2 rounded-xl border transition-all duration-500
                        ${isSuccess 
                          ? `bg-gradient-to-br from-${exchange.primaryColor}-500/20 to-${exchange.accentColor}-500/20 border-${exchange.primaryColor}-500/40` 
                          : 'bg-gradient-to-br from-slate-700/30 to-slate-600/30 border-slate-600/50'
                        }
                        ${index > 0 ? '-ml-2' : ''}
                      `}
                      style={{ zIndex: exchanges.length - index }}
                    >
                      {React.cloneElement(exchange.logo as React.ReactElement, {
                        size: 32,
                        showGlow: isSuccess,
                        className: "flex-shrink-0"
                      })}
                      {isSuccess && (
                        <>
                          <div className="absolute inset-0 rounded-xl bg-green-400/10 animate-pulse" />
                          <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r from-${exchange.primaryColor}-500/20 to-${exchange.accentColor}-500/20 blur-sm -z-10`} />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground font-orbitron tracking-wide">
                    交易所 API 配置
                  </h3>
                  {overallStatus === 'success' && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-green-400/60 animate-pulse" style={{animationDelay: '0.5s'}} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {overallStatus === 'success' ? (
                    <Badge variant="default" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/40 text-xs px-3 py-1 shadow-lg shadow-green-500/20">
                      <CheckCircle className="w-3 h-3 mr-2" />
                      多交易所已连接
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs px-3 py-1">
                      <Shield className="w-3 h-3 mr-2" />
                      配置中
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">点击收起配置面板</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`
                h-10 w-10 p-0 rounded-lg transition-all duration-300
                ${overallStatus === 'success' 
                  ? 'hover:bg-green-500/20 hover:border-green-500/50' 
                  : 'hover:bg-slate-700/50'
                }
              `}
            >
              <ChevronUp className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Configuration Panel with Tabs */}
      <div className="relative">
        {overallStatus === 'success' && (
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg blur-sm -z-10" />
        )}
        
        <Card className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border-slate-600/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <Tabs value={activeExchange} onValueChange={setActiveExchange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-600/30">
                {exchanges.map((exchange) => {
                  const status = exchangeStatus[exchange.id];
                  const isSuccess = status.connectionStatus === 'success';
                  
                  return (
                    <TabsTrigger 
                      key={exchange.id} 
                      value={exchange.id}
                      className={`
                        relative flex items-center gap-2 px-4 py-3 transition-all duration-300
                        data-[state=active]:bg-slate-700/80 data-[state=active]:text-foreground
                        ${isSuccess ? `data-[state=active]:shadow-lg data-[state=active]:shadow-${exchange.primaryColor}-500/20` : ''}
                      `}
                    >
                      {React.cloneElement(exchange.logo as React.ReactElement, {
                        size: 20,
                        showGlow: false,
                        className: "flex-shrink-0"
                      })}
                      <span className="font-medium">{exchange.name}</span>
                      {status.isConfigured && (
                        <div className={`w-2 h-2 rounded-full ${isSuccess ? 'bg-green-400' : 'bg-blue-400'} animate-pulse ml-1`} />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              {exchanges.map((exchange) => (
                <TabsContent key={exchange.id} value={exchange.id} className="mt-6">
                  <div className="space-y-4">
                    {/* Exchange specific status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {React.cloneElement(exchange.logo as React.ReactElement, {
                          size: 40,
                          showGlow: exchangeStatus[exchange.id].connectionStatus === 'success',
                          className: "flex-shrink-0"
                        })}
                        <div>
                          <h4 className="font-bold text-foreground">{exchange.name} API 配置</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(exchange.id)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Configuration form */}
                    <SecureAPIConfig
                      title={`${exchange.name} API 配置`}
                      description={`配置您的 ${exchange.name} API 密钥以获取实时市场数据和交易信息`}
                      apiKeyLabel="API Key"
                      secretKeyLabel="Secret Key"
                      hasSecretKey={true}
                      service={exchange.service}
                      onConfigChange={(configured) => {
                        updateExchangeStatus(exchange.id, { isConfigured: configured });
                        if (configured) {
                          testConnection(exchange.id, exchange.service);
                        } else {
                          updateExchangeStatus(exchange.id, { connectionStatus: 'idle' });
                        }
                      }}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

ExchangeAPIConfig.displayName = "ExchangeAPIConfig";