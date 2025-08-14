import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

const EthereumShape = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.6;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Top diamond */}
      <Box args={[1.4, 1.4, 0.4]} position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial 
          color="#627eea" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#3d4cc9"
          emissiveIntensity={0.2}
        />
      </Box>
      
      {/* Bottom diamond */}
      <Box args={[1.4, 1.4, 0.4]} position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial 
          color="#8fa9ff" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#4d6aff"
          emissiveIntensity={0.15}
        />
      </Box>

      {/* Center connecting piece */}
      <Box args={[0.8, 0.8, 0.5]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial 
          color="#5a7cfa" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#2d3f8f"
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Outer glow rings */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Box
          key={i}
          args={[0.1, 2 + i * 0.3, 0.1]}
          position={[0, 0, 0]}
          rotation={[0, 0, (Math.PI / 4) + (i * Math.PI / 8)]}
        >
          <meshStandardMaterial 
            color="#66b3ff" 
            metalness={0.8} 
            roughness={0.2}
            transparent={true}
            opacity={0.6 - i * 0.1}
            emissive="#4d9fff"
            emissiveIntensity={0.4}
          />
        </Box>
      ))}
    </group>
  );
};

export const ETH3DLogo: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#66b3ff" />
        <pointLight position={[0, 0, 3]} intensity={0.8} color="#627eea" />
        
        <EthereumShape />
      </Canvas>
    </div>
  );
};

export default ETH3DLogo;