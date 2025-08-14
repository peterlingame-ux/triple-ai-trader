import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

interface SecureAPIConfigProps {
  title: string;
  description: string;
  apiKeyLabel: string;
  secretKeyLabel?: string;
  hasSecretKey?: boolean;
  onConfigChange?: (isConfigured: boolean) => void;
}

export function SecureAPIConfig({ 
  title, 
  description, 
  apiKeyLabel, 
  secretKeyLabel = "Secret Key", 
  hasSecretKey = true,
  onConfigChange 
}: SecureAPIConfigProps) {
  const { t } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      checkConfiguration();
    }
  }, [isAuthenticated]);

  const checkConfiguration = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-api-config', {
        body: { service: title.toLowerCase().replace(' ', '_') }
      });

      if (!error && data?.configured) {
        setIsConfigured(true);
        onConfigChange?.(true);
      }
    } catch (error) {
      console.error('Error checking configuration:', error);
    }
  };

  const handleSaveConfig = async () => {
    if (!apiKey || (hasSecretKey && !secretKey)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('save-api-config', {
        body: {
          service: title.toLowerCase().replace(' ', '_'),
          apiKey,
          secretKey: hasSecretKey ? secretKey : undefined
        }
      });

      if (error) {
        throw error;
      }

      setIsConfigured(true);
      onConfigChange?.(true);
      setApiKey('');
      setSecretKey('');
      
      toast({
        title: "Configuration Saved",
        description: `${title} API configuration has been securely saved`,
      });

      // Test connection after saving
      testConnection();
    } catch (error: any) {
      console.error('Save config error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('Unauthorized') || error.message?.includes('needsLogin')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save API configuration",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Save Error",
          description: error.message || "Failed to save configuration",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const { data, error } = await supabase.functions.invoke('test-api-connection', {
        body: { service: title.toLowerCase().replace(' ', '_') }
      });

      if (error) {
        throw error;
      }

      setConnectionStatus(data.success ? 'success' : 'error');
      
      toast({
        title: data.success ? "Connection Successful" : "Connection Failed",
        description: data.message,
        variant: data.success ? "default" : "destructive"
      });
    } catch (error: any) {
      console.error('Test connection error:', error);
      setConnectionStatus('error');
      
      // Handle specific error cases
      if (error.message?.includes('Unauthorized') || error.message?.includes('needsLogin')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to test the connection",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Test Failed",
          description: error.message || "Failed to test connection",
          variant: "destructive"
        });
      }
    }
  };

  const clearConfiguration = async () => {
    try {
      const { error } = await supabase.functions.invoke('clear-api-config', {
        body: { service: title.toLowerCase().replace(' ', '_') }
      });

      if (error) {
        throw error;
      }

      setIsConfigured(false);
      setConnectionStatus('idle');
      onConfigChange?.(false);
      
      toast({
        title: "Configuration Cleared",
        description: `${title} API configuration has been removed`,
      });
    } catch (error: any) {
      toast({
        title: "Clear Error",
        description: error.message || "Failed to clear configuration",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'testing':
        return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Testing</Badge>;
      case 'success':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return isConfigured ? 
          <Badge variant="outline"><Shield className="w-3 h-3 mr-1" />Configured</Badge> : 
          <Badge variant="secondary">Not Configured</Badge>;
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {title} Configuration
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show login required state if not authenticated
  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {title} Configuration
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <Badge variant="secondary">{t('binance.login_required')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('binance.login_first')}
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {t('binance.api_secure_storage')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {title} Configuration
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConfigured ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${title}-api-key`}>{apiKeyLabel}</Label>
              <div className="relative">
                <Input
                  id={`${title}-api-key`}
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${apiKeyLabel.toLowerCase()}`}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {hasSecretKey && (
              <div className="space-y-2">
                <Label htmlFor={`${title}-secret-key`}>{secretKeyLabel}</Label>
                <div className="relative">
                  <Input
                    id={`${title}-secret-key`}
                    type={showSecretKey ? "text" : "password"}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder={`Enter your ${secretKeyLabel.toLowerCase()}`}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={handleSaveConfig} disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Configuration
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                API keys are securely encrypted and stored. Only authorized requests can access them.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button onClick={testConnection} variant="outline" className="flex-1">
                Test Connection
              </Button>
              <Button onClick={clearConfiguration} variant="destructive">
                Clear Config
              </Button>
            </div>
          </div>
        )}

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            🔒 Your API keys are encrypted and stored securely in Supabase. They are never stored in your browser or transmitted in plain text.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}