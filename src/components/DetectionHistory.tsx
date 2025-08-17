import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Clock, DollarSign } from "lucide-react";

interface HistoryRecord {
  id: string;
  timestamp: string;
  symbol: string;
  signal: string;
  confidence: number;
  signalType: string;
  tradingDetails: {
    entry: number;
    stopLoss: number;
    takeProfit: number;
    position: string;
    reasoning: string;
  };
}

export function DetectionHistory() {
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    // 从localStorage加载历史记录
    const savedHistory = localStorage.getItem('detectionHistory');
    if (savedHistory) {
      setHistoryRecords(JSON.parse(savedHistory));
    }

    // 监听新的检测结果
    const handleNewDetection = (event: CustomEvent) => {
      const data = event.detail;
      const newRecord: HistoryRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString('zh-CN'),
        symbol: data.symbol,
        signal: data.signal,
        confidence: data.confidence,
        signalType: data.signal === 'buy' ? 'ai.buy_signal' : 'ai.sell_signal',
        tradingDetails: data.tradingDetails
      };

      const updatedHistory = [newRecord, ...historyRecords].slice(0, 10); // 保留最新10条
      setHistoryRecords(updatedHistory);
      localStorage.setItem('detectionHistory', JSON.stringify(updatedHistory));
    };

    window.addEventListener('superBrainOpportunity', handleNewDetection as EventListener);
    
    return () => {
      window.removeEventListener('superBrainOpportunity', handleNewDetection as EventListener);
    };
  }, [historyRecords]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border-amber-400/30 text-amber-400 hover:bg-amber-900/30"
        >
          <Clock className="w-4 h-4 mr-1" />
          检测历史 {historyRecords.length} 条记录
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-amber-400 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            检测历史 - {historyRecords.length} 条记录
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {historyRecords.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              暂无检测历史记录
            </div>
          ) : (
            historyRecords.map((record) => (
              <div
                key={record.id}
                className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 rounded-lg p-4 border border-slate-600/50 cursor-pointer hover:border-amber-400/50 transition-all"
                onClick={() => setSelectedRecord(record)}
              >
                {/* 标题行 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white">{record.symbol}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      record.signal === 'buy' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {record.signalType}
                    </span>
                    <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                      胜率 {record.confidence}%
                    </span>
                  </div>
                  <span className="text-slate-400 text-sm">{record.timestamp}</span>
                </div>

                {/* 价格分析 */}
                <div className="bg-slate-800/60 rounded p-2 border border-blue-400/20 mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-blue-400 text-sm">📊</span>
                    <span className="text-blue-400 font-medium text-sm">价格分析</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">
                      {record.symbol}: {record.signal === 'buy' ? '买多' : '卖空'}
                    </span>
                  </div>
                </div>

                {/* 技术指标 */}
                <div className="bg-slate-800/60 rounded p-2 border border-purple-400/20 mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-purple-400 text-sm">🎯</span>
                    <span className="text-purple-400 font-medium text-sm">ai.technical_indicators</span>
                  </div>
                  <div className="text-slate-300 text-sm">
                    入场: <span className="text-green-400 font-mono">${record.tradingDetails.entry.toLocaleString()}</span> | 
                    止损: <span className="text-red-400 font-mono">${record.tradingDetails.stopLoss.toLocaleString()}</span> | 
                    止盈: <span className="text-green-400 font-mono">${record.tradingDetails.takeProfit.toLocaleString()}</span>
                  </div>
                </div>

                {/* 综合分析 */}
                <div className="bg-slate-800/60 rounded p-2 border border-green-400/20">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-green-400 text-sm">🧠</span>
                    <span className="text-green-400 font-medium text-sm">综合分析</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                    <span className="text-white text-sm">
                      仓位: {record.tradingDetails.position} | 胜率: {record.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 详细信息弹窗 */}
        {selectedRecord && (
          <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
            <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-amber-400">
                  交易建议详情 - {selectedRecord.symbol}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3">
                {/* 交易信息 */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded p-3 border border-indigo-400/30">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-indigo-400">💱</span>
                    <span className="text-indigo-400 font-bold">交易信息</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="text-slate-500">货币种类:</span>
                      <div className="text-white font-bold">{selectedRecord.symbol}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">交易方向:</span>
                      <div className={`font-bold ${
                        selectedRecord.signal === 'buy' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        永续合约{selectedRecord.signal === 'buy' ? '做多' : '做空'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="text-slate-500">合约类型:</span>
                      <div className="text-blue-400 font-medium">永续合约</div>
                    </div>
                    <div>
                      <span className="text-slate-500">杠杆倍数:</span>
                      <div className="text-yellow-400 font-bold">
                        {selectedRecord.tradingDetails.position === '重仓' ? '20x' : 
                         selectedRecord.tradingDetails.position === '中仓' ? '15x' : '10x'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 rounded p-2">
                    <div className="text-slate-500 text-sm mb-1">爆仓点安全等级:</div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => {
                          const safetyLevel = selectedRecord.confidence >= 95 ? 5 : selectedRecord.confidence >= 90 ? 4 : 3;
                          return (
                            <div
                              key={i}
                              className={`w-2 h-3 rounded-sm ${
                                i < safetyLevel ? 'bg-green-400' : 'bg-slate-600'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-sm font-medium text-green-400">
                        {(() => {
                          const safetyLevel = selectedRecord.confidence >= 95 ? 5 : selectedRecord.confidence >= 90 ? 4 : 3;
                          if (safetyLevel === 5) return '极安全';
                          if (safetyLevel === 4) return '很安全';
                          if (safetyLevel === 3) return '安全';
                          if (safetyLevel === 2) return '中等';
                          return '谨慎';
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 具体交易建议 */}
                <div className="bg-gradient-to-br from-amber-900/20 to-yellow-900/20 rounded p-3 border border-amber-400/30">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-amber-400">📋</span>
                    <span className="text-amber-400 font-bold">具体交易建议</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-slate-800/40 rounded p-2 text-center">
                      <div className="text-slate-500 text-sm">入场价格</div>
                      <div className="text-green-400 font-mono font-bold">
                        ${selectedRecord.tradingDetails.entry.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-800/40 rounded p-2 text-center">
                      <div className="text-slate-500 text-sm">止损价格</div>
                      <div className="text-red-400 font-mono font-bold">
                        ${selectedRecord.tradingDetails.stopLoss.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 rounded p-2 text-center">
                    <div className="text-slate-500 text-sm">止盈价格</div>
                    <div className="text-green-400 font-mono font-bold">
                      ${selectedRecord.tradingDetails.takeProfit.toLocaleString()}
                    </div>
                  </div>

                  {selectedRecord.tradingDetails.reasoning && (
                    <div className="mt-3 p-2 bg-slate-800/60 rounded">
                      <div className="text-slate-500 text-sm mb-1">分析理由:</div>
                      <div className="text-slate-300 text-sm">{selectedRecord.tradingDetails.reasoning}</div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}