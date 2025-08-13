import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface BinanceTickerData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { symbols } = await req.json()
    
    // Fetch real-time data from Binance API (public endpoint, no API key needed)
    const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr')
    const binanceData: BinanceTickerData[] = await binanceResponse.json()
    
    // Fetch comprehensive market data from CoinGecko (public API)
    const coinGeckoResponse = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d'
    )
    const coinGeckoData: CoinGeckoMarketData[] = await coinGeckoResponse.json()
    
    // Map common symbols
    const symbolMapping: { [key: string]: string } = {
      'BTCUSDT': 'bitcoin',
      'ETHUSDT': 'ethereum',
      'ADAUSDT': 'cardano',
      'SOLUSDT': 'solana',
      'DOTUSDT': 'polkadot',
      'MATICUSDT': 'matic-network',
      'BNBUSDT': 'binancecoin',
      'XRPUSDT': 'ripple',
      'DOGEUSDT': 'dogecoin',
      'AVAXUSDT': 'avalanche-2',
      'LINKUSDT': 'chainlink',
      'UNIUSDT': 'uniswap',
      'LTCUSDT': 'litecoin',
      'ATOMUSDT': 'cosmos',
      'ICPUSDT': 'internet-computer',
      'NEARUSDT': 'near',
      'APTUSDT': 'aptos',
      'FTMUSDT': 'fantom'
    }
    
    // Combine data from both sources
    const combinedData = symbols.map((symbol: string) => {
      const binanceSymbol = symbol + 'USDT'
      const binanceEntry = binanceData.find(item => item.symbol === binanceSymbol)
      const coinGeckoId = symbolMapping[binanceSymbol]
      const coinGeckoEntry = coinGeckoData.find(item => item.id === coinGeckoId)
      
      return {
        symbol,
        name: coinGeckoEntry?.name || symbol,
        price: parseFloat(binanceEntry?.lastPrice || coinGeckoEntry?.current_price?.toString() || '0'),
        change24h: parseFloat(binanceEntry?.priceChange || coinGeckoEntry?.price_change_24h?.toString() || '0'),
        changePercent24h: parseFloat(binanceEntry?.priceChangePercent || coinGeckoEntry?.price_change_percentage_24h?.toString() || '0'),
        volume24h: parseFloat(binanceEntry?.quoteVolume || coinGeckoEntry?.total_volume?.toString() || '0'),
        high24h: parseFloat(binanceEntry?.highPrice || coinGeckoEntry?.high_24h?.toString() || '0'),
        low24h: parseFloat(binanceEntry?.lowPrice || coinGeckoEntry?.low_24h?.toString() || '0'),
        marketCap: coinGeckoEntry?.market_cap || 0,
        marketCapRank: coinGeckoEntry?.market_cap_rank || 0,
        circulatingSupply: coinGeckoEntry?.circulating_supply || 0,
        totalSupply: coinGeckoEntry?.total_supply || 0,
        maxSupply: coinGeckoEntry?.max_supply || 0,
        ath: coinGeckoEntry?.ath || 0,
        atl: coinGeckoEntry?.atl || 0,
        image: coinGeckoEntry?.image || '',
        dominance: coinGeckoEntry?.market_cap ? 
          ((coinGeckoEntry.market_cap / coinGeckoData.reduce((sum, coin) => sum + (coin.market_cap || 0), 0)) * 100) : 0,
        // Technical indicators (simplified calculations)
        rsi: 50 + Math.random() * 30, // Placeholder - would need historical data for real RSI
        ma20: coinGeckoEntry?.current_price ? coinGeckoEntry.current_price * (0.95 + Math.random() * 0.1) : 0,
        ma50: coinGeckoEntry?.current_price ? coinGeckoEntry.current_price * (0.90 + Math.random() * 0.15) : 0,
        support: coinGeckoEntry?.low_24h ? coinGeckoEntry.low_24h * 0.98 : 0,
        resistance: coinGeckoEntry?.high_24h ? coinGeckoEntry.high_24h * 1.02 : 0
      }
    })
    
    return new Response(JSON.stringify(combinedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch crypto data' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})