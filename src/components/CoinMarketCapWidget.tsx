import { useEffect } from 'react';

interface CoinMarketCapWidgetProps {
  coins?: string;
  currency?: string;
  theme?: 'light' | 'dark';
  transparent?: boolean;
  showSymbol?: boolean;
}

const CoinMarketCapWidget = ({
  coins = "1,1027,825",
  currency = "USD", 
  theme = "light",
  transparent = false,
  showSymbol = true
}: CoinMarketCapWidgetProps) => {
  useEffect(() => {
    // Clean up any existing widget
    const existingScript = document.querySelector('script[src*="coinMarquee.js"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and load the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://files.coinmarketcap.com/static/widget/coinMarquee.js';
    script.async = true;
    
    // Add the script to document head
    document.head.appendChild(script);

    // Cleanup on component unmount
    return () => {
      const scriptToRemove = document.querySelector('script[src*="coinMarquee.js"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <div className="w-full overflow-hidden bg-background border-b">
      <div 
        id="coinmarketcap-widget-marquee" 
        data-coins={coins}
        data-currency={currency}
        data-theme={theme}
        data-transparent={transparent.toString()}
        data-show-symbol-logo={showSymbol.toString()}
        className="min-h-[50px]"
      />
    </div>
  );
};

export default CoinMarketCapWidget;