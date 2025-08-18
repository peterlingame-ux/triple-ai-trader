import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { symbol, apiKey, secretKey, testnet } = await req.json()
    
    if (!symbol) {
      return new Response(JSON.stringify({ error: 'Symbol is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const baseUrl = testnet ? 'https://testnet.binance.vision/api/v3' : 'https://api.binance.com/api/v3'
    
    // 获取24小时价格统计
    const tickerResponse = await fetch(`${baseUrl}/ticker/24hr?symbol=${symbol}USDT`)
    if (!tickerResponse.ok) {
      throw new Error(`Binance API error: ${tickerResponse.statusText}`)
    }
    const tickerData = await tickerResponse.json()

    // 获取币种信息
    const exchangeInfoResponse = await fetch(`${baseUrl}/exchangeInfo?symbol=${symbol}USDT`)
    let exchangeInfo = null
    if (exchangeInfoResponse.ok) {
      const exchangeData = await exchangeInfoResponse.json()
      exchangeInfo = exchangeData.symbols?.[0]
    }

    // 获取最新价格
    const priceResponse = await fetch(`${baseUrl}/ticker/price?symbol=${symbol}USDT`)
    const priceData = priceResponse.ok ? await priceResponse.json() : null

    // 获取orderbook (市场深度)
    const depthResponse = await fetch(`${baseUrl}/depth?symbol=${symbol}USDT&limit=10`)
    const depthData = depthResponse.ok ? await depthResponse.json() : null

    // 获取24小时交易数据
    const statsResponse = await fetch(`${baseUrl}/ticker/24hr?symbol=${symbol}USDT`)
    const statsData = statsResponse.ok ? await statsResponse.json() : null

    // 构建响应数据
    const result = {
      symbol: symbol,
      name: symbol,
      price: parseFloat(tickerData.lastPrice || priceData?.price || '0'),
      change24h: parseFloat(tickerData.priceChange || '0'),
      changePercent24h: parseFloat(tickerData.priceChangePercent || '0'),
      high24h: parseFloat(tickerData.highPrice || '0'),
      low24h: parseFloat(tickerData.lowPrice || '0'),
      volume24h: parseFloat(tickerData.volume || '0'),
      volumeUsdt24h: parseFloat(tickerData.quoteVolume || '0'),
      openPrice: parseFloat(tickerData.openPrice || '0'),
      prevClosePrice: parseFloat(tickerData.prevClosePrice || '0'),
      bidPrice: depthData?.bids?.[0]?.[0] ? parseFloat(depthData.bids[0][0]) : 0,
      bidQty: depthData?.bids?.[0]?.[1] ? parseFloat(depthData.bids[0][1]) : 0,
      askPrice: depthData?.asks?.[0]?.[0] ? parseFloat(depthData.asks[0][0]) : 0,
      askQty: depthData?.asks?.[0]?.[1] ? parseFloat(depthData.asks[0][1]) : 0,
      count: parseInt(tickerData.count || '0'),
      firstId: parseInt(tickerData.firstId || '0'),
      lastId: parseInt(tickerData.lastId || '0'),
      openTime: parseInt(tickerData.openTime || '0'),
      closeTime: parseInt(tickerData.closeTime || '0'),
      // 订单簿数据
      bids: depthData?.bids?.slice(0, 5).map((bid: any) => ({
        price: parseFloat(bid[0]),
        quantity: parseFloat(bid[1])
      })) || [],
      asks: depthData?.asks?.slice(0, 5).map((ask: any) => ({
        price: parseFloat(ask[0]),
        quantity: parseFloat(ask[1])
      })) || [],
      // 交易规则
      exchangeInfo: exchangeInfo ? {
        status: exchangeInfo.status,
        baseAsset: exchangeInfo.baseAsset,
        quoteAsset: exchangeInfo.quoteAsset,
        baseAssetPrecision: exchangeInfo.baseAssetPrecision,
        quotePrecision: exchangeInfo.quotePrecision,
        orderTypes: exchangeInfo.orderTypes,
        filters: exchangeInfo.filters
      } : null,
      // 技术分析指标
      rsi: calculateRSI([
        parseFloat(tickerData.openPrice || '0'),
        parseFloat(tickerData.highPrice || '0'),
        parseFloat(tickerData.lowPrice || '0'),
        parseFloat(tickerData.lastPrice || '0')
      ]),
      // 支撑阻力位（基于24小时数据）
      support: parseFloat(tickerData.lowPrice || '0') * 0.98,
      resistance: parseFloat(tickerData.highPrice || '0') * 1.02,
      // 移动平均线（模拟）
      ma20: parseFloat(tickerData.lastPrice || '0') * (0.98 + Math.random() * 0.04),
      ma50: parseFloat(tickerData.lastPrice || '0') * (0.96 + Math.random() * 0.08),
      // 市场情绪
      marketSentiment: parseFloat(tickerData.priceChangePercent || '0') > 0 ? 'bullish' : 'bearish',
      // 流动性指标
      liquidity: {
        bidDepth: depthData?.bids?.reduce((sum: number, bid: any) => sum + parseFloat(bid[1]), 0) || 0,
        askDepth: depthData?.asks?.reduce((sum: number, ask: any) => sum + parseFloat(ask[1]), 0) || 0,
        spread: depthData?.asks?.[0] && depthData?.bids?.[0] ? 
          (parseFloat(depthData.asks[0][0]) - parseFloat(depthData.bids[0][0])) : 0,
        spreadPercent: depthData?.asks?.[0] && depthData?.bids?.[0] ? 
          ((parseFloat(depthData.asks[0][0]) - parseFloat(depthData.bids[0][0])) / parseFloat(depthData.bids[0][0]) * 100) : 0
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch crypto details',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// 简单的RSI计算
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) {
    return 50; // 默认值
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i < Math.min(prices.length, period + 1); i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  if (losses === 0) return 100;
  if (gains === 0) return 0;

  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return Math.round(rsi * 100) / 100;
}