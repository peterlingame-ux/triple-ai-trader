import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield, CheckCircle, XCircle, Loader2, AlertTriangle, Edit, Save, X } from "lucide-react";
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
  service?: string;
  onConfigChange?: (isConfigured: boolean) => void;
}

export function SecureAPIConfig({ 
  title, 
  description, 
  apiKeyLabel, 
  secretKeyLabel = "Secret Key", 
  hasSecretKey = true,
  service = "binance_api_config",
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
  const [isEditing, setIsEditing] = useState(false);
  const [existingConfig, setExistingConfig] = useState<{apiKey?: string; secretKey?: string}>({});
  const [originalApiKey, setOriginalApiKey] = useState('');
  const [originalSecretKey, setOriginalSecretKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('SecureAPIConfig: User authenticated, checking configuration...');
      // 立即检查配置，不需要延迟
      checkConfiguration();
    }
  }, [isAuthenticated]);

  // 添加一个额外的效果来确保配置被正确加载
  useEffect(() => {
    if (isAuthenticated && !isConfigured) {
      console.log('SecureAPIConfig: Double-checking configuration status...');
      const timer = setTimeout(() => {
        checkConfiguration();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isConfigured]);

  const checkConfiguration = async () => {
    console.log('SecureAPIConfig: Checking configuration...');
    try {
      // 直接使用get方法来检查配置，这样更可靠
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'get',
          service: service 
        }
      });

      console.log('SecureAPIConfig: Get config result:', { data, error, hasConfig: !!data?.config });

      if (!error && data?.success && data?.config) {
        console.log('SecureAPIConfig: Configuration exists, setting up...');
        setIsConfigured(true);
        onConfigChange?.(true);
        
        // 设置脱敏的配置显示
        setExistingConfig({
          apiKey: data.config.apiKey ? maskApiKey(data.config.apiKey) : '',
          secretKey: data.config.secretKey ? maskSecretKey(data.config.secretKey) : ''
        });
        
        console.log('SecureAPIConfig: Component state updated to configured');
      } else {
        console.log('SecureAPIConfig: No configuration found');
        setIsConfigured(false);
        onConfigChange?.(false);
        setExistingConfig({});
      }
    } catch (error) {
      console.error('SecureAPIConfig: Error checking configuration:', error);
      setIsConfigured(false);
      onConfigChange?.(false);
    }
  };

  const loadExistingConfig = async () => {
    console.log('SecureAPIConfig: Loading existing config...');
    try {
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'get',
          service: service 
        }
      });

      console.log('SecureAPIConfig: Load config result:', { data, error });

      if (!error && data?.config) {
        const config = data.config;
        console.log('SecureAPIConfig: Config loaded successfully');
        setExistingConfig({
          apiKey: config.apiKey ? maskApiKey(config.apiKey) : '',
          secretKey: config.secretKey ? maskSecretKey(config.secretKey) : ''
        });
      }
    } catch (error) {
      console.error('SecureAPIConfig: Error loading existing configuration:', error);
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
  };

  const maskSecretKey = (key: string) => {
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.slice(0, 4) + '•'.repeat(key.length - 8) + key.slice(-4);
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
      const { error } = await supabase.functions.invoke('api-config-manager', {
        body: {
          action: 'save',
          service: service,
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
      setIsEditing(false);
      
      toast({
        title: "Configuration Saved",
        description: `${title} API configuration has been securely saved`,
      });

      // 重新加载配置信息
      await loadExistingConfig();
      // Test connection after saving
      testConnection();
    } catch (error: any) {
      console.error('Save config error:', error);
      
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

  const startEditing = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'get',
          service: service 
        }
      });

      if (!error && data?.config) {
        const config = data.config;
        setOriginalApiKey(config.apiKey || '');
        setOriginalSecretKey(config.secretKey || '');
        setApiKey(config.apiKey || '');
        setSecretKey(config.secretKey || '');
        setIsEditing(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load configuration for editing",
        variant: "destructive"
      });
    }
  };

  const cancelEditing = () => {
    setApiKey('');
    setSecretKey('');
    setIsEditing(false);
    setShowApiKey(false);
    setShowSecretKey(false);
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const { data, error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'test',
          service: service 
        }
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
      const { error } = await supabase.functions.invoke('api-config-manager', {
        body: { 
          action: 'clear',
          service: service 
        }
      });

      if (error) {
        throw error;
      }

      setIsConfigured(false);
      setConnectionStatus('idle');
      setIsEditing(false);
      setExistingConfig({});
      setApiKey('');
      setSecretKey('');
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
        {/* 始终显示调试信息以便排查问题 */}
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
          <div><strong>Debug Info:</strong></div>
          <div>• isConfigured: <span className={isConfigured ? 'text-green-600' : 'text-red-600'}>{isConfigured.toString()}</span></div>
          <div>• isEditing: {isEditing.toString()}</div>
          <div>• connectionStatus: {connectionStatus}</div>
          <div>• hasExistingConfig: {Object.keys(existingConfig).length > 0 ? 'yes' : 'no'}</div>
          <div>• authStatus: {isAuthenticated ? 'authenticated' : 'not authenticated'}</div>
        </div>
        
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
        ) : isEditing ? (
          <div className="space-y-4">
            <Alert>
              <Edit className="h-4 w-4" />
              <AlertDescription>
                Editing existing configuration. Leave fields unchanged to keep current values.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor={`${title}-edit-api-key`}>{apiKeyLabel}</Label>
              <div className="relative">
                <Input
                  id={`${title}-edit-api-key`}
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Update your ${apiKeyLabel.toLowerCase()}`}
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
                <Label htmlFor={`${title}-edit-secret-key`}>{secretKeyLabel}</Label>
                <div className="relative">
                  <Input
                    id={`${title}-edit-secret-key`}
                    type={showSecretKey ? "text" : "password"}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder={`Update your ${secretKeyLabel.toLowerCase()}`}
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

            <div className="flex gap-2">
              <Button onClick={handleSaveConfig} disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Update Configuration
              </Button>
              <Button onClick={cancelEditing} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                API configuration is active and securely encrypted.
              </AlertDescription>
            </Alert>

            {/* 显示现有配置信息（脱敏） */}
            <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{apiKeyLabel}:</span>
                <span className="text-sm font-mono text-muted-foreground">
                  {existingConfig.apiKey || '••••••••••••••••'}
                </span>
              </div>
              {hasSecretKey && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{secretKeyLabel}:</span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {existingConfig.secretKey || '••••••••••••••••'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={testConnection} variant="outline" className="flex-1">
                Test Connection
              </Button>
              <Button onClick={startEditing} variant="secondary">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button 
                onClick={() => {
                  console.log('Manual refresh triggered');
                  checkConfiguration();
                }} 
                variant="outline" 
                size="sm"
              >
                🔄 Refresh
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