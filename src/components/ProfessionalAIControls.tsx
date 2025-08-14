import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Bot, Zap, CircleDollarSign, Brain, Activity, Settings, TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { AICommunicator } from "./AICommunicator";
import { AutoTrader } from "./AutoTrader";

interface ProfessionalAIControlsProps {
  cryptoData?: any[];
  newsData?: any[];
}

export const ProfessionalAIControls = ({ cryptoData = [], newsData = [] }: ProfessionalAIControlsProps) => {
  const { t } = useLanguage();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  return (
    <Card className="bg-gradient-to-r from-slate-900/95 via-blue-950/90 to-slate-900/95 border-border/50 backdrop-blur-xl">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground font-orbitron">{t('ai.control_center')}</h3>
              <p className="text-sm text-muted-foreground">{t('ai.professional_tools')}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
            <Activity className="w-3 h-3 mr-1" />
            {t('status.live')}
          </Badge>
        </div>

        {/* Control Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* AI Communication Panel */}
          <Dialog open={activeDialog === 'communicate'} onOpenChange={(open) => setActiveDialog(open ? 'communicate' : null)}>
            <DialogTrigger asChild>
              <Card className="p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-400/40 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground font-inter mb-1">{t('ai.start_communicate')}</h4>
                    <p className="text-xs text-muted-foreground">{t('ai.communicate_desc')}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[98vw] sm:max-h-[98vh] p-0" hideCloseButton={true} onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
              <DialogHeader className="sr-only">
                <DialogTitle>{t('ai.start_communicate')}</DialogTitle>
              </DialogHeader>
              <AICommunicator cryptoData={cryptoData} newsData={newsData} />
            </DialogContent>
          </Dialog>

          {/* AI Auto Trading Panel */}
          <Dialog open={activeDialog === 'autotrader'} onOpenChange={(open) => setActiveDialog(open ? 'autotrader' : null)}>
            <DialogTrigger asChild>
              <Card className="p-6 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/5 border-green-500/20 hover:border-green-400/40 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
                    <CircleDollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground font-inter mb-1">{t('ai.auto_trading')}</h4>
                    <p className="text-xs text-muted-foreground">{t('ai.auto_trading_desc')}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[98vw] sm:max-h-[98vh] p-0" hideCloseButton={true} onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
              <DialogHeader className="sr-only">
                <DialogTitle>{t('ai.auto_trading')}</DialogTitle>
              </DialogHeader>
              <AutoTrader />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">94.2%</div>
            <div className="text-xs text-muted-foreground">{t('stats.ai_accuracy')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">47</div>
            <div className="text-xs text-muted-foreground">{t('stats.active_signals')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">+12.4%</div>
            <div className="text-xs text-muted-foreground">{t('stats.monthly_return')}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};