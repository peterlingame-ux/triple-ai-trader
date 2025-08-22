import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, TrendingUp, Zap, Rocket, Star, Award, DollarSign } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import teslaLogo from "@/assets/tesla-logo.png";
import spacexLogo from "@/assets/spacex-logo.png";
import xLogo from "@/assets/x-logo.png";
import neuralinkLogo from "@/assets/neuralink-logo.png";

interface ElonProfileProps {
  name: string;
  specialty: string;
  confidence: number;
  recommendation: string;
  reasoning: string;
  avatar?: string;
  isSpecial?: boolean;
}

export const ElonProfile = ({ name, specialty, confidence, recommendation, reasoning, avatar, isSpecial }: ElonProfileProps) => {
  const { t } = useLanguage();

  const achievements = [
    { icon: Rocket, label: t('elon.spacex'), desc: t('elon.spacex.desc') },
    { icon: Zap, label: t('elon.tesla'), desc: t('elon.tesla.desc') },
    { icon: Brain, label: t('elon.neuralink'), desc: t('elon.neuralink.desc') },
    { icon: Star, label: t('elon.starlink'), desc: t('elon.starlink.desc') }
  ];

  const investmentAreas = [
    t('elon.sustainable'),
    t('elon.space'), 
    t('elon.ai'),
    t('elon.transport'),
    t('elon.crypto'),
    t('elon.neural')
  ];

  return (
    <Card className="p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border-blue-500/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJtIDQwIDAgbCAwIDQwIG0gLTQwIDAgbCA0MCAzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      {isSpecial && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 px-3 py-1">
            <Award className="w-3 h-3 mr-1" />
            {t('advisor.featured')}
          </Badge>
        </div>
      )}

      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start gap-6 mb-6 mt-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400/50 shadow-2xl mb-3">
              {avatar ? (
                <img 
                  src={avatar} 
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                  <Brain className="w-12 h-12 text-blue-400" />
                </div>
              )}
            </div>
            
            {/* Company Icons */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg p-1.5 border border-white/20 hover:bg-white/20 transition-colors">
                <img src={teslaLogo} alt="Tesla" className="w-full h-full object-contain" />
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-lg p-1.5 border border-white/20 hover:bg-white/20 transition-colors">
                <img src={spacexLogo} alt="SpaceX" className="w-full h-full object-contain" />
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-lg p-1.5 border border-white/20 hover:bg-white/20 transition-colors">
                <img src={xLogo} alt="X" className="w-full h-full object-contain" />
              </div>
              <div className="w-8 h-8 bg-white/10 rounded-lg p-1.5 border border-white/20 hover:bg-white/20 transition-colors">
                <img src={neuralinkLogo} alt="Neuralink" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
            <p className="text-blue-300 text-sm mb-2">{t(specialty)}</p>
            
            {/* Net Worth */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 mb-3 border border-green-500/30">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-200 text-xs">{t('advisor.netWorth')}</p>
                  <p className="text-green-400 text-xl font-bold">$219.2 Billion</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                {confidence}% {t('advisor.confidence')}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                <TrendingUp className="w-3 h-3 mr-1" />
                {recommendation}
              </Badge>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            {t('advisor.representativeWorks')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <achievement.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm font-medium">{achievement.label}</span>
                </div>
                <p className="text-gray-300 text-xs">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Areas */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {t('advisor.investmentExpertise')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {investmentAreas.map((area, index) => (
              <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {/* Investment Philosophy */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            {t('advisor.investmentPhilosophy')}
          </h3>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('elon.philosophy')}
            </p>
          </div>
        </div>

        {/* Analysis */}
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {t('advisor.currentAnalysis')}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-lg p-4 border border-white/10">
            {reasoning}
          </p>
        </div>
      </div>
    </Card>
  );
};