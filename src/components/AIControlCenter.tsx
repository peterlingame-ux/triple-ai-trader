import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Send, Settings, Brain, Newspaper, Activity, X, Bot, Zap, TrendingUpIcon, Monitor, Cpu, RefreshCw, Loader2 } from "lucide-react";
import { BinanceKlineChart } from "./BinanceKlineChart";
import { SuperBrainDetection } from "./SuperBrainDetection";
import { OptimizedPortfolioCards } from "./OptimizedPortfolioCards";
import { logger } from "@/utils/errorHandler";
import { useLanguage } from "@/hooks/useLanguage";
import { useCryptoData } from "@/hooks/useCryptoData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import avatars
import elonAvatar from "@/assets/elon-musk-cartoon-avatar.png";
import warrenAvatar from "@/assets/warren-buffett-cartoon-avatar.png";
import billAvatar from "@/assets/bill-gates-cartoon-avatar.png";
import vitalikAvatar from "@/assets/vitalik-buterin-cartoon-avatar.png";
import justinAvatar from "@/assets/justin-sun-cartoon-avatar.png";
import trumpAvatar from "@/assets/donald-trump-cartoon-avatar.png";

interface PortfolioData {
  totalValue: number;
  dailyChange: number;
  activeTrades: number;
  source: 'wallet' | 'autotrader';
}

interface AIControlCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advisorStates?: Record<string, boolean>;
  portfolioData?: PortfolioData;
}

