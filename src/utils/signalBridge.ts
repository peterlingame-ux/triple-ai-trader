// 简单的信号桥接器 - 确保SuperBrainDetection和AutoTrader能通信
import { SuperBrainSignal } from "@/types/trading";

class SignalBridge {
  private handlers: Array<(signal: SuperBrainSignal) => void> = [];
  
  // 注册处理器
  registerHandler(handler: (signal: SuperBrainSignal) => void) {
    console.log('🔌 注册信号处理器');
    this.handlers.push(handler);
  }
  
  // 移除处理器
  unregisterHandler(handler: (signal: SuperBrainSignal) => void) {
    console.log('🔌 移除信号处理器');
    this.handlers = this.handlers.filter(h => h !== handler);
  }
  
  // 发送信号
  sendSignal(signal: SuperBrainSignal) {
    console.log('🚀 发送信号给', this.handlers.length, '个处理器:', signal);
    this.handlers.forEach(handler => {
      try {
        handler(signal);
      } catch (error) {
        console.error('💥 信号处理器错误:', error);
      }
    });
  }
}

// 全局单例
export const signalBridge = new SignalBridge();