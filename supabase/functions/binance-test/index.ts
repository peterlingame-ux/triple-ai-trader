import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const BINANCE_API_URL = 'https://api.binance.com/api/v3'
const BINANCE_TESTNET_URL = 'https://testnet.binance.vision/api/v3'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { apiKey, secretKey, testnet = false } = await req.json()
    
    if (!apiKey || !secretKey) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'API key and secret key are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const baseUrl = testnet ? BINANCE_TESTNET_URL : BINANCE_API_URL
    
    // 测试API连接 - 获取账户信息
    const timestamp = Date.now()
    const queryString = `timestamp=${timestamp}`
    
    // 生成签名（简化版本，实际生产环境需要完整的HMAC-SHA256签名）
    const crypto = await import('node:crypto')
    const signature = crypto.createHmac('sha256', secretKey)
      .update(queryString)
      .digest('hex')
    
    const testUrl = `${baseUrl}/account?${queryString}&signature=${signature}`
    
    const response = await fetch(testUrl, {
      headers: {
        'X-MBX-APIKEY': apiKey
      }
    })
    
    if (response.ok) {
      const accountInfo = await response.json()
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Binance API connection successful',
          permissions: accountInfo.permissions || ['SPOT'],
          accountType: accountInfo.accountType || 'SPOT',
          canTrade: accountInfo.canTrade || false,
          canWithdraw: accountInfo.canWithdraw || false,
          canDeposit: accountInfo.canDeposit || false
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      // API密钥无效或其他错误
      const errorData = await response.json().catch(() => ({ msg: 'Unknown error' }))
      
      return new Response(
        JSON.stringify({
          success: false,
          error: `Binance API Error: ${response.status}`,
          details: errorData.msg || errorData.message || 'Invalid API credentials'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Binance API Test Error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to test Binance API connection',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})