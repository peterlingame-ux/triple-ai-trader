import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { Wand2, Download, Loader2 } from 'lucide-react';

interface IconGeneratorProps {
  onIconGenerated?: (symbol: string, iconUrl: string) => void;
}

export const IconGenerator: React.FC<IconGeneratorProps> = ({ onIconGenerated }) => {
  const { t } = useLanguage();
  const [generating, setGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);

  // 需要生成图标的加密货币列表
  const missingIcons = [
    { symbol: 'TURBO', name: 'Turbo', description: 'High-speed meme coin with turbo engine design' },
    { symbol: 'LADYS', name: 'Milady', description: 'NFT-inspired feminine avatar coin' },
    { symbol: 'TRUMP', name: 'TrumpCoin', description: 'Political meme coin with presidential theme' },
    { symbol: 'MEME', name: 'Memecoin', description: 'Meta meme coin with internet culture theme' },
    { symbol: 'WOJAK', name: 'Wojak', description: 'Internet meme character coin' },
    { symbol: 'DCR', name: 'Decred', description: 'Decentralized credit blockchain coin' },
    { symbol: 'STRAT', name: 'Stratis', description: 'Enterprise blockchain platform' },
    { symbol: 'NXT', name: 'NXT', description: 'Advanced blockchain platform' },
    { symbol: 'SYS', name: 'Syscoin', description: 'Merge-mined blockchain platform' },
    { symbol: 'ZEN', name: 'Horizen', description: 'Privacy-focused blockchain platform' },
    { symbol: 'MAID', name: 'MaidSafeCoin', description: 'Decentralized internet platform' },
    { symbol: 'REP', name: 'Augur', description: 'Prediction market platform' },
    { symbol: 'KMD', name: 'Komodo', description: 'Multi-chain blockchain ecosystem' },
    { symbol: 'SC', name: 'Siacoin', description: 'Decentralized cloud storage' },
    { symbol: 'DGB', name: 'DigiByte', description: 'Fast and secure blockchain' },
    { symbol: 'LSK', name: 'Lisk', description: 'JavaScript blockchain platform' },
    { symbol: 'ARK', name: 'Ark', description: 'Blockchain ecosystem platform' },
    { symbol: 'SAFE', name: 'SafeCoin', description: 'Security-focused cryptocurrency' },
    { symbol: 'NANO', name: 'Nano', description: 'Instant and feeless cryptocurrency' },
    { symbol: 'IOST', name: 'IOST', description: 'Internet of Services blockchain' },
    { symbol: 'QTUM', name: 'Qtum', description: 'Hybrid blockchain platform' },
    { symbol: 'WAVES', name: 'Waves', description: 'Decentralized exchange platform' },
  ];

  const generatePrompt = (symbol: string, name: string, description: string) => {
    return `Create a highly realistic 3D cryptocurrency icon for ${name} (${symbol}). ${description}. The icon should be:
- 3D rendered with professional lighting and shadows
- Metallic material with reflective surfaces
- Circular coin design with embossed logo/symbol
- Transparent background
- High quality 512x512 resolution
- Modern cryptocurrency aesthetic
- Colors that match the brand identity of ${name}
- Professional grade visual design suitable for financial applications
Ultra high resolution, photorealistic 3D rendering`;
  };

  const generateIcon = async (symbol: string, name: string, description: string) => {
    if (!apiKey.trim()) {
      toast.error('Please enter your Runware API key');
      return;
    }

    setGenerating(true);
    try {
      const prompt = generatePrompt(symbol, name, description);
      
      const response = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            taskType: "authentication",
            apiKey: apiKey,
          },
          {
            taskType: "imageInference",
            taskUUID: crypto.randomUUID(),
            positivePrompt: prompt,
            width: 512,
            height: 512,
            model: "runware:100@1",
            numberResults: 1,
            outputFormat: "PNG",
            CFGScale: 7,
            steps: 20,
          }
        ])
      });

      const result = await response.json();
      
      if (result.data && result.data.length > 1) {
        const imageData = result.data.find((item: any) => item.taskType === "imageInference");
        if (imageData && imageData.imageURL) {
          // Download and save the image
          const imageResponse = await fetch(imageData.imageURL);
          const imageBlob = await imageResponse.blob();
          
          // Create download link
          const url = window.URL.createObjectURL(imageBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${symbol}-3d-icon.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast.success(`Generated 3D icon for ${symbol}!`);
          onIconGenerated?.(symbol, imageData.imageURL);
        }
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (error) {
      console.error('Icon generation error:', error);
      toast.error(`Failed to generate icon for ${symbol}: ${error}`);
    } finally {
      setGenerating(false);
    }
  };

  const generateAllSelected = async () => {
    if (selectedSymbols.length === 0) {
      toast.error('Please select at least one cryptocurrency');
      return;
    }

    for (const symbol of selectedSymbols) {
      const crypto = missingIcons.find(c => c.symbol === symbol);
      if (crypto) {
        await generateIcon(crypto.symbol, crypto.name, crypto.description);
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  const toggleSymbolSelection = (symbol: string) => {
    setSelectedSymbols(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <Card className="p-6 bg-gradient-crypto border-border">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <Wand2 className="w-6 h-6" />
            3D Icon Generator
          </h2>
          <p className="text-muted-foreground">
            Generate high-quality 3D icons for missing cryptocurrencies
          </p>
        </div>

        {/* API Key Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Runware API Key
          </label>
          <Input
            type="password"
            placeholder="Enter your Runware API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-secondary border-border"
          />
          <p className="text-xs text-muted-foreground">
            Get your API key from <a href="https://runware.ai/" target="_blank" className="text-accent hover:underline">runware.ai</a>
          </p>
        </div>

        {/* Cryptocurrency Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Select Cryptocurrencies ({selectedSymbols.length} selected)
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSymbols(missingIcons.map(c => c.symbol))}
                className="text-xs"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSymbols([])}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {missingIcons.map((crypto) => (
              <div
                key={crypto.symbol}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedSymbols.includes(crypto.symbol)
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'bg-secondary border-border hover:border-accent/50'
                }`}
                onClick={() => toggleSymbolSelection(crypto.symbol)}
              >
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{crypto.symbol.substring(0, 3)}</span>
                  </div>
                  <p className="font-semibold text-sm">{crypto.symbol}</p>
                  <p className="text-xs text-muted-foreground">{crypto.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            onClick={generateAllSelected}
            disabled={generating || selectedSymbols.length === 0 || !apiKey.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate {selectedSymbols.length} Icons
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">Instructions:</h4>
          <ol className="text-sm text-muted-foreground space-y-1">
            <li>1. Get your API key from runware.ai</li>
            <li>2. Enter the API key above</li>
            <li>3. Select the cryptocurrencies you want to generate icons for</li>
            <li>4. Click "Generate Icons" - each icon will be automatically downloaded</li>
            <li>5. Upload the downloaded PNG files to src/assets/crypto-3d-icons/</li>
            <li>6. The icons will automatically appear in your crypto cards</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};