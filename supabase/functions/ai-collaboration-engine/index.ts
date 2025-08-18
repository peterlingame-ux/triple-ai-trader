import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AI Agent配置接口
interface AIAgentConfig {
  id: string;
  provider: 'openai' | 'claude' | 'perplexity' | 'grok' | 'gemini' | 'custom';
  model: string;
  apiKey: string;
  apiUrl?: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

// 协作任务接口
interface CollaborationTask {
  symbol: string;
  question: string;
  dataContext: any;
  agents: AIAgentConfig[];
  workflow: string;
  outputTemplate: string;
}

// AI响应接口
interface AIResponse {
  agentId: string;
  content: string;
  timestamp: number;
  success: boolean;
  error?: string;
}

serve(async (req) => {
  // 处理CORS预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { task }: { task: CollaborationTask } = await req.json();
    console.log('收到AI协作任务:', task);

    // 验证任务参数
    if (!task.symbol || !task.question || !task.agents?.length) {
      throw new Error('缺少必要的任务参数');
    }

    // 过滤启用的AI代理
    const enabledAgents = task.agents.filter(agent => agent.enabled && agent.apiKey);
    
    if (enabledAgents.length === 0) {
      throw new Error('没有可用的AI代理');
    }

    console.log(`开始协作分析，使用${enabledAgents.length}个AI代理`);

    // 并行调用所有AI代理
    const aiPromises = enabledAgents.map(async (agent): Promise<AIResponse> => {
      const startTime = Date.now();
      
      try {
        console.log(`调用${agent.id} (${agent.provider})...`);
        
        // 构建专业化的提示词
        const contextualPrompt = buildContextualPrompt(agent, task);
        
        const response = await callAIAPI(agent, contextualPrompt, task.dataContext);
        
        console.log(`${agent.id}分析完成，用时${Date.now() - startTime}ms`);
        
        return {
          agentId: agent.id,
          content: response,
          timestamp: Date.now(),
          success: true
        };
      } catch (error) {
        console.error(`${agent.id}分析失败:`, error);
        
        return {
          agentId: agent.id,
          content: `${agent.id}分析失败: ${error.message}`,
          timestamp: Date.now(),
          success: false,
          error: error.message
        };
      }
    });

    // 等待所有AI分析完成
    const aiResponses = await Promise.all(aiPromises);
    
    // 统计成功和失败的分析
    const successCount = aiResponses.filter(r => r.success).length;
    const failureCount = aiResponses.length - successCount;
    
    console.log(`协作分析完成: ${successCount}个成功, ${failureCount}个失败`);

    // 生成综合报告
    const finalReport = await generateCollaborativeReport(aiResponses, task);

    return new Response(JSON.stringify({
      success: true,
      data: {
        report: finalReport,
        agentResponses: aiResponses,
        statistics: {
          totalAgents: enabledAgents.length,
          successfulAgents: successCount,
          failedAgents: failureCount,
          analysisTime: Date.now() - (aiResponses[0]?.timestamp || Date.now())
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI协作引擎错误:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// 调用AI API
async function callAIAPI(agent: AIAgentConfig, prompt: string, context: any): Promise<string> {
  let response: Response;
  
  try {
    switch (agent.provider) {
      case 'openai':
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${agent.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: agent.model,
            messages: [
              { role: 'system', content: agent.systemPrompt },
              { role: 'user', content: `${prompt}\n\n数据: ${JSON.stringify(context)}` }
            ],
            temperature: agent.temperature,
            max_completion_tokens: agent.maxTokens
          }),
        });
        
        if (!response.ok) {
          throw new Error(`OpenAI API错误: ${response.status} ${response.statusText}`);
        }
        
        const openaiData = await response.json();
        return openaiData.choices[0].message.content;

      case 'claude':
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${agent.apiKey}`,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: agent.model,
            messages: [
              {
                role: 'user',
                content: `${agent.systemPrompt}\n\n${prompt}\n\n数据: ${JSON.stringify(context)}`
              }
            ],
            max_tokens: agent.maxTokens
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Claude API错误: ${response.status} ${response.statusText}`);
        }
        
        const claudeData = await response.json();
        return claudeData.content[0].text;

      case 'perplexity':
        response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${agent.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: agent.model,
            messages: [
              { role: 'system', content: agent.systemPrompt },
              { role: 'user', content: `${prompt}\n\n数据: ${JSON.stringify(context)}` }
            ],
            temperature: agent.temperature,
            max_tokens: agent.maxTokens,
            search_recency_filter: 'month',
            return_images: false
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Perplexity API错误: ${response.status} ${response.statusText}`);
        }
        
        const perplexityData = await response.json();
        return perplexityData.choices[0].message.content;

      case 'grok':
        response = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${agent.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: agent.model,
            messages: [
              { role: 'system', content: agent.systemPrompt },
              { role: 'user', content: `${prompt}\n\n数据: ${JSON.stringify(context)}` }
            ],
            temperature: agent.temperature,
            max_tokens: agent.maxTokens
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Grok API错误: ${response.status} ${response.statusText}`);
        }
        
        const grokData = await response.json();
        return grokData.choices[0].message.content;

      case 'gemini':
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${agent.model}:generateContent?key=${agent.apiKey}`;
        response = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${agent.systemPrompt}\n\n${prompt}\n\n数据: ${JSON.stringify(context)}`
              }]
            }],
            generationConfig: {
              temperature: agent.temperature,
              maxOutputTokens: agent.maxTokens
            }
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Gemini API错误: ${response.status} ${response.statusText}`);
        }
        
        const geminiData = await response.json();
        return geminiData.candidates[0].content.parts[0].text;

      case 'custom':
        if (!agent.apiUrl) {
          throw new Error('自定义API需要提供URL');
        }
        
        response = await fetch(agent.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${agent.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: agent.model,
            prompt: `${agent.systemPrompt}\n\n${prompt}`,
            context: context,
            temperature: agent.temperature,
            max_tokens: agent.maxTokens
          }),
        });
        
        if (!response.ok) {
          throw new Error(`自定义API错误: ${response.status} ${response.statusText}`);
        }
        
        const customData = await response.json();
        return customData.response || customData.content || customData.text || JSON.stringify(customData);

      default:
        throw new Error(`不支持的AI提供商: ${agent.provider}`);
    }
  } catch (error) {
    console.error(`AI API调用失败 (${agent.provider}):`, error);
    throw error;
  }
}

// 构建上下文化的提示词
function buildContextualPrompt(agent: AIAgentConfig, task: CollaborationTask): string {
  const rolePrompts = {
    'coordinator': `作为AI协作系统的总协调员，请基于以下问题进行综合分析决策：
问题: ${task.question}
交易对: ${task.symbol}

请提供：
1. 综合分析结论
2. 投资建议和风险评估
3. 具体的操作建议`,

    'technical_analyst': `作为专业技术分析师，请分析${task.symbol}的技术面：
问题: ${task.question}

请提供：
1. 技术指标分析（RSI、MACD、KDJ等）
2. 支撑阻力位分析
3. 图表形态识别
4. 短期趋势预测`,

    'news_researcher': `作为新闻研究员，请搜索和分析${task.symbol}的最新市场动态：
问题: ${task.question}

请提供：
1. 最新相关新闻和事件
2. 基本面分析
3. 市场影响评估
4. 监管和政策影响`,

    'sentiment_analyst': `作为市场情绪分析师，请分析${task.symbol}的市场情绪：
问题: ${task.question}

请提供：
1. 社交媒体情绪分析
2. 恐慌贪婪指数评估
3. 散户情绪分析
4. 市场情绪对价格的影响预测`,

    'chart_analyst': `作为图表分析师，请分析${task.symbol}的价格图表：
问题: ${task.question}

请提供：
1. K线形态分析
2. 成交量分析
3. 关键价格点位识别
4. 图表形态的交易信号`,

    'custom_specialist': `作为专业分析师，请针对${task.symbol}进行专业分析：
问题: ${task.question}

请根据您的专业领域提供深度分析和建议。`
  };

  return rolePrompts[agent.id as keyof typeof rolePrompts] || `请分析${task.symbol}并回答：${task.question}`;
}

// 生成协作报告
async function generateCollaborativeReport(responses: AIResponse[], task: CollaborationTask): Promise<string> {
  const successfulResponses = responses.filter(r => r.success);
  const failedResponses = responses.filter(r => !r.success);
  
  let report = `# 🤖 AI协作分析报告 - ${task.symbol}\n\n`;
  report += `**分析时间**: ${new Date().toLocaleString('zh-CN')}\n`;
  report += `**分析问题**: ${task.question}\n`;
  report += `**参与AI数量**: ${responses.length} (成功: ${successfulResponses.length}, 失败: ${failedResponses.length})\n\n`;

