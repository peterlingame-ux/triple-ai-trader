import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface CryptoShapeProps {
  symbol: string;
  colors: { primary: string; secondary: string; accent?: string };
  animated: boolean;
}

export const CryptoShape: React.FC<CryptoShapeProps> = ({ symbol, colors, animated }) => {
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

      case 'USDT':
      case 'USDC':
        return (
          <group ref={meshRef}>
            <Cylinder args={[1.1, 1.1, 0.25, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.7} roughness={0.3} />
            </Cylinder>
            <Cylinder args={[0.9, 0.9, 0.3, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Text position={[0, 0, 0.16]} fontSize={0.5} color={colors.primary} anchorX="center" anchorY="middle">$</Text>
          </group>
        );

      case 'BNB':
        return (
          <group ref={meshRef}>
            <Box args={[0.8, 0.8, 0.4]} rotation={[0, 0, Math.PI / 4]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Box>
            {[[-1.2, 0], [1.2, 0], [0, 1.2], [0, -1.2]].map((pos, i) => (
              <Box key={i} args={[0.5, 0.5, 0.3]} position={[pos[0], pos[1], 0]} rotation={[0, 0, Math.PI / 4]}>
                <meshStandardMaterial color={colors.secondary} metalness={0.9} roughness={0.1} />
              </Box>
            ))}
          </group>
        );

      case 'XRP':
        return (
          <group ref={meshRef}>
            <Sphere args={[1, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.6} roughness={0.4} />
            </Sphere>
            {Array.from({ length: 3 }).map((_, i) => (
              <Torus key={i} args={[0.8 + i * 0.3, 0.05, 8, 24]} position={[0, 0, 0]} rotation={[Math.PI / 4, i * Math.PI / 3, 0]}>
                <meshStandardMaterial color={colors.secondary} metalness={0.8} roughness={0.2} transparent opacity={0.7} />
              </Torus>
            ))}
          </group>
        );

      case 'ADA':
        return (
          <group ref={meshRef}>
            <Sphere args={[0.6, 20, 20]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Sphere>
            {Array.from({ length: 3 }).map((_, i) => (
              <Torus key={i} args={[1.2, 0.08, 8, 24]} position={[0, 0, 0]} 
                    rotation={[i * Math.PI / 3, (i + 1) * Math.PI / 3, i * Math.PI / 6]}>
                <meshStandardMaterial color={colors.secondary} metalness={0.9} roughness={0.1} />
              </Torus>
            ))}
          </group>
        );

      case 'SOL':
        return (
          <group ref={meshRef}>
            <Cylinder args={[1.3, 1.3, 0.2, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Cylinder>
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} args={[2, 0.3, 0.15]} position={[0, (i - 1) * 0.5, 0.15]} 
                  rotation={[0, 0, i % 2 === 0 ? 0.2 : -0.2]}>
                <meshStandardMaterial color={colors.secondary} metalness={0.7} roughness={0.3} />
              </Box>
            ))}
          </group>
        );

      case 'DOGE':
        return (
          <group ref={meshRef}>
            <Cylinder args={[1.1, 1.1, 0.3, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Sphere args={[0.8, 16, 16]} position={[0, 0, 0.2]} scale={[1, 0.9, 0.8]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.3} roughness={0.7} />
            </Sphere>
            <Text position={[0, 0, 0.16]} fontSize={0.7} color={colors.primary} anchorX="center" anchorY="middle">Ð</Text>
          </group>
        );

      case 'DOT':
        return (
          <group ref={meshRef}>
            <Sphere args={[0.4, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Sphere>
            {Array.from({ length: 6 }).map((_, i) => (
              <Sphere key={i} args={[0.2, 12, 12]} 
                     position={[Math.cos(i * Math.PI / 3) * 1.2, Math.sin(i * Math.PI / 3) * 1.2, 0]}>
                <meshStandardMaterial color={colors.secondary} metalness={0.7} roughness={0.3} />
              </Sphere>
            ))}
          </group>
        );

      case 'MATIC':
        return (
          <group ref={meshRef}>
            <Cylinder args={[1, 1, 0.3, 6]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Cylinder args={[0.6, 0.6, 0.4, 6]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.9} roughness={0.1} />
            </Cylinder>
          </group>
        );

      case 'SHIB':
        return (
          <group ref={meshRef}>
            <Sphere args={[1, 16, 16]} position={[0, 0, 0]} scale={[1, 0.8, 1]}>
              <meshStandardMaterial color={colors.primary} metalness={0.4} roughness={0.6} />
            </Sphere>
            <Sphere args={[0.15, 8, 8]} position={[-0.3, 0.2, 0.7]}>
              <meshStandardMaterial color="#000000" />
            </Sphere>
            <Sphere args={[0.15, 8, 8]} position={[0.3, 0.2, 0.7]}>
              <meshStandardMaterial color="#000000" />
            </Sphere>
          </group>
        );

      case 'PEPE':
        return (
          <group ref={meshRef}>
            <Sphere args={[1, 16, 16]} position={[0, 0, 0]} scale={[1, 0.8, 1]}>
              <meshStandardMaterial color="#4CAF50" metalness={0.3} roughness={0.7} />
            </Sphere>
            <Sphere args={[0.2, 8, 8]} position={[-0.3, 0.2, 0.7]}>
              <meshStandardMaterial color="#000000" />
            </Sphere>
            <Sphere args={[0.2, 8, 8]} position={[0.3, 0.2, 0.7]}>
              <meshStandardMaterial color="#000000" />
            </Sphere>
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