import { TradingDashboard } from "@/components/TradingDashboard";
import { Static3DIconShowcase } from "@/components/Static3DIconShowcase";
import { MetaBrainX3DLogo } from "@/components/MetaBrainX3DLogo";

const Index = () => {
  console.log("Index page rendering...");
  
  return (
    <div>
      {/* 3D Logo Header */}
      <div className="flex justify-center items-center py-8 bg-gradient-to-br from-background via-background to-muted">
        <div className="text-center">
          <MetaBrainX3DLogo size={300} />
          <h1 className="text-4xl font-bold text-foreground mt-4">Meta BrainX Trading</h1>
          <p className="text-muted-foreground text-lg mt-2">Advanced AI-Powered Crypto Trading Platform</p>
        </div>
      </div>
      
      <TradingDashboard />
      <Static3DIconShowcase />
    </div>
  );
};

export default Index;
