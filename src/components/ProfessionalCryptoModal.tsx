import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Send, Settings, Brain, Newspaper, Activity, X } from "lucide-react";

interface ProfessionalCryptoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfessionalCryptoModal = ({ open, onOpenChange }: ProfessionalCryptoModalProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [analysisQuery, setAnalysisQuery] = useState("");

  const cryptoOptions = [
    { symbol: "BTC", name: "Bitcoin", price: 43832.346, change: 85.23, changePercent: 0.19 },
    { symbol: "ETH", name: "Ethereum", price: 2567.89, change: -45.30, changePercent: -1.73 },
    { symbol: "USDT", name: "Tether", price: 1.00, change: 0.001, changePercent: 0.01 }
  ];

  const currentCrypto = cryptoOptions.find(c => c.symbol === selectedCrypto) || cryptoOptions[0];

  const timeframes = [
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "30m", value: "30m" },
    { label: "1H", value: "1H" },
    { label: "4H", value: "4H" },
    { label: "1D", value: "1D", active: true },
    { label: "1W", value: "1W" },
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1Y" }
  ];

  const technicalIndicators = [
    { name: "RSI(14)", value: "59.18", color: "text-yellow-400" },
    { name: "Volume", value: "$0.31B", color: "text-blue-400" },
    { name: "MACD", value: "0.68%", color: "text-green-400" },
    { name: "KDJ", value: "43.5", color: "text-purple-400" },
    { name: "MA5", value: "$43613.1", color: "text-orange-400" },
    { name: "MA10", value: "$43481.7", color: "text-pink-400" }
  ];

  const sampleQuestions = [
    "USDT的技术走势如何?",
    "我现在应该买入还是卖出?",
    "分析当前市场趋势"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-700 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-orbitron">
                  Supreme Brain
                </h1>
                <p className="text-sm text-slate-300">高级AI交易分析系统</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm mt-2">
            融合三重AI智能分析，为您提供最专业的加密货币投资决策支持
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 p-6 pt-2 overflow-auto">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Left Panel - AI Analysis Chat */}
            <div className="col-span-3">
              <Card className="h-full bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">AI分析聊天</h3>
                  </div>
                  
                  <div className="flex-1 space-y-4 mb-4">
                    <div className="text-slate-300 text-sm">
                      针对选定的加密货币进行实时市场数据分析
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-yellow-400 text-sm font-medium mb-2">试试问:</div>
                      {sampleQuestions.map((question, index) => (
                        <div 
                          key={index}
                          className="text-slate-400 text-sm p-2 rounded bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer transition-colors"
                          onClick={() => setAnalysisQuery(question)}
                        >
                          "{question}"
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="询问技术分析..."
                      value={analysisQuery}
                      onChange={(e) => setAnalysisQuery(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                    />
                    <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="col-span-9 space-y-6">
              {/* Crypto Selection & Price Display */}
              <div className="grid grid-cols-2 gap-6">
                {/* Crypto Selection */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <BarChart3 className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-medium">货币选择 & 分析</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      {cryptoOptions.map((crypto) => (
                        <Button
                          key={crypto.symbol}
                          variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCrypto(crypto.symbol)}
                          className={selectedCrypto === crypto.symbol 
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black" 
                            : "border-slate-600 text-slate-300 hover:bg-slate-700"
                          }
                        >
                          {crypto.symbol}
                        </Button>
                      ))}
                    </div>

                    <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {cryptoOptions.map((crypto) => (
                          <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white">
                            {crypto.symbol} • {crypto.name} (比特币)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* Price Display */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{currentCrypto.symbol}</span>
                        <span className="text-slate-400">{currentCrypto.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {currentCrypto.changePercent > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className={currentCrypto.changePercent > 0 ? "text-green-400" : "text-red-400"}>
                          {currentCrypto.changePercent > 0 ? "+" : ""}{currentCrypto.changePercent}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-3xl font-bold text-white mb-1">
                      ${currentCrypto.price.toLocaleString()}
                    </div>
                    
                    <div className={`text-lg ${currentCrypto.change > 0 ? "text-green-400" : "text-red-400"}`}>
                      {currentCrypto.change > 0 ? "+" : ""}${currentCrypto.change}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Analysis Tabs */}
              <Tabs defaultValue="chart" className="w-full">
                <TabsList className="grid grid-cols-3 bg-slate-800/50 border-slate-700">
                  <TabsTrigger value="chart" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    价格图表
                  </TabsTrigger>
                  <TabsTrigger value="technical" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black">
                    <Activity className="w-4 h-4 mr-2" />
                    技术分析
                  </TabsTrigger>
                  <TabsTrigger value="news" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black">
                    <Newspaper className="w-4 h-4 mr-2" />
                    新闻情绪
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chart" className="mt-6">
                  <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-3">
                      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                        <div className="p-6">
                          {/* Timeframe Controls */}
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3 className="text-lg font-semibold text-white mb-2">K线图表 & 技术指标</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span>BTC/USDT</span>
                                <span>O: $43744.68149762</span>
                                <span>H: $44763.15853</span>
                                <span>L: $42766.78252</span>
                                <span>C: $43832.34619</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-6">
                            {timeframes.map((tf) => (
                              <Button
                                key={tf.value}
                                variant={selectedTimeframe === tf.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedTimeframe(tf.value)}
                                className={selectedTimeframe === tf.value 
                                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs" 
                                  : "border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                                }
                              >
                                {tf.label}
                              </Button>
                            ))}
                          </div>

                          {/* Chart Placeholder */}
                          <div className="h-80 bg-slate-700/30 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <BarChart3 className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                              <p className="text-slate-400 text-lg font-medium">专业K线图表 ({selectedTimeframe})</p>
                              <p className="text-slate-500 text-sm mt-2">实时价格走势与技术指标分析</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Technical Indicators Panel */}
                    <div className="col-span-1">
                      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-6">
                            <Activity className="w-5 h-5 text-yellow-400" />
                            <h3 className="text-lg font-semibold text-white">技术指标面板</h3>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="text-yellow-400 text-sm font-medium mb-3">基础指标</h4>
                              <div className="space-y-3">
                                {technicalIndicators.map((indicator, index) => (
                                  <div key={index} className="flex justify-between items-center">
                                    <span className="text-slate-300 text-sm">{indicator.name}</span>
                                    <span className={`text-sm font-medium ${indicator.color}`}>
                                      {indicator.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-700">
                              <h4 className="text-yellow-400 text-sm font-medium mb-3">移动均线</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-300 text-sm">MA5</span>
                                  <span className="text-orange-400 text-sm">$43613.1</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-300 text-sm">MA10</span>
                                  <span className="text-pink-400 text-sm">$43481.7</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="mt-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">技术分析</h3>
                      <div className="h-96 bg-slate-700/30 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Activity className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                          <p className="text-slate-400 text-lg">深度技术分析报告</p>
                          <p className="text-slate-500 text-sm mt-2">AI驱动的技术指标分析</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="news" className="mt-6">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">新闻情绪分析</h3>
                      <div className="h-96 bg-slate-700/30 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Newspaper className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                          <p className="text-slate-400 text-lg">实时新闻情绪分析</p>
                          <p className="text-slate-500 text-sm mt-2">基于AI的市场情绪监控</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};