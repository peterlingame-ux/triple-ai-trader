import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Send, Bot, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

interface CryptoAnalytics {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  dominance: number;
  rsi: number;
  ma20: number;
  ma50: number;
  support: number;
  resistance: number;
}

export const AICommunicator = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);

  // Mock cryptocurrency analytics data
  const cryptoAnalytics: CryptoAnalytics[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 43250,
      change24h: 1245.50,
      changePercent24h: 2.97,
      volume24h: 18500000000,
      marketCap: 847000000000,
      dominance: 51.2,
      rsi: 67.3,
      ma20: 42100,
      ma50: 39800,
      support: 41500,
      resistance: 45000
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 2567,
      change24h: -45.30,
      changePercent24h: -1.73,
      volume24h: 12300000000,
      marketCap: 308000000000,
      dominance: 18.6,
      rsi: 45.2,
      ma20: 2650,
      ma50: 2720,
      support: 2450,
      resistance: 2750
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 98.75,
      change24h: 3.42,
      changePercent24h: 3.59,
      volume24h: 2100000000,
      marketCap: 43500000000,
      dominance: 2.6,
      rsi: 72.1,
      ma20: 95.20,
      ma50: 89.50,
      support: 92.00,
      resistance: 105.00
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const newConversation = [...conversation, { role: 'user' as const, content: message }];
    
    // Simulate AI response combining all three advisors
    const aiResponse = generateCombinedResponse(message);
    newConversation.push({ role: 'ai' as const, content: aiResponse });
    
    setConversation(newConversation);
    setMessage("");
    
    toast({
      title: "Message Sent",
      description: "AI advisors are analyzing your request...",
    });
  };

  const generateCombinedResponse = (userMessage: string) => {
    const responses = [
      "🚀 Elon: " + getElonResponse(userMessage),
      "💰 Warren: " + getWarrenResponse(userMessage), 
      "🔬 Bill: " + getBillResponse(userMessage)
    ];
    
    return `**Combined Analysis from Meta BrainX:**\n\n${responses.join('\n\n')}\n\n**Unified Recommendation:** Based on our collective analysis, we recommend a balanced approach combining innovation investment, value-based decisions, and technological infrastructure development.`;
  };

  const getElonResponse = (message: string) => {
    if (message.toLowerCase().includes('crypto') || message.toLowerCase().includes('bitcoin')) {
      return "Crypto is the future of interplanetary commerce! Mars missions need funding. DOGE to the moon! 🐕🚀";
    }
    return "Think exponentially, invest in the future. Electric vehicles, space exploration, and neural interfaces will transform humanity.";
  };

  const getWarrenResponse = (message: string) => {
    if (message.toLowerCase().includes('investment') || message.toLowerCase().includes('stock')) {
      return "Buy wonderful businesses at fair prices. Time in the market beats timing the market. Focus on long-term value creation.";
    }
    return "Be fearful when others are greedy, and greedy when others are fearful. Invest in what you understand.";
  };

  const getBillResponse = (message: string) => {
    if (message.toLowerCase().includes('technology') || message.toLowerCase().includes('AI')) {
      return "Technology should empower everyone and solve humanity's greatest challenges. Focus on scalable solutions with positive global impact.";
    }
    return "Innovation in healthcare, education, and clean energy will drive the next wave of human progress.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-orbitron tracking-wide px-6 py-2">
          <MessageSquare className="w-4 h-4 mr-2" />
          {t('ai.communicate')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-6xl bg-slate-900 border-slate-700 max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 font-orbitron">
            <Bot className="w-5 h-5" />
            SUPREME BRAIN - Triple AI Advisors
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-4">
          {/* Left side - Conversation */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* Conversation Area */}
            <div className="flex-1 bg-slate-800/50 rounded-lg p-4 max-h-80 overflow-y-auto space-y-3">
              {conversation.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                  <p className="font-inter">Ask the Supreme Brain for combined insights from Elon, Warren, and Bill</p>
                </div>
              ) : (
                conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-slate-100'
                    }`}>
                      <p className="text-sm font-inter whitespace-pre-line">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Input Area */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Enter your investment question..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700 px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right side - Crypto Analytics Dashboard */}
          <div className="w-96 bg-slate-800/30 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-orbitron font-semibold">Live Analytics</h3>
            </div>

            {/* Market Overview */}
            <div className="bg-slate-700/50 rounded-lg p-3 space-y-3">
              <h4 className="text-slate-300 font-inter text-sm font-medium">Market Overview</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-slate-400">Total Cap</p>
                  <p className="text-white font-mono">$1.65T</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">24h Vol</p>
                  <p className="text-white font-mono">$67.2B</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">BTC Dom</p>
                  <p className="text-white font-mono">51.2%</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">Fear & Greed</p>
                  <p className="text-yellow-400 font-mono">68</p>
                </div>
              </div>
            </div>

            {/* Detailed Crypto Analytics */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cryptoAnalytics.map((crypto, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-white font-inter font-medium text-sm">{crypto.symbol}</h5>
                    <div className={`flex items-center gap-1 text-xs ${
                      crypto.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {crypto.changePercent24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {crypto.changePercent24h.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400">Price</p>
                      <p className="text-white font-mono">${crypto.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Volume</p>
                      <p className="text-white font-mono">${(crypto.volume24h / 1e9).toFixed(1)}B</p>
                    </div>
                    <div>
                      <p className="text-slate-400">RSI</p>
                      <p className={`font-mono ${crypto.rsi > 70 ? 'text-red-400' : crypto.rsi < 30 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {crypto.rsi}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">MA20</p>
                      <p className="text-slate-300 font-mono">${crypto.ma20.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Support</p>
                      <p className="text-green-400 font-mono">${crypto.support.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Resistance</p>
                      <p className="text-red-400 font-mono">${crypto.resistance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trading Signals */}
            <div className="bg-slate-700/50 rounded-lg p-3">
              <h4 className="text-slate-300 font-inter text-sm font-medium mb-2">AI Signals</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">BTC Trend</span>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">BULLISH</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ETH Momentum</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">NEUTRAL</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SOL Pattern</span>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">BREAKOUT</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};