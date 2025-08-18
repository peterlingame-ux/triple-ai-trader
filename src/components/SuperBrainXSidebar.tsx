import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Brain, ChevronLeft, ChevronRight, Database, TrendingUp, BarChart3, Activity, LineChart, Newspaper } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import TradingViewDashboard from './TradingViewDashboard';
import { cn } from '@/lib/utils';

interface SuperBrainXSidebarProps {
  className?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const SuperBrainXSidebar: React.FC<SuperBrainXSidebarProps> = ({ 
  className, 
  isExpanded: externalIsExpanded, 
  onToggle 
}) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  
  const handleToggle = useCallback(() => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsExpanded(!internalIsExpanded);
    }
  }, [onToggle, internalIsExpanded]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        handleToggle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleToggle]);

  // 数据源状态 (模拟)
  const dataSourceStatus = [
    { name: 'Binance API', active: true, color: 'bg-green-500' },
    { name: 'TradingView', active: true, color: 'bg-blue-500' },
    { name: 'News Feed', active: false, color: 'bg-yellow-500' },
    { name: 'Technical', active: true, color: 'bg-purple-500' },
    { name: 'Sentiment', active: false, color: 'bg-red-500' },
    { name: 'Blockchain', active: true, color: 'bg-indigo-500' }
  ];

  return (
    <>
      {/* 侧边栏 */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen bg-background/95 backdrop-blur-xl border-l border-border/50 transition-all duration-300 ease-in-out z-50 shadow-2xl",
          isExpanded ? "w-[800px]" : "w-16",
          className
        )}
      >
        {/* 头部控制区 */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
          {isExpanded ? (
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">SUPER BRAINX</span>
            </div>
          ) : (
            <Brain className="w-5 h-5 text-primary mx-auto" />
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="hover:bg-muted/50"
          >
            {isExpanded ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* 内容区域 */}
        <div className="h-[calc(100vh-4rem)] overflow-hidden">
          {isExpanded ? (
            // 展开状态：显示完整面板
            <div className="p-4 h-full overflow-y-auto">
              <TradingViewDashboard />
            </div>
          ) : (
            // 收缩状态：显示迷你状态指示器
            <div className="p-3 space-y-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">数据源</p>
                <div className="space-y-2">
                  {dataSourceStatus.map((source, index) => (
                    <div
                      key={index}
                      className="flex justify-center"
                      title={source.name}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          source.active ? source.color : "bg-muted"
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-border/50 pt-3">
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-muted/50"
                    title="市场筛选器"
                  >
                    <TrendingUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-muted/50"
                    title="热力图"
                  >
                    <BarChart3 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-muted/50"
                    title="新闻"
                  >
                    <Newspaper className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-muted/50"
                    title="技术分析"
                  >
                    <Activity className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-muted/50"
                    title="图表"
                  >
                    <LineChart className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-primary/20 text-primary"
                    title="AI分析"
                  >
                    <Brain className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 背景遮罩 - 移动端展开时显示 */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={handleToggle}
        />
      )}
    </>
  );
};

export default SuperBrainXSidebar;