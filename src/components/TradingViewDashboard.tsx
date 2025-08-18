import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TradingViewChart from "./TradingViewChart";
import TradingViewScreener from "./TradingViewScreener";
import TradingViewHeatmap from "./TradingViewHeatmap";
import TradingViewTimeline from "./TradingViewTimeline";
import TradingViewTechnicalAnalysis from "./TradingViewTechnicalAnalysis";
import TradingViewAIAnalysis from "./TradingViewAIAnalysis";
import { BarChart3, TrendingUp, Newspaper, Activity, LineChart, Brain } from "lucide-react";

const TradingViewDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("screener");

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          SUPER BRAINX 综合面板
        </h2>
      </div>
      
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
    </div>
  );
};

export default TradingViewDashboard;