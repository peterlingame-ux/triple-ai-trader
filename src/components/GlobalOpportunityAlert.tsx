import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, Zap, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { OpportunityAlert } from "@/types/api";

interface GlobalOpportunityAlertProps {
  onTakeAction?: (alert: OpportunityAlert) => void;
}

export const GlobalOpportunityAlert = ({ onTakeAction }: GlobalOpportunityAlertProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<OpportunityAlert | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const handleOpportunityDetected = (event: CustomEvent<OpportunityAlert>) => {
      const alert = event.detail;
      setCurrentAlert(alert);
      setIsOpen(true);
      
      // 显示系统通知
      toast({
        title: "🧠 " + t('ai.high_probability_opportunity'),
        description: `${alert.symbol} ${alert.signal === 'buy' ? '🚀' : '📉'} ${t('ai.win_rate')}${alert.confidence}%`,
        duration: 10000,
      });
    };

    window.addEventListener('superBrainOpportunity', handleOpportunityDetected as EventListener);
    
    return () => {
      window.removeEventListener('superBrainOpportunity', handleOpportunityDetected as EventListener);
    };
  }, [toast, t]);

  const handleTakeAction = () => {
    if (currentAlert && onTakeAction) {
      onTakeAction(currentAlert);
    }
    
    toast({
      title: t('ai.action_taken'),
      description: t('ai.trading_interface_opened'),
    });
    setIsOpen(false);
  };

  const handleDismiss = () => {
    setIsOpen(false);
  };

  if (!currentAlert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-yellow-400/30 text-white shadow-2xl shadow-yellow-400/20">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-yellow-400 flex items-center justify-center gap-2">
            <Brain className="w-8 h-8 animate-pulse" />
            {t('ai.supreme_brain_alert')}
            <Zap className="w-8 h-8 animate-pulse" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-2">
          {/* 币种和信号 */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full border-2 border-yellow-400/40">
              <span className="text-3xl font-bold text-yellow-400">{currentAlert.symbol}</span>
            </div>
            
            <div className="space-y-2">
              <Badge 
                variant="outline" 
                className={`text-2xl px-6 py-3 font-bold ${
                  currentAlert.signal === 'buy' 
                    ? 'text-green-400 border-green-400/40 bg-green-400/10' 
                    : 'text-red-400 border-red-400/40 bg-red-400/10'
                }`}
              >
                {currentAlert.signal === 'buy' ? (
                  <>
                    <TrendingUp className="w-6 h-6 mr-2" />
                    {t('ai.buy_signal')}
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-6 h-6 mr-2" />
                    {t('ai.sell_signal')}
                  </>
                )}
              </Badge>
              
              <div className="text-4xl font-black text-yellow-400 animate-pulse">
                {t('ai.win_rate')} {currentAlert.confidence}%
              </div>
            </div>
          </div>

          {/* AI分析摘要 */}
          <div className="space-y-3">
            <div className="p-4 bg-slate-800/60 rounded-lg border border-blue-400/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-400 font-medium text-sm">{t('ai.ai_analysis')}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {currentAlert.analysis.priceAnalysis}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-purple-400/10 rounded border border-purple-400/20">
                <span className="text-purple-400">📊 {t('ai.technical')}</span>
              </div>
              <div className="p-2 bg-green-400/10 rounded border border-green-400/20">
                <span className="text-green-400">📰 {t('ai.sentiment')}</span>
              </div>
            </div>
          </div>

          {/* 行动按钮 */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleDismiss}
              variant="outline"
              className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 border-slate-600 text-slate-300"
            >
              {t('ai.dismiss')}
            </Button>
            <Button 
              onClick={handleTakeAction}
              className={`flex-1 font-bold ${
                currentAlert.signal === 'buy'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
              } text-white shadow-lg`}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              {currentAlert.signal === 'buy' ? t('ai.buy_now') : t('ai.sell_now')}
            </Button>
          </div>

          {/* 免责声明 */}
          <div className="text-center text-xs text-slate-400 border-t border-slate-700 pt-3">
            {t('ai.disclaimer')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};