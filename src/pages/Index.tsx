import { TradingDashboard } from "@/components/TradingDashboard";
import { Static3DIconShowcase } from "@/components/Static3DIconShowcase";

const Index = () => {
  console.log("Index page rendering...");
  
  return (
    <div>
      <TradingDashboard />
      <Static3DIconShowcase />
    </div>
  );
};

export default Index;
