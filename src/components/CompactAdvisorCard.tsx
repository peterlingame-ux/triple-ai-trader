import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Target, Quote, Star, Power } from "lucide-react";
import { useState } from "react";
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
  famousQuote: string;
  mainAchievements: string[];
  currentHoldings: string[];
  tags: string[];
  onActivationToggle?: (name: string, isActive: boolean) => void;
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
  famousQuote,
  mainAchievements,
  currentHoldings,
  tags,
  onActivationToggle
}: CompactAdvisorCardProps) => {
  const [isActive, setIsActive] = useState(isSpecial || false);
  const { t } = useLanguage();

  const handleActivationToggle = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    onActivationToggle?.(name, newActiveState);
  };

  return (
    <Card className={`relative overflow-hidden border-0 shadow-2xl backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group hover:-translate-y-2 ${
      isActive 
        ? backgroundColor 
        : 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600'
    }`}>
      {/* Premium Glass Effect Overlay */}
      <div className={`absolute inset-0 pointer-events-none ${
        isActive 
          ? 'bg-gradient-to-b from-white/10 via-transparent to-black/20' 
          : 'bg-gradient-to-b from-gray-500/10 via-transparent to-black/40'
      }`} />
      
      {/* Animated Background Pattern */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        isActive 
          ? 'opacity-5 group-hover:opacity-10' 
          : 'opacity-2 group-hover:opacity-5'
      }`}>
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Activation Toggle Button */}
      <div className="absolute top-3 right-3 z-20">
        <div className="relative">
          <button 
            onClick={handleActivationToggle}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-1.5 border border-white/20 ${
              isActive 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 hover:from-gray-500 hover:to-gray-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full shadow-sm ${
              isActive 
                ? 'bg-white animate-pulse' 
                : 'bg-gray-400'
            }`}></div>
            <Power className="w-3 h-3" />
            <span className={`tracking-wide ${
              isActive ? 'text-white' : 'text-gray-300'
            }`}>
              {isActive ? t('activation.activated') : t('activation.deactivated')}
            </span>
          </button>
          {/* Glow Effect - only when active */}
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-md opacity-50 -z-10" />
          )}
        </div>
      </div>

      <div className="relative z-10 p-5">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-4">
          {/* Avatar with Premium Frame */}
          <div className="relative mb-3">
            <div className={`w-20 h-20 rounded-full p-0.5 shadow-xl ${
              isActive 
                ? 'bg-gradient-to-r from-white/30 to-white/10' 
                : 'bg-gradient-to-r from-gray-500/20 to-gray-600/10'
            }`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-300">
                <img 
                  src={avatar} 
                  alt={name}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    isActive ? '' : 'grayscale opacity-60'
                  }`}
                />
              </div>
            </div>
            {/* Avatar Glow */}
            <div className={`absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
              isActive 
                ? 'bg-gradient-to-r from-white/20 to-transparent' 
                : 'bg-gradient-to-r from-gray-500/10 to-transparent'
            }`} />
          </div>
          
          {/* Name and Title */}
          <div className="text-center">
            <h3 className={`font-bold text-sm mb-1 tracking-wide ${
              isActive ? 'text-white' : 'text-gray-400'
            }`}>{name}</h3>
            <p className={`text-xs font-medium opacity-90 ${
              isActive ? accentColor : 'text-gray-500'
            }`}>{specialty}</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`rounded-lg p-2 border backdrop-blur-sm ${
              isActive 
                ? 'bg-white/5 border-white/10' 
                : 'bg-gray-600/20 border-gray-500/20'
            }`}>
              <span className={`block mb-1 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                {t('labels.investmentStyle') || '投资风格'}
              </span>
              <span className={`font-semibold text-xs ${
                isActive ? accentColor : 'text-gray-400'
              }`}>{investmentStyle}</span>
            </div>
            <div className={`rounded-lg p-2 border backdrop-blur-sm ${
              isActive 
                ? 'bg-white/5 border-white/10' 
                : 'bg-gray-600/20 border-gray-500/20'
            }`}>
              <span className={`block mb-1 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                {t('labels.historicalReturn') || '历史回报'}
              </span>
              <span className={`font-bold flex items-center gap-1 text-xs ${
                isActive ? 'text-emerald-400' : 'text-gray-400'
              }`}>
                <TrendingUp className="w-3 h-3" />
                {historicalReturn}
              </span>
            </div>
          </div>
        </div>

        {/* Net Worth Display */}
        <div className={`rounded-xl p-3 mb-4 border backdrop-blur-sm shadow-inner ${
          isActive 
            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30' 
            : 'bg-gradient-to-r from-gray-600/20 to-gray-500/20 border-gray-500/30'
        }`}>
          <div className="flex items-center justify-center gap-2">
            <div className={`p-1.5 rounded-full ${
              isActive ? 'bg-emerald-500/20' : 'bg-gray-500/20'
            }`}>
              <DollarSign className={`w-4 h-4 ${
                isActive ? 'text-emerald-400' : 'text-gray-400'
              }`} />
            </div>
            <div className="text-center">
              <p className={`text-xs font-medium mb-0.5 ${
                isActive ? 'text-emerald-200' : 'text-gray-400'
              }`}>
                {t('labels.netWorth') || '个人净资产'}
              </p>
              <p className={`text-sm font-bold tracking-wide ${
                isActive ? 'text-emerald-400' : 'text-gray-300'
              }`}>{netWorth}</p>
            </div>
          </div>
        </div>

        {/* Investment Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {Array.isArray(tags) && tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`text-xs px-2 py-1 backdrop-blur-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-gray-600/10 border-gray-500/20 text-gray-400 hover:bg-gray-600/20'
              }`}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Famous Quote */}
        <div className={`mb-4 p-3 rounded-lg border-l-2 backdrop-blur-sm ${
          isActive 
            ? 'bg-gradient-to-r from-white/5 to-white/10 border-white/30' 
            : 'bg-gradient-to-r from-gray-600/5 to-gray-600/10 border-gray-500/30'
        }`}>
          <Quote className={`w-3 h-3 mb-2 ${
            isActive ? 'text-white/60' : 'text-gray-500/60'
          }`} />
          <p className={`text-xs italic leading-relaxed font-light ${
            isActive ? 'text-gray-200' : 'text-gray-400'
          }`}>
            "{famousQuote.length > 60 ? famousQuote.substring(0, 60) + '...' : famousQuote}"
          </p>
        </div>

        {/* Holdings */}
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-2">
            <Target className={`w-3 h-3 ${isActive ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-xs font-medium ${
              isActive ? 'text-gray-300' : 'text-gray-500'
            }`}>
              {t('labels.mainHoldings') || '主要持仓'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {Array.isArray(currentHoldings) && currentHoldings.slice(0, 3).map((holding, index) => (
              <Badge 
                key={index} 
                className={`text-xs px-2 py-0.5 border backdrop-blur-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-white/10 to-white/5 text-white border-white/20 hover:from-white/20 hover:to-white/10' 
                    : 'bg-gradient-to-r from-gray-600/10 to-gray-600/5 text-gray-400 border-gray-500/20 hover:from-gray-600/20 hover:to-gray-600/10'
                }`}
              >
                {holding}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-1 border ${
            isActive 
              ? 'bg-gradient-to-r from-emerald-500/80 to-teal-500/80 text-white border-white/20 hover:from-emerald-500 hover:to-teal-500' 
              : 'bg-gradient-to-r from-gray-600/50 to-gray-500/50 text-gray-300 border-gray-500/20 hover:from-gray-600/70 hover:to-gray-500/70'
          }`}>
            <Star className="w-3 h-3" />
            <span>{confidence}% {t('labels.confidence') || '信心度'}</span>
          </button>
          <button className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold backdrop-blur-sm transition-all duration-300 border ${
            isActive 
              ? `${accentColor.replace('text-', 'bg-').replace('-300', '-500/80')} text-white border-white/20 hover:${accentColor.replace('text-', 'bg-').replace('-300', '-500')}` 
              : 'bg-gray-600/50 text-gray-300 border-gray-500/20 hover:bg-gray-600/70'
          }`}>
            {recommendation}
          </button>
        </div>

        {/* Hover Details Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 to-black/90 backdrop-blur-md p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-y-auto">
          <div className="text-white space-y-3 h-full flex flex-col">
            <div className="text-center border-b border-white/20 pb-3">
              <h4 className="font-bold text-base text-white mb-1">{name}</h4>
              <p className="text-gray-300 text-xs">{specialty}</p>
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-white font-semibold text-xs mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {t('advisor.mainAchievements')}
                </p>
                <ul className="space-y-1">
                  {Array.isArray(mainAchievements) && mainAchievements.slice(0, 3).map((achievement, index) => (
                    <li key={index} className="text-gray-300 text-xs flex items-start gap-1">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-white font-semibold text-xs mb-2">{t('advisor.investmentPhilosophy')}</p>
                <div className="bg-white/10 rounded p-2 border-l-2 border-emerald-400">
                  <p className="text-gray-200 text-xs italic leading-relaxed">"{famousQuote}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </Card>
  );
};