import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, CheckCircle, Shield, Settings } from "lucide-react";
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
    if (!isConfigured) {
      return <Badge variant="secondary" className="text-xs">未配置</Badge>;
    }
    
    switch (connectionStatus) {
      case 'success':
        return <Badge variant="default" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />登录成功
        </Badge>;
      case 'error':
        return <Badge variant="destructive" className="text-xs">连接失败</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">
          <Shield className="w-3 h-3 mr-1" />已配置
        </Badge>;
    }
  };

  // Collapsed view
  if (!isExpanded) {
    return (
      <Card 
        className="bg-gradient-to-br from-slate-900/60 via-blue-950/50 to-slate-900/60 border-slate-700/50 backdrop-blur-xl cursor-pointer hover:border-yellow-500/30 transition-all duration-300"
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BinanceExchangeLogo 
                size={40} 
                showGlow={connectionStatus === 'success'} 
                className="flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-foreground text-sm">Binance API 配置</h3>
                {getStatusBadge()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Expanded view
  return (
    <div className="space-y-2">
      {/* Collapsed header when expanded */}
      <Card 
        className="bg-gradient-to-br from-slate-900/60 via-blue-950/50 to-slate-900/60 border-slate-700/50 backdrop-blur-xl cursor-pointer hover:border-yellow-500/30 transition-all duration-300"
        onClick={() => setIsExpanded(false)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BinanceExchangeLogo 
                size={40} 
                showGlow={connectionStatus === 'success'} 
                className="flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-foreground text-sm">Binance API 配置</h3>
                {getStatusBadge()}
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full configuration panel */}
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
  );
}