import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Send, Settings, Brain, Newspaper, Activity, X, Bot, Zap, TrendingUpIcon, Monitor, Cpu } from "lucide-react";
import { SuperBrainDetection } from "./SuperBrainDetection";

interface AIControlCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIControlCenter = ({ open, onOpenChange }: AIControlCenterProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [analysisQuery, setAnalysisQuery] = useState("");
  const [aiConfigs, setAiConfigs] = useState({
    openai: { enabled: false, apiKey: "", model: "gpt-4o-mini" },
    claude: { enabled: false, apiKey: "", model: "claude-3-5-sonnet-20241022" },
    perplexity: { enabled: false, apiKey: "", model: "llama-3.1-sonar-small-128k-online" }
  });

  const cryptoOptions = [
    { symbol: "BTC", name: "Bitcoin", price: 43832.346, change: 85.23, changePercent: 0.19 },
    { symbol: "ETH", name: "Ethereum", price: 2567.89, change: -45.30, changePercent: -1.73 },
    { symbol: "USDT", name: "Tether", price: 1.00, change: 0.001, changePercent: 0.01 },
    { symbol: "BNB", name: "Binance Coin", price: 315.67, change: 12.45, changePercent: 4.12 },
    { symbol: "XRP", name: "Ripple", price: 0.634, change: -0.021, changePercent: -3.20 },
    { symbol: "USDC", name: "USD Coin", price: 1.001, change: 0.001, changePercent: 0.10 },
    { symbol: "ADA", name: "Cardano", price: 0.485, change: 0.023, changePercent: 4.98 },
    { symbol: "SOL", name: "Solana", price: 98.75, change: 3.42, changePercent: 3.59 },
    { symbol: "DOGE", name: "Dogecoin", price: 0.078, change: 0.004, changePercent: 5.41 },
    { symbol: "DOT", name: "Polkadot", price: 7.23, change: -0.18, changePercent: -2.43 },
    { symbol: "MATIC", name: "Polygon", price: 0.89, change: 0.065, changePercent: 7.88 },
    { symbol: "AVAX", name: "Avalanche", price: 36.78, change: 1.89, changePercent: 5.42 },
    { symbol: "LINK", name: "Chainlink", price: 14.23, change: -0.67, changePercent: -4.50 },
    { symbol: "UNI", name: "Uniswap", price: 6.45, change: 0.34, changePercent: 5.57 },
    { symbol: "LTC", name: "Litecoin", price: 73.45, change: -2.12, changePercent: -2.81 },
    { symbol: "ATOM", name: "Cosmos", price: 8.67, change: 0.45, changePercent: 5.48 },
    { symbol: "ICP", name: "Internet Computer", price: 5.23, change: -0.23, changePercent: -4.21 },
    { symbol: "NEAR", name: "NEAR Protocol", price: 2.34, change: 0.12, changePercent: 5.41 },
    { symbol: "APT", name: "Aptos", price: 8.90, change: 0.67, changePercent: 8.13 },
    { symbol: "FTM", name: "Fantom", price: 0.445, change: 0.023, changePercent: 5.46 },
    { symbol: "SHIB", name: "Shiba Inu", price: 0.0000089, change: 0.0000004, changePercent: 4.71 },
    { symbol: "TRX", name: "TRON", price: 0.067, change: 0.002, changePercent: 3.08 },
    { symbol: "TON", name: "Toncoin", price: 2.45, change: 0.11, changePercent: 4.70 },
    { symbol: "HBAR", name: "Hedera", price: 0.052, change: 0.003, changePercent: 6.12 }
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
    "分析当前市场趋势",
    `${selectedCrypto}未来1周的价格预测是什么?`,
    `基于技术指标，${selectedCrypto}的支撑位和阻力位在哪里?`,
    `当前市场情绪对${selectedCrypto}有什么影响?`
  ];

  const handleMultiAIAnalysis = async () => {
    if (!analysisQuery.trim()) return;
    
    console.log("Starting multi-AI analysis with:", {
      query: analysisQuery,
      crypto: selectedCrypto,
      aiConfigs: aiConfigs
    });
  };

  const AIConfigurationPanel = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">AI控制中心</h2>
        <p className="text-slate-400">配置您的AI分析接口，开启智能交易之旅</p>
      </div>

      {/* System Status Overview */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">系统状态概览</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${aiConfigs.openai.enabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              <div className="text-sm text-white font-medium">新闻分析引擎</div>
              <div className="text-xs text-slate-400">OpenAI GPT</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${aiConfigs.claude.enabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              <div className="text-sm text-white font-medium">技术分析引擎</div>
              <div className="text-xs text-slate-400">Claude AI</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${aiConfigs.perplexity.enabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              <div className="text-sm text-white font-medium">大数据分析引擎</div>
              <div className="text-xs text-slate-400">Perplexity AI</div>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Configuration Cards */}
      <div className="space-y-6">
        {/* OpenAI Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">OpenAI API Configuration</h3>
                <Badge variant="outline" className="text-blue-400 border-blue-400/20 mt-1">新闻分析引擎</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">用于新闻情感分析和市场情绪评估</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={aiConfigs.openai.enabled}
                  onChange={(e) => setAiConfigs(prev => ({
                    ...prev,
                    openai: { ...prev.openai, enabled: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm text-slate-300">启用 OpenAI 分析引擎</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">API Key</label>
                  <Input
                    placeholder="输入您的 OpenAI API Key"
                    type="password"
                    value={aiConfigs.openai.apiKey}
                    onChange={(e) => setAiConfigs(prev => ({
                      ...prev,
                      openai: { ...prev.openai, apiKey: e.target.value }
                    }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">模型选择</label>
                  <Select
                    value={aiConfigs.openai.model}
                    onValueChange={(value) => setAiConfigs(prev => ({
                      ...prev,
                      openai: { ...prev.openai, model: value }
                    }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-5-mini-2025-08-07">GPT-5 Mini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 bg-slate-700/30 p-3 rounded">
                ⚠️ 请先登录以配置API密钥。登录后，您可以安全地存储和管理您的API密钥。
              </div>
            </div>
          </div>
        </Card>

        {/* Claude Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Claude API Configuration</h3>
                <Badge variant="outline" className="text-purple-400 border-purple-400/20 mt-1">技术分析引擎</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">用于深度技术指标分析和图表模式识别</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={aiConfigs.claude.enabled}
                  onChange={(e) => setAiConfigs(prev => ({
                    ...prev,
                    claude: { ...prev.claude, enabled: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm text-slate-300">启用 Claude 分析引擎</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">API Key</label>
                  <Input
                    placeholder="输入您的 Claude API Key"
                    type="password"
                    value={aiConfigs.claude.apiKey}
                    onChange={(e) => setAiConfigs(prev => ({
                      ...prev,
                      claude: { ...prev.claude, apiKey: e.target.value }
                    }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">模型选择</label>
                  <Select
                    value={aiConfigs.claude.model}
                    onValueChange={(value) => setAiConfigs(prev => ({
                      ...prev,
                      claude: { ...prev.claude, model: value }
                    }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="claude-sonnet-4-20250514">Claude 4 Sonnet</SelectItem>
                      <SelectItem value="claude-opus-4-20250514">Claude 4 Opus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 bg-slate-700/30 p-3 rounded">
                🔒 登录后，您的API密钥将被加密并安全存储在Supabase中，它们远不会存储在您的浏览器中或以明文传输。
              </div>
            </div>
          </div>
        </Card>

        {/* Perplexity Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUpIcon className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Perplexity API Configuration</h3>
                <Badge variant="outline" className="text-green-400 border-green-400/20 mt-1">大数据分析引擎</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">用于实时搜索和综合市场数据分析</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={aiConfigs.perplexity.enabled}
                  onChange={(e) => setAiConfigs(prev => ({
                    ...prev,
                    perplexity: { ...prev.perplexity, enabled: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm text-slate-300">启用 Perplexity 分析引擎</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">API Key</label>
                  <Input
                    placeholder="输入您的 Perplexity API Key"
                    type="password"
                    value={aiConfigs.perplexity.apiKey}
                    onChange={(e) => setAiConfigs(prev => ({
                      ...prev,
                      perplexity: { ...prev.perplexity, apiKey: e.target.value }
                    }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">模型选择</label>
                  <Select
                    value={aiConfigs.perplexity.model}
                    onValueChange={(value) => setAiConfigs(prev => ({
                      ...prev,
                      perplexity: { ...prev.perplexity, model: value }
                    }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Sonar Small</SelectItem>
                      <SelectItem value="llama-3.1-sonar-large-128k-online">Llama 3.1 Sonar Large</SelectItem>
                      <SelectItem value="llama-3.1-sonar-huge-128k-online">Llama 3.1 Sonar Huge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const RealTimeAnalysisPanel = () => (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left Panel - AI Analysis Chat */}
      <div className="col-span-3">
        <Card className="h-full bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">AI分析聊天</h3>
            </div>
            
            {/* AI Status Indicators */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${aiConfigs.openai.enabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                <span className="text-slate-300">新闻分析引擎</span>
                <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/20">OpenAI</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${aiConfigs.claude.enabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                <span className="text-slate-300">技术分析引擎</span>
                <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/20">Claude</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${aiConfigs.perplexity.enabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                <span className="text-slate-300">大数据分析引擎</span>
                <Badge variant="outline" className="text-xs text-green-400 border-green-400/20">Perplexity</Badge>
              </div>
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
                onKeyPress={(e) => e.key === 'Enter' && handleMultiAIAnalysis()}
              />
              <Button 
                onClick={handleMultiAIAnalysis}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Multi-AI Analysis Status */}
            <div className="mt-3 text-xs text-center">
              <span className="text-slate-500">
                已启用 {Object.values(aiConfigs).filter(config => config.enabled).length}/3 个AI引擎
              </span>
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
              
              {/* Quick Selection Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {cryptoOptions.slice(0, 8).map((crypto) => (
                  <Button
                    key={crypto.symbol}
                    variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCrypto(crypto.symbol)}
                    className={selectedCrypto === crypto.symbol 
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs" 
                      : "border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
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
                <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                  {cryptoOptions.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white">
                      <div className="flex items-center justify-between w-full">
                        <span>{crypto.symbol} • {crypto.name}</span>
                        <span className={`text-xs ml-2 ${crypto.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {crypto.changePercent > 0 ? '+' : ''}{crypto.changePercent}%
                        </span>
                      </div>
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
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] h-[95vh] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-slate-700 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-orbitron">
                  AI 控制中心
                </h1>
                <p className="text-sm text-slate-300">高级AI交易分析系统 - 统一管理平台</p>
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
            配置您的AI分析接口，管理实时分析功能，开启智能交易之旅
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 p-6 pt-2 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <TabsList className="grid grid-cols-3 bg-slate-800/50 border-slate-700 mb-6">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black"
              >
                <Settings className="w-4 h-4 mr-2" />
                AI 配置管理
              </TabsTrigger>
              <TabsTrigger 
                value="analysis" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black"
              >
                <Activity className="w-4 h-4 mr-2" />
                实时分析
              </TabsTrigger>
              <TabsTrigger 
                value="superbrain" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black"
              >
                <Brain className="w-4 h-4 mr-2" />
                最强大脑检测
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-0 h-full">
              <AIConfigurationPanel />
            </TabsContent>

            <TabsContent value="analysis" className="mt-0 h-full">
              <RealTimeAnalysisPanel />
            </TabsContent>

            <TabsContent value="superbrain" className="mt-0 h-full">
              <SuperBrainDetection />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};