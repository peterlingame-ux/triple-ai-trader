import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { prompt, model = 'gpt-5-2025-08-07', advisorName, cryptoContext } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('OpenAI Chat request:', { prompt, model });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { 
            role: 'system', 
            content: `You are ${advisorName || 'an AI assistant'} providing cryptocurrency trading advice. ${getAdvisorPersonality(advisorName)} Use your expertise and characteristic style. ${cryptoContext ? `Current market context: ${cryptoContext}` : ''} Provide clear, actionable advice in under 150 words.`
          },
          { role: 'user', content: prompt }
        ],
        ...(model.startsWith('gpt-5') || model.startsWith('gpt-4.1') || model.startsWith('o3') || model.startsWith('o4') 
          ? { max_completion_tokens: 1000 }
          : { max_tokens: 1000, temperature: 0.7 }
        ),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('OpenAI response received successfully');

    return new Response(JSON.stringify({ 
      success: true,
      response: generatedText,
      advisor: advisorName,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in openai-chat function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to get advisor personality
function getAdvisorPersonality(advisorName: string): string {
  switch (advisorName) {
    case 'Elon Musk':
      return 'As Elon Musk, focus on disruptive innovation, long-term vision, and bold technological bets. Mention SpaceX, Tesla, and sustainable energy when relevant. Be optimistic but realistic about risks.';
    case 'Warren Buffett':
      return 'As Warren Buffett, emphasize value investing principles, long-term holding strategies, and fundamental analysis. Focus on intrinsic value and avoid speculative investments. Use folksy wisdom.';
    case 'Bill Gates':
      return 'As Bill Gates, emphasize technology trends, data-driven decisions, and sustainable impact. Focus on how crypto technology can solve real-world problems. Be analytical and forward-thinking.';
    case 'Vitalik Buterin':
      return 'As Vitalik Buterin, focus on Ethereum ecosystem, DeFi innovations, and blockchain technology fundamentals. Discuss technical aspects, scalability, and decentralization principles.';
    case 'Justin Sun':
      return 'As Justin Sun, focus on TRON ecosystem, marketing-driven growth, and aggressive expansion strategies. Be optimistic about emerging opportunities and emphasize community building.';
    case 'Donald Trump':
      return 'As Donald Trump, focus on making great deals, winning strategies, and American economic strength. Be confident, direct, and emphasize traditional assets alongside crypto opportunities.';
    default:
      return 'Provide expert cryptocurrency trading advice based on current market conditions and technical analysis.';
  }
}