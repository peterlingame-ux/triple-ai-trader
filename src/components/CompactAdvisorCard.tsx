import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Award } from "lucide-react";
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
  accentColor 
}: CompactAdvisorCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className={`p-4 ${backgroundColor} ${borderColor} relative overflow-hidden hover:scale-105 transition-transform duration-200`}>
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
          <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${borderColor.replace('border-', 'border-').replace('/30', '/50')} shadow-lg mb-2`}>
            <img 
              src={avatar} 
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-white font-bold text-sm text-center">{name}</h3>
          <p className={`${accentColor} text-xs text-center mb-2`}>{t(specialty)}</p>
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

        {/* Confidence and Recommendation */}
        <div className="space-y-2">
          <Badge className="w-full justify-center bg-green-500/20 text-green-300 border-green-500/50 text-xs">
            {confidence}% {t('advisor.confidence')}
          </Badge>
          <Badge className={`w-full justify-center ${accentColor.replace('text-', 'bg-').replace('-300', '-500/20')} ${accentColor} ${borderColor.replace('border-', 'border-').replace('/30', '/50')} text-xs text-center`}>
            {recommendation}
          </Badge>
        </div>
      </div>
    </Card>
  );
};