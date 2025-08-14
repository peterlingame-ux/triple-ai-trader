import React from 'react';
import { SecureAPIConfig } from './SecureAPIConfig';

export function AIConfigPanel() {
  return (
    <div className="space-y-6">
      <SecureAPIConfig
        title="OpenAI API"
        description="Configure your OpenAI API key for AI-powered trading analysis"
        apiKeyLabel="API Key"
        hasSecretKey={false}
      />
      
      <SecureAPIConfig
        title="Claude API"
        description="Configure your Anthropic Claude API key for advanced AI analysis"
        apiKeyLabel="API Key"
        hasSecretKey={false}
      />
    </div>
  );
}