import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, Mic, Square, Volume2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

// Import avatars
import elonAvatar from "@/assets/elon-musk-cartoon-avatar.png";
import warrenAvatar from "@/assets/warren-buffett-cartoon-avatar.png";
import billAvatar from "@/assets/bill-gates-cartoon-avatar.png";
import vitalikAvatar from "@/assets/vitalik-buterin-cartoon-avatar.png";
import justinAvatar from "@/assets/justin-sun-cartoon-avatar.png";
import trumpAvatar from "@/assets/donald-trump-cartoon-avatar.png";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system' | 'analysis';
  content: string;
  timestamp: Date;
  engine?: string;
  avatar?: string;
}

interface AIEngine {
  id: string;
  name: string;
  avatar: string;
  color: string;
  enabled: boolean;
  description: string;
}

interface EnhancedAIChatProps {
  selectedCrypto: string;
  aiConfigs: Record<string, { enabled: boolean; apiKey: string; model: string }>;
  customApis: Array<{
    id: string;
    name: string;
    enabled: boolean;
    avatar: string;
  }>;
  onDrawAnalysis: (coordinates: Array<{x: number, y: number}>, type: string) => void;
}

export const EnhancedAIChat = ({ selectedCrypto, aiConfigs, customApis, onDrawAnalysis }: EnhancedAIChatProps) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeEngine, setActiveEngine] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 定义AI引擎配置
  const aiEngines: AIEngine[] = [
    {
      id: 'openai',
      name: 'Elon Musk',
      avatar: elonAvatar,
      color: 'text-blue-400',
      enabled: aiConfigs.openai?.enabled || false,
      description: t('ai.control_center.news_engine')
    },
    {
      id: 'claude',
      name: 'Warren Buffett', 
      avatar: warrenAvatar,
      color: 'text-purple-400',
      enabled: aiConfigs.claude?.enabled || false,
      description: t('ai.control_center.technical_engine')
    },
    {
      id: 'grok',
      name: 'Bill Gates',
      avatar: billAvatar,
      color: 'text-green-400',
      enabled: aiConfigs.grok?.enabled || false,
      description: t('ai.control_center.bigdata_engine')
    },
    {
      id: 'vitalik',
      name: 'Vitalik Buterin',
      avatar: vitalikAvatar,
      color: 'text-cyan-400',
      enabled: aiConfigs.vitalik?.enabled || false,
      description: t('ai.control_center.blockchain_engine')
    },
    {
      id: 'justin',
      name: 'Justin Sun',
      avatar: justinAvatar,
      color: 'text-orange-400',
      enabled: aiConfigs.justin?.enabled || false,
      description: t('ai.control_center.defi_engine')
    },
    {
      id: 'trump',
      name: 'Donald Trump',
      avatar: trumpAvatar,
      color: 'text-red-400',
      enabled: aiConfigs.trump?.enabled || false,
      description: t('ai.control_center.policy_engine')
    }
  ];

  // 获取启用的引擎（包括自定义API）
  const enabledEngines = [
    ...aiEngines.filter(engine => engine.enabled),
    ...customApis.filter(api => api.enabled).map(api => ({
      id: api.id,
      name: api.name,
      avatar: api.avatar,
      color: 'text-indigo-400',
      enabled: true,
      description: 'Custom AI Engine'
    }))
  ];

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAnalyzing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsAnalyzing(true);

    try {
      // 模拟AI分析和响应
      await simulateAIAnalysis(inputMessage);
    } catch (error) {
      console.error('AI分析失败:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 模拟AI分析
  const simulateAIAnalysis = async (query: string) => {
    setActiveEngine('analyzing');
    
    // 随机选择启用的引擎进行分析
    const responses = await Promise.all(
      enabledEngines.map(async (engine, index) => {
        await new Promise(resolve => setTimeout(resolve, 1000 + index * 500));
        
        let response = "";
        const isDrawingCommand = query.toLowerCase().includes('画') || 
                               query.toLowerCase().includes('标记') || 
                               query.toLowerCase().includes('draw') ||
                               query.toLowerCase().includes('mark');
        
        if (isDrawingCommand) {
          response = generateDrawingResponse(engine.name, selectedCrypto);
          // 模拟在图表上画图
          setTimeout(() => {
            const mockCoordinates = Array.from({length: 5}, (_, i) => ({
              x: 100 + i * 50,
              y: 200 + Math.sin(i) * 30
            }));
            onDrawAnalysis(mockCoordinates, 'support_resistance');
          }, 2000);
        } else {
          response = generateAnalysisResponse(engine.name, selectedCrypto, query);
        }

        const aiMessage: ChatMessage = {
          id: `${Date.now()}_${engine.id}`,
          type: 'ai',
          content: response,
          timestamp: new Date(),
          engine: engine.name,
          avatar: engine.avatar
        };

        setMessages(prev => [...prev, aiMessage]);
        setActiveEngine(engine.id);
        
        return aiMessage;
      })
    );

    setActiveEngine(null);
  };

  // 生成分析响应
  const generateAnalysisResponse = (engineName: string, crypto: string, query: string) => {
    const responses = {
      'Elon Musk': `🚀 根据最新市场动态，${crypto}正在经历重要的技术突破期。从新闻情绪分析来看，市场对${crypto}的关注度持续上升，建议密切关注突破位置。`,
      'Warren Buffett': `📊 从技术分析角度，${crypto}当前RSI指标显示超买信号，MACD形成背离，建议等待回调至支撑位再考虑进场。止损设在关键支撑下方。`,
      'Bill Gates': `💡 大数据分析显示，${crypto}的交易量在过去24小时内增长了35%，链上活跃地址数量创新高，这通常预示着价格的重要变化。`,
      'Vitalik Buterin': `🔗 从区块链数据分析，${crypto}网络活跃度显著提升，Gas费用稳定，这为价格上涨提供了基本面支撑。`,
      'Justin Sun': `💰 DeFi协议中${crypto}的锁仓量持续增加，流动性挖矿收益率保持稳定，这对价格形成正向支撑。`,
      'Donald Trump': `🏛️ 最新政策动向显示，监管环境趋于明朗，这对${crypto}等主流加密货币是利好消息，预期将推动机构资金入场。`
    };
    
    return responses[engineName as keyof typeof responses] || `分析${crypto}的${query}...`;
  };

  // 生成画图响应
  const generateDrawingResponse = (engineName: string, crypto: string) => {
    return `🎯 我正在图表上为您标记${crypto}的关键位置... 请注意图表上的分析线条，我已经标出了重要的支撑位和阻力位。`;
  };

  // 语音输入
  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // TODO: 实现语音识别功能
  };

  // 快速问题模板
  const quickQuestions = [
    `分析${selectedCrypto}的技术指标`,
    `${selectedCrypto}的支撑位和阻力位在哪里？`,
    `请在图上画出${selectedCrypto}的趋势线`,
    `${selectedCrypto}的市场情绪如何？`,
    `预测${selectedCrypto}未来走势`
  ];

  return (
    <Card className="h-full bg-slate-900/95 border-slate-700/50 backdrop-blur-sm">
      <div className="p-3 h-full flex flex-col">
        {/* Header - 紧凑型 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <Brain className="w-4 h-4 text-yellow-400" />
            {isAnalyzing && (
              <div className="absolute -inset-0.5 bg-yellow-400/20 rounded-full animate-ping"></div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI实时分析</h3>
            <p className="text-xs text-slate-400">
              {enabledEngines.length}个引擎 • {selectedCrypto}
            </p>
          </div>
        </div>

        {/* 启用的AI引擎状态 - 紧凑型 */}
        <div className="mb-3">
          <div className="text-xs text-slate-500 mb-1">活跃引擎：</div>
          <div className="flex flex-wrap gap-1">
            {enabledEngines.map((engine) => (
              <div key={engine.id} className="flex items-center gap-1 bg-slate-800/60 rounded px-2 py-1">
                <div className="relative">
                  <img 
                    src={engine.avatar} 
                    alt={engine.name}
                    className={`w-4 h-4 rounded-full object-cover transition-all duration-300 ${
                      activeEngine === engine.id 
                        ? 'shadow-sm shadow-green-400/50 ring-1 ring-green-400/60 animate-pulse' 
                        : 'opacity-80'
                    }`} 
                  />
                  {activeEngine === engine.id && (
                    <div className="absolute -inset-0.5 bg-green-400/20 rounded-full animate-ping"></div>
                  )}
                </div>
                <div className="text-xs">
                  <div className="text-white font-medium leading-none">{engine.name.split(' ')[0]}</div>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  activeEngine === engine.id ? 'bg-green-400 animate-pulse' : 'bg-slate-600'
                }`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* 消息区域 - 紧凑型 */}
        <div className="flex-1 mb-3">
          <ScrollArea className="h-full pr-2">
            <div className="space-y-2">
              {/* 系统欢迎消息 */}
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <div className="text-slate-400 text-xs mb-2">
                    👋 AI实时分析就绪
                  </div>
                  <div className="space-y-1">
                    {quickQuestions.slice(0, 3).map((question, index) => (
                      <div
                        key={index}
                        className="text-left text-slate-300 text-xs p-2 rounded bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer transition-colors border border-slate-700/30"
                        onClick={() => setInputMessage(question)}
                      >
                        💡 {question}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 消息列表 */}
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    {message.type === 'user' ? (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        U
                      </div>
                    ) : (
                      <img 
                        src={message.avatar} 
                        alt={message.engine}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-yellow-400/30"
                      />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[85%] ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-2 rounded ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                        : 'bg-slate-800/80 text-white border border-slate-700/30'
                    }`}>
                      {message.engine && (
                        <div className="text-xs text-yellow-400 mb-0.5 font-medium">
                          {message.engine}
                        </div>
                      )}
                      <div className="text-xs leading-relaxed">{message.content}</div>
                      <div className="text-xs mt-1 opacity-50">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* 分析中状态 */}
              {isAnalyzing && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-800/80 p-2 rounded border border-slate-700/30">
                      <div className="text-yellow-400 text-xs mb-0.5">分析中...</div>
                      <div className="text-slate-300 text-xs">
                        调用 {enabledEngines.length} 个AI引擎
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* 输入区域 - 紧凑型 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="询问AI技术分析..."
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-500 text-xs h-8 pr-16"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isAnalyzing}
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-0.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleVoiceInput}
                  className={`text-slate-400 hover:text-white p-0.5 h-5 w-5 ${isListening ? 'text-red-400' : ''}`}
                >
                  {isListening ? <Square className="w-2.5 h-2.5" /> : <Mic className="w-2.5 h-2.5" />}
                </Button>
                <Button
                  size="sm" 
                  variant="ghost"
                  className="text-slate-400 hover:text-white p-0.5 h-5 w-5"
                >
                  <Volume2 className="w-2.5 h-2.5" />
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isAnalyzing}
              size="sm"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 h-8 px-3"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
          
          {/* 状态指示器 */}
          <div className="flex items-center justify-between text-xs">
            <div className="text-slate-500">
              {isAnalyzing ? '🤖 AI分析中...' : `💡 快速分析`}
            </div>
            <div className="text-slate-500">
              {enabledEngines.length > 0 ? `✅ ${enabledEngines.length}引擎` : '⚠️ 需启用引擎'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};