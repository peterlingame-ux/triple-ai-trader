import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageCircle, Send, TrendingUp, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChartAIChatProps {
  symbol: string;
  isOpen: boolean;
  onToggle: () => void;
  chartData?: {
    price: number;
    change24h: number;
    volume24h: number;
    high24h: number;
    low24h: number;
    technicalIndicators?: any;
  };
  marketData?: {
    marketCap: number;
    dominance?: number;
  };
}

export const ChartAIChat: React.FC<ChartAIChatProps> = ({
  symbol,
  isOpen,
  onToggle,
  chartData,
  marketData
}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'ai',
        content: `你好！我是${symbol}图表分析AI助手。你可以询问我关于这个图表的任何问题，比如：\n\n• 当前价格趋势如何？\n• 技术面分析怎么样？\n• 有什么交易建议吗？\n• 支撑阻力位在哪里？\n\n我会基于实时数据为你提供专业分析！`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, symbol, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('chart-ai-analysis', {
        body: {
          question: userMessage.content,
          symbol: symbol,
          chartData: chartData,
          marketData: marketData
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      toast({
        title: "AI分析完成",
        description: "已为您生成专业图表分析",
      });

    } catch (error) {
      console.error('AI分析错误:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，AI分析出现了问题。请检查网络连接或稍后再试。如果问题持续，请联系技术支持。',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "AI分析失败",
        description: "请检查网络连接或稍后重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    '当前趋势如何？',
    '技术面分析',
    '支撑阻力位',
    '交易建议'
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        size="lg"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        图表AI助手
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 h-[500px] bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">图表AI助手</h3>
            <p className="text-xs text-muted-foreground">{symbol} 专业分析</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* 消息区域 */}
      <ScrollArea className="flex-1 p-4" style={{ height: '360px' }} ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-muted text-foreground mr-4'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {/* 建议问题 */}
          {messages.length === 1 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">快速提问：</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <Badge
                    key={question}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setInputValue(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* 输入区域 */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="询问图表相关问题..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};