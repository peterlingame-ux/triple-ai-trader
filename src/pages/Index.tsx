import { TradingDashboard } from "@/components/TradingDashboard";
import { Static3DIconShowcase } from "@/components/Static3DIconShowcase";
import { MetaBrainX3DLogo } from "@/components/MetaBrainX3DLogo";

const Index = () => {
  console.log("Index page rendering...");
  
  return (
    <div>
      {/* Meta BrainX 3D Logo Showcase */}
      <div className="flex justify-center items-center py-8 bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Meta BrainX 3D Logo</h2>
          <MetaBrainX3DLogo size={300} />
        </div>
      </div>
      
      <TradingDashboard />
      <Static3DIconShowcase />
    </div>
  );
};

export default Index;
