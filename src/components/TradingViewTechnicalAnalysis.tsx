import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

interface TradingViewTechnicalAnalysisProps {
  height?: number;
  className?: string;
  symbol?: string;
}

const TradingViewTechnicalAnalysis: React.FC<TradingViewTechnicalAnalysisProps> = memo(({ 
  height = 450,
  className = "",
  symbol = "NASDAQ:AAPL"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

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
    copyrightDiv.innerHTML = `<a href="https://www.tradingview.com/symbols/${symbol}/technicals/" rel="noopener nofollow" target="_blank"><span class="blue-text">Technical analysis for ${symbol} by TradingView</span></a>`;

    // Append elements
    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(copyrightDiv);

    // Create and configure script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": theme === 'dark' ? 'dark' : 'light',
      "displayMode": "single",
      "isTransparent": false,
      "locale": "en",
      "interval": "1m",
      "disableInterval": false,
      "width": "100%",
      "height": height,
      "symbol": symbol,
      "showIntervalTabs": true
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [theme, height, symbol]);

  return (
    <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
      <div 
        ref={containerRef}
        className="tradingview-widget-container w-full h-full rounded-lg border border-border bg-card"
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
});

TradingViewTechnicalAnalysis.displayName = 'TradingViewTechnicalAnalysis';

export default TradingViewTechnicalAnalysis;