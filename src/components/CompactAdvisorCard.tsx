import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Target, Quote, Star } from "lucide-react";

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
  tags
}: CompactAdvisorCardProps) => {

  return (
    <Card className={`relative overflow-hidden ${backgroundColor} border-0 shadow-2xl backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group hover:-translate-y-2`}>
      {/* Premium Glass Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 pointer-events-none" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
      </div>

      {/* Active Status Badge */}
      {isSpecial && (
        <div className="absolute top-3 right-3 z-20">
          <div className="relative">
            <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 flex items-center gap-1.5 border border-white/20">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
              <span className="tracking-wide">激活中</span>
            </button>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-md opacity-50 -z-10" />
          </div>
        </div>
      )}

      <div className="relative z-10 p-5">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-4">
          {/* Avatar with Premium Frame */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-r from-white/30 to-white/10 shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-300">
                <img 
                  src={avatar} 
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
            {/* Avatar Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Name and Title */}
          <div className="text-center">
            <h3 className="text-white font-bold text-sm mb-1 tracking-wide">{name}</h3>
            <p className={`${accentColor} text-xs font-medium opacity-90`}>{specialty}</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 rounded-lg p-2 border border-white/10 backdrop-blur-sm">
              <span className="text-gray-300 block mb-1">投资风格</span>
              <span className={`${accentColor} font-semibold text-xs`}>{investmentStyle}</span>
            </div>
            <div className="bg-white/5 rounded-lg p-2 border border-white/10 backdrop-blur-sm">
              <span className="text-gray-300 block mb-1">历史回报</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                <TrendingUp className="w-3 h-3" />
                {historicalReturn}
              </span>
            </div>
          </div>
        </div>

        {/* Net Worth Display */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-3 mb-4 border border-emerald-500/30 backdrop-blur-sm shadow-inner">
          <div className="flex items-center justify-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 rounded-full">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-emerald-200 text-xs font-medium mb-0.5">个人净资产</p>
              <p className="text-emerald-400 text-sm font-bold tracking-wide">{netWorth}</p>
            </div>
          </div>
        </div>

        {/* Investment Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`text-xs px-2 py-1 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm`}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Famous Quote */}
        <div className="mb-4 p-3 bg-gradient-to-r from-white/5 to-white/10 rounded-lg border-l-2 border-white/30 backdrop-blur-sm">
          <Quote className="w-3 h-3 text-white/60 mb-2" />
          <p className="text-gray-200 text-xs italic leading-relaxed font-light">
            "{famousQuote.length > 60 ? famousQuote.substring(0, 60) + '...' : famousQuote}"
          </p>
        </div>

        {/* Holdings */}
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-2">
            <Target className="w-3 h-3 text-gray-400" />
            <span className="text-gray-300 text-xs font-medium">主要持仓</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {currentHoldings.slice(0, 3).map((holding, index) => (
              <Badge 
                key={index} 
                className="text-xs px-2 py-0.5 bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/20 backdrop-blur-sm hover:from-white/20 hover:to-white/10 transition-all duration-200"
              >
                {holding}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button className="w-full bg-gradient-to-r from-emerald-500/80 to-teal-500/80 text-white py-2.5 px-4 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-sm hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 flex items-center justify-center gap-1 border border-white/20">
            <Star className="w-3 h-3" />
            <span>{confidence}% 信心度</span>
          </button>
          <button className={`w-full ${accentColor.replace('text-', 'bg-').replace('-300', '-500/80')} text-white py-2.5 px-4 rounded-lg text-xs font-semibold backdrop-blur-sm hover:${accentColor.replace('text-', 'bg-').replace('-300', '-500')} transition-all duration-300 border border-white/20`}>
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
                  主要成就
                </p>
                <ul className="space-y-1">
                  {mainAchievements.slice(0, 3).map((achievement, index) => (
                    <li key={index} className="text-gray-300 text-xs flex items-start gap-1">
                      <span className="w-1 h-1 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-white font-semibold text-xs mb-2">投资理念</p>
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