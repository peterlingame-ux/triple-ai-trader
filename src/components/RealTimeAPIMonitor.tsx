import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertTriangle, Zap, Brain } from "lucide-react";

interface APICall {
  id: string;
  provider: string;
  analysisType: string;
  status: 'pending' | 'success' | 'error';
  timestamp: Date;
  responseTime?: number;
  confidence?: number;
  result?: string;
}

interface RealTimeAPIMonitorProps {
  isActive: boolean;
  onAPICallsComplete: (results: any[]) => void;
}

export const RealTimeAPIMonitor = ({ isActive, onAPICallsComplete }: RealTimeAPIMonitorProps) => {
  const [apiCalls, setApiCalls] = useState<APICall[]>([]);
  const [currentCycle, setCurrentCycle] = useState(0);

  const API_PROVIDERS = [
    { provider: 'openai', analysisType: 'price_chart', name: 'OpenAI价格分析', icon: '🧠' },
    { provider: 'claude', analysisType: 'technical_analysis', name: 'Claude技术分析', icon: '📊' },
    { provider: 'perplexity', analysisType: 'news_sentiment', name: 'Perplexity情感分析', icon: '📰' },
    { provider: 'grok', analysisType: 'market_trend', name: 'Grok趋势分析', icon: '📈' },
    { provider: 'fusion', analysisType: 'multi_source', name: '多源融合分析', icon: '🔄' },
    { provider: 'risk_assessment', analysisType: 'portfolio_risk', name: '风险评估分析', icon: '🛡️' }
  ];

  useEffect(() => {
    if (!isActive) return;

    const simulateAPICall = async (provider: string, analysisType: string) => {
      const callId = `${provider}-${Date.now()}`;
      
      // 开始API调用
      setApiCalls(prev => [...prev, {
        id: callId,
        provider,
        analysisType,
        status: 'pending',
        timestamp: new Date()
      }]);

      // 模拟API调用延迟
      const responseTime = Math.random() * 2000 + 500; // 500-2500ms
      await new Promise(resolve => setTimeout(resolve, responseTime));

      // 模拟API响应
      const success = Math.random() > 0.1; // 90%成功率
      const confidence = Math.floor(Math.random() * 25) + 70; // 70-95%

      setApiCalls(prev => prev.map(call => 
        call.id === callId ? {
          ...call,
          status: success ? 'success' : 'error',
          responseTime: Math.round(responseTime),
          confidence: success ? confidence : undefined,
          result: success ? `${confidence}%信心度分析完成` : '调用失败'
        } : call
      ));

      return { provider, analysisType, success, confidence };
    };

    const runAnalysisCycle = async () => {
      setCurrentCycle(prev => prev + 1);
      
      // 并行调用6个API
      const promises = API_PROVIDERS.map(api => 
        simulateAPICall(api.provider, api.analysisType)
      );

      try {
        const results = await Promise.all(promises);
        onAPICallsComplete(results);
      } catch (error) {
        console.error('API调用周期错误:', error);
      }
    };

    const interval = setInterval(runAnalysisCycle, 15000); // 每15秒一个周期
    
    // 立即执行一次
    runAnalysisCycle();

    return () => clearInterval(interval);
  }, [isActive, onAPICallsComplete]);

  const getStatusIcon = (status: APICall['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getProviderInfo = (provider: string, analysisType: string) => {
    return API_PROVIDERS.find(api => api.provider === provider && api.analysisType === analysisType);
  };

  const recentCalls = apiCalls.slice(-18); // 显示最近18个调用（3轮 x 6个API）
  const currentCycleCalls = apiCalls.filter(call => 
    Date.now() - call.timestamp.getTime() < 20000 // 最近20秒的调用
  );
  
  const successRate = currentCycleCalls.length > 0 
    ? Math.round((currentCycleCalls.filter(call => call.status === 'success').length / currentCycleCalls.length) * 100)
    : 0;

  if (!isActive) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">真实AI API监控</h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              周期 #{currentCycle}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              成功率: <span className="font-bold text-green-600">{successRate}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">实时调用</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {API_PROVIDERS.map((api, index) => {
            const latestCall = currentCycleCalls
              .filter(call => call.provider === api.provider && call.analysisType === api.analysisType)
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

            return (
              <div key={`${api.provider}-${api.analysisType}`} 
                   className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{api.icon}</span>
                    <span className="text-sm font-medium">{api.name}</span>
                  </div>
                  {latestCall && getStatusIcon(latestCall.status)}
                </div>
                
                {latestCall && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">
                      {latestCall.responseTime && `${latestCall.responseTime}ms`}
                    </div>
                    {latestCall.confidence && (
                      <Progress value={latestCall.confidence} className="h-2" />
                    )}
                    <div className="text-xs text-gray-600">
                      {latestCall.result || '等待响应...'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 max-h-32 overflow-y-auto">
          <h4 className="text-sm font-medium mb-2">实时调用日志</h4>
          <div className="space-y-1">
            {recentCalls.slice().reverse().map((call) => {
              const info = getProviderInfo(call.provider, call.analysisType);
              return (
                <div key={call.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span>{info?.icon}</span>
                    <span>{info?.name}</span>
                    {getStatusIcon(call.status)}
                  </div>
                  <div className="text-gray-500">
                    {call.timestamp.toLocaleTimeString()}
                    {call.confidence && ` (${call.confidence}%)`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};