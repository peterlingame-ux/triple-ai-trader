import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Database, TrendingUp, Newspaper, Activity, Heart, Zap, Users } from 'lucide-react';

// Import avatar images
import elonAvatar from '@/assets/elon-musk-cartoon-avatar.png';
import billAvatar from '@/assets/bill-gates-cartoon-avatar.png';
import warrenAvatar from '@/assets/warren-buffett-cartoon-avatar.png';
import trumpAvatar from '@/assets/donald-trump-cartoon-avatar.png';
import justinAvatar from '@/assets/justin-sun-cartoon-avatar.png';
import vitalikAvatar from '@/assets/vitalik-buterin-cartoon-avatar.png';

interface DataSourceCharacter {
  id: string;
  name: string;
  title: string;
  dataSource: string;
  specialty: string;
  avatar: string;
  color: string;
  bgGradient: string;
  icon: React.ComponentType<any>;
}

interface SuperBrainDataSourcesGridProps {
  className?: string;
  apiStatus?: Record<string, boolean>;
}

const SuperBrainDataSourcesGrid: React.FC<SuperBrainDataSourcesGridProps> = ({ 
  className = "",
  apiStatus = {}
}) => {
  const dataSourceCharacters: DataSourceCharacter[] = [
    {
      id: 'binance',
      name: 'Elon Musk',
      title: 'Binance 数据专家',
      dataSource: 'Binance 实时数据',
      specialty: '实时交易数据分析',
      avatar: elonAvatar,
      color: 'from-yellow-500/20 to-orange-500/20',
      bgGradient: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800',
      icon: Database
    },
    {
      id: 'tradingview',
      name: 'Warren Buffett',
      title: 'TradingView 技术分析师',
      dataSource: 'TradingView 技术分析',
      specialty: '图表技术分析专家',
      avatar: warrenAvatar,
      color: 'from-amber-500/20 to-yellow-500/20',
      bgGradient: 'bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-800',
      icon: TrendingUp
    },
    {
      id: 'news',
      name: 'Donald Trump',
      title: '新闻情感分析师',
      dataSource: '新闻情感分析',
      specialty: '市场新闻情感监测',
      avatar: trumpAvatar,
      color: 'from-red-500/20 to-pink-500/20',
      bgGradient: 'bg-gradient-to-br from-red-900 via-rose-900 to-pink-800',
      icon: Newspaper
    },
    {
      id: 'technical',
      name: 'Bill Gates',
      title: '技术指标工程师',
      dataSource: '技术指标引擎',
      specialty: '量化技术指标分析',
      avatar: billAvatar,
      color: 'from-emerald-500/20 to-teal-500/20',
      bgGradient: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800',
      icon: Activity
    },
    {
      id: 'sentiment',
      name: 'Justin Sun',
      title: '市场情绪监测师',
      dataSource: '市场情绪监测',
      specialty: '社交媒体情绪分析',
      avatar: justinAvatar,
      color: 'from-purple-500/20 to-violet-500/20',
      bgGradient: 'bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-800',
      icon: Heart
    },
    {
      id: 'blockchain',
      name: 'Vitalik Buterin',
      title: '链上数据分析师',
      dataSource: '链上数据分析',
      specialty: '区块链数据深度挖掘',
      avatar: vitalikAvatar,
      color: 'from-indigo-500/20 to-blue-500/20',
      bgGradient: 'bg-gradient-to-br from-indigo-900 via-blue-900 to-cyan-800',
      icon: Zap
    }
  ];

  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Users className="w-5 h-5 text-primary" />
          SUPER BRAINX 六大数据源专家团队
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dataSourceCharacters.map((character) => {
            const isActive = apiStatus[character.id] || false;
            const IconComponent = character.icon;
            
            return (
              <div 
                key={character.id} 
                className={`relative p-4 rounded-xl border border-white/10 ${character.bgGradient} overflow-hidden`}
              >
                {/* Status Indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-green-400' : 'bg-gray-500'
                  }`} />
                  {isActive && <Zap className="w-3 h-3 text-green-400" />}
                </div>

                {/* Character Avatar */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                    <img 
                      src={character.avatar} 
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-semibold truncate">
                      {character.name}
                    </h4>
                    <p className="text-gray-300 text-xs truncate">
                      {character.title}
                    </p>
                  </div>
                </div>

                {/* Data Source Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-white/70" />
                    <span className="text-white text-xs font-medium">
                      {character.dataSource}
                    </span>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className="w-full justify-center text-xs bg-white/5 text-white/80 border-white/20"
                  >
                    {character.specialty}
                  </Badge>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">状态:</span>
                    <span className={`font-medium ${
                      isActive ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {isActive ? '活跃' : '待机'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuperBrainDataSourcesGrid;