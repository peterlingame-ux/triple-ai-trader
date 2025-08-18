import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

interface TradingViewHeatmapProps {
  height?: string;
  className?: string;
}

const TradingViewHeatmap: React.FC<TradingViewHeatmapProps> = memo(({ 
  height = "500px",
  className = ""
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
    copyrightDiv.innerHTML = `<a href="https://www.tradingview.com/markets/cryptocurrencies/" rel="noopener nofollow" target="_blank"><span class="blue-text">Crypto coins heatmap by TradingView</span></a>`;

    // Append elements
    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(copyrightDiv);

    // Create and configure script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "dataSource": "Crypto",
      "blockSize": "market_cap_calc",
      "blockColor": "24h_close_change|5",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": theme === 'dark' ? 'dark' : 'light',
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "isMonoSize": false,
      "width": "100%",
      "height": "100%"
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [theme]);

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <div 
        ref={containerRef}
        className="tradingview-widget-container w-full h-full rounded-lg border border-border bg-card"
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
});

TradingViewHeatmap.displayName = 'TradingViewHeatmap';

export default TradingViewHeatmap;