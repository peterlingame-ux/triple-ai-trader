import React, { useState, useEffect } from 'react';
import { SecureAPIConfig } from './SecureAPIConfig';
import { BinanceRealIcon } from './BinanceRealIcon';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function BinanceAPIConfig() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Check if Binance API is configured
  useEffect(() => {
    const checkConfig = async () => {
      if (!isAuthenticated) return;
      
      try {
        const { data, error } = await supabase.functions.invoke('check-api-config', {
          body: { service: 'binance' }
        });
        
        if (!error && data?.configured) {
          setIsConfigured(true);
        } else {
          setIsConfigured(false);
        }
      } catch (error) {
        console.error('Failed to check API config:', error);
        setIsConfigured(false);
      }
    };

    checkConfig();
  }, [isAuthenticated]);

  const handleConfigChange = (configured: boolean) => {
    setIsConfigured(configured);
  };

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`relative ${isConfigured ? 'animate-pulse' : ''}`}>
                  <BinanceRealIcon 
                    symbol="BNB" 
                    size={32}
                    className={isConfigured ? 'ring-2 ring-primary/50 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : ''}
                  />
                  {isConfigured && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{t('binance.api_config')}</h3>
                  {!isOpen && (
                    <p className="text-sm text-muted-foreground">
                      {isConfigured ? '已配置' : t('binance.config_description')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isConfigured && (
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                )}
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            <SecureAPIConfig
              title={t('binance.api_config')}
              description={t('binance.config_description')}
              apiKeyLabel="API Key"
              secretKeyLabel="Secret Key"
              hasSecretKey={true}
              onConfigChange={handleConfigChange}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}