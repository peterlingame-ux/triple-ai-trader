import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const SolanaShape = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.6;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main circular base */}
      <Cylinder args={[1.3, 1.3, 0.2, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#9945ff" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#6b1fff"
          emissiveIntensity={0.2}
        />
      </Cylinder>

      {/* Solana gradient bars */}
      <Box args={[2, 0.3, 0.15]} position={[0, 0.5, 0.15]} rotation={[0, 0, 0.2]}>
        <meshStandardMaterial 
          color="#bb73ff" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#9945ff"
          emissiveIntensity={0.3}
        />
      </Box>

      <Box args={[2, 0.3, 0.15]} position={[0, 0, 0.15]} rotation={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#dc92ff" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#9945ff"
          emissiveIntensity={0.25}
        />
      </Box>

      <Box args={[2, 0.3, 0.15]} position={[0, -0.5, 0.15]} rotation={[0, 0, -0.2]}>
        <meshStandardMaterial 
          color="#bb73ff" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#9945ff"
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Central energy core */}
      <Sphere args={[0.4, 16, 16]} position={[0, 0, 0.25]}>
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#bb73ff"
          emissiveIntensity={0.5}
          transparent={true}
          opacity={0.8}
        />
      </Sphere>

      {/* Floating particles */}
      {Array.from({ length: 16 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.04, 8, 8]}
          position={[
            Math.cos((i * Math.PI * 2) / 16) * (1.2 + Math.sin(i) * 0.3),
            Math.sin((i * Math.PI * 2) / 16) * (1.2 + Math.cos(i) * 0.3),
            0.1 + Math.sin(i * 3) * 0.2
          ]}
        >
          <meshStandardMaterial 
            color="#dc92ff" 
            emissive="#9945ff"
            emissiveIntensity={0.8}
          />
        </Sphere>
      ))}

      {/* Outer ring */}
      <Cylinder args={[1.5, 1.5, 0.08, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#6b1fff" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#4a00cc"
          emissiveIntensity={0.4}
          transparent={true}
          opacity={0.7}
        />
      </Cylinder>
    </group>
  );
};

export const SOL3DLogo: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, 3, 2]} intensity={0.4} color="#bb73ff" />
        <pointLight position={[0, 0, 3]} intensity={0.7} color="#9945ff" />
        
        <SolanaShape />
      </Canvas>
    </div>
  );
};

export default SOL3DLogo;