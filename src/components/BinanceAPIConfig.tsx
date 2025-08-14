import React from 'react';
import { SecureAPIConfig } from './SecureAPIConfig';
import { useLanguage } from '@/hooks/useLanguage';

export function BinanceAPIConfig() {
  const { t } = useLanguage();
  
  return (
    <SecureAPIConfig
      title={t('binance.api_config')}
      description={t('binance.config_description')}
      apiKeyLabel="API Key"
      secretKeyLabel="Secret Key"
      hasSecretKey={true}
    />
  );
}