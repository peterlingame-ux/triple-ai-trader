import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const PENGUShape = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      // Gentle bobbing motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main body - black */}
      <Sphere args={[1, 24, 24]} position={[0, -0.3, 0]} scale={[1, 1.3, 0.9]}>
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.1} 
          roughness={0.8}
        />
      </Sphere>

      {/* Head - black */}
      <Sphere args={[0.7, 24, 24]} position={[0, 0.6, 0.1]}>
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.1} 
          roughness={0.8}
        />
      </Sphere>

      {/* White belly */}
      <Sphere args={[0.6, 24, 24]} position={[0, -0.2, 0.7]} scale={[1, 1.2, 0.6]}>
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1} 
          roughness={0.9}
        />
      </Sphere>

      {/* Orange beak */}
      <Box args={[0.15, 0.08, 0.3]} position={[0, 0.55, 0.6]}>
        <meshStandardMaterial 
          color="#ff6b35" 
          metalness={0.2} 
          roughness={0.7}
        />
      </Box>

      {/* Eyes */}
      <Sphere args={[0.12, 16, 16]} position={[-0.15, 0.65, 0.5]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.12, 16, 16]} position={[0.15, 0.65, 0.5]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      
      {/* Eye pupils */}
      <Sphere args={[0.06, 16, 16]} position={[-0.15, 0.65, 0.56]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.06, 16, 16]} position={[0.15, 0.65, 0.56]}>
        <meshStandardMaterial color="#000000" />
      </Sphere>

      {/* Wings/flippers */}
      <Box 
        args={[0.25, 1, 0.3]} 
        position={[-0.8, 0, 0.2]} 
        rotation={[0, 0, 0.4]}
      >
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.1} 
          roughness={0.8}
        />
      </Box>
      
      <Box 
        args={[0.25, 1, 0.3]} 
        position={[0.8, 0, 0.2]} 
        rotation={[0, 0, -0.4]}
      >
        <meshStandardMaterial 
          color="#000000" 
          metalness={0.1} 
          roughness={0.8}
        />
      </Box>

      {/* Feet */}
      <Cylinder args={[0.2, 0.15, 0.1, 8]} position={[-0.3, -1, 0.3]}>
        <meshStandardMaterial 
          color="#ff6b35" 
          metalness={0.2} 
          roughness={0.7}
        />
      </Cylinder>
      
      <Cylinder args={[0.2, 0.15, 0.1, 8]} position={[0.3, -1, 0.3]}>
        <meshStandardMaterial 
          color="#ff6b35" 
          metalness={0.2} 
          roughness={0.7}
        />
      </Cylinder>

      {/* Ice/snow base effect */}
      <Cylinder args={[1.5, 1.3, 0.2, 32]} position={[0, -1.2, 0]}>
        <meshStandardMaterial 
          color="#e6f3ff" 
          metalness={0.1} 
          roughness={0.1}
          transparent={true}
          opacity={0.7}
        />
      </Cylinder>
    </group>
  );
};

export const PENGU3DLogo: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-3, 2, 3]} intensity={0.3} color="#66b3ff" />
        <pointLight position={[0, 2, 4]} intensity={0.4} color="#ff6b35" />
        
        <PENGUShape />
      </Canvas>
    </div>
  );
};

export default PENGU3DLogo;