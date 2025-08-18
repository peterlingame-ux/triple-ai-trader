import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { question, symbol, chartData, marketData } = await req.json();

    console.log('Chart AI Analysis Request:', { question, symbol, chartData, marketData });

    // 构建AI分析的上下文信息
    const context = {
      symbol: symbol || 'Unknown',
      currentPrice: chartData?.price || marketData?.price || 0,
      change24h: chartData?.change24h || marketData?.change24h || 0,
      volume24h: chartData?.volume24h || marketData?.volume24h || 0,
      high24h: chartData?.high24h || marketData?.high24h || 0,
      low24h: chartData?.low24h || marketData?.low24h || 0,
      marketCap: marketData?.marketCap || 0,
      technicalIndicators: chartData?.technicalIndicators || {}
    };

    const systemPrompt = `你是一个专业的加密货币图表分析AI助手。你能够：

1. 分析TradingView图表数据和技术指标
2. 提供专业的技术分析建议
3. 解读市场趋势和价格行为
4. 给出具体的交易建议和风险提示
5. 回答用户关于图表的任何问题

当前分析的交易对：${context.symbol}
当前价格���$${context.currentPrice}
24小时变化：${context.change24h}%
24小时成交量：$${context.volume24h}
24小时最高价：$${context.high24h}
24小时最低价：$${context.low24h}

请用专业而易懂的中文回答用户问题，提供有价值的分析和建议。如果涉及交易建议，请务必提醒风险。`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `用户问题：${question}\n\n图表数据：${JSON.stringify(context, null, 2)}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response generated successfully');

    return new Response(JSON.stringify({ 
      success: true,
      response: aiResponse,
      context: context
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chart-ai-analysis function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});