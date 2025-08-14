import { TradingDashboard } from "@/components/TradingDashboard";
import { BTC3DLogo } from "@/components/BTC3DLogo";

const Index = () => {
  console.log("Index page rendering...");
  
  return (
    <div>
      {/* 测试3D图标是否正常显示 */}
      <div style={{ padding: '20px', background: '#f0f0f0' }}>
        <h2>3D图标测试</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <p>BTC 3D Logo:</p>
            <BTC3DLogo size={64} />
          </div>
          <div>
            <p>通用图标测试 - 如果这个显示了，说明3D图标正常工作</p>
          </div>
        </div>
      </div>
      <TradingDashboard />
    </div>
  );
};

export default Index;
