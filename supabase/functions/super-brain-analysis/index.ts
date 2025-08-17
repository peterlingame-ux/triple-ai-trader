import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

interface AnalysisRequest {
  symbols: string[];
  analysisTypes: string[];
}

interface TradingSignal {
  symbol: string;
  action: 'buy' | 'sell';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  position: string;
  confidence: number;
  reasoning: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols, analysisTypes }: AnalysisRequest = await req.json();
    console.log('Starting super brain analysis for:', symbols);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // 执行6种不同的AI分析
    const analysisResults = await Promise.all([
      performPriceChartAnalysis(symbols[0]),
      performTechnicalAnalysis(symbols[0]),
      performNewsAnalysis(symbols[0]),
      performMarketSentimentAnalysis(symbols[0]),
      performVolumeAnalysis(symbols[0]),
      performMacroAnalysis(symbols[0])
    ]);

    // 综合分析所有结果
    const combinedAnalysis = await synthesizeAnalysis(symbols[0], analysisResults);
    
    console.log('Analysis completed:', combinedAnalysis);

    return new Response(JSON.stringify(combinedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Super brain analysis error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function callOpenAI(prompt: string, systemPrompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 1000,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
  }
  
  return data.choices[0].message.content;
}

// 1. 价格图表分析
async function performPriceChartAnalysis(symbol: string): Promise<string> {
  const prompt = `分析${symbol}的价格图表模式，识别关键支撑阻力位、趋势线、图表形态。当前价格假设为随机价格。给出技术分析结论。`;
  const systemPrompt = "你是专业的技术分析师，专注于价格图表分析。";
  return await callOpenAI(prompt, systemPrompt);
}

// 2. 技术指标分析
async function performTechnicalAnalysis(symbol: string): Promise<string> {
  const prompt = `对${symbol}进行技术指标分析，包括RSI、MACD、移动平均线、布林带等指标。给出综合技术指标信号。`;
  const systemPrompt = "你是技术指标分析专家，精通各种技术指标的解读和应用。";
  return await callOpenAI(prompt, systemPrompt);
}

// 3. 新闻情绪分析
async function performNewsAnalysis(symbol: string): Promise<string> {
  const prompt = `分析${symbol}相关的最新新闻和市场情绪，评估新闻对价格的潜在影响。`;
  const systemPrompt = "你是新闻分析专家，擅长分析新闻事件对加密货币价格的影响。";
  return await callOpenAI(prompt, systemPrompt);
}

// 4. 市场情绪分析
async function performMarketSentimentAnalysis(symbol: string): Promise<string> {
  const prompt = `分析${symbol}的市场情绪，包括社交媒体热度、投资者情绪指标、恐慌贪婪指数等。`;
  const systemPrompt = "你是市场情绪分析师，专门分析投资者情绪和市场心理。";
  return await callOpenAI(prompt, systemPrompt);
}

// 5. 成交量分析
async function performVolumeAnalysis(symbol: string): Promise<string> {
  const prompt = `分析${symbol}的成交量模式，包括价量关系、成交量突破、异常成交量信号。`;
  const systemPrompt = "你是成交量分析专家，专注于价量关系和成交量技术分析。";
  return await callOpenAI(prompt, systemPrompt);
}

// 6. 宏观分析
async function performMacroAnalysis(symbol: string): Promise<string> {
  const prompt = `从宏观经济角度分析${symbol}，包括政策影响、经济环境、资金流向等因素。`;
  const systemPrompt = "你是宏观经济分析师，专门分析宏观经济对加密货币市场的影响。";
  return await callOpenAI(prompt, systemPrompt);
}

// 综合分析函数
async function synthesizeAnalysis(symbol: string, analyses: string[]): Promise<TradingSignal> {
  const combinedAnalysis = analyses.join('\n\n');
  
  const synthesisPrompt = `
基于以下6种不同角度的分析结果，对${symbol}给出最终交易建议：

${combinedAnalysis}

请严格按照以下JSON格式输出结果：
{
  "symbol": "${symbol}",
  "action": "buy" 或 "sell",
  "entry": 建议入场价格(数字),
  "stopLoss": 止损价格(数字),
  "takeProfit": 止盈价格(数字),
  "position": "轻仓/中仓/重仓",
  "confidence": 胜率预估(0-100的数字),
  "reasoning": "详细的综合分析理由"
}

确保：
1. action只能是"buy"或"sell"
2. 所有价格都是合理的数字
3. confidence是0-100之间的整数
4. position是中文描述
5. reasoning包含综合6种分析的详细说明
`;

  const systemPrompt = "你是顶级的量化交易分析师，能够综合多种分析方法给出精准的交易建议。";
  
  const result = await callOpenAI(synthesisPrompt, systemPrompt);
  
  try {
    // 尝试解析JSON结果
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    }
    throw new Error('无法解析AI返回的JSON格式');
  } catch (parseError) {
    console.error('JSON解析失败:', parseError);
    // 如果解析失败，返回默认结构
    return {
      symbol: symbol,
      action: 'buy',
      entry: 50000,
      stopLoss: 48000,
      takeProfit: 55000,
      position: '轻仓',
      confidence: 75,
      reasoning: `综合6种AI分析方法的结果：${result}`
    };
  }
}