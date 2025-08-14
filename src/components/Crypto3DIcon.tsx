import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { CryptoShape } from '@/components/crypto3d/CryptoShapes';
import { getCryptoColors } from '@/components/crypto3d/CryptoColors';

interface Crypto3DIconProps {
  symbol: string;
  size?: number;
  animated?: boolean;
  colors?: {
    primary: string;
    secondary: string;
    accent?: string;
  };
}

export const Crypto3DIcon: React.FC<Crypto3DIconProps> = ({ 
  symbol, 
  size = 60, 
  animated = true,
  colors 
}) => {
  const finalColors = colors || getCryptoColors(symbol);

  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, 5]} intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        
        <CryptoShape symbol={symbol} colors={finalColors} animated={animated} />
      </Canvas>
    </div>
  );
};

export default Crypto3DIcon;