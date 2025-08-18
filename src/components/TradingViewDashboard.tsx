import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TradingViewChart from "./TradingViewChart";
import TradingViewScreener from "./TradingViewScreener";
import TradingViewHeatmap from "./TradingViewHeatmap";
import TradingViewTimeline from "./TradingViewTimeline";
import TradingViewTechnicalAnalysis from "./TradingViewTechnicalAnalysis";
import TradingViewAIAnalysis from "./TradingViewAIAnalysis";
import { BarChart3, TrendingUp, Newspaper, Activity, LineChart, Brain, ChevronUp, ChevronDown } from "lucide-react";

interface TradingViewDashboardProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const TradingViewDashboard: React.FC<TradingViewDashboardProps> = ({ 
  isCollapsed = false, 
  onToggleCollapse 
}) => {
  const [activeTab, setActiveTab] = useState("screener");
  const [isTablet, setIsTablet] = useState(false);

  // Detect tablet screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="w-full">
      {/* Activated Header Design */}
      <div className="relative mb-6">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/30 to-purple-500/20 blur-xl rounded-2xl animate-pulse"></div>
        
        {/* Main Header Container - Optimized for Tablet */}
        <div className="relative bg-gradient-to-r from-slate-900/95 via-blue-950/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl border border-purple-400/30 shadow-2xl shadow-purple-500/20 p-3 md:p-5 lg:p-6">
          {/* Energy Lines */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse delay-500"></div>
          
          {/* Header Content - Tablet Optimized Layout */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            {/* Left Section - Activated Title */}
            <div className="flex items-center gap-2 md:gap-3 flex-1">
              {/* Animated Brain Icon with Glow - Tablet Optimized */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-purple-400/50 blur-lg rounded-full animate-pulse"></div>
                <Brain className="relative w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-purple-300 animate-pulse" strokeWidth={1.5} />
                {/* Neural Network Lines */}
                <div className="absolute -inset-1 md:-inset-2 opacity-40">
                  <div className="w-full h-full border border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                  <div className="absolute inset-0.5 md:inset-1 border border-blue-400/20 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
                </div>
              </div>
              
              {/* Enhanced Title with Holographic Effect - Tablet Layout */}
              <div className="relative flex-1 min-w-0">
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold font-orbitron tracking-wider bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 bg-clip-text text-transparent animate-pulse truncate">
                  SUPER BRAINX
                </h2>
                <div className="text-xs md:text-sm lg:text-base text-purple-300/80 font-light tracking-wide md:tracking-widest mt-0.5 md:mt-1 flex items-center">
                  <span className="truncate">综合面板</span>
                  <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-ping ml-1 md:ml-2 flex-shrink-0"></span>
                  <span className="hidden md:inline ml-1">ACTIVATED</span>
                </div>
                
                {/* Holographic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-pulse delay-1000"></div>
              </div>
            </div>
            
            {/* Right Section - Enhanced Controls - Tablet Layout */}
            <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3 flex-shrink-0">
              {/* Status Indicators - Always visible on tablet */}
              <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-md md:rounded-lg border border-green-400/20">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300 font-mono">ONLINE</span>
              </div>
              
              {/* Collapse Button with Enhanced Styling - Tablet Optimized */}
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="group relative flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 rounded-md md:rounded-lg border border-purple-400/30 hover:border-purple-400/50"
                >
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-lg rounded-md md:rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <span className="relative z-10 font-mono">
                    {isCollapsed ? '展开' : '收起'}
                  </span>
                  {isCollapsed ? 
                    <ChevronDown className="relative z-10 w-3 h-3 md:w-4 md:h-4 group-hover:animate-pulse" /> : 
                    <ChevronUp className="relative z-10 w-3 h-3 md:w-4 md:h-4 group-hover:animate-pulse" />
                  }
                </button>
              )}
            </div>
          </div>
          
          {/* Data Flow Animation - Responsive */}
          <div className="absolute inset-x-3 md:inset-x-4 bottom-1 flex justify-center space-x-0.5 md:space-x-1 opacity-30">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 h-0.5 md:w-1 md:h-1 bg-purple-400 rounded-full animate-pulse"
                style={{ 
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1.5s'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-950/80 to-slate-900/90 backdrop-blur-2xl rounded-xl border border-white/5 shadow-2xl"></div>
          <div className="relative p-3 md:p-5 lg:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tablet Optimized Tab List */}
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1 md:gap-0 mb-4 md:mb-6 h-auto md:h-10">
                <TabsTrigger value="screener" className="flex items-center justify-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="hidden md:inline lg:inline">市场筛选器</span>
                  <span className="md:hidden">筛选</span>
                </TabsTrigger>
                <TabsTrigger value="heatmap" className="flex items-center justify-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm">
                  <BarChart3 className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="hidden md:inline lg:inline">热力图</span>
                  <span className="md:hidden">热力</span>
                </TabsTrigger>
                <TabsTrigger value="news" className="flex items-center justify-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm">
                  <Newspaper className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="hidden md:inline lg:inline">市场新闻</span>
                  <span className="md:hidden">新闻</span>
                </TabsTrigger>
                <TabsTrigger value="technical" className="flex items-center justify-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm">
                  <Activity className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="hidden md:inline lg:inline">技术分析</span>
                  <span className="md:hidden">分析</span>
                </TabsTrigger>
                <TabsTrigger value="chart" className="flex items-center justify-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm">
                  <LineChart className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="hidden md:inline lg:inline">图表</span>
                  <span className="md:hidden">图表</span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center justify-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm">
                  <Brain className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="hidden md:inline lg:inline">AI分析</span>
                  <span className="md:hidden">AI</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Content with Tablet Optimized Heights */}
              <TabsContent value="screener" className="mt-0">
                <TradingViewScreener 
                  height={isTablet ? 450 : 550}
                  className="w-full"
                />
              </TabsContent>
              
              <TabsContent value="heatmap" className="mt-0">
                <TradingViewHeatmap 
                  height={isTablet ? "400px" : "500px"}
                  className="w-full"
                />
              </TabsContent>
              
              <TabsContent value="news" className="mt-0">
                <TradingViewTimeline 
                  height={isTablet ? 450 : 550}
                  className="w-full"
                />
              </TabsContent>
              
              <TabsContent value="technical" className="mt-0">
                <TradingViewTechnicalAnalysis 
                  height={isTablet ? 350 : 450}
                  className="w-full"
                />
              </TabsContent>
              
              <TabsContent value="chart" className="mt-0">
                <TradingViewChart 
                  height={isTablet ? "400px" : "500px"}
                  className="w-full"
                />
              </TabsContent>
              
              <TabsContent value="ai" className="mt-0">
                <TradingViewAIAnalysis 
                  activeTab={activeTab}
                  className="w-full"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingViewDashboard;