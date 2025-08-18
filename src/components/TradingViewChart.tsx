import React, { useEffect, useRef, memo, useState } from 'react';
import { useTheme } from 'next-themes';
import { ChartAIChat } from './ChartAIChat';

interface TradingViewChartProps {
  symbol?: string;
  height?: string;
  className?: string;
  chartData?: {
    price: number;
    change24h: number;
    volume24h: number;
    high24h: number;
    low24h: number;
    technicalIndicators?: any;
  };
  marketData?: {
    marketCap: number;
    dominance?: number;
  };
}

const TradingViewChart: React.FC<TradingViewChartProps> = memo(({ 
  symbol = "NASDAQ:AAPL", 
  height = "500px",
  className = "",
  chartData,
  marketData
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    // Create widget container
    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = 'calc(100% - 32px)';
    widgetDiv.style.width = '100%';

    // Create copyright div
    const copyrightDiv = document.createElement('div');
    copyrightDiv.className = 'tradingview-widget-copyright';
    copyrightDiv.innerHTML = `<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Chart by TradingView</span></a>`;

    // Append elements
    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(copyrightDiv);

    // Create and configure script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "allow_symbol_change": true,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": false,
      "hotlist": false,
      "interval": "D",
      "locale": "en",
      "save_image": true,
      "style": "1",
      "symbol": symbol,
      "theme": theme === 'dark' ? 'dark' : 'light',
      "timezone": "Etc/UTC",
      "backgroundColor": theme === 'dark' ? "#0F0F0F" : "#FFFFFF",
      "gridColor": theme === 'dark' ? "rgba(242, 242, 242, 0.06)" : "rgba(0, 0, 0, 0.06)",
      "watchlist": [],
      "withdateranges": false,
      "compareSymbols": [],
      "studies": [],
      "autosize": true
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, theme]);

  return (
    <div className={`w-full relative ${className}`} style={{ height }}>
      <div 
        ref={containerRef}
        className="tradingview-widget-container w-full h-full rounded-lg border border-border bg-card"
        style={{ height: '100%', width: '100%' }}
      />
      
      {/* AI图表分析聊天 */}
      <ChartAIChat
        symbol={symbol}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        chartData={chartData}
        marketData={marketData}
      />
    </div>
  );
});

TradingViewChart.displayName = 'TradingViewChart';

export default TradingViewChart;