export const AIControlCenter = ({ open, onOpenChange, advisorStates = {}, portfolioData }: AIControlCenterProps) => {
  const { t, currentLanguage } = useLanguage();
  const { cryptoData, newsData, loading, refreshData } = useCryptoData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [analysisQuery, setAnalysisQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [grokResponse, setGrokResponse] = useState<string>("");
  const [aiConfigs, setAiConfigs] = useState({
    openai: { enabled: false, apiKey: "", model: "gpt-4o-mini" },
    claude: { enabled: false, apiKey: "", model: "claude-3-5-sonnet-20241022" },
    grok: { enabled: true, apiKey: "", model: "grok-beta" },
    vitalik: { enabled: false, apiKey: "", model: "gpt-5-2025-08-07" },
    justin: { enabled: false, apiKey: "", model: "claude-sonnet-4-20250514" },
    trump: { enabled: false, apiKey: "", model: "gpt-5-mini-2025-08-07" }
  });

  // 使用真实的加密货币数据
  const cryptoOptions = cryptoData.slice(0, 24).map(crypto => ({
    symbol: crypto.symbol,
    name: crypto.name,
    price: crypto.price,
    change: crypto.change24h,
    changePercent: crypto.changePercent24h,
    volume: crypto.volume24h,
    marketCap: crypto.marketCap,
    high24h: crypto.high24h,
    low24h: crypto.low24h,
    rsi: crypto.rsi,
    ma20: crypto.ma20,
    ma50: crypto.ma50,
    support: crypto.support,
    resistance: crypto.resistance
  }));

  const currentCrypto = cryptoOptions.find(c => c.symbol === selectedCrypto) || cryptoOptions[0];

  // GROK API 分析函数
  const handleGrokAnalysis = async (query: string) => {
    if (!query.trim()) {
      toast({
        title: "请输入分析问题",
        description: "请输入您想要分析的问题",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          prompt: `作为专业的加密货币分析师，基于当前${selectedCrypto}的市场数据进行分析：
            当前价格: $${currentCrypto?.price.toLocaleString() || 'N/A'}
            24小时变化: ${currentCrypto?.changePercent.toFixed(2) || 'N/A'}%
            24小时成交量: $${currentCrypto?.volume ? (currentCrypto.volume / 1e9).toFixed(2) + 'B' : 'N/A'}
            RSI: ${currentCrypto?.rsi?.toFixed(2) || 'N/A'}
            MA20: $${currentCrypto?.ma20?.toFixed(2) || 'N/A'}
            MA50: $${currentCrypto?.ma50?.toFixed(2) || 'N/A'}
            
            用户问题: ${query}
            
            请提供专业的分析建议，包括技术分析、风险评估和投资建议。`,
          model: 'gpt-5-2025-08-07',
          advisorName: 'GROK分析师',
          cryptoContext: `${selectedCrypto} 实时市场数据`
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        setGrokResponse(data.response);
        toast({
          title: "GROK 分析完成",
          description: `基于${selectedCrypto}的实时数据完成分析`
        });
      } else {
        throw new Error(data?.error || 'GROK分析失败');
      }
    } catch (error) {
      console.error('GROK analysis error:', error);
      toast({
        title: "分析失败",
        description: "请稍后重试或检查网络连接",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    { name: "RSI(14)", value: currentCrypto?.rsi?.toFixed(2) || "59.18", color: "text-yellow-400" },
    { name: "Volume", value: `$${currentCrypto?.volume ? (currentCrypto.volume / 1e9).toFixed(2) + 'B' : '0.31B'}`, color: "text-blue-400" },
    { name: "MACD", value: currentCrypto?.ma20 && currentCrypto?.ma50 ? ((currentCrypto.ma20 - currentCrypto.ma50) / currentCrypto.ma50 * 100).toFixed(2) + '%' : "0.68%", color: "text-green-400" },
    { name: "KDJ", value: "43.5", color: "text-purple-400" },
    { name: "MA5", value: `$${currentCrypto?.price ? (currentCrypto.price * 0.998).toFixed(2) : '43613.1'}`, color: "text-orange-400" },
    { name: "MA10", value: `$${currentCrypto?.ma20?.toFixed(2) || '43481.7'}`, color: "text-pink-400" },
    { name: "MA20", value: `$${currentCrypto?.ma20?.toFixed(2) || '43613.1'}`, color: "text-orange-400" },
    { name: "MA50", value: `$${currentCrypto?.ma50?.toFixed(2) || '43481.7'}`, color: "text-pink-400" },
    { name: "Support", value: `$${currentCrypto?.support?.toFixed(2) || '41200'}`, color: "text-green-400" },
    { name: "Resistance", value: `$${currentCrypto?.resistance?.toFixed(2) || '45800'}`, color: "text-red-400" },
    { name: "24h High", value: `$${currentCrypto?.high24h?.toFixed(2) || '44763.16'}`, color: "text-emerald-400" },
    { name: "24h Low", value: `$${currentCrypto?.low24h?.toFixed(2) || '42766.78'}`, color: "text-rose-400" }
  ];

  const sampleQuestions = [
    t('ai.question1'),
    t('ai.question2'), 
    t('ai.question3'),
    `${selectedCrypto}${currentLanguage === 'zh' ? '未来1周的价格预测是什么?' : ' price prediction for next week?'}`,
    `${currentLanguage === 'zh' ? '基于技术指标，' : 'Based on technical indicators, what are the '}${selectedCrypto}${currentLanguage === 'zh' ? '的支撑位和阻力位在哪里?' : ' support and resistance levels?'}`,
    `${currentLanguage === 'zh' ? '当前市场情绪对' : 'How does current market sentiment affect '}${selectedCrypto}${currentLanguage === 'zh' ? '有什么影响?' : '?'}`
  ];

  const handleMultiAIAnalysis = useCallback(async () => {
    if (!analysisQuery.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      logger.info("Starting multi-AI analysis", {
        query: analysisQuery,
        crypto: selectedCrypto,
        enabledConfigs: Object.entries(aiConfigs)
          .filter(([_, config]) => config.enabled)
          .map(([name, _]) => name)
      }, 'AIControlCenter');
      
      // Add actual analysis logic here
      // For now, just simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      logger.error("Multi-AI analysis failed", { error }, 'AIControlCenter');
    } finally {
      setIsAnalyzing(false);
    }
  }, [analysisQuery, selectedCrypto, aiConfigs, isAnalyzing]);

  const AIConfigurationPanel = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{t('ai.control_center.title')}</h2>
        <p className="text-slate-400">{t('ai.control_center.description')}</p>
      </div>

      {/* Portfolio Overview Cards - Removed per user request */}
      {/* {portfolioData && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('portfolio.overview')}
          </h3>
          <OptimizedPortfolioCards portfolioData={portfolioData} />
        </div>
      )} */}

      {/* System Status Overview */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">{t('ai.control_center.system_status')}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <img src={elonAvatar} alt="Elon Musk" className="w-8 h-8 rounded-full mx-auto mb-2 object-cover" />
              <div className="text-sm text-white font-medium">{t('ai.control_center.news_engine')}</div>
              <div className="text-xs text-slate-400">Elon Musk</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <img src={warrenAvatar} alt="Warren Buffett" className="w-8 h-8 rounded-full mx-auto mb-2 object-cover" />
              <div className="text-sm text-white font-medium">{t('ai.control_center.technical_engine')}</div>
              <div className="text-xs text-slate-400">Warren Buffett</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <img src={billAvatar} alt="Bill Gates" className="w-8 h-8 rounded-full mx-auto mb-2 object-cover" />
              <div className="text-sm text-white font-medium">{t('ai.control_center.bigdata_engine')}</div>
              <div className="text-xs text-slate-400">Bill Gates</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <img src={vitalikAvatar} alt="Vitalik Buterin" className="w-8 h-8 rounded-full mx-auto mb-2 object-cover" />
              <div className="text-sm text-white font-medium">{t('ai.control_center.blockchain_engine')}</div>
              <div className="text-xs text-slate-400">Vitalik Buterin</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <img src={justinAvatar} alt="Justin Sun" className="w-8 h-8 rounded-full mx-auto mb-2 object-cover" />
              <div className="text-sm text-white font-medium">{t('ai.control_center.defi_engine')}</div>
              <div className="text-xs text-slate-400">Justin Sun</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <img src={trumpAvatar} alt="Donald Trump" className="w-8 h-8 rounded-full mx-auto mb-2 object-cover" />
              <div className="text-sm text-white font-medium">{t('ai.control_center.policy_engine')}</div>
              <div className="text-xs text-slate-400">Donald Trump</div>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Configuration Cards */}
      <div className="space-y-6">
        {/* Elon Musk Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={elonAvatar} alt="Elon Musk" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-semibold text-white">{t('ai.control_center.elon_config')}</h3>
                <Badge variant="outline" className="text-blue-400 border-blue-400/20 mt-1">{t('ai.control_center.news_engine')}</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">{t('ai.control_center.elon_desc')}</p>
            
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
                <span className="text-sm text-slate-300">{t('ai.control_center.enable')} Elon Musk {t('ai.control_center.news_engine')}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.api_key')}</label>
                  <Input
                    placeholder={`${t('ai.control_center.enter_api_key')} (${t('ai.control_center.news_engine')})`}
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
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.model_selection')}</label>
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
                ⚠️ {t('ai.control_center.login_required')}
              </div>
            </div>
          </div>
        </Card>

        {/* Warren Buffett Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={warrenAvatar} alt="Warren Buffett" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-semibold text-white">{t('ai.control_center.warren_config')}</h3>
                <Badge variant="outline" className="text-purple-400 border-purple-400/20 mt-1">{t('ai.control_center.technical_engine')}</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">{t('ai.control_center.warren_desc')}</p>
            
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
                <span className="text-sm text-slate-300">{t('ai.control_center.enable')} Warren Buffett {t('ai.control_center.technical_engine')}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.api_key')}</label>
                  <Input
                    placeholder={`${t('ai.control_center.enter_api_key')} (Claude)`}
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
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.model_selection')}</label>
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
                🔒 {t('ai.control_center.security_notice')}
              </div>
            </div>
          </div>
        </Card>

        {/* Bill Gates Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={billAvatar} alt="Bill Gates" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-semibold text-white">{t('ai.control_center.bill_config')}</h3>
                <Badge variant="outline" className="text-green-400 border-green-400/20 mt-1">{t('ai.control_center.bigdata_engine')}</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">{t('ai.control_center.bill_desc')}</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={aiConfigs.grok.enabled}
                  onChange={(e) => setAiConfigs(prev => ({
                    ...prev,
                    grok: { ...prev.grok, enabled: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm text-slate-300">{t('ai.control_center.enable')} Bill Gates {t('ai.control_center.bigdata_engine')}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.api_key')}</label>
                  <Input
                    placeholder={`${t('ai.control_center.enter_api_key')} (Grok)`}
                    type="password"
                    value={aiConfigs.grok.apiKey}
                    onChange={(e) => setAiConfigs(prev => ({
                      ...prev,
                      grok: { ...prev.grok, apiKey: e.target.value }
                    }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.model_selection')}</label>
                  <Select
                    value={aiConfigs.grok.model}
                    onValueChange={(value) => setAiConfigs(prev => ({
                      ...prev,
                      grok: { ...prev.grok, model: value }
                    }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="grok-beta">Grok Beta</SelectItem>
                      <SelectItem value="grok-2-beta">Grok-2 Beta</SelectItem>
                      <SelectItem value="grok-2-vision-beta">Grok-2 Vision Beta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Vitalik Buterin Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={vitalikAvatar} alt="Vitalik Buterin" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-semibold text-white">{t('ai.control_center.vitalik_config')}</h3>
                <Badge variant="outline" className="text-cyan-400 border-cyan-400/20 mt-1">{t('ai.control_center.blockchain_engine')}</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">{t('ai.control_center.vitalik_desc')}</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={aiConfigs.vitalik.enabled}
                  onChange={(e) => setAiConfigs(prev => ({
                    ...prev,
                    vitalik: { ...prev.vitalik, enabled: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm text-slate-300">{t('ai.control_center.enable')} Vitalik Buterin {t('ai.control_center.blockchain_engine')}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.api_key')}</label>
                  <Input
                    placeholder={`${t('ai.control_center.enter_api_key')} (OpenAI)`}
                    type="password"
                    value={aiConfigs.vitalik.apiKey}
                    onChange={(e) => setAiConfigs(prev => ({
                      ...prev,
                      vitalik: { ...prev.vitalik, apiKey: e.target.value }
                    }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.model_selection')}</label>
                  <Select
                    value={aiConfigs.vitalik.model}
                    onValueChange={(value) => setAiConfigs(prev => ({
                      ...prev,
                      vitalik: { ...prev.vitalik, model: value }
                    }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="gpt-5-2025-08-07">GPT-5</SelectItem>
                      <SelectItem value="gpt-5-mini-2025-08-07">GPT-5 Mini</SelectItem>
                      <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Justin Sun Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={justinAvatar} alt="Justin Sun" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-semibold text-white">{t('ai.control_center.justin_config')}</h3>
                <Badge variant="outline" className="text-orange-400 border-orange-400/20 mt-1">{t('ai.control_center.defi_engine')}</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">{t('ai.control_center.justin_desc')}</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={aiConfigs.justin.enabled}
                  onChange={(e) => setAiConfigs(prev => ({
                    ...prev,
                    justin: { ...prev.justin, enabled: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm text-slate-300">{t('ai.control_center.enable')} Justin Sun {t('ai.control_center.defi_engine')}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.api_key')}</label>
                  <Input
                    placeholder={`${t('ai.control_center.enter_api_key')} (Claude)`}
                    type="password"
                    value={aiConfigs.justin.apiKey}
                    onChange={(e) => setAiConfigs(prev => ({
                      ...prev,
                      justin: { ...prev.justin, apiKey: e.target.value }
                    }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.model_selection')}</label>
                  <Select
                    value={aiConfigs.justin.model}
                    onValueChange={(value) => setAiConfigs(prev => ({
                      ...prev,
                      justin: { ...prev.justin, model: value }
                    }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="claude-sonnet-4-20250514">Claude 4 Sonnet</SelectItem>
                      <SelectItem value="claude-opus-4-20250514">Claude 4 Opus</SelectItem>
                      <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Donald Trump Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={trumpAvatar} alt="Donald Trump" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-semibold text-white">{t('ai.control_center.trump_config')}</h3>
                <Badge variant="outline" className="text-red-400 border-red-400/20 mt-1">{t('ai.control_center.policy_engine')}</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">{t('ai.control_center.trump_desc')}</p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={aiConfigs.trump.enabled}
                  onChange={(e) => setAiConfigs(prev => ({
                    ...prev,
                    trump: { ...prev.trump, enabled: e.target.checked }
                  }))}
                  className="rounded"
                />
                <span className="text-sm text-slate-300">{t('ai.control_center.enable')} Donald Trump {t('ai.control_center.policy_engine')}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.api_key')}</label>
                  <Input
                    placeholder={`${t('ai.control_center.enter_api_key')} (OpenAI)`}
                    type="password"
                    value={aiConfigs.trump.apiKey}
                    onChange={(e) => setAiConfigs(prev => ({
                      ...prev,
                      trump: { ...prev.trump, apiKey: e.target.value }
                    }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 block mb-2">{t('ai.control_center.model_selection')}</label>
                  <Select
                    value={aiConfigs.trump.model}
                    onValueChange={(value) => setAiConfigs(prev => ({
                      ...prev,
                      trump: { ...prev.trump, model: value }
                    }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="gpt-5-mini-2025-08-07">GPT-5 Mini</SelectItem>
                      <SelectItem value="gpt-5-2025-08-07">GPT-5</SelectItem>
                      <SelectItem value="gpt-4.1-mini-2025-04-14">GPT-4.1 Mini</SelectItem>
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
              <h3 className="text-lg font-semibold text-white">{t('ai.control_center.ai_analysis_chat')}</h3>
            </div>
            
            {/* AI Status Indicators */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <img src={elonAvatar} alt="Elon Musk" className="w-4 h-4 rounded-full object-cover" />
                <span className="text-slate-300">{t('ai.control_center.news_engine')}</span>
                <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/20">Elon Musk</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <img src={warrenAvatar} alt="Warren Buffett" className="w-4 h-4 rounded-full object-cover" />
                <span className="text-slate-300">{t('ai.control_center.technical_engine')}</span>
                <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/20">Warren Buffett</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <img src={billAvatar} alt="Bill Gates" className="w-4 h-4 rounded-full object-cover" />
                <span className="text-slate-300">{t('ai.control_center.bigdata_engine')}</span>
                <Badge variant="outline" className="text-xs text-green-400 border-green-400/20">Bill Gates</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <img src={vitalikAvatar} alt="Vitalik Buterin" className="w-4 h-4 rounded-full object-cover" />
                <span className="text-slate-300">{t('ai.control_center.blockchain_engine')}</span>
                <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400/20">Vitalik Buterin</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <img src={justinAvatar} alt="Justin Sun" className="w-4 h-4 rounded-full object-cover" />
                <span className="text-slate-300">{t('ai.control_center.defi_engine')}</span>
                <Badge variant="outline" className="text-xs text-orange-400 border-orange-400/20">Justin Sun</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <img src={trumpAvatar} alt="Donald Trump" className="w-4 h-4 rounded-full object-cover" />
                <span className="text-slate-300">{t('ai.control_center.policy_engine')}</span>
                <Badge variant="outline" className="text-xs text-red-400 border-red-400/20">Donald Trump</Badge>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 mb-4">
              <div className="text-slate-300 text-sm">
                {t('ai.control_center.analysis_desc')}
              </div>
              
              <div className="space-y-2">
                <div className="text-yellow-400 text-sm font-medium mb-2">{t('ai.control_center.try_asking')}</div>
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
                placeholder={t('ai.control_center.ask_technical')}
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
                {t('activation.activated')} {Object.values(aiConfigs).filter(config => config.enabled).length}/6 {t('ai.control_center.engines_enabled')}
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
                <span className="text-white font-medium">{t('ai.control_center.currency_selection')}</span>
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
              {t('ai.control_center.price_chart')}
            </TabsTrigger>
            <TabsTrigger value="technical" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black">
              <Activity className="w-4 h-4 mr-2" />
              {t('ai.control_center.technical_analysis')}
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black">
              <Newspaper className="w-4 h-4 mr-2" />
              {t('ai.control_center.news_sentiment')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="mt-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="col-span-3">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{t('ai.control_center.chart_title')}</h3>
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

                    {/* Real Binance Kline Chart */}
                    <BinanceKlineChart 
                      symbol={selectedCrypto} 
                      className="h-80"
                    />
                  </div>
                </Card>
              </div>

              <div className="col-span-1">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <Activity className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-lg font-semibold text-white">{t('ai.control_center.technical_panel')}</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-yellow-400 text-sm font-medium mb-3">{t('ai.control_center.basic_indicators')}</h4>
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
                        <h4 className="text-yellow-400 text-sm font-medium mb-3">{t('ai.control_center.moving_averages')}</h4>
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
                <h3 className="text-lg font-semibold text-white mb-4">{t('ai.control_center.technical_analysis')}</h3>
                <div className="h-96 bg-slate-700/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">{t('ai.control_center.deep_technical_report')}</p>
                    <p className="text-slate-500 text-sm mt-2">{t('ai.control_center.ai_technical_analysis')}</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{t('ai.control_center.news_sentiment')}</h3>
                <div className="h-96 bg-slate-700/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Newspaper className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">{t('ai.control_center.realtime_news')}</p>
                    <p className="text-slate-500 text-sm mt-2">{t('ai.control_center.ai_sentiment')}</p>
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
              {t('ai.control_center.title')}
            </h1>
            <p className="text-sm text-slate-300">{t('ai.control_center.description')}</p>
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
            {t('ai.control_center.description')}
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
                {t('ai.control_center.title')}
              </TabsTrigger>
              <TabsTrigger 
                value="analysis" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black"
              >
                <Activity className="w-4 h-4 mr-2" />
                {t('ai.control_center.realtime_analysis')}
              </TabsTrigger>
              <TabsTrigger 
                value="superbrain" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-black"
              >
                <Brain className="w-4 h-4 mr-2" />
                {t('ai.control_center.supreme_brain_detection')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-0 h-full">
              <AIConfigurationPanel />
            </TabsContent>

            <TabsContent value="analysis" className="mt-0 h-full">
              <RealTimeAnalysisPanel />
            </TabsContent>

            <TabsContent value="superbrain" className="mt-0 h-full">
              <SuperBrainDetection advisorStates={advisorStates} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};