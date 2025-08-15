import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Award, TrendingUp, Target, Quote, Star } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface CompactAdvisorCardProps {
  name: string;
  specialty: string;
  confidence: number;
  recommendation: string;
  netWorth: string;
  avatar: string;
  isSpecial?: boolean;
  backgroundColor: string;
  borderColor: string;
  accentColor: string;
  investmentStyle: string;
  historicalReturn: string;
  riskLevel: string;
  famousQuote: string;
  mainAchievements: string[];
  currentHoldings: string[];
  tags: string[];
}

export const CompactAdvisorCard = ({ 
  name, 
  specialty, 
  confidence, 
  recommendation, 
  netWorth,
  avatar, 
  isSpecial, 
  backgroundColor,
  borderColor,
  accentColor,
  investmentStyle,
  historicalReturn,
  riskLevel,
  famousQuote,
  mainAchievements,
  currentHoldings,
  tags
}: CompactAdvisorCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className={`p-3 ${backgroundColor} ${borderColor} relative overflow-hidden hover:scale-105 transition-transform duration-200 group`}>
      {isSpecial && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 px-2 py-0.5 text-xs">
            <Award className="w-2 h-2 mr-1" />
            {t('advisor.featured')}
          </Badge>
        </div>
      )}

      <div className="relative z-10">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center mb-3">
          <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${borderColor.replace('border-', 'border-').replace('/30', '/50')} shadow-lg mb-2`}>
            <img 
              src={avatar} 
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-white font-bold text-xs text-center">{name}</h3>
          <p className={`${accentColor} text-xs text-center mb-1`}>{t(specialty)}</p>
        </div>

        {/* Investment Style & Performance */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">风格:</span>
            <span className={`${accentColor} font-medium`}>{investmentStyle}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">回报:</span>
            <span className="text-green-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {historicalReturn}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300">风险:</span>
            <span className={`font-medium ${riskLevel === '低' ? 'text-green-400' : riskLevel === '中' ? 'text-yellow-400' : 'text-red-400'}`}>
              {riskLevel}
            </span>
          </div>
        </div>

        {/* Net Worth */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-2 mb-3 border border-green-500/30">
          <div className="flex items-center gap-1 justify-center">
            <DollarSign className="w-3 h-3 text-green-400" />
            <div className="text-center">
              <p className="text-green-200 text-xs">{t('advisor.netWorth')}</p>
              <p className="text-green-400 text-sm font-bold">{netWorth}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className={`text-xs px-1 py-0 ${accentColor.replace('text-', 'bg-').replace('-300', '-500/10')} ${accentColor} ${borderColor.replace('border-', 'border-').replace('/30', '/50')}`}>
              {tag}
            </Badge>
          ))}
        </div>

        {/* Famous Quote */}
        <div className="mb-3 p-2 bg-white/5 rounded border border-white/10">
          <Quote className="w-3 h-3 text-gray-400 mb-1" />
          <p className="text-gray-300 text-xs italic leading-tight">
            "{famousQuote.length > 50 ? famousQuote.substring(0, 50) + '...' : famousQuote}"
          </p>
        </div>

        {/* Current Holdings */}
        <div className="mb-3">
          <p className="text-gray-300 text-xs mb-1 flex items-center gap-1">
            <Target className="w-3 h-3" />
            主要持仓:
          </p>
          <div className="flex flex-wrap gap-1">
            {currentHoldings.slice(0, 3).map((holding, index) => (
              <Badge key={index} className="text-xs px-1 py-0 bg-white/10 text-white border-white/20">
                {holding}
              </Badge>
            ))}
          </div>
        </div>

        {/* Confidence and Recommendation */}
        <div className="space-y-2">
          <Badge className="w-full justify-center bg-green-500/20 text-green-300 border-green-500/50 text-xs">
            {confidence}% 信心度
          </Badge>
          <Badge className={`w-full justify-center ${accentColor.replace('text-', 'bg-').replace('-300', '-500/20')} ${accentColor} ${borderColor.replace('border-', 'border-').replace('/30', '/50')} text-xs text-center`}>
            {recommendation}
          </Badge>
        </div>

        {/* Hover Details */}
        <div className="absolute inset-0 bg-black/90 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto">
          <div className="text-white space-y-2">
            <h4 className="font-bold text-sm text-center">{name}</h4>
            <div className="text-xs space-y-1">
              <p><strong>主要成就:</strong></p>
              <ul className="list-disc list-inside space-y-0.5">
                {mainAchievements.map((achievement, index) => (
                  <li key={index} className="text-xs">{achievement}</li>
                ))}
              </ul>
              <p className="mt-2"><strong>投资理念:</strong></p>
              <p className="italic">"{famousQuote}"</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};