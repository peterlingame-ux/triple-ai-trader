import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Brain, ChevronRight, ChevronLeft, Database } from "lucide-react";
import { Badge } from "./ui/badge";
import TradingViewDashboard from "./TradingViewDashboard";

export function SuperBrainXSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      side="right"
      className="bg-gradient-to-b from-slate-900/95 via-blue-950/90 to-slate-900/95 backdrop-blur-xl border-l border-white/10"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Brain className="w-6 h-6 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-orbitron tracking-wide">
                  SUPER BRAINX
                </h2>
                <p className="text-xs text-gray-400">六大数据源综合面板</p>
              </div>
            </div>
          )}
          <SidebarTrigger className="ml-auto text-white hover:bg-white/10" />
        </div>
        
        {!isCollapsed && (
          <div className="mt-3">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
              <Database className="w-3 h-3 mr-1" />
              实时数据连接
            </Badge>
          </div>
        )}
        
        {isCollapsed && (
          <div className="flex flex-col items-center space-y-2 mt-2">
            <div className="relative">
              <Brain className="w-8 h-8 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-0">
        {!isCollapsed ? (
          <div className="h-full overflow-hidden">
            <TradingViewDashboard />
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 space-y-4">
            <div className="text-center">
              <Brain className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-blue-400 mx-auto rounded-full opacity-60"></div>
            </div>
            
            <div className="space-y-2">
              {[
                { color: 'bg-green-400', label: 'Binance' },
                { color: 'bg-blue-400', label: 'TradingView' },
                { color: 'bg-yellow-400', label: 'News' },
                { color: 'bg-red-400', label: 'Technical' },
                { color: 'bg-purple-400', label: 'Sentiment' },
                { color: 'bg-indigo-400', label: 'Blockchain' },
              ].map((item, index) => (
                <div key={index} className="flex justify-center">
                  <div 
                    className={`w-2 h-2 ${item.color} rounded-full animate-pulse`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                </div>
              ))}
            </div>

            <div className="text-center pt-4 border-t border-white/10">
              <ChevronLeft className="w-4 h-4 text-gray-400 animate-pulse" />
              <p className="text-xs text-gray-500 mt-1">展开面板</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}