import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Send, Bot } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

export const AICommunicator = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);

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
      
      <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-700 max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 font-orbitron">
            <Bot className="w-5 h-5" />
            最强大脑 - 三合一AI顾问
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4">
          {/* Conversation Area */}
          <div className="flex-1 bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
            {conversation.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                <Bot className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                <p className="font-inter">向最强大脑提问，获得Elon、Warren和Bill的综合建议</p>
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
              placeholder="输入您的投资问题..."
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
      </DialogContent>
    </Dialog>
  );
};