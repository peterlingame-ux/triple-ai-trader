import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SuperBrainSignal, TradingAlert } from "@/types/trading";
import { DEFAULT_MONITORING_SYMBOLS, ANALYSIS_TYPES, TRADING_CONFIG } from "@/constants/trading";

// 统一的信号处理逻辑
export const useSignalProcessor = () => {
  const { toast } = useToast();

  // 调用SuperBrain分析API
  const callSuperBrainAPI = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('super-brain-analysis', {
        body: {
          symbols: DEFAULT_MONITORING_SYMBOLS,
          analysisTypes: ANALYSIS_TYPES
        }
      });

      if (error) {
        console.error('Super Brain Analysis API Error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Super Brain Analysis Error:', error);
      return null;
    }
  }, []);

  // 转换API数据为TradingAlert格式
  const convertToTradingAlert = useCallback((data: any): TradingAlert | null => {
    if (!data) return null;

    const confidence = data.confidence;
    const stopLossRequired = confidence < 90;
    
    // 根据胜率计算参数
    let positionRatio = 10;
    let safetyFactor = 5;
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    
    if (confidence >= 95) {
      positionRatio = 25;
      safetyFactor = 9;
      riskLevel = 'low';
    } else if (confidence >= 90) {
      positionRatio = 20;
      safetyFactor = 8;
      riskLevel = 'low';
    } else if (confidence >= 85) {
      positionRatio = 15;
      safetyFactor = 7;
      riskLevel = 'medium';
    } else {
      positionRatio = 8;
      safetyFactor = 5;
      riskLevel = 'high';
    }

    return {
      id: Date.now().toString(),
      symbol: data.symbol,
      type: 'comprehensive_analysis',
      confidence: data.confidence,
      signal: data.action === 'buy' ? 'buy' : 'sell',
      price: data.entry,
      analysis: {
        priceAnalysis: `💰 ${data.symbol}: ${data.action === 'buy' ? '买多' : '买空'}`,
        technicalAnalysis: `🎯 入场: $${data.entry.toLocaleString()} | 止损: $${data.stopLoss.toLocaleString()} | 止盈: $${data.takeProfit.toLocaleString()}`,
        sentimentAnalysis: data.reasoning
      },
      alerts: [],
      timestamp: new Date(),
      tradingDetails: {
        entry: data.entry,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        position: data.position,
        reasoning: data.reasoning,
        firstTakeProfit: Math.round(data.entry * (data.action === 'buy' ? 1.05 : 0.95)),
        secondTakeProfit: data.takeProfit,
        positionRatio,
        stopLossRequired,
        safetyFactor,
        riskLevel,
        leverage: confidence >= 95 ? '20x' : confidence >= 90 ? '15x' : '10x',
        liquidationSafety: confidence >= 95 ? 5 : confidence >= 90 ? 4 : 3,
        canAddPosition: !stopLossRequired,
        addPositionRange: !stopLossRequired ? {
          min: Math.round(data.entry * (data.action === 'buy' ? 0.97 : 1.03)),
          max: Math.round(data.entry * (data.action === 'buy' ? 0.94 : 1.06))
        } : null
      }
    };
  }, []);

  // 转换TradingAlert为SuperBrainSignal
  const convertToSignal = useCallback((alert: TradingAlert): SuperBrainSignal => {
    return {
      symbol: alert.symbol,
      action: alert.signal,
      confidence: alert.confidence,
      entry: alert.tradingDetails?.entry || alert.price,
      stopLoss: alert.tradingDetails?.stopLoss || (alert.signal === 'buy' ? (alert.price * 0.95) : (alert.price * 1.05)),
      takeProfit: alert.tradingDetails?.takeProfit || (alert.signal === 'buy' ? (alert.price * 1.10) : (alert.price * 0.90)),
      reasoning: alert.tradingDetails?.reasoning || alert.analysis?.priceAnalysis || `AI综合分析：${alert.symbol}${alert.signal === 'buy' ? '买入' : '卖出'}信号，胜率${alert.confidence}%`,
      timestamp: alert.timestamp
    };
  }, []);

  // 发送信号事件
  const dispatchSignal = useCallback((signal: SuperBrainSignal) => {
    console.log('🔥 准备发送信号给AutoTrader:', signal);
    
    // 发送给AutoTrader的事件
    const autoTradeEvent = new CustomEvent('superBrainSignal', {
      detail: signal
    });
    
    // 立即发送事件
    window.dispatchEvent(autoTradeEvent);
    console.log('📡 superBrainSignal事件已发送');
    
    // 延迟再发送一次确保接收
    setTimeout(() => {
      window.dispatchEvent(autoTradeEvent);
      console.log('📡 superBrainSignal事件已重发（延迟确保）');
    }, 100);
    
    console.log('📡 最强大脑信号已发送给AI自动交易:', signal);
  }, []);

  // 显示通知
  const showNotification = useCallback((alert: TradingAlert) => {
    toast({
      title: '发现高胜率机会',
      description: `${alert.symbol} ${alert.signal === 'buy' ? '买入信号' : '卖出信号'}，胜率${alert.confidence}%`,
      duration: 15000,
    });
  }, [toast]);

  return {
    callSuperBrainAPI,
    convertToTradingAlert,
    convertToSignal,
    dispatchSignal,
    showNotification
  };
};