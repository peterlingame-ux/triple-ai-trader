import { useState } from "react";
import { ProfessionalTradingInterface } from "@/components/ProfessionalTradingInterface";
import { TradingDashboard } from "@/components/TradingDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, Brain, Zap } from "lucide-react";

const Index = () => {
  console.log("Index page rendering...");
  const [currentView, setCurrentView] = useState<'professional' | 'dashboard'>('professional');
  
  const toggleView = () => {
    setCurrentView(current => current === 'professional' ? 'dashboard' : 'professional');
  };

  return (
    <div className="relative">
      {/* 页面切换按钮 */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleView}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
          size="sm"
        >
          {currentView === 'professional' ? (
            <>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回交易面板
              <BarChart3 className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              专业分析
              <Zap className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* 页面状态指示器 */}
      <div className="fixed top-4 left-4 z-50">
        <Badge 
          variant="outline" 
          className={`${
            currentView === 'professional' 
              ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          }`}
        >
          {currentView === 'professional' ? (
            <>
              <Brain className="w-3 h-3 mr-1" />
              专业分析模式
            </>
          ) : (
            <>
              <BarChart3 className="w-3 h-3 mr-1" />
              交易面板模式
            </>
          )}
        </Badge>
      </div>

      {/* 根据当前视图显示对应组件 */}
      {currentView === 'professional' ? (
        <ProfessionalTradingInterface />
      ) : (
        <TradingDashboard />
      )}
    </div>
  );
};

export default Index;
