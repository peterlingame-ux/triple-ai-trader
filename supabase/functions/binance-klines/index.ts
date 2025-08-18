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
    const { symbol, interval, limit = 500, apiKey, secretKey, testnet = false } = await req.json()
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const baseUrl = testnet ? BINANCE_TESTNET_URL : BINANCE_API_URL
    
    // 构建交易对符号
    let tradingPair = symbol
    if (symbol === 'USDT' || symbol === 'USDC') {
      tradingPair = 'BUSDUSDT'
    } else {
      tradingPair = `${symbol}USDT`
    }
    
    // 获取K线数据
    const klinesUrl = `${baseUrl}/klines?symbol=${tradingPair}&interval=${interval}&limit=${limit}`
    console.log('Fetching klines from:', klinesUrl)
    
    const klinesResponse = await fetch(klinesUrl)
    
    if (!klinesResponse.ok) {
      throw new Error(`Binance Klines API error: ${klinesResponse.status} - ${klinesResponse.statusText}`)
    }
    
    const klinesData = await klinesResponse.json()
    
    // 转换K线数据格式
    const formattedData = klinesData.map((kline: any[]) => ({
      time: Math.floor(kline[0] / 1000), // 转换为秒级时间戳
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      closeTime: kline[6],
      quoteVolume: parseFloat(kline[7]),
      trades: kline[8],
      buyBaseVolume: parseFloat(kline[9]),
      buyQuoteVolume: parseFloat(kline[10])
    }))

    // 计算技术指标
    const technicalIndicators = calculateTechnicalIndicators(formattedData)

    return new Response(
      JSON.stringify({
        symbol: tradingPair,
        interval,
        klines: formattedData,
        technicalIndicators,
        lastUpdate: Date.now()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Binance Klines API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch klines data from Binance API',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// 计算技术指标
function calculateTechnicalIndicators(klines: any[]) {
  if (klines.length === 0) return {}
  
  const closes = klines.map(k => k.close)
  const highs = klines.map(k => k.high)
  const lows = klines.map(k => k.low)
  const volumes = klines.map(k => k.volume)
  
  // RSI计算
  const rsi14 = calculateRSI(closes, 14)
  
  // 移动平均线
  const ma5 = calculateMA(closes, 5)
  const ma10 = calculateMA(closes, 10)
  const ma20 = calculateMA(closes, 20)
  const ma50 = calculateMA(closes, 50)
  
  // MACD
  const macd = calculateMACD(closes)
  
  // 布林带
  const bollinger = calculateBollingerBands(closes, 20, 2)
  
  // KDJ
  const kdj = calculateKDJ(highs, lows, closes, 9, 3, 3)
  
  const latestIndex = closes.length - 1
  
  return {
    rsi: rsi14[latestIndex] || 50,
    ma5: ma5[latestIndex] || closes[latestIndex],
    ma10: ma10[latestIndex] || closes[latestIndex],
    ma20: ma20[latestIndex] || closes[latestIndex],
    ma50: ma50[latestIndex] || closes[latestIndex],
    macd: macd.macd[latestIndex] || 0,
    macdSignal: macd.signal[latestIndex] || 0,
    macdHistogram: macd.histogram[latestIndex] || 0,
    bollingerUpper: bollinger.upper[latestIndex] || closes[latestIndex],
    bollingerMiddle: bollinger.middle[latestIndex] || closes[latestIndex],
    bollingerLower: bollinger.lower[latestIndex] || closes[latestIndex],
    kdj_k: kdj.k[latestIndex] || 50,
    kdj_d: kdj.d[latestIndex] || 50,
    kdj_j: kdj.j[latestIndex] || 50,
    volume: volumes[latestIndex] || 0
  }
}

// RSI计算
function calculateRSI(prices: number[], period: number): number[] {
  const rsi: number[] = []
  const gains: number[] = []
  const losses: number[] = []
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? Math.abs(change) : 0)
  }
  
  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
    const rs = avgGain / (avgLoss || 1)
    rsi.push(100 - (100 / (1 + rs)))
  }
  
  return rsi
}

// 移动平均线计算
function calculateMA(prices: number[], period: number): number[] {
  const ma: number[] = []
  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    ma.push(sum / period)
  }
  return ma
}

// MACD计算
function calculateMACD(prices: number[]) {
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)
  const macd = ema12.map((val, i) => val - ema26[i])
  const signal = calculateEMA(macd, 9)
  const histogram = macd.map((val, i) => val - (signal[i] || 0))
  
  return { macd, signal, histogram }
}

// EMA计算
function calculateEMA(prices: number[], period: number): number[] {
  const multiplier = 2 / (period + 1)
  const ema: number[] = []
  ema[0] = prices[0]
  
  for (let i = 1; i < prices.length; i++) {
    ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1]
  }
  
  return ema
}

// 布林带计算
function calculateBollingerBands(prices: number[], period: number, multiplier: number) {
  const ma = calculateMA(prices, period)
  const upper: number[] = []
  const middle: number[] = []
  const lower: number[] = []
  
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1)
    const mean = slice.reduce((a, b) => a + b, 0) / period
    const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period
    const std = Math.sqrt(variance)
    
    middle.push(mean)
    upper.push(mean + (std * multiplier))
    lower.push(mean - (std * multiplier))
  }
  
  return { upper, middle, lower }
}

// KDJ计算
function calculateKDJ(highs: number[], lows: number[], closes: number[], period: number, k_period: number, d_period: number) {
  const k: number[] = []
  const d: number[] = []
  const j: number[] = []
  
  for (let i = period - 1; i < closes.length; i++) {
    const highSlice = highs.slice(i - period + 1, i + 1)
    const lowSlice = lows.slice(i - period + 1, i + 1)
    
    const highest = Math.max(...highSlice)
    const lowest = Math.min(...lowSlice)
    
    const rsv = ((closes[i] - lowest) / (highest - lowest)) * 100 || 50
    
    const prevK = k[k.length - 1] || 50
    const currentK = (2 * prevK + rsv) / 3
    k.push(currentK)
    
    const prevD = d[d.length - 1] || 50
    const currentD = (2 * prevD + currentK) / 3
    d.push(currentD)
    
    const currentJ = 3 * currentK - 2 * currentD
    j.push(currentJ)
  }
  
  return { k, d, j }
}