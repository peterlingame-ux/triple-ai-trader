import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Cylinder, Sphere, Torus } from '@react-three/drei';
import * as THREE from 'three';

const BitcoinShape = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main coin body */}
      <Cylinder args={[1.2, 1.2, 0.3, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#f7931a" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#b8860b"
          emissiveIntensity={0.1}
        />
      </Cylinder>
      
      {/* Inner rim */}
      <Cylinder args={[1.15, 1.15, 0.35, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ffcd3c" 
          metalness={0.8} 
          roughness={0.2}
        />
      </Cylinder>

      {/* Bitcoin B symbol */}
      <Text
        position={[0, 0, 0.18]}
        fontSize={0.7}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        ₿
      </Text>

      {/* Outer decorative ring */}
      <Torus args={[1.3, 0.08, 8, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ffaa00"
          emissiveIntensity={0.2}
        />
      </Torus>

      {/* Glowing particles around */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Sphere
          key={i}
          args={[0.03, 8, 8]}
          position={[
            Math.cos((i * Math.PI * 2) / 12) * 1.6,
            Math.sin((i * Math.PI * 2) / 12) * 1.6,
            0
          ]}
        >
          <meshStandardMaterial 
            color="#ffaa00" 
            emissive="#ff8800"
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}
    </group>
  );
};

export const BTC3DLogo: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, 3, 2]} intensity={0.4} color="#ffaa00" />
        <pointLight position={[0, 0, 3]} intensity={0.8} color="#f7931a" />
        
        <BitcoinShape />
      </Canvas>
    </div>
  );
};

export default BTC3DLogo;