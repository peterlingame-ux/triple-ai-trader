import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Send, Settings, Brain, Newspaper, Activity, X, Bot, Zap, TrendingUpIcon, Monitor, Cpu, Upload, Image } from "lucide-react";
import { BinanceKlineChart } from "./BinanceKlineChart";
import { SuperBrainDetection } from "./SuperBrainDetection";
import { OptimizedPortfolioCards } from "./OptimizedPortfolioCards";
import { EnhancedAIChat } from "./EnhancedAIChat";
import { EnhancedChartPanel } from "./EnhancedChartPanel";
import { logger } from "@/utils/errorHandler";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { ProfessionalTradingConfig } from "./ProfessionalTradingConfig";

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
  source: 'autotrader';
}

interface AIControlCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advisorStates?: Record<string, boolean>;
  portfolioData?: PortfolioData;
}

export const AIControlCenter = ({ open, onOpenChange, advisorStates = {}, portfolioData }: AIControlCenterProps) => {
  const { t, currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("professional");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [analysisQuery, setAnalysisQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiConfigs, setAiConfigs] = useState({
    openai: { enabled: false, apiKey: "", model: "gpt-4o-mini" },
    claude: { enabled: false, apiKey: "", model: "claude-3-5-sonnet-20241022" },
    grok: { enabled: false, apiKey: "", model: "grok-beta" },
    vitalik: { enabled: false, apiKey: "", model: "gpt-5-2025-08-07" },
    justin: { enabled: false, apiKey: "", model: "claude-sonnet-4-20250514" },
    trump: { enabled: false, apiKey: "", model: "gpt-5-mini-2025-08-07" }
  });
  
  // Custom API configurations
  const [customApis, setCustomApis] = useState<Array<{
    id: string;
    name: string;
    provider: string;
    apiKey: string;
    model: string;
    endpoint: string;
    enabled: boolean;
    description: string;
    avatar: string;
  }>>([]);
  
  // Add API modal state
  const [showAddApiModal, setShowAddApiModal] = useState(false);
  const [newApiForm, setNewApiForm] = useState({
    name: "",
    provider: "",
    apiKey: "",
    endpoint: "",
    description: "",
    avatar: ""
  });

  // Custom avatar URL state
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('文件大小不能超过5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setNewApiForm(prev => ({ ...prev, avatar: publicUrl }));
      setCustomAvatarUrl(publicUrl);
      setUploadProgress(100);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('上传失败，请重试');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, []);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);
  const handleAddCustomApi = useCallback(() => {
    if (!newApiForm.name.trim() || !newApiForm.provider.trim() || !newApiForm.apiKey.trim()) {
      return;
    }

    const customApi = {
      id: Date.now().toString(),
      ...newApiForm,
      model: "", // Hidden from user
      enabled: false,
      avatar: newApiForm.avatar || "/lovable-uploads/9cc92493-5e50-470d-9543-d2fe07d350f6.png" // Default robot avatar
    };

    setCustomApis(prev => [...prev, customApi]);
    
    // Save to localStorage for persistence
    const updatedApis = [...customApis, customApi];
    localStorage.setItem('customApis', JSON.stringify(updatedApis));
    
    // Reset form
    setNewApiForm({
      name: "",
      provider: "",
      apiKey: "",
      endpoint: "",
      description: "",
      avatar: ""
    });
    setShowAddApiModal(false);
  }, [newApiForm, customApis]);

  // Handle removing custom API
  const handleRemoveCustomApi = useCallback((id: string) => {
    setCustomApis(prev => {
      const updated = prev.filter(api => api.id !== id);
      localStorage.setItem('customApis', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Handle toggling custom API
  const handleToggleCustomApi = useCallback((id: string, enabled: boolean) => {
    setCustomApis(prev => {
      const updated = prev.map(api => api.id === id ? { ...api, enabled } : api);
      localStorage.setItem('customApis', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Load custom APIs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('customApis');
      if (saved) {
        setCustomApis(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load custom APIs:', error);
    }
  }, []);

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
              <div className="relative w-8 h-8 mx-auto mb-2">
                <img 
                  src={elonAvatar} 
                  alt="Elon Musk" 
                  className={`w-8 h-8 rounded-full object-cover transition-all duration-300 ${
                    aiConfigs.openai.enabled 
                      ? 'shadow-lg shadow-green-400/50 ring-2 ring-green-400/60 animate-pulse' 
                      : 'opacity-60'
                  }`} 
                />
                {aiConfigs.openai.enabled && (
                  <div className="absolute -inset-1 bg-green-400/20 rounded-full animate-ping"></div>
                )}
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                aiConfigs.openai.enabled ? 'text-green-300' : 'text-white'
              }`}>
                {t('ai.control_center.news_engine')}
              </div>
              <div className="text-xs text-slate-400">Elon Musk</div>
              {aiConfigs.openai.enabled && (
                <div className="text-xs text-green-400 font-medium mt-1">● 已启用</div>
              )}
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="relative w-8 h-8 mx-auto mb-2">
                <img 
                  src={warrenAvatar} 
                  alt="Warren Buffett" 
                  className={`w-8 h-8 rounded-full object-cover transition-all duration-300 ${
                    aiConfigs.claude.enabled 
                      ? 'shadow-lg shadow-green-400/50 ring-2 ring-green-400/60 animate-pulse' 
                      : 'opacity-60'
                  }`} 
                />
                {aiConfigs.claude.enabled && (
                  <div className="absolute -inset-1 bg-green-400/20 rounded-full animate-ping"></div>
                )}
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                aiConfigs.claude.enabled ? 'text-green-300' : 'text-white'
              }`}>
                {t('ai.control_center.technical_engine')}
              </div>
              <div className="text-xs text-slate-400">Warren Buffett</div>
              {aiConfigs.claude.enabled && (
                <div className="text-xs text-green-400 font-medium mt-1">● 已启用</div>
              )}
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="relative w-8 h-8 mx-auto mb-2">
                <img 
                  src={billAvatar} 
                  alt="Bill Gates" 
                  className={`w-8 h-8 rounded-full object-cover transition-all duration-300 ${
                    aiConfigs.grok.enabled 
                      ? 'shadow-lg shadow-green-400/50 ring-2 ring-green-400/60 animate-pulse' 
                      : 'opacity-60'
                  }`} 
                />
                {aiConfigs.grok.enabled && (
                  <div className="absolute -inset-1 bg-green-400/20 rounded-full animate-ping"></div>
                )}
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                aiConfigs.grok.enabled ? 'text-green-300' : 'text-white'
              }`}>
                {t('ai.control_center.bigdata_engine')}
              </div>
              <div className="text-xs text-slate-400">Bill Gates</div>
              {aiConfigs.grok.enabled && (
                <div className="text-xs text-green-400 font-medium mt-1">● 已启用</div>
              )}
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="relative w-8 h-8 mx-auto mb-2">
                <img 
                  src={vitalikAvatar} 
                  alt="Vitalik Buterin" 
                  className={`w-8 h-8 rounded-full object-cover transition-all duration-300 ${
                    aiConfigs.vitalik.enabled 
                      ? 'shadow-lg shadow-green-400/50 ring-2 ring-green-400/60 animate-pulse' 
                      : 'opacity-60'
                  }`} 
                />
                {aiConfigs.vitalik.enabled && (
                  <div className="absolute -inset-1 bg-green-400/20 rounded-full animate-ping"></div>
                )}
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                aiConfigs.vitalik.enabled ? 'text-green-300' : 'text-white'
              }`}>
                {t('ai.control_center.blockchain_engine')}
              </div>
              <div className="text-xs text-slate-400">Vitalik Buterin</div>
              {aiConfigs.vitalik.enabled && (
                <div className="text-xs text-green-400 font-medium mt-1">● 已启用</div>
              )}
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="relative w-8 h-8 mx-auto mb-2">
                <img 
                  src={justinAvatar} 
                  alt="Justin Sun" 
                  className={`w-8 h-8 rounded-full object-cover transition-all duration-300 ${
                    aiConfigs.justin.enabled 
                      ? 'shadow-lg shadow-green-400/50 ring-2 ring-green-400/60 animate-pulse' 
                      : 'opacity-60'
                  }`} 
                />
                {aiConfigs.justin.enabled && (
                  <div className="absolute -inset-1 bg-green-400/20 rounded-full animate-ping"></div>
                )}
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                aiConfigs.justin.enabled ? 'text-green-300' : 'text-white'
              }`}>
                {t('ai.control_center.defi_engine')}
              </div>
              <div className="text-xs text-slate-400">Justin Sun</div>
              {aiConfigs.justin.enabled && (
                <div className="text-xs text-green-400 font-medium mt-1">● 已启用</div>
              )}
            </div>
            
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="relative w-8 h-8 mx-auto mb-2">
                <img 
                  src={trumpAvatar} 
                  alt="Donald Trump" 
                  className={`w-8 h-8 rounded-full object-cover transition-all duration-300 ${
                    aiConfigs.trump.enabled 
                      ? 'shadow-lg shadow-green-400/50 ring-2 ring-green-400/60 animate-pulse' 
                      : 'opacity-60'
                  }`} 
                />
                {aiConfigs.trump.enabled && (
                  <div className="absolute -inset-1 bg-green-400/20 rounded-full animate-ping"></div>
                )}
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                aiConfigs.trump.enabled ? 'text-green-300' : 'text-white'
              }`}>
                {t('ai.control_center.policy_engine')}
              </div>
              <div className="text-xs text-slate-400">Donald Trump</div>
              {aiConfigs.trump.enabled && (
                <div className="text-xs text-green-400 font-medium mt-1">● 已启用</div>
              )}
            </div>
            
            {/* Custom APIs */}
            {customApis.map((api) => (
              <div key={api.id} className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="relative w-8 h-8 mx-auto mb-2">
                  <img 
                    src={api.avatar || "/lovable-uploads/9cc92493-5e50-470d-9543-d2fe07d350f6.png"} 
                    alt={api.name} 
                    className={`w-8 h-8 rounded-full object-cover transition-all duration-300 ${
                      api.enabled 
                        ? 'shadow-lg shadow-green-400/50 ring-2 ring-green-400/60 animate-pulse' 
                        : 'opacity-60'
                    }`} 
                  />
                  {api.enabled && (
                    <div className="absolute -inset-1 bg-green-400/20 rounded-full animate-ping"></div>
                  )}
                </div>
                <div className={`text-sm font-medium transition-colors duration-300 ${
                  api.enabled ? 'text-green-300' : 'text-white'
                }`}>
                  {api.provider}
                </div>
                <div className="text-xs text-slate-400">{api.name}</div>
                {api.enabled && (
                  <div className="text-xs text-green-400 font-medium mt-1">● 已启用</div>
                )}
              </div>
            ))}
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
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{t('ai.control_center.elon_config')}</h3>
                  <Badge variant="outline" className="text-blue-400 border-blue-400/20 mt-1">{t('ai.control_center.news_engine')}</Badge>
                </div>
                {aiConfigs.openai.enabled && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">已启用</span>
                  </div>
                )}
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
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{t('ai.control_center.warren_config')}</h3>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/20 mt-1">{t('ai.control_center.technical_engine')}</Badge>
                </div>
                {aiConfigs.claude.enabled && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">已启用</span>
                  </div>
                )}
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
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{t('ai.control_center.bill_config')}</h3>
                  <Badge variant="outline" className="text-green-400 border-green-400/20 mt-1">{t('ai.control_center.bigdata_engine')}</Badge>
                </div>
                {aiConfigs.grok.enabled && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">已启用</span>
                  </div>
                )}
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
              </div>
            </div>
          </div>
        </Card>

        {/* Vitalik Buterin Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={vitalikAvatar} alt="Vitalik Buterin" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{t('ai.control_center.vitalik_config')}</h3>
                <Badge variant="outline" className="text-cyan-400 border-cyan-400/20 mt-1">{t('ai.control_center.blockchain_engine')}</Badge>
              </div>
              {aiConfigs.vitalik.enabled && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">已启用</span>
                </div>
              )}
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
              </div>
          </div>
        </Card>

        {/* Justin Sun Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={justinAvatar} alt="Justin Sun" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{t('ai.control_center.justin_config')}</h3>
                <Badge variant="outline" className="text-orange-400 border-orange-400/20 mt-1">{t('ai.control_center.defi_engine')}</Badge>
              </div>
              {aiConfigs.justin.enabled && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">已启用</span>
                </div>
              )}
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
              </div>
            </div>
          </div>
        </Card>

        {/* Donald Trump Configuration */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src={trumpAvatar} alt="Donald Trump" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{t('ai.control_center.trump_config')}</h3>
                  <Badge variant="outline" className="text-red-400 border-red-400/20 mt-1">{t('ai.control_center.policy_engine')}</Badge>
                </div>
                {aiConfigs.trump.enabled && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">已启用</span>
                  </div>
                )}
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
              </div>
          </div>
        </Card>

        {/* Custom API Configurations */}
        {customApis.map((api) => (
          <Card key={api.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={api.avatar || "/lovable-uploads/9cc92493-5e50-470d-9543-d2fe07d350f6.png"} 
                  alt={api.name} 
                  className="w-10 h-10 rounded-full object-cover" 
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{api.name}</h3>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/20 mt-1">{api.provider}</Badge>
                </div>
                {api.enabled && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">已启用</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCustomApi(api.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-slate-400 mb-4">{api.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={api.enabled}
                      onChange={(e) => handleToggleCustomApi(api.id, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-300">启用 {api.name}</span>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-300 block mb-2">API 密钥</label>
                    <Input
                      placeholder="API密钥已保存"
                      type="password"
                      value="••••••••••••••••"
                      disabled
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  {api.endpoint && (
                    <div>
                      <label className="text-sm text-slate-300 block mb-2">API 端点</label>
                      <Input
                        value={api.endpoint}
                        disabled
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  )}
                  
                  <div className="text-xs text-slate-500 bg-slate-700/30 p-3 rounded">
                    🔧 自定义API配置 • 创建时间: {new Date(parseInt(api.id)).toLocaleDateString()}
                  </div>
                </div>
            </div>
          </Card>
        ))}

        {/* Add New API Button */}
        <Card className="bg-gradient-to-br from-purple-900/30 via-blue-800/20 to-purple-900/30 border border-purple-500/30 backdrop-blur-sm">
          <div className="p-6">
            <Button
              onClick={() => setShowAddApiModal(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 py-6"
            >
              <Bot className="w-5 h-5 mr-3" />
              <span className="text-lg font-medium">添加新的 API 接口</span>
            </Button>
            <p className="text-center text-slate-400 text-sm mt-3">
              连接您自己的AI模型和API服务
            </p>
          </div>
        </Card>

        {/* Add API Modal */}
        {showAddApiModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">添加新的 API 接口</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddApiModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 block mb-2">API 名称 *</label>
                  <Input
                    placeholder="例如: My Custom GPT"
                    value={newApiForm.name}
                    onChange={(e) => setNewApiForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">提供商 *</label>
                  <Input
                    placeholder="例如: OpenAI, Anthropic, Custom"
                    value={newApiForm.provider}
                    onChange={(e) => setNewApiForm(prev => ({ ...prev, provider: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">自定义头像</label>
                  
                  {/* Avatar Upload Section */}
                  <div className="space-y-4">
                    {/* File Upload Area */}
                    <div
                      className="relative border-2 border-dashed border-slate-600 rounded-lg p-6 transition-colors hover:border-purple-400 hover:bg-purple-500/5"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 pointer-events-auto"
                        disabled={isUploading}
                      />
                      
                      <div className="text-center">
                        <div className="flex flex-col items-center gap-3">
                          {isUploading ? (
                            <>
                              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                              <div className="text-sm text-slate-400">上传中... {uploadProgress}%</div>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <Upload className="w-6 h-6 text-purple-400" />
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-slate-300 font-medium">
                                  点击或拖拽图片到这里上传
                                </div>
                                <div className="text-xs text-slate-400">
                                  支持 JPG、PNG、GIF 格式，最大5MB
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Upload Progress Bar */}
                      {isUploading && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="w-full bg-slate-700 rounded-full h-1">
                            <div 
                              className="bg-purple-400 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-600"></div>
                      <span className="text-xs text-slate-400 px-2">或者</span>
                      <div className="flex-1 h-px bg-slate-600"></div>
                    </div>

                    {/* URL Input */}
                    <div>
                      <Input
                        placeholder="输入头像图片URL链接"
                        value={customAvatarUrl}
                        onChange={(e) => {
                          setCustomAvatarUrl(e.target.value);
                          if (e.target.value.trim()) {
                            setNewApiForm(prev => ({ ...prev, avatar: e.target.value }));
                          }
                        }}
                        className="bg-slate-600/50 border-slate-500 text-white"
                        disabled={isUploading}
                      />
                    </div>

                    {/* Avatar Preview */}
                    {(customAvatarUrl || newApiForm.avatar) && (
                      <div className="flex items-center gap-3 p-4 bg-slate-600/30 rounded-lg border border-purple-500/20">
                        <div className="relative">
                          <img 
                            src={customAvatarUrl || newApiForm.avatar} 
                            alt="头像预览" 
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-400/50"
                            onError={(e) => {
                              e.currentTarget.src = "/lovable-uploads/9cc92493-5e50-470d-9543-d2fe07d350f6.png";
                            }}
                          />
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div className="text-sm text-green-300 font-medium">头像已设置</div>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">将用作您的AI助手头像</div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCustomAvatarUrl('');
                            setNewApiForm(prev => ({ ...prev, avatar: '' }));
                          }}
                          className="text-slate-400 hover:text-red-400"
                          disabled={isUploading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* Help Text */}
                    <div className="text-xs text-slate-500 space-y-1 bg-slate-700/20 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Image className="w-3 h-3 mt-0.5 text-purple-400" />
                        <div className="space-y-1">
                          <div>• 推荐尺寸: 200x200像素以上，正方形效果最佳</div>
                          <div>• 支持格式: JPG、PNG、GIF</div>
                          <div>• 文件大小: 最大5MB</div>
                          <div>• 上传的图片会存储在安全的云端</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">API 密钥 *</label>
                  <Input
                    type="password"
                    placeholder="输入您的API密钥"
                    value={newApiForm.apiKey}
                    onChange={(e) => setNewApiForm(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">API 端点 (可选)</label>
                  <Input
                    placeholder="例如: https://api.openai.com/v1"
                    value={newApiForm.endpoint}
                    onChange={(e) => setNewApiForm(prev => ({ ...prev, endpoint: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300 block mb-2">描述</label>
                  <Input
                    placeholder="这个API的用途和特点"
                    value={newApiForm.description}
                    onChange={(e) => setNewApiForm(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddCustomApi}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    disabled={!newApiForm.name.trim() || !newApiForm.provider.trim() || !newApiForm.apiKey.trim()}
                  >
                    添加 API
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddApiModal(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    取消
                  </Button>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-700/30 p-3 rounded mt-4">
                🔒 您的API密钥将安全存储在本地浏览器中
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 新增绘图注释状态
  const [drawingAnnotations, setDrawingAnnotations] = useState<Array<{
    id: string;
    type: 'line' | 'support' | 'resistance' | 'fibonacci' | 'note';
    coordinates: Array<{x: number, y: number}>;
    color: string;
    text?: string;
    timestamp: Date;
  }>>([]);

  // 处理AI绘图分析
  const handleDrawAnalysis = useCallback((coordinates: Array<{x: number, y: number}>, type: string) => {
    const newAnnotation = {
      id: Date.now().toString(),
      type: 'support' as const,
      coordinates,
      color: '#22c55e',
      text: 'AI分析：关键支撑/阻力位',
      timestamp: new Date()
    };
    setDrawingAnnotations(prev => [...prev, newAnnotation]);
  }, []);

  // 添加绘图注释
  const handleAddAnnotation = useCallback((annotation: any) => {
    setDrawingAnnotations(prev => [...prev, annotation]);
  }, []);

  const RealTimeAnalysisPanel = () => (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
      {/* Left Panel - Enhanced AI Chat */}
      <div className="col-span-4 h-full">
        <EnhancedAIChat 
          selectedCrypto={selectedCrypto}
          aiConfigs={aiConfigs}
          customApis={customApis}
          onDrawAnalysis={handleDrawAnalysis}
        />
      </div>

      {/* Right Panel - Enhanced Chart */}
      <div className="col-span-8 h-full">
        <EnhancedChartPanel 
          selectedCrypto={selectedCrypto}
          onCryptoChange={setSelectedCrypto}
          cryptoOptions={cryptoOptions}
          drawingAnnotations={drawingAnnotations}
          onAddAnnotation={handleAddAnnotation}
        />
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
            <TabsList className="grid grid-cols-4 bg-slate-800/50 border-slate-700 mb-6">
              <TabsTrigger 
                value="professional" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-blue-500 data-[state=active]:text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                专业交易配置
              </TabsTrigger>
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

            <TabsContent value="professional" className="mt-0 h-full">
              <ProfessionalTradingConfig />
            </TabsContent>

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