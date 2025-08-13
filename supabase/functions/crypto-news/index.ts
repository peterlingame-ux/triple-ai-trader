import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  impact?: 'high' | 'medium' | 'low';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Fetch crypto news from CoinGecko API (free tier)
    const newsResponse = await fetch('https://api.coingecko.com/api/v3/news')
    const newsData = await newsResponse.json()
    
    // Alternative: CryptoPanic API for more comprehensive news
    const cryptoPanicResponse = await fetch('https://cryptopanic.com/api/free/v1/posts/?auth_token=free&filter=hot&currencies=BTC,ETH,SOL')
    const cryptoPanicData = await cryptoPanicResponse.json()
    
    // Process and combine news data
    const processedNews = []
    
    // Add CoinGecko news
    if (newsData.data) {
      newsData.data.slice(0, 10).forEach((article: any) => {
        processedNews.push({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.thumb_2x,
          publishedAt: article.updated_at,
          source: { name: 'CoinGecko' },
          sentiment: analyzeSentiment(article.title + ' ' + article.description),
          impact: analyzeImpact(article.title)
        })
      })
    }
    
    // Add CryptoPanic news
    if (cryptoPanicData.results) {
      cryptoPanicData.results.slice(0, 15).forEach((article: any) => {
        processedNews.push({
          title: article.title,
          description: '',
          url: article.url,
          urlToImage: '',
          publishedAt: article.published_at,
          source: { name: article.source.title },
          sentiment: article.kind === 'news' ? 'neutral' : 
                    article.votes?.positive > article.votes?.negative ? 'bullish' : 'bearish',
          impact: article.votes?.important ? 'high' : 'medium'
        })
      })
    }
    
    // Sort by published date
    processedNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    
    return new Response(JSON.stringify(processedNews.slice(0, 20)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching crypto news:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch crypto news' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function analyzeSentiment(text: string): 'bullish' | 'bearish' | 'neutral' {
  const bullishWords = ['surge', 'rise', 'up', 'gain', 'positive', 'bull', 'moon', 'pump', 'rally', 'breakthrough']
  const bearishWords = ['drop', 'fall', 'down', 'loss', 'negative', 'bear', 'crash', 'dump', 'decline', 'plunge']
  
  const lowerText = text.toLowerCase()
  const bullishCount = bullishWords.filter(word => lowerText.includes(word)).length
  const bearishCount = bearishWords.filter(word => lowerText.includes(word)).length
  
  if (bullishCount > bearishCount) return 'bullish'
  if (bearishCount > bullishCount) return 'bearish'
  return 'neutral'
}

function analyzeImpact(title: string): 'high' | 'medium' | 'low' {
  const highImpactWords = ['etf', 'regulation', 'sec', 'fed', 'government', 'adoption', 'institutional', 'blackrock']
  const mediumImpactWords = ['partnership', 'upgrade', 'launch', 'listing', 'whale', 'volume']
  
  const lowerTitle = title.toLowerCase()
  
  if (highImpactWords.some(word => lowerTitle.includes(word))) return 'high'
  if (mediumImpactWords.some(word => lowerTitle.includes(word))) return 'medium'
  return 'low'
}