import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CryptoCurrencySelector } from './CryptoCurrencySelector';
import { Crypto3DIcon } from './Crypto3DIcon';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  crypto?: { symbol: string; name: string };
}

export function CryptoAIChat() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<{ symbol: string; name: string } | undefined>();
  const { toast } = useToast();

  // 预设问题模板
  const questionTemplates = [
    "今天的走势如何？有什么技术指标需要注意？",
    "近期的价格预测和市场分析",
    "适合买入还是卖出？给出具体的交易建议",
    "与其他主流币种相比，投资价值如何？",
    "最新的项目进展和生态发展情况"
  ];

  const handleCryptoSelect = (symbol: string, name: string) => {
    setSelectedCrypto({ symbol, name });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (!selectedCrypto) {
      toast({
        title: "请选择货币",
        description: "请先选择要咨询的加密货币",
        variant: "destructive"
      });
      return;
    }

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
      crypto: selectedCrypto
    };
    setMessages(prev => [...prev, userMessage]);

    // 构建包含加密货币上下文的提示
    const contextualPrompt = `关于 ${selectedCrypto.name}(${selectedCrypto.symbol})：${prompt}
    
请提供专业的加密货币分析，包括：
1. 技术面分析（如有相关数据）
2. 基本面分析
3. 市场情绪和趋势
4. 风险评估
5. 具体的操作建议（仅供参考，不构成投资建议）`;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { 
          prompt: contextualPrompt,
          model: 'gpt-4o-mini'
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        // 添加AI回复
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          crypto: selectedCrypto
        };
        setMessages(prev => [...prev, aiMessage]);
        
        toast({
          title: "AI 分析完成",
          description: `已为您分析 ${selectedCrypto.symbol} 的相关问题`,
        });
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      toast({
        title: "分析失败",
        description: error.message || '无法获取AI分析，请稍后重试',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  const handleQuickQuestion = (question: string) => {
    setPrompt(question);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左侧：货币选择器 */}
      <div className="lg:col-span-1">
        <CryptoCurrencySelector 
          onCryptoSelect={handleCryptoSelect}
          selectedCrypto={selectedCrypto}
        />

        {/* 快速问题模板 */}
        {selectedCrypto && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                快速提问
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {questionTemplates.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-2 text-wrap"
                  onClick={() => handleQuickQuestion(question)}
                >
                  <div className="text-xs">{question}</div>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 右侧：AI聊天界面 */}
      <div className="lg:col-span-2">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI 加密货币顾问
              {selectedCrypto && (
                <div className="flex items-center gap-2 ml-4">
                  <Crypto3DIcon symbol={selectedCrypto.symbol} size={20} />
                  <span className="text-sm font-normal text-muted-foreground">
                    正在分析 {selectedCrypto.symbol}
                  </span>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              选择加密货币后，询问价格预测、技术分析、市场趋势等问题
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            {/* 聊天消息区域 */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>选择一种加密货币开始咨询吧！</p>
                    <p className="text-sm mt-2">我可以为您提供专业的市场分析和投资建议</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary/50 border'
                        }`}>
                          {message.crypto && message.role === 'user' && (
                            <div className="flex items-center gap-2 mb-2 text-xs opacity-80">
                              <Crypto3DIcon symbol={message.crypto.symbol} size={16} />
                              <span>{message.crypto.symbol}</span>
                            </div>
                          )}
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* 输入区域 */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  selectedCrypto 
                    ? `询问关于 ${selectedCrypto.symbol} 的问题...` 
                    : "请先选择要咨询的加密货币"
                }
                className="flex-1"
                disabled={loading || !selectedCrypto}
              />
              <Button 
                type="submit" 
                disabled={loading || !prompt.trim() || !selectedCrypto}
                className="px-6"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}