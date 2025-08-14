import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const BinanceShape = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Center diamond */}
      <Box args={[0.8, 0.8, 0.4]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial 
          color="#f3ba2f" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#cc9900"
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Four outer diamonds */}
      <Box args={[0.5, 0.5, 0.3]} position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ffaa00"
          emissiveIntensity={0.2}
        />
      </Box>
      
      <Box args={[0.5, 0.5, 0.3]} position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ffaa00"
          emissiveIntensity={0.2}
        />
      </Box>
      
      <Box args={[0.5, 0.5, 0.3]} position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ffaa00"
          emissiveIntensity={0.2}
        />
      </Box>
      
      <Box args={[0.5, 0.5, 0.3]} position={[0, -1.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial 
          color="#ffd700" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ffaa00"
          emissiveIntensity={0.2}
        />
      </Box>

      {/* Connecting beams */}
      <Box args={[0.8, 0.1, 0.2]} position={[0.6, 0, 0]}>
        <meshStandardMaterial 
          color="#ffcc00" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#ff9900"
          emissiveIntensity={0.4}
        />
      </Box>
      
      <Box args={[0.8, 0.1, 0.2]} position={[-0.6, 0, 0]}>
        <meshStandardMaterial 
          color="#ffcc00" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#ff9900"
          emissiveIntensity={0.4}
        />
      </Box>
      
      <Box args={[0.1, 0.8, 0.2]} position={[0, 0.6, 0]}>
        <meshStandardMaterial 
          color="#ffcc00" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#ff9900"
          emissiveIntensity={0.4}
        />
      </Box>
      
      <Box args={[0.1, 0.8, 0.2]} position={[0, -0.6, 0]}>
        <meshStandardMaterial 
          color="#ffcc00" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#ff9900"
          emissiveIntensity={0.4}
        />
      </Box>

      {/* Glowing orbs at corners */}
      {[
        [0.85, 0.85, 0.1],
        [-0.85, 0.85, 0.1],
        [0.85, -0.85, 0.1],
        [-0.85, -0.85, 0.1]
      ].map((pos, i) => (
        <Sphere key={i} args={[0.08, 16, 16]} position={pos as [number, number, number]}>
          <meshStandardMaterial 
            color="#ffaa00" 
            emissive="#ff8800"
            emissiveIntensity={0.8}
          />
        </Sphere>
      ))}
    </group>
  );
};

export const BNB3DLogo: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, 3, 2]} intensity={0.4} color="#ffd700" />
        <pointLight position={[0, 0, 3]} intensity={0.6} color="#f3ba2f" />
        
        <BinanceShape />
      </Canvas>
    </div>
  );
};

export default BNB3DLogo;