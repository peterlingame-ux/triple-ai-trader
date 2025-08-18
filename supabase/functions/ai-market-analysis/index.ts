import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, context } = await req.json();
    console.log('AI Market Analysis request:', { question, context });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create system prompt for market analysis
    const systemPrompt = `你是一个专业的加密货币和传统金融市场分析师AI助手。你拥有深度的技术分析、基本面分析和市场心理学知识。

你的任务是：
1. 基于用户的问题提供专业的市场分析
2. 给出具体的投资建议和风险评估
3. 解读技术指标、市场新闻和价格走势
4. 提供风险管理建议

回答要求：
- 提供具体可操作的建议
- 包含风险评估
- 基于技术和基本面分析
- 语言简洁专业，避免过于复杂的术语
- 始终提醒投资风险

当前上下文：${context || '用户在查看综合交易面板'}`;

    const userPrompt = `请分析以下问题：${question}

请按照以下JSON格式回答：
{
  "summary": "详细的分析摘要（200-300字）",
  "insights": ["关键洞察1", "关键洞察2", "关键洞察3"],
  "recommendations": ["具体建议1", "具体建议2", "具体建议3"],
  "riskLevel": "low/medium/high",
  "confidence": 85
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const aiContent = data.choices[0].message.content;
    
    // Parse JSON response
    let analysis;
    try {
      // Extract JSON from the response if it's wrapped in markdown
      const jsonMatch = aiContent.match(/```json\n?(.*?)\n?```/s) || aiContent.match(/\{.*\}/s);
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : aiContent;
      analysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback to a structured response
      analysis = {
        summary: aiContent,
        insights: ["AI分析结果已生成", "请查看详细摘要获取更多信息"],
        recommendations: ["建议根据个人风险承受能力制定投资策略", "密切关注市场变化"],
        riskLevel: "medium",
        confidence: 70
      };
    }

    // Validate and ensure proper structure
    if (!analysis.summary) analysis.summary = "AI分析已完成，请查看具体建议。";
    if (!Array.isArray(analysis.insights)) analysis.insights = ["分析结果已生成"];
    if (!Array.isArray(analysis.recommendations)) analysis.recommendations = ["请谨慎投资"];
    if (!analysis.riskLevel) analysis.riskLevel = "medium";
    if (!analysis.confidence) analysis.confidence = 70;

    console.log('Analysis completed successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      analysis 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-market-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});