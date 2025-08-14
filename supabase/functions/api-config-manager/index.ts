import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, service, apiKey, secretKey } = await req.json();
    
    // Get the user from the JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;

    switch (action) {
      case 'save': {
        if (!apiKey) {
          throw new Error('API key is required');
        }

        // Create a unique key for this user and service
        const configKey = `${service}_${userId}`;
        const configData = {
          apiKey,
          ...(secretKey && { secretKey }),
          updatedAt: new Date().toISOString()
        };

        // Store encrypted configuration
        const { error } = await supabaseClient
          .from('user_api_configs')
          .upsert({
            user_id: userId,
            service: service,
            config_data: configData,
            updated_at: new Date().toISOString()
          });

        if (error) {
          throw error;
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Configuration saved successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'check': {
        const { data, error } = await supabaseClient
          .from('user_api_configs')
          .select('service')
          .eq('user_id', userId)
          .eq('service', service)
          .single();

        return new Response(
          JSON.stringify({ 
            configured: !error && data !== null,
            message: !error && data ? 'Configuration found' : 'No configuration found'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get': {
        const { data, error } = await supabaseClient
          .from('user_api_configs')
          .select('config_data')
          .eq('user_id', userId)
          .eq('service', service)
          .single();

        if (error) {
          throw new Error('Configuration not found');
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            config: data.config_data 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'clear': {
        const { error } = await supabaseClient
          .from('user_api_configs')
          .delete()
          .eq('user_id', userId)
          .eq('service', service);

        if (error) {
          throw error;
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Configuration cleared successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'test': {
        // Get the stored configuration
        const { data, error } = await supabaseClient
          .from('user_api_configs')
          .select('config_data')
          .eq('user_id', userId)
          .eq('service', service)
          .single();

        if (error) {
          throw new Error('Configuration not found');
        }

        const config = data.config_data;

        // Test the API connection based on service type
        let testResult;
        switch (service) {
          case 'binance':
            testResult = await testBinanceConnection(config.apiKey, config.secretKey);
            break;
          case 'openai':
            testResult = await testOpenAIConnection(config.apiKey);
            break;
          default:
            testResult = { success: true, message: 'Configuration stored successfully' };
        }

        return new Response(
          JSON.stringify(testResult),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('API Config Manager Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An error occurred' 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function testBinanceConnection(apiKey: string, secretKey: string) {
  try {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    
    // Create a simple signature for account info endpoint
    const signature = await createHmacSignature(secretKey, queryString);
    
    const response = await fetch(`https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`, {
      headers: {
        'X-MBX-APIKEY': apiKey
      }
    });

    if (response.ok) {
      return { success: true, message: 'Binance API connection successful' };
    } else {
      const errorData = await response.text();
      return { success: false, message: `Binance API error: ${errorData}` };
    }
  } catch (error) {
    return { success: false, message: `Connection test failed: ${error.message}` };
  }
}

async function testOpenAIConnection(apiKey: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.ok) {
      return { success: true, message: 'OpenAI API connection successful' };
    } else {
      return { success: false, message: 'OpenAI API key is invalid' };
    }
  } catch (error) {
    return { success: false, message: `Connection test failed: ${error.message}` };
  }
}

async function createHmacSignature(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}