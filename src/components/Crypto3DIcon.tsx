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
        // Bitcoin - Golden coin with radial ridges
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
        // Ethereum - Diamond crystal structure
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
        // Stablecoins - Clean circular design
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
        // Binance - Diamond constellation
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
        // Ripple - Flowing wave design
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
        // Cardano - Scientific orbital structure
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
        // Solana - Gradient energy bars
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
        // Dogecoin - Playful coin with face
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
        // Polkadot - Connected dots structure
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
        // Polygon - Geometric polygon shape
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
        // Shiba Inu - Dog-inspired design
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

      case 'AVAX':
        // Avalanche - Mountain peak design
        return (
          <group ref={meshRef}>
            <Box args={[1.5, 1.5, 0.5]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
              <meshStandardMaterial color={colors.primary} metalness={0.7} roughness={0.3} />
            </Box>
            <Box args={[1, 1, 0.6]} position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.8} roughness={0.2} />
            </Box>
          </group>
        );

      case 'LTC':
        // Litecoin - Silver coin design
        return (
          <group ref={meshRef}>
            <Cylinder args={[1.1, 1.1, 0.3, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.9} roughness={0.1} />
            </Cylinder>
            <Text position={[0, 0, 0.16]} fontSize={0.7} color={colors.secondary} anchorX="center" anchorY="middle">Ł</Text>
          </group>
        );

      case 'LINK':
        // Chainlink - Connected chain links
        return (
          <group ref={meshRef}>
            <Torus args={[0.8, 0.2, 8, 16]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Torus>
            <Torus args={[0.8, 0.2, 8, 16]} position={[0, -0.5, 0]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.8} roughness={0.2} />
            </Torus>
          </group>
        );

      case 'UNI':
        // Uniswap - Unicorn horn spiral
        return (
          <group ref={meshRef}>
            <Cylinder args={[0.3, 0.8, 2, 8]} position={[0, 0, 0]} rotation={[0, 0, 0.3]}>
              <meshStandardMaterial color={colors.primary} metalness={0.7} roughness={0.3} />
            </Cylinder>
            <Sphere args={[0.6, 16, 16]} position={[0, -0.8, 0]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.6} roughness={0.4} />
            </Sphere>
          </group>
        );

      case 'ATOM':
        // Cosmos - Atomic orbital structure
        return (
          <group ref={meshRef}>
            <Sphere args={[0.3, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Sphere>
            {Array.from({ length: 3 }).map((_, i) => (
              <Torus key={i} args={[1, 0.05, 8, 24]} position={[0, 0, 0]} 
                    rotation={[i * Math.PI / 3, (i + 1) * Math.PI / 3, 0]}>
                <meshStandardMaterial color={colors.secondary} metalness={0.9} roughness={0.1} />
              </Torus>
            ))}
          </group>
        );

      case 'TRX':
        // TRON - Geometric grid design
        return (
          <group ref={meshRef}>
            <Cylinder args={[1.2, 1.2, 0.2, 6]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Box args={[1.5, 0.1, 0.3]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.9} roughness={0.1} />
            </Box>
            <Box args={[0.1, 1.5, 0.3]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.9} roughness={0.1} />
            </Box>
          </group>
        );

      case 'BCH':
        // Bitcoin Cash - Modified Bitcoin design
        return (
          <group ref={meshRef}>
            <Cylinder args={[1.2, 1.2, 0.3, 32]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Text position={[0, 0, 0.16]} fontSize={0.6} color={colors.secondary} anchorX="center" anchorY="middle">BCH</Text>
          </group>
        );

      case 'FIL':
        // Filecoin - Storage container design
        return (
          <group ref={meshRef}>
            <Box args={[1.4, 1.4, 0.8]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.6} roughness={0.4} />
            </Box>
            <Box args={[1.2, 1.2, 0.9]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.7} roughness={0.3} />
            </Box>
          </group>
        );

      case 'ICP':
        // Internet Computer - Circuit board design
        return (
          <group ref={meshRef}>
            <Box args={[1.5, 1.5, 0.2]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.8} roughness={0.2} />
            </Box>
            <Sphere args={[0.4, 16, 16]} position={[0, 0, 0.15]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.9} roughness={0.1} />
            </Sphere>
          </group>
        );

      case 'NEAR':
        // NEAR Protocol - Curved path design
        return (
          <group ref={meshRef}>
            <Torus args={[1, 0.3, 8, 16]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.7} roughness={0.3} />
            </Torus>
            <Sphere args={[0.4, 16, 16]} position={[1, 0, 0]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.8} roughness={0.2} />
            </Sphere>
          </group>
        );

      // Meme coins with fun designs
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

      case 'WIF':
        return (
          <group ref={meshRef}>
            <Sphere args={[0.8, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.4} roughness={0.6} />
            </Sphere>
            <Box args={[1.2, 0.4, 0.8]} position={[0, 0.6, 0]}>
              <meshStandardMaterial color={colors.secondary} metalness={0.5} roughness={0.5} />
            </Box>
          </group>
        );

      case 'BONK':
        return (
          <group ref={meshRef}>
            <Sphere args={[1, 16, 16]} position={[0, 0, 0]}>
              <meshStandardMaterial color={colors.primary} metalness={0.3} roughness={0.7} />
            </Sphere>
            {Array.from({ length: 8 }).map((_, i) => (
              <Sphere key={i} args={[0.1, 8, 8]} 
                     position={[Math.cos(i * Math.PI / 4) * 1.3, Math.sin(i * Math.PI / 4) * 1.3, 0]}>
                <meshStandardMaterial color={colors.secondary} emissive={colors.accent} emissiveIntensity={0.5} />
              </Sphere>
            ))}
          </group>
        );

      default:
        // Generic coin design with symbol
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
      // Major coins
      BTC: { primary: '#f7931a', secondary: '#ffffff', accent: '#ffcd3c' },
      ETH: { primary: '#627eea', secondary: '#ffffff', accent: '#8fa9ff' },
      USDT: { primary: '#26a17b', secondary: '#ffffff', accent: '#52c788' },
      USDC: { primary: '#2775ca', secondary: '#ffffff', accent: '#4da6ff' },
      BNB: { primary: '#f3ba2f', secondary: '#000000', accent: '#ffd700' },
      XRP: { primary: '#23292f', secondary: '#ffffff', accent: '#00d4aa' },
      ADA: { primary: '#0033ad', secondary: '#ffffff', accent: '#3468dc' },
      SOL: { primary: '#9945ff', secondary: '#ffffff', accent: '#bb73ff' },
      DOGE: { primary: '#c2a633', secondary: '#000000', accent: '#f4d03f' },
      DOT: { primary: '#e6007a', secondary: '#ffffff', accent: '#ff4da6' },
      MATIC: { primary: '#8247e5', secondary: '#ffffff', accent: '#a066ff' },
      SHIB: { primary: '#ffa409', secondary: '#000000', accent: '#ffcc66' },
      AVAX: { primary: '#e84142', secondary: '#ffffff', accent: '#ff6b6b' },
      LTC: { primary: '#bfbbbb', secondary: '#345d9d', accent: '#cccccc' },
      LINK: { primary: '#375bd2', secondary: '#ffffff', accent: '#5577ff' },
      UNI: { primary: '#ff007a', secondary: '#ffffff', accent: '#ff4da6' },
      ATOM: { primary: '#2e3148', secondary: '#ffffff', accent: '#6f7390' },
      TRX: { primary: '#ff060a', secondary: '#ffffff', accent: '#ff4d50' },
      BCH: { primary: '#8dc351', secondary: '#ffffff', accent: '#b8e986' },
      FIL: { primary: '#0090ff', secondary: '#ffffff', accent: '#4da6ff' },
      ICP: { primary: '#29abe2', secondary: '#ffffff', accent: '#66ccff' },
      NEAR: { primary: '#000000', secondary: '#ffffff', accent: '#333333' },
      
      // Meme coins
      PEPE: { primary: '#4CAF50', secondary: '#000000', accent: '#81C784' },
      WIF: { primary: '#8B4513', secondary: '#ffffff', accent: '#D2691E' },
      BONK: { primary: '#FF6B35', secondary: '#ffffff', accent: '#FF8C66' },
      FLOKI: { primary: '#FF6B6B', secondary: '#ffffff', accent: '#FF9999' },
      BABYDOGE: { primary: '#FFD700', secondary: '#000000', accent: '#FFEE33' },
      
      // Other major tokens
      OKB: { primary: '#3075ff', secondary: '#ffffff', accent: '#66b3ff' },
      PENGU: { primary: '#000000', secondary: '#ffffff', accent: '#ff6b35' },
      STETH: { primary: '#00d4aa', secondary: '#ffffff', accent: '#33ffcc' },
      TON: { primary: '#0088cc', secondary: '#ffffff', accent: '#33aaff' },
      ETC: { primary: '#329239', secondary: '#ffffff', accent: '#5cb85c' },
      HBAR: { primary: '#000000', secondary: '#ffffff', accent: '#333333' },
      GRT: { primary: '#6f4cff', secondary: '#ffffff', accent: '#9980ff' },
      ALGO: { primary: '#000000', secondary: '#ffffff', accent: '#333333' },
      QNT: { primary: '#6a67ce', secondary: '#ffffff', accent: '#9999ff' },
      MANA: { primary: '#ff2d55', secondary: '#ffffff', accent: '#ff6b85' },
      SAND: { primary: '#00d4ff', secondary: '#ffffff', accent: '#66e6ff' },
      AAVE: { primary: '#b6509e', secondary: '#ffffff', accent: '#d980cc' },
      
      // Default fallback
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