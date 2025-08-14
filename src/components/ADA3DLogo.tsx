import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

const CardanoShape = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central sphere */}
      <Sphere args={[0.6, 20, 20]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#0033ad" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#001a66"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Outer ring structures */}
      <Torus args={[1.2, 0.1, 8, 24]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#3468dc" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#1a4db8"
          emissiveIntensity={0.4}
        />
      </Torus>

      <Torus args={[1.2, 0.1, 8, 24]} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial 
          color="#3468dc" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#1a4db8"
          emissiveIntensity={0.4}
        />
      </Torus>

      <Torus args={[1.2, 0.1, 8, 24]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#3468dc" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#1a4db8"
          emissiveIntensity={0.4}
        />
      </Torus>

      {/* Connection nodes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.12, 12, 12]}
          position={[
            Math.cos((i * Math.PI * 2) / 6) * 1.2,
            Math.sin((i * Math.PI * 2) / 6) * 1.2,
            0
          ]}
        >
          <meshStandardMaterial 
            color="#66b3ff" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#4d9fff"
            emissiveIntensity={0.6}
          />
        </Sphere>
      ))}

      {/* Inner connecting bars */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          args={[0.05, 0.8, 0.05]}
          position={[
            Math.cos((i * Math.PI * 2) / 6) * 0.6,
            Math.sin((i * Math.PI * 2) / 6) * 0.6,
            0
          ]}
          rotation={[0, 0, (i * Math.PI * 2) / 6]}
        >
          <meshStandardMaterial 
            color="#4d9fff" 
            metalness={0.7} 
            roughness={0.3}
            emissive="#3385ff"
            emissiveIntensity={0.5}
          />
        </Box>
      ))}

      {/* Outer energy field */}
      <Sphere args={[1.6, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#66b3ff" 
          metalness={0.5} 
          roughness={0.8}
          transparent={true}
          opacity={0.1}
          emissive="#0033ad"
          emissiveIntensity={0.2}
        />
      </Sphere>
    </group>
  );
};

export const ADA3DLogo: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, 3, 2]} intensity={0.4} color="#66b3ff" />
        <pointLight position={[0, 0, 3]} intensity={0.6} color="#0033ad" />
        
        <CardanoShape />
      </Canvas>
    </div>
  );
};

export default ADA3DLogo;