import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, Sphere, Box, Cylinder, Torus, RoundedBox } from '@react-three/drei';
import { getCryptoColors } from '@/components/crypto3d/CryptoColors';

interface Professional3DIconProps {
  symbol: string;
  size?: number;
  transparent?: boolean;
}

const IconMesh: React.FC<{ symbol: string; colors: any }> = ({ symbol, colors }) => {
  const meshProps = useMemo(() => {
    const baseProps = {
      position: [0, 0, 0] as [number, number, number],
      rotation: [0.2, 0.2, 0] as [number, number, number],
    };

    switch (symbol.toUpperCase()) {
      case 'BTC':
        return {
          ...baseProps,
          component: (
            <group>
              <Sphere args={[0.8]} position={[0, 0, 0]}>
                <meshStandardMaterial 
                  color={colors.primary} 
                  metalness={0.8} 
                  roughness={0.2}
                  transparent={true}
                  opacity={0.9}
                />
              </Sphere>
              <Text
                position={[0, 0, 0.81]}
                fontSize={0.4}
                color={colors.secondary}
                anchorX="center"
                anchorY="middle"
                font="/fonts/Roboto-Bold.woff"
              >
                ₿
              </Text>
            </group>
          )
        };

      case 'ETH':
        return {
          ...baseProps,
          component: (
            <group>
              <Box args={[1.2, 1.2, 0.3]} position={[0, 0, 0]}>
                <meshStandardMaterial 
                  color={colors.primary} 
                  metalness={0.7} 
                  roughness={0.3}
                  transparent={true}
                  opacity={0.9}
                />
              </Box>
              <Box args={[0.8, 0.8, 0.1]} position={[0, 0, 0.4]}>
                <meshStandardMaterial 
                  color={colors.accent} 
                  metalness={0.8} 
                  roughness={0.2}
                  transparent={true}
                  opacity={0.8}
                />
              </Box>
            </group>
          )
        };

      case 'USDT':
      case 'USDC':
        return {
          ...baseProps,
          component: (
            <Cylinder args={[0.8, 0.8, 0.3]} position={[0, 0, 0]}>
              <meshStandardMaterial 
                color={colors.primary} 
                metalness={0.6} 
                roughness={0.4}
                transparent={true}
                opacity={0.9}
              />
            </Cylinder>
          )
        };

      case 'BNB':
        return {
          ...baseProps,
          component: (
            <group>
              <RoundedBox args={[1, 1, 0.4]} radius={0.1} smoothness={4}>
                <meshStandardMaterial 
                  color={colors.primary} 
                  metalness={0.7} 
                  roughness={0.3}
                  transparent={true}
                  opacity={0.9}
                />
              </RoundedBox>
              <Box args={[0.3, 0.3, 0.1]} position={[0, 0, 0.5]}>
                <meshStandardMaterial 
                  color={colors.accent} 
                  metalness={0.8} 
                  roughness={0.2}
                  transparent={true}
                  opacity={0.8}
                />
              </Box>
            </group>
          )
        };

      case 'XRP':
        return {
          ...baseProps,
          component: (
            <group>
              <Torus args={[0.7, 0.3, 8, 16]} position={[0, 0, 0]}>
                <meshStandardMaterial 
                  color={colors.primary} 
                  metalness={0.8} 
                  roughness={0.2}
                  transparent={true}
                  opacity={0.9}
                />
              </Torus>
              <Sphere args={[0.2]} position={[0, 0, 0]}>
                <meshStandardMaterial 
                  color={colors.accent} 
                  metalness={0.9} 
                  roughness={0.1}
                  transparent={true}
                  opacity={0.8}
                />
              </Sphere>
            </group>
          )
        };

      case 'ADA':
        return {
          ...baseProps,
          component: (
            <group>
              <Box args={[0.8, 0.8, 0.8]} position={[0, 0, 0]} rotation={[0.5, 0.5, 0]}>
                <meshStandardMaterial 
                  color={colors.primary} 
                  metalness={0.7} 
                  roughness={0.3}
                  transparent={true}
                  opacity={0.9}
                />
              </Box>
            </group>
          )
        };

      case 'SOL':
        return {
          ...baseProps,
          component: (
            <group>
              <Cylinder args={[0.6, 0.9, 1.2, 6]} position={[0, 0, 0]}>
                <meshStandardMaterial 
                  color={colors.primary} 
                  metalness={0.8} 
                  roughness={0.2}
                  transparent={true}
                  opacity={0.9}
                />
              </Cylinder>
            </group>
          )
        };

      case 'DOGE':
        return {
          ...baseProps,
          component: (
            <Sphere args={[0.8]} position={[0, 0, 0]}>
              <meshStandardMaterial 
                color={colors.primary} 
                metalness={0.6} 
                roughness={0.4}
                transparent={true}
                opacity={0.9}
              />
            </Sphere>
          )
        };

      default:
        return {
          ...baseProps,
          component: (
            <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.2} smoothness={4}>
              <meshStandardMaterial 
                color={colors.primary} 
                metalness={0.7} 
                roughness={0.3}
                transparent={true}
                opacity={0.9}
              />
            </RoundedBox>
          )
        };
    }
  }, [symbol, colors]);

  return (
    <mesh {...meshProps} castShadow receiveShadow>
      {meshProps.component}
    </mesh>
  );
};

export const Professional3DIcon: React.FC<Professional3DIconProps> = ({ 
  symbol, 
  size = 40,
  transparent = true 
}) => {
  const colors = getCryptoColors(symbol);

  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 30 }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: transparent ? 'transparent' : undefined
        }}
        gl={{ alpha: transparent, antialias: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[2, 2, 5]} 
          intensity={0.8} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-2, 2, 2]} intensity={0.4} color={colors.accent} />
        <pointLight position={[2, -2, 2]} intensity={0.3} color={colors.primary} />
        
        <Suspense fallback={null}>
          <IconMesh symbol={symbol} colors={colors} />
        </Suspense>
      </Canvas>
    </div>
  );
};