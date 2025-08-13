import { TradingDashboard } from "@/components/TradingDashboard";

const Index = () => {
  console.log("Index component is rendering");
  
  try {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">TRUMP CRYPTO APP</h1>
        <TradingDashboard />
      </div>
    );
  } catch (error) {
    console.error("Error in Index component:", error);
    return (
      <div className="min-h-screen bg-red-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">ERROR!</h1>
        <p>Something went wrong: {error?.toString()}</p>
      </div>
    );
  }
};

export default Index;
