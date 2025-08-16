import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, TrendingUp, Zap, DollarSign, Building, PieChart, Award, BookOpen } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface WarrenProfileProps {
  name: string;
  specialty: string;
  confidence: number;
  recommendation: string;
  reasoning: string;
  avatar?: string;
  isSpecial?: boolean;
}

export const WarrenProfile = ({ name, specialty, confidence, recommendation, reasoning, avatar, isSpecial }: WarrenProfileProps) => {
  const { t } = useLanguage();

  const achievements = [
    { icon: Building, label: t('warren.berkshire'), desc: t('warren.berkshire.desc') },
    { icon: PieChart, label: t('warren.value'), desc: t('warren.value.desc') },
    { icon: BookOpen, label: t('warren.letters'), desc: t('warren.letters.desc') },
    { icon: Award, label: t('warren.oracle'), desc: t('warren.oracle.desc') }
  ];

  const investmentAreas = [
    t('warren.valueInvesting'),
    t('warren.insurance'), 
    t('warren.consumer'),
    t('warren.financial'),
    t('warren.energy'),
    t('warren.technology')
  ];

  return (
    <Card className="p-8 bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-800 border-amber-500/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJtIDQwIDAgbCAwIDQwIG0gLTQwIDAgbCA0MCAzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI0NSwgMTU4LCA4NywgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
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
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-400/50 shadow-2xl mt-2">
            {avatar ? (
              <img 
                src={avatar} 
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-500/20 flex items-center justify-center">
                <Brain className="w-12 h-12 text-amber-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
            <p className="text-amber-300 text-sm mb-2">{t(specialty)}</p>
            
            {/* Net Worth */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 mb-3 border border-green-500/30">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-green-200 text-xs">{t('advisor.netWorth')}</p>
                  <p className="text-green-400 text-xl font-bold">$118.3 Billion</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                {confidence}% {t('advisor.confidence')}
              </Badge>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/50">
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
            {t('advisor.mainAchievements')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <achievement.icon className="w-4 h-4 text-amber-400" />
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
            <PieChart className="w-4 h-4" />
            {t('advisor.investmentExpertise')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {investmentAreas.map((area, index) => (
              <Badge key={index} variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs">
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
              {t('warren.philosophy')}
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