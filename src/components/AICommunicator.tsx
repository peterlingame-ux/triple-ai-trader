import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

interface AICommunicatorProps {
  cryptoData?: any[];
  newsData?: any[];
}

export const AICommunicator = ({ cryptoData = [], newsData = [] }: AICommunicatorProps) => {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { 
          prompt,
          model: 'gpt-4o-mini'
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setResponse(data.response);
        toast({
          title: "AI Response",
          description: "Got response from OpenAI successfully!",
        });
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('OpenAI Chat Error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to get AI response',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t('ai.communicate')}
        </CardTitle>
        <CardDescription>
          Ask questions about cryptocurrency trading and market analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask about crypto trading strategies, market analysis..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !prompt.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        {response && (
          <div className="mt-4 p-4 bg-secondary/50 rounded-lg border">
            <h4 className="font-medium mb-2">AI Response:</h4>
            <ScrollArea className="h-64 w-full">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap pr-4">{response}</p>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};