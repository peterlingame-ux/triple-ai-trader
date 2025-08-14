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
    const { symbols, apiKey, secretKey, testnet = false } = await req.json()
    
    if (!apiKey || !secretKey) {
      return new Response(
        JSON.stringify({ error: 'API key and secret key are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const baseUrl = testnet ? BINANCE_TESTNET_URL : BINANCE_API_URL
    
    // 获取24小时价格变化统计
    const tickerResponse = await fetch(`${baseUrl}/ticker/24hr`)
    
    if (!tickerResponse.ok) {
      throw new Error(`Binance API error: ${tickerResponse.status}`)
    }
    
    const allTickers = await tickerResponse.json()
    
    // 过滤所需的交易对（转换为USDT对）
    const filteredData = symbols.map((symbol: string) => {
      // 处理特殊符号映射
      let tradingPair = symbol
      if (symbol === 'USDT' || symbol === 'USDC') {
        // 对于稳定币，使用BUSD作为参考
        tradingPair = 'BUSDUSDT'
      } else {
        tradingPair = `${symbol}USDT`
      }
      
      const ticker = allTickers.find((t: any) => t.symbol === tradingPair)
      
      if (ticker) {
        return {
          symbol,
          price: ticker.lastPrice,
          priceChange: ticker.priceChange,
          priceChangePercent: ticker.priceChangePercent,
          highPrice: ticker.highPrice,
          lowPrice: ticker.lowPrice,
          volume: ticker.volume,
          quoteVolume: ticker.quoteVolume,
          openTime: ticker.openTime,
          closeTime: ticker.closeTime,
          count: ticker.count
        }
      } else {
        // 如果找不到交易对，返回默认数据
        return {
          symbol,
          price: '0',
          priceChange: '0',
          priceChangePercent: '0',
          highPrice: '0',
          lowPrice: '0',
          volume: '0',
          quoteVolume: '0',
          openTime: Date.now() - 86400000,
          closeTime: Date.now(),
          count: 0
        }
      }
    })

    return new Response(
      JSON.stringify(filteredData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Binance API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch data from Binance API',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})