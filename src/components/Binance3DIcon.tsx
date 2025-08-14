import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder, Torus, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Binance3DIconProps {
  symbol: string;
  size?: number;
  animated?: boolean;
}

// 真实币安3D图标配置，基于实际设计
const BINANCE_ICON_CONFIGS = {
  // 主流币种 - 基于真实设计
  BTC: {
    type: 'sphere',
    color: '#F7931A',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#8B4513',
    logo: '₿'
  },
  ETH: {
    type: 'diamond',
    color: '#627EEA',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#1E1E3F',
    logo: 'Ξ'
  },
  USDT: {
    type: 'cylinder',
    color: '#26A17B',
    metalness: 0.5,
    roughness: 0.4,
    emissive: '#1A5D4A',
    logo: 'T'
  },
  USDC: {
    type: 'cylinder',
    color: '#2775CA',
    metalness: 0.5,
    roughness: 0.4,
    emissive: '#1B4B7A',
    logo: 'C'
  },
  BNB: {
    type: 'octahedron',
    color: '#F3BA2F',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#B8860B',
    logo: 'B'
  },
  XRP: {
    type: 'torus',
    color: '#23292F',
    metalness: 0.6,
    roughness: 0.3,
    emissive: '#0D1114',
    logo: 'X'
  },
  STETH: {
    type: 'diamond',
    color: '#00D4FF',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#0099CC',
    logo: 'E'
  },
  ADA: {
    type: 'sphere',
    color: '#0033AD',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#001A5C',
    logo: '₳'
  },
  SOL: {
    type: 'cylinder',
    color: '#9945FF',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#5D1A9B',
    logo: '◎'
  },
  DOGE: {
    type: 'sphere',
    color: '#C2A633',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#8B7355',
    logo: 'D'
  },
  TRX: {
    type: 'cylinder',
    color: '#FF061E',
    metalness: 0.6,
    roughness: 0.3,
    emissive: '#A60414',
    logo: 'T'
  },
  TON: {
    type: 'box',
    color: '#0088CC',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#005588',
    logo: 'T'
  },
  AVAX: {
    type: 'triangle',
    color: '#E84142',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#B22D2E',
    logo: 'A'
  },
  DOT: {
    type: 'sphere',
    color: '#E6007A',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#99004D',
    logo: '●'
  },
  MATIC: {
    type: 'diamond',
    color: '#8247E5',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#4A2980',
    logo: 'M'
  },
  SHIB: {
    type: 'sphere',
    color: '#FFA409',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#CC7500',
    logo: 'S'
  },
  LTC: {
    type: 'cylinder',
    color: '#BFBBBB',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#7A7A7A',
    logo: 'Ł'
  },
  BCH: {
    type: 'sphere',
    color: '#8DC351',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#5A7A33',
    logo: 'B'
  },
  LINK: {
    type: 'box',
    color: '#375BD2',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#243A8C',
    logo: 'L'
  },
  XLM: {
    type: 'star',
    color: '#7D00FF',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#4D0099',
    logo: '*'
  },
  UNI: {
    type: 'sphere',
    color: '#FF007A',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#B3004D',
    logo: 'U'
  },
  ATOM: {
    type: 'torus',
    color: '#2E3148',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#16182A',
    logo: 'A'
  },
  ETC: {
    type: 'diamond',
    color: '#328332',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#1F5F1F',
    logo: 'E'
  },
  HBAR: {
    type: 'cylinder',
    color: '#000000',
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#333333',
    logo: 'H'
  },
  FIL: {
    type: 'box',
    color: '#0090FF',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#0066B3',
    logo: 'F'
  },
  ICP: {
    type: 'sphere',
    color: '#29ABE2',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#1A6B99',
    logo: 'I'
  },
  CRO: {
    type: 'diamond',
    color: '#002D74',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#001A44',
    logo: 'C'
  },
  APT: {
    type: 'box',
    color: '#000000',
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#333333',
    logo: 'A'
  },
  NEAR: {
    type: 'triangle',
    color: '#00C08B',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#007A5A',
    logo: 'N'
  },
  VET: {
    type: 'cylinder',
    color: '#15BDFF',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#0E7ECC',
    logo: 'V'
  },
  GRT: {
    type: 'sphere',
    color: '#6F4CFF',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#4A32CC',
    logo: 'G'
  },
  ALGO: {
    type: 'box',
    color: '#000000',
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#333333',
    logo: 'A'
  },
  QNT: {
    type: 'diamond',
    color: '#FA6D01',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#CC4A00',
    logo: 'Q'
  },
  MANA: {
    type: 'sphere',
    color: '#FF2D55',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#CC1A36',
    logo: 'M'
  },
  SAND: {
    type: 'box',
    color: '#00ADEF',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#0074A3',
    logo: 'S'
  },
  AAVE: {
    type: 'sphere',
    color: '#B6509E',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#7A3466',
    logo: 'A'
  },
  MKR: {
    type: 'cylinder',
    color: '#1AAB9B',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#117A6F',
    logo: 'M'
  },
  LRC: {
    type: 'torus',
    color: '#1C60FF',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#1242CC',
    logo: 'L'
  },
  ENJ: {
    type: 'box',
    color: '#624DBF',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#3F3280',
    logo: 'E'
  },
  BAT: {
    type: 'triangle',
    color: '#FF5000',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#CC3300',
    logo: 'B'
  },
  ZEC: {
    type: 'sphere',
    color: '#F4B728',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#CC8F1A',
    logo: 'Z'
  },
  COMP: {
    type: 'cylinder',
    color: '#00D395',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#00A06E',
    logo: 'C'
  },
  YFI: {
    type: 'box',
    color: '#006AE3',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#0050B3',
    logo: 'Y'
  },
  SNX: {
    type: 'diamond',
    color: '#00D4FF',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#00A6CC',
    logo: 'S'
  },
  "1INCH": {
    type: 'sphere',
    color: '#1B1E29',
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#0D0F14',
    logo: '1'
  },
  REN: {
    type: 'torus',
    color: '#080817',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#04040B',
    logo: 'R'
  },
  KNC: {
    type: 'box',
    color: '#31CB9E',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#249973',
    logo: 'K'
  },
  CRV: {
    type: 'cylinder',
    color: '#40649F',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#2E4A75',
    logo: 'C'
  },
  UMA: {
    type: 'triangle',
    color: '#FF6B6B',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#CC4444',
    logo: 'U'
  },
  BAL: {
    type: 'sphere',
    color: '#1E1E1E',
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#0F0F0F',
    logo: 'B'
  },
  SUSHI: {
    type: 'box',
    color: '#FA52A0',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#CC3E7A',
    logo: 'S'
  },
  FTM: {
    type: 'diamond',
    color: '#13B5EC',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#0E8BBD',
    logo: 'F'
  },
  FLOW: {
    type: 'cylinder',
    color: '#00EF8B',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#00BF6B',
    logo: 'F'
  },
  EGLD: {
    type: 'sphere',
    color: '#1B46C2',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#133399',
    logo: 'E'
  },
  ONE: {
    type: 'torus',
    color: '#00AEE9',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#007AB8',
    logo: 'O'
  },
  HIVE: {
    type: 'box',
    color: '#E31337',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#B20E2B',
    logo: 'H'
  },
  THETA: {
    type: 'triangle',
    color: '#2AB8E6',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#1F8FB8',
    logo: 'Θ'
  },
  TFUEL: {
    type: 'cylinder',
    color: '#2AB8E6',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#1F8FB8',
    logo: 'T'
  },
  KAVA: {
    type: 'sphere',
    color: '#FF564F',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#CC3F36',
    logo: 'K'
  },
  BAND: {
    type: 'diamond',
    color: '#516AFF',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#3D4FCC',
    logo: 'B'
  },
  RVN: {
    type: 'box',
    color: '#384182',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#262E5C',
    logo: 'R'
  },
  ZIL: {
    type: 'torus',
    color: '#49C1BF',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#359A99',
    logo: 'Z'
  },
  ICX: {
    type: 'cylinder',
    color: '#1FC5C9',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#169699',
    logo: 'I'
  },
  ONT: {
    type: 'sphere',
    color: '#32A4BE',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#247A96',
    logo: 'O'
  },
  QTUM: {
    type: 'box',
    color: '#2E9AD0',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#2374A6',
    logo: 'Q'
  },
  WAVES: {
    type: 'triangle',
    color: '#0155FF',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#0140CC',
    logo: 'W'
  },
  SC: {
    type: 'diamond',
    color: '#00CBA0',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#009973',
    logo: 'S'
  },
  DGB: {
    type: 'cylinder',
    color: '#006BA6',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#004C7A',
    logo: 'D'
  },
  LSK: {
    type: 'sphere',
    color: '#0D98BA',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#0A7394',
    logo: 'L'
  },
  ARK: {
    type: 'torus',
    color: '#CC3E3E',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#992E2E',
    logo: 'A'
  },
  NANO: {
    type: 'box',
    color: '#4A90E2',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#3570B8',
    logo: 'N'
  },
  IOST: {
    type: 'triangle',
    color: '#1C1C1C',
    metalness: 0.9,
    roughness: 0.1,
    emissive: '#0D0D0D',
    logo: 'I'
  },
  ZEN: {
    type: 'diamond',
    color: '#00586E',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#003A47',
    logo: 'Z'
  },
  MAID: {
    type: 'cylinder',
    color: '#5492D6',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#3F6EA6',
    logo: 'M'
  },
  REP: {
    type: 'sphere',
    color: '#602C50',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#42203A',
    logo: 'R'
  },
  KMD: {
    type: 'box',
    color: '#326464',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#234848',
    logo: 'K'
  },
  DCR: {
    type: 'torus',
    color: '#2ED6A1',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#22A074',
    logo: 'D'
  },
  STRAT: {
    type: 'triangle',
    color: '#1382C6',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#0E6199',
    logo: 'S'
  },
  NXT: {
    type: 'diamond',
    color: '#008FBB',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#00668C',
    logo: 'N'
  },
  SYS: {
    type: 'cylinder',
    color: '#0082C6',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#005E99',
    logo: 'S'
  },
  // Meme coins
  PEPE: {
    type: 'sphere',
    color: '#40B68A',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#2E8866',
    logo: 'P'
  },
  BONK: {
    type: 'box',
    color: '#FFB900',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#CC9400',
    logo: 'B'
  },
  WIF: {
    type: 'triangle',
    color: '#FF6B35',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#CC4A26',
    logo: 'W'
  },
  FLOKI: {
    type: 'diamond',
    color: '#F15A24',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#C1431B',
    logo: 'F'
  },
  BABYDOGE: {
    type: 'cylinder',
    color: '#FFA500',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#CC7D00',
    logo: 'B'
  },
  SAFE: {
    type: 'sphere',
    color: '#42C55C',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#329943',
    logo: 'S'
  },
  MEME: {
    type: 'torus',
    color: '#FF4081',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#CC2E5C',
    logo: 'M'
  },
  WOJAK: {
    type: 'box',
    color: '#4CAF50',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#3A8A3D',
    logo: 'W'
  },
  TURBO: {
    type: 'triangle',
    color: '#FF9800',
    metalness: 0.7,
    roughness: 0.3,
    emissive: '#CC7700',
    logo: 'T'
  },
  LADYS: {
    type: 'diamond',
    color: '#E91E63',
    metalness: 0.5,
    roughness: 0.5,
    emissive: '#B71750',
    logo: 'L'
  },
  TRUMP: {
    type: 'cylinder',
    color: '#FF0000',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#CC0000',
    logo: 'T'
  },
  // 新增币种
  OKB: {
    type: 'octahedron',
    color: '#3075EE',
    metalness: 0.8,
    roughness: 0.2,
    emissive: '#1E4A99',
    logo: 'O'
  },
  PENGU: {
    type: 'sphere',
    color: '#7B68EE',
    metalness: 0.6,
    roughness: 0.4,
    emissive: '#5A4FBD',
    logo: 'P'
  }
};

