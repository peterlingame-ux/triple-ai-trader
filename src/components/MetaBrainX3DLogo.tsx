import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Torus, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const MetaBrainXShape = () => {
  const groupRef = useRef<THREE.Group>(null);
  const brainRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    
    if (brainRef.current) {
      brainRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base platform */}
      <RoundedBox args={[6, 0.4, 2]} radius={0.1} position={[0, -1, 0]}>
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#0f0f1a"
          emissiveIntensity={0.3}
        />
      </RoundedBox>

      {/* "Meta" text */}
      <Text
        position={[-1.8, 0.2, 0.1]}
        fontSize={0.8}
        color="#ffd700"
        anchorX="left"
        anchorY="middle"
      >
        Meta
      </Text>

      {/* Brain icon (stylized) */}
      <group ref={brainRef} position={[0.2, 0.2, 0.2]}>
        {/* Main brain sphere */}
        <Sphere args={[0.35, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#ffeb3b" 
            metalness={0.6} 
            roughness={0.4}
            emissive="#ffc107"
            emissiveIntensity={0.3}
          />
        </Sphere>
        
        {/* Neural pathways */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Box
            key={i}
            args={[0.02, 0.4, 0.02]}
            position={[
              Math.cos((i * Math.PI * 2) / 8) * 0.25,
              0,
              Math.sin((i * Math.PI * 2) / 8) * 0.25
            ]}
            rotation={[0, (i * Math.PI * 2) / 8, 0]}
          >
            <meshStandardMaterial 
              color="#ff9800" 
              emissive="#ff6f00"
              emissiveIntensity={0.5}
            />
          </Box>
        ))}

        {/* Connection nodes */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Sphere
            key={i}
            args={[0.05, 8, 8]}
            position={[
              Math.cos((i * Math.PI * 2) / 6) * 0.4,
              Math.sin((i * Math.PI * 3) / 6) * 0.2,
              Math.cos((i * Math.PI * 4) / 6) * 0.3
            ]}
          >
            <meshStandardMaterial 
              color="#ffeb3b" 
              emissive="#ffc107"
              emissiveIntensity={0.8}
            />
          </Sphere>
        ))}
      </group>

      {/* "BrainX" text */}
      <Text
        position={[1.3, 0.2, 0.1]}
        fontSize={0.8}
        color="#ffd700"
        anchorX="left"
        anchorY="middle"
      >
        BrainX
      </Text>

      {/* Glowing energy rings */}
      <Torus args={[2.5, 0.05, 8, 32]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ffb300"
          emissiveIntensity={0.4}
          transparent={true}
          opacity={0.8}
        />
      </Torus>

      <Torus args={[3, 0.03, 8, 32]} position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial 
          color="#ff9800" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#ff6f00"
          emissiveIntensity={0.3}
          transparent={true}
          opacity={0.6}
        />
      </Torus>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.02, 6, 6]}
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 3
          ]}
        >
          <meshStandardMaterial 
            color="#ffeb3b" 
            emissive="#ffc107"
            emissiveIntensity={Math.random() * 0.8 + 0.2}
          />
        </Sphere>
      ))}

      {/* Light beams */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Box
          key={i}
          args={[0.01, 3, 0.01]}
          position={[
            Math.cos((i * Math.PI * 2) / 4) * 2,
            0,
            Math.sin((i * Math.PI * 2) / 4) * 2
          ]}
          rotation={[0, (i * Math.PI * 2) / 4, 0]}
        >
          <meshStandardMaterial 
            color="#ffd700" 
            emissive="#ffb300"
            emissiveIntensity={0.8}
            transparent={true}
            opacity={0.7}
          />
        </Box>
      ))}
    </group>
  );
};

export const MetaBrainX3DLogo: React.FC<{ size?: number }> = ({ size = 200 }) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, 3, 2]} intensity={0.6} color="#ffd700" />
        <pointLight position={[0, 3, 3]} intensity={1} color="#ffeb3b" />
        <pointLight position={[3, 0, -3]} intensity={0.8} color="#ff9800" />
        <spotLight 
          position={[0, 5, 0]} 
          angle={0.3} 
          penumbra={0.2} 
          intensity={0.8} 
          color="#ffd700"
          target-position={[0, 0, 0]}
        />
        
        <MetaBrainXShape />
      </Canvas>
    </div>
  );
};

export default MetaBrainX3DLogo;