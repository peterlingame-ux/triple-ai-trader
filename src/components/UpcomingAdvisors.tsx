import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { User, Lock, Star, Clock, Sparkles, Users, Shield, Zap } from "lucide-react";

export const UpcomingAdvisors = () => {
  const { t } = useLanguage();

  const advisors = [
    {
      name: 'Donald Trump',
      specialty: '商业帝国战略大师',
      status: 'developing',
      description: '房地产帝王的财富征服之道',
      avatar: '/lovable-uploads/4cd6a022-c475-4af7-a9c1-681f2a8c06b1.png',
      isReady: true,
      expertise: '商业帝国'
    },
    {
      name: '量化交易大师',
      specialty: '算法交易专家',
      status: 'coming_soon',
      description: '华尔街顶级量化基金操盘手',
      isReady: false,
      expertise: '量化策略'
    },
    {
      name: '加密货币之王', 
      specialty: 'Web3投资导师',
      status: 'coming_soon',
      description: '区块链世界的财富密码破译者',
      isReady: false,
      expertise: '数字资产'
    },
    {
      name: '宏观经济大师',
      specialty: '全球策略分析师',
      status: 'coming_soon', 
      description: '国际金融市场的预言家',
      isReady: false,
      expertise: '宏观策略'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Professional Header Section */}
      <Card className="p-8 bg-gradient-to-br from-slate-900/90 via-blue-900/20 to-slate-900/90 border-slate-700/50 backdrop-blur-sm">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Users className="w-10 h-10 text-amber-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 tracking-wide">
                更多人物模型
              </h3>
              <div className="flex items-center justify-center gap-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <p className="text-xl font-semibold text-foreground">你不再是一个人战斗</p>
                <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div className="relative">
              <Sparkles className="w-10 h-10 text-amber-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <Badge className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-500/30 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            <span className="font-medium">敬请期待 - 顶级战友集结中</span>
          </Badge>
        </div>
      </Card>

      {/* Advisors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {advisors.map((advisor, index) => (
          <div key={index} className="group relative">
            <Card className={`p-6 h-full transition-all duration-500 hover:scale-105 hover:rotate-1 cursor-pointer hover-scale ${
              advisor.isReady 
                ? 'bg-gradient-to-br from-green-900/30 via-emerald-900/20 to-green-800/30 border-green-500/40 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/20' 
                : 'bg-gradient-to-br from-slate-900/80 via-gray-900/60 to-slate-800/80 border-slate-600/40 hover:border-slate-500/60 hover:shadow-lg hover:shadow-slate-500/10'
            }`}>
              
              {/* Professional Avatar Section */}
              <div className="relative mb-6 flex justify-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
                  advisor.isReady 
                    ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/40 border-3 border-green-500/50 shadow-lg shadow-green-500/30' 
                    : 'bg-gradient-to-br from-slate-700/60 to-gray-800/80 border-3 border-slate-600/50 shadow-lg shadow-slate-500/20'
                }`}>
                  {advisor.isReady ? (
                    <img 
                      src={advisor.avatar} 
                      alt={advisor.name}
                      className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 via-gray-900 to-black rounded-full flex items-center justify-center relative">
                      <span className="text-5xl font-bold text-slate-500/80 font-mono animate-pulse">?</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Enhanced Status Indicator */}
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                    advisor.isReady 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 animate-pulse shadow-green-500/50' 
                      : 'bg-gradient-to-br from-slate-600 to-gray-700 shadow-slate-500/30'
                  }`}>
                    {advisor.isReady ? (
                      <Clock className="w-4 h-4 text-white" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Name & Info Section */}
              <div className="text-center space-y-3">
                <div>
                  <h4 className={`font-bold text-base mb-2 transition-colors duration-300 ${
                    advisor.isReady ? 'text-green-300' : 'text-slate-400'
                  }`}>
                    {advisor.name}
                  </h4>
                  <p className={`text-sm font-medium mb-1 ${
                    advisor.isReady ? 'text-green-400/90' : 'text-slate-500'
                  }`}>
                    {advisor.specialty}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-3 py-1 font-medium ${
                      advisor.isReady ? 'text-green-400 border-green-500/40 bg-green-500/10' : 'text-slate-400 border-slate-600/40 bg-slate-600/10'
                    }`}
                  >
                    {advisor.expertise}
                  </Badge>
                </div>

                {/* Status Badge */}
                <Badge 
                  className={`text-xs px-3 py-1.5 font-medium transition-all duration-300 ${
                    advisor.isReady 
                      ? 'bg-green-500/20 text-green-300 border-green-500/40 shadow-sm' 
                      : 'bg-slate-600/20 text-slate-400 border-slate-600/40'
                  }`}
                >
                  {advisor.isReady ? '🔧 正在开发中' : '⏳ 即将到来'}
                </Badge>
              </div>

              {/* Professional Hover Overlay */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-amber-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
              
              {/* Professional Border Glow */}
              <div className={`absolute inset-0 rounded-lg transition-all duration-500 pointer-events-none ${
                advisor.isReady 
                  ? 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                  : 'group-hover:shadow-[0_0_20px_rgba(71,85,105,0.2)]'
              }`} />
            </Card>

            {/* Professional Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
              <div className="bg-slate-900/95 text-white text-sm px-4 py-3 rounded-xl shadow-2xl backdrop-blur-sm border border-slate-700/50 max-w-xs">
                <p className="font-medium text-amber-300 mb-1">{advisor.description}</p>
                <p className="text-xs text-slate-400">点击了解更多详情</p>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-slate-900/95"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};