// 3D形状组件
const CryptoShape: React.FC<{
  config: any;
  animated: boolean;
}> = ({ config, animated }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current && animated) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const materialProps = useMemo(() => ({
    color: config.color,
    metalness: config.metalness,
    roughness: config.roughness,
    emissive: config.emissive,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.95
  }), [config]);

  const renderShape = () => {
    switch (config.type) {
      case 'sphere':
        return (
          <Sphere ref={meshRef} args={[0.8, 32, 32]}>
            <meshStandardMaterial {...materialProps} />
          </Sphere>
        );
      case 'box':
        return (
          <Box ref={meshRef} args={[1.2, 1.2, 1.2]}>
            <meshStandardMaterial {...materialProps} />
          </Box>
        );
      case 'cylinder':
        return (
          <Cylinder ref={meshRef} args={[0.7, 0.7, 1.2, 32]}>
            <meshStandardMaterial {...materialProps} />
          </Cylinder>
        );
      case 'torus':
        return (
          <Torus ref={meshRef} args={[0.8, 0.3, 16, 32]}>
            <meshStandardMaterial {...materialProps} />
          </Torus>
        );
      case 'diamond':
        return (
          <Box args={[1, 1, 1]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <meshStandardMaterial {...materialProps} />
          </Box>
        );
      case 'triangle':
        return (
          <>
            <Box args={[1.2, 0.2, 1.2]} rotation={[0, 0, Math.PI / 6]}>
              <meshStandardMaterial {...materialProps} />
            </Box>
            <Box args={[1.2, 0.2, 1.2]} rotation={[0, 0, -Math.PI / 6]}>
              <meshStandardMaterial {...materialProps} />
            </Box>
          </>
        );
      case 'star':
        return (
          <>
            <Box args={[1.5, 0.2, 0.2]}>
              <meshStandardMaterial {...materialProps} />
            </Box>
            <Box args={[0.2, 1.5, 0.2]}>
              <meshStandardMaterial {...materialProps} />
            </Box>
            <Box args={[1, 0.2, 0.2]} rotation={[0, 0, Math.PI / 4]}>
              <meshStandardMaterial {...materialProps} />
            </Box>
            <Box args={[1, 0.2, 0.2]} rotation={[0, 0, -Math.PI / 4]}>
              <meshStandardMaterial {...materialProps} />
            </Box>
          </>
        );
      case 'octahedron':
        return (
          <>
            <Box args={[1, 1, 1]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
              <meshStandardMaterial {...materialProps} />
            </Box>
            <Box args={[1, 1, 1]} rotation={[-Math.PI / 4, 0, -Math.PI / 4]}>
              <meshStandardMaterial {...materialProps} />
            </Box>
          </>
        );
      default:
        return (
          <Sphere ref={meshRef} args={[0.8, 32, 32]}>
            <meshStandardMaterial {...materialProps} />
          </Sphere>
        );
    }
  };

  return (
    <group ref={groupRef}>
      {renderShape()}
      <Text
        position={[0, 0, 1.2]}
        fontSize={0.4}
        color={config.color}
        anchorX="center"
        anchorY="middle"
      >
        {config.logo}
      </Text>
    </group>
  );
};

export const Binance3DIcon: React.FC<Binance3DIconProps> = ({
  symbol,
  size = 40,
  animated = true
}) => {
  const config = BINANCE_ICON_CONFIGS[symbol as keyof typeof BINANCE_ICON_CONFIGS] || 
    BINANCE_ICON_CONFIGS.BTC; // 默认使用BTC样式

  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} castShadow />
        <directionalLight position={[-2, -2, 2]} intensity={0.3} />
        <pointLight position={[0, 0, 2]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <CryptoShape config={config} animated={animated} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Binance3DIcon;