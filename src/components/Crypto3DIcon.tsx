import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

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

const CryptoShape = ({ symbol, colors, animated = true }: { 
  symbol: string; 
  colors: { primary: string; secondary: string; accent?: string };
  animated: boolean;
}) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current && animated) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const getShapeForSymbol = () => {
    switch (symbol.toUpperCase()) {
      case 'BTC':
        return (
          <group ref={meshRef}>
            <Cylinder args={[1.2, 1.2, 0.3, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.9} roughness={0.1} />
            </Cylinder>
            <Text position={[0, 0, 0.16]} fontSize={0.7} color={colors.secondary} anchorX="center" anchorY="middle">₿</Text>
            <Torus args={[1.3, 0.05, 8, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.accent} metalness={0.9} roughness={0.1} />
            </Torus>
          </group>
        );

      case 'ETH':
        return (
          <group ref={meshRef}>
            <Box args={[1.4, 1.4, 0.4]} position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Box>
            <Box args={[1.4, 1.4, 0.4]} position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.7} roughness={0.3} />
            </Box>
            <Box args={[0.8, 0.8, 0.5]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
              <meshStandardMaterial color={colors.accent} metalness={0.9} roughness={0.1} />
            </Box>
          </group>
        );

      default:
        return (
          <group ref={meshRef}>
            <Cylinder args={[1, 1, 0.2, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.6} roughness={0.4} />
            </Cylinder>
            <Text position={[0, 0, 0.11]} fontSize={0.4} color={colors.secondary} anchorX="center" anchorY="middle">
              {symbol.substring(0, 4)}
            </Text>
          </group>
        );
    }
  };

  return getShapeForSymbol();
};

export const Crypto3DIcon: React.FC<Crypto3DIconProps> = ({ 
  symbol, 
  size = 60, 
  animated = true,
  colors 
}) => {
  const defaultColors = useMemo(() => {
    const colorMap: Record<string, { primary: string; secondary: string; accent?: string }> = {
      BTC: { primary: '#f7931a', secondary: '#ffffff', accent: '#ffcd3c' },
      ETH: { primary: '#627eea', secondary: '#ffffff', accent: '#8fa9ff' },
      USDT: { primary: '#26a17b', secondary: '#ffffff', accent: '#52c788' },
      USDC: { primary: '#2775ca', secondary: '#ffffff', accent: '#4da6ff' },
      BNB: { primary: '#f3ba2f', secondary: '#000000', accent: '#ffd700' },
      XRP: { primary: '#23292f', secondary: '#ffffff', accent: '#00d4aa' },
      ADA: { primary: '#0033ad', secondary: '#ffffff', accent: '#3468dc' },
      SOL: { primary: '#9945ff', secondary: '#ffffff', accent: '#bb73ff' },
      DOGE: { primary: '#c2a633', secondary: '#000000', accent: '#f4d03f' },
      DEFAULT: { primary: '#6b7280', secondary: '#ffffff', accent: '#9ca3af' }
    };
    return colorMap[symbol.toUpperCase()] || colorMap.DEFAULT;
  }, [symbol]);

  const finalColors = colors || defaultColors;

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