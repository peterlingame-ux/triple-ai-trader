import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

const DogeShape = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.7;
      // Playful bobbing motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main coin body */}
      <Cylinder args={[1.1, 1.1, 0.3, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#c2a633" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#b8941a"
          emissiveIntensity={0.1}
        />
      </Cylinder>

      {/* Dog face base */}
      <Sphere args={[0.8, 16, 16]} position={[0, 0, 0.2]} scale={[1, 0.9, 0.8]}>
        <meshStandardMaterial 
          color="#f4d03f" 
          metalness={0.3} 
          roughness={0.7}
        />
      </Sphere>

      {/* Dog ears */}
      <Sphere args={[0.25, 12, 12]} position={[-0.5, 0.4, 0.3]} scale={[1, 1.5, 0.6]}>
        <meshStandardMaterial 
          color="#e6c200" 
          metalness={0.2} 
          roughness={0.8}
        />
      </Sphere>
      
      <Sphere args={[0.25, 12, 12]} position={[0.5, 0.4, 0.3]} scale={[1, 1.5, 0.6]}>
        <meshStandardMaterial 
          color="#e6c200" 
          metalness={0.2} 
          roughness={0.8}
        />
      </Sphere>

      {/* Dog snout */}
      <Sphere args={[0.4, 12, 12]} position={[0, -0.3, 0.5]} scale={[0.8, 0.6, 1]}>
        <meshStandardMaterial 
          color="#fff2cc" 
          metalness={0.1} 
          roughness={0.9}
        />
      </Sphere>

      {/* Eyes */}
      <Sphere args={[0.12, 12, 12]} position={[-0.2, 0.1, 0.6]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.12, 12, 12]} position={[0.2, 0.1, 0.6]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>

      {/* Eye shine */}
      <Sphere args={[0.04, 8, 8]} position={[-0.18, 0.15, 0.65]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </Sphere>
      <Sphere args={[0.04, 8, 8]} position={[0.22, 0.15, 0.65]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </Sphere>

      {/* Nose */}
      <Sphere args={[0.06, 8, 8]} position={[0, -0.25, 0.65]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>

      {/* Mouth */}
      <Box args={[0.3, 0.05, 0.05]} position={[0, -0.45, 0.6]}>
        <meshStandardMaterial color="#000000" />
      </Box>

      {/* Decorative sparkles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.03, 6, 6]}
          position={[
            Math.cos((i * Math.PI * 2) / 8) * 1.4,
            Math.sin((i * Math.PI * 2) / 8) * 1.4,
            0.1
          ]}
        >
          <meshStandardMaterial 
            color="#ffaa00" 
            emissive="#ff8800"
            emissiveIntensity={0.6}
          />
        </Sphere>
      ))}
    </group>
  );
};

export const DOGE3DLogo: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-3, 2, 3]} intensity={0.3} color="#f4d03f" />
        <pointLight position={[0, 2, 4]} intensity={0.5} color="#c2a633" />
        
        <DogeShape />
      </Canvas>
    </div>
  );
};

export default DOGE3DLogo;