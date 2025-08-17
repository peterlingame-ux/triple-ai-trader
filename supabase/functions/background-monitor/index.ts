import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserSettings {
  user_id: string;
  super_brain_monitoring: boolean;
  auto_trading_enabled: boolean;
  trading_strategy: 'conservative' | 'aggressive';
  max_positions: number;
  risk_per_trade: number;
  virtual_balance: number;
  monitoring_symbols: string[];
}

interface SuperBrainSignal {
  symbol: string;
  action: 'buy' | 'sell';
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  reasoning: string;
  position: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 获取所有启用监控的用户设置
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('super_brain_monitoring', true)

    if (settingsError) {
      console.error('Error fetching user settings:', settingsError)
      return new Response(JSON.stringify({ error: 'Failed to fetch settings' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!userSettings || userSettings.length === 0) {
      return new Response(JSON.stringify({ message: 'No active monitoring users' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`Found ${userSettings.length} users with active monitoring`)

    // 为每个用户执行监控
    for (const settings of userSettings as UserSettings[]) {
      await processUserMonitoring(supabase, settings)
    }

    return new Response(JSON.stringify({ 
      message: 'Background monitoring completed',
      processed_users: userSettings.length 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Background monitor error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function processUserMonitoring(supabase: any, settings: UserSettings) {
  try {
    console.log(`Processing monitoring for user: ${settings.user_id}`)
    
    // 获取超级大脑分析结果
    const { data: analysisResult, error: analysisError } = await supabase.functions.invoke('super-brain-analysis', {
      body: { symbols: settings.monitoring_symbols }
    })

    if (analysisError) {
      console.error(`Analysis error for user ${settings.user_id}:`, analysisError)
      return
    }

    if (!analysisResult || !analysisResult.signal) {
      console.log(`No signal generated for user ${settings.user_id}`)
      return
    }

    const signal: SuperBrainSignal = analysisResult.signal

    // 如果启用了自动交易，检查是否满足交易条件
    if (settings.auto_trading_enabled) {
      await processAutoTrading(supabase, settings, signal)
    }

  } catch (error) {
    console.error(`Error processing user ${settings.user_id}:`, error)
  }
}

async function processAutoTrading(supabase: any, settings: UserSettings, signal: SuperBrainSignal) {
  try {
    const minConfidence = settings.trading_strategy === 'conservative' ? 90 : 70
    
    // 检查信号置信度是否满足策略要求
    if (signal.confidence < minConfidence) {
      console.log(`Signal confidence ${signal.confidence}% below threshold ${minConfidence}% for user ${settings.user_id}`)
      return
    }

    // 检查当前持仓数量
    const { data: currentTrades, error: tradesError } = await supabase
      .from('virtual_trades')
      .select('id')
      .eq('user_id', settings.user_id)
      .eq('status', 'open')

    if (tradesError) {
      console.error(`Error checking trades for user ${settings.user_id}:`, tradesError)
      return
    }

    if (currentTrades && currentTrades.length >= settings.max_positions) {
      console.log(`Max positions reached for user ${settings.user_id}`)
      return
    }

    // 计算仓位大小
    const riskAmount = (settings.virtual_balance * settings.risk_per_trade) / 100
    const stopLossDistance = Math.abs(signal.entry - signal.stopLoss)
    const positionSize = stopLossDistance > 0 ? riskAmount / stopLossDistance : riskAmount / signal.entry * 0.02

    // 创建新的交易记录
    const { error: insertError } = await supabase
      .from('virtual_trades')
      .insert({
        user_id: settings.user_id,
        symbol: signal.symbol,
        action: signal.action,
        entry_price: signal.entry,
        stop_loss: signal.stopLoss,
        take_profit: signal.takeProfit,
        position_size: positionSize,
        confidence: signal.confidence,
        strategy: settings.trading_strategy,
        reasoning: signal.reasoning,
        status: 'open'
      })

    if (insertError) {
      console.error(`Error creating trade for user ${settings.user_id}:`, insertError)
      return
    }

    console.log(`✅ Auto trade created for user ${settings.user_id}: ${signal.action} ${signal.symbol} at ${signal.entry}`)

    // 更新虚拟余额（减去使用的资金）
    const { error: balanceError } = await supabase
      .from('user_settings')
      .update({ 
        virtual_balance: settings.virtual_balance - (positionSize * signal.entry)
      })
      .eq('user_id', settings.user_id)

    if (balanceError) {
      console.error(`Error updating balance for user ${settings.user_id}:`, balanceError)
    }

  } catch (error) {
    console.error(`Auto trading error for user ${settings.user_id}:`, error)
  }
}