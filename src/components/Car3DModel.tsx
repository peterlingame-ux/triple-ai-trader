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
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  const getCarGeometry = () => {
    switch (brand.toLowerCase()) {
      case 'ferrari':
        return (
          <group ref={meshRef}>
            {/* Main Body - Ferrari sleek design */}
            <Box args={[2.2, 0.35, 0.9]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </Box>
            {/* Front nose */}
            <Box args={[0.4, 0.25, 0.7]} position={[1.1, -0.05, 0]}>
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
            </Box>
            {/* Cockpit */}
            <Box args={[0.8, 0.3, 0.6]} position={[-0.2, 0.3, 0]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} transparent opacity={0.8} />
            </Box>
            {/* Rear spoiler */}
            <Box args={[0.3, 0.08, 1.0]} position={[-0.9, 0.4, 0]}>
              <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.2} />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.18, 0.18, 0.12]} position={[0.6, -0.25, 0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#111111" />
            </Cylinder>
            <Cylinder args={[0.18, 0.18, 0.12]} position={[0.6, -0.25, -0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#111111" />
            </Cylinder>
            <Cylinder args={[0.18, 0.18, 0.12]} position={[-0.6, -0.25, 0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#111111" />
            </Cylinder>
            <Cylinder args={[0.18, 0.18, 0.12]} position={[-0.6, -0.25, -0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#111111" />
            </Cylinder>
            {/* Headlights */}
            <Sphere args={[0.08]} position={[1.0, 0.05, 0.35]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
            </Sphere>
            <Sphere args={[0.08]} position={[1.0, 0.05, -0.35]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
            </Sphere>
          </group>
        );
      case 'lamborghini':
        return (
          <group ref={meshRef}>
            {/* Main Body - Lamborghini angular design */}
            <Box args={[2.0, 0.3, 0.95]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} />
            </Box>
            {/* Angular front */}
            <Box args={[0.5, 0.2, 0.6]} position={[1.0, 0, 0]} rotation={[0, 0, 0.3]}>
              <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} />
            </Box>
            {/* Aggressive rear wing */}
            <Box args={[0.4, 0.06, 1.1]} position={[-0.8, 0.45, 0]} rotation={[0, 0, -0.1]}>
              <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.19, 0.19, 0.14]} position={[0.6, -0.22, 0.55]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#0a0a0a" />
            </Cylinder>
            <Cylinder args={[0.19, 0.19, 0.14]} position={[0.6, -0.22, -0.55]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#0a0a0a" />
            </Cylinder>
            <Cylinder args={[0.19, 0.19, 0.14]} position={[-0.6, -0.22, 0.55]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#0a0a0a" />
            </Cylinder>
            <Cylinder args={[0.19, 0.19, 0.14]} position={[-0.6, -0.22, -0.55]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#0a0a0a" />
            </Cylinder>
          </group>
        );
      case 'porsche':
        return (
          <group ref={meshRef}>
            {/* Main Body - Porsche classic curves */}
            <Sphere args={[1.0, 32, 16]} scale={[2.0, 0.35, 0.85]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
            </Sphere>
            {/* Front curve - 911 style */}
            <Sphere args={[0.35, 16, 8]} position={[0.8, 0, 0]} scale={[1.5, 0.7, 1]}>
              <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
            </Sphere>
            {/* Wheels */}
            <Cylinder args={[0.16, 0.16, 0.1]} position={[0.5, -0.25, 0.42]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
            <Cylinder args={[0.16, 0.16, 0.1]} position={[0.5, -0.25, -0.42]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
            <Cylinder args={[0.16, 0.16, 0.1]} position={[-0.5, -0.25, 0.42]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
            <Cylinder args={[0.16, 0.16, 0.1]} position={[-0.5, -0.25, -0.42]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
          </group>
        );
      case 'mclaren':
        return (
          <group ref={meshRef}>
            {/* Main Body - McLaren aerodynamic */}
            <Box args={[2.3, 0.28, 0.82]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} />
            </Box>
            {/* Active rear wing */}
            <Box args={[0.5, 0.08, 0.9]} position={[-0.9, 0.55, 0]} rotation={[0, 0, -0.08]}>
              <meshStandardMaterial color="#ff6600" metalness={0.85} roughness={0.15} />
            </Box>
            {/* Wheels */}
            <Cylinder args={[0.2, 0.2, 0.12]} position={[0.7, -0.2, 0.48]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#0a0a0a" />
            </Cylinder>
            <Cylinder args={[0.2, 0.2, 0.12]} position={[0.7, -0.2, -0.48]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#0a0a0a" />
            </Cylinder>
            <Cylinder args={[0.2, 0.2, 0.12]} position={[-0.7, -0.2, 0.48]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#0a0a0a" />
            </Cylinder>
            <Cylinder args={[0.2, 0.2, 0.12]} position={[-0.7, -0.2, -0.48]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#0a0a0a" />
            </Cylinder>
          </group>
        );
      case 'bugatti':
        return (
          <group ref={meshRef}>
            {/* Main Body - Bugatti luxury curves */}
            <Box args={[2.1, 0.4, 0.95]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} />
            </Box>
            {/* Luxury cockpit */}
            <Sphere args={[0.45, 16, 8]} position={[0, 0.3, 0]} scale={[1.5, 0.7, 0.8]}>
              <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.7} transparent opacity={0.8} />
            </Sphere>
            {/* Wheels */}
            <Cylinder args={[0.17, 0.17, 0.11]} position={[0.6, -0.3, 0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Cylinder>
            <Cylinder args={[0.17, 0.17, 0.11]} position={[0.6, -0.3, -0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Cylinder>
            <Cylinder args={[0.17, 0.17, 0.11]} position={[-0.6, -0.3, 0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Cylinder>
            <Cylinder args={[0.17, 0.17, 0.11]} position={[-0.6, -0.3, -0.5]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Cylinder>
          </group>
        );
      case 'aston_martin':
        return (
          <group ref={meshRef}>
            {/* Main Body - Aston Martin elegant design */}
            <Box args={[2.0, 0.32, 0.88]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.85} roughness={0.12} />
            </Box>
            {/* Elegant cockpit */}
            <Sphere args={[0.4, 16, 8]} position={[0, 0.28, 0]} scale={[1.3, 0.75, 0.85]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} transparent opacity={0.75} />
            </Sphere>
            {/* Wheels */}
            <Cylinder args={[0.16, 0.16, 0.1]} position={[0.5, -0.27, 0.45]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
            <Cylinder args={[0.16, 0.16, 0.1]} position={[0.5, -0.27, -0.45]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
            <Cylinder args={[0.16, 0.16, 0.1]} position={[-0.5, -0.27, 0.45]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
            <Cylinder args={[0.16, 0.16, 0.1]} position={[-0.5, -0.27, -0.45]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2a2a2a" />
            </Cylinder>
          </group>
        );
      default:
        return (
          <group ref={meshRef}>
            <Box args={[1.8, 0.35, 0.75]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
            </Box>
            <Cylinder args={[0.14, 0.14, 0.08]} position={[0.5, -0.3, 0.4]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#222" />
            </Cylinder>
            <Cylinder args={[0.14, 0.14, 0.08]} position={[0.5, -0.3, -0.4]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#222" />
            </Cylinder>
            <Cylinder args={[0.14, 0.14, 0.08]} position={[-0.5, -0.3, 0.4]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#222" />
            </Cylinder>
            <Cylinder args={[0.14, 0.14, 0.08]} position={[-0.5, -0.3, -0.4]} rotation={[0, 0, Math.PI / 2]}>
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