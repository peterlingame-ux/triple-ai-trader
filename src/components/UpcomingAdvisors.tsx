import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { User, Lock, Star, Clock, Sparkles, Users, Shield, Zap, TrendingUp, Award, Globe, DollarSign } from "lucide-react";
import trumpAvatar from "@/assets/trump-avatar.jpg";

export const UpcomingAdvisors = () => {
  const { t } = useLanguage();

  const advisors = [
    {
      name: t('advisors.trump.name'),
      specialty: t('advisors.trump.specialty'),
      status: 'developing',
      description: t('upcoming.description.trump'),
      avatar: trumpAvatar,
      isReady: true,
      expertise: t('advisors.trump.expertise'),
      detailedInfo: {
        title: t('upcoming.title.trump'),
        achievements: [
          t('upcoming.achievements.trump.1'),
          t('upcoming.achievements.trump.2'),
          t('upcoming.achievements.trump.3'),
          t('upcoming.achievements.trump.4')
        ],
        specialty: t('upcoming.specialty.trump'),
        experience: t('upcoming.experience.trump'),
        netWorth: '$2.6 Billion (2024)',
        philosophy: t('upcoming.philosophy.trump'),
        keySkills: [t('upcoming.skills.trump.1'), t('upcoming.skills.trump.2'), t('upcoming.skills.trump.3'), t('upcoming.skills.trump.4')]
      }
    },
    {
      name: t('advisors.quantitative.name'),
      specialty: t('advisors.quantitative.specialty'),
      status: 'coming_soon',
      description: t('upcoming.description.quant'),
      isReady: false,
      expertise: t('advisors.quantitative.expertise'),
      detailedInfo: {
        title: t('upcoming.title.quant'),
        achievements: [t('upcoming.achievements.tbd')],
        specialty: t('upcoming.specialty.quant'),
        experience: t('upcoming.experience.quant'),
        philosophy: t('upcoming.philosophy.quant')
      }
    },
    {
      name: t('advisors.crypto.name'), 
      specialty: t('advisors.crypto.specialty'),
      status: 'coming_soon',
      description: t('upcoming.description.crypto'),
      isReady: false,
      expertise: t('advisors.crypto.expertise'),
      detailedInfo: {
        title: t('upcoming.title.crypto'),
        achievements: [t('upcoming.achievements.tbd')],
        specialty: t('upcoming.specialty.crypto'),
        experience: t('upcoming.experience.crypto'),
        philosophy: t('upcoming.philosophy.crypto')
      }
    },
    {
      name: t('advisors.macro.name'),
      specialty: t('advisors.macro.specialty'),
      status: 'coming_soon', 
      description: t('upcoming.description.macro'),
      isReady: false,
      expertise: t('advisors.macro.expertise'),
      detailedInfo: {
        title: t('upcoming.title.macro'),
        achievements: [t('upcoming.achievements.tbd')],
        specialty: t('upcoming.specialty.macro'),
        experience: t('upcoming.experience.macro'),
        philosophy: t('upcoming.philosophy.macro')
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Professional Header Section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/95 via-blue-950/40 to-slate-900/95 border-slate-700/30 backdrop-blur-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(168,85,247,0.02)_50%,transparent_100%)]"></div>
        
        <div className="relative px-12 py-16 text-center">
          {/* Icon Group */}
          <div className="flex items-center justify-center gap-8 mb-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-full flex items-center justify-center border border-amber-400/20">
                <Users className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 tracking-tight leading-tight">
                {t('advisors.more_models')}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-blue-400/50"></div>
                <Shield className="w-6 h-6 text-blue-400/80" />
                <p className="text-2xl font-semibold text-slate-200 tracking-wide">{t('advisors.not_alone')}</p>
                <Zap className="w-6 h-6 text-amber-400/80" />
                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-blue-400/50"></div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center border border-blue-400/20">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/10 via-indigo-600/15 to-purple-600/10 border border-blue-500/20 backdrop-blur-sm">
            <div className="relative mr-3">
              <Clock className="w-5 h-5 text-blue-300" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-blue-200 font-medium tracking-wide">{t('advisors.coming_soon')}</span>
            <div className="ml-3 px-2 py-1 rounded-full bg-blue-500/20 text-xs text-blue-300 font-semibold">
              {t('upcoming.elite.assembling')}
            </div>
          </div>
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
                  {advisor.isReady ? t('advisors.trump.status') : t('advisors.coming_soon_status')}
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
                          <span className="text-amber-300 font-medium text-sm">{t('upcoming.key.achievements')}</span>
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
                          <span className="text-blue-300 font-medium text-sm">{t('upcoming.specialty')}</span>
                        </div>
                        <p className="text-slate-300 text-xs">{advisor.detailedInfo.specialty}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-300 font-medium text-sm">{t('upcoming.philosophy')}</span>
                        </div>
                        <p className="text-slate-300 text-xs italic">"{advisor.detailedInfo.philosophy}"</p>
                      </div>

                      {/* Skills */}
                      <div>
                        <span className="text-slate-400 font-medium text-xs mb-2 block">{t('upcoming.core.skills')}</span>
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
                        <span className="text-slate-400 text-xs">{t('upcoming.experience')}: {advisor.detailedInfo.experience}</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/40 text-xs px-2 py-1">
                          {t('advisors.trump.status')}
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
                      <p className="text-slate-400 text-xs">{t('upcoming.specialty')}: {advisor.detailedInfo.specialty}</p>
                      <p className="text-slate-500 text-xs italic">"{advisor.detailedInfo.philosophy}"</p>
                    </div>

                    <div className="pt-3 border-t border-slate-700/50 text-center">
                      <Badge className="bg-slate-600/20 text-slate-400 border-slate-600/40 text-xs px-3 py-1">
                        {t('advisors.coming_soon_status')}
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