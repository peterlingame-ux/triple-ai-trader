import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown, BarChart3, Zap, Star, Award, Target } from "lucide-react";

// Import avatars
import elonAvatar from "@/assets/elon-musk-cartoon-avatar.png";
import warrenAvatar from "@/assets/warren-buffett-cartoon-avatar.png";
import billAvatar from "@/assets/bill-gates-cartoon-avatar.png";

interface SupremeBrainCenterProps {
  className?: string;
}

export const SupremeBrainCenter = ({ className = "" }: SupremeBrainCenterProps) => {
  const [activeAdvisor, setActiveAdvisor] = useState("elon");

  // Mock data for Supreme Brain analytics
  const brainData = {
    totalAnalysis: 15847,
    accuracy: 96.3,
    activeSignals: 12,
    profitRate: 127.8
  };

  const advisors = [
    {
      id: "elon",
      name: "Elon Musk",
      avatar: elonAvatar,
      specialty: "创新投资分析",
      confidence: 94,
      winRate: "89.2%",
      totalTrades: 1247,
      avgReturn: "+18.7%",
      expertise: ["新兴科技", "电动车产业", "太空经济", "人工智能"],
      currentAnalysis: "特斯拉Q4财报超预期，建议逢低加仓。同时关注SpaceX相关概念股机会。",
      grade: "S+",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "warren",
      name: "Warren Buffett",
      avatar: warrenAvatar,
      specialty: "价值投资大师",
      confidence: 97,
      winRate: "92.8%",
      totalTrades: 892,
      avgReturn: "+24.3%",
      expertise: ["价值投资", "长期持有", "财务分析", "风险控制"],
      currentAnalysis: "当前市场估值偏高，建议关注低估值蓝筹股，耐心等待更好的买入时机。",
      grade: "S+",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "bill",
      name: "Bill Gates",
      avatar: billAvatar,
      specialty: "科技趋势分析",
      confidence: 91,
      winRate: "87.5%",
      totalTrades: 756,
      avgReturn: "+21.1%",
      expertise: ["科技股", "医疗健康", "清洁能源", "数字化转型"],
      currentAnalysis: "AI革命带来的投资机会巨大，重点关注云计算和芯片相关标的。",
      grade: "S",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const currentAdvisor = advisors.find(a => a.id === activeAdvisor) || advisors[0];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Supreme Brain Header with Data */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Supreme Brain Logo */}
        <div className="col-span-8">
          <Card className="bg-gradient-to-r from-slate-900/90 via-blue-950/80 to-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tight">
                    SUPREME BRAIN
                  </h1>
                  <p className="text-lg text-slate-300">AI投资分析 · 三合一智能决策系统</p>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="text-2xl font-bold text-blue-400">{brainData.totalAnalysis.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">总分析次数</div>
                </div>
                <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="text-2xl font-bold text-green-400">{brainData.accuracy}%</div>
                  <div className="text-sm text-slate-400">预测准确率</div>
                </div>
                <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="text-2xl font-bold text-yellow-400">{brainData.activeSignals}</div>
                  <div className="text-sm text-slate-400">活跃信号</div>
                </div>
                <div className="text-center p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="text-2xl font-bold text-purple-400">+{brainData.profitRate}%</div>
                  <div className="text-sm text-slate-400">累计收益率</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Status Panel */}
        <div className="col-span-4">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">实时状态</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">市场扫描</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    在线
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">AI分析引擎</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    运行中
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">风险监控</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    正常
                  </Badge>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-400 mb-2">下次分析更新</div>
                  <div className="text-lg font-bold text-white">2分钟</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Advisor Cards Grid - 三合一人物卡片 */}
      <div className="grid grid-cols-3 gap-6">
        {advisors.map((advisor) => (
          <Card
            key={advisor.id}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 border ${
              activeAdvisor === advisor.id
                ? 'border-blue-500/50 bg-slate-800/70 shadow-2xl shadow-blue-500/20 scale-105'
                : 'border-slate-700/50 bg-slate-800/50 hover:border-slate-600/50 hover:bg-slate-800/60'
            } backdrop-blur-sm`}
            onClick={() => setActiveAdvisor(advisor.id)}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${advisor.color}`}></div>
            
            <div className="relative p-6">
              {/* Grade Badge */}
              <div className="absolute top-4 right-4">
                <Badge className={`bg-gradient-to-r ${advisor.color} text-white font-bold px-3 py-1`}>
                  {advisor.grade}
                </Badge>
              </div>

              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center mb-4">
                <div className="relative mb-3">
                  <img 
                    src={advisor.avatar} 
                    alt={advisor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                  />
                  {activeAdvisor === advisor.id && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{advisor.name}</h3>
                <p className="text-sm text-slate-400">{advisor.specialty}</p>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-slate-700/30 rounded">
                  <div className="text-lg font-bold text-green-400">{advisor.winRate}</div>
                  <div className="text-xs text-slate-400">胜率</div>
                </div>
                <div className="text-center p-2 bg-slate-700/30 rounded">
                  <div className="text-lg font-bold text-blue-400">{advisor.avgReturn}</div>
                  <div className="text-xs text-slate-400">平均收益</div>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">信心指数</span>
                  <span className="text-sm font-bold text-white">{advisor.confidence}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${advisor.color}`}
                    style={{ width: `${advisor.confidence}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Analysis Preview */}
              <div className="text-xs text-slate-400 leading-relaxed bg-slate-700/20 p-3 rounded-lg">
                {advisor.currentAnalysis}
              </div>

              {/* Action Button */}
              <Button 
                className={`w-full mt-4 bg-gradient-to-r ${advisor.color} hover:opacity-90 text-white border-0`}
                size="sm"
              >
                查看详细分析
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Advisor Detailed Analysis */}
      {activeAdvisor && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={currentAdvisor.avatar} 
                alt={currentAdvisor.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{currentAdvisor.name} 详细分析</h3>
                <p className="text-slate-400">{currentAdvisor.specialty}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Expertise Areas */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  专业领域
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentAdvisor.expertise.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="text-blue-400 border-blue-400/30 bg-blue-400/10"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-400" />
                  业绩表现
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">总交易次数</span>
                    <span className="text-white font-semibold">{currentAdvisor.totalTrades.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">胜率</span>
                    <span className="text-green-400 font-semibold">{currentAdvisor.winRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">平均收益</span>
                    <span className="text-blue-400 font-semibold">{currentAdvisor.avgReturn}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Analysis */}
            <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <h4 className="text-lg font-semibold text-white mb-2">当前分析观点</h4>
              <p className="text-slate-300 leading-relaxed">{currentAdvisor.currentAnalysis}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};