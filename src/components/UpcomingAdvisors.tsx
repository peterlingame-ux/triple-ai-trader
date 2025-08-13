import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { User, Lock, Star, Clock, Sparkles, Users, Shield, Zap, TrendingUp, Award, Globe, DollarSign } from "lucide-react";
import trumpAvatar from "@/assets/trump-avatar.jpg";

export const UpcomingAdvisors = () => {
  const { t } = useLanguage();

  const advisors = [
    {
      name: 'Donald Trump',
      specialty: '商业帝国战略大师',
      status: 'developing',
      description: '房地产帝王的财富征服之道',
      avatar: trumpAvatar,
      isReady: true,
      expertise: '商业帝国',
      detailedInfo: {
        title: '第45任美国总统 • 商业大亨',
        achievements: [
          '特朗普集团董事长兼总裁',
          '房地产帝国缔造者',
          '《做生意的艺术》作者',
          '电视节目《学徒》制作人'
        ],
        specialty: '房地产投资、品牌建设、谈判艺术',
        experience: '50+ 年商业经验',
        netWorth: '$26亿美元 (2024)',
        philosophy: '"在商业中，你要么做大，要么回家"',
        keySkills: ['战略谈判', '品牌营销', '房地产开发', '媒体运营']
      }
    },
    {
      name: '量化交易大师',
      specialty: '算法交易专家',
      status: 'coming_soon',
      description: '华尔街顶级量化基金操盘手',
      isReady: false,
      expertise: '量化策略',
      detailedInfo: {
        title: '神秘量化大师',
        achievements: ['即将揭晓'],
        specialty: '算法交易、数据分析',
        experience: '顶级机构经验',
        philosophy: '数据驱动的投资决策'
      }
    },
    {
      name: '加密货币之王', 
      specialty: 'Web3投资导师',
      status: 'coming_soon',
      description: '区块链世界的财富密码破译者',
      isReady: false,
      expertise: '数字资产',
      detailedInfo: {
        title: '神秘加密大师',
        achievements: ['即将揭晓'],
        specialty: 'DeFi、NFT、区块链投资',
        experience: '加密领域先驱',
        philosophy: '去中心化金融的未来'
      }
    },
    {
      name: '宏观经济大师',
      specialty: '全球策略分析师',
      status: 'coming_soon', 
      description: '国际金融市场的预言家',
      isReady: false,
      expertise: '宏观策略',
      detailedInfo: {
        title: '神秘宏观大师',
        achievements: ['即将揭晓'],
        specialty: '全球宏观、货币政策分析',
        experience: '国际金融机构经验',
        philosophy: '洞察全球经济脉搏'
      }
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

            {/* Professional Detailed Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 pointer-events-none">
              <div className="bg-slate-900/98 text-white rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700/60 overflow-hidden" style={{ width: '320px' }}>
                {advisor.isReady ? (
                  /* Detailed Trump Info */
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500/40 flex-shrink-0">
                        <img 
                          src={advisor.avatar} 
                          alt={advisor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-green-300 font-bold text-lg mb-1">{advisor.name}</h4>
                        <p className="text-green-400/80 text-sm font-medium mb-2">{advisor.detailedInfo.title}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <DollarSign className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-300 font-medium">{advisor.detailedInfo.netWorth}</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Info */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-300 font-medium text-sm">核心成就</span>
                        </div>
                        <div className="space-y-1">
                          {advisor.detailedInfo.achievements.slice(0, 3).map((achievement, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                              <span className="text-slate-300 text-xs">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-300 font-medium text-sm">专业领域</span>
                        </div>
                        <p className="text-slate-300 text-xs">{advisor.detailedInfo.specialty}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 font-medium text-sm">投资哲学</span>
                        </div>
                        <p className="text-slate-300 text-xs italic">"{advisor.detailedInfo.philosophy}"</p>
                      </div>

                      {/* Skills */}
                      <div>
                        <span className="text-slate-400 font-medium text-xs mb-2 block">核心技能</span>
                        <div className="flex flex-wrap gap-1">
                          {advisor.detailedInfo.keySkills?.map((skill, idx) => (
                            <Badge key={idx} className="bg-green-500/10 text-green-400 border-green-500/30 text-xs px-2 py-0.5">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">经验：{advisor.detailedInfo.experience}</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/40 text-xs px-2 py-1">
                          🔧 开发中
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mystery Advisor Info */
                  <div className="p-6 space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-slate-700 to-gray-800 flex items-center justify-center">
                        <span className="text-3xl text-slate-500">?</span>
                      </div>
                      <h4 className="text-slate-400 font-bold text-lg mb-2">{advisor.name}</h4>
                      <p className="text-slate-500 text-sm mb-3">{advisor.detailedInfo.title}</p>
                    </div>
                    
                    <div className="space-y-2 text-center">
                      <p className="text-slate-400 text-xs">专业领域: {advisor.detailedInfo.specialty}</p>
                      <p className="text-slate-500 text-xs italic">"{advisor.detailedInfo.philosophy}"</p>
                    </div>

                    <div className="pt-3 border-t border-slate-700/50 text-center">
                      <Badge className="bg-slate-600/20 text-slate-400 border-slate-600/40 text-xs px-3 py-1">
                        ⏳ 即将揭晓
                      </Badge>
                    </div>
                  </div>
                )}
                
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-900/98"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};