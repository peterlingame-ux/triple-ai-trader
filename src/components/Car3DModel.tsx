import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface Car3DModelProps {
  brand: string;
  size?: number;
  color?: string;
}

function CarMesh({ brand, color = '#ff6b6b' }: { brand: string; color: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const getCarGeometry = () => {
    switch (brand.toLowerCase()) {
      case 'ferrari':
        return (
          <group ref={meshRef}>
            {/* Car Body - Ferrari style sleek */}
            <Box args={[1.8, 0.4, 0.8]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </Box>
            {/* Front */}
            <Box args={[0.3, 0.3, 0.7]} position={[0.9, -0.05, 0]}>
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </Box>
            {/* Rear spoiler */}
            <Box args={[0.2, 0.1, 0.8]} position={[-0.8, 0.3, 0]}>
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.15, 0.15, 0.1]} position={[0.5, -0.3, 0.45]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 0.1]} position={[0.5, -0.3, -0.45]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 0.1]} position={[-0.5, -0.3, 0.45]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Cylinder>
            <Cylinder args={[0.15, 0.15, 0.1]} position={[-0.5, -0.3, -0.45]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Cylinder>
          </group>
        );
      case 'lamborghini':
        return (
          <group ref={meshRef}>
            {/* Car Body - Lamborghini angular style */}
            <Box args={[1.7, 0.35, 0.85]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </Box>
            {/* Angular front */}
            <Box args={[0.4, 0.2, 0.6]} position={[0.85, 0, 0]} rotation={[0, 0, 0.2]}>
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </Box>
            {/* Rear wing */}
            <Box args={[0.3, 0.05, 0.9]} position={[-0.7, 0.4, 0]}>
              <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.2} />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.16, 0.16, 0.12]} position={[0.5, -0.3, 0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
            <Cylinder args={[0.16, 0.16, 0.12]} position={[0.5, -0.3, -0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
            <Cylinder args={[0.16, 0.16, 0.12]} position={[-0.5, -0.3, 0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
            <Cylinder args={[0.16, 0.16, 0.12]} position={[-0.5, -0.3, -0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
          </group>
        );
      case 'porsche':
        return (
          <group ref={meshRef}>
            {/* Car Body - Porsche classic curve */}
            <Sphere args={[0.9, 32, 16]} scale={[1.8, 0.4, 0.8]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
            </Sphere>
            {/* Front curve */}
            <Sphere args={[0.3, 16, 8]} position={[0.7, 0, 0]} scale={[1.2, 0.8, 1]}>
              <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
            </Sphere>
            {/* Wheels */}
            <Cylinder args={[0.14, 0.14, 0.08]} position={[0.4, -0.28, 0.4]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder args={[0.14, 0.14, 0.08]} position={[0.4, -0.28, -0.4]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder args={[0.14, 0.14, 0.08]} position={[-0.4, -0.28, 0.4]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder args={[0.14, 0.14, 0.08]} position={[-0.4, -0.28, -0.4]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#333" />
            </Cylinder>
          </group>
        );
      case 'mclaren':
        return (
          <group ref={meshRef}>
            {/* Car Body - McLaren aerodynamic */}
            <Box args={[1.9, 0.3, 0.75]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </Box>
            {/* Aerodynamic front */}
            <Box args={[0.2, 0.1, 0.9]} position={[0.95, -0.1, 0]}>
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </Box>
            {/* Active rear wing */}
            <Box args={[0.4, 0.08, 0.8]} position={[-0.8, 0.5, 0]} rotation={[0, 0, -0.1]}>
              <meshStandardMaterial color="#ff6600" metalness={0.8} roughness={0.2} />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.17, 0.17, 0.1]} position={[0.6, -0.25, 0.42]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#111" />
            </Cylinder>
            <Cylinder args={[0.17, 0.17, 0.1]} position={[0.6, -0.25, -0.42]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#111" />
            </Cylinder>
            <Cylinder args={[0.17, 0.17, 0.1]} position={[-0.6, -0.25, 0.42]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#111" />
            </Cylinder>
            <Cylinder args={[0.17, 0.17, 0.1]} position={[-0.6, -0.25, -0.42]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#111" />
            </Cylinder>
          </group>
        );
      default:
        return (
          <group ref={meshRef}>
            {/* Generic sports car */}
            <Box args={[1.6, 0.4, 0.7]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
            </Box>
            <Cylinder args={[0.12, 0.12, 0.08]} position={[0.4, -0.3, 0.35]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#222" />
            </Cylinder>
            <Cylinder args={[0.12, 0.12, 0.08]} position={[0.4, -0.3, -0.35]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#222" />
            </Cylinder>
            <Cylinder args={[0.12, 0.12, 0.08]} position={[-0.4, -0.3, 0.35]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#222" />
            </Cylinder>
            <Cylinder args={[0.12, 0.12, 0.08]} position={[-0.4, -0.3, -0.35]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#222" />
            </Cylinder>
          </group>
        );
    }
  };

  return getCarGeometry();
}

export const Car3DModel: React.FC<Car3DModelProps> = ({ 
  brand, 
  size = 80, 
  color = '#ff6b6b' 
}) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [2, 1, 2], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, 5]} intensity={0.3} />
        <pointLight position={[2, 2, 2]} intensity={0.5} color="#ffffff" />
        
        <CarMesh brand={brand} color={color} />
      </Canvas>
    </div>
  );
};

export default Car3DModel;