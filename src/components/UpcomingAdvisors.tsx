import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { User, Lock, Star, Clock, Sparkles } from "lucide-react";

export const UpcomingAdvisors = () => {
  const { t } = useLanguage();

  const advisors = [
    {
      name: 'Donald Trump',
      specialty: '商业帝国战略',
      status: 'developing',
      description: '房地产大亨的财富秘籍',
      avatar: '/lovable-uploads/4cd6a022-c475-4af7-a9c1-681f2a8c06b1.png',
      isReady: true
    },
    {
      name: '神秘大师 1',
      specialty: '量化交易专家',
      status: 'coming_soon',
      description: '华尔街传奇操盘手',
      isReady: false
    },
    {
      name: '神秘大师 2', 
      specialty: '加密货币之王',
      status: 'coming_soon',
      description: '区块链投资导师',
      isReady: false
    },
    {
      name: '神秘大师 3',
      specialty: '全球宏观策略',
      status: 'coming_soon', 
      description: '国际金融巨擘',
      isReady: false
    }
  ];

  return (
    <Card className="p-8 bg-gradient-to-br from-amber-900/20 via-yellow-900/30 to-amber-800/20 border-amber-500/30 backdrop-blur-sm">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
          <h3 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400">
            更多人物模型
          </h3>
          <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-5 h-5 text-amber-400" />
          <p className="text-xl font-semibold text-amber-200">让赚钱不再是梦想</p>
          <Star className="w-5 h-5 text-amber-400" />
        </div>
        <Badge className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-blue-300 border-blue-500/30 animate-pulse">
          <Clock className="w-3 h-3 mr-1" />
          敬请期待
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {advisors.map((advisor, index) => (
          <div key={index} className="group relative">
            <Card className={`p-6 transition-all duration-500 hover:scale-105 cursor-pointer ${
              advisor.isReady 
                ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/30 border-green-500/30 hover:border-green-400/50' 
                : 'bg-gradient-to-br from-slate-900/50 to-gray-900/70 border-slate-600/30 hover:border-slate-500/50'
            }`}>
              
              {/* Avatar */}
              <div className="relative mb-4 flex justify-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center relative overflow-hidden ${
                  advisor.isReady 
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/30 border-2 border-green-500/40' 
                    : 'bg-gradient-to-br from-slate-700/50 to-gray-800/70 border-2 border-slate-600/40'
                }`}>
                  {advisor.isReady ? (
                    <img 
                      src={advisor.avatar} 
                      alt={advisor.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-slate-500 font-mono">?</span>
                    </div>
                  )}
                  
                  {/* Status indicator */}
                  <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    advisor.isReady 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-slate-600'
                  }`}>
                    {advisor.isReady ? (
                      <Clock className="w-3 h-3 text-white" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="text-center mb-3">
                <h4 className={`font-bold text-sm mb-1 ${
                  advisor.isReady ? 'text-green-300' : 'text-slate-400'
                }`}>
                  {advisor.name}
                </h4>
                <p className={`text-xs ${
                  advisor.isReady ? 'text-green-400/80' : 'text-slate-500'
                }`}>
                  {advisor.specialty}
                </p>
              </div>

              {/* Status */}
              <div className="text-center">
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-1 ${
                    advisor.isReady 
                      ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                      : 'bg-slate-600/10 text-slate-400 border-slate-600/30'
                  }`}
                >
                  {advisor.isReady ? '正在开发中' : '即将到来'}
                </Badge>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>

            {/* Description tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <div className="bg-slate-800/95 text-white text-xs px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-slate-600/30">
                {advisor.description}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800/95"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon message */}
      <div className="text-center mt-8 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
        <p className="text-purple-300 text-sm font-medium">
          💎 更多传奇投资大师正在路上，每一位都将带来独特的财富密码
        </p>
        <p className="text-purple-400/80 text-xs mt-1">
          持续关注，解锁更多赚钱秘籍
        </p>
      </div>
    </Card>
  );
};