import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

interface MarketData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  high: string;
  low: string;
  openPrice: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json();
    console.log('获取币安市场数据，交易对:', symbols);

    if (!symbols || !Array.isArray(symbols)) {
      throw new Error('symbols参数必须是数组');
    }

    const marketData: MarketData[] = [];

    // 获取24小时价格统计
    for (const symbol of symbols) {
      try {
        const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`);
        
        if (!response.ok) {
          console.error(`获取 ${symbol} 数据失败:`, response.status);
          continue;
        }

        const data = await response.json();
        
        marketData.push({
          symbol: data.symbol,
          price: data.lastPrice,
          priceChange: data.priceChange,
          priceChangePercent: data.priceChangePercent,
          volume: data.volume,
          high: data.highPrice,
          low: data.lowPrice,
          openPrice: data.openPrice
        });

        console.log(`${symbol} 数据:`, {
          price: data.lastPrice,
          change: data.priceChangePercent
        });

      } catch (error) {
        console.error(`获取 ${symbol} 市场数据错误:`, error);
      }
    }

    // 获取订单簿数据（深度）
    const depthData = {};
    for (const symbol of symbols) {
      try {
        const response = await fetch(`${BINANCE_API_BASE}/depth?symbol=${symbol}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          depthData[symbol] = {
            bids: data.bids.slice(0, 5), // 前5档买单
            asks: data.asks.slice(0, 5)  // 前5档卖单
          };
        }
      } catch (error) {
        console.error(`获取 ${symbol} 深度数据错误:`, error);
      }
    }

    console.log('成功获取市场数据，数量:', marketData.length);

    return new Response(JSON.stringify({
      success: true,
      marketData,
      depthData,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('币安市场数据API错误:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});