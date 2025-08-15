import { useState } from "react";
import { TradingDashboard } from "@/components/TradingDashboard";
import { AIControlCenter } from "@/components/AIControlCenter";
import { SuperBrainDetection } from "@/components/SuperBrainDetection";
import { useCryptoData } from "@/hooks/useCryptoData";

const Index = () => {
  const [showAIControlCenter, setShowAIControlCenter] = useState(false);
  const [activationStates, setActivationStates] = useState<Record<string, boolean>>({
    "Elon Musk": true,
    "Warren Buffett": true,
    "Bill Gates": false,
    "Vitalik Buterin": true,
    "Justin Sun": true,
    "Donald Trump": false
  });
  
  const { cryptoData, newsData } = useCryptoData();

  return (
    <div className="min-h-screen bg-background">
      {/* Trading Dashboard */}
      <div className="space-y-6">
        <TradingDashboard 
          cryptoData={cryptoData} 
          newsData={newsData}
          onOpenAIControlCenter={() => setShowAIControlCenter(true)}
          activationStates={activationStates}
          onActivationChange={setActivationStates}
        />
      </div>

      {/* SUPREME BRAIN Detection */}
      <div className="pt-8">
        <SuperBrainDetection 
          cryptoData={cryptoData} 
          activatedAdvisors={Object.keys(activationStates).filter(name => activationStates[name])}
        />
      </div>

      {/* AI Control Center Modal */}
      <AIControlCenter 
        open={showAIControlCenter} 
        onOpenChange={setShowAIControlCenter} 
      />
    </div>
  );
};

export default Index;