import React from 'react';
import { SecureAPIConfig } from './SecureAPIConfig';

export function BinanceAPIConfig() {
  return (
    <SecureAPIConfig
      title="Binance API"
      description="Configure your Binance API credentials for secure trading data access"
      apiKeyLabel="API Key"
      secretKeyLabel="Secret Key"
      hasSecretKey={true}
    />
  );
}