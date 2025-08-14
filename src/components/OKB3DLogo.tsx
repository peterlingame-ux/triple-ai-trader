import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Cylinder, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

const OKBShape = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.6;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main octagonal base */}
      <Cylinder args={[1.2, 1.2, 0.4, 8]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#3075ff" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#001a66"
          emissiveIntensity={0.1}
        />
      </Cylinder>
      
      {/* Inner core */}
      <Cylinder args={[0.8, 0.8, 0.45, 8]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#66b3ff" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#003d99"
          emissiveIntensity={0.2}
        />
      </Cylinder>

      {/* OK Text */}
      <Text
        position={[0, 0, 0.25]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        OK
      </Text>

      {/* Outer ring */}
      <Torus args={[1.4, 0.08, 8, 24]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#0066ff" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#001a66"
          emissiveIntensity={0.3}
        />
      </Torus>

      {/* Decorative elements */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box
          key={i}
          args={[0.1, 0.1, 0.6]}
          position={[
            Math.cos((i * Math.PI * 2) / 8) * 1.6,
            Math.sin((i * Math.PI * 2) / 8) * 1.6,
            0
          ]}
          rotation={[0, 0, (i * Math.PI * 2) / 8]}
        >
          <meshStandardMaterial 
            color="#4da6ff" 
            metalness={0.8} 
            roughness={0.2}
          />
        </Box>
      ))}
    </group>
  );
};

export const OKB3DLogo: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, 3, 2]} intensity={0.4} color="#66b3ff" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#3075ff" />
        
        <OKBShape />
      </Canvas>
    </div>
  );
};

export default OKB3DLogo;