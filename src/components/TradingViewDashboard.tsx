import React, { useState } from 'react';
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

  return (
    <div className="w-full">
      {/* Activated Header Design */}
      <div className="relative mb-6">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/30 to-purple-500/20 blur-xl rounded-2xl animate-pulse"></div>
        
        {/* Main Header Container */}
        <div className="relative bg-gradient-to-r from-slate-900/95 via-blue-950/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl border border-purple-400/30 shadow-2xl shadow-purple-500/20 p-4 sm:p-6">
          {/* Energy Lines */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse delay-500"></div>
          
          {/* Header Content */}
          <div className="flex items-center justify-between">
            {/* Left Section - Activated Title */}
            <div className="flex items-center gap-3">
              {/* Animated Brain Icon with Glow */}
              <div className="relative">
                <div className="absolute inset-0 bg-purple-400/50 blur-lg rounded-full animate-pulse"></div>
                <Brain className="relative w-6 h-6 sm:w-8 sm:h-8 text-purple-300 animate-pulse" strokeWidth={1.5} />
                {/* Neural Network Lines */}
                <div className="absolute -inset-2 opacity-40">
                  <div className="w-full h-full border border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                  <div className="absolute inset-1 border border-blue-400/20 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
                </div>
              </div>
              
              {/* Enhanced Title with Holographic Effect */}
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold font-orbitron tracking-wider bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 bg-clip-text text-transparent animate-pulse">
                  SUPER BRAINX
                </h2>
                <div className="text-sm sm:text-base text-purple-300/80 font-light tracking-widest mt-1">
                  综合面板 <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-ping ml-2"></span> ACTIVATED
                </div>
                
                {/* Holographic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-pulse delay-1000"></div>
              </div>
            </div>
            
            {/* Right Section - Enhanced Controls */}
            <div className="flex items-center gap-3">
              {/* Status Indicators */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-400/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300 font-mono">ONLINE</span>
              </div>
              
              {/* Collapse Button with Enhanced Styling */}
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="group relative flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 rounded-lg border border-purple-400/30 hover:border-purple-400/50"
                >
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <span className="relative z-10 font-mono">
                    {isCollapsed ? '展开' : '收起'}
                  </span>
                  {isCollapsed ? 
                    <ChevronDown className="relative z-10 w-4 h-4 group-hover:animate-pulse" /> : 
                    <ChevronUp className="relative z-10 w-4 h-4 group-hover:animate-pulse" />
                  }
                </button>
              )}
            </div>
          </div>
          
          {/* Data Flow Animation */}
          <div className="absolute inset-x-4 bottom-1 flex justify-center space-x-1 opacity-30">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"
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
          <div className="relative p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="screener" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">市场筛选器</span>
                  <span className="sm:hidden">筛选</span>
                </TabsTrigger>
                <TabsTrigger value="heatmap" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">热力图</span>
                  <span className="sm:hidden">热力</span>
                </TabsTrigger>
                <TabsTrigger value="news" className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4" />
                  <span className="hidden sm:inline">市场新闻</span>
                  <span className="sm:hidden">新闻</span>
                </TabsTrigger>
                <TabsTrigger value="technical" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="hidden sm:inline">技术分析</span>
                  <span className="sm:hidden">分析</span>
                </TabsTrigger>
                <TabsTrigger value="chart" className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  <span className="hidden sm:inline">图表</span>
                  <span className="sm:hidden">图表</span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">AI分析</span>
                  <span className="sm:hidden">AI</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="screener" className="mt-0">
                <TradingViewScreener 
                  height={550}
                  className="w-full"
                />
              </TabsContent>
              
              <TabsContent value="heatmap" className="mt-0">
                <TradingViewHeatmap 
                  height="500px"
                  className="w-full"
                />
              </TabsContent>
              
              <TabsContent value="news" className="mt-0">
                <TradingViewTimeline 
                  height={550}
                  className="w-full"
                />
              </TabsContent>
              
              <TabsContent value="technical" className="mt-0">
                <TradingViewTechnicalAnalysis 
                  height={450}
                  className="w-full"
                />
              </TabsContent>
              
              <TabsContent value="chart" className="mt-0">
                <TradingViewChart 
                  height="500px"
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