  if (successfulResponses.length > 0) {
    report += `## 📊 专业分析结果\n\n`;
    
    // 按角色分组显示结果
    const roleNames = {
      'coordinator': '🎯 总协调员',
      'technical_analyst': '📈 技术分析师', 
      'news_researcher': '📰 新闻研究员',
      'sentiment_analyst': '😊 情绪分析师',
      'chart_analyst': '📋 图表分析师',
      'custom_specialist': '🔧 自定义专家'
    };
    
    successfulResponses.forEach(response => {
      const roleName = roleNames[response.agentId as keyof typeof roleNames] || response.agentId;
      report += `### ${roleName}\n`;
      report += `${response.content}\n\n`;
    });
  }

  if (failedResponses.length > 0) {
    report += `## ⚠️ 分析异常\n\n`;
    failedResponses.forEach(response => {
      report += `- **${response.agentId}**: ${response.error}\n`;
    });
    report += `\n`;
  }

  // 生成综合评估
  if (successfulResponses.length >= 3) {
    report += `## 🎯 综合评估\n\n`;
    report += `基于${successfulResponses.length}个AI专家的协作分析，以下是综合评估：\n\n`;
    report += `**市场信号强度**: ${'★'.repeat(Math.min(5, successfulResponses.length))}\n`;
    report += `**分析可信度**: ${Math.round((successfulResponses.length / responses.length) * 100)}%\n`;
    report += `**建议操作**: 请综合考虑以上所有专业分析\n\n`;
  }

  report += `---\n`;
  report += `*本报告由AI协作引擎生成，仅供参考，投资有风险*`;

  return report